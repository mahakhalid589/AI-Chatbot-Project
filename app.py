"""
Pakistan Legal AI - Main Flask Application
==========================================
Main entry point for the Pakistani Legal Assistant API.
Supports Urdu with RAG architecture using LLaMA 3.1
"""

import os
import sys
import logging
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from werkzeug.utils import secure_filename
import asyncio

# Add current directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import (
    FLASK_HOST, FLASK_PORT, FLASK_DEBUG, SECRET_KEY,
    CORS_ORIGINS, LOG_LEVEL, LOG_FORMAT, SUPPORTED_LANGUAGES
)

# Setup logging
logging.basicConfig(level=getattr(logging, LOG_LEVEL), format=LOG_FORMAT)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = SECRET_KEY
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size

# Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Global variables for models (initialized on first request)
language_processor = None
legal_retriever = None
document_processor = None
voice_processor = None

def init_models():
    """Initialize all models lazily"""
    global language_processor, legal_retriever, document_processor, voice_processor
    
    if language_processor is None:
        logger.info("Initializing Language Processor...")
        from models.language_processor import LanguageProcessor
        language_processor = LanguageProcessor()
    
    if legal_retriever is None:
        logger.info("Initializing Legal Retriever...")
        from models.legal_retriever import LegalRetriever
        legal_retriever = LegalRetriever()
    
    if document_processor is None:
        logger.info("Initializing Document Processor...")
        from models.document_processor import DocumentProcessor
        document_processor = DocumentProcessor()
    
    if voice_processor is None:
        logger.info("Initializing Voice Processor...")
        from models.voice_processor import VoiceProcessor
        voice_processor = VoiceProcessor()
    
    logger.info("All models initialized successfully!")

# ==================== API Routes ====================

@app.route('/')
def index():
    """Root endpoint - API info"""
    return jsonify({
        "name": "Pakistan Legal AI Assistant",
        "version": "1.0.0",
        "description": "AI-powered legal assistant for Pakistani laws with Urdu support",
        "endpoints": {
            "/chat": "POST - Send a legal query",
            "/upload": "POST - Upload legal documents",
            "/voice": "POST - Process voice input",
            "/languages": "GET - Get supported languages",
            "/health": "GET - Health check",
            "/laws": "GET - List available laws",
            "/search": "GET - Search laws by keyword"
        },
        "supported_languages": {
            "en": "English",
            "ur": "Urdu"
        },
        "status": "operational"
    })

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "pak-law-ai-backend"
    })

@app.route('/languages')
def get_languages():
    """Get supported languages"""
    return jsonify({
        "languages": {
            "en": "English",
            "ur": "Urdu"
        },
        "default": "en"
    })

@app.route('/chat', methods=['POST'])
def chat():
    """
    Main chat endpoint for legal queries
    
    Request Body:
        - query: str - The user's legal question
        - language: str - Language code (en, ur) FROM FRONTEND BUTTON
        - session_id: str (optional) - For conversation context
        - use_rag: bool (optional) - Whether to use RAG (default: True)
    
    Returns:
        - response: str - AI's response
        - sources: list - Relevant law sources
        - detected_language: str - Language used (from frontend button)
        - confidence: float - Confidence score
    """
    try:
        init_models()
        
        data = request.get_json()
        if not data or 'query' not in data:
            return jsonify({"error": "Query is required"}), 400
        
        query = data.get('query', '').strip()
        language = data.get('language', 'auto')  # Frontend button selection: 'en' or 'ur'
        session_id = data.get('session_id', None)
        use_rag = data.get('use_rag', True)
        
        if not query:
            return jsonify({"error": "Query cannot be empty"}), 400
        
        logger.info(f"Chat request - Frontend Language: {language}, Query: {query[:100]}...")
        
        # Respect frontend language button selection
        if language == 'auto':
            detected_lang = language_processor.detect_language(query)
            logger.info(f"Auto-detected language: {detected_lang}")

            if detected_lang not in ['en', 'ur', 'roman_urdu']:
                detected_lang = 'en'
        else:
            # FRONTEND EXPLICITLY SELECTED LANGUAGE - USE IT!
            detected_lang = language
            logger.info(f"Using frontend-selected language: {detected_lang}")
        # Translate to English for retrieval if query is in Urdu
        retrieval_query = query
        if detected_lang in ['ur', 'roman_urdu']:
            retrieval_query = language_processor.translate_to_english(query)
            logger.info(f"Translated for retrieval: {retrieval_query[:100]}...")
        
        # Get response using RAG
        if use_rag:
            response_data = legal_retriever.query(
                query=retrieval_query,
                original_query=query,
                language=detected_lang,  # Pass the frontend-selected language!
                session_id=session_id
            )
        else:
            # Direct LLM query without RAG
            response_data = legal_retriever.direct_query(
                query=retrieval_query,
                language=detected_lang
            )
        
        # If Urdu was selected, translate response to Urdu
        if detected_lang == 'ur':
            response_data['response'] = language_processor.translate_to_urdu(
                response_data['response']
            )
        # If English selected, keep response as-is
        
        # Add detected language to response
        response_data['detected_language'] = detected_lang
        
        logger.info("Chat response generated successfully")
        return jsonify(response_data)
    
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}", exc_info=True)
        return jsonify({
            "error": "Internal server error",
            "message": str(e)
        }), 500

@app.route('/upload', methods=['POST'])
def upload_document():
    """
    Upload and process legal documents
    
    Supports: PDF, DOC, DOCX, TXT files
    """
    try:
        init_models()
        
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        description = request.form.get('description', '')
        
        logger.info(f"Processing uploaded file: {file.filename}")
        
        # Process the document
        result = document_processor.process_uploaded_file(file, description)
        
        # Add to vector database
        if result['success']:
            legal_retriever.add_document(
                text=result['extracted_text'],
                metadata={
                    'source': file.filename,
                    'description': description,
                    'document_id': result['document_id'],
                    'type': 'uploaded'
                }
            )
        
        logger.info(f"Document processed: {result['document_id']}")
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Error in upload endpoint: {str(e)}", exc_info=True)
        return jsonify({
            "error": "Failed to process document",
            "message": str(e)
        }), 500

@app.route('/voice', methods=['POST'])
def voice_input():
    """
    Process voice input for Urdu/English speech recognition
    
    Request:
        - audio: Audio file (WAV, MP3, OGG, M4A, WEBM)
        - language: Language hint from frontend button ('en' or 'ur')
    
    Returns:
        - transcript: Transcribed text
        - detected_language: Detected language
        - confidence: Transcription confidence
        - response: AI response to the voice query
        - sources: Relevant law sources
    """
    try:
        init_models()
        
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400
        
        audio_file = request.files['audio']
        language_hint = request.form.get('language', 'auto')
        
        logger.info(f"Processing voice: {audio_file.filename}, lang={language_hint}")
        
        # Transcribe audio (returns TranscriptionResult dataclass)
        result = voice_processor.transcribe(audio_file, language_hint)
        
        if not result.success:
            return jsonify({
                "error": "Transcription failed",
                "message": result.error or "Unknown error"
            }), 400
        
        transcript = result.transcript
        detected_lang = result.detected_language
        
        # Prioritize frontend language selection
        if language_hint in ['en', 'ur']:
            detected_lang = language_hint
        
        # Get AI response
        chat_response = legal_retriever.query(
            query=transcript,
            original_query=transcript,
            language=detected_lang
        )
        
        # Translate to Urdu if needed
        if detected_lang == 'ur':
            chat_response['response'] = language_processor.translate_to_urdu(
                chat_response['response']
            )
        
        return jsonify({
            "success": True,
            "transcript": transcript,
            "detected_language": detected_lang,
            "confidence": result.confidence,
            "response": chat_response.get('response', ''),
            "sources": chat_response.get('sources', [])
        })
    
    except Exception as e:
        logger.error(f"Voice error: {e}", exc_info=True)
        return jsonify({
            "error": "Failed to process voice input",
            "message": str(e)
        }), 500

@app.route('/laws', methods=['GET'])
def list_laws():
    """List all available laws in the database"""
    try:
        init_models()
        
        category = request.args.get('category', None)
        search = request.args.get('search', None)
        
        laws = legal_retriever.list_laws(category=category, search=search)
        
        return jsonify({
            "laws": laws,
            "total_count": len(laws),
            "filters": {
                "category": category,
                "search": search
            }
        })
    
    except Exception as e:
        logger.error(f"Error listing laws: {str(e)}", exc_info=True)
        return jsonify({
            "error": "Failed to list laws",
            "message": str(e)
        }), 500

@app.route('/search', methods=['GET'])
def search_laws():
    """Search laws by keyword"""
    try:
        init_models()
        
        query = request.args.get('q', '').strip()
        limit = int(request.args.get('limit', 10))
        
        if not query:
            return jsonify({"error": "Search query is required"}), 400
        
        results = legal_retriever.search_laws(query, top_k=limit)
        return jsonify({
            "query": query,
            "results": results,
            "total_results": len(results)
        })
    
    except Exception as e:
        logger.error(f"Error searching laws: {str(e)}", exc_info=True)
        return jsonify({
            "error": "Search failed",
            "message": str(e)
        }), 500

@app.route('/translate', methods=['POST'])
def translate():
    """
    Translate text between English and Urdu
    
    Request Body:
        - text: Text to translate
        - source: Source language code ('en' or 'ur')
        - target: Target language code ('en' or 'ur')
    
    Returns:
        - translated_text: Translated text
        - source: Source language
        - target: Target language
    """
    try:
        init_models()
        
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body is required"}), 400
        
        text = data.get('text', '').strip()
        source = data.get('source', 'auto')
        target = data.get('target', 'en')
        
        if not text:
            return jsonify({"error": "Text is required"}), 400
        
        # Validate language codes
        if target not in ['en', 'ur']:
            return jsonify({"error": "Only 'en' (English) and 'ur' (Urdu) supported"}), 400
        
        # Detect source language if auto
        if source == 'auto':
            source = language_processor.detect_language(text)
            if source not in ['en', 'ur']:
                source = 'en'
        
        # Perform translation
        if source == target:
            translated = text
        elif target == 'en':
            translated = language_processor.translate_to_english(text)
        elif target == 'ur':
            translated = language_processor.translate_to_urdu(text)
        else:
            return jsonify({"error": f"Unsupported target language: {target}"}), 400
        
        return jsonify({
            "original_text": text,
            "translated_text": translated,
            "source": source,
            "target": target
        })
    
    except Exception as e:
        logger.error(f"Error in translate endpoint: {str(e)}", exc_info=True)
        return jsonify({
            "error": "Translation failed",
            "message": str(e)
        }), 500

# ==================== WebSocket Events ====================

@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    logger.info(f"Client connected: {request.sid}")
    emit('connected', {'status': 'connected', 'sid': request.sid})

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    logger.info(f"Client disconnected: {request.sid}")

@socketio.on('chat_message')
def handle_chat_message(data):
    """Handle real-time chat messages via WebSocket"""
    try:
        init_models()
        
        query = data.get('query', '').strip()
        language = data.get('language', 'auto')  # Frontend button: 'en' or 'ur'
        session_id = data.get('session_id', request.sid)
        
        if not query:
            emit('error', {'message': 'Query is required'})
            return
        
        # Respect frontend language selection
        if language == 'auto':
            detected_lang = language_processor.detect_language(query)
            if detected_lang not in ['en', 'ur']:
                detected_lang = 'en'
        else:
            detected_lang = language
        
        # Translate to English for retrieval if Urdu
        retrieval_query = query
        if detected_lang == 'ur':
            retrieval_query = language_processor.translate_to_english(query)
        
        # Stream response chunks
        def stream_callback(chunk):
            emit('response_chunk', {
                'chunk': chunk,
                'session_id': session_id
            })
        
        response_data = legal_retriever.query_stream(
            query=retrieval_query,
            original_query=query,
            language=detected_lang,
            session_id=session_id,
            stream_callback=stream_callback
        )
        
        # Translate if Urdu selected
        if detected_lang == 'ur':
            response_data['response'] = language_processor.translate_to_urdu(
                response_data['response']
            )
        
        emit('response_complete', {
            'response': response_data['response'],
            'sources': response_data.get('sources', []),
            'detected_language': detected_lang,
            'session_id': session_id
        })
    
    except Exception as e:
        logger.error(f"Error in WebSocket chat: {str(e)}", exc_info=True)
        emit('error', {'message': str(e)})

# ==================== Error Handlers ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

@app.errorhandler(413)
def too_large(error):
    return jsonify({"error": "File too large (max 50MB)"}), 413

# ==================== Main Entry Point ====================

if __name__ == '__main__':
    logger.info(f"Starting Pakistan Legal AI Server on {FLASK_HOST}:{FLASK_PORT}")
    logger.info(f"Debug mode: {FLASK_DEBUG}")
    
    # Initialize models on startup
    try:
        init_models()
    except Exception as e:
        logger.warning(f"Could not initialize models on startup: {e}")
        logger.warning("Models will be initialized on first request")
    
    socketio.run(
        app,
        host=FLASK_HOST,
        port=FLASK_PORT,
        debug=FLASK_DEBUG,
        use_reloader=False
    )