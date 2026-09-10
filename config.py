"""
Pakistan Legal AI - Configuration
=================================
Pakistan-specific configuration for the legal assistant.
"""

import os
from dotenv import load_dotenv
from pathlib import Path
load_dotenv()

# Base paths
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
VECTOR_DB_DIR = DATA_DIR / "vector_db"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"

# Ensure directories exist
for dir_path in [DATA_DIR, VECTOR_DB_DIR, RAW_DATA_DIR, PROCESSED_DATA_DIR]:
    dir_path.mkdir(parents=True, exist_ok=True)

# Flask Configuration
FLASK_HOST = os.getenv("FLASK_HOST", "0.0.0.0")
FLASK_PORT = int(os.getenv("FLASK_PORT", 5000))
FLASK_DEBUG = os.getenv("FLASK_DEBUG", "True").lower() == "true"
SECRET_KEY = os.getenv("SECRET_KEY", "pak-law-ai-secret-key-2024")

# CORS Configuration
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080",
    "https://*.kimi.link",
    "*"  # Allow all origins in development
]

# LLaMA / Ollama Configuration
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1:8b")
OLLAMA_TEMPERATURE = float(os.getenv("OLLAMA_TEMPERATURE", 0.3))
OLLAMA_MAX_TOKENS = int(os.getenv("OLLAMA_MAX_TOKENS", 2048))

# Vector Database Configuration
CHROMA_COLLECTION_NAME = "pakistan_laws"
CHROMA_PERSIST_DIRECTORY = str(VECTOR_DB_DIR)
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
# Alternative for better Urdu support: "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
EMBEDDING_MODEL_MULTILINGUAL = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"

# RAG Configuration
RAG_TOP_K = int(os.getenv("RAG_TOP_K", 5))
RAG_SIMILARITY_THRESHOLD = float(os.getenv("RAG_SIMILARITY_THRESHOLD", 0.7))
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", 1000))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", 200))

# Language Configuration
SUPPORTED_LANGUAGES = {
    "en": "English",
    "ur": "Urdu",
    "roman_urdu": "Roman Urdu"
}

DEFAULT_LANGUAGE = "en"

# Roman Urdu common words mapping
ROMAN_URDU_COMMON = {
    # Greetings and common phrases
    "assalam": "السلام",
    "walekum": "علیکم",
    "salam": "سلام",
    "shukria": "شکریہ",
    "meherbani": "مہربانی",
    "kya": "کیا",
    "hai": "ہے",
    "hain": "ہیں",
    "ka": "کا",
    "ki": "کی",
    "ke": "کے",
    "ko": "کو",
    "se": "سے",
    "mein": "میں",
    "par": "پر",
    "bhi": "بھی",
    "aur": "اور",
    "ya": "یا",
    "nahi": "نہیں",
    "han": "ہاں",
    "na": "نہ",
    "koi": "کوئی",
    "sab": "سب",
    "har": "ہر",
    "ek": "ایک",
    "do": "دو",
    "teen": "تین",
    "mera": "میرا",
    "meri": "میری",
    "mere": "میرے",
    "tera": "تیرا",
    "teri": "تیری",
    "aap": "آپ",
    "tum": "تم",
    "main": "میں",
    "wo": "وہ",
    "yeh": "یہ",
    "woh": "وہ",
    "idhar": "ادھر",
    "udhar": "ادھر",
    "kab": "کب",
    "kahan": "کہاں",
    "kyun": "کیوں",
    "kaise": "کیسے",
    "kitna": "کتنا",
    "kitne": "کتنے",
    "acha": "اچھا",
    "bura": "برا",
    "bara": "بڑا",
    "chota": "چھوٹا",
    "naya": "نیا",
    "purana": "پرانا",
    # Legal terms
    "kanoon": "قانون",
    "qanoon": "قانون",
    "adalet": "عدالت",
    "adalat": "عدالت",
    "vakil": "وکیل",
    "wakeel": "وکیل",
    "judge": "جج",
    "mujrim": "مجرم",
    "mujrim": "مجرم",
    "shahadat": "شہادت",
    "gawah": "گواہ",
    "saza": "سزا",
    "jurm": "جرم",
    "taqrir": "تقریر",
    "dastavez": "دستاویز",
    "hukm": "حکم",
    "faisla": "فیصلہ",
    "daira": "دائرہ",
    "iqdam": "اقدام",
    "tahaffuz": "تحفظ",
    "haq": "حق",
    "zimmedari": "ذمہ داری",
    "jaza": "جزا",
    "tawan": "تعاون",
    "shikayat": "شکایت",
    "muqadma": "مقدمہ",
    "muqaddama": "مقدمہ",
    "wakalat": "وکالت",
    "tahrir": "تحریر",
    "ehtijaj": "احتجاج",
    "darkhwast": "درخواست",
    "tajweez": "تجویز",
    "toseeq": "توثیق",
    "shart": "شرط",
    "qoul": "قول",
    "wada": "وعدہ",
    "muaahida": "معاہدہ",
    "theka": "ٹھیکہ",
    "karobari": "کاروباری",
    "tijarati": "تجارتی",
    "milkiat": "ملکیت",
    "jaidad": "جائیداد",
    "warasa": "وراثہ",
    "wasiyat": "وصیت",
    "talaq": "طلاق",
    "nikah": "نکاح",
    "khula": "خلع",
    "mehr": "مہر",
    "hifazat": "حفاظت",
    "tahaffuz": "تحفظ",
    "izn": "اجازت",
    "pabandi": "پابندی",
    "rok": "روک",
    "chhut": "چھوٹ",
    "bri": "بری",
    "saza": "سزا",
    "phansi": "پھانسی",
    "umr": "عمر",
    "qaid": "قید",
    "jurmana": "جرمانہ",
    "taawan": "تعاون",
    "madad": "مدد",
    "taraqqi": "ترقی",
    "be-rozgari": "بے روزگاری",
    "rozgar": "روزگار",
    "naukri": "نوکری",
    "tankhwa": "تنخواہ",
    "mahana": "ماہانہ",
    "salana": "سالانہ",
    "roz": "روز",
    "din": "دن",
    "raat": "رات",
    "hafta": "ہفتہ",
    "mahina": "مہینہ",
    "saal": "سال",
    "waqt": "وقت",
    "abhi": "ابھی",
    "pehle": "پہلے",
    "baad": "بعد",
    "shuru": "شروع",
    "khatam": "ختم",
    "ant": "انت",
    "darmiyan": "درمیان",
    "beech": "بیچ",
    "sath": "ساتھ",
    "alag": "الگ",
    "milkar": "ملکر",
    "akela": "اکیلا",
    "sab": "سب",
    "kuch": "کچھ",
    "bahut": "بہت",
    "thora": "تھوڑا",
    "zyada": "زیادہ",
    "kam": "کم",
    "behtar": "بہتر",
    "behtareen": "بہترین",
    "ganda": "گندہ",
    "saaf": "صاف",
    "sach": "سچ",
    "jhoot": "جھوٹ",
    "theek": "ٹھیک",
    "ghalat": "غلط",
    "durust": "درست",
    "na-insafi": "نائنصافی",
    "insaf": "انصاف",
    "be-insafi": "بے انصافی",
    "zulm": "ظلم",
    "zalim": "ظالم",
    "mazloom": "مظلوم",
    "madadgar": "مددگار",
    "dushman": "دشمن",
    "dost": "دوست",
    "bhai": "بھائی",
    "behan": "بہن",
    "maa": "ماں",
    "baap": "باپ",
    "beta": "بیٹا",
    "beti": "بیٹی",
    "shohar": "شوہر",
    "biwi": "بیوی",
    "khawand": "خاوند",
    "zoja": "زوجہ",
    "ghar": "گھر",
    "makan": "مکان",
    "dokan": "دکان",
    "dafftar": "دفتر",
    "school": "سکول",
    "college": "کالج",
    "university": "یونیورسٹی",
    "hospital": "ہسپتال",
    "dakhtar": "ڈاکٹر",
    "mareez": "مریض",
    "bemari": "بیماری",
    "sehat": "صحت",
    "tandurusti": "تندرستی",
    "kamzori": "کمزوری",
    "taqat": "طاقت",
    "zor": "زور",
    "tez": "تیز",
    "dheema": "دھیما",
    "tezi": "تیزی",
    "ahistagi": "آہستگی",
    "jaldi": "جلدی",
    "der": "دیر",
    "waqt par": "وقت پر",
    "filhal": "فی الحال",
    "mustaqbil": "مستقبل",
    "mazi": "ماضی",
    "haal": "حال",
    "subah": "صبح",
    "shaam": "شام",
    "dopahar": "دوپہر",
    "raat": "رات",
    "sawera": "سورج",
    "chand": "چاند",
    "tare": "تارے",
    "aasman": "آسمان",
    "zameen": "زمین",
    "pani": "پانی",
    "hawa": "ہوا",
    "aag": "آگ",
    "mitti": "مٹی",
    "ped": "پودا",
    "phool": "پھول",
    "phal": "پھل",
    "darakht": "درخت",
    "patta": "پتہ",
    "jarr": "جڑ",
    "tana": "تنا",
    "shakh": "شاخ",
    "phailao": "پھیلاؤ",
    "unchai": "اونچائی",
    "lambaai": "لمبائی",
    "chorai": "چوڑائی",
    "wusat": "وسعت",
    "wazan": "وزن",
    "hissa": "حصہ",
    "tukra": "ٹکڑا",
    "pura": "پورا",
    "adha": "آدھا",
    "sawa": "سوا",
    "pauna": "پونا",
    "dhai": "ڈھائی",
    "sade": "ساڑھے",
    "paune": "پونے",
}

# Pakistan Law Sources
PAKISTAN_LAW_SOURCES = {
    "pakistan_code": {
        "name": "Pakistan Code",
        "url": "https://pakistancode.gov.pk",
        "description": "Official repository of all laws of Pakistan"
    },
    "na_gov": {
        "name": "National Assembly",
        "url": "https://na.gov.pk",
        "description": "Parliamentary bills and acts"
    },
    "senate": {
        "name": "Senate of Pakistan",
        "url": "https://senate.gov.pk",
        "description": "Senate bills and legislation"
    },
    "punjab_laws": {
        "name": "Punjab Laws",
        "url": "https://punjablaws.gov.pk",
        "description": "Provincial laws of Punjab"
    },
    "sindh_laws": {
        "name": "Sindh Laws",
        "url": "https://sindhlaws.gov.pk",
        "description": "Provincial laws of Sindh"
    },
    "kpk_laws": {
        "name": "KPK Laws",
        "url": "https://kpcode.kp.gov.pk",
        "description": "Provincial laws of Khyber Pakhtunkhwa"
    },
    "balochistan_laws": {
        "name": "Balochistan Laws",
        "url": "https://balochistan.gov.pk",
        "description": "Provincial laws of Balochistan"
    },
    "islamabad_laws": {
        "name": "Islamabad Laws",
        "url": "https://ict.gov.pk",
        "description": "Capital Territory laws"
    }
}

# Major Pakistan Laws to scrape
MAJOR_LAWS = [
    {"title": "Constitution of Pakistan", "year": "1973", "category": "constitutional"},
    {"title": "Pakistan Penal Code", "year": "1860", "category": "criminal"},
    {"title": "Code of Criminal Procedure", "year": "1898", "category": "criminal"},
    {"title": "Civil Procedure Code", "year": "1908", "category": "civil"},
    {"title": "Contract Act", "year": "1872", "category": "civil"},
    {"title": "Evidence Act", "year": "1872", "category": "general"},
    {"title": "Qanun-e-Shahadat Order", "year": "1984", "category": "general"},
    {"title": "Guardians and Wards Act", "year": "1890", "category": "family"},
    {"title": "Muslim Family Laws Ordinance", "year": "1961", "category": "family"},
    {"title": "Dissolution of Muslim Marriages Act", "year": "1939", "category": "family"},
    {"title": "Child Marriage Restraint Act", "year": "1929", "category": "family"},
    {"title": "Hindu Marriage Act", "year": "2017", "category": "family"},
    {"title": "Christian Marriage Act", "year": "1872", "category": "family"},
    {"title": "Transfer of Property Act", "year": "1882", "category": "property"},
    {"title": "Registration Act", "year": "1908", "category": "property"},
    {"title": "Land Revenue Act", "year": "1967", "category": "land"},
    {"title": "Punjab Tenancy Act", "year": "1887", "category": "land"},
    {"title": "Sindh Tenancy Act", "year": "1950", "category": "land"},
    {"title": "Companies Act", "year": "2017", "category": "corporate"},
    {"title": "Securities Act", "year": "2015", "category": "corporate"},
    {"title": "Banking Companies Ordinance", "year": "1962", "category": "corporate"},
    {"title": "State Bank of Pakistan Act", "year": "1956", "category": "corporate"},
    {"title": "Competition Act", "year": "2010", "category": "corporate"},
    {"title": "Intellectual Property Organization Act", "year": "2012", "category": "ip"},
    {"title": "Copyright Ordinance", "year": "1962", "category": "ip"},
    {"title": "Patents Ordinance", "year": "2000", "category": "ip"},
    {"title": "Trade Marks Ordinance", "year": "2001", "category": "ip"},
    {"title": "Environmental Protection Act", "year": "1997", "category": "environment"},
    {"title": "Pakistan Environmental Protection Act", "year": "1997", "category": "environment"},
    {"title": "Labour Code", "year": "2021", "category": "labour"},
    {"title": "Factories Act", "year": "1934", "category": "labour"},
    {"title": "Industrial Relations Act", "year": "2012", "category": "labour"},
    {"title": "Minimum Wages Ordinance", "year": "1961", "category": "labour"},
    {"title": "Workmen's Compensation Act", "year": "1923", "category": "labour"},
    {"title": "Employees Old-Age Benefits Act", "year": "1976", "category": "labour"},
    {"title": "SECP Act", "year": "1997", "category": "corporate"},
    {"title": "Anti-Terrorism Act", "year": "1997", "category": "criminal"},
    {"title": "Prevention of Electronic Crimes Act", "year": "2016", "category": "cyber"},
    {"title": "Electronic Transactions Ordinance", "year": "2002", "category": "cyber"},
    {"title": "Telecommunication Act", "year": "1996", "category": "cyber"},
    {"title": "National Database and Registration Authority Act", "year": "2000", "category": "general"},
    {"title": "Freedom of Information Ordinance", "year": "2002", "category": "general"},
    {"title": "Right to Information Act", "year": "2017", "category": "general"},
    {"title": "Local Government Act", "year": "2013", "category": "administrative"},
    {"title": "Election Act", "year": "2017", "category": "electoral"},
    {"title": "Political Parties Act", "year": "1962", "category": "electoral"},
    {"title": "NAB Ordinance", "year": "1999", "category": "anti_corruption"},
    {"title": "Anti-Money Laundering Act", "year": "2010", "category": "anti_corruption"},
    {"title": "Foreign Exchange Regulation Act", "year": "1947", "category": "financial"},
    {"title": "Sales Tax Act", "year": "1990", "category": "tax"},
    {"title": "Income Tax Ordinance", "year": "2001", "category": "tax"},
    {"title": "Federal Excise Act", "year": "2005", "category": "tax"},
    {"title": "Customs Act", "year": "1969", "category": "tax"},
    {"title": "Stamp Act", "year": "1899", "category": "revenue"},
    {"title": "Court Fees Act", "year": "1870", "category": "revenue"},
    {"title": "Suits Valuation Act", "year": "1887", "category": "revenue"},
    {"title": "Limitation Act", "year": "1908", "category": "general"},
    {"title": "Specific Relief Act", "year": "1877", "category": "civil"},
    {"title": "Trusts Act", "year": "1882", "category": "civil"},
    {"title": "Partnership Act", "year": "1932", "category": "corporate"},
    {"title": "Sale of Goods Act", "year": "1930", "category": "commercial"},
    {"title": "Negotiable Instruments Act", "year": "1881", "category": "commercial"},
    {"title": "Arbitration Act", "year": "1940", "category": "adr"},
    {"title": "Alternate Dispute Resolution Act", "year": "2017", "category": "adr"},
    {"title": "Family Courts Act", "year": "1964", "category": "family"},
    {"title": "Juvenile Justice System Act", "year": "2018", "category": "criminal"},
    {"title": "Probation of Offenders Ordinance", "year": "1960", "category": "criminal"},
    {"title": "Control of Narcotic Substances Act", "year": "1997", "category": "criminal"},
    {"title": "Arms Ordinance", "year": "1965", "category": "criminal"},
    {"title": "Explosives Act", "year": "1884", "category": "criminal"},
    {"title": "Pakistan Citizenship Act", "year": "1951", "category": "citizenship"},
    {"title": "Immigration Ordinance", "year": "1979", "category": "immigration"},
    {"title": "Passport Act", "year": "1974", "category": "immigration"},
    {"title": "Extradition Act", "year": "1972", "category": "international"},
    {"title": "Foreigners Act", "year": "1946", "category": "immigration"},
]

# Voice Recognition Configuration
VOICE_CONFIG = {
    "sample_rate": 16000,
    "language_code": "ur-PK",
    "alternative_language_codes": ["en-US", "en-GB"],
    "model": "base",  # Options: tiny, base, small, medium, large
    "chunk_duration": 5,  # seconds
}

# Logging Configuration
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
