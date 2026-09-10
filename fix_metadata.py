"""
Fix Metadata - Extract proper law titles from PDF content (FULL VERSION)
Updates random filenames like 'administrator7db1e56f...' to actual law names
Processes ALL laws, not just first 20
"""
import os
import sys
import re
import PyPDF2

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    import chromadb
    from sentence_transformers import SentenceTransformer
except ImportError:
    print("❌ Required libraries not found. Run: pip install chromadb sentence-transformers PyPDF2")
    sys.exit(1)

def extract_law_title_from_pdf(pdf_path):
    """Extract the actual law title from the first page of PDF"""
    try:
        with open(pdf_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            if len(reader.pages) == 0:
                return None

            text = reader.pages[0].extract_text()
            if not text:
                return None

            lines = [line.strip() for line in text.split('\n') if line.strip()]

            for i, line in enumerate(lines[:15]):
                line = line.strip()
                if len(line) < 10 or line.isdigit():
                    continue

                law_keywords = ['ACT', 'CODE', 'ORDINANCE', 'CONSTITUTION', 'RULES', 'REGULATION', 
                               'PAKISTAN', 'AMENDMENT', 'LAW', 'ACT,', 'CODE,']

                if any(keyword in line.upper() for keyword in law_keywords):
                    title = line.replace('_', ' ').strip()
                    title = ' '.join(title.split())

                    if len(title) > 100:
                        title = title[:100]

                    return title

            for line in lines:
                if len(line) > 15 and len(line) < 200:
                    return line.replace('_', ' ').strip()

    except Exception as e:
        pass

    return None

def fix_metadata():
    print("🔧 METADATA FIXER - Processing ALL 972 Laws")
    print("=" * 70)
    print("Estimated time: 10-15 minutes")
    print("Progress shown every 50 laws")
    print("=" * 70)

    try:
        client = chromadb.PersistentClient(path="data/chroma_db")
        collection = client.get_collection("legal_documents")
    except Exception as e:
        print(f"❌ Failed to connect to database: {e}")
        return

    results = collection.get()

    if not results or not results['metadatas']:
        print("❌ No documents found!")
        return

    metadatas = results['metadatas']
    ids = results['ids']

    updates_needed = []

    for i, meta in enumerate(metadatas):
        if not meta:
            continue

        title = meta.get('title', '')
        file_path = meta.get('file_path', '')

        is_random = (
            'administrator' in title.lower() or 
            (len(title) > 30 and any(c in title for c in '0123456789abcdef'))
        )

        if is_random and file_path and os.path.exists(file_path):
            updates_needed.append({
                'id': ids[i],
                'index': i,
                'old_title': title,
                'file_path': file_path
            })

    total = len(updates_needed)
    
    if not updates_needed:
        print("✅ No random filenames found! All laws have proper titles.")
        return

    print(f"\n📝 Found {total} documents with random filenames")
    print("Extracting proper titles from PDF content...\n")

    fixed_count = 0
    failed_count = 0

    # Process ALL laws (removed [:20] limit)
    for idx, item in enumerate(updates_needed, 1):
        if idx % 50 == 0 or idx == 1 or idx == total:
            print(f"\n📦 Progress: {idx}/{total} ({(idx/total)*100:.1f}%) | Fixed: {fixed_count} | Failed: {failed_count}")
        
        proper_title = extract_law_title_from_pdf(item['file_path'])

        if proper_title:
            try:
                current_meta = metadatas[item['index']].copy()
                current_meta['title'] = proper_title
                current_meta['original_filename'] = item['old_title']

                collection.update(
                    ids=[item['id']],
                    metadatas=[current_meta]
                )
                fixed_count += 1
                
                if idx % 10 == 0:
                    print(f"   ✅ {proper_title[:60]}...")
                    
            except Exception as e:
                failed_count += 1
        else:
            failed_count += 1

    print("\n" + "=" * 70)
    print("🎉 COMPLETE!")
    print(f"✅ Fixed: {fixed_count}")
    print(f"❌ Failed: {failed_count}")
    print(f"📊 Total processed: {total}")
    print("\n✨ Your AI will now cite laws with proper names!")
    print("   Example: 'According to the Pakistan Penal Code...'")
    print("\n💡 Run 'python verify_database.py' to confirm the fix")

if __name__ == "__main__":
    fix_metadata()