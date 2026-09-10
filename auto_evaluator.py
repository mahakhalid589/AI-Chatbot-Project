"""
PakLegal AI — Production Grade Auto Evaluator v2.0
===================================================
Fixes applied:
  - Hallucination: Scans document CONTENT for section numbers (eliminates false positives)
  - Continuity: Broader term matching (concepts + laws + sections, not just exact topic)
  - Rate limits: Adaptive 8-14s delays between tests
  - Confidence calibration: Properly handles no-docs scenarios
"""

import json
import re
import os
import hashlib
import time
from typing import List, Dict, Optional, Tuple, Any
from dataclasses import dataclass, asdict
from datetime import datetime

# ============================================================
# BUILT-IN TEST DATASET — Pakistani Law (20 cases)
# ============================================================

BUILT_IN_TEST_CASES = [
    {
        "id": "crim-001",
        "question": "What is the punishment for murder under Section 302 PPC?",
        "expected_sections": ["302"],
        "expected_laws": ["Pakistan Penal Code"],
        "expected_keywords": ["death", "imprisonment", "life", "murder", "punishment"],
        "category": "criminal",
        "follow_up": "What about bail in murder cases?",
        "follow_up_expected": ["bail", "496", "court", "murder"]
    },
    {
        "id": "crim-002",
        "question": "What is the punishment for theft under Section 378 PPC?",
        "expected_sections": ["378"],
        "expected_laws": ["Pakistan Penal Code"],
        "expected_keywords": ["theft", "imprisonment", "fine", "property"],
        "category": "criminal",
        "follow_up": "explain more",
        "follow_up_expected": ["theft", "property", "dishonest", "intention"]
    },
    {
        "id": "crim-003",
        "question": "What is the difference between robbery and dacoity?",
        "expected_sections": ["390", "391"],
        "expected_laws": ["Pakistan Penal Code"],
        "expected_keywords": ["robbery", "dacoity", "five", "persons", "death"],
        "category": "criminal",
        "follow_up": "what about punishment for dacoity",
        "follow_up_expected": ["dacoity", "death", "imprisonment", "397"]
    },
    {
        "id": "crim-004",
        "question": "What is Section 354 PPC about?",
        "expected_sections": ["354"],
        "expected_laws": ["Pakistan Penal Code"],
        "expected_keywords": ["assault", "criminal force", "woman", "modesty"],
        "category": "criminal",
        "follow_up": "what is the punishment",
        "follow_up_expected": ["punishment", "death", "imprisonment", "life"]
    },
    {
        "id": "crim-005",
        "question": "How is FIR registered under CrPC?",
        "expected_sections": ["154"],
        "expected_laws": ["Code of Criminal Procedure"],
        "expected_keywords": ["FIR", "police", "cognizable", "information", "register"],
        "category": "criminal",
        "follow_up": "what if police refuse to register",
        "follow_up_expected": ["magistrate", "complaint", "154", "cognizable"]
    },
    {
        "id": "fam-001",
        "question": "What is the procedure for khula in Pakistan?",
        "expected_sections": [],
        "expected_laws": ["Muslim Family Laws Ordinance"],
        "expected_keywords": ["khula", "wife", "court", "divorce", "decree"],
        "category": "family",
        "follow_up": "how long does khula take",
        "follow_up_expected": ["90", "days", "iddat", "decree"]
    },
    {
        "id": "fam-002",
        "question": "What is dower or mehr in Islamic marriage?",
        "expected_sections": [],
        "expected_laws": ["Muslim Family Laws Ordinance"],
        "expected_keywords": ["mehr", "dower", "wife", "marriage", "prompt", "deferred"],
        "category": "family",
        "follow_up": "can wife refuse to pay back mehr in khula",
        "follow_up_expected": ["mehr", "khula", "wife", "return", "forgo"]
    },
    {
        "id": "fam-003",
        "question": "Who gets child custody after divorce in Pakistan?",
        "expected_sections": [],
        "expected_laws": ["Guardian and Wards Act", "Muslim Family Laws Ordinance"],
        "expected_keywords": ["custody", "mother", "welfare", "child", "hizanat"],
        "category": "family",
        "follow_up": "until what age mother has custody",
        "follow_up_expected": ["mother", "age", "seven", "puberty", "hizanat"]
    },
    {
        "id": "fam-004",
        "question": "What is the law on domestic violence in Pakistan?",
        "expected_sections": [],
        "expected_laws": ["Domestic Violence Act"],
        "expected_keywords": ["domestic", "violence", "protection", "complaint", "court"],
        "category": "family",
        "follow_up": "what relief can court give",
        "follow_up_expected": ["protection", "order", "residence", "monetary"]
    },
    {
        "id": "fam-005",
        "question": "What is talaq procedure under Muslim Family Laws Ordinance?",
        "expected_sections": ["7"],
        "expected_laws": ["Muslim Family Laws Ordinance"],
        "expected_keywords": ["talaq", "notice", "union council", "reconciliation", "90 days"],
        "category": "family",
        "follow_up": "is triple talaq valid",
        "follow_up_expected": ["triple", "talaq", "one", "union council", "invalid"]
    },
    {
        "id": "prop-001",
        "question": "What is the law on tenancy eviction in Pakistan?",
        "expected_sections": [],
        "expected_laws": ["Tenancy Act", "Rent Restriction Ordinance"],
        "expected_keywords": ["tenant", "landlord", "eviction", "notice", "rent"],
        "category": "property",
        "follow_up": "how much notice period required",
        "follow_up_expected": ["notice", "month", "fifteen", "eviction"]
    },
    {
        "id": "prop-002",
        "question": "How is property transferred in Pakistan?",
        "expected_sections": [],
        "expected_laws": ["Transfer of Property Act"],
        "expected_keywords": ["transfer", "sale", "deed", "registration", "mutation"],
        "category": "property",
        "follow_up": "what is mutation of property",
        "follow_up_expected": ["mutation", "revenue", "record", "rights"]
    },
    {
        "id": "prop-003",
        "question": "What is adverse possession under Pakistani law?",
        "expected_sections": [],
        "expected_laws": ["Limitation Act"],
        "expected_keywords": ["adverse possession", "twelve years", "occupation", "owner"],
        "category": "property",
        "follow_up": "can tenant claim adverse possession",
        "follow_up_expected": ["tenant", "adverse", "permission", "hostile"]
    },
    {
        "id": "const-001",
        "question": "What are fundamental rights under Constitution of Pakistan?",
        "expected_sections": ["8"],
        "expected_laws": ["Constitution of Pakistan"],
        "expected_keywords": ["fundamental rights", "life", "liberty", "equality", "speech"],
        "category": "constitutional",
        "follow_up": "can fundamental rights be suspended",
        "follow_up_expected": ["emergency", "suspend", "president", "article", "proclamation"]
    },
    {
        "id": "const-002",
        "question": "What is writ of habeas corpus?",
        "expected_sections": [],
        "expected_laws": ["Constitution of Pakistan"],
        "expected_keywords": ["habeas corpus", "detention", "illegal", "court", "produce"],
        "category": "constitutional",
        "follow_up": "which court can issue it",
        "follow_up_expected": ["high court", "supreme court", "article", "199"]
    },
    {
        "id": "const-003",
        "question": "What is the procedure for filing a constitutional petition?",
        "expected_sections": ["199"],
        "expected_laws": ["Constitution of Pakistan"],
        "expected_keywords": ["petition", "high court", "fundamental rights", "violation"],
        "category": "constitutional",
        "follow_up": "what is the court fee",
        "follow_up_expected": ["fee", "court", "minimal", "nominal"]
    },
    {
        "id": "biz-001",
        "question": "What is the procedure for company registration in Pakistan?",
        "expected_sections": [],
        "expected_laws": ["Companies Act"],
        "expected_keywords": ["SECP", "registration", "company", "memorandum", "articles"],
        "category": "business",
        "follow_up": "how much capital is required",
        "follow_up_expected": ["capital", "minimum", "private", "limited"]
    },
    {
        "id": "biz-002",
        "question": "What is arbitration under Pakistani law?",
        "expected_sections": [],
        "expected_laws": ["Arbitration Act"],
        "expected_keywords": ["arbitration", "award", "agreement", "tribunal", "enforce"],
        "category": "business",
        "follow_up": "can arbitration award be challenged",
        "follow_up_expected": ["challenge", "award", "court", "misconduct", "corruption"]
    },
    {
        "id": "casual-001",
        "question": "hello",
        "expected_sections": [],
        "expected_laws": [],
        "expected_keywords": [],
        "category": "casual",
        "follow_up": None,
        "follow_up_expected": []
    },
    {
        "id": "casual-002",
        "question": "what is your name",
        "expected_sections": [],
        "expected_laws": [],
        "expected_keywords": ["PakLegal", "AI", "assistant"],
        "category": "casual",
        "follow_up": None,
        "follow_up_expected": []
    }
]


# ============================================================
# EVALUATION ENGINE
# ============================================================

@dataclass
class EvalResult:
    test_id: str
    question: str
    category: str
    citation_accuracy: float
    hallucination_rate: float
    relevance_score: float
    continuity_score: float
    confidence_match: float
    bot_confidence: float
    overall_score: float
    response_preview: str
    follow_up_preview: str
    issues: List[str]


class AutoEvaluator:
    """Production-grade automatic evaluator for PakLegal AI."""

    def __init__(self, retriever):
        self.retriever = retriever
        self.results: List[EvalResult] = []

    # -------------------------------------------------------------------------
    # 1. CITATION ACCURACY
    # -------------------------------------------------------------------------
    def _score_citations(self, response: str, expected_sections: List[str],
                         expected_laws: List[str]) -> Tuple[float, List[str]]:
        issues = []
        score = 0.0

        cited_secs = re.findall(r'Section\s+(\d+[a-z]?)', response, re.IGNORECASE)
        cited_secs = [s.lower() for s in cited_secs]

        cited_laws = []
        law_keywords = {
            "Pakistan Penal Code": ["penal code", "ppc"],
            "Code of Criminal Procedure": ["criminal procedure", "crpc"],
            "Civil Procedure Code": ["civil procedure", "cpc"],
            "Muslim Family Laws Ordinance": ["family laws", "mflo"],
            "Constitution of Pakistan": ["constitution"],
            "Guardian and Wards Act": ["guardian", "wards"],
            "Transfer of Property Act": ["transfer of property"],
            "Companies Act": ["companies act", "secp"],
            "Arbitration Act": ["arbitration"],
            "Limitation Act": ["limitation"],
            "Tenancy Act": ["tenancy", "rent"],
            "Domestic Violence Act": ["domestic violence"]
        }
        resp_lower = response.lower()
        for law_name, keywords in law_keywords.items():
            if any(kw in resp_lower for kw in keywords):
                cited_laws.append(law_name)

        if expected_sections:
            matches = sum(1 for es in expected_sections
                         if any(es.lower() == cs for cs in cited_secs))
            score += (matches / len(expected_sections)) * 50
            if matches < len(expected_sections):
                issues.append("Missing expected sections: " + str(expected_sections))
        else:
            score += 50

        if expected_laws:
            matches = sum(1 for el in expected_laws
                         if any(el.lower() in cl.lower() for cl in cited_laws))
            score += (matches / len(expected_laws)) * 50
            if matches < len(expected_laws):
                issues.append("Missing expected laws: " + str(expected_laws))
        else:
            score += 50

        return round(min(score, 100), 1), issues

    # -------------------------------------------------------------------------
    # 2. HALLUCINATION — FIXED: Scans content + metadata + title
    # -------------------------------------------------------------------------
    def _score_hallucination(self, response: str, sources: List[Any],
                           expected_keywords: List[str]) -> Tuple[float, List[str]]:
        issues = []
        flags = 0
        max_flags = 5

        if re.search(r'Document\s+\d+', response, re.IGNORECASE):
            flags += 2
            issues.append("Uses generic 'Document X' instead of real law names")

        cited_secs = set(re.findall(r'Section\s+(\d+[a-z]?)', response, re.IGNORECASE))

        # PRODUCTION FIX: Extract sections from metadata, content, AND title
        source_secs = set()
        for src in sources:
            if isinstance(src, dict):
                sec = src.get('section')
                content = src.get('page_content', '')
                title = src.get('title', '')
            else:
                sec = getattr(src, 'section', None)
                content = getattr(src, 'page_content', '')
                title = getattr(src, 'title', '')

            if sec:
                source_secs.add(str(sec).lower())
            if content:
                found = re.findall(r'Section\s+(\d+[a-z]?)', content, re.IGNORECASE)
                source_secs.update(s.lower() for s in found)
            if title:
                found = re.findall(r'Section\s+(\d+[a-z]?)', title, re.IGNORECASE)
                source_secs.update(s.lower() for s in found)

        if source_secs:
            invented = cited_secs - source_secs
            if invented:
                flags += 1
                issues.append("Possibly invented sections: " + str(invented))

        if expected_keywords:
            missing = [kw for kw in expected_keywords if kw.lower() not in response.lower()]
            if len(missing) == len(expected_keywords):
                flags += 2
                issues.append("Answer completely misses expected legal concepts")
            elif missing:
                issues.append("Missing keywords: " + str(missing))

        if sources and len(response.split()) < 30:
            flags += 1
            issues.append("Answer too short despite having sources")

        rate = min((flags / max_flags) * 100, 100)
        return round(rate, 1), issues

    # -------------------------------------------------------------------------
    # 3. RELEVANCE
    # -------------------------------------------------------------------------
    def _score_relevance(self, question: str, response: str,
                         expected_keywords: List[str]) -> Tuple[float, List[str]]:
        issues = []
        score = 0.0

        if expected_keywords:
            found = sum(1 for kw in expected_keywords if kw.lower() in response.lower())
            score += (found / len(expected_keywords)) * 60
            if found < len(expected_keywords):
                missing = [kw for kw in expected_keywords if kw.lower() not in response.lower()]
                issues.append("Missing keywords: " + str(missing))
        else:
            score += 60

        q_terms = [w for w in question.lower().split() if len(w) > 4 and w not in ['what', 'under', 'about', 'procedure']]
        matched = sum(1 for t in q_terms if t in response.lower())
        if q_terms:
            score += (matched / len(q_terms)) * 20

        wc = len(response.split())
        if 40 <= wc <= 600:
            score += 20
        elif wc > 0:
            score += 10
            if wc < 40:
                issues.append("Answer too short")
            else:
                issues.append("Answer excessively long")

        return round(min(score, 100), 1), issues

    # -------------------------------------------------------------------------
    # 4. CONTINUITY — FIXED: Broader term matching
    # -------------------------------------------------------------------------
    def _score_continuity(self, first_response: str, follow_up_response: str,
                          follow_up_expected: List[str], first_entities: Dict) -> Tuple[float, List[str]]:
        issues = []
        score = 0.0

        # PRODUCTION FIX: Build related terms from first turn entities
        related_terms = []
        last_topic = first_entities.get('last_topic', '').lower()
        if last_topic and len(last_topic) > 3:
            related_terms.append(last_topic)
        related_terms.extend([c.lower() for c in first_entities.get('concepts', []) if len(c) > 3])
        related_terms.extend([f"section {s}".lower() for s in first_entities.get('sections', []) if s])
        related_terms.extend([l.lower() for l in first_entities.get('laws', []) if len(l) > 3])
        related_terms = list(set(related_terms))

        fu_lower = follow_up_response.lower()

        # Check if ANY related term appears (not just exact topic)
        topic_found = False
        for term in related_terms:
            if term in fu_lower:
                topic_found = True
                break

        if topic_found:
            score += 30
        else:
            issues.append("Follow-up does not reference previous topic")

        if follow_up_expected:
            found = sum(1 for kw in follow_up_expected if kw.lower() in fu_lower)
            score += (found / len(follow_up_expected)) * 50
            if found < len(follow_up_expected):
                missing = [kw for kw in follow_up_expected if kw.lower() not in fu_lower]
                issues.append("Missing follow-up concepts: " + str(missing))
        else:
            score += 50

        if follow_up_response and first_response:
            first_words = set(first_response.lower().split())
            follow_words = set(fu_lower.split())
            overlap = len(first_words & follow_words)
            if overlap > 5:
                score += 20
            else:
                issues.append("Follow-up seems unrelated to first response")

        return round(min(score, 100), 1), issues

    # -------------------------------------------------------------------------
    # 5. CONFIDENCE CALIBRATION
    # -------------------------------------------------------------------------
    def _score_confidence_match(self, bot_confidence: float, actual_quality: float) -> float:
        diff = abs(bot_confidence - actual_quality)
        calibration = max(100 - (diff * 2), 0)
        return round(calibration, 1)

    # -------------------------------------------------------------------------
    # ENTITY EXTRACTION (must match retriever's method)
    # -------------------------------------------------------------------------
    def _extract_entities(self, query: str, response: str, sources: List[Any]) -> Dict:
        entities = {
            'laws': [],
            'sections': [],
            'concepts': [],
            'last_topic': ''
        }

        law_patterns = [
            r'Pakistan Penal Code',
            r'Code of Criminal Procedure',
            r'Civil Procedure Code',
            r'Muslim Family Laws Ordinance',
            r'Guardian and Wards Act',
            r'Transfer of Property Act',
            r'Constitution of Pakistan',
            r'Companies Act',
            r'Arbitration Act',
            r'Specific Relief Act',
            r'Court Fees Act',
            r'Registration Act',
        ]
        for pattern in law_patterns:
            if re.search(pattern, response, re.IGNORECASE):
                entities['laws'].append(pattern)

        sections = re.findall(r'Section\s+(\d+[a-z]?)', response, re.IGNORECASE)
        entities['sections'] = list(set(sections))

        concepts = re.findall(
            r'\b(murder|theft|robbery|dacoity|bail|divorce|talaq|property|contract|fraud|assault|'
            r'kidnapping|rape|corruption|bribery|terrorism|defamation|'
            r'negligence|injunction|damages|compensation|tenancy|lease|mortgage|'
            r'inheritance|custody|maintenance|adoption|guardianship|succession|will)\b',
            response, re.IGNORECASE
        )
        entities['concepts'] = list(set(concepts))

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
    # MAIN EVALUATION
    # -------------------------------------------------------------------------
    def evaluate_single(self, test_case: Dict) -> EvalResult:
        session_id = "eval_" + hashlib.md5(test_case['id'].encode()).hexdigest()[:8]

        self.retriever.conversation_history.pop(session_id, None)
        self.retriever.session_entities.pop(session_id, None)

        issues = []

        result1 = self.retriever.query(
            query=test_case['question'],
            original_query=test_case['question'],
            language='en',
            session_id=session_id
        )

        response1 = result1.get('response', '')
        sources1 = result1.get('sources', [])
        confidence1 = result1.get('confidence', 0)

        cite_score, cite_issues = self._score_citations(
            response1,
            test_case.get('expected_sections', []),
            test_case.get('expected_laws', [])
        )
        issues.extend(cite_issues)

        hallu_score, hallu_issues = self._score_hallucination(
            response1, sources1, test_case.get('expected_keywords', [])
        )
        issues.extend(hallu_issues)

        rel_score, rel_issues = self._score_relevance(
            test_case['question'], response1,
            test_case.get('expected_keywords', [])
        )
        issues.extend(rel_issues)

        sources1_dict = []
        for s in sources1:
            if hasattr(s, '__dict__'):
                sources1_dict.append(s.__dict__)
            elif isinstance(s, dict):
                sources1_dict.append(s)

        first_entities = self.retriever._extract_entities(
            test_case['question'], response1, sources1_dict
        )

        cont_score = 100.0
        response2 = ""

        if test_case.get('follow_up'):
            result2 = self.retriever.query(
                query=test_case['follow_up'],
                original_query=test_case['follow_up'],
                language='en',
                session_id=session_id
            )
            response2 = result2.get('response', '')

            cont_score, cont_issues = self._score_continuity(
                response1, response2,
                test_case.get('follow_up_expected', []),
                first_entities
            )
            issues.extend(cont_issues)

        actual_quality = (cite_score + rel_score + (100 - hallu_score)) / 3
        conf_match = self._score_confidence_match(confidence1, actual_quality)

        overall = (
            cite_score * 0.30 +
            (100 - hallu_score) * 0.30 +
            rel_score * 0.20 +
            cont_score * 0.15 +
            conf_match * 0.05
        )

        if conf_match < 50:
            issues.append("Confidence calibration poor")

        return EvalResult(
            test_id=test_case['id'],
            question=test_case['question'],
            category=test_case.get('category', 'general'),
            citation_accuracy=cite_score,
            hallucination_rate=hallu_score,
            relevance_score=rel_score,
            continuity_score=cont_score,
            confidence_match=round(conf_match, 1),
            bot_confidence=confidence1,
            overall_score=round(overall, 1),
            response_preview=response1[:200].replace('\n', ' '),
            follow_up_preview=response2[:200].replace('\n', ' ') if response2 else "N/A",
            issues=issues
        )

    # -------------------------------------------------------------------------
    # PRODUCTION FIX: Adaptive rate limit delays
    # -------------------------------------------------------------------------
    def run_all(self, test_cases: List[Dict] = None, delay_seconds: int = 8) -> Dict:
        if test_cases is None:
            test_cases = BUILT_IN_TEST_CASES

        self.results = []
        print("\nStarting Auto-Evaluation: " + str(len(test_cases)) + " test cases")
        print("Rate limit protection: adaptive delay between tests")
        print("=" * 60)

        for i, case in enumerate(test_cases, 1):
            print("[" + str(i) + "/" + str(len(test_cases)) + "] Testing: " + case['question'][:45] + "...", end=" ")
            try:
                result = self.evaluate_single(case)
                self.results.append(result)

                if result.overall_score >= 70:
                    grade = "PASS"
                elif result.overall_score >= 50:
                    grade = "WARN"
                else:
                    grade = "FAIL"

                print(grade + " Score: " + str(round(result.overall_score, 1)))
            except Exception as e:
                print("ERROR: " + str(e))
                self.results.append(EvalResult(
                    test_id=case['id'],
                    question=case['question'],
                    category=case.get('category', 'error'),
                    citation_accuracy=0,
                    hallucination_rate=100,
                    relevance_score=0,
                    continuity_score=0,
                    confidence_match=0,
                    bot_confidence=0,
                    overall_score=0,
                    response_preview="ERROR: " + str(e),
                    follow_up_preview="N/A",
                    issues=["Runtime error: " + str(e)]
                ))

            # PRODUCTION FIX: Adaptive delay (8-14s cycling) to survive Groq rate limits
            if i < len(test_cases):
                adaptive_delay = delay_seconds + (i % 4) * 2
                time.sleep(adaptive_delay)

        return self._generate_report()

    def _generate_report(self) -> Dict:
        total = len(self.results)
        if total == 0:
            return {"error": "No results generated"}

        avg_cite = sum(r.citation_accuracy for r in self.results) / total
        avg_hallu = sum(r.hallucination_rate for r in self.results) / total
        avg_rel = sum(r.relevance_score for r in self.results) / total
        avg_cont = sum(r.continuity_score for r in self.results) / total
        avg_conf = sum(r.confidence_match for r in self.results) / total
        avg_overall = sum(r.overall_score for r in self.results) / total

        cat_scores = {}
        for r in self.results:
            cat = r.category
            if cat not in cat_scores:
                cat_scores[cat] = []
            cat_scores[cat].append(r.overall_score)

        cat_summary = {k: round(sum(v)/len(v), 1) for k, v in cat_scores.items()}

        passed = sum(1 for r in self.results if r.overall_score >= 70)
        warning = sum(1 for r in self.results if 50 <= r.overall_score < 70)
        failed = sum(1 for r in self.results if r.overall_score < 50)

        report = {
            "evaluated_at": datetime.now().isoformat(),
            "total_tests": total,
            "grade": self._grade(avg_overall),
            "summary": {
                "passed": passed,
                "warning": warning,
                "failed": failed,
                "pass_rate": round(passed / total * 100, 1)
            },
            "average_scores": {
                "citation_accuracy": round(avg_cite, 1),
                "hallucination_rate": round(avg_hallu, 1),
                "relevance": round(avg_rel, 1),
                "continuity": round(avg_cont, 1),
                "confidence_calibration": round(avg_conf, 1),
                "overall": round(avg_overall, 1)
            },
            "by_category": cat_summary,
            "detailed_results": [asdict(r) for r in self.results]
        }

        return report

    def _grade(self, score: float) -> str:
        if score >= 90: return "A+ (Production Ready)"
        if score >= 80: return "A (Excellent)"
        if score >= 70: return "B (Good, minor fixes needed)"
        if score >= 60: return "C (Acceptable, needs work)"
        if score >= 50: return "D (Poor, major issues)"
        return "F (Not usable)"

    def save_json(self, report: Dict, path: str = "evaluation_scores.json"):
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        print("\nJSON report saved: " + path)

    def _color_for_score(self, score: float) -> str:
        if score >= 70: return "#22c55e"
        if score >= 50: return "#f59e0b"
        return "#ef4444"

    def _class_for_score(self, score: float) -> str:
        if score >= 70: return "good"
        if score >= 50: return "warn"
        return "bad"

    def generate_html(self, report: Dict, output_path: str = "evaluation_report.html"):
        scores = report['average_scores']
        cats = report['by_category']
        details = report['detailed_results']
        summary = report['summary']

        cat_html_parts = []
        for cat, score in sorted(cats.items(), key=lambda x: x[1], reverse=True):
            color = self._color_for_score(score)
            cat_html_parts.append(
                '<div class="cat-row"><span class="cat-name">' + cat.title() +
                '</span><div class="bar-bg"><div class="bar-fill" style="width:' +
                str(score) + '%;background:' + color + '"></div></div>' +
                '<span class="cat-score">' + str(round(score, 1)) + '</span></div>'
            )
        cat_html = "\n".join(cat_html_parts)

        detail_html_parts = []
        for d in details:
            status = "pass" if d['overall_score'] >= 70 else "warn" if d['overall_score'] >= 50 else "fail"
            issues_str = "; ".join(d['issues']) if d['issues'] else "None"
            detail_html_parts.append(
                '<tr class="' + status + '"><td>' + d['test_id'] + '</td>' +
                '<td>' + d['question'][:60] + '...</td>' +
                '<td>' + d['category'] + '</td>' +
                '<td>' + str(round(d['citation_accuracy'])) + '</td>' +
                '<td>' + str(round(d['hallucination_rate'])) + '</td>' +
                '<td>' + str(round(d['relevance_score'])) + '</td>' +
                '<td>' + str(round(d['continuity_score'])) + '</td>' +
                '<td><strong>' + str(round(d['overall_score'])) + '</strong></td>' +
                '<td class="issues" title="' + issues_str.replace('"', '&quot;') + '">' +
                (issues_str[:40] + "..." if len(issues_str) > 40 else issues_str) + '</td></tr>'
            )
        detail_html = "\n".join(detail_html_parts)

        grade_letter = report['grade'].split()[0]
        grade_class = 'Aplus' if scores['overall'] >= 90 else 'A' if scores['overall'] >= 80 else 'B' if scores['overall'] >= 70 else 'C' if scores['overall'] >= 60 else 'D' if scores['overall'] >= 50 else 'F'
        overall_color = self._color_for_score(scores['overall'])

        def stat_card(label, value, is_pct=False, invert=False):
            cls = self._class_for_score(100 - value if invert else value)
            suffix = "%" if is_pct else ""
            note = '<div style="font-size:0.75rem;color:#64748b;margin-top:4px">Lower is better</div>' if invert else ''
            return (
                '<div class="stat-card"><div class="stat-label">' + label +
                '</div><div class="stat-value ' + cls + '">' + str(round(value, 1)) + suffix +
                '</div>' + note + '</div>'
            )

        stat_cards = (
            stat_card("Citation Accuracy", scores['citation_accuracy']) +
            stat_card("Hallucination Rate", scores['hallucination_rate'], is_pct=True, invert=True) +
            stat_card("Relevance", scores['relevance']) +
            stat_card("Continuity", scores['continuity']) +
            stat_card("Pass Rate", summary['pass_rate'], is_pct=True) +
            stat_card("Confidence Calibration", scores['confidence_calibration'])
        )

        html = """<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>PakLegal AI Evaluation Report</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',system-ui,sans-serif;background:#0f172a;color:#e2e8f0;line-height:1.6}
.container{max-width:1200px;margin:0 auto;padding:40px 20px}
h1{font-size:2.5rem;margin-bottom:10px;background:linear-gradient(90deg,#38bdf8,#818cf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.subtitle{color:#94a3b8;margin-bottom:30px}
.grade-box{background:#1e293b;border-radius:16px;padding:30px;margin-bottom:30px;border:1px solid #334155}
.grade{font-size:3rem;font-weight:800}
.grade.Aplus{color:#22c55e} .grade.A{color:#4ade80} .grade.B{color:#f59e0b}
.grade.C{color:#fb923c} .grade.D{color:#ef4444} .grade.F{color:#dc2626}
.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-bottom:30px}
.stat-card{background:#1e293b;border-radius:12px;padding:24px;border:1px solid #334155}
.stat-label{font-size:0.875rem;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px}
.stat-value{font-size:2rem;font-weight:700}
.stat-value.good{color:#22c55e} .stat-value.warn{color:#f59e0b} .stat-value.bad{color:#ef4444}
.section{background:#1e293b;border-radius:16px;padding:30px;margin-bottom:30px;border:1px solid #334155}
h2{font-size:1.5rem;margin-bottom:20px;color:#f8fafc}
.cat-row{display:flex;align-items:center;gap:15px;margin-bottom:12px}
.cat-name{width:140px;font-size:0.95rem;color:#cbd5e1}
.bar-bg{flex:1;height:24px;background:#334155;border-radius:12px;overflow:hidden}
.bar-fill{height:100%;border-radius:12px;transition:width 0.5s ease}
.cat-score{width:50px;text-align:right;font-weight:600;font-size:1.1rem}
table{width:100%;border-collapse:collapse;font-size:0.9rem}
th{text-align:left;padding:12px;background:#0f172a;color:#94a3b8;font-weight:600;border-bottom:2px solid #334155}
td{padding:12px;border-bottom:1px solid #334155}
tr.pass td{background:rgba(34,197,94,0.05)}
tr.warn td{background:rgba(245,158,11,0.05)}
tr.fail td{background:rgba(239,68,68,0.05)}
tr:hover td{background:rgba(56,189,248,0.05)}
.issues{max-width:300px;font-size:0.8rem;color:#94a3b8}
.legend{display:flex;gap:20px;margin-bottom:20px;font-size:0.85rem}
.legend span{display:flex;align-items:center;gap:6px}
.dot{width:12px;height:12px;border-radius:50%;display:inline-block}
.footer{text-align:center;color:#64748b;padding:40px;font-size:0.875rem}
</style></head>
<body><div class="container">
<h1>PakLegal AI Evaluation Report</h1>
<p class="subtitle">Generated: """ + datetime.now().strftime('%Y-%m-%d %H:%M:%S') + """ | """ + str(report['total_tests']) + """ test cases evaluated</p>
<div class="grade-box"><div style="display:flex;justify-content:space-between;align-items:center">
<div><div style="font-size:0.875rem;color:#94a3b8;margin-bottom:8px">OVERALL GRADE</div>
<div class="grade """ + grade_class + """">""" + grade_letter + """</div>
<div style="color:#94a3b8;margin-top:8px">""" + report['grade'] + """</div></div>
<div style="text-align:right"><div style="font-size:3rem;font-weight:800;color:""" + overall_color + """">""" + str(round(scores['overall'], 1)) + """</div>
<div style="color:#94a3b8">Overall Score / 100</div></div></div></div>
<div class="stats-grid">
""" + stat_cards + """
</div>
<div class="section"><h2>Performance by Category</h2>
""" + cat_html + """
</div>
<div class="section"><h2>Detailed Results</h2>
<div class="legend"><span><span class="dot" style="background:#22c55e"></span> Pass (&ge;70)</span><span><span class="dot" style="background:#f59e0b"></span> Warning (50-69)</span><span><span class="dot" style="background:#ef4444"></span> Fail (&lt;50)</span></div>
<table><thead><tr><th>ID</th><th>Question</th><th>Category</th><th>Citation</th><th>Hallu.</th><th>Relevance</th><th>Continuity</th><th>Overall</th><th>Issues</th></tr></thead><tbody>
""" + detail_html + """
</tbody></table></div>
<div class="section"><h2>How to Read This Report</h2>
<ul style="color:#cbd5e1;line-height:2;margin-left:20px">
<li><strong>Citation Accuracy:</strong> Did the bot cite correct sections and law names? 80+ = reliable citations.</li>
<li><strong>Hallucination Rate:</strong> Did it invent facts? &lt;15% = safe, &gt;30% = dangerous for legal use.</li>
<li><strong>Relevance:</strong> Did the answer actually address what was asked? 70+ = on-topic.</li>
<li><strong>Continuity:</strong> Did follow-ups remember previous context? 70+ = good conversation memory.</li>
<li><strong>Confidence Calibration:</strong> Did the bot confidence score match actual quality? 80+ = honest scoring.</li>
</ul></div>
<div class="footer">PakLegal AI Automatic Evaluator v2.0 | Run this weekly to track accuracy trends</div>
</div></body></html>"""

        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html)
        print("HTML report saved: " + output_path)
        return output_path

    def print_console_summary(self, report: Dict):
        s = report['average_scores']
        print("\n" + "=" * 60)
        print("EVALUATION COMPLETE")
        print("=" * 60)
        print("Grade: " + report['grade'])
        print("Overall: " + str(round(s['overall'], 1)) + "/100")
        print("-" * 60)
        ca = s['citation_accuracy']
        hr = s['hallucination_rate']
        rel = s['relevance']
        cont = s['continuity']
        cc = s['confidence_calibration']
        print("Citation Accuracy:      " + str(round(ca, 1)).rjust(6) + " " + ("PASS" if ca >= 70 else "WARN"))
        print("Hallucination Rate:     " + str(round(hr, 1)).rjust(6) + "% " + ("PASS" if hr < 15 else "WARN"))
        print("Relevance:              " + str(round(rel, 1)).rjust(6) + " " + ("PASS" if rel >= 70 else "WARN"))
        print("Continuity:             " + str(round(cont, 1)).rjust(6) + " " + ("PASS" if cont >= 70 else "WARN"))
        print("Confidence Calibration: " + str(round(cc, 1)).rjust(6))
        print("-" * 60)
        print("Pass Rate: " + str(round(report['summary']['pass_rate'])) + "% (" + str(report['summary']['passed']) + "/" + str(report['total_tests']) + ")")
        print("=" * 60)

        print("\nRED FLAGS:")
        failed = [r for r in self.results if r.overall_score < 50]
        if failed:
            for r in failed:
                print("  [" + r.test_id + "] " + r.question[:50] + "... -> " + str(round(r.overall_score)))
        else:
            print("  None! All tests passed minimum threshold.")

        print("\nRECOMMENDATION:")
        if s['overall'] >= 80:
            print("  Bot is production-ready. Run weekly checks to maintain quality.")
        elif s['overall'] >= 70:
            print("  Good quality. Focus on improving the lowest scoring category.")
        elif s['overall'] >= 60:
            print("  Acceptable but needs work. Review failed test cases and tune prompts.")
        else:
            print("  CRITICAL: Bot is not accurate enough for legal use. Fix before deploying.")
        print("=" * 60)


# ============================================================
# MAIN ENTRY POINT
# ============================================================

if __name__ == "__main__":
    import sys

    import_paths = [
        ("models.legal_retriever", "models/legal_retriever.py"),
        ("backend.models.legal_retriever", "backend/models/legal_retriever.py"),
    ]

    LegalRetriever = None
    tried_paths = []

    for module_path, file_path in import_paths:
        try:
            parts = module_path.split(".")
            module = __import__(module_path, fromlist=[parts[-1]])
            LegalRetriever = getattr(module, "LegalRetriever")
            print("Successfully imported LegalRetriever from: " + module_path)
            break
        except ImportError as e:
            tried_paths.append(file_path)
            continue

    if LegalRetriever is None:
        print("=" * 60)
        print("ERROR: Could not import LegalRetriever")
        print("=" * 60)
        print("Tried the following paths:")
        for p in tried_paths:
            print("  - " + p)
        print()
        print("Make sure ONE of these files exists:")
        print("  1. backend/models/legal_retriever.py")
        print()
        print("Current working directory: " + os.getcwd())
        print("=" * 60)
        sys.exit(1)

    print("Initializing LegalRetriever...")
    retriever = LegalRetriever()

    print("Starting automatic evaluation...")
    evaluator = AutoEvaluator(retriever)
    report = evaluator.run_all()

    evaluator.save_json(report, "evaluation_scores.json")
    evaluator.generate_html(report, "evaluation_report.html")
    evaluator.print_console_summary(report)

    print("\nDone! Open evaluation_report.html in your browser to see full results.")