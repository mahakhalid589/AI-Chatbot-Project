"""
Pakistan Legal AI - Scrapers Package
====================================
Web scrapers for Pakistani legal documents.
"""

from .pakistan_code import PakistanCodeScraper
from .na_gov import NationalAssemblyScraper
from .provincial import ProvincialLawsScraper

__all__ = [
    'PakistanCodeScraper',
    'NationalAssemblyScraper',
    'ProvincialLawsScraper'
]
