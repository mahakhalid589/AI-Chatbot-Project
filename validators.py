"""
Validators Module
=================
Input validation functions for the API.
"""

import re
import os
from typing import Tuple, List


def validate_query(query: str) -> Tuple[bool, str]:
    """
    Validate a user query.
    
    Args:
        query: User query string
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not query:
        return False, "Query cannot be empty"
    
    if len(query) < 3:
        return False, "Query must be at least 3 characters long"
    
    if len(query) > 5000:
        return False, "Query is too long (max 5000 characters)"
    
    # Check for potentially harmful content
    harmful_patterns = [
        r'<script[^>]*>.*?</script>',  # XSS
        r'javascript:',  # JS injection
        r'on\w+\s*=',  # Event handlers
    ]
    
    for pattern in harmful_patterns:
        if re.search(pattern, query, re.IGNORECASE | re.DOTALL):
            return False, "Query contains potentially harmful content"
    
    return True, ""


def validate_file_upload(file) -> Tuple[bool, str]:
    """
    Validate a file upload.
    
    Args:
        file: File object from request
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not file:
        return False, "No file provided"
    
    if not hasattr(file, 'filename') or not file.filename:
        return False, "No file selected"
    
    # Check file extension
    allowed_extensions = {'.pdf', '.doc', '.docx', '.txt', '.rtf', '.html', '.htm'}
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        return False, f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
    
    # Check file size (read content to check)
    try:
        file_content = file.read()
        file.seek(0)  # Reset file pointer
        
        max_size = 50 * 1024 * 1024  # 50MB
        if len(file_content) > max_size:
            return False, f"File too large (max {max_size / (1024 * 1024)}MB)"
        
        if len(file_content) == 0:
            return False, "File is empty"
        
    except Exception as e:
        return False, f"Error reading file: {str(e)}"
    
    return True, ""


def validate_language_code(language: str) -> Tuple[bool, str]:
    """
    Validate a language code.
    
    Args:
        language: Language code string
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    supported_languages = {'en', 'ur', 'roman_urdu', 'auto'}
    
    if not language:
        return False, "Language code is required"
    
    if language.lower() not in supported_languages:
        return False, f"Unsupported language. Supported: {', '.join(supported_languages)}"
    
    return True, ""


def validate_audio_file(file) -> Tuple[bool, str]:
    """
    Validate an audio file upload.
    
    Args:
        file: Audio file object
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not file:
        return False, "No audio file provided"
    
    if not hasattr(file, 'filename') or not file.filename:
        return False, "No audio file selected"
    
    # Check file extension
    allowed_extensions = {'.wav', '.mp3', '.ogg', '.m4a', '.flac', '.webm'}
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        return False, f"Unsupported audio format. Allowed: {', '.join(allowed_extensions)}"
    
    # Check file size
    try:
        file_content = file.read()
        file.seek(0)
        
        max_size = 20 * 1024 * 1024  # 20MB for audio
        if len(file_content) > max_size:
            return False, f"Audio file too large (max {max_size / (1024 * 1024)}MB)"
        
        if len(file_content) == 0:
            return False, "Audio file is empty"
        
    except Exception as e:
        return False, f"Error reading audio file: {str(e)}"
    
    return True, ""


def sanitize_input(text: str) -> str:
    """
    Sanitize user input to prevent injection attacks.
    
    Args:
        text: Input text
        
    Returns:
        Sanitized text
    """
    if not text:
        return text
    
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    
    # Remove potentially dangerous characters
    text = re.sub(r'[<>\"\'%;()&+]', '', text)
    
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()


def validate_session_id(session_id: str) -> bool:
    """
    Validate a session ID.
    
    Args:
        session_id: Session ID string
        
    Returns:
        True if valid, False otherwise
    """
    if not session_id:
        return False
    
    # Session ID should be alphanumeric with some allowed characters
    if not re.match(r'^[a-zA-Z0-9_-]+$', session_id):
        return False
    
    # Length check
    if len(session_id) < 8 or len(session_id) > 128:
        return False
    
    return True


def get_file_extension(filename: str) -> str:
    """
    Get the file extension from a filename.
    
    Args:
        filename: Filename string
        
    Returns:
        File extension (lowercase)
    """
    return os.path.splitext(filename)[1].lower()


def is_allowed_file(filename: str, allowed_extensions: List[str]) -> bool:
    """
    Check if a file has an allowed extension.
    
    Args:
        filename: Filename to check
        allowed_extensions: List of allowed extensions
        
    Returns:
        True if allowed, False otherwise
    """
    ext = get_file_extension(filename)
    return ext in allowed_extensions
