"""
Bulk Law Uploader - Add ALL laws to ChromaDB
"""
import os
import sys

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from models.document_processor import DocumentProcessor
    from models.database_manager import DatabaseManager
    print("✅ Backend modules loaded successfully!")
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Trying alternative import...")
    try:
        import chromadb
        from sentence_transformers import SentenceTransformer
        print("✅ Direct imports work - proceeding with custom implementation")
        
        # Simple fallback implementation
        class SimpleDatabase:
            def __init__(self):
                import chromadb
                self.client = chromadb.PersistentClient(path="data/chroma_db")
                try:
                    self.collection = self.client.get_collection("legal_documents")
                except:
                    self.collection = self.client.create_collection("legal_documents")
                print("✅ Connected to ChromaDB")
            
            def add_document(self, text, metadata):
                import hashlib
                doc_id = hashlib.md5(f"{metadata['title']}_{metadata.get('chunk_index',0)}".encode()).hexdigest()
                self.collection.add(
                    documents=[text],
                    metadatas=[metadata],
                    ids=[doc_id]
                )
        
        class SimpleProcessor:
            def split_text(self, text, chunk_size=1000):
                chunks = []
                for i in range(0, len(text), chunk_size):
                    chunks.append(text[i:i+chunk_size])
                return chunks if chunks else [text]
        
        DocumentProcessor = SimpleProcessor
        DatabaseManager = SimpleDatabase
        
    except Exception as e2:
        print(f"❌ Failed: {e2}")
        sys.exit(1)

import json
from pathlib import Path

class BulkLawUploader:
    def __init__(self):
        self.processor = DocumentProcessor()
        self.db = DatabaseManager()
        self.supported_extensions = {'.txt', '.pdf', '.doc', '.docx'}
        self.stats = {'processed': 0, 'skipped': 0, 'failed': 0, 'duplicates': 0}
        self.existing_laws = self.get_existing_laws()
    
    def get_existing_laws(self):
        """Get list of laws already in database"""
        try:
            results = self.db.collection.get()
            if results and 'metadatas' in results and results['metadatas']:
                titles = [meta.get('title', '') for meta in results['metadatas'] if meta]
                return set(titles)
            return set()
        except Exception as e:
            print(f"Note: Could not check existing laws: {e}")
            return set()
    
    def scan_directory(self, directory):
        """Scan directory for law files"""
        files = []
        if not os.path.exists(directory):
            return files
            
        for root, dirs, filenames in os.walk(directory):
            for filename in filenames:
                ext = Path(filename).suffix.lower()
                if ext in self.supported_extensions:
                    files.append(os.path.join(root, filename))
        return files
    
    def extract_metadata(self, filepath):
        """Extract metadata from filename"""
        filename = os.path.basename(filepath)
        import re
        
        year_match = re.search(r'(19|20)\d{2}', filename)
        year = year_match.group(0) if year_match else "Unknown"
        
        title = filename.replace('_', ' ').replace('-', ' ')
        title = re.sub(r'\.(txt|pdf|docx?)$', '', title, flags=re.IGNORECASE)
        title = re.sub(r'^(19|20)\d{2}\s*', '', title)
        
        category = "Federal"
        filepath_lower = filepath.lower()
        if 'provincial' in filepath_lower or 'punjab' in filepath_lower or 'sindh' in filepath_lower or 'kpk' in filepath_lower or 'balochistan' in filepath_lower:
            if 'punjab' in filepath_lower:
                category = "Punjab"
            elif 'sindh' in filepath_lower:
                category = "Sindh"
            elif 'kpk' in filepath_lower or 'khyber' in filepath_lower:
                category = "KPK"
            elif 'balochistan' in filepath_lower:
                category = "Balochistan"
        
        return {
            'title': title.strip(),
            'year': year,
            'category': category,
            'source_file': filename,
            'file_path': filepath
        }
    
    def process_file(self, filepath):
        """Process a single law file"""
        try:
            metadata = self.extract_metadata(filepath)
            
            if metadata['title'] in self.existing_laws:
                print(f"   ⏭️  Duplicate: {metadata['title'][:40]}...")
                self.stats['duplicates'] += 1
                return True
            
            print(f"   📄 {metadata['title'][:50]}...")
            
            ext = Path(filepath).suffix.lower()
            content = ""
            
            if ext == '.txt':
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                except UnicodeDecodeError:
                    with open(filepath, 'r', encoding='latin-1') as f:
                        content = f.read()
                        
            elif ext == '.pdf':
                try:
                    import PyPDF2
                    with open(filepath, 'rb') as f:
                        reader = PyPDF2.PdfReader(f)
                        for page in reader.pages:
                            page_text = page.extract_text()
                            if page_text:
                                content += page_text + "\n"
                except Exception as e:
                    print(f"   ⚠️  PDF error: {str(e)[:50]}")
                    self.stats['failed'] += 1
                    return False
            else:
                self.stats['skipped'] += 1
                return False
            
            if len(content) < 50:
                print(f"   ⚠️  Content too short ({len(content)} chars)")
                self.stats['skipped'] += 1
                return False
            
            # Add to database
            chunks = self.processor.split_text(content)
            
            for i, chunk in enumerate(chunks):
                if len(chunk.strip()) < 10:
                    continue
                    
                chunk_metadata = metadata.copy()
                chunk_metadata['chunk_index'] = i
                chunk_metadata['total_chunks'] = len(chunks)
                
                self.db.add_document(text=chunk, metadata=chunk_metadata)
            
            self.existing_laws.add(metadata['title'])
            self.stats['processed'] += 1
            print(f"   ✅ Added ({len(chunks)} chunks, {len(content)} chars)")
            return True
            
        except Exception as e:
            print(f"   ❌ Error: {str(e)[:50]}")
            self.stats['failed'] += 1
            return False
    
    def upload_all(self, directories):
        """Upload all laws from specified directories"""
        print("🚀 Starting Bulk Law Upload")
        print("=" * 60)
        print(f"📚 Existing laws: {len(self.existing_laws)}")
        print()
        
        all_files = []
        for directory in directories:
            if os.path.exists(directory):
                files = self.scan_directory(directory)
                print(f"📁 {directory}: {len(files)} files")
                all_files.extend(files)
            else:
                print(f"⚠️  Not found: {directory}")
        
        print(f"\n🎯 Total: {len(all_files)} files")
        print("-" * 60)
        
        if not all_files:
            print("❌ No files found! Download laws first.")
            return
        
        for i, filepath in enumerate(all_files, 1):
            print(f"[{i}/{len(all_files)}]", end=" ")
            self.process_file(filepath)
            
            if i % 5 == 0:
                print(f"\n📈 Progress: {i}/{len(all_files)} | Added: {self.stats['processed']} | Dupes: {self.stats['duplicates']}")
        
        print("\n" + "=" * 60)
        print("🎉 COMPLETE!")
        print(f"✅ Added: {self.stats['processed']}")
        print(f"⏭️  Dupes skipped: {self.stats['duplicates']}")
        print(f"⚠️  Skipped: {self.stats['skipped']}")
        print(f"❌ Failed: {self.stats['failed']}")
        print(f"\n📚 Total laws in DB: {len(self.existing_laws)}")

if __name__ == "__main__":
    uploader = BulkLawUploader()
    
    directories = [
        "data/raw",
        "data/raw/provincial/punjab",
        "data/raw/provincial/sindh",
        "data/raw/provincial/kpk",
        "data/raw/provincial/balochistan",
        "data/custom"
    ]
    
    uploader.upload_all(directories)