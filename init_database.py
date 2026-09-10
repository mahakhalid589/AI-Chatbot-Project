"""
Database Initialization Script
==============================
Initialize the vector database with Pakistani laws.
Run this script to populate the database with all available laws.
"""

import os
import sys
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import RAW_DATA_DIR, PROCESSED_DATA_DIR, VECTOR_DB_DIR
from models.legal_retriever import LegalRetriever
from scrapers.pakistan_code import PakistanCodeScraper
from scrapers.na_gov import NationalAssemblyScraper
from scrapers.provincial import ProvincialLawsScraper


def init_directories():
    """Create necessary directories"""
    for dir_path in [RAW_DATA_DIR, PROCESSED_DATA_DIR, VECTOR_DB_DIR]:
        dir_path.mkdir(parents=True, exist_ok=True)
        logger.info(f"Directory ready: {dir_path}")


def scrape_pakistan_code():
    """Scrape laws from Pakistan Code"""
    logger.info("=" * 60)
    logger.info("SCRAPING PAKISTAN CODE")
    logger.info("=" * 60)
    
    scraper = PakistanCodeScraper()
    laws = scraper.scrape_all_laws()
    
    logger.info(f"Scraped {len(laws)} laws from Pakistan Code")
    return laws


def scrape_na_bills():
    """Scrape bills from National Assembly"""
    logger.info("=" * 60)
    logger.info("SCRAPING NATIONAL ASSEMBLY BILLS")
    logger.info("=" * 60)
    
    scraper = NationalAssemblyScraper()
    bills = scraper.scrape_bills()
    
    logger.info(f"Scraped {len(bills)} bills from National Assembly")
    return bills


def scrape_provincial_laws():
    """Scrape provincial laws"""
    logger.info("=" * 60)
    logger.info("SCRAPING PROVINCIAL LAWS")
    logger.info("=" * 60)
    
    scraper = ProvincialLawsScraper()
    results = scraper.scrape_all_provinces()
    
    total_laws = sum(len(laws) for laws in results.values())
    logger.info(f"Scraped {total_laws} provincial laws")
    return results


def populate_vector_database(all_laws: list):
    """Populate vector database with laws"""
    logger.info("=" * 60)
    logger.info("POPULATING VECTOR DATABASE")
    logger.info("=" * 60)
    
    retriever = LegalRetriever()
    
    documents = []
    for law in all_laws:
        # Create document for each law
        doc_text = law.get('full_text', '')
        if not doc_text:
            continue
        
        metadata = {
            'title': law.get('title', 'Unknown'),
            'source': law.get('source', 'Unknown Source'),
            'source_url': law.get('source_url', ''),
            'year': law.get('year', 'N/A'),
            'category': law.get('category', 'General'),
            'type': law.get('type', 'Law'),
            'province': law.get('province', 'Federal')
        }
        
        documents.append({
            'text': doc_text,
            'metadata': metadata
        })
    
    if documents:
        logger.info(f"Adding {len(documents)} documents to vector database...")
        retriever.add_documents_batch(documents)
        logger.info("Vector database populated successfully!")
    else:
        logger.warning("No documents to add to vector database")
    
    # Get stats
    stats = retriever.get_collection_stats()
    logger.info(f"Database stats: {stats}")


def load_existing_laws():
    """Load already scraped laws from disk"""
    all_laws = []
    
    # Load Pakistan Code laws
    pc_scraper = PakistanCodeScraper()
    pc_laws = pc_scraper.load_laws()
    all_laws.extend(pc_laws)
    logger.info(f"Loaded {len(pc_laws)} Pakistan Code laws from disk")
    
    # Load NA bills
    na_scraper = NationalAssemblyScraper()
    na_bills = na_scraper.load_bills()
    all_laws.extend(na_bills)
    logger.info(f"Loaded {len(na_bills)} NA bills from disk")
    
    # Load provincial laws
    prov_scraper = ProvincialLawsScraper()
    prov_laws = prov_scraper.load_provincial_laws()
    all_laws.extend(prov_laws)
    logger.info(f"Loaded {len(prov_laws)} provincial laws from disk")
    
    return all_laws


def main():
    """Main initialization function"""
    logger.info("=" * 60)
    logger.info("PAKISTAN LEGAL AI - DATABASE INITIALIZATION")
    logger.info("=" * 60)
    
    # Initialize directories
    init_directories()
    
    all_laws = []
    
    # Ask user what to do
    print("\nOptions:")
    print("1. Scrape all laws fresh (takes time)")
    print("2. Use existing scraped laws")
    print("3. Scrape + populate database")
    print("4. Populate database only (from existing files)")
    
    choice = input("\nEnter your choice (1-4): ").strip()
    
    if choice == '1':
        # Scrape all laws fresh
        pc_laws = scrape_pakistan_code()
        na_bills = scrape_na_bills()
        prov_results = scrape_provincial_laws()
        
        all_laws.extend(pc_laws)
        all_laws.extend(na_bills)
        for province_laws in prov_results.values():
            all_laws.extend(province_laws)
        
        logger.info(f"Total laws scraped: {len(all_laws)}")
        
    elif choice == '2':
        # Just show existing laws
        all_laws = load_existing_laws()
        logger.info(f"Total laws loaded: {len(all_laws)}")
        
    elif choice == '3':
        # Scrape and populate
        pc_laws = scrape_pakistan_code()
        na_bills = scrape_na_bills()
        prov_results = scrape_provincial_laws()
        
        all_laws.extend(pc_laws)
        all_laws.extend(na_bills)
        for province_laws in prov_results.values():
            all_laws.extend(province_laws)
        
        populate_vector_database(all_laws)
        
    elif choice == '4':
        # Populate from existing files
        all_laws = load_existing_laws()
        populate_vector_database(all_laws)
        
    else:
        logger.error("Invalid choice")
        return
    
    logger.info("=" * 60)
    logger.info("INITIALIZATION COMPLETE")
    logger.info("=" * 60)
    logger.info(f"Total laws in database: {len(all_laws)}")


if __name__ == '__main__':
    main()
