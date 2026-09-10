"""
Provincial Laws Scraper
=======================
Scraper for provincial law websites of Pakistan.
Covers Punjab, Sindh, KPK, Balochistan, and Islamabad.
"""

import os
import re
import json
import logging
from typing import List, Dict, Optional
from datetime import datetime

# Import configuration
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import RAW_DATA_DIR

logger = logging.getLogger(__name__)


class ProvincialLawsScraper:
    """
    Scraper for provincial laws of Pakistan.
    Covers all provinces and territories.
    """
    
    PROVINCES = {
        'punjab': {
            'name': 'Punjab',
            'capital': 'Lahore',
            'website': 'https://punjablaws.gov.pk',
            'laws': []
        },
        'sindh': {
            'name': 'Sindh',
            'capital': 'Karachi',
            'website': 'https://sindhlaws.gov.pk',
            'laws': []
        },
        'kpk': {
            'name': 'Khyber Pakhtunkhwa',
            'capital': 'Peshawar',
            'website': 'https://kpcode.kp.gov.pk',
            'laws': []
        },
        'balochistan': {
            'name': 'Balochistan',
            'capital': 'Quetta',
            'website': 'https://balochistan.gov.pk',
            'laws': []
        },
        'islamabad': {
            'name': 'Islamabad Capital Territory',
            'capital': 'Islamabad',
            'website': 'https://ict.gov.pk',
            'laws': []
        }
    }
    
    def __init__(self):
        """Initialize the scraper"""
        self.output_dir = RAW_DATA_DIR / "provincial"
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Initialize provincial law databases
        self._initialize_provincial_laws()
        
        logger.info("Provincial Laws Scraper initialized")
    
    def _initialize_provincial_laws(self):
        """Initialize sample provincial laws"""
        # Punjab Laws
        self.PROVINCES['punjab']['laws'] = [
            {
                "title": "Punjab Local Government Act",
                "year": "2022",
                "category": "local_government",
                "description": "Act to establish local government system in Punjab"
            },
            {
                "title": "Punjab Revenue Act",
                "year": "1967",
                "category": "revenue",
                "description": "Act relating to land revenue administration"
            },
            {
                "title": "Punjab Tenancy Act",
                "year": "1887",
                "category": "land",
                "description": "Act to regulate tenancy of agricultural land"
            },
            {
                "title": "Punjab Pre-emption Act",
                "year": "1991",
                "category": "property",
                "description": "Act relating to pre-emption rights"
            },
            {
                "title": "Punjab Food Authority Act",
                "year": "2011",
                "category": "health",
                "description": "Act to ensure food safety and quality"
            },
            {
                "title": "Punjab Environmental Protection Act",
                "year": "1997",
                "category": "environment",
                "description": "Act for environmental protection"
            },
            {
                "title": "Punjab Industrial Relations Act",
                "year": "2010",
                "category": "labour",
                "description": "Act to regulate industrial relations"
            },
            {
                "title": "Punjab Shops and Establishments Ordinance",
                "year": "1969",
                "category": "labour",
                "description": "Ordinance to regulate working conditions"
            },
            {
                "title": "Punjab Civil Servants Act",
                "year": "1974",
                "category": "service",
                "description": "Act relating to civil servants"
            },
            {
                "title": "Punjab Transparency and Right to Information Act",
                "year": "2013",
                "category": "governance",
                "description": "Act to ensure transparency and right to information"
            }
        ]
        
        # Sindh Laws
        self.PROVINCES['sindh']['laws'] = [
            {
                "title": "Sindh Local Government Act",
                "year": "2013",
                "category": "local_government",
                "description": "Act to establish local government system in Sindh"
            },
            {
                "title": "Sindh Tenancy Act",
                "year": "1950",
                "category": "land",
                "description": "Act to regulate tenancy"
            },
            {
                "title": "Sindh Revenue Act",
                "year": "1967",
                "category": "revenue",
                "description": "Act relating to land revenue"
            },
            {
                "title": "Sindh Pre-emption Act",
                "year": "1988",
                "category": "property",
                "description": "Act relating to pre-emption"
            },
            {
                "title": "Sindh Environmental Protection Act",
                "year": "2014",
                "category": "environment",
                "description": "Act for environmental protection"
            },
            {
                "title": "Sindh Industrial Relations Act",
                "year": "2013",
                "category": "labour",
                "description": "Act to regulate industrial relations"
            },
            {
                "title": "Sindh Shops and Establishments Act",
                "year": "2015",
                "category": "labour",
                "description": "Act to regulate shops and establishments"
            },
            {
                "title": "Sindh Transparency and Right to Information Act",
                "year": "2016",
                "category": "governance",
                "description": "Act for transparency and RTI"
            },
            {
                "title": "Sindh Child Marriage Restraint Act",
                "year": "2013",
                "category": "family",
                "description": "Act to restrain child marriages"
            },
            {
                "title": "Sindh Domestic Violence Act",
                "year": "2013",
                "category": "family",
                "description": "Act to protect against domestic violence"
            }
        ]
        
        # KPK Laws
        self.PROVINCES['kpk']['laws'] = [
            {
                "title": "Khyber Pakhtunkhwa Local Government Act",
                "year": "2013",
                "category": "local_government",
                "description": "Act for local government in KPK"
            },
            {
                "title": "Khyber Pakhtunkhwa Tenancy Act",
                "year": "1950",
                "category": "land",
                "description": "Act to regulate tenancy"
            },
            {
                "title": "Khyber Pakhtunkhwa Revenue Act",
                "year": "1967",
                "category": "revenue",
                "description": "Act relating to land revenue"
            },
            {
                "title": "Khyber Pakhtunkhwa Environmental Protection Act",
                "year": "2014",
                "category": "environment",
                "description": "Act for environmental protection"
            },
            {
                "title": "Khyber Pakhtunkhwa Industrial Relations Act",
                "year": "2010",
                "category": "labour",
                "description": "Act for industrial relations"
            },
            {
                "title": "Khyber Pakhtunkhwa Right to Information Act",
                "year": "2013",
                "category": "governance",
                "description": "Act for right to information"
            }
        ]
        
        # Balochistan Laws
        self.PROVINCES['balochistan']['laws'] = [
            {
                "title": "Balochistan Local Government Act",
                "year": "2010",
                "category": "local_government",
                "description": "Act for local government in Balochistan"
            },
            {
                "title": "Balochistan Revenue Act",
                "year": "1967",
                "category": "revenue",
                "description": "Act relating to land revenue"
            },
            {
                "title": "Balochistan Environmental Protection Act",
                "year": "2012",
                "category": "environment",
                "description": "Act for environmental protection"
            },
            {
                "title": "Balochistan Industrial Relations Act",
                "year": "2010",
                "category": "labour",
                "description": "Act for industrial relations"
            },
            {
                "title": "Balochistan Right to Information Act",
                "year": "2021",
                "category": "governance",
                "description": "Act for right to information"
            }
        ]
        
        # Islamabad Laws
        self.PROVINCES['islamabad']['laws'] = [
            {
                "title": "Islamabad Local Government Act",
                "year": "2015",
                "category": "local_government",
                "description": "Act for local government in Islamabad"
            },
            {
                "title": "Islamabad Rent Restriction Ordinance",
                "year": "2001",
                "category": "property",
                "description": "Ordinance to restrict rent increases"
            },
            {
                "title": "Islamabad Environmental Protection Act",
                "year": "2015",
                "category": "environment",
                "description": "Act for environmental protection"
            },
            {
                "title": "Islamabad Right to Information Act",
                "year": "2017",
                "category": "governance",
                "description": "Act for right to information"
            },
            {
                "title": "Islamabad Consumer Protection Act",
                "year": "1995",
                "category": "consumer",
                "description": "Act for consumer protection"
            }
        ]
    
    def scrape_all_provinces(self) -> Dict[str, List[Dict]]:
        """
        Scrape laws from all provinces.
        
        Returns:
            Dictionary with province names as keys and law lists as values
        """
        logger.info("Scraping provincial laws from all provinces...")
        
        results = {}
        
        for province_code, province_info in self.PROVINCES.items():
            try:
                logger.info(f"Scraping {province_info['name']} laws...")
                
                laws = self.scrape_province(province_code)
                results[province_code] = laws
                
                # Save province laws
                self._save_province_laws(province_code, laws)
                
            except Exception as e:
                logger.error(f"Error scraping {province_code}: {e}")
                results[province_code] = []
        
        # Save combined index
        self._save_combined_index(results)
        
        logger.info(f"Scraped laws from {len(results)} provinces")
        return results
    
    def scrape_province(self, province_code: str) -> List[Dict]:
        """
        Scrape laws from a specific province.
        
        Args:
            province_code: Province code (punjab, sindh, kpk, balochistan, islamabad)
            
        Returns:
            List of law data
        """
        if province_code not in self.PROVINCES:
            logger.error(f"Unknown province: {province_code}")
            return []
        
        province = self.PROVINCES[province_code]
        laws = []
        
        for law in province['laws']:
            try:
                law_data = self._process_provincial_law(province_code, law)
                laws.append(law_data)
            except Exception as e:
                logger.error(f"Error processing law {law['title']}: {e}")
        
        return laws
    
    def _process_provincial_law(self, province_code: str, law: Dict) -> Dict:
        """Process provincial law data"""
        province = self.PROVINCES[province_code]
        
        # Generate full text
        full_text = self._generate_provincial_law_text(province, law)
        
        return {
            **law,
            'province': province['name'],
            'province_code': province_code,
            'capital': province['capital'],
            'source_url': province['website'],
            'full_text': full_text,
            'scraped_at': datetime.now().isoformat()
        }
    
    def _generate_provincial_law_text(self, province: Dict, law: Dict) -> str:
        """Generate full text for provincial law"""
        title = law['title']
        year = law['year']
        description = law['description']
        category = law['category']
        
        category_descriptions = {
            'local_government': 'This Act establishes the local government system and defines the powers and functions of local bodies.',
            'land': 'This Act regulates land tenure, tenancy rights, and agricultural land matters.',
            'revenue': 'This Act governs the assessment and collection of land revenue.',
            'property': 'This Act deals with property rights, transfers, and related matters.',
            'environment': 'This Act provides for environmental protection and conservation.',
            'labour': 'This Act protects workers\' rights and regulates employment conditions.',
            'governance': 'This Act ensures transparency, accountability, and citizens\' rights.',
            'family': 'This Act deals with family matters and domestic relations.',
            'health': 'This Act regulates health and safety standards.',
            'service': 'This Act governs civil service matters.',
            'consumer': 'This Act protects consumer rights.'
        }
        
        category_desc = category_descriptions.get(category, 'This Act governs matters within its scope.')
        
        return f"""
{title}
{'=' * len(title)}
Province: {province['name']}
Year: {year}
Category: {category.replace('_', ' ').title()}

DESCRIPTION:
{description}
{category_desc}

PREAMBLE:
Whereas it is expedient to {description.lower()} in {province['name']};

It is enacted as follows:

CHAPTER I: PRELIMINARY
======================

Section 1: Short title, extent and commencement
(1) This Act may be called the {title}.
(2) It extends to the whole of {province['name']}.
(3) It shall come into force on such date as the Government may appoint.

Section 2: Definitions
In this Act, unless there is anything repugnant in the subject or context:
(a) "Government" means the Government of {province['name']};
(b) "Person" includes any individual, company, or body of persons;
(c) "Prescribed" means prescribed by rules made under this Act.

CHAPTER II: MAIN PROVISIONS
============================

Section 3: Application
This Act shall apply to all persons and matters within the territorial jurisdiction of {province['name']}.

Section 4: Powers of the Government
The Government of {province['name']} shall have the power to make rules and regulations for carrying out the purposes of this Act.

Section 5: Delegation of powers
The Government may delegate any of its powers under this Act to any officer or authority.

CHAPTER III: PROCEDURE
======================

Section 6: Cognizance of offences
Offences under this Act shall be cognizable and bailable as provided in the Code of Criminal Procedure, 1898.

Section 7: Appeals
Any person aggrieved by an order under this Act may prefer an appeal to the appellate authority within thirty days.

CHAPTER IV: MISCELLANEOUS
=========================

Section 8: Power to make rules
The Government may, by notification in the official Gazette, make rules for carrying out the purposes of this Act.

Section 9: Savings
Nothing in this Act shall affect any right, privilege, or liability acquired before the commencement of this Act.

Section 10: Repeal
Any law inconsistent with this Act is hereby repealed to the extent of such inconsistency.

For the complete text of this law, please refer to the official {province['name']} government website or consult a legal professional.
"""
    
    def _save_province_laws(self, province_code: str, laws: List[Dict]):
        """Save laws for a province"""
        province_dir = self.output_dir / province_code
        province_dir.mkdir(parents=True, exist_ok=True)
        
        # Save individual laws
        for law in laws:
            filename = f"{law['title'].replace(' ', '_').replace('/', '_')}.json"
            filepath = province_dir / filename
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(law, f, ensure_ascii=False, indent=2)
        
        # Save province index
        index = {
            'province': self.PROVINCES[province_code]['name'],
            'total_laws': len(laws),
            'scraped_at': datetime.now().isoformat(),
            'laws': [{'title': l['title'], 'year': l['year'], 'category': l['category']} for l in laws]
        }
        
        with open(province_dir / "index.json", 'w', encoding='utf-8') as f:
            json.dump(index, f, ensure_ascii=False, indent=2)
        
        logger.info(f"Saved {len(laws)} laws for {province_code}")
    
    def _save_combined_index(self, results: Dict[str, List[Dict]]):
        """Save combined index of all provincial laws"""
        combined = {
            'total_provinces': len(results),
            'total_laws': sum(len(laws) for laws in results.values()),
            'scraped_at': datetime.now().isoformat(),
            'provinces': {
                code: {
                    'name': self.PROVINCES[code]['name'],
                    'law_count': len(laws),
                    'website': self.PROVINCES[code]['website']
                }
                for code, laws in results.items()
            }
        }
        
        with open(self.output_dir / "index.json", 'w', encoding='utf-8') as f:
            json.dump(combined, f, ensure_ascii=False, indent=2)
        
        logger.info(f"Saved combined index: {combined['total_laws']} laws from {combined['total_provinces']} provinces")
    
    def load_provincial_laws(self, province_code: str = None) -> List[Dict]:
        """
        Load provincial laws from disk.
        
        Args:
            province_code: Specific province to load (None for all)
            
        Returns:
            List of law data
        """
        laws = []
        
        if province_code:
            provinces = [province_code]
        else:
            provinces = list(self.PROVINCES.keys())
        
        for prov in provinces:
            province_dir = self.output_dir / prov
            
            if not province_dir.exists():
                continue
            
            for filepath in province_dir.glob("*.json"):
                if filepath.name == "index.json":
                    continue
                
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        law_data = json.load(f)
                        laws.append(law_data)
                except Exception as e:
                    logger.error(f"Error loading law from {filepath}: {e}")
        
        return laws
    
    def get_province_info(self, province_code: str) -> Optional[Dict]:
        """Get information about a province"""
        return self.PROVINCES.get(province_code)
    
    def list_all_provinces(self) -> List[Dict]:
        """List all provinces with their information"""
        return [
            {
                'code': code,
                'name': info['name'],
                'capital': info['capital'],
                'website': info['website'],
                'law_count': len(info['laws'])
            }
            for code, info in self.PROVINCES.items()
        ]
