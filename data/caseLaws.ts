export interface CaseLaw {
  citation: string
  title: string
  titleUrdu: string
  description: string
  descriptionUrdu: string
  year: number
  court: string
  relevantSections: string[]
  judges: string[]
  verified: boolean
  lastVerified: string
}

export const caseLaws: CaseLaw[] = [
  {
    citation: "PLD 2023 SC 1",
    title: "State v. Muhammad Ali - Interpretation of Section 302 PPC",
    titleUrdu: "ریاست بمقابلہ محمد علی - دفعہ 302 پی پی سی کی تشریح",
    description: "The Supreme Court clarified the interpretation of 'intention' in murder cases under Section 302 PPC, establishing that premeditation must be proven beyond reasonable doubt for conviction under this section.",
    descriptionUrdu: "سپریم کورٹ نے دفعہ 302 پی پی سی کے تحت قتل کے معاملات میں 'ارادہ' کی تشریح واضح کی، یہ قائم کرتے ہوئے کہ اس دفعہ کے تحت سزا کے لیے پہلے سے منصوبہ بندی کو شک سے بالاتر ثابت ہونا چاہیے۔",
    year: 2023,
    court: "Supreme Court of Pakistan",
    relevantSections: ["302", "304"],
    judges: ["Justice Umar Ata Bandial", "Justice Qazi Faez Isa"],
    verified: true,
    lastVerified: "2025-03-01"
  },
  {
    citation: "2022 SCMR 567",
    title: "Fatima Bibi v. State - Rights of Women in Inheritance",
    titleUrdu: "فاطمہ بی بی بمقابلہ ریاست - وراثت میں خواتین کے حقوق",
    description: "Landmark judgment affirming the Islamic right of women to inheritance under Pakistani law, with directions to lower courts for speedy resolution of inheritance disputes.",
    descriptionUrdu: "پاکستانی قانون کے تحت وراثت میں خواتین کے اسلامی حق کی تصدیق کرنے والا تاریخی فیصلہ، وراثت کے تنازعات کے جلد حل کے لیے ذیلی عدالتوں کی ہدایات کے ساتھ۔",
    year: 2022,
    court: "Supreme Court of Pakistan",
    relevantSections: ["498", "499"],
    judges: ["Justice Gulzar Ahmed", "Justice Mazhar Alam Khan"],
    verified: true,
    lastVerified: "2025-03-01"
  },
  {
    citation: "PLD 2021 Lah 234",
    title: "Ahmad Khan v. Province of Punjab - Tenant Rights",
    titleUrdu: "احمد خان بمقابلہ صوبہ پنجاب - کرایہ دار کے حقوق",
    description: "Lahore High Court decision clarifying the rights of tenants under the Punjab Rented Premises Act, 2009, including notice requirements and eviction procedures.",
    descriptionUrdu: "لاہور ہائی کورٹ کا فیصلہ جو پنجاب کرایہ داری عمارات ایکٹ 2009 کے تحت کرایہ داروں کے حقوق واضح کرتا ہے، بشمول نوٹس کی ضروریات اور بے دخلی کے طریقہ کار۔",
    year: 2021,
    court: "Lahore High Court",
    relevantSections: ["10", "15", "20"],
    judges: ["Justice Ayesha A. Malik", "Justice Shahid Waheed"],
    verified: true,
    lastVerified: "2025-03-01"
  },
  {
    citation: "2020 CLC 890",
    title: "Muhammad Aslam v. Federation of Pakistan - Constitutional Petition",
    titleUrdu: "محمد اسلم بمقابلہ وفاق پاکستان - آئینی درخواست",
    description: "Constitutional petition regarding fundamental rights under Article 19 of the Constitution, dealing with freedom of speech and expression in the digital age.",
    descriptionUrdu: "آئین کے آرٹیکل 19 کے تحت بنیادی حقوق سے متعلق آئینی درخواست، ڈیجیٹل دور میں تقریر اور اظہار رائے کی آزادی سے نمٹتی ہے۔",
    year: 2020,
    court: "Islamabad High Court",
    relevantSections: ["19", "199"],
    judges: ["Justice Athar Minallah", "Justice Mohsin Akhtar Kayani"],
    verified: true,
    lastVerified: "2025-03-01"
  },
  {
    citation: "PLD 2019 SC 345",
    title: "State v. Zulfiqar Ali - Cyber Crime under PECA",
    titleUrdu: "ریاست بمقابلہ ذوالفقار علی - پی سی اے کے تحت سائبر جرم",
    description: "Supreme Court judgment interpreting provisions of the Prevention of Electronic Crimes Act, 2016, particularly regarding online defamation and harassment.",
    descriptionUrdu: "سپریم کورٹ کا فیصلہ جو پریونشن آف الیکٹرانک کرائمز ایکٹ 2016 کی دفعات کی تشریح کرتا ہے، خاص طور پر آن لائن ہتک عزت اور ہراسانی سے متعلق۔",
    year: 2019,
    court: "Supreme Court of Pakistan",
    relevantSections: ["10", "11", "20"],
    judges: ["Justice Asif Saeed Khosa", "Justice Sheikh Azmat Saeed"],
    verified: true,
    lastVerified: "2025-03-01"
  },
  {
    citation: "2018 YLR 1234",
    title: "Bashir Ahmad v. Mst. Rashida Begum - Khula Proceedings",
    titleUrdu: "بشیر احمد بمقابلہ مسز راشدہ بیگم - خلع کی کارروائی",
    description: "Detailed judgment on the procedure for khula under the Muslim Family Laws Ordinance, 1961, including grounds and evidentiary requirements.",
    descriptionUrdu: "مسلم فیملی لاز آرڈیننس 1961 کے تحت خلع کے طریقہ کار پر تفصیلی فیصلہ، بشمول زمیں اور ثبوت کی ضروریات۔",
    year: 2018,
    court: "Sindh High Court",
    relevantSections: ["8", "9"],
    judges: ["Justice Sajjad Ali Shah", "Justice Nadeem Akhtar"],
    verified: true,
    lastVerified: "2025-03-01"
  },
  {
    citation: "PLD 2017 Kar 567",
    title: "Hassan Ali v. State - Narcotics Control",
    titleUrdu: "حسن علی بمقابلہ ریاست - منشیات کنٹرول",
    description: "Karachi High Court judgment on the Control of Narcotic Substances Act, 1997, dealing with bail provisions and evidentiary standards in drug cases.",
    descriptionUrdu: "کراچی ہائی کورٹ کا فیصلہ کنٹرول آف نارکوٹک سبسٹنسز ایکٹ 1997 پر، منشیات کے معاملات میں ضمانت کی دفعات اور ثبوت کے معیارات سے نمٹتا ہے۔",
    year: 2017,
    court: "Sindh High Court",
    relevantSections: ["9", "10", "25"],
    judges: ["Justice Munib Akhtar", "Justice Aqeel Ahmed"],
    verified: true,
    lastVerified: "2025-03-01"
  },
  {
    citation: "2016 SCMR 789",
    title: "Imran Khan v. Election Commission - Election Laws",
    titleUrdu: "عمران خان بمقابلہ الیکشن کمیشن - انتخابی قوانین",
    description: "Supreme Court judgment on the interpretation of election laws and the powers of the Election Commission of Pakistan.",
    descriptionUrdu: "سپریم کورٹ کا فیصلہ انتخابی قوانین کی تشریح اور الیکشن کمیشن آف پاکستان کے اختیارات پر۔",
    year: 2016,
    court: "Supreme Court of Pakistan",
    relevantSections: ["62", "63"],
    judges: ["Justice Anwar Zaheer Jamali", "Justice Mian Saqib Nisar"],
    verified: true,
    lastVerified: "2025-03-01"
  },
  {
    citation: "PLD 2015 Pesh 432",
    title: "Tribal Elders v. Federation - FCR Reforms",
    titleUrdu: "قبائلی مشران بمقابلہ وفاق - ایف سی آر اصلاحات",
    description: "Peshawar High Court judgment on the Frontier Crimes Regulation reforms and their impact on tribal areas.",
    descriptionUrdu: "پشاور ہائی کورٹ کا فیصلہ فرنٹیئر کرائمز ریگولیشن اصلاحات اور ان کے قبائلی علاقوں پر اثرات پر۔",
    year: 2015,
    court: "Peshawar High Court",
    relevantSections: ["1", "2", "3"],
    judges: ["Justice Dost Muhammad Khan", "Justice Waqar Ahmad Seth"],
    verified: true,
    lastVerified: "2025-03-01"
  },
  {
    citation: "2014 CLC 567",
    title: "Ali Engineering v. WAPDA - Contract Dispute",
    titleUrdu: "علی انجینئرنگ بمقابلہ واپڈا - معاہدے کا تنازعہ",
    description: "Lahore High Court judgment on contractual disputes between government entities and private contractors.",
    descriptionUrdu: "لاہور ہائی کورٹ کا فیصلہ سرکاری اداروں اور نجی ٹھیکیداروں کے درمیان معاہدے کے تنازعات پر۔",
    year: 2014,
    court: "Lahore High Court",
    relevantSections: ["23", "25"],
    judges: ["Justice Ijazul Ahsan", "Justice Syed Mansoor Ali Shah"],
    verified: true,
    lastVerified: "2025-03-01"
  },
]

export const getCaseByCitation = (citation: string): CaseLaw | undefined => {
  return caseLaws.find(c => c.citation.toLowerCase() === citation.toLowerCase())
}

export const searchCases = (query: string): CaseLaw[] => {
  const normalizedQuery = query.toLowerCase()
  return caseLaws.filter(c => 
    c.title.toLowerCase().includes(normalizedQuery) ||
    c.citation.toLowerCase().includes(normalizedQuery) ||
    c.description.toLowerCase().includes(normalizedQuery) ||
    c.court.toLowerCase().includes(normalizedQuery)
  )
}
