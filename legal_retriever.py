"""
Legal Retriever Module — ULTIMATE v6.0
=====================================
Merged: Production v5.0 + Conversation Continuity Enhanced
Architecture: Harvey AI + CoCounsel + Industry Best Practices

Features:
- Smart query classification (legal vs casual, 8 categories)
- Follow-up detection with topic memory & entity tracking
- Query enhancement for continuity ("explain more" → knows context)
- Relevance scoring with threshold filtering
- Citation verification and hallucination guardrails
- 4-factor weighted confidence scoring (0-100)
- Structured JSON output with metadata
- Response validation and cleaning
- Comprehensive logging with response IDs
- Graceful error recovery
- Streaming support
- Direct LLM query fallback
"""

import os
import logging
import re
import hashlib
from typing import List, Dict, Optional, Callable, Any, Tuple, Union
from datetime import datetime
from dataclasses import dataclass, field

from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain_groq import ChatGroq

import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import (
    CHROMA_COLLECTION_NAME, CHROMA_PERSIST_DIRECTORY,
    EMBEDDING_MODEL, EMBEDDING_MODEL_MULTILINGUAL,
    RAG_TOP_K, RAG_SIMILARITY_THRESHOLD,
    CHUNK_SIZE, CHUNK_OVERLAP, MAJOR_LAWS
)

logger = logging.getLogger(__name__)


# =============================================================================
# DATA CLASSES
# =============================================================================

@dataclass
class QueryClassification:
    """Classification result for a user query"""
    is_legal: bool
    confidence: float
    category: str  # criminal, civil, family, property, constitutional, business, procedural, general, casual
    detected_keywords: List[str]


@dataclass
class SourceCitation:
    """Verified source citation with metadata"""
    title: str
    source: str
    category: str
    year: str
    section: Optional[str] = None
    relevance_score: float = 0.0


@dataclass
class AIResponse:
    """Structured AI response output"""
    response: str
    sources: List[SourceCitation]
    confidence: float
    is_legal_query: bool
    query_category: str
    retrieved_count: int
    used_context: bool
    disclaimer: str
    response_id: str
    is_follow_up: bool = False
    topic: str = ""
    follow_up_reason: str = ""


# =============================================================================
# MAIN CLASS
# =============================================================================

class LegalRetriever:
    """
    Ultimate legal document retriever and generator.
    Merged architecture: Production safeguards + Conversation continuity.
    """

    # -------------------------------------------------------------------------
    # TAXONOMIES
    # -------------------------------------------------------------------------
    LEGAL_KEYWORDS = {
        'criminal': [
            'murder', 'theft', 'robbery', 'assault', 'fraud', 'rape', 'kidnapping',
            'bribery', 'corruption', 'terrorism', 'drug', 'trafficking', 'extortion',
            'forgery', 'perjury', 'contempt', 'sedition', 'treason', 'riot',
            'criminal', 'crime', 'offence', 'offense', 'penalty', 'punishment',
            'imprisonment', 'jail', 'prison', 'execution', 'death penalty',
            'bail', 'arrest', 'warrant', 'fir', 'police', 'investigation',
            'witness', 'evidence', 'prosecution', 'defense', 'accused', 'convict'
        ],
        'civil': [
            'contract', 'agreement', 'breach', 'damages', 'compensation', 'tort',
            'negligence', 'nuisance', 'trespass', 'defamation', 'libel', 'slander',
            'injunction', 'specific performance', 'restitution', 'lien',
            'civil', 'suit', 'plaintiff', 'defendant', 'petitioner', 'respondent'
        ],
        'family': [
            'marriage', 'divorce', 'talaq', 'khula', 'iddat', 'mehr', 'dower',
            'dowry', 'custody', 'guardianship', 'adoption', 'maintenance', 'alimony',
            'inheritance', 'succession', 'will', 'testament', 'wapas', 'hiba',
            'family', 'matrimonial', 'domestic', 'violence', 'child'
        ],
        'property': [
            'property', 'land', 'estate', 'tenancy', 'lease', 'mortgage',
            'eviction', 'ejectment', 'partition', 'title', 'deed', 'registration',
            'transfer', 'sale', 'purchase', 'rent', 'landlord', 'tenant',
            'easement', 'adverse possession', 'zamindar', 'mutation'
        ],
        'constitutional': [
            'constitution', 'fundamental rights', 'human rights', 'citizenship',
            'election', 'parliament', 'assembly', 'judiciary', 'executive',
            'amendment', 'ordinance', 'petition', 'writ', 'habeas corpus',
            'mandamus', 'certiorari', 'prohibition', 'quo warranto'
        ],
        'business': [
            'company', 'corporation', 'partnership', 'llp', 'securities', 'stock',
            'banking', 'insurance', 'tax', 'customs', 'excise', 'gst', 'income tax',
            'sales tax', 'corporate', 'commercial', 'trade', 'import', 'export',
            'intellectual property', 'patent', 'trademark', 'copyright', 'arbitration'
        ],
        'procedural': [
            'procedure', 'evidence', 'civil procedure', 'criminal procedure',
            'limitation', 'jurisdiction', 'venue', 'forum', 'appeal', 'revision',
            'review', 'reference', 'execution', 'commission', 'summons'
        ],
        'legal_terms': [
            'law', 'legal', 'act', 'statute', 'ordinance', 'bill', 'section',
            'article', 'clause', 'provision', 'code', 'rule', 'regulation',
            'notification', 'gazette', 'schedule', 'amendment', 'repeal',
            'court', 'tribunal', 'judge', 'magistrate', 'justice', 'bench',
            'lawyer', 'advocate', 'attorney', 'counsel', 'pleader', 'solicitor',
            'litigation', 'proceeding', 'hearing', 'trial', 'argument', 'judgment',
            'order', 'decree', 'verdict', 'sentence', 'award', 'ruling'
        ]
    }

    CASUAL_KEYWORDS = [
        'hello', 'hi', 'hey', 'how are you', 'what is your name',
        'who are you', 'good morning', 'good evening', 'thanks', 'thank you',
        'bye', 'goodbye', 'ok', 'okay', 'nice', 'great', 'awesome',
        'what can you do', 'help me', 'tell me about yourself', 'introduce',
        'your name', 'yourself', 'capabilities', 'features', 'functions',
        'weather', 'time', 'date', 'joke', 'funny', 'story', 'news'
    ]

    FOLLOW_UP_KEYWORDS = [
        'explain', 'clarify', 'elaborate', 'tell me more', 'what about',
        'how about', 'and', 'but', 'so', 'then', 'why', 'what if',
        'can you', 'could you', 'would you', 'please explain',
        'more', 'detail', 'example', 'instance', 'like what',
        'meaning', 'simplify', 'simple', 'easier words',
        'continue', 'go on', 'further', 'proceed',
        'مزید', 'وضاحت', 'سمجھائیں', 'اور', 'لیکن', 'تو',
        'کیوں', 'مثال', 'اسی', 'اس', 'آگے', 'تفصیل'
    ]

    VAGUE_PRONOUNS = [
        'it', 'that', 'this', 'he', 'she', 'they', 'them',
        'his', 'her', 'their', 'such', 'same', 'the', 'those'
    ]

    # -------------------------------------------------------------------------
    # INITIALIZATION
    # -------------------------------------------------------------------------
    def __init__(self, use_multilingual: bool = True):
        self.embedding_model_name = EMBEDDING_MODEL_MULTILINGUAL if use_multilingual else EMBEDDING_MODEL
        self.collection_name = CHROMA_COLLECTION_NAME
        self.persist_directory = CHROMA_PERSIST_DIRECTORY

        logger.info(f"Initializing Ultimate Legal Retriever | Embeddings: {self.embedding_model_name}")

        # Embeddings
        try:
            self.embeddings = HuggingFaceEmbeddings(
                model_name=self.embedding_model_name,
                model_kwargs={'device': 'cpu'},
                encode_kwargs={'normalize_embeddings': True}
            )
            logger.info("Embeddings initialized")
        except Exception as e:
            logger.error(f"Embeddings init failed: {e}")
            raise

        # Vector Store
        try:
            self.vector_store = Chroma(
                collection_name=self.collection_name,
                embedding_function=self.embeddings,
                persist_directory=self.persist_directory
            )
            logger.info(f"Vector store ready: {self.persist_directory}")
        except Exception as e:
            logger.warning(f"Vector store load failed: {e}. Creating new.")
            self.vector_store = Chroma(
                collection_name=self.collection_name,
                embedding_function=self.embeddings,
                persist_directory=self.persist_directory
            )

        # LLM — NOTE: In production, load API key from environment variable
        try:
            GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
            self.llm = ChatGroq(
                model="openai/gpt-oss-20b",
                api_key=GROQ_API_KEY,
                temperature=0.2,
                max_tokens=1024
            )
            logger.info("LLM initialized with Groq")
        except Exception as e:
            logger.error(f"LLM init failed: {e}")
            self.llm = None

        # Text Splitter
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHUNK_SIZE,
            chunk_overlap=CHUNK_OVERLAP,
            separators=["\n\n", "\n", ". ", " ", ""]
        )

        # Conversation & Entity Memory
        self.conversation_history: Dict[str, List[Dict]] = {}
        self.session_entities: Dict[str, Dict] = {}
        self._response_cache: Dict[str, AIResponse] = {}

        logger.info("Ultimate Legal Retriever v6.0 initialized")

    # -------------------------------------------------------------------------
    # QUERY CLASSIFICATION (Production-grade)
    # -------------------------------------------------------------------------
    def _classify_query(self, query: str) -> QueryClassification:
        """
        Determine if query is legal and which category.
        Fast path for casual keywords first.
        """
        query_lower = query.lower().strip()

        # Fast path: casual keywords
        for casual in self.CASUAL_KEYWORDS:
            if casual in query_lower:
                return QueryClassification(
                    is_legal=False, confidence=0.95, category='casual',
                    detected_keywords=[casual]
                )

        # Legal keyword scan
        detected_keywords = []
        detected_categories = []
       
        # Roman Urdu legal keywords
        roman_urdu_legal = [
            "chori", "chor", "saza", "jurm", "qanoon", "kanun",
            "qaid", "jail", "giraftar", "giriftar", "police",
            "fir", "muqadma", "adalat", "court", "wakeel",
            "vakil", "saboot", "gawahi", "mulzim", "ilzam",
            "zamanat", "jurmana", "qatl", "daka", "dakaiti",
            "fraud", "dhoka", "maar peet", "talaq", "khula",
            "mehr", "jaidad", "zameen", "kiraya", "warasat",
            "hissa", "haq", "qanooni", "qanooni tor"
        ]

        for keyword in roman_urdu_legal:
            if keyword in query_lower:
                detected_keywords.append(keyword)
                if "criminal" not in detected_categories:
                    detected_categories.append("criminal")

        for category, keywords in self.LEGAL_KEYWORDS.items():
            for keyword in keywords:
                if keyword in query_lower:
                    detected_keywords.append(keyword)
                    if category not in detected_categories:
                        detected_categories.append(category)

        # Strong legal signals: section numbers, articles, acts, codes
        section_pat = re.search(r'section\s+(\d+[a-z]?)', query_lower)
        article_pat = re.search(r'article\s+(\d+)', query_lower)
        act_pat = re.search(r'act\s+(\d{4})', query_lower)
        ppc_pat = re.search(r'\b\d{3}\s*(ppc|crpc|cpc)\b', query_lower)

        has_ref = any([section_pat, article_pat, act_pat, ppc_pat])
        if has_ref:
            ref_str = f"Section {section_pat.group(1)}" if section_pat else "Legal reference"
            detected_keywords.append(ref_str)
            if 'procedural' not in detected_categories:
                detected_categories.append('procedural')

        if detected_keywords:
            confidence = min(0.5 + (len(detected_keywords) * 0.08), 0.99)
            primary = detected_categories[0] if detected_categories else 'general'
            return QueryClassification(
                is_legal=True, confidence=confidence, category=primary,
                detected_keywords=list(set(detected_keywords))[:10]
            )

        # Ambiguous fallback
        if 'law' in query_lower or 'legal' in query_lower:
            return QueryClassification(
                is_legal=True, confidence=0.6, category='general',
                detected_keywords=['law']
            )

        return QueryClassification(
            is_legal=False, confidence=0.7, category='casual',
            detected_keywords=[]
        )

    # -------------------------------------------------------------------------
    # FOLLOW-UP DETECTION (Conversation Continuity)
    # -------------------------------------------------------------------------
    def _is_follow_up(self, query: str, session_id: str) -> Tuple[bool, float, str]:
        """
        Detect if query is a follow-up to previous conversation.
        Returns: (is_follow_up, confidence_0_to_1, reason_string)
        """
        if not session_id or session_id not in self.conversation_history:
            return False, 0.0, "New session"

        history = self.conversation_history[session_id]
        if not history:
            return False, 0.0, "No history"

        query_lower = query.lower().strip()
        score = 0
        reasons = []

        # 1. Follow-up keywords
        for kw in self.FOLLOW_UP_KEYWORDS:
            if kw in query_lower:
                score += 20
                reasons.append(f"Keyword: '{kw}'")
                break

        # 2. Short query (1-3 words)
        word_count = len(query_lower.split())
        if 1 <= word_count <= 3:
            score += 15
            reasons.append(f"Short ({word_count} words)")

        # 3. Vague pronoun at start
        words = query_lower.split()
        if words and words[0] in self.VAGUE_PRONOUNS:
            score += 25
            reasons.append(f"Pronoun start: '{words[0]}'")

        # 4. Topic reference overlap with last topic
        last_exchange = history[-1]
        last_topic = last_exchange.get('topic', '').lower()
        if last_topic:
            query_words = [w for w in query_lower.split()[:5] if len(w) > 3]
            if any(w in last_topic for w in query_words):
                score += 15
                reasons.append("Topic reference")

        # 5. Recency (< 10 minutes)
        try:
            last_time = datetime.fromisoformat(last_exchange.get('timestamp', datetime.now().isoformat()))
            mins_ago = (datetime.now() - last_time).total_seconds() / 60
            if mins_ago < 10:
                score += 10
                reasons.append(f"Recent ({mins_ago:.0f} min)")
        except Exception:
            pass

        is_fu = score >= 30
        reason_str = "; ".join(reasons[:3]) if reasons else "New topic"
        return is_fu, min(score, 100) / 100, reason_str

    # -------------------------------------------------------------------------
    # ENTITY EXTRACTION (Topic Memory)
    # -------------------------------------------------------------------------
    def _extract_entities(self, query: str, response: str,
                          sources: Union[List[Dict], List[SourceCitation]]) -> Dict:
        """Extract legal entities from conversation for session memory."""
        combined = f"{query} {response}".lower()

        entities = {
            'laws': [],
            'sections': [],
            'concepts': [],
            'last_topic': '',
            'last_category': 'general'
        }

        # Law names from sources
        for src in sources:
            if isinstance(src, SourceCitation):
                law_name = src.title
            else:
                law_name = src.get('title', '')
            if law_name and law_name not in entities['laws']:
                entities['laws'].append(law_name)

        # Section numbers
        sections = re.findall(r'section\s+(\d+[a-z]?)', combined, re.IGNORECASE)
        entities['sections'] = list(set(sections))

        # Legal concepts (expandable list)
        concept_pat = re.compile(
            r'\b(theft|murder|bail|divorce|talaq|property|contract|fraud|assault|'
            r'kidnapping|robbery|rape|corruption|bribery|terrorism|defamation|'
            r'negligence|injunction|damages|compensation|tenancy|lease|mortgage|'
            r'inheritance|custody|maintenance|adoption|guardianship|succession|will)\b',
            re.IGNORECASE
        )
        concepts = concept_pat.findall(combined)
        entities['concepts'] = list(set(concepts))

        # Determine last topic
        if entities['laws']:
            entities['last_topic'] = entities['laws'][0]
        elif entities['sections']:
            entities['last_topic'] = f"Section {entities['sections'][0]}"
        elif entities['concepts']:
            entities['last_topic'] = entities['concepts'][0].title()
        else:
            entities['last_topic'] = query[:50]

        return entities

    # -------------------------------------------------------------------------
    # QUERY ENHANCEMENT (Context Injection)
    # -------------------------------------------------------------------------
    def _enhance_query(self, query: str, session_id: str, is_follow_up: bool) -> str:
        """Enhance Roman Urdu queries and follow-up queries for better retrieval."""

        # Roman Urdu → English legal search terms
        roman_urdu_map = {
            "chori": "theft stealing stolen property section 379 Pakistan Penal Code",
            "chor": "theft stealing stolen property section 379 Pakistan Penal Code",
            "saza": "punishment penalty",
            "jurm": "offence crime",
            "qanoon": "law",
            "kanun": "law",
            "qaid": "imprisonment",
            "jail": "imprisonment prison",
            "giraftar": "arrest",
            "giriftar": "arrest",
            "saboot": "evidence",
            "gawahi": "testimony witness",
            "mulzim": "accused",
            "ilzam": "charge accusation",
            "zamanat": "bail",
            "jurmana": "fine penalty",
            "qatl": "murder",
            "daka": "robbery",
            "dakaiti": "robbery",
            "dhoka": "fraud deception",
            "maar peet": "assault",
            "talaq": "divorce",
            "khula": "divorce",
            "mehr": "dower",
            "jaidad": "property",
            "zameen": "land property",
            "kiraya": "rent tenancy",
            "warasat": "inheritance succession",
            "hissa": "share",
            "haq": "right",
        }

        # Add English legal terms when Roman Urdu is detected
        normalized_query = query.lower()
        additions = []

        for roman_word, english_terms in roman_urdu_map.items():
            if roman_word in normalized_query:
                additions.append(english_terms)

        if additions:
            query = f"{query} {' '.join(additions)}"
            logger.info(f"Roman Urdu query expanded: {query}")

        # Legal category ? richer search terms
        category_map = {
            "property": "property law land ownership transfer registration tenancy sale mortgage inheritance",
            "family": "family law marriage divorce custody guardianship maintenance inheritance",
            "criminal": "criminal law offence crime punishment imprisonment fine arrest bail",
            "business": "business law company corporate commerce contract partnership registration",
            "constitutional": "Constitution of Pakistan constitutional law fundamental rights parliament government",
        }

        normalized_query = query.lower().strip()

        for category, legal_terms in category_map.items():
            if normalized_query == category or normalized_query == f"tell me about {category}":
                query = f"{query} {legal_terms}"
                logger.info(f"Category query expanded: {query}")
                break

        # Existing follow-up context logic
        if not is_follow_up or not session_id or session_id not in self.session_entities:
            return query

        entities = self.session_entities[session_id]
        parts = []

        last_topic = entities.get('last_topic', '')
        if last_topic:
            parts.append(f"Topic: {last_topic}")

        laws = entities.get('laws', [])
        if laws:
            parts.append(f"Laws: {', '.join(laws[:2])}")

        sections = entities.get('sections', [])
        if sections:
            parts.append(
                f"Sections: {', '.join([f'Section {s}' for s in sections[:3]])}"
            )

        if parts:
            enhanced = f"{' | '.join(parts)}. Follow-up: {query}"
            logger.info(f"Enhanced query: {enhanced[:150]}...")
            return enhanced

        return query
    # -------------------------------------------------------------------------
    # MAIN QUERY ORCHESTRATOR
    # -------------------------------------------------------------------------
    def query(self, query: str, original_query: str = None, language: str = 'en',
              session_id: str = None, use_history: bool = True) -> Dict:
        """
        Ultimate query processing pipeline.
        Merges production safeguards with conversation continuity.
        """
        if original_query is None:
            original_query = query

        response_id = hashlib.md5(
            f"{query}{datetime.now().isoformat()}".encode()
        ).hexdigest()[:12]

        if self.llm is None:
            return self._error_response("LLM not initialized", response_id)

        # Step 1: Classify
        classification = self._classify_query(original_query)

        # Step 2: Detect follow-up
        is_follow_up, follow_conf, follow_reason = self._is_follow_up(original_query, session_id)

        # Step 3: CRITICAL — override classification if follow-up to legal topic
        if is_follow_up and session_id and session_id in self.session_entities:
            last_entities = self.session_entities[session_id]
            if last_entities.get('laws') or last_entities.get('sections') or last_entities.get('concepts'):
                classification.is_legal = True
                classification.category = last_entities.get('last_category', classification.category)
                classification.confidence = max(classification.confidence, follow_conf)
                logger.info(f"[{response_id}] Follow-up to legal topic forced. Category: {classification.category}")

        logger.info(
            f"[{response_id}] Query classified: {classification.category} "
            f"(legal={classification.is_legal}, conf={classification.confidence:.2f}, follow_up={is_follow_up})"
        )

        # Step 4: Casual fast path
        if not classification.is_legal:
            return self._handle_casual_query(
                original_query, language, classification, response_id, session_id
            )

        # Step 5: Enhance query for follow-up retrieval
        retrieval_query = self._enhance_query(query, session_id, is_follow_up)

        # Step 6: Retrieve with relevance scoring
        retrieved_docs_with_scores = self.retrieve_with_scores(retrieval_query)

        # Step 7: Filter by threshold
        filtered_docs = [
            (doc, score) for doc, score in retrieved_docs_with_scores
            if score <= RAG_SIMILARITY_THRESHOLD
        ]
        if not filtered_docs:
            logger.warning(f"[{response_id}] No relevant documents found")
            return self._handle_no_documents(
                original_query, language, classification, response_id, session_id
            )

        documents = [doc for doc, _ in filtered_docs]
        scores = [score for _, score in filtered_docs]

        # Step 8: Build context & history
        context = self._format_context(documents)
        history = self._format_conversation_history(session_id) if session_id else ""

        # Step 9: Generate with production prompt + follow-up context
        try:
            prompt = self._create_production_prompt(
                query=query,
                original_query=original_query,
                context=context,
                history=history,
                language=language,
                category=classification.category,
                is_follow_up=is_follow_up,
                session_id=session_id
            )

            raw_response = self.llm.invoke(prompt)
            raw_text = self._extract_text(raw_response)
            print("\n===== RAW LLM RESPONSE =====\n", raw_text, "\n===== END RAW RESPONSE =====\n")

            # Step 10: Post-process & validate
            cleaned_response = self._validate_and_clean(raw_text, documents, original_query)

            # Step 11: Extract verified sources
            sources = self._extract_verified_sources(documents, scores)

            # Step 12: Calculate confidence
            confidence = self._calculate_production_confidence(documents, scores, classification)

            # Step 13: Extract entities & update session memory
            sources_dict = [self._source_to_dict(s) for s in sources]
            entities = self._extract_entities(original_query, cleaned_response, sources_dict)
            entities['last_category'] = classification.category

            if session_id:
                self._add_to_history(
                    session_id, original_query, cleaned_response,
                    entities=entities, classification=classification
                )
                self.session_entities[session_id] = entities

            return AIResponse(
                response=cleaned_response,
                sources=sources,
                confidence=confidence,
                is_legal_query=True,
                query_category=classification.category,
                retrieved_count=len(documents),
                used_context=True,
                disclaimer=self._get_disclaimer(language),
                response_id=response_id,
                is_follow_up=is_follow_up,
                topic=entities.get('last_topic', ''),
                follow_up_reason=follow_reason
            ).__dict__

        except Exception as e:
            logger.error(f"[{response_id}] Generation error: {e}")
            return self._error_response(str(e), response_id)

    # -------------------------------------------------------------------------
    # CASUAL QUERY HANDLER
    # -------------------------------------------------------------------------
    def _handle_casual_query(self, query: str, language: str,
                             classification: QueryClassification,
                             response_id: str, session_id: str = None) -> Dict:
        """Handle non-legal queries professionally."""
        system = self._get_casual_system_prompt(language)

        prompt = f"""{system}

User Query: {query}

Instructions:
- This is a casual/general question, NOT a legal query
- Answer naturally and conversationally
- Keep response under 100 words
- If asked about identity: "I am PakLegal AI, a Pakistani legal assistant with access to 900+ laws"
- Offer to help with legal questions

Response:"""

        try:
            raw = self.llm.invoke(prompt)
            response = self._extract_text(raw).strip()

            if session_id:
                self._add_to_history(session_id, query, response)

            return AIResponse(
                response=response,
                sources=[],
                confidence=0.95,
                is_legal_query=False,
                query_category='casual',
                retrieved_count=0,
                used_context=False,
                disclaimer=self._get_disclaimer(language),
                response_id=response_id
            ).__dict__

        except Exception as e:
            return self._error_response(str(e), response_id)

    # -------------------------------------------------------------------------
    # NO DOCUMENTS HANDLER
    # -------------------------------------------------------------------------
    def _handle_no_documents(self, query: str, language: str,
                               classification: QueryClassification,
                               response_id: str, session_id: str = None) -> Dict:
        """Graceful fallback when no relevant documents are retrieved."""
        if language == 'en':
            fallback = (
                f"I don't have specific legal information about '{query}' in my database. "
                f"However, I can try to answer based on my general knowledge of Pakistani law.\n\n"
                f"For accurate and up-to-date legal advice, please consult a qualified Pakistani lawyer."
            )
        else:
            fallback = (
                f"میرے ڈیٹا بیس میں '{query}' کے بارے میں مخصوص قانونی معلومات نہیں ہیں۔ "
                f"براہ کرم درست مشورے کے لیے ایک اہل وکیل سے رجوع کریں۔"
            )

        # Attempt direct knowledge
        try:
            direct_prompt = f"""You are a Pakistani legal expert. The user asked: "{query}"

I don't have specific documents about this in my database. Based on your general knowledge of Pakistani law, provide a brief, helpful response. Be clear that this is general knowledge, not verified legal advice.

Response:"""
            raw = self.llm.invoke(direct_prompt)
            direct_resp = self._extract_text(raw).strip()
            fallback = direct_resp + "\n\n" + self._get_disclaimer(language)
        except Exception:
            pass

        if session_id:
            self._add_to_history(session_id, query, fallback)

        return AIResponse(
            response=fallback,
            sources=[],
            confidence=0.3,
            is_legal_query=True,
            query_category=classification.category,
            retrieved_count=0,
            used_context=False,
            disclaimer=self._get_disclaimer(language),
            response_id=response_id
        ).__dict__

    # -------------------------------------------------------------------------
    # PRODUCTION PROMPT + FOLLOW-UP CONTEXT
    # -------------------------------------------------------------------------
    def _create_production_prompt(self, query: str, original_query: str,
                                   context: str, history: str, language: str,
                                   category: str, is_follow_up: bool = False,
                                   session_id: str = None) -> str:
        """Production-grade prompt with merged guardrails and continuity support."""

        if language == 'en':
             system = f"""You are PakLegal AI, a professional Pakistani Legal Assistant.
You specialize in {category} law and must answer strictly from the retrieved legal documents.

🚨 ABSOLUTE EVIDENCE RULES:
1. Use ONLY the information explicitly written in the RELEVANT LEGAL DOCUMENTS.
2. Do NOT use general legal knowledge, memory, assumptions, or outside information.
3. NEVER invent or guess any law, section number, punishment, fine, imprisonment term, exception, condition, threshold, case, or penalty.
4. Every legal claim must be directly supported by the retrieved document text.
5. If a claim is not explicitly supported by the retrieved documents, OMIT IT.
6. NEVER introduce another section just because it is related to the user's question.
7. NEVER provide alternative punishments unless the retrieved document explicitly states them and they are necessary to answer the exact question.
8. If the user asks a simple question, give a simple and focused answer.
9. If the retrieved documents contain the exact section relevant to the question, use that section as the PRIMARY and PREFERRED source.
10. Do NOT expand the answer beyond what is necessary to answer the user's exact question.
11. NEVER mention information that is not present in the retrieved legal documents.
12. If the available documents are insufficient, say so instead of guessing.

🚨 SECTION CONTROL:
- Only cite section numbers that actually appear in the retrieved legal documents.
- If Section 379 is retrieved for a theft-punishment question, answer ONLY from the text of Section 379.
- Do NOT add Section 380, Section 390, Section 392, or any other section unless the user's question specifically asks about that section or the retrieved evidence makes it necessary.
- Do NOT discuss robbery, dwelling-house theft, vehicle theft, bank theft, firearms, or other categories unless explicitly asked by the user.
- Do NOT create a table of different theft categories for a simple theft question.

🚨 PUNISHMENT CONTROL:
- Copy the punishment meaning ONLY from the relevant retrieved section.
- Do NOT change, extend, reinterpret, or supplement the punishment.
- Do NOT invent minimum or maximum punishments.
- Do NOT add years, fines, conditions, or exceptions that are not explicitly present in the relevant retrieved section.

RESPONSE RULES:
1. Answer the exact question first.
2. Keep the answer concise unless the user asks for more detail.
3. Mention the actual law name and relevant section.
4. Do not say "Document 1", "Document 2", etc.
5. Do not cite unsupported sections.
6. Do not include unrelated legal information.
7. Always include the educational disclaimer.

For a question such as "What is the punishment for theft?":
- Identify the retrieved section specifically dealing with punishment for theft.
- If the retrieved documents contain Section 379, use Section 379 as the primary authority.
- State only the punishment explicitly written under Section 379.
- Do NOT discuss Section 380 or other theft-related sections unless the user asks about them.

If there is any conflict between general knowledge and the retrieved documents, ALWAYS follow the retrieved documents.

You are not allowed to fill missing information from your own knowledge.

"""
            
        else:
             system = f"""آپ پاک لیگل AI ہیں۔ آپ {category} قانون کے ماہر ہیں اور آپ کے پاس تصدیق شدہ پاکستانی قانونی دستاویزات موجود ہیں۔

🚨 اہم اصول:
1. جواب صرف فراہم کردہ قانونی دستاویزات کی بنیاد پر دیں۔
2. صرف وہی قانونی معلومات دیں جو متعلقہ retrieved documents میں واضح طور پر موجود ہوں۔
3. کوئی قانون، دفعہ، سزا، جرمانہ، قید کی مدت، شرط یا exception اپنی طرف سے نہ بنائیں۔
4. اگر کسی دعوے کی دستاویز سے تصدیق نہیں ہوتی تو اسے جواب میں شامل نہ کریں۔
5. اگر صارف کسی مخصوص دفعہ کے بارے میں پوچھے تو اسی دفعہ کو ترجیح دیں۔
6. غیر متعلقہ دفعات یا متبادل سزائیں خود سے شامل نہ کریں۔
7. صارف کے سوال کا سیدھا اور مختصر جواب دیں۔
8. اصل قانون کا نام اور section number واضح طور پر لکھیں۔
9. اگر available documents میں مکمل معلومات موجود نہ ہوں تو صاف بتائیں کہ دستیاب دستاویزات مزید تفصیل فراہم نہیں کرتیں۔
10. جواب اردو یا Roman Urdu میں دیں، جیسا صارف نے سوال کیا ہو۔
11. صرف فراہم کردہ قانونی evidence استعمال کریں، general legal knowledge سے جواب مکمل نہ کریں۔
12. اگر سوال چوری کی سزا کے بارے میں ہو اور متعلقہ دفعہ Section 379 ہو، تو صرف اسی دفعہ کی supported سزا بتائیں۔ دوسری اقسام کی چوری یا دوسری سزائیں خود سے شامل نہ کریں۔

جواب کا فارمیٹ:
1. مختصر خلاصہ
2. تفصیلی جواب
3. متعلقہ قانون / دفعہ
4. آخر میں disclaimer

⚠️ قانونی معلومات صرف تعلیمی مقصد کے لیے ہیں۔ مخصوص قانونی معاملے کے لیے qualified Pakistani lawyer سے مشورہ کریں۔
"""
        # Inject follow-up continuity context
        follow_up_block = ""
        if is_follow_up and session_id and session_id in self.session_entities:
            ent = self.session_entities[session_id]
            last_topic = ent.get('last_topic', '')
            laws = ent.get('laws', [])
            sections = ent.get('sections', [])
            concepts = ent.get('concepts', [])

            if last_topic:
                follow_up_block = f"""
CONVERSATION CONTINUITY:
This is a FOLLOW-UP question. The user is asking about the SAME topic as before.
- Previous Topic: {last_topic}
- Previously Discussed Laws: {', '.join(laws[:3]) if laws else 'N/A'}
- Previously Discussed Sections: {', '.join([f'Section {s}' for s in sections[:3]]) if sections else 'N/A'}
- Previously Discussed Concepts: {', '.join(concepts[:3]) if concepts else 'N/A'}

INSTRUCTIONS FOR FOLLOW-UP:
1. Refer to your previous explanation about {last_topic}
2. Provide additional details, clarification, or examples as requested
3. Be consistent with your previous explanation
4. If they ask "explain more" — expand with simpler language
5. If they ask "example" — give a realistic Pakistani legal scenario
6. If they ask "simple words" — explain like talking to a 10-year-old
"""

        return f"""{system}

CONVERSATION HISTORY:
{history if history else 'No previous conversation.'}

{follow_up_block if is_follow_up else ''}

RELEVANT LEGAL DOCUMENTS:
{context}

USER QUERY:
{original_query}

STRUCTURED RESPONSE FORMAT:
1. Brief Summary (1-2 sentences)
2. Detailed Answer using ONLY the section directly relevant to the USER QUERY
3. Sources (list only the law/section actually used)

STRICT FINAL CHECK:
- Answer ONLY the user's exact question.
- If the question asks for the punishment for theft and Section 379 is present, use ONLY Section 379.
- Do NOT mention Section 380, 381, 382, 383, 384, 390, 392 or any other section unless the user explicitly asks about it.
- Do NOT add related offences, alternative punishments, value thresholds, robbery, or other legal information.
- Every legal statement must be supported by the relevant section in the retrieved documents.

YOUR RESPONSE:"""

    # -------------------------------------------------------------------------
    # RESPONSE VALIDATION & HALLUCINATION GUARDRAILS
    # -------------------------------------------------------------------------
    def _validate_and_clean(
        self,
        response: str,
        documents: List[Document],
        query: str = ""
    ) -> str:
        """Validate response and keep the answer focused on the relevant law."""

        cleaned = response.strip()
        query_lower = query.lower()

        # Detect simple theft-punishment questions
        is_theft_punishment = (
            any(term in query_lower for term in ["chori", "theft"]) and
            any(term in query_lower for term in ["saza", "punishment", "penalty"])
        )

        # For a simple theft-punishment question, use Section 379 directly
        # instead of allowing the LLM to introduce unrelated sections.
        if is_theft_punishment:

            section_379_text = None
            
            for doc in documents:
                content = doc.page_content

                match = re.search(
                    r'(?:Section\s+)?379\s*[:.\-]?\s*(.*?)(?=(?:Section\s+)?\d+\s*[:.\-]|\Z)',
                    content,
                    re.IGNORECASE | re.DOTALL
                )

                if match:
                    section_379_text = match.group(1).strip()
                    break
            
            print("DEBUG 379 TEXT:", repr(section_379_text))    

            if section_379_text:
                cleaned = (
                    "### Section 379 — Pakistan Penal Code, 1860\n\n"
                    + section_379_text
                    + "\n\n"
                    "⚠️ Disclaimer: This information is for educational purposes only. "
                    "Always consult a qualified Pakistani lawyer for specific legal matters."
                )

                return cleaned

        # General cleanup for other responses
        if re.search(r'\bsection\s+379\b', cleaned, re.IGNORECASE):

            lines = cleaned.split('\n')
            new_lines = []
            skip_block = False

            for line in lines:
                line_lower = line.lower().strip()

                if re.search(
                    r'\bsection\s+(380|381|382|383|384|390|392)\b',
                    line,
                    re.IGNORECASE
                ):
                    skip_block = True
                    continue

                if skip_block and re.search(
                    r'^\s*(\*\*)?(sources|disclaimer)(\*\*)?',
                    line,
                    re.IGNORECASE
                ):
                    skip_block = False

                if skip_block and 'disclaimer' in line_lower:
                    skip_block = False

                if not skip_block:
                    new_lines.append(line)

            cleaned = '\n'.join(new_lines)

            cleaned = re.sub(
                r'(?im)^.*dwelling house.*$',
                '',
                cleaned
            )

            cleaned = re.sub(r'\n{3,}', '\n\n', cleaned).strip()

            if (
                'disclaimer' not in cleaned.lower()
                and 'educational' not in cleaned.lower()
            ):
                cleaned += (
                    "\n\n⚠️ Disclaimer: This information is for educational purposes only. "
                    "Always consult a qualified Pakistani lawyer for specific legal matters."
                )

        return cleaned
    # -------------------------------------------------------------------------
    # SOURCE VERIFICATION
    # -------------------------------------------------------------------------
    def _extract_verified_sources(self, documents: List[Document],
                                   scores: List[float]) -> List[SourceCitation]:
        """Extract unique sources with relevance scores and section extraction."""
        sources = []
        seen = set()

        for doc, score in zip(documents, scores):
            source_key = doc.metadata.get('source', '')
            if not source_key or source_key in seen:
                continue
            seen.add(source_key)

            content = doc.page_content
            sec_match = re.search(r'Section\s+(\d+[A-Z]?)', content, re.IGNORECASE)
            section = sec_match.group(1) if sec_match else None

            sources.append(SourceCitation(
                title=doc.metadata.get('title', 'Unknown'),
                source=source_key,
                category=doc.metadata.get('category', 'General'),
                year=doc.metadata.get('year', 'N/A'),
                section=section,
                relevance_score=round(score, 3)
            ))

        return sources

    # -------------------------------------------------------------------------
    # CONFIDENCE SCORING (4-factor weighted)
    # -------------------------------------------------------------------------
    def _calculate_production_confidence(self, documents: List[Document],
                                          scores: List[float],
                                          classification: QueryClassification) -> float:
        """Calculate production-grade confidence score (0-100)."""
        if not documents:
            return 0.0

        # Document coverage (0-30)
        doc_score = min(len(documents) / RAG_TOP_K, 1.0) * 30

        # Similarity quality (0-40)
        # Chroma distance: lower score = better match
        avg_distance = sum(scores) / len(scores) if scores else 1.0
        similarity_quality = max(0.0, min(1.0, 1.0 - avg_distance))
        sim_score = similarity_quality * 40

        # Classification confidence (0-20)
        class_score = classification.confidence * 20

        # Document quality bonus (0-10)
        quality_score = 10 if len(documents) >= 3 else len(documents) * 3

        total = doc_score + sim_score + class_score + quality_score
        return round(min(total, 100), 1)

    # -------------------------------------------------------------------------
    # CONVERSATION HISTORY & ENTITY MANAGEMENT
    # -------------------------------------------------------------------------
    def _format_conversation_history(self, session_id: str) -> str:
        """Format last 3 exchanges with topic annotations."""
        history = self.conversation_history.get(session_id, [])
        if not history:
            return ""
        formatted = []
        for item in history[-3:]:
            topic_str = f" [Topic: {item.get('topic', 'N/A')}]" if item.get('topic') else ""
            formatted.append(f"User: {item['query']}{topic_str}")
            formatted.append(f"Assistant: {item['response'][:150]}...")
        return "\n".join(formatted)

    def _add_to_history(self, session_id: str, query: str, response: str,
                        entities: Optional[Dict] = None,
                        classification: Optional[QueryClassification] = None):
        """Store exchange with topic and category for continuity."""
        if session_id not in self.conversation_history:
            self.conversation_history[session_id] = []

        entry = {
            'query': query,
            'response': response,
            'timestamp': datetime.now().isoformat(),
            'topic': entities.get('last_topic', '') if entities else '',
            'category': classification.category if classification else 'general'
        }
        self.conversation_history[session_id].append(entry)
        self.conversation_history[session_id] = self.conversation_history[session_id][-15:]

    # -------------------------------------------------------------------------
    # UTILITY METHODS
    # -------------------------------------------------------------------------
    def _extract_text(self, response) -> str:
        if hasattr(response, 'content'):
            return response.content
        elif hasattr(response, 'text'):
            return response.text
        return str(response)

    def _format_context(self, documents: List[Document]) -> str:
        parts = []
        for i, doc in enumerate(documents, 1):
            title = doc.metadata.get('title', 'Unknown')
            parts.append(f"\n[Source {i}: {title}]\n{doc.page_content[:800]}...\n")
        return "\n".join(parts)

    def _source_to_dict(self, source: SourceCitation) -> Dict:
        return {
            'title': source.title,
            'source': source.source,
            'category': source.category,
            'year': source.year,
            'section': source.section,
            'relevance_score': source.relevance_score
        }

    def _get_casual_system_prompt(self, language: str) -> str:
        if language == 'en':
            return "You are PakLegal AI, a friendly Pakistani legal assistant. Be helpful and professional."
        return "آپ پاک لیگل AI ہیں۔ مددگار اور پیشہ ورانہ رہیں۔"

    def _get_disclaimer(self, language: str) -> str:
        if language == 'en':
            return (
                "⚠️ Disclaimer: This information is for educational purposes only and does not "
                "constitute legal advice. Always consult a qualified Pakistani lawyer for specific legal matters."
            )
        return (
            "⚠️ تنبیہ: یہ معلومات صرف تعلیمی مقاصد کے لیے ہیں۔ مخصوص قانونی معاملات کے لیے "
            "ہمیشہ ایک اہل وکیل سے مشورہ کریں۔"
        )

    def _error_response(self, error: str, response_id: str) -> Dict:
        return AIResponse(
            response=f"I apologize, but I encountered an error: {error}. Please try again or contact support.",
            sources=[],
            confidence=0.0,
            is_legal_query=False,
            query_category='error',
            retrieved_count=0,
            used_context=False,
            disclaimer=self._get_disclaimer('en'),
            response_id=response_id
        ).__dict__

    def _generate_no_context_response(self, query: str, language: str) -> str:
        """Legacy helper for no-context scenarios."""
        if language == 'en':
            return (
                f"I don't have specific legal information about '{query}' in my database. "
                f"Please consult a qualified Pakistani lawyer for accurate advice."
            )
        return f"میرے ڈیٹا بیس میں '{query}' کے بارے میں مخصوص قانونی معلومات نہیں ہیں۔"

    # -------------------------------------------------------------------------
    # DOCUMENT MANAGEMENT (Existing API preserved)
    # -------------------------------------------------------------------------
    def add_document(self, text: str, metadata: Optional[Dict] = None) -> List[str]:
        if metadata is None:
            metadata = {}
        metadata['added_at'] = datetime.now().isoformat()
        chunks = self.text_splitter.split_text(text)
        documents = [
            Document(page_content=chunk, metadata={**metadata, 'chunk_index': i})
            for i, chunk in enumerate(chunks)
        ]
        ids = self.vector_store.add_documents(documents)
        self.vector_store.persist()
        logger.info(f"Added {len(documents)} chunks")
        return ids

    def add_documents_batch(self, documents: List[Dict[str, Any]]) -> List[str]:
        all_ids = []
        for doc in documents:
            text = doc.get('text', '')
            metadata = doc.get('metadata', {})
            ids = self.add_document(text, metadata)
            all_ids.extend(ids)
        return all_ids

    def retrieve(self, query: str, top_k: int = None,
                 filter_dict: Optional[Dict] = None) -> List[Document]:
        if top_k is None:
            top_k = RAG_TOP_K
        try:
            return self.vector_store.similarity_search(query=query, k=top_k, filter=filter_dict)
        except Exception as e:
            logger.error(f"Retrieve error: {e}")
            return []
    def search_laws(self, query: str, top_k: int = None) -> List[Dict]:
        if top_k is None:
            top_k = RAG_TOP_K

        try:
            results = self.retrieve_with_scores(query, top_k)

            search_results = []

            for doc, score in results:
                if score <= RAG_SIMILARITY_THRESHOLD:
                    search_results.append({
                        "title": doc.metadata.get("title", "Unknown"),
                        "source": doc.metadata.get("source", ""),
                        "category": doc.metadata.get("category", "General"),
                        "year": doc.metadata.get("year", "N/A"),
                        "section": doc.metadata.get("section"),
                        "content": doc.page_content,
                        "relevance_score": round(score, 3)
                    })

            return search_results

        except Exception as e:
            logger.error(f"Search laws error: {e}")
            return []
  
    def list_laws(self, category=None, search=None) -> List[Dict]:
        """List all laws available in the vector database."""
        try:
            all_data = self.vector_store.get()
            documents = all_data.get('documents', [])
            metadatas = all_data.get('metadatas', [])

            laws = {}

            for i, content in enumerate(documents):
                metadata = metadatas[i] if i < len(metadatas) else {}

                title = metadata.get('title', 'Unknown')
                source = metadata.get('source', '')
                category = metadata.get('category', 'General')
                year = metadata.get('year', 'N/A')

                key = (title, source, year)

                if key not in laws:
                    laws[key] = {
                        "title": title,
                        "source": source,
                        "category": category,
                        "year": year
                    }

            return list(laws.values())

        except Exception as e:
            logger.error(f"List laws error: {e}")
            return []

    def retrieve_with_scores(self, query: str, top_k: int = None) -> List[Tuple[Document, float]]:
        if top_k is None:
            top_k = RAG_TOP_K

        try:
            # Normal vector search
            search_k = max(top_k, 10)
            results = self.vector_store.similarity_search_with_score(
                query=query,
                k=search_k
            )

            # Exact section lookup for questions like "Section 379"
            section_match = re.search(
                r'\bsection\s+(\d+[a-z]?)\b',
                query,
                re.IGNORECASE
            )

            if section_match:
                section_number = section_match.group(1)

                try:
                    all_data = self.vector_store.get()
                    exact_matches = []

                    documents = all_data.get('documents', [])
                    metadatas = all_data.get('metadatas', [])

                    for i, content in enumerate(documents):
                        if not content:
                            continue

                        pattern = rf'\bSection\s+{re.escape(section_number)}\s*:'
                        if re.search(pattern, content, re.IGNORECASE):
                            metadata = metadatas[i] if i < len(metadatas) else {}
                            exact_doc = Document(
                                page_content=content,
                                metadata=metadata or {}
                            )
                            exact_matches.append((exact_doc, 0.0))

                    # Put exact section matches first
                    if exact_matches:
                        existing_contents = {doc.page_content for doc, _ in exact_matches}
                        results = exact_matches + [
                            (doc, score)
                            for doc, score in results
                            if doc.page_content not in existing_contents
                        ]

                        logger.info(
                            f"Exact section match found: Section {section_number}"
                        )

                except Exception as e:
                    logger.warning(f"Exact section lookup failed: {e}")

            return results[:top_k]

        except Exception as e:
            logger.error(f"Score retrieve error: {e}")
            return []

    # -------------------------------------------------------------------------
    # STREAMING SUPPORT
    # -------------------------------------------------------------------------
    def query_stream(self, query: str, original_query: str = None,
                     language: str = 'en', session_id: str = None,
                     stream_callback: Callable = None) -> Dict:
        """Stream response with continuity support."""
        if original_query is None:
            original_query = query

        if self.llm is None:
            return {"response": "Error: LLM not initialized.", "sources": []}

        classification = self._classify_query(original_query)
        is_follow_up, _, _ = self._is_follow_up(original_query, session_id)

        if is_follow_up and session_id and session_id in self.session_entities:
            last_ent = self.session_entities[session_id]
            if last_ent.get('laws') or last_ent.get('sections'):
                classification.is_legal = True

        if not classification.is_legal:
            # Casual streaming not fully supported; fallback to normal
            return self.query(query, original_query, language, session_id)

        retrieval_query = self._enhance_query(query, session_id, is_follow_up)
        retrieved = self.retrieve(retrieval_query)
        context = self._format_context(retrieved)
        history = self._format_conversation_history(session_id) if session_id else ""

        prompt = self._create_production_prompt(
            query, original_query, context, history, language,
            classification.category, is_follow_up, session_id
        )

        full_response = ""
        try:
            for chunk in self.llm.stream(prompt):
                chunk_text = self._extract_text(chunk)
                full_response += chunk_text

            # Post-process and validate the complete streamed response
            cleaned_response = self._validate_and_clean(full_response, retrieved, original_query)
            if stream_callback:
                stream_callback(cleaned_response)
            sources = self._extract_sources_legacy(retrieved)
            conf = self._calculate_confidence_legacy(retrieved, query)

            if session_id:
                self._add_to_history(
                    session_id,
                    original_query,
                    cleaned_response
                )

            return {
                "response": cleaned_response,
                "sources": sources,
                "confidence": conf,
                "is_follow_up": is_follow_up
            }
        except Exception as e:
            logger.error(f"Stream error: {e}")
            return {"response": f"Error: {str(e)}", "sources": []}

    def _extract_sources_legacy(self, documents: List[Document]) -> List[Dict]:
        out = []
        seen = set()
        for doc in documents:
            source = doc.metadata.get('source', '')
            if source not in seen:
                seen.add(source)
                out.append({
                    'title': doc.metadata.get('title', 'Unknown'),
                    'source': source,
                    'category': doc.metadata.get('category', 'General')
                })
        return out

    def _calculate_confidence_legacy(self, documents: List[Document], query: str) -> float:
        if not documents:
            return 0.0
        return round(min(len(documents) / RAG_TOP_K, 1.0) * 100, 1)

    # -------------------------------------------------------------------------
    # DIRECT LLM QUERY (No RAG)
    # -------------------------------------------------------------------------
    def direct_query(self, query: str, language: str = 'en') -> Dict:
        """Direct LLM query without document retrieval."""
        if self.llm is None:
            return {"response": "Error: LLM not initialized.", "sources": []}

        system = self._get_system_prompt(language)
        full_prompt = f"{system}\n\nUser Query: {query}\n\nResponse:"

        try:
            raw = self.llm.invoke(full_prompt)
            response = self._extract_text(raw)
            return {
                "response": response,
                "sources": [],
                "confidence": 0.5,
                "note": "Direct LLM response without legal document retrieval."
            }
        except Exception as e:
            logger.error(f"Direct query error: {e}")
            return {"response": f"Error: {str(e)}", "sources": []}

    def _get_system_prompt(self, language: str) -> str:
        if language == 'en':
            return """You are a Pakistani Legal AI Assistant specializing in Pakistani laws and legal procedures.

🚨 CRITICAL LANGUAGE RULE (ENGLISH MODE):
- You MUST respond in English ONLY
- Use English words and sentences exclusively
- If legal documents contain Urdu text, TRANSLATE concepts to English
- Do NOT use Urdu script (اردو) under any circumstances
- Full professional English response required

GUIDELINES:
1. Base your answers on the provided legal documents and your knowledge of Pakistani law.
2. Cite specific sections, acts, or laws when relevant.
3. Be clear, concise, and professional.
4. If uncertain, acknowledge it and suggest consulting a qualified lawyer.
5. Add disclaimer: This information is for educational purposes only.

DISCLAIMER: This is educational information only. Always consult a qualified Pakistani lawyer for specific legal matters."""
        elif language == 'ur':
            return """You are a Pakistani Legal AI Assistant specializing in Pakistani laws and legal procedures.

🚨 CRITICAL LANGUAGE RULE (URDU MODE):
- You MUST respond in Urdu script (اردو) ONLY
- Use proper Urdu grammar and vocabulary
- Write in Arabic script (not English letters)
- Use English only for legal terms like "Section", "Act", "Code"

You are responding to a user who selected URDU language. Respond completely in Urdu script.

GUIDELINES:
1. Base your answers on the provided legal documents.
2. Cite specific sections and acts when relevant.
3. Be clear and professional.
4. Add disclaimer in Urdu: This is educational information only."""
        return ""
