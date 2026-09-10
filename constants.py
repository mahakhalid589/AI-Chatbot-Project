"""
Constants Module
================
Legal categories, court hierarchy, and glossary of terms.
"""

# Legal Categories
LEGAL_CATEGORIES = {
    'constitutional': {
        'name': 'Constitutional Law',
        'description': 'Laws related to the Constitution of Pakistan',
        'examples': ['Constitution of Pakistan', 'Constitutional Amendments']
    },
    'criminal': {
        'name': 'Criminal Law',
        'description': 'Laws dealing with crimes and punishments',
        'examples': ['Pakistan Penal Code', 'Criminal Procedure Code', 'Anti-Terrorism Act']
    },
    'civil': {
        'name': 'Civil Law',
        'description': 'Laws governing private disputes',
        'examples': ['Civil Procedure Code', 'Contract Act', 'Specific Relief Act']
    },
    'family': {
        'name': 'Family Law',
        'description': 'Laws related to marriage, divorce, and family matters',
        'examples': ['Muslim Family Laws Ordinance', 'Guardians and Wards Act']
    },
    'property': {
        'name': 'Property Law',
        'description': 'Laws governing property rights and transfers',
        'examples': ['Transfer of Property Act', 'Registration Act']
    },
    'land': {
        'name': 'Land Law',
        'description': 'Laws related to land tenure and revenue',
        'examples': ['Land Revenue Act', 'Tenancy Acts']
    },
    'corporate': {
        'name': 'Corporate Law',
        'description': 'Laws governing companies and businesses',
        'examples': ['Companies Act', 'SECP Act', 'Banking Companies Ordinance']
    },
    'labour': {
        'name': 'Labour Law',
        'description': 'Laws protecting workers\' rights',
        'examples': ['Industrial Relations Act', 'Factories Act', 'Minimum Wages Ordinance']
    },
    'tax': {
        'name': 'Tax Law',
        'description': 'Laws related to taxation',
        'examples': ['Income Tax Ordinance', 'Sales Tax Act', 'Customs Act']
    },
    'environment': {
        'name': 'Environmental Law',
        'description': 'Laws for environmental protection',
        'examples': ['Environmental Protection Act']
    },
    'cyber': {
        'name': 'Cyber Law',
        'description': 'Laws related to electronic crimes and digital matters',
        'examples': ['Prevention of Electronic Crimes Act', 'Electronic Transactions Ordinance']
    },
    'ip': {
        'name': 'Intellectual Property',
        'description': 'Laws protecting intellectual property rights',
        'examples': ['Copyright Ordinance', 'Patents Ordinance', 'Trade Marks Ordinance']
    },
    'electoral': {
        'name': 'Electoral Law',
        'description': 'Laws governing elections',
        'examples': ['Election Act', 'Political Parties Act']
    },
    'immigration': {
        'name': 'Immigration Law',
        'description': 'Laws related to citizenship and immigration',
        'examples': ['Pakistan Citizenship Act', 'Passport Act', 'Immigration Ordinance']
    },
    'adr': {
        'name': 'Alternative Dispute Resolution',
        'description': 'Laws for arbitration and mediation',
        'examples': ['Arbitration Act', 'Alternate Dispute Resolution Act']
    },
    'anti_corruption': {
        'name': 'Anti-Corruption',
        'description': 'Laws against corruption',
        'examples': ['NAB Ordinance', 'Anti-Money Laundering Act']
    },
    'local_government': {
        'name': 'Local Government',
        'description': 'Laws for local government system',
        'examples': ['Local Government Acts of Provinces']
    },
    'governance': {
        'name': 'Governance',
        'description': 'Laws for transparency and good governance',
        'examples': ['Right to Information Acts']
    }
}

# Court Hierarchy in Pakistan
COURT_HIERARCHY = {
    'supreme_court': {
        'name': 'Supreme Court of Pakistan',
        'level': 1,
        'jurisdiction': 'Final appellate jurisdiction, Constitutional interpretation',
        'location': 'Islamabad',
        'website': 'https://www.supremecourt.gov.pk'
    },
    'federal_shariat_court': {
        'name': 'Federal Shariat Court',
        'level': 2,
        'jurisdiction': 'Examination of laws according to Islamic injunctions',
        'location': 'Islamabad',
        'website': 'https://www.federalshariatcourt.gov.pk'
    },
    'high_courts': {
        'name': 'High Courts',
        'level': 2,
        'jurisdiction': 'Constitutional and appellate jurisdiction',
        'courts': [
            {'name': 'Lahore High Court', 'province': 'Punjab', 'location': 'Lahore'},
            {'name': 'Sindh High Court', 'province': 'Sindh', 'location': 'Karachi'},
            {'name': 'Peshawar High Court', 'province': 'KPK', 'location': 'Peshawar'},
            {'name': 'Balochistan High Court', 'province': 'Balochistan', 'location': 'Quetta'},
            {'name': 'Islamabad High Court', 'territory': 'ICT', 'location': 'Islamabad'}
        ]
    },
    'district_courts': {
        'name': 'District & Sessions Courts',
        'level': 3,
        'jurisdiction': 'Criminal and civil trials, appeals from lower courts',
        'location': 'District headquarters'
    },
    'civil_courts': {
        'name': 'Civil Courts',
        'level': 4,
        'jurisdiction': 'Civil disputes up to specified pecuniary limits',
        'location': 'Tehsil/Taluka level'
    },
    'magistrate_courts': {
        'name': 'Magistrate Courts',
        'level': 4,
        'jurisdiction': 'Minor criminal cases, preliminary proceedings',
        'location': 'Tehsil/Taluka level'
    },
    'special_courts': {
        'name': 'Special Courts & Tribunals',
        'level': 3,
        'jurisdiction': 'Specific matters (Anti-terrorism, Banking, Labour, etc.)',
        'examples': [
            'Anti-Terrorism Courts',
            'Banking Courts',
            'Labour Courts',
            'Family Courts',
            'Consumer Courts',
            'Drug Courts'
        ]
    },
    'alternative_forums': {
        'name': 'Alternative Dispute Resolution Forums',
        'level': 5,
        'jurisdiction': 'Mediation, arbitration, conciliation',
        'examples': [
            'Arbitration Councils',
            'Musalihat Anjuman (Conciliation Committees)',
            'Ombudsmen'
        ]
    }
}

# Legal Terms Glossary (English-Urdu)
LEGAL_TERMS_GLOSSARY = {
    'affidavit': {
        'english': 'Affidavit',
        'urdu': 'حلف نامہ',
        'roman_urdu': 'Half Nama',
        'definition': 'A written statement confirmed by oath or affirmation'
    },
    'appeal': {
        'english': 'Appeal',
        'urdu': 'اپیل',
        'roman_urdu': 'Appeal',
        'definition': 'Application to a higher court to reverse a lower court decision'
    },
    'bail': {
        'english': 'Bail',
        'urdu': 'ضمانت',
        'roman_urdu': 'Zamanat',
        'definition': 'Release of an accused person pending trial, usually with security'
    },
    'complaint': {
        'english': 'Complaint',
        'urdu': 'شکایت',
        'roman_urdu': 'Shikayat',
        'definition': 'Formal allegation that someone has committed an offence'
    },
    'contract': {
        'english': 'Contract',
        'urdu': 'معاہدہ',
        'roman_urdu': 'Muahida',
        'definition': 'Legally binding agreement between two or more parties'
    },
    'court': {
        'english': 'Court',
        'urdu': 'عدالت',
        'roman_urdu': 'Adalat',
        'definition': 'Place where legal cases are heard and decided'
    },
    'crime': {
        'english': 'Crime',
        'urdu': 'جرم',
        'roman_urdu': 'Jurm',
        'definition': 'An act punishable by law'
    },
    'damages': {
        'english': 'Damages',
        'urdu': 'ہرفیہ',
        'roman_urdu': 'Harjana',
        'definition': 'Money compensation for loss or injury'
    },
    'defendant': {
        'english': 'Defendant',
        'urdu': 'مدعا علیہ',
        'roman_urdu': 'Mudaa Alaih',
        'definition': 'Person against whom a legal action is brought'
    },
    'evidence': {
        'english': 'Evidence',
        'urdu': 'شہادت',
        'roman_urdu': 'Shahadat',
        'definition': 'Information used to prove or disprove facts in court'
    },
    'fir': {
        'english': 'FIR (First Information Report)',
        'urdu': 'پہلی اطلاع رپورٹ',
        'roman_urdu': 'Pehli Ittila Report',
        'definition': 'Written document prepared by police when they receive information about a cognizable offence'
    },
    'hearing': {
        'english': 'Hearing',
        'urdu': 'سماعت',
        'roman_urdu': 'Samat',
        'definition': 'Proceeding before a court where evidence is presented'
    },
    'injunction': {
        'english': 'Injunction',
        'urdu': 'حکم امتناعی',
        'roman_urdu': 'Hukm Imtinai',
        'definition': 'Court order requiring a person to do or refrain from doing something'
    },
    'judge': {
        'english': 'Judge',
        'urdu': 'جج',
        'roman_urdu': 'Judge',
        'definition': 'Public official appointed to decide cases in court'
    },
    'judgment': {
        'english': 'Judgment',
        'urdu': 'فیصلہ',
        'roman_urdu': 'Faisla',
        'definition': 'Final decision of a court in a case'
    },
    'jurisdiction': {
        'english': 'Jurisdiction',
        'urdu': 'دائرہ اختیار',
        'roman_urdu': 'Daira Ikhtiyar',
        'definition': 'Authority of a court to hear and decide cases'
    },
    'lawyer': {
        'english': 'Lawyer/Advocate',
        'urdu': 'وکیل',
        'roman_urdu': 'Vakil/Wakeel',
        'definition': 'Person qualified to represent clients in court'
    },
    'litigation': {
        'english': 'Litigation',
        'urdu': 'مقدمہ بازی',
        'roman_urdu': 'Muqadma Bazi',
        'definition': 'Process of taking legal action'
    },
    'marriage': {
        'english': 'Marriage',
        'urdu': 'نکاح',
        'roman_urdu': 'Nikah',
        'definition': 'Legal union between spouses'
    },
    'offence': {
        'english': 'Offence',
        'urdu': 'جرم',
        'roman_urdu': 'Jurm',
        'definition': 'Act that violates criminal law'
    },
    'petition': {
        'english': 'Petition',
        'urdu': 'درخواست',
        'roman_urdu': 'Darkhwast',
        'definition': 'Formal written request to a court'
    },
    'plaintiff': {
        'english': 'Plaintiff',
        'urdu': 'مدعی',
        'roman_urdu': 'Mudai',
        'definition': 'Person who brings a case against another in court'
    },
    'plea': {
        'english': 'Plea',
        'urdu': 'عذر',
        'roman_urdu': 'Uzar',
        'definition': 'Defendant\'s response to criminal charges'
    },
    'power_of_attorney': {
        'english': 'Power of Attorney',
        'urdu': 'اختتار نامہ',
        'roman_urdu': 'Ikhtiyar Nama',
        'definition': 'Legal document giving someone authority to act on another\'s behalf'
    },
    'precedent': {
        'english': 'Precedent',
        'urdu': 'سابقہ',
        'roman_urdu': 'Sabiqa',
        'definition': 'Earlier court decision that guides future cases'
    },
    'punishment': {
        'english': 'Punishment',
        'urdu': 'سزا',
        'roman_urdu': 'Saza',
        'definition': 'Penalty imposed for committing an offence'
    },
    'qisas': {
        'english': 'Qisas',
        'urdu': 'قصاص',
        'roman_urdu': 'Qisas',
        'definition': 'Islamic principle of equal retaliation in punishment'
    },
    'suit': {
        'english': 'Suit',
        'urdu': 'دعوی',
        'roman_urdu': 'Dawa',
        'definition': 'Legal proceeding in a civil court'
    },
    'summons': {
        'english': 'Summons',
        'urdu': 'طلبی',
        'roman_urdu': 'Talbi',
        'definition': 'Order to appear before a court'
    },
    'talaq': {
        'english': 'Talaq',
        'urdu': 'طلاق',
        'roman_urdu': 'Talaq',
        'definition': 'Islamic divorce pronounced by the husband'
    },
    'testimony': {
        'english': 'Testimony',
        'urdu': 'گواہی',
        'roman_urdu': 'Gawahi',
        'definition': 'Statement given by a witness under oath'
    },
    'trial': {
        'english': 'Trial',
        'urdu': 'مقدمہ',
        'roman_urdu': 'Muqadma',
        'definition': 'Formal examination of evidence in court'
    },
    'verdict': {
        'english': 'Verdict',
        'urdu': 'فیصلہ',
        'roman_urdu': 'Faisla',
        'definition': 'Decision of a jury or judge in a case'
    },
    'warrant': {
        'english': 'Warrant',
        'urdu': 'وارهنٹ',
        'roman_urdu': 'Warrant',
        'definition': 'Legal document authorizing police to take certain action'
    },
    'witness': {
        'english': 'Witness',
        'urdu': 'گواہ',
        'roman_urdu': 'Gawah',
        'definition': 'Person who gives testimony in court'
    }
}

# Common Legal Procedures
LEGAL_PROCEDURES = {
    'filing_fir': {
        'name': 'Filing an FIR',
        'steps': [
            'Go to the nearest police station',
            'Provide details of the incident',
            'Request registration of FIR',
            'Obtain a copy of the FIR (free of charge)',
            'Note the FIR number for future reference'
        ],
        'notes': 'Police must register FIR for cognizable offences. If refused, approach higher authorities or court.'
    },
    'bail_application': {
        'name': 'Applying for Bail',
        'steps': [
            'Engage a lawyer',
            'Prepare bail application',
            'File in appropriate court',
            'Present arguments',
            'Court decides on bail'
        ],
        'notes': 'Bail can be before arrest (anticipatory) or after arrest.'
    },
    'civil_suit': {
        'name': 'Filing a Civil Suit',
        'steps': [
            'Prepare plaint (written statement of claim)',
            'Pay court fees',
            'File in court with jurisdiction',
            'Serve notice to defendant',
            'Attend hearings',
            'Present evidence',
            'Await judgment'
        ],
        'notes': 'Limitation period applies. Consult lawyer for specific time limits.'
    },
    'appeal': {
        'name': 'Filing an Appeal',
        'steps': [
            'Obtain certified copy of judgment',
            'Prepare appeal memo',
            'File within limitation period',
            'Pay court fees',
            'Present arguments before appellate court'
        ],
        'notes': 'Time limits for appeal are strict. Act promptly.'
    },
    'nikah_registration': {
        'name': 'Marriage (Nikah) Registration',
        'steps': [
            'Contact licensed Nikah Registrar',
            'Provide required documents (CNIC, photos)',
            'Complete Nikah ceremony',
            'Sign Nikah Nama',
            'Obtain registered copy'
        ],
        'notes': 'Registration is mandatory under Muslim Family Laws Ordinance.'
    },
    'divorce_registration': {
        'name': 'Divorce (Talaq) Registration',
        'steps': [
            'Give written notice to Union Council Chairman',
            'Wait for 90-day period',
            'Reconciliation attempts by Arbitration Council',
            'Obtain divorce certificate after period expires',
            'Register with NADRA for CNIC update'
        ],
        'notes': 'Oral talaq is not sufficient. Written notice is mandatory.'
    }
}

# Emergency Contacts
EMERGENCY_CONTACTS = {
    'police': {
        'name': 'Police Emergency',
        'number': '15',
        'description': 'For immediate police assistance'
    },
    'ambulance': {
        'name': 'Edhi Ambulance',
        'number': '115',
        'description': 'Emergency medical services'
    },
    'fire': {
        'name': 'Fire Brigade',
        'number': '16',
        'description': 'Fire emergency services'
    },
    'rescue': {
        'name': 'Rescue 1122',
        'number': '1122',
        'description': 'Emergency rescue services'
    },
    'highway_police': {
        'name': 'Highway Police',
        'number': '130',
        'description': 'Motorway and highway emergencies'
    },
    'women_helpline': {
        'name': 'Women Helpline',
        'number': '1043',
        'description': 'For women in distress'
    },
    'child_helpline': {
        'name': 'Child Protection',
        'number': '1121',
        'description': 'For child protection issues'
    }
}
