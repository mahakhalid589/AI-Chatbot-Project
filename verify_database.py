
"""
Verify Database Status - Check if laws were added correctly
"""
import os
import sys

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    import chromadb
    from sentence_transformers import SentenceTransformer

    # Connect to database
    client = chromadb.PersistentClient(path="data/chroma_db")
    collection = client.get_collection("legal_documents")

    # Get all documents
    results = collection.get()

    if not results or not results['metadatas']:
        print("❌ No documents found in database!")
        sys.exit(1)

    total_chunks = len(results['ids'])

    # Extract unique law titles
    titles = {}
    for meta in results['metadatas']:
        if meta and 'title' in meta:
            title = meta['title']
            category = meta.get('category', 'Unknown')
            year = meta.get('year', 'Unknown')

            if title not in titles:
                titles[title] = {
                    'category': category,
                    'year': year,
                    'chunks': 0
                }
            titles[title]['chunks'] += 1

    print("=" * 70)
    print("📊 PAKISTAN LAW DATABASE - VERIFICATION REPORT")
    print("=" * 70)
    print(f"\n📚 Total Law Documents: {len(titles)}")
    print(f"🧩 Total Chunks: {total_chunks}")
    print(f"📄 Average chunks per law: {total_chunks // len(titles) if titles else 0}")

    # Check for problematic titles (random names)
    random_names = []
    proper_names = []

    for title in titles.keys():
        if 'administrator' in title.lower() or len(title) > 30 and any(c in title for c in '0123456789abcdef'):
            random_names.append(title)
        else:
            proper_names.append(title)

    print(f"\n⚠️  Laws with random filenames: {len(random_names)}")
    print(f"✅ Laws with proper names: {len(proper_names)}")

    if random_names:
        print("\n📝 Sample random names (first 5):")
        for name in random_names[:5]:
            print(f"   - {name[:60]}...")

    # Show sample proper names
    print("\n✅ Sample proper law names (first 10):")
    for name in sorted(proper_names)[:10]:
        info = titles[name]
        print(f"   - {name[:50]}... ({info['year']}) [{info['chunks']} chunks]")

    # Categories breakdown
    categories = {}
    for info in titles.values():
        cat = info['category']
        categories[cat] = categories.get(cat, 0) + 1

    print("\n📂 Categories breakdown:")
    for cat, count in sorted(categories.items()):
        print(f"   {cat}: {count} laws")

    print("\n" + "=" * 70)

    # Test search functionality
    print("\n🔍 Testing search...")
    try:
        test_results = collection.query(
            query_texts=["punishment for theft"],
            n_results=3
        )
        if test_results and test_results['documents']:
            print("✅ Search working! Found relevant sections.")
        else:
            print("⚠️  Search returned no results")
    except Exception as e:
        print(f"❌ Search error: {e}")

    print("\n" + "=" * 70)

except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
