"""
Document Processor Module
=========================
Handles PDF, DOC, DOCX, and TXT file parsing and processing.
Extracts text and metadata from legal documents.
"""

import os
import io
import re
import logging
import hashlib
from typing import Dict, List, Optional, Any
from datetime import datetime
import uuid

# PDF processing
try:
    from pypdf import PdfReader
    PYPDF_AVAILABLE = True
except ImportError:
    PYPDF_AVAILABLE = False
    logging.warning("pypdf not available, PDF processing will be limited")

# Word document processing
try:
    from docx import Document as DocxDocument
    DOCX_AVAILABLE = True
except ImportError:
    DOCX_AVAILABLE = False
    logging.warning("python-docx not available, DOCX processing will be limited")

logger = logging.getLogger(__name__)


class DocumentProcessor:
    """
    Process and extract text from various document formats.
    Supports PDF, DOC, DOCX, and TXT files.
    """
    
    # Supported file extensions
    SUPPORTED_EXTENSIONS = {
        '.pdf': 'PDF',
        '.doc': 'DOC',
        '.docx': 'DOCX',
        '.txt': 'TXT',
        '.rtf': 'RTF',
        '.html': 'HTML',
        '.htm': 'HTML'
    }
    
    def __init__(self):
        """Initialize the document processor"""
        self.processed_documents = {}
        logger.info("Document Processor initialized")
    
    def process_uploaded_file(self, file, description: str = "") -> Dict:
        """
        Process an uploaded file.
        
        Args:
            file: File object from Flask request
            description: Optional description
            
        Returns:
            Dictionary with extracted data
        """
        filename = file.filename
        file_extension = os.path.splitext(filename)[1].lower()
        
        logger.info(f"Processing file: {filename}")
        
        # Validate file extension
        if file_extension not in self.SUPPORTED_EXTENSIONS:
            return {
                "success": False,
                "error": f"Unsupported file type: {file_extension}",
                "supported_types": list(self.SUPPORTED_EXTENSIONS.keys())
            }
        
        try:
            # Read file content
            file_content = file.read()
            file.seek(0)  # Reset file pointer
            
            # Generate document ID
            document_id = self._generate_document_id(file_content)
            
            # Extract text based on file type
            if file_extension == '.pdf':
                extraction_result = self._extract_from_pdf(file_content)
            elif file_extension in ['.doc', '.docx']:
                extraction_result = self._extract_from_docx(file_content)
            elif file_extension == '.txt':
                extraction_result = self._extract_from_txt(file_content)
            elif file_extension in ['.html', '.htm']:
                extraction_result = self._extract_from_html(file_content)
            else:
                return {
                    "success": False,
                    "error": f"Handler not implemented for: {file_extension}"
                }
            
            if not extraction_result['success']:
                return extraction_result
            
            # Process extracted text
            extracted_text = extraction_result['text']
            metadata = extraction_result.get('metadata', {})
            
            # Generate summary
            summary = self._generate_summary(extracted_text)
            
            # Extract key points
            key_points = self._extract_key_points(extracted_text)
            
            # Detect document type
            doc_type = self._detect_document_type(extracted_text, filename)
            
            # Build result
            result = {
                "success": True,
                "document_id": document_id,
                "filename": filename,
                "file_type": self.SUPPORTED_EXTENSIONS[file_extension],
                "file_size": len(file_content),
                "description": description,
                "extracted_text": extracted_text,
                "text_length": len(extracted_text),
                "summary": summary,
                "key_points": key_points,
                "document_type": doc_type,
                "metadata": {
                    **metadata,
                    "processed_at": datetime.now().isoformat(),
                    "pages": extraction_result.get('pages', 1),
                    "word_count": len(extracted_text.split())
                }
            }
            
            # Store in memory
            self.processed_documents[document_id] = result
            
            logger.info(f"Successfully processed: {filename}")
            return result
        
        except Exception as e:
            logger.error(f"Error processing file {filename}: {e}", exc_info=True)
            return {
                "success": False,
                "error": f"Failed to process file: {str(e)}"
            }
    
    def _extract_from_pdf(self, file_content: bytes) -> Dict:
        """Extract text from PDF file"""
        if not PYPDF_AVAILABLE:
            return {
                "success": False,
                "error": "PDF processing library not available"
            }
        
        try:
            pdf_file = io.BytesIO(file_content)
            reader = PdfReader(pdf_file)
            
            text_parts = []
            metadata = {}
            
            # Extract metadata
            if reader.metadata:
                metadata = {
                    'title': reader.metadata.get('/Title', ''),
                    'author': reader.metadata.get('/Author', ''),
                    'subject': reader.metadata.get('/Subject', ''),
                    'creator': reader.metadata.get('/Creator', ''),
                    'producer': reader.metadata.get('/Producer', ''),
                    'creation_date': str(reader.metadata.get('/CreationDate', '')),
                }
            
            # Extract text from each page
            for page_num, page in enumerate(reader.pages, 1):
                try:
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(f"\n--- Page {page_num} ---\n{page_text}")
                except Exception as e:
                    logger.warning(f"Error extracting page {page_num}: {e}")
            
            full_text = "\n".join(text_parts)
            
            # Clean extracted text
            full_text = self._clean_text(full_text)
            
            return {
                "success": True,
                "text": full_text,
                "metadata": metadata,
                "pages": len(reader.pages)
            }
        
        except Exception as e:
            logger.error(f"Error extracting PDF: {e}")
            return {
                "success": False,
                "error": f"PDF extraction failed: {str(e)}"
            }
    
    def _extract_from_docx(self, file_content: bytes) -> Dict:
        """Extract text from DOCX file"""
        if not DOCX_AVAILABLE:
            return {
                "success": False,
                "error": "DOCX processing library not available"
            }
        
        try:
            doc_file = io.BytesIO(file_content)
            doc = DocxDocument(doc_file)
            
            text_parts = []
            
            # Extract text from paragraphs
            for para in doc.paragraphs:
                if para.text.strip():
                    text_parts.append(para.text)
            
            # Extract text from tables
            for table in doc.tables:
                for row in table.rows:
                    row_text = []
                    for cell in row.cells:
                        if cell.text.strip():
                            row_text.append(cell.text.strip())
                    if row_text:
                        text_parts.append(" | ".join(row_text))
            
            full_text = "\n".join(text_parts)
            full_text = self._clean_text(full_text)
            
            # Extract metadata
            metadata = {
                'title': doc.core_properties.title or '',
                'author': doc.core_properties.author or '',
                'subject': doc.core_properties.subject or '',
                'created': str(doc.core_properties.created) if doc.core_properties.created else '',
                'modified': str(doc.core_properties.modified) if doc.core_properties.modified else '',
            }
            
            return {
                "success": True,
                "text": full_text,
                "metadata": metadata,
                "pages": 1  # DOCX doesn't have explicit page count
            }
        
        except Exception as e:
            logger.error(f"Error extracting DOCX: {e}")
            return {
                "success": False,
                "error": f"DOCX extraction failed: {str(e)}"
            }
    
    def _extract_from_txt(self, file_content: bytes) -> Dict:
        """Extract text from TXT file"""
        try:
            # Try different encodings
            encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
            text = None
            
            for encoding in encodings:
                try:
                    text = file_content.decode(encoding)
                    break
                except UnicodeDecodeError:
                    continue
            
            if text is None:
                return {
                    "success": False,
                    "error": "Could not decode text file"
                }
            
            text = self._clean_text(text)
            
            return {
                "success": True,
                "text": text,
                "metadata": {},
                "pages": 1
            }
        
        except Exception as e:
            logger.error(f"Error extracting TXT: {e}")
            return {
                "success": False,
                "error": f"TXT extraction failed: {str(e)}"
            }
    
    def _extract_from_html(self, file_content: bytes) -> Dict:
        """Extract text from HTML file"""
        try:
            from bs4 import BeautifulSoup
            
            # Try different encodings
            encodings = ['utf-8', 'latin-1', 'cp1252']
            soup = None
            
            for encoding in encodings:
                try:
                    html = file_content.decode(encoding)
                    soup = BeautifulSoup(html, 'html.parser')
                    break
                except (UnicodeDecodeError, Exception):
                    continue
            
            if soup is None:
                return {
                    "success": False,
                    "error": "Could not parse HTML file"
                }
            
            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.decompose()
            
            # Get text
            text = soup.get_text()
            
            # Clean up whitespace
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = '\n'.join(chunk for chunk in chunks if chunk)
            
            text = self._clean_text(text)
            
            # Extract title
            title = ""
            if soup.title:
                title = soup.title.string
            
            return {
                "success": True,
                "text": text,
                "metadata": {'title': title},
                "pages": 1
            }
        
        except ImportError:
            return {
                "success": False,
                "error": "BeautifulSoup not available for HTML parsing"
            }
        except Exception as e:
            logger.error(f"Error extracting HTML: {e}")
            return {
                "success": False,
                "error": f"HTML extraction failed: {str(e)}"
            }
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize extracted text"""
        if not text:
            return ""
        
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove excessive newlines
        text = re.sub(r'\n{3,}', '\n\n', text)
        
        # Remove null bytes
        text = text.replace('\x00', '')
        
        # Strip whitespace
        text = text.strip()
        
        return text
    
    def _generate_summary(self, text: str, max_length: int = 500) -> str:
        """Generate a summary of the document"""
        if not text:
            return ""
        
        # Simple extractive summary - first few sentences
        sentences = re.split(r'(?<=[.!?])\s+', text)
        
        summary_parts = []
        current_length = 0
        
        for sentence in sentences[:5]:  # First 5 sentences
            if current_length + len(sentence) > max_length:
                break
            summary_parts.append(sentence)
            current_length += len(sentence)
        
        return ' '.join(summary_parts)
    
    def _extract_key_points(self, text: str) -> List[str]:
        """Extract key legal points from the document"""
        key_points = []
        
        # Look for common legal keywords and their context
        legal_patterns = [
            r'(?:Section|Article|Clause)\s+\d+[.:]?\s*([^\n.]{10,200})',
            r'(?:shall|must|may not|prohibited|required)\s+([^\n.]{10,200})',
            r'(?:penalty|punishment|fine|imprisonment)\s+([^\n.]{10,200})',
            r'(?:rights?|duties?|obligations?)\s+([^\n.]{10,200})',
        ]
        
        for pattern in legal_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches[:3]:  # Limit matches per pattern
                point = match.strip()
                if len(point) > 20 and point not in key_points:
                    key_points.append(point)
        
        # Limit total key points
        return key_points[:10]
    
    def _detect_document_type(self, text: str, filename: str) -> str:
        """Detect the type of legal document"""
        text_lower = text.lower()
        filename_lower = filename.lower()
        
        # Check filename first
        if 'judgment' in filename_lower or 'order' in filename_lower:
            return 'Court Judgment'
        elif 'petition' in filename_lower:
            return 'Petition'
        elif 'contract' in filename_lower or 'agreement' in filename_lower:
            return 'Contract'
        elif 'act' in filename_lower or 'ordinance' in filename_lower:
            return 'Legislation'
        elif 'plaint' in filename_lower:
            return 'Plaint'
        elif 'written statement' in filename_lower:
            return 'Written Statement'
        
        # Check content
        if 'in the court of' in text_lower or 'hon\'ble' in text_lower:
            return 'Court Document'
        elif 'whereas' in text_lower and 'hereinafter' in text_lower:
            return 'Contract/Agreement'
        elif 'section' in text_lower and 'act' in text_lower:
            return 'Legal Reference'
        elif 'petitioner' in text_lower and 'respondent' in text_lower:
            return 'Petition'
        
        return 'Legal Document'
    
    def _generate_document_id(self, content: bytes) -> str:
        """Generate a unique document ID"""
        hash_obj = hashlib.sha256(content).hexdigest()[:16]
        return f"doc_{hash_obj}_{uuid.uuid4().hex[:8]}"
    
    def get_document(self, document_id: str) -> Optional[Dict]:
        """Get a processed document by ID"""
        return self.processed_documents.get(document_id)
    
    def list_documents(self) -> List[Dict]:
        """List all processed documents"""
        return [
            {
                "document_id": doc_id,
                "filename": info['filename'],
                "document_type": info['document_type'],
                "processed_at": info['metadata']['processed_at']
            }
            for doc_id, info in self.processed_documents.items()
        ]
    
    def delete_document(self, document_id: str) -> bool:
        """Delete a processed document"""
        if document_id in self.processed_documents:
            del self.processed_documents[document_id]
            return True
        return False
    
    def chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
        """Split text into overlapping chunks"""
        chunks = []
        start = 0
        
        while start < len(text):
            end = start + chunk_size
            chunk = text[start:end]
            chunks.append(chunk)
            start = end - overlap
        
        return chunks
