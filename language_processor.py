"""
Language Processor Module
=========================
Handles Urdu, Roman Urdu, and English language processing.
Includes translation, transliteration, and language detection.
"""

import re
import logging
from typing import Dict, Optional, List
from langdetect import detect, LangDetectException

# Import configuration
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import ROMAN_URDU_COMMON, SUPPORTED_LANGUAGES

logger = logging.getLogger(__name__)


class LanguageProcessor:
    """
    Handles language detection, translation, and transliteration
    for Urdu, Roman Urdu, and English.
    """
    
    def __init__(self):
        """Initialize the language processor"""
        self.roman_urdu_dict = ROMAN_URDU_COMMON
        self.urdu_to_roman = {v: k for k, v in self.roman_urdu_dict.items()}
        
        # Urdu script Unicode range
        self.urdu_pattern = re.compile(r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]')
        
        # Roman Urdu patterns (common suffixes and patterns)
        self.roman_urdu_patterns = [
            r'\b(aap|tum|main|mera|tera|yeh|woh|kya|kaise|kyun|kahan|kab)\b',
            r'\b(hai|hain|tha|thi|the|ho|hoga|hogi)\b',
            r'\b(ko|se|mein|par|tak|ke|ki|ka)\b',
            r'\b(ach|bura|naya|purana|bara|chota)\w*\b',
            r'\b(kanoon|qanoon|adalat|vakil|wakeel|mujrim|saza)\b',
        ]
        self.roman_urdu_regex = re.compile('|'.join(self.roman_urdu_patterns), re.IGNORECASE)
        
        logger.info("Language Processor initialized")
    
    def detect_language(self, text: str) -> str:
        """
        Detect the language of the input text.
        
        Args:
            text: Input text to analyze
            
        Returns:
            Language code: 'en', 'ur', or 'roman_urdu'
        """
        if not text or not text.strip():
            return 'en'
        
        text = text.strip()
        
        # Check for Urdu script (highest priority)
        urdu_chars = len(self.urdu_pattern.findall(text))
        total_chars = len([c for c in text if c.isalpha()])
        
        if total_chars > 0 and urdu_chars / total_chars > 0.3:
            return 'ur'
        
        # Check for Roman Urdu patterns
        roman_urdu_matches = len(self.roman_urdu_regex.findall(text))
        words = text.split()
        
        if len(words) > 0:
            # Count Roman Urdu dictionary matches
            roman_dict_matches = sum(1 for word in words if word.lower() in self.roman_urdu_dict)
            
            # If significant Roman Urdu patterns found
            if roman_urdu_matches > 0 or roman_dict_matches > 0:
                # Check if it's mostly English with some Roman Urdu
                try:
                    detected = detect(text)
                    if detected == 'en' and roman_dict_matches < len(words) * 0.3:
                        return 'en'
                except LangDetectException:
                    pass
                return 'roman_urdu'
        
        # Use langdetect for other languages
        try:
            detected = detect(text)
            if detected == 'ur':
                return 'ur'
            elif detected in ['ar', 'fa']:
                return 'ur'
        except LangDetectException:
            pass
        
        return 'en'
    
    def roman_to_urdu(self, text: str) -> str:
        """
        Convert Roman Urdu text to Urdu script.
        
        Args:
            text: Roman Urdu text
            
        Returns:
            Urdu script text
        """
        if not text:
            return text
        
        words = text.split()
        converted_words = []
        
        for word in words:
            word_lower = word.lower()
            
            # Check if word is in dictionary
            if word_lower in self.roman_urdu_dict:
                converted_words.append(self.roman_urdu_dict[word_lower])
            else:
                # Try to convert using rules
                converted = self._apply_roman_to_urdu_rules(word)
                converted_words.append(converted)
        
        return ' '.join(converted_words)
    
    def _apply_roman_to_urdu_rules(self, word: str) -> str:
        """
        Apply conversion rules for Roman Urdu to Urdu script.
        
        Args:
            word: Roman Urdu word
            
        Returns:
            Urdu script word
        """
        # Character mapping for Roman Urdu to Urdu
        char_map = {
            'a': 'ا', 'b': 'ب', 'c': 'ک', 'd': 'د', 'e': 'ے',
            'f': 'ف', 'g': 'گ', 'h': 'ح', 'i': 'ی', 'j': 'ج',
            'k': 'ک', 'l': 'ل', 'm': 'م', 'n': 'ن', 'o': 'و',
            'p': 'پ', 'q': 'ق', 'r': 'ر', 's': 'س', 't': 'ت',
            'u': 'ؤ', 'v': 'و', 'w': 'و', 'x': 'کس', 'y': 'ی',
            'z': 'ز', 'ch': 'چ', 'kh': 'خ', 'gh': 'غ', 'ph': 'ف',
            'th': 'تھ', 'zh': 'ژ', 'sh': 'ش', 'zh': 'ژ',
            'ai': 'ئے', 'ae': 'ئے', 'ao': 'اؤ', 'au': 'اؤ',
            'ee': 'ی', 'ei': 'ئی', 'ie': 'ئے', 'oa': 'وا',
            'oo': 'و', 'ou': 'ؤ', 'ui': 'وئی', 'yi': 'یی',
        }
        
        result = []
        i = 0
        word_lower = word.lower()
        
        while i < len(word_lower):
            # Try two-character matches first
            if i + 1 < len(word_lower):
                two_char = word_lower[i:i+2]
                if two_char in char_map:
                    result.append(char_map[two_char])
                    i += 2
                    continue
            
            # Single character match
            char = word_lower[i]
            if char in char_map:
                result.append(char_map[char])
            else:
                result.append(char)
            i += 1
        
        converted = ''.join(result)
        
        # Return original if conversion seems poor
        if len(converted) < len(word) * 0.5:
            return word
        
        return converted
    
    def urdu_to_roman(self, text: str) -> str:
        """
        Convert Urdu script to Roman Urdu.
        
        Args:
            text: Urdu script text
            
        Returns:
            Roman Urdu text
        """
        if not text:
            return text
        
        words = text.split()
        converted_words = []
        
        for word in words:
            # Check if word is in reverse dictionary
            if word in self.urdu_to_roman:
                converted_words.append(self.urdu_to_roman[word])
            else:
                # Apply reverse rules
                converted = self._apply_urdu_to_roman_rules(word)
                converted_words.append(converted)
        
        return ' '.join(converted_words)
    
    def _apply_urdu_to_roman_rules(self, word: str) -> str:
        """
        Apply conversion rules for Urdu to Roman Urdu.
        
        Args:
            word: Urdu script word
            
        Returns:
            Roman Urdu word
        """
        # Character mapping for Urdu to Roman Urdu
        char_map = {
            'ا': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ٹ': 't',
            'ث': 's', 'ج': 'j', 'چ': 'ch', 'ح': 'h', 'خ': 'kh',
            'د': 'd', 'ڈ': 'd', 'ذ': 'z', 'ر': 'r', 'ڑ': 'r',
            'ز': 'z', 'ژ': 'zh', 'س': 's', 'ش': 'sh', 'ص': 's',
            'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh',
            'ف': 'f', 'ق': 'q', 'ک': 'k', 'گ': 'g', 'ل': 'l',
            'م': 'm', 'ن': 'n', 'ں': 'n', 'و': 'o', 'ہ': 'h',
            'ھ': 'h', 'ی': 'i', 'ے': 'e', 'ء': '', 'ئ': 'i',
            'ؤ': 'o', 'آ': 'aa', 'ۓ': 'e', 'ة': 't',
        }
        
        result = []
        for char in word:
            if char in char_map:
                result.append(char_map[char])
            else:
                result.append(char)
        
        return ''.join(result)
    
    def translate_to_english(self, text: str) -> str:
        """
        Translate Urdu/Roman Urdu text to English for legal retrieval.
        Uses phrase matching and common legal-term translation.
        """

        if not text:
            return text

        # Normalize input
        text_lower = text.lower().strip()

        # Common Roman Urdu legal phrases
        phrase_map = {
            "chori ki saza": "theft punishment Pakistan Penal Code Section 379",
            "chor ki saza": "punishment for thief Pakistan Penal Code Section 379",
            "chori ki punishment": "theft punishment Pakistan Penal Code Section 379",
            "chori": "theft",
            "saza": "punishment",
            "jurm": "offence",
            "qanoon": "law",
            "kanun": "law",
            "qanooni": "legal",
            "qaid": "imprisonment",
            "jail": "imprisonment",
            "giraftar": "arrest",
            "giriftar": "arrest",
            "muqadma": "case",
            "adalat": "court",
            "wakeel": "lawyer",
            "vakil": "lawyer",
            "saboot": "evidence",
            "gawahi": "testimony",
            "mulzim": "accused",
            "ilzam": "charge",
            "zamanat": "bail",
            "jurmana": "fine",
            "qatl": "murder",
            "daka": "robbery",
            "dakaiti": "robbery",
            "dhoka": "fraud",
            "talaq": "divorce",
            "khula": "khula",
            "jaidad": "property",
            "zameen": "land",
            "kiraya": "rent",
            "warasat": "inheritance",
            "hissa": "share",
            "haq": "right",
            "police": "police",
            "fir": "FIR",
        }

        # First handle complete legal phrases
        translated_text = text_lower

        for phrase, translation in phrase_map.items():
            translated_text = translated_text.replace(phrase, translation)

        # Clean extra punctuation/spaces
        translated_text = re.sub(r'[?؟!.,]+', ' ', translated_text)
        translated_text = re.sub(r'\s+', ' ', translated_text).strip()

        return translated_text
    
    def translate_to_urdu(self, text: str) -> str:
        """
        Translate English text to Urdu.
        
        Args:
            text: English text
            
        Returns:
            Urdu translation
        """
        # For now, return the text as-is
        # In production, integrate with a translation API or model
        
        # Simple word-by-word translation for common terms
        words = text.split()
        translated_words = []
        
        for word in words:
            word_lower = word.lower()
            # Check if word is in Roman Urdu dictionary
            if word_lower in self.roman_urdu_dict:
                translated_words.append(self.roman_urdu_dict[word_lower])
            else:
                # Keep original word
                translated_words.append(word)
        
        translated_text = ' '.join(translated_words)
        
        # For better translation, use Google Translate API in production
        # from googletrans import Translator
        # translator = Translator()
        # result = translator.translate(text, src='en', dest='ur')
        # return result.text
        
        return translated_text
    
    def normalize_text(self, text: str, language: str = None) -> str:
        """
        Normalize text based on language.
        
        Args:
            text: Input text
            language: Language code (optional, will auto-detect if not provided)
            
        Returns:
            Normalized text
        """
        if not text:
            return text
        
        if language is None:
            language = self.detect_language(text)
        
        # Common normalization
        text = text.strip()
        text = re.sub(r'\s+', ' ', text)  # Normalize whitespace
        
        if language == 'ur':
            # Urdu-specific normalization
            text = self._normalize_urdu(text)
        elif language == 'roman_urdu':
            # Roman Urdu normalization
            text = self._normalize_roman_urdu(text)
        else:
            # English normalization
            text = text.lower()
        
        return text
    
    def _normalize_urdu(self, text: str) -> str:
        """Normalize Urdu text"""
        # Replace common variant characters
        replacements = {
            'ۂ': 'ہ',
            'ۓ': 'ے',
            'ﻻ': 'لا',
            'ﻼ': 'لا',
        }
        for old, new in replacements.items():
            text = text.replace(old, new)
        
        # Normalize Arabic digits to Urdu digits
        arabic_to_urdu_digits = str.maketrans('٠١٢٣٤٥٦٧٨٩', '۰۱۲۳۴۵۶۷۸۹')
        text = text.translate(arabic_to_urdu_digits)
        
        return text
    
    def _normalize_roman_urdu(self, text: str) -> str:
        """Normalize Roman Urdu text"""
        # Convert to lowercase
        text = text.lower()
        
        # Normalize common variations
        replacements = {
            'aa': 'a',
            'ii': 'i',
            'uu': 'u',
            'ee': 'i',
            'oo': 'u',
            'kh': 'kh',
            'gh': 'gh',
            'ch': 'ch',
            'zh': 'zh',
            'sh': 'sh',
            'th': 'th',
            'ph': 'ph',
        }
        
        for old, new in replacements.items():
            text = text.replace(old, new)
        
        return text
    
    def transliterate(self, text: str, source: str, target: str) -> str:
        """
        Transliterate text between scripts.
        
        Args:
            text: Input text
            source: Source script ('roman_urdu', 'urdu')
            target: Target script ('roman_urdu', 'urdu')
            
        Returns:
            Transliterated text
        """
        if source == target:
            return text
        
        if source == 'roman_urdu' and target == 'urdu':
            return self.roman_to_urdu(text)
        elif source == 'urdu' and target == 'roman_urdu':
            return self.urdu_to_roman(text)
        else:
            raise ValueError(f"Unsupported transliteration: {source} -> {target}")
    
    def get_language_name(self, code: str) -> str:
        """Get the full name of a language code"""
        return SUPPORTED_LANGUAGES.get(code, 'Unknown')
    
    def detect_script(self, text: str) -> str:
        """
        Detect the script type of the text.
        
        Args:
            text: Input text
            
        Returns:
            Script type: 'arabic', 'latin', 'mixed', or 'other'
        """
        has_arabic = bool(self.urdu_pattern.search(text))
        has_latin = bool(re.search(r'[a-zA-Z]', text))
        
        if has_arabic and has_latin:
            return 'mixed'
        elif has_arabic:
            return 'arabic'
        elif has_latin:
            return 'latin'
        else:
            return 'other'
