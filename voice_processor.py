"""
Voice Processor Module
======================
Production-ready Urdu/English speech recognition using OpenAI Whisper.
Supports async processing, multiple audio formats, and proper resource cleanup.
"""

import os
import io
import sys
import shutil
import logging
import tempfile
import asyncio
from pathlib import Path
from typing import Dict, Optional, Any, Union
from dataclasses import dataclass
from concurrent.futures import ThreadPoolExecutor

# Configure logging before anything else
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# --- Optional Dependencies with Graceful Fallbacks ---
try:
    import speech_recognition as sr
    SPEECH_RECOGNITION_AVAILABLE = True
except ImportError:
    SPEECH_RECOGNITION_AVAILABLE = False
    logger.warning("speech_recognition not installed. Mic recording unavailable.")

try:
    from pydub import AudioSegment
    PYDUB_AVAILABLE = True
except ImportError:
    PYDUB_AVAILABLE = False
    logger.warning("pydub not installed. Format conversion limited.")

try:
    import whisper
    WHISPER_AVAILABLE = True
except ImportError:
    WHISPER_AVAILABLE = False
    logger.warning("openai-whisper not installed. Run: pip install openai-whisper")

# Import config
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
try:
    from config import VOICE_CONFIG
except ImportError:
    VOICE_CONFIG = {}


@dataclass
class TranscriptionResult:
    """Structured result from transcription."""
    success: bool
    transcript: str = ""
    detected_language: str = "unknown"
    confidence: float = 0.0
    engine: str = ""
    model: Optional[str] = None
    error: Optional[str] = None


class VoiceProcessor:
    """
    Production voice processor with async support and cross-platform compatibility.
    """
    
    SUPPORTED_FORMATS = {
        '.wav': 'wav',
        '.mp3': 'mp3',
        '.ogg': 'ogg',
        '.m4a': 'm4a',
        '.flac': 'flac',
        '.webm': 'webm',
        '.mp4': 'mp4',
        '.mpeg': 'mpeg',
    }
    
    def __init__(self, model_size: Optional[str] = None):
        """
        Initialize voice processor.
        
        Args:
            model_size: Whisper model size (tiny, base, small, medium, large)
                       'tiny' = fastest, 'large' = most accurate
        """
        self.model_size = model_size or VOICE_CONFIG.get('model', 'base')
        self.sample_rate = VOICE_CONFIG.get('sample_rate', 16000)
        self.language_code = VOICE_CONFIG.get('language_code', 'ur-PK')
        
        self.whisper_model = None
        self.recognizer = None
        self._executor = ThreadPoolExecutor(max_workers=2)
        self._temp_dir = tempfile.gettempdir()
        
        # Check system dependencies
        self._ffmpeg_available = shutil.which("ffmpeg") is not None
        if not self._ffmpeg_available:
            logger.warning("FFmpeg not found in PATH. Install it for full format support.")
        
        # Load Whisper model
        if WHISPER_AVAILABLE:
            try:
                logger.info(f"Loading Whisper model: {self.model_size}")
                self.whisper_model = whisper.load_model(self.model_size)
                logger.info("Whisper model loaded successfully")
            except Exception as e:
                logger.error(f"Failed to load Whisper model: {e}")
        else:
            logger.warning("Whisper unavailable. Install with: pip install openai-whisper")
        
        # Initialize SpeechRecognition fallback
        if SPEECH_RECOGNITION_AVAILABLE:
            self.recognizer = sr.Recognizer()
            self.recognizer.energy_threshold = 300
            self.recognizer.dynamic_energy_threshold = True
        
        logger.info("Voice Processor initialized")
    
    def is_available(self) -> Dict[str, Any]:
        """Check which capabilities are available."""
        return {
            "whisper": WHISPER_AVAILABLE and self.whisper_model is not None,
            "speech_recognition": SPEECH_RECOGNITION_AVAILABLE,
            "pydub": PYDUB_AVAILABLE,
            "ffmpeg": self._ffmpeg_available,
            "model_size": self.model_size if self.whisper_model else None,
            "model_loaded": self.whisper_model is not None,
        }
    
    def _get_file_info(self, audio_file: Union[str, Any]) -> tuple:
        """Extract filename and extension from file object or path."""
        if hasattr(audio_file, 'filename'):
            filename = audio_file.filename
        elif hasattr(audio_file, 'name'):
            filename = audio_file.name
        else:
            filename = str(audio_file)
        
        ext = os.path.splitext(filename)[1].lower()
        return filename, ext
    
    def _read_audio_bytes(self, audio_file: Union[str, Any]) -> bytes:
        """Read audio content from file object or path."""
        if hasattr(audio_file, 'read'):
            content = audio_file.read()
            if hasattr(audio_file, 'seek'):
                audio_file.seek(0)
            return content
        else:
            with open(audio_file, 'rb') as f:
                return f.read()
    
    def _convert_to_wav(self, audio_content: bytes, source_format: str) -> Optional[str]:
        """
        Convert any audio format to WAV (mono, 16kHz).
        Returns path to temp WAV file.
        """
        # Already WAV
        if source_format == '.wav':
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as f:
                f.write(audio_content)
                return f.name
        
        # Try pydub first
        if PYDUB_AVAILABLE:
            try:
                audio = AudioSegment.from_file(
                    io.BytesIO(audio_content),
                    format=self.SUPPORTED_FORMATS.get(source_format, 'mp3')
                )
                audio = audio.set_channels(1).set_frame_rate(self.sample_rate)
                
                with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as f:
                    audio.export(f.name, format='wav')
                    return f.name
            except Exception as e:
                logger.warning(f"pydub conversion failed: {e}")
        
        # Fallback to ffmpeg
        if self._ffmpeg_available:
            return self._convert_with_ffmpeg(audio_content, source_format)
        
        logger.error("No conversion method available. Install pydub or ffmpeg.")
        return None
    
    def _convert_with_ffmpeg(self, audio_content: bytes, source_format: str) -> Optional[str]:
        """Convert audio using ffmpeg CLI."""
        import subprocess
        
        src_fd, src_path = tempfile.mkstemp(suffix=source_format)
        dst_fd, dst_path = tempfile.mkstemp(suffix='.wav')
        
        try:
            os.write(src_fd, audio_content)
            os.close(src_fd)
            os.close(dst_fd)
            
            result = subprocess.run(
                [
                    'ffmpeg', '-y', '-i', src_path,
                    '-acodec', 'pcm_s16le',
                    '-ar', str(self.sample_rate),
                    '-ac', '1',
                    dst_path
                ],
                check=True,
                capture_output=True,
                text=True
            )
            return dst_path
            
        except subprocess.CalledProcessError as e:
            logger.error(f"FFmpeg failed: {e.stderr}")
            return None
        except Exception as e:
            logger.error(f"FFmpeg error: {e}")
            return None
        finally:
            try:
                os.close(src_fd)
            except:
                pass
            try:
                os.close(dst_fd)
            except:
                pass
            if os.path.exists(src_path):
                os.remove(src_path)
    
    def _cleanup_temp(self, filepath: Optional[str]) -> None:
        """Safely remove temporary files. Cross-platform."""
        if not filepath:
            return
        try:
            if os.path.exists(filepath) and filepath.startswith(self._temp_dir):
                os.remove(filepath)
                logger.debug(f"Cleaned up temp file: {filepath}")
        except Exception as e:
            logger.warning(f"Failed to clean up temp file {filepath}: {e}")
    
    def _transcribe_whisper(self, audio_path: str, language_hint: str) -> TranscriptionResult:
        """Transcribe using OpenAI Whisper."""
        try:
            language = None if language_hint == 'auto' else language_hint
            
            result = self.whisper_model.transcribe(
                audio_path,
                language=language,
                task='transcribe',
                fp16=False  # Safer for CPU inference
            )
            
            transcript = result.get('text', '').strip()
            detected = result.get('language', 'unknown')
            
            # Better confidence: use no_speech_prob if available
            segments = result.get('segments', [])
            if segments:
                no_speech_probs = [seg.get('no_speech_prob', 0.5) for seg in segments]
                avg_no_speech = sum(no_speech_probs) / len(no_speech_probs)
                confidence = round((1 - avg_no_speech) * 100, 2)
            else:
                confidence = 0.0
            
            # Normalize language codes
            lang_normalize = {
                'ur': 'ur', 'en': 'en', 'hi': 'hi', 
                'ar': 'ar', 'pa': 'pa', 'sd': 'sd'
            }
            detected = lang_normalize.get(detected, detected)
            
            return TranscriptionResult(
                success=True,
                transcript=transcript,
                detected_language=detected,
                confidence=confidence,
                engine="whisper",
                model=self.model_size
            )
            
        except Exception as e:
            logger.error(f"Whisper error: {e}", exc_info=True)
            return TranscriptionResult(
                success=False,
                error=f"Whisper transcription failed: {str(e)}",
                engine="whisper"
            )
    
    def _transcribe_google(self, audio_path: str, language_hint: str) -> TranscriptionResult:
        """Fallback transcription using Google Speech Recognition."""
        try:
            with sr.AudioFile(audio_path) as source:
                audio = self.recognizer.record(source)
            
            lang = 'ur-PK' if language_hint == 'ur' else 'en-US'
            transcript = self.recognizer.recognize_google(audio, language=lang)
            
            return TranscriptionResult(
                success=True,
                transcript=transcript,
                detected_language=language_hint,
                confidence=80.0,  # Google doesn't provide confidence
                engine="google_speech"
            )
            
        except sr.UnknownValueError:
            return TranscriptionResult(
                success=False,
                error="Could not understand audio",
                engine="google_speech"
            )
        except sr.RequestError as e:
            return TranscriptionResult(
                success=False,
                error=f"Google Speech API error: {str(e)}",
                engine="google_speech"
            )
    
    def transcribe(self, audio_file: Union[str, Any], language_hint: str = 'auto') -> TranscriptionResult:
        """
        Synchronous transcription. Blocks thread.
        For web servers, use transcribe_async() instead.
        """
        filename, ext = self._get_file_info(audio_file)
        
        if ext not in self.SUPPORTED_FORMATS:
            return TranscriptionResult(
                success=False,
                error=f"Unsupported format: {ext}. Supported: {list(self.SUPPORTED_FORMATS.keys())}"
            )
        
        wav_path = None
        try:
            audio_content = self._read_audio_bytes(audio_file)
            logger.info(f"Transcribing: {filename} ({len(audio_content)} bytes)")
            
            wav_path = self._convert_to_wav(audio_content, ext)
            if not wav_path:
                return TranscriptionResult(success=False, error="Audio conversion failed")
            
            # Priority: Whisper -> Google -> Fail
            if self.whisper_model:
                result = self._transcribe_whisper(wav_path, language_hint)
            elif self.recognizer:
                result = self._transcribe_google(wav_path, language_hint)
            else:
                result = TranscriptionResult(
                    success=False,
                    error="No transcription engine available"
                )
            
            return result
            
        except Exception as e:
            logger.error(f"Transcription error: {e}", exc_info=True)
            return TranscriptionResult(success=False, error=str(e))
        finally:
            self._cleanup_temp(wav_path)
    
    async def transcribe_async(self, audio_file: Union[str, Any], language_hint: str = 'auto') -> TranscriptionResult:
        """
        Async transcription. Runs in thread pool.
        USE THIS in FastAPI/Flask async routes.
        """
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            self._executor,
            self.transcribe,
            audio_file,
            language_hint
        )
    
    def record_and_transcribe(self, duration: int = 5, language_hint: str = 'auto') -> TranscriptionResult:
        """
        Record from microphone and transcribe.
        Requires speech_recognition and a working microphone.
        """
        if not SPEECH_RECOGNITION_AVAILABLE:
            return TranscriptionResult(
                success=False,
                error="speech_recognition not installed. Run: pip install SpeechRecognition"
            )
        
        wav_path = None
        try:
            with sr.Microphone() as source:
                logger.info(f"Recording for {duration}s... Speak now!")
                self.recognizer.adjust_for_ambient_noise(source, duration=1)
                audio = self.recognizer.listen(source, timeout=duration + 2)
            
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as f:
                f.write(audio.get_wav_data())
                wav_path = f.name
            
            if self.whisper_model:
                return self._transcribe_whisper(wav_path, language_hint)
            else:
                return self._transcribe_google(wav_path, language_hint)
                
        except Exception as e:
            logger.error(f"Recording error: {e}")
            return TranscriptionResult(success=False, error=f"Recording failed: {str(e)}")
        finally:
            self._cleanup_temp(wav_path)
    
    def __del__(self):
        """Cleanup executor on destruction."""
        if hasattr(self, '_executor'):
            self._executor.shutdown(wait=False)


# --- CLI for testing ---
if __name__ == "__main__":
    import json
    
    print("=" * 50)
    print("PakLegal AI - Voice Processor Test")
    print("=" * 50)
    
    # Check capabilities
    vp = VoiceProcessor(model_size="base")
    caps = vp.is_available()
    print("\nCapabilities:")
    for k, v in caps.items():
        status = "✅" if v else "❌"
        print(f"  {status} {k}: {v}")
    
    # Test with file
    import sys
    if len(sys.argv) > 1:
        filepath = sys.argv[1]
        print(f"\nTranscribing: {filepath}")
        result = vp.transcribe(filepath, language_hint='ur')
        print(json.dumps(result.__dict__, indent=2, ensure_ascii=False))
    else:
        print("\nUsage: python voice_processor.py <audio_file>")
        print("Or call record_and_transcribe() from code.")