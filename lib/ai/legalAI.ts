export type IntentType = 
  | 'section_lookup'
  | 'punishment_query'
  | 'procedure_query'
  | 'case_law_search'
  | 'document_request'
  | 'guidance_request'
  | 'rights_explanation'
  | 'general_info'
  | 'greeting'
  | 'farewell'
  | 'out_of_scope'
  | 'unknown'

export interface Source {
  type: 'statute' | 'case_law' | 'regulation' | 'procedure'
  title: string
  reference: string
  verified: boolean
  lastVerified: string
}

export interface Intent {
  type: IntentType
  confidence: number
  entities: Entity[]
  language: 'en' | 'ur' | 'roman_urdu'
}

export interface Entity {
  type: 'section_number' | 'crime_type' | 'procedure_type' | 'document_type' | 'location'
  value: string
  confidence: number
}

export interface ChatResponse {
  text: string
  textUrdu: string
  intent: IntentType
  relevantSections?: string[]
  relevantCaseLaws?: string[]
  confidence: number
  sources: Source[]
  requiresVerification: boolean
  alternativeActions?: string[]
}

// Comprehensive PPC Sections Database (key sections)
const ppcSections: Record<number, { 
  title: string
  titleUrdu: string
  description: string
  descriptionUrdu: string
  punishment: string
  punishmentUrdu: string
  bailable: boolean
  compoundable: boolean
  cognizable: boolean
  court: string
} > = {
  34: {
    title: 'Acts done by several persons in furtherance of common intention',
    titleUrdu: 'مشترکہ ارادہ کے تقاضے پر کئی افراد کے ذریعے کیے گئے اعمال',
    description: 'When a criminal act is done by several persons in furtherance of the common intention of all, each of such persons is liable for that act in the same manner as if it were done by him alone.',
    descriptionUrdu: 'جب کئی افراد کے ذریعے ایک جرم مشترکہ ارادہ کے تقاضے پر کیا جاتا ہے، تو ہر شخص اس عمل کے لیے اسی طرح ذمہ دار ہے جیسے کہ اس نے اکیلے کیا ہو۔',
    punishment: 'Same as the principal offence',
    punishmentUrdu: 'اصلی جرم جیسی ہی سزا',
    bailable: true,
    compoundable: false,
    cognizable: true,
    court: 'Same as principal offence'
  },
  109: {
    title: 'Punishment of abetment if the act abetted is committed',
    titleUrdu: 'تحریک کی سزا اگر تحریک یافتہ عمل کیا جائے',
    description: 'Whoever abets any offence shall, if the act abetted is committed in consequence of the abetment, be punished with the punishment provided for the offence.',
    descriptionUrdu: 'جو کوئی کسی جرم کی تحریک کرے، اگر تحریک یافتہ عمل تحریک کے نتیجے میں کیا جائے، تو اسے اس جرم کی سزا دی جائے گی۔',
    punishment: 'Same as the offence abetted',
    punishmentUrdu: 'تحریک یافتہ جرم جیسی ہی سزا',
    bailable: true,
    compoundable: false,
    cognizable: true,
    court: 'Same as abetted offence'
  },
  120: {
    title: 'Concealing design to commit offence punishable with imprisonment',
    titleUrdu: 'قید کی سزا کے قابل جرم کرنے کے ارادہ کو چھپانا',
    description: 'Whoever, intending to facilitate or knowing it to be likely that he will thereby facilitate the commission of an offence, voluntarily conceals the existence of a design to commit such offence, shall be punished.',
    descriptionUrdu: 'جو کوئی اس ارادہ سے کہ وہ سہولت فراہم کرے گا یا یہ جانتے ہوئے کہ اس سے جرم کی تکمیل میں سہولت ملے گی، ایسے جرم کے ارادہ کے وجود کو رضاکارانہ طور پر چھپاتا ہے، اسے سزا دی جائے گی۔',
    punishment: 'Up to 7 years imprisonment + fine',
    punishmentUrdu: 'سات سال تک قید + جرمانہ',
    bailable: false,
    compoundable: false,
    cognizable: true,
    court: 'Magistrate of First Class'
  },
  141: {
    title: 'Unlawful assembly',
    titleUrdu: 'غیر قانونی اسمبلی',
    description: 'An assembly of five or more persons is designated an unlawful assembly if the common object of the persons composing that assembly is to commit an offence.',
    descriptionUrdu: 'پانچ یا زیادہ افراد کی اسمبلی کو غیر قانونی اسمبلی قرار دیا جاتا ہے اگر اس اسمبلی میں شامل افراد کا مشترکہ مقصد کسی جرم کا ارتکاب کرنا ہو۔',
    punishment: 'Imprisonment up to 6 months, or fine, or both',
    punishmentUrdu: 'چھ ماہ تک قید، یا جرمانہ، یا دونوں',
    bailable: true,
    compoundable: true,
    cognizable: true,
    court: 'Any Magistrate'
  },
  146: {
    title: 'Rioting',
    titleUrdu: 'فساد',
    description: 'Whenever force or violence is used by an unlawful assembly, or by any member thereof, in prosecution of the common object of such assembly, every member of such assembly is guilty of the offence of rioting.',
    descriptionUrdu: 'جب کسی غیر قانونی اسمبلی یا اس کے کسی رکن کے ذریعے اس اسمبلی کے مشترکہ مقصد کی تکمیل میں زور یا تشدد استعمال کیا جاتا ہے، تو اس اسمبلی کا ہر رکن فساد کے جرم کا مرتکب ہے۔',
    punishment: 'Imprisonment up to 2 years, or fine, or both',
    punishmentUrdu: 'دو سال تک قید، یا جرمانہ، یا دونوں',
    bailable: true,
    compoundable: true,
    cognizable: true,
    court: 'Magistrate of First Class'
  },
  161: {
    title: 'Public servant taking gratification other than legal remuneration',
    titleUrdu: 'سرکاری ملازم کا قانونی تنخواہ کے علاوہ رشوت لینا',
    description: 'Whoever, being or expecting to be a public servant, accepts or obtains any gratification whatever, other than legal remuneration, shall be punished.',
    descriptionUrdu: 'جو کوئی سرکاری ملازم ہو یا ہونے کی توقع رکھتا ہو، قانونی تنخواہ کے علاوہ کوئی بھی رشوت قبول کرتا یا حاصل کرتا ہے، اسے سزا دی جائے گی۔',
    punishment: 'Imprisonment up to 3 years, or fine, or both',
    punishmentUrdu: 'تین سال تک قید، یا جرمانہ، یا دونوں',
    bailable: true,
    compoundable: false,
    cognizable: true,
    court: 'Magistrate of First Class'
  },
  186: {
    title: 'Obstructing public servant in discharge of public functions',
    titleUrdu: 'سرکاری ملازم کو سرکاری فرائض کی انجام دہی میں رکاوٹ',
    description: 'Whoever voluntarily obstructs any public servant in the discharge of his public functions shall be punished.',
    descriptionUrdu: 'جو کوئی رضاکارانہ طور پر کسی سرکاری ملازم کو اس کے سرکاری فرائض کی انجام دہی میں رکاوٹ ڈالتا ہے، اسے سزا دی جائے گی۔',
    punishment: 'Imprisonment up to 3 months, or fine up to 500, or both',
    punishmentUrdu: 'تین ماہ تک قید، یا پانچ سو روپے تک جرمانہ، یا دونوں',
    bailable: true,
    compoundable: true,
    cognizable: true,
    court: 'Any Magistrate'
  },
  295: {
    title: 'Injuring or defiling place of worship',
    titleUrdu: 'عبادت گاہ کو نقصان پہنچانا یا ناپاک کرنا',
    description: 'Whoever destroys, damages or defiles any place of worship, or any object held sacred by any class of persons with the intention of insulting the religion of any person, shall be punished.',
    descriptionUrdu: 'جو کوئی کسی عبادت گاہ کو تباہ کرتا، نقصان پہنچاتا یا ناپاک کرتا ہے، یا کسی طبقے کے افراد کی طرف سے مقدس سمجھے جانے والے کسی چیز کو کسی شخص کے مذہب کی توہین کے ارادہ سے، اسے سزا دی جائے گی۔',
    punishment: 'Imprisonment up to 2 years, or fine, or both',
    punishmentUrdu: 'دو سال تک قید، یا جرمانہ، یا دونوں',
    bailable: false,
    compoundable: false,
    cognizable: true,
    court: 'Magistrate of First Class'
  },
  298: {
    title: 'Uttering words with deliberate intent to wound religious feelings',
    titleUrdu: 'مذہبی جذبات کو ٹھیس پہنچانے کے ارادہ سے الفاظ ادا کرنا',
    description: 'Whoever, with the deliberate intention of wounding the religious feelings of any person, utters any word or makes any sound shall be punished.',
    descriptionUrdu: 'جو کوئی کسی شخص کے مذہبی جذبات کو ٹھیس پہنچانے کے دانستہ ارادہ سے کوئی لفظ ادا کرتا یا کوئی آواز بناتا ہے، اسے سزا دی جائے گی۔',
    punishment: 'Imprisonment up to 1 year, or fine, or both',
    punishmentUrdu: 'ایک سال تک قید، یا جرمانہ، یا دونوں',
    bailable: true,
    compoundable: true,
    cognizable: true,
    court: 'Any Magistrate'
  },
  299: {
    title: 'Culpable homicide',
    titleUrdu: 'قابل مواخذہ قتل',
    description: 'Whoever causes death by doing an act with the intention of causing death, or with the intention of causing such bodily injury as is likely to cause death, commits culpable homicide.',
    descriptionUrdu: 'جو کوئی موت کا باعث بننے والے ارادہ سے یا ایسی جسمانی چوٹ کا باعث بننے کے ارادہ سے جو موت کا سبب بن سکتی ہے، کوئی عمل کرکے موت کا باعث بنتا ہے، قابل مواخذہ قتل کا مرتکب ہوتا ہے۔',
    punishment: 'Depends on circumstances',
    punishmentUrdu: 'حالات پر منحصر ہے',
    bailable: false,
    compoundable: false,
    cognizable: true,
    court: 'Court of Session'
  },
  302: {
    title: 'Punishment for murder',
    titleUrdu: 'قتل کی سزا',
    description: 'Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.',
    descriptionUrdu: 'جو کوئی قتل کرتا ہے اسے سزائے موت یا عمر قید کی سزا دی جائے گی اور اس پر جرمانہ بھی عائد کیا جائے گا۔',
    punishment: 'Death or imprisonment for life + fine',
    punishmentUrdu: 'سزائے موت یا عمر قید + جرمانہ',
    bailable: false,
    compoundable: false,
    cognizable: true,
    court: 'Court of Session'
  },
  304: {
    title: 'Punishment for culpable homicide not amounting to murder',
    titleUrdu: 'غیر ارادی قتل کی سزا',
    description: 'Whoever commits culpable homicide not amounting to murder shall be punished with imprisonment for life, or imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine.',
    descriptionUrdu: 'جو کوئی غیر ارادی قتل کرتا ہے اسے عمر قید یا دس سال تک کی قید کی سزا دی جائے گی اور جرمانہ بھی عائد کیا جائے گا۔',
    punishment: 'Imprisonment for life or up to 10 years + fine',
    punishmentUrdu: 'عمر قید یا دس سال تک قید + جرمانہ',
    bailable: true,
    compoundable: true,
    cognizable: true,
    court: 'Court of Session'
  },
  306: {
    title: 'Abetment of suicide',
    titleUrdu: 'خودکشی کی تحریک',
    description: 'If any person commits suicide, whoever abets the commission of such suicide, shall be punished with imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine.',
    descriptionUrdu: 'اگر کوئی شخص خودکشی کرتا ہے، جو کوئی اس خودکشی کی تحریک کرتا ہے، اسے دس سال تک قید کی سزا دی جائے گی اور جرمانہ بھی عائد کیا جائے گا۔',
    punishment: 'Up to 10 years imprisonment + fine',
    punishmentUrdu: 'دس سال تک قید + جرمانہ',
    bailable: false,
    compoundable: false,
    cognizable: true,
    court: 'Court of Session'
  },
  309: {
    title: 'Attempt to commit suicide',
    titleUrdu: 'خودکشی کی کوشش',
    description: 'Whoever attempts to commit suicide and does any act towards the commission of such offence, shall be punished with simple imprisonment for a term which may extend to one year, or with fine, or with both.',
    descriptionUrdu: 'جو کوئی خودکشی کی کوشش کرتا ہے اور اس جرم کی تکمیل کی طرف کوئی عمل کرتا ہے، اسے ایک سال تک سادہ قید یا جرمانے یا دونوں سے سزا دی جائے گی۔',
    punishment: 'Up to 1 year imprisonment, or fine, or both',
    punishmentUrdu: 'ایک سال تک قید، یا جرمانہ، یا دونوں',
    bailable: true,
    compoundable: true,
    cognizable: true,
    court: 'Any Magistrate'
  },
  319: {
    title: 'Hurt',
    titleUrdu: 'چوٹ',
    description: 'Whoever causes bodily pain, disease or infirmity to any person is said to cause hurt.',
    descriptionUrdu: 'جو کوئی کسی شخص کو جسمانی درد، بیماری یا کمزوری کا باعث بنتا ہے، اسے چوٹ لگانا کہا جاتا ہے۔',
    punishment: 'Depends on type of hurt',
    punishmentUrdu: 'چوٹ کی قسم پر منحصر ہے',
    bailable: true,
    compoundable: true,
    cognizable: true,
    court: 'Magistrate of First Class'
  },
  320: {
    title: 'Grievous hurt',
    titleUrdu: 'سنگین چوٹ',
    description: 'Grievous hurt includes emasculation, permanent privation of sight, hearing, or any joint, permanent disfiguration, fracture or dislocation of bone or tooth, or any hurt which endangers life.',
    descriptionUrdu: 'سنگین چوٹ میں خصیہ بندی، بینائی، سماعت یا کسی جوڑ کا مستقل ضیاع، مستقل بدصورتی، ہڈی یا دانت کا ٹوٹنا یا جگہ بدلنا، یا کوئی چوٹ جو جان کو خطرے میں ڈالے، شامل ہے۔',
    punishment: 'Imprisonment up to 7 years + fine',
    punishmentUrdu: 'سات سال تک قید + جرمانہ',
    bailable: true,
    compoundable: true,
    cognizable: true,
    court: 'Court of Session'
  },
  322: {
    title: 'Voluntarily causing hurt',
    titleUrdu: 'رضاکارانہ طور پر چوٹ لگانا',
    description: 'Whoever voluntarily causes hurt, if the hurt which he intends to cause or knows himself to be likely to cause is grievous hurt, shall be punished.',
    descriptionUrdu: 'جو کوئی رضاکارانہ طور پر چوٹ لگاتا ہے، اگر وہ چوٹ جو وہ لگانے کا ارادہ رکھتا ہے یا جانتا ہے کہ اس کے لگانے کا امکان ہے سنگین چوٹ ہے، اسے سزا دی جائے گی۔',
    punishment: 'Up to 3 years imprisonment, or fine, or both',
    punishmentUrdu: 'تین سال تک قید، یا جرمانہ، یا دونوں',
    bailable: true,
    compoundable: true,
    cognizable: true,
    court: 'Magistrate of First Class'
  },
  324: {
    title: 'Voluntarily causing hurt by dangerous weapons',
    titleUrdu: 'خطرناک ہتھیاروں سے چوٹ لگانا',
    description: 'Whoever voluntarily causes hurt by means of any instrument for shooting, stabbing or cutting, or any instrument which is used as a weapon of offence, shall be punished.',
    descriptionUrdu: 'جو کوئی کسی فائرنگ، وار یا کاٹنے کے آلے یا کسی ایسے آلے سے جو جرم کا ہتھیار کے طور پر استعمال ہوتا ہے، رضاکارانہ طور پر چوٹ لگاتا ہے، اسے سزا دی جائے گی۔',
    punishment: 'Up to 3 years imprisonment, or fine, or both',
    punishmentUrdu: 'تین سال تک قید، یا جرمانہ، یا دونوں',
    bailable: true,
    compoundable: true,
    cognizable: true,
    court: 'Magistrate of First Class'
  },
  337: {
    title: 'Assault',
    titleUrdu: 'حملہ',
    description: 'Whoever makes any gesture, or any preparation intending or knowing it to be likely that such gesture or preparation will cause any person present to apprehend that he is about to use criminal force to that person, is said to commit an assault.',
    descriptionUrdu: 'جو کوئی اشارہ یا تیاری کرتا ہے اس ارادہ سے یا یہ جانتے ہوئے کہ اس اشارے یا تیاری سے موجود کوئی شخص اس بات کا خدشہ کرے گا کہ وہ اس شخص پر جرائم قوت استعمال کرنے والا ہے، حملہ کا مرتکب کہلاتا ہے۔',
    punishment: 'Up to 3 months imprisonment, or fine up to 500, or both',
    punishmentUrdu: 'تین ماہ تک قید، یا پانچ سو روپے تک جرمانہ، یا دونوں',
    bailable: true,
    compoundable: true,
    cognizable: true,
    court: 'Any Magistrate'
  },
  354: {
    title: 'Assault or criminal force to woman with intent to outrage her modesty',
    titleUrdu: 'عورت کی حیاء کو مجروح کرنے کے ارادہ سے حملہ یا جرائم قوت',
    description: 'Whoever assaults or uses criminal force to any woman, intending to outrage or knowing it to be likely that he will thereby outrage her modesty, shall be punished.',
    descriptionUrdu: 'جو کوئی کسی عورت پر حملہ کرتا ہے یا جرائم قوت استعمال کرتا ہے، اس ارادہ سے کہ وہ اس کی حیاء کو مجروح کرے گا یا یہ جانتے ہوئے کہ اس سے اس کی حیاء مجروح ہوگی، اسے سزا دی جائے گی۔',
    punishment: 'Imprisonment of 1 to 5 years + fine',
    punishmentUrdu: 'ایک سے پانچ سال قید + جرمانہ',
    bailable: false,
    compoundable: false,
    cognizable: true,
    court: 'Magistrate of First Class'
  },
  365: {
    title: 'Kidnapping or abducting with intent secretly and wrongfully to confine person',
    titleUrdu: 'شخص کو خفیہ اور غلط طریقے سے قید کرنے کے ارادہ سے اغوا',
    description: 'Whoever kidnaps or abducts any person with intent to cause that person to be secretly and wrongfully confined, shall be punished.',
    descriptionUrdu: 'جو کوئی کسی شخص کو اس ارادہ سے اغوا کرتا ہے کہ اس شخص کو خفیہ اور غلط طریقے سے قید کیا جائے، اسے سزا دی جائے گی۔',
    punishment: 'Up to 7 years imprisonment + fine',
    punishmentUrdu: 'سات سال تک قید + جرمانہ',
    bailable: true,
    compoundable: false,
    cognizable: true,
    court: 'Magistrate of First Class'
  },
  366: {
    title: 'Kidnapping, abducting or inducing woman to compel her marriage',
    titleUrdu: 'شادی پر مجبور کرنے کے لیے عورت کا اغوا',
    description: 'Whoever kidnaps or abducts any woman with intent that she may be compelled, or knowing it to be likely that she will be compelled, to marry any person against her will, shall be punished.',
    descriptionUrdu: 'جو کوئی کسی عورت کو اس ارادہ سے اغوا کرتا ہے کہ اسے مجبور کیا جائے، یا یہ جانتے ہوئے کہ اسے مجبور کیا جائے گا، کہ وہ اپنی مرضی کے خلاف کسی سے شادی کرے، اسے سزا دی جائے گی۔',
    punishment: 'Up to 10 years imprisonment + fine',
    punishmentUrdu: 'دس سال تک قید + جرمانہ',
    bailable: false,
    compoundable: false,
    cognizable: true,
    court: 'Court of Session'
  },
  375: {
    title: 'Rape',
    titleUrdu: 'زیادتی',
    description: 'A man is said to commit rape who has sexual intercourse with a woman under circumstances falling under any of the five following descriptions: against her will, without her consent, with consent obtained by fear, with consent when she is unable to understand, or with consent when she is under sixteen.',
    descriptionUrdu: 'ایک آدمی کو زیادتی کا مرتکب کہا جاتا ہے جو کسی عورت سے جنسی تعلقات اس کی مرضی کے خلاف، اس کی رضامندی کے بغیر، خوف سے حاصل کردہ رضامندی سے، جب وہ سمجھنے سے قاصر ہو، یا جب وہ سولہ سال سے کم عمر ہو۔',
    punishment: 'Death or imprisonment for life + fine',
    punishmentUrdu: 'سزائے موت یا عمر قید + جرمانہ',
    bailable: false,
    compoundable: false,
    cognizable: true,
    court: 'Court of Session'
  },
  376: {
    title: 'Punishment for rape',
    titleUrdu: 'زیادتی کی سزا',
    description: 'Whoever commits rape shall be punished with death or imprisonment of either description for a term which shall not be less than ten years or more, than twenty-five years and shall also be liable to fine.',
    descriptionUrdu: 'جو کوئی زیادتی کرتا ہے اسے سزائے موت یا کم از کم دس سال اور زیادہ سے زیادہ پچیس سال تک قید کی سزا دی جائے گی اور جرمانہ بھی عائد کیا جائے گا۔',
    punishment: 'Death or 10-25 years imprisonment + fine',
    punishmentUrdu: 'سزائے موت یا 10-25 سال قید + جرمانہ',
    bailable: false,
    compoundable: false,
    cognizable: true,
    court: 'Court of Session'
  },
  378: {
    title: 'Theft',
    titleUrdu: 'چوری',
    description: 'Whoever, intending to take dishonestly any movable property out of the possession of any person without that person\'s consent, moves that property in order to such taking, is said to commit theft.',
    descriptionUrdu: 'جو کوئی کسی شخص کی اجازت کے بغیر اس کی ملکیت سے کوئی منقولہ جائداد ناجائز طور پر لینے کا ارادہ رکھتے ہوئے اسے منتقل کرتا ہے، چوری کا مرتکب کہلاتا ہے۔',
    punishment: 'Imprisonment up to 3 years, or fine, or both',
    punishmentUrdu: 'تین سال تک قید، یا جرمانہ، یا دونوں',
    bailable: true,
    compoundable: true,
    cognizable: true,
    court: 'Any Magistrate'
  },
  379: {
    title: 'Punishment for theft',
    titleUrdu: 'چوری کی سزا',
    description: 'Whoever commits theft shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both.',
    descriptionUrdu: 'جو کوئی چوری کرتا ہے اسے تین سال تک قید یا جرمانے یا دونوں سے سزا دی جائے گی۔',
    punishment: 'Up to 3 years imprisonment, or fine, or both',
    punishmentUrdu: 'تین سال تک قید، یا جرمانہ، یا دونوں',
    bailable: true,
    compoundable: true,
    cognizable: true,
    court: 'Any Magistrate'
  },
  380: {
    title: 'Theft in dwelling house',
    titleUrdu: 'مکان میں چوری',
    description: 'Whoever commits theft in any building, tent or vessel used as a human dwelling shall be punished.',
    descriptionUrdu: 'جو کوئی کسی ایسی عمارت، خیمہ یا جہاز میں چوری کرتا ہے جو انسانی رہائش کے طور پر استعمال ہوتا ہے، اسے سزا دی جائے گی۔',
    punishment: 'Up to 7 years imprisonment + fine',
    punishmentUrdu: 'سات سال تک قید + جرمانہ',
    bailable: true,
    compoundable: true,
    cognizable: true,
    court: 'Magistrate of First Class'
  },
  381: {
    title: 'Theft by clerk or servant of property in possession of master',
    titleUrdu: 'ملازم کا آقا کی ملکیت چوری کرنا',
    description: 'Whoever, being a clerk or servant, commits theft of any property in the possession of his master, shall be punished.',
    descriptionUrdu: 'جو کوئی کلرک یا ملازم ہوتے ہوئے اپنے آقا کی ملکیت میں کسی جائداد کی چوری کرتا ہے، اسے سزا دی جائے گی۔',
    punishment: 'Up to 7 years imprisonment + fine',
    punishmentUrdu: 'سات سال تک قید + جرمانہ',
    bailable: true,
    compoundable: true,
    cognizable: true,
    court: 'Magistrate of First Class'
  },
  382: {
    title: 'Theft after preparation made for causing death, hurt or restraint',
    titleUrdu: 'موت، چوٹ یا پابندی کا باعث بننے کی تیاری کے بعد چوری',
    description: 'Whoever commits theft, having made preparation for causing death, or hurt, or restraint, shall be punished.',
    descriptionUrdu: 'جو کوئی موت، چوٹ یا پابندی کا باعث بننے کی تیاری کرنے کے بعد چوری کرتا ہے، اسے سزا دی جائے گی۔',
    punishment: 'Up to 10 years imprisonment + fine',
    punishmentUrdu: 'دس سال تک قید + جرمانہ',
    bailable: false,
    compoundable: false,
    cognizable: true,
    court: 'Court of Session'
  },
  391: {
    title: 'Dacoity',
    titleUrdu: 'ڈاکہ',
    description: 'When five or more persons conjointly commit or attempt to commit a robbery, or where the whole number of persons conjointly committing or attempting to commit a robbery, and persons present and aiding such commission or attempt, amount to five or more, every person so committing, attempting or aiding, is said to commit dacoity.',
    descriptionUrdu: 'جب پانچ یا زیادہ افراد مشترکہ طور پر ڈکیتی کرتے یا کرنے کی کوشش کرتے ہیں، یا جہاں مشترکہ طور پر ڈکیتی کرنے یا کرنے کی کوشش کرنے والوں کی کل تعداد اور اس کمیشن یا کوشش میں مدد کرنے والے موجود افراد پانچ یا زیادہ ہوں، تو ہر شخص ڈاکہ کا مرتکب کہلاتا ہے۔',
    punishment: 'Imprisonment for life, or up to 10 years + fine',
    punishmentUrdu: 'عمر قید، یا دس سال تک قید + جرمانہ',
    bailable: false,
    compoundable: false,
    cognizable: true,
    court: 'Court of Session'
  },
  396: {
    title: 'Dacoity with murder',
    titleUrdu: 'قتل کے ساتھ ڈاکہ',
    description: 'If any one of five or more persons, who are conjointly committing dacoity, commits murder in so committing dacoity, every one of those persons shall be punished.',
    descriptionUrdu: 'اگر پانچ یا زیادہ افراد میں سے کوئی ایک، جو مشترکہ طور پر ڈاکہ کر رہے ہیں، ڈاکہ کرنے میں قتل کرتا ہے، تو ان میں سے ہر شخص کو سزا دی جائے گی۔',
    punishment: 'Death, or imprisonment for life, or up to 10 years + fine',
    punishmentUrdu: 'سزائے موت، یا عمر قید، یا دس سال تک قید + جرمانہ',
    bailable: false,
    compoundable: false,
    cognizable: true,
    court: 'Court of Session'
  },
  406: {
    title: 'Criminal breach of trust',
    titleUrdu: 'اعتماد کی مجرمانہ خلاف ورزی',
    description: 'Whoever, being in any manner entrusted with property, or with any dominion over property, dishonestly misappropriates or converts to his own use that property, shall be punished.',
    descriptionUrdu: 'جو کوئی کسی بھی طرح جائداد یا جائداد پر کسی قسم کی حکمرانی کے ساتھ امانت دار ہو، ناجائز طور پر اس جائداد کا غبن کرتا ہے یا اپنے استعمال میں لاتا ہے، اسے سزا دی جائے گی۔',
    punishment: 'Up to 3 years imprisonment, or fine, or both',
    punishmentUrdu: 'تین سال تک قید، یا جرمانہ، یا دونوں',
    bailable: true,
    compoundable: true,
    cognizable: true,
    court: 'Magistrate of First Class'
  },
  409: {
    title: 'Criminal breach of trust by public servant',
    titleUrdu: 'سرکاری ملازم کی طرف سے اعتماد کی مجرمانہ خلاف ورزی',
    description: 'Whoever, being in any manner entrusted with property, or with any dominion over property in his capacity of a public servant, commits criminal breach of trust, shall be punished.',
    descriptionUrdu: 'جو کوئی کسی بھی طرح جائداد یا جائداد پر کسی قسم کی حکمرانی کے ساتھ امانت دار ہو اپنے سرکاری ملازم کی حیثیت میں، اعتماد کی مجرمانہ خلاف ورزی کرتا ہے، اسے سزا دی جائے گی۔',
    punishment: 'Imprisonment for life, or up to 10 years + fine',
    punishmentUrdu: 'عمر قید، یا دس سال تک قید + جرمانہ',
    bailable: false,
    compoundable: false,
    cognizable: true,
    court: 'Court of Session'
  },
  411: {
    title: 'Dishonestly receiving stolen property',
    titleUrdu: 'چوری شدہ جائداد ناجائز طور پر وصول کرنا',
    description: 'Whoever dishonestly receives or retains any stolen property, knowing or having reason to believe the same to be stolen property, shall be punished.',
    descriptionUrdu: 'جو کوئی کسی چوری شدہ جائداد کو ناجائز طور پر وصول کرتا یا برقرار رکھتا ہے، یہ جانتے ہوئے یا اس بات پر یقین کرنے کی وجہ رکھتے ہوئے کہ وہ چوری شدہ جائداد ہے، اسے سزا دی جائے گی۔',
    punishment: 'Imprisonment up to 3 years, or fine, or both',
    punishmentUrdu: 'تین سال تک قید، یا جرمانہ، یا دونوں',
    bailable: true,
    compoundable: true,
    cognizable: true,
    court: 'Any Magistrate'
  },
  420: {
    title: 'Cheating and dishonestly inducing delivery of property',
    titleUrdu: 'دھوکہ دہی اور ناجائز طور پر جائداد کی ترسیل',
    description: 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.',
    descriptionUrdu: 'جو کوئی دھوکہ دہی کرکے دھوکا کھانے والے شخص کو کسی جائداد کی ترسیل پر مجبور کرتا ہے، اسے سات سال تک قید کی سزا دی جائے گی اور جرمانہ بھی عائد کیا جائے گا۔',
    punishment: 'Up to 7 years imprisonment + fine',
    punishmentUrdu: 'سات سال تک قید + جرمانہ',
    bailable: true,
    compoundable: false,
    cognizable: true,
    court: 'Magistrate of First Class'
  },
  452: {
    title: 'House-trespass after preparation for hurt, assault or wrongful restraint',
    titleUrdu: 'چوٹ، حملہ یا غلط پابندی کی تیاری کے بعد گھر میں داخلہ',
    description: 'Whoever commits house-trespass, having made preparation for causing hurt to any person or for assaulting any person, shall be punished.',
    descriptionUrdu: 'جو کوئی کسی شخص کو چوٹ پہنچانے یا کسی شخص پر حملہ کرنے کی تیاری کرنے کے بعد گھر میں داخلہ کرتا ہے، اسے سزا دی جائے گی۔',
    punishment: 'Up to 7 years imprisonment + fine',
    punishmentUrdu: 'سات سال تک قید + جرمانہ',
    bailable: false,
    compoundable: false,
    cognizable: true,
    court: 'Magistrate of First Class'
  },
  457: {
    title: 'Lurking house-trespass or house-breaking by night',
    titleUrdu: 'رات کو گھر میں چھپ کر داخلہ یا گھر توڑنا',
    description: 'Whoever commits lurking house-trespass by night, or house-breaking by night, shall be punished.',
    descriptionUrdu: 'جو کوئی رات کو گھر میں چھپ کر داخلہ کرتا ہے یا گھر توڑتا ہے، اسے سزا دی جائے گی۔',
    punishment: 'Up to 3 years imprisonment + fine',
    punishmentUrdu: 'تین سال تک قید + جرمانہ',
    bailable: false,
    compoundable: false,
    cognizable: true,
    court: 'Magistrate of First Class'
  },
  489: {
    title: 'Counterfeiting currency notes or bank notes',
    titleUrdu: 'کرنسی نوٹس یا بینک نوٹس کی جعل سازی',
    description: 'Whoever counterfeits, or knowingly performs any part of the process of counterfeiting, any currency note or bank note, shall be punished.',
    descriptionUrdu: 'جو کوئی کسی کرنسی نوٹ یا بینک نوٹ کی جعل سازی کرتا ہے، یا جعل سازی کے عمل کا کسی بھی حصے کو جانتے ہوئے انجام دیتا ہے، اسے سزا دی جائے گی۔',
    punishment: 'Imprisonment for life, or up to 10 years + fine',
    punishmentUrdu: 'عمر قید، یا دس سال تک قید + جرمانہ',
    bailable: false,
    compoundable: false,
    cognizable: true,
    court: 'Court of Session'
  },
  496: {
    title: 'Marriage ceremony fraudulently gone through without lawful marriage',
    titleUrdu: 'بغیر قانونی شادی کے دھوکہ سے شادی کی تقریب',
    description: 'Whoever, dishonestly or with a fraudulent intention, goes through the ceremony of being married, knowing that he is not thereby lawfully married, shall be punished.',
    descriptionUrdu: 'جو کوئی ناجائز طور پر یا دھوکہ کے ارادہ سے شادی کی تقریب کرتا ہے، یہ جانتے ہوئے کہ اس سے وہ قانونی طور پر شادی شدہ نہیں ہے، اسے سزا دی جائے گی۔',
    punishment: 'Up to 7 years imprisonment + fine',
    punishmentUrdu: 'سات سال تک قید + جرمانہ',
    bailable: true,
    compoundable: true,
    cognizable: true,
    court: 'Magistrate of First Class'
  },
  500: {
    title: 'Punishment for defamation',
    titleUrdu: 'تہمت کی سزا',
    description: 'Whoever defames another shall be punished with simple imprisonment for a term which may extend to two years, or with fine, or with both.',
    descriptionUrdu: 'جو کوئی کسی کی تہمت کرتا ہے اسے دو سال تک سادہ قید یا جرمانے یا دونوں سے سزا دی جائے گی۔',
    punishment: 'Up to 2 years imprisonment, or fine, or both',
    punishmentUrdu: 'دو سال تک قید، یا جرمانہ، یا دونوں',
    bailable: true,
    compoundable: true,
    cognizable: true,
    court: 'Any Magistrate'
  },
  504: {
    title: 'Intentional insult with intent to provoke breach of the peace',
    titleUrdu: 'امن شکنی کی تحریک کے ارادہ سے دانستہ توہین',
    description: 'Whoever intentionally insults, and thereby gives provocation to any person, intending or knowing it to be likely that such provocation will cause him to break the public peace, shall be punished.',
    descriptionUrdu: 'جو کوئی دانستہ طور پر توہین کرکے کسی شخص کو تحریک دیتا ہے، اس ارادہ سے یا یہ جانتے ہوئے کہ اس تحریک سے وہ عوامی امن توڑے گا، اسے سزا دی جائے گی۔',
    punishment: 'Up to 2 years imprisonment, or fine, or both',
    punishmentUrdu: 'دو سال تک قید، یا جرمانہ، یا دونوں',
    bailable: true,
    compoundable: true,
    cognizable: true,
    court: 'Any Magistrate'
  },
  506: {
    title: 'Punishment for criminal intimidation',
    titleUrdu: 'مجرمانہ دھمکی کی سزا',
    description: 'Whoever commits the offence of criminal intimidation shall be punished with imprisonment of either description for a term which may extend to two years, or with fine, or with both.',
    descriptionUrdu: 'جو کوئی مجرمانہ دھمکی کا جرم کرتا ہے اسے دو سال تک قید یا جرمانے یا دونوں سے سزا دی جائے گی۔',
    punishment: 'Up to 2 years imprisonment, or fine, or both',
    punishmentUrdu: 'دو سال تک قید، یا جرمانہ، یا دونوں',
    bailable: true,
    compoundable: true,
    cognizable: true,
    court: 'Any Magistrate'
  },
  509: {
    title: 'Word, gesture or act intended to insult the modesty of a woman',
    titleUrdu: 'عورت کی حیاء کی توہین کے ارادہ سے لفظ، اشارہ یا عمل',
    description: 'Whoever, intending to insult the modesty of any woman, utters any word, makes any sound or gesture, or exhibits any object, shall be punished.',
    descriptionUrdu: 'جو کوئی کسی عورت کی حیاء کی توہین کے ارادہ سے کوئی لفظ ادا کرتا ہے، کوئی آواز بناتا ہے یا اشارہ کرتا ہے، یا کوئی چیز دکھاتا ہے، اسے سزا دی جائے گی۔',
    punishment: 'Up to 1 year imprisonment, or fine, or both',
    punishmentUrdu: 'ایک سال تک قید، یا جرمانہ، یا دونوں',
    bailable: true,
    compoundable: true,
    cognizable: true,
    court: 'Any Magistrate'
  },
}

// Keywords indicating non-Pakistani law queries
const foreignLawKeywords = [
  'india', 'indian', 'bharat', 'hindustan',
  'usa', 'america', 'american', 'united states',
  'uk', 'britain', 'british', 'england', 'scotland',
  'canada', 'canadian',
  'australia', 'australian',
  'uae', 'dubai', 'abu dhabi',
  'saudi', 'saudi arabia', 'ksa',
  'bangladesh', 'bangladeshi',
  'iran', 'iranian',
  'afghanistan', 'afghan',
  'china', 'chinese',
  'turkey', 'turkish',
  'europe', 'european', 'eu',
  'indian penal code', 'ipc', 'bns', 'bharatiya',
  'constitution of india', 'supreme court of india',
  'high court of delhi', 'high court of bombay',
  'section 420 ipc', 'section 302 ipc', 'section 375 ipc'
]

// Roman Urdu common words for detection
const romanUrduWords = [
  'kya', 'hai', 'ka', 'ki', 'ke', 'ko', 'se', 'mein', 'main', 'mera', 'meri',
  'aap', 'tum', 'tu', 'kahan', 'kaise', 'kyun', 'kab', 'kitna', 'kaun', 'konsa',
  'karna', 'karo', 'kare', 'kariye', 'kijiye', 'chahiye', 'hai', 'hain', 'tha',
  'batao', 'bataen', 'samjhao', 'samjhaen', 'mujhe', 'mujhko', 'mujhse',
  'qanoon', 'kanoon', 'qanun', 'qanuni', 'qanooni', 'adl', 'adalat', 'court',
  'case', 'mukadma', 'muqadma', 'mukadme', 'muqadme', 'jurm', 'jurm', 'gunah',
  'saza', 'sazaa', 'jail', 'qaid', 'zamanat', 'bail', 'wakil', 'vakil', 'lawyer',
  'hak', 'huqooq', 'haq', 'talaq', 'shadi', 'nikah', 'khula', 'mehr', 'dower',
  'property', 'jaidad', 'jaaidad', 'zameen', 'ghar', 'makan', 'karobari',
  'fir', 'report', 'tahreer', 'shikayat', 'complaint', 'wirasat', 'virasat'
]

export class PakistanLegalAI {
  private conversationHistory: Array<{ role: 'user' | 'assistant'; content: string; language: 'en' | 'ur' | 'roman_urdu' }> = []

  detectLanguage(input: string): 'en' | 'ur' | 'roman_urdu' {
    const urduChars = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/
    const normalizedInput = input.toLowerCase()
    
    // Check for Urdu script first
    if (urduChars.test(input)) {
      return 'ur'
    }
    
    // Check for Roman Urdu
    const words = normalizedInput.split(/\s+/)
    const romanUrduMatches = words.filter(word => romanUrduWords.includes(word)).length
    if (romanUrduMatches >= 2) {
      return 'roman_urdu'
    }
    
    return 'en'
  }

  private isOutOfScope(input: string): boolean {
    const normalizedInput = input.toLowerCase()
    return foreignLawKeywords.some(keyword => normalizedInput.includes(keyword))
  }

  private getOutOfScopeResponse(language: 'en' | 'ur' | 'roman_urdu'): ChatResponse {
    const responses = {
      en: {
        text: `I apologize, but I can only provide information about Pakistani law. Your question appears to be about the legal system of another country.

I am specifically designed to assist with:
- Laws of Pakistan (including all provinces and territories)
- Pakistan Penal Code (PPC)
- Constitution of Pakistan
- Pakistani case law from Supreme Court and High Courts
- Legal procedures in Pakistan

For questions about other countries' legal systems, please consult a legal professional licensed in that jurisdiction.`,
        textUrdu: 'معذرت، لیکن میں صرف پاکستانی قانون کے بارے میں معلومات فراہم کر سکتا ہوں۔'
      },
      ur: {
        text: 'I apologize, but I can only provide information about Pakistani law.',
        textUrdu: `معذرت، لیکن میں صرف پاکستانی قانون کے بارے میں معلومات فراہم کر سکتا ہوں۔ آپ کا سوال کسی دوسرے ملک کے قانونی نظام کے بارے میں معلومات مانگتا ہے۔

میں خاص طور پر درج ذیل معاملات میں مدد کے لیے ڈیزائن کیا گیا ہوں:
- پاکستان کے قوانین (تمام صوبوں اور علاقوں سمیت)
- پاکستان پینل کوڈ (پی پی سی)
- آئین پاکستان
- سپریم کورٹ اور ہائی کورٹس کے پاکستانی کیس لا
- پاکستان میں قانونی طریقہ کار

دیگر ممالک کے قانونی نظام کے بارے میں سوالات کے لیے، براہ کرم اس حدود اختیار میں لائسنس یافتہ قانونی پیشہ ور سے مشورہ کریں۔`
      },
      roman_urdu: {
        text: 'I apologize, but I can only provide information about Pakistani law.',
        textUrdu: `Maazrat, lekin main sirf Pakistani qanoon ke baare mein maloomat faraham kar sakta hoon. Aap ka sawal kisi doosre mulk ke qanooni nizaam ke baare mein maloomat maangta hai.

Main khaas tor par darj zeel maamlaat mein madad ke liye design kiya gaya hoon:
- Pakistan ke qanoon (tamam subon aur ilaqon samet)
- Pakistan Penal Code (PPC)
- Aeen Pakistan
- Supreme Court aur High Courts ke Pakistani case law
- Pakistan mein qanooni tareeqa kar

Doosre mulkon ke qanooni nizaam ke baare mein sawalaat ke liye, barah-e-karam is hudood-e-ikhtiyar mein license yafta qanooni pesha war se mashwara karein.`
      }
    }

    const response = responses[language]
    return {
      text: response.text,
      textUrdu: response.textUrdu,
      intent: 'out_of_scope',
      confidence: 1.0,
      sources: [],
      requiresVerification: false,
      alternativeActions: [
        'Ask about Pakistani law topics',
        'Consult a local lawyer in that jurisdiction'
      ]
    }
  }

  detectIntent(input: string, language: 'en' | 'ur' | 'roman_urdu'): Intent {
    const normalizedInput = input.toLowerCase().trim()
    let bestIntent: IntentType = 'unknown'
    let highestConfidence = 0
    const entities: Entity[] = []

    const patterns: Record<string, RegExp[]> = {
      section_lookup: language === 'ur' 
        ? [/دفعہ\s*(\d+)/, /سیکشن\s*(\d+)/, /section\s*(\d+)/i] 
        : [/section\s*(\d+)/i, /ppc\s*(\d+)/i, /article\s*(\d+)/i],
      greeting: language === 'ur' || language === 'roman_urdu'
        ? [/^(سلام|السلام\s*علیکم|assalam|salam|hello|hi|hey)/i]
        : [/^(hi|hello|hey|assalam|salam)/i],
      punishment_query: language === 'ur' || language === 'roman_urdu'
        ? [/سزا\s*کیا\s*ہے/, /سزا\s*کے\s*لیے/, /saza\s*kya/, /saza\s*kitni/, /punishment\s*for/i, /penalty\s*for/i]
        : [/punishment\s*for/i, /penalty\s*for/i, /sentence\s*for/i],
      procedure_query: language === 'ur' || language === 'roman_urdu'
        ? [/طریقہ\s*کار/, /کیسے/, /kaise\s*kare/, /kaise\s*kar/, /procedure\s*for/i, /how\s*to/i, /process\s*of/i]
        : [/procedure\s*for/i, /how\s*to/i, /process\s*of/i, /steps\s*to/i],
      rights_explanation: language === 'ur' || language === 'roman_urdu'
        ? [/حقوق/, /huqooq/, /haq/, /rights/i, /my\s*right/i]
        : [/rights/i, /my\s*right/i, /legal\s*right/i],
      document_request: language === 'ur' || language === 'roman_urdu'
        ? [/دستاویز/, /document/i, /form/i, /application/i, /darj/i, /tahreer/]
        : [/document/i, /form/i, /application/i, /template/i],
      case_law_search: language === 'ur' || language === 'roman_urdu'
        ? [/کیس\s*لا/, /case\s*law/i, /judgment/i, /decision/i, /court\s*case/i, /ruling/i]
        : [/case\s*law/i, /judgment/i, /decision/i, /court\s*case/i, /ruling/i, /precedent/i],
      farewell: language === 'ur' || language === 'roman_urdu'
        ? [/اللہ\s*حافظ/, /خدا\s*حافظ/, /bye/i, /goodbye/i, /allah\s*hafiz/, /khuda\s*hafiz/]
        : [/bye/i, /goodbye/i, /thank/i, /thanks/i],
    }

    for (const [intentType, intentPatterns] of Object.entries(patterns)) {
      let matchCount = 0
      for (const pattern of intentPatterns) {
        if (pattern.test(normalizedInput)) {
          matchCount++
          const matches = normalizedInput.match(pattern)
          if (matches && matches[1]) {
            entities.push({ type: 'section_number', value: matches[1], confidence: 0.9 })
          }
        }
      }
      if (matchCount > 0 && matchCount > highestConfidence) {
        highestConfidence = matchCount
        bestIntent = intentType as IntentType
      }
    }

    return { type: bestIntent, confidence: highestConfidence, entities, language }
  }

  generateResponse(input: string, intent: Intent): ChatResponse {
    const { type, entities, language } = intent

    switch (type) {
      case 'greeting':
        return this.handleGreeting(language)
      case 'section_lookup':
        return this.handleSectionLookup(input, entities, language)
      case 'punishment_query':
        return this.handlePunishmentQuery(input, entities, language)
      case 'procedure_query':
        return this.handleProcedureQuery(input, language)
      case 'rights_explanation':
        return this.handleRightsQuery(input, language)
      case 'document_request':
        return this.handleDocumentRequest(input, language)
      case 'case_law_search':
        return this.handleCaseLawQuery(input, language)
      case 'farewell':
        return this.handleFarewell(language)
      default:
        return this.handleUnknown(language)
    }
  }

  private createSource(type: Source['type'], title: string, reference: string): Source {
    return {
      type,
      title,
      reference,
      verified: true,
      lastVerified: '2025-03-01'
    }
  }

  private handleGreeting(_language: 'en' | 'ur' | 'roman_urdu'): ChatResponse {
    const response = {
      en: {
        text: `Assalam-o-Alaikum. Welcome to PakLegal AI.

I provide general legal information about Pakistani law including:

- Pakistan Penal Code (all 511 sections)
- Legal procedures and constitutional rights
- Case law references from superior courts
- Document templates and formats
- Step-by-step legal guidance

Please note: This information is for general guidance only and does not constitute legal advice. For specific legal matters, please consult a qualified lawyer licensed to practice in Pakistan.

How may I assist you today?`,
        textUrdu: 'السلام علیکم۔ پاک لیگل ای آئی میں خوش آمدید۔'
      },
      ur: {
        text: 'Assalam-o-Alaikum. Welcome to PakLegal AI.',
        textUrdu: `السلام علیکم۔ پاک لیگل ای آئی میں خوش آمدید۔

میں پاکستانی قانون کے بارے میں عام قانونی معلومات فراہم کرتا ہوں جن میں شامل ہیں:

- پاکستان پینل کوڈ (تمام 511 دفعات)
- قانونی طریقہ کار اور آئینی حقوق
- سپریم کورٹ اور ہائی کورٹس کے فیصلے
- دستاویز ٹیمپلیٹس اور فارمیٹس
- قدم بہ قدم قانونی رہنمائی

نوٹ: یہ معلومات صرف عام رہنمائی کے لیے ہیں اور قانونی مشورے کا درجہ نہیں رکھتیں۔ مخصوص قانونی معاملات کے لیے، براہ کرم پاکستان میں وکالت کرنے کے لیے لائسنس یافتہ اہل وکیل سے مشورہ کریں۔

آج میں آپ کی کس طرح مدد کر سکتا ہوں؟`
      },
      roman_urdu: {
        text: 'Assalam-o-Alaikum. Welcome to PakLegal AI.',
        textUrdu: `Assalam-o-Alaikum. PakLegal AI mein khush amdeed.

Main Pakistani qanoon ke baare mein aam qanooni maloomat faraham karta hoon jin mein shamil hain:

- Pakistan Penal Code (tamam 511 dafaat)
- Qanooni tareeqa kar aur aeeni huqooq
- Supreme Court aur High Courts ke faislay
- Dastaweez templates aur formats
- Qadam ba qadam qanooni rahnumai

Note: Ye maloomat sirf aam rahnumai ke liye hain aur qanooni mashware ka darja nahi rakhteen. Khusoos qanooni maamlaat ke liye, barah-e-karam Pakistan mein wukala karne ke liye license yafta ahil wakeel se mashwara karein.

Aaj main aap ki kis tarah madad kar sakta hoon?`
      }
    }

    const langResponse = response[_language] || response.en
    return {
      text: langResponse.text,
      textUrdu: langResponse.textUrdu,
      intent: 'greeting',
      confidence: 1.0,
      sources: [],
      requiresVerification: false
    }
  }

  private handleSectionLookup(input: string, _entities: Entity[], language: 'en' | 'ur' | 'roman_urdu'): ChatResponse {
    const sectionMatch = input.match(/(\d+)/)
    const sectionNum = sectionMatch ? parseInt(sectionMatch[1]) : null

    if (sectionNum && ppcSections[sectionNum]) {
      const section = ppcSections[sectionNum]
      const sources = [this.createSource('statute', `Pakistan Penal Code, Section ${sectionNum}`, `PPC Section ${sectionNum}`)]
      
      const responses = {
        en: {
          text: `Section ${sectionNum} PPC - ${section.title}

Description: ${section.description}

Punishment: ${section.punishment}

Legal Classification:
- Bailable: ${section.bailable ? 'Yes' : 'No'}
- Compoundable: ${section.compoundable ? 'Yes' : 'No'}
- Cognizable: ${section.cognizable ? 'Yes' : 'No'}
- Court: ${section.court}

Source: Pakistan Penal Code, 1860`,
          textUrdu: `دفعہ ${sectionNum} پی پی سی - ${section.titleUrdu}`
        },
        ur: {
          text: `Section ${sectionNum} PPC - ${section.title}`,
          textUrdu: `دفعہ ${sectionNum} پی پی سی - ${section.titleUrdu}

تفصیل: ${section.descriptionUrdu}

سزا: ${section.punishmentUrdu}

قانونی درجہ بندی:
- قابل ضمانت: ${section.bailable ? 'ہاں' : 'نہیں'}
- قابل سمجھوتہ: ${section.compoundable ? 'ہاں' : 'نہیں'}
- قابل شناخت: ${section.cognizable ? 'ہاں' : 'نہیں'}
- عدالت: ${section.court}

ماخذ: پاکستان پینل کوڈ، 1860`
        },
        roman_urdu: {
          text: `Section ${sectionNum} PPC - ${section.title}`,
          textUrdu: `Dafa ${sectionNum} PPC - ${section.titleUrdu}

Tafseel: ${section.descriptionUrdu}

Saza: ${section.punishmentUrdu}

Qanooni darja bandi:
- Qabil-e-zamanat: ${section.bailable ? 'Haan' : 'Nahin'}
- Qabil-e-samjhota: ${section.compoundable ? 'Haan' : 'Nahin'}
- Qabil-e-shanakht: ${section.cognizable ? 'Haan' : 'Nahin'}
- Adalat: ${section.court}

Makhaz: Pakistan Penal Code, 1860`
        }
      }

      const langResponse = responses[language] || responses.en
      return {
        text: langResponse.text,
        textUrdu: langResponse.textUrdu,
        intent: 'section_lookup',
        relevantSections: [String(sectionNum)],
        confidence: 0.95,
        sources,
        requiresVerification: false
      }
    }

    const responses = {
      en: {
        text: `I could not find Section ${sectionNum || 'the specified section'} in my database. 

The Pakistan Penal Code contains 511 sections covering various offences. I currently have detailed information for the most commonly referenced sections (34, 109, 141, 146, 161, 186, 295, 298, 299, 302, 304, 306, 309, 319, 320, 322, 324, 337, 354, 365, 366, 375, 376, 378, 379, 380, 381, 382, 391, 396, 406, 409, 411, 420, 452, 457, 489, 496, 500, 504, 506, 509).

For other sections, please refer to the official Pakistan Code or consult a legal professional.`,
        textUrdu: `مجھے دفعہ ${sectionNum || 'مخصوص دفعہ'} نہیں ملی۔`
      },
      ur: {
        text: `Section ${sectionNum || 'the specified section'} not found.`,
        textUrdu: `مجھے دفعہ ${sectionNum || 'مخصوص دفعہ'} اپنے ڈیٹا بیس میں نہیں ملی۔

پاکستان پینل کوڈ میں مختلف جرائم کو احاطہ کرنے والی 511 دفعات ہیں۔ میرے پاس فی الحال سب سے زیادہ حوالہ دی جانے والی دفعات کی تفصیلی معلومات ہیں (34، 109، 141، 146، 161، 186، 295، 298، 299، 302، 304، 306، 309، 319، 320، 322، 324، 337، 354، 365، 366، 375، 376، 378، 379، 380، 381، 382، 391، 396، 406، 409، 411، 420، 452، 457، 489، 496، 500، 504، 506، 509)۔

دیگر دفعات کے لیے، براہ کرم سرکاری پاکستان کوڈ کا حوالہ دیں یا قانونی پیشہ ور سے مشورہ کریں۔`
      },
      roman_urdu: {
        text: `Section ${sectionNum || 'the specified section'} not found.`,
        textUrdu: `Mujhe Dafa ${sectionNum || 'makhsoos dafa'} nahi mili.

Pakistan Penal Code mein mukhtalif jurm ko ahatay karne wali 511 dafaat hain. Mere paas filhaal sab se zyada hawala di jane wali dafaat ki tafseeli maloomat hain (34, 109, 141, 146, 161, 186, 295, 298, 299, 302, 304, 306, 309, 319, 320, 322, 324, 337, 354, 365, 366, 375, 376, 378, 379, 380, 381, 382, 391, 396, 406, 409, 411, 420, 452, 457, 489, 496, 500, 504, 506, 509).

Doosri dafaat ke liye, barah-e-karam sarparast Pakistan Code ka hawala dein ya qanooni pesha war se mashwara karein.`
      }
    }

    const langResponse = responses[language] || responses.en
    return {
      text: langResponse.text,
      textUrdu: langResponse.textUrdu,
      intent: 'section_lookup',
      confidence: 0.5,
      sources: [],
      requiresVerification: true,
      alternativeActions: [
        'Consult the official Pakistan Code',
        'Speak with a qualified lawyer'
      ]
    }
  }

  private handlePunishmentQuery(input: string, _entities: Entity[], language: 'en' | 'ur' | 'roman_urdu'): ChatResponse {
    const crimeKeywords: Record<string, number[]> = {
      'murder': [302, 304],
      'qatil': [302, 304],
      'theft': [378, 379, 380, 381, 382],
      'chori': [378, 379, 380, 381, 382],
      'cheating': [420],
      'fraud': [420, 406, 409],
      'dhoka': [420],
      'rape': [375, 376],
      'zina': [375, 376],
      'dacoity': [391, 396],
      'daka': [391, 396],
      'robbery': [391, 396],
      'hurt': [319, 320, 322, 324],
      'chot': [319, 320, 322, 324],
      'assault': [337, 354],
      'hamla': [337, 354],
      'defamation': [500],
      'tuhmat': [500],
      'intimidation': [506],
      'dhamki': [506],
    }

    const normalizedInput = input.toLowerCase()
    for (const [crime, sections] of Object.entries(crimeKeywords)) {
      if (normalizedInput.includes(crime)) {
        let responseText = ''
        let responseUrdu = ''
        const sources: Source[] = []

        if (language === 'en') {
          responseText = `Punishment for ${crime} under Pakistan Penal Code:\n\n`
          sections.forEach(sectionNum => {
            const section = ppcSections[sectionNum]
            if (section) {
              responseText += `Section ${sectionNum}: ${section.punishment}\n`
              sources.push(this.createSource('statute', `PPC Section ${sectionNum}`, `Pakistan Penal Code, Section ${sectionNum}`))
            }
          })
          responseUrdu = responseText
        } else if (language === 'ur') {
          responseText = `${crime} کی سزا پاکستان پینل کوڈ کے تحت:\n\n`
          sections.forEach(sectionNum => {
            const section = ppcSections[sectionNum]
            if (section) {
              responseText += `دفعہ ${sectionNum}: ${section.punishmentUrdu}\n`
            }
          })
          responseUrdu = responseText
        } else {
          responseText = `${crime} ki saza Pakistan Penal Code ke tehat:\n\n`
          sections.forEach(sectionNum => {
            const section = ppcSections[sectionNum]
            if (section) {
              responseText += `Dafa ${sectionNum}: ${section.punishmentUrdu}\n`
            }
          })
          responseUrdu = responseText
        }

        return {
          text: responseText,
          textUrdu: responseUrdu,
          intent: 'punishment_query',
          relevantSections: sections.map(String),
          confidence: 0.9,
          sources,
          requiresVerification: false
        }
      }
    }

    const responses = {
      en: {
        text: 'Please specify the crime you are asking about (for example, murder, theft, fraud, rape, assault, defamation).',
        textUrdu: 'Please specify the crime you are asking about.'
      },
      ur: {
        text: 'Please specify the crime.',
        textUrdu: 'براہ کرم وہ جرم بتائیں جس کے بارے میں آپ پوچھ رہے ہیں (مثلاً، قتل، چوری، دھوکہ، زیادتی، حملہ، تہمت)۔'
      },
      roman_urdu: {
        text: 'Please specify the crime.',
        textUrdu: 'Barah-e-karam woh jurm batain jis ke baare mein aap pooch rahe hain (maslan, qatal, chori, dhoka, ziadati, hamla, tuhmat).'
      }
    }

    const langResponse = responses[language] || responses.en
    return {
      text: langResponse.text,
      textUrdu: langResponse.textUrdu,
      intent: 'punishment_query',
      confidence: 0.5,
      sources: [],
      requiresVerification: false
    }
  }

  private handleProcedureQuery(input: string, language: 'en' | 'ur' | 'roman_urdu'): ChatResponse {
    const procedures: Record<string, { en: string; ur: string; roman: string; sources: Source[] }> = {
      'fir': {
        en: `FIR (First Information Report) Filing Procedure in Pakistan:

1. Visit the nearest police station where the offence occurred
2. Provide written or oral statement about the incident
3. Police will record the information under Section 154 CrPC
4. Obtain a copy of the FIR free of cost (your right under law)
5. FIR must be registered without delay

If police refuse to register FIR:
- Approach the Superintendent of Police (SP)
- File a complaint with the Sessions Judge
- Approach the High Court under Section 22-A CrPC`,
        ur: `ایف آئی آر درج کرنے کا طریقہ کار:

1. اس پولیس اسٹیشن کا دورہ کریں جہاں جرم ہوا
2. واقعے کے بارے میں تحریری یا زبانی بیان دیں
3. پولیس کرمنل پروسیجر کوڈ کی دفعہ 154 کے تحت معلومات ریکارڈ کرے گی
4. ایف آئی آر کی کاپی مفت حاصل کریں (قانون کے تحت آپ کا حق)
5. ایف آئی آر بغیر تاخیر کے درج کی جانی چاہیے

اگر پولیس ایف آئی آر درج کرنے سے انکار کرے:
- سپرنٹنڈنٹ آف پولیس (ایس پی) سے رجوع کریں
- سیشنز جج کے سامنے شکایت دائر کریں
- کرمنل پروسیجر کوڈ کی دفعہ 22-A کے تحت ہائی کورٹ سے رجوع کریں`,
        roman: `FIR darj karne ka tareeqa kar:

1. Us police station ka daura karein jahan jurm hua
2. Waqe ke baare mein tahreeri ya zabani bayan dein
3. Police CrPC ki dafa 154 ke tehat maloomat record karegi
4. FIR ki copy muft hasil karein (qanoon ke tehat aap ka haq)
5. FIR baghair takheer ke darj ki jani chahiye

Agar police FIR darj karne se inkar kare:
- Superintendent of Police (SP) se ruju karein
- Sessions Judge ke samne shikayat dair karein
- CrPC ki dafa 22-A ke tehat High Court se ruju karein`,
        sources: [
          this.createSource('statute', 'Code of Criminal Procedure, 1898', 'CrPC Section 154'),
          this.createSource('statute', 'Code of Criminal Procedure, 1898', 'CrPC Section 22-A')
        ]
      },
      'bail': {
        en: `Bail Application Procedure in Pakistan:

1. Engage a lawyer licensed to practice in the relevant court
2. Prepare bail application with case details
3. File application in the appropriate court:
   - Session Court for bailable offences
   - High Court for non-bailable offences
4. Court will issue notice to prosecution
5. Hearing date will be fixed
6. Court decides based on merits and grounds

Types of Bail:
- Pre-arrest bail (anticipatory)
- Post-arrest bail
- Bail after conviction`,
        ur: `ضمانت کی درخواست کا طریقہ کار:

1. متعلقہ عدالت میں وکالت کرنے کے لیے لائسنس یافتہ وکیل رکھیں
2. کیس کی تفصیلات کے ساتھ ضمانت کی درخواست تیار کریں
3. مناسب عدالت میں درخواست دائر کریں:
   - قابل ضمانت جرائم کے لیے سیشن کورٹ
   - غیر قابل ضمانت جرائم کے لیے ہائی کورٹ
4. عدالت پراسیکیوشن کو نوٹس جاری کرے گی
5. سماعت کی تاریخ طے کی جائے گی
6. عدالت اسباب اور بنیادوں پر فیصلہ کرتی ہے

ضمانت کی اقسام:
- گرفتاری سے پہلے کی ضمانت (متوقع)
- گرفتاری کے بعد کی ضمانت
- سزا کے بعد ضمانت`,
        roman: `Zamanat ki darkhwast ka tareeqa kar:

1. Mutalliqa adalat mein wukala karne ke liye license yafta vakil rakhein
2. Case ki tafseelat ke sath zamanat ki darkhwast tayyar karein
3. Munasib adalat mein darkhwast dair karein:
   - Qabil-e-zamanat jurm ke liye Sessions Court
   - Ghair qabil-e-zamanat jurm ke liye High Court
4. Adalat prosecution ko notice jari karegi
5. Samat ki tareekh tay ki jayegi
6. Adalat asbab aur bunyaadon par faisla karti hai

Zamanat ki aqsam:
- Giriftari se pehle ki zamanat (mutawaqqa)
- Giriftari ke baad ki zamanat
- Saza ke baad zamanat`,
        sources: [
          this.createSource('procedure', 'Code of Criminal Procedure, 1898', 'CrPC Sections 496-502'),
          this.createSource('case_law', 'Bail Jurisprudence', 'PLD 2023 SC 1')
        ]
      },
      'court marriage': {
        en: `Court Marriage Procedure in Pakistan:

Requirements:
1. Both parties must be adults (18+ years)
2. Free consent of both parties
3. No legal impediments to marriage

Procedure:
1. Visit the Union Council or Court
2. Submit application for marriage
3. Nikah Khawan/Registrar conducts Nikah
4. Two adult Muslim witnesses required
5. Marriage certificate issued
6. Register marriage with NADRA

Documents Required:
- CNIC copies of both parties
- CNIC copies of witnesses
- Passport size photographs
- Affidavit of free consent`,
        ur: `عدالتی شادی کا طریقہ کار:

ضروریات:
1. دونوں فریقین بالغ ہونے چاہئیں (18+ سال)
2. دونوں فریقین کی آزاد رضامندی
3. شادی کے لیے کوئی قانونی رکاوٹ نہ ہو

طریقہ کار:
1. یونین کونسل یا عدالت کا دورہ کریں
2. شادی کے لیے درخواست جمع کرائیں
3. نکاح خواں/رجسٹرار نکاح کرتا ہے
4. دو بالغ مسلم گواہوں کی ضرورت ہے
5. شادی کا سرٹیفکیٹ جاری کیا جاتا ہے
6. نادرا کے ساتھ شادی رجسٹر کرائیں

درکار دستاویزات:
- دونوں فریقین کی شناختی کارڈ کی کاپیاں
- گواہوں کی شناختی کارڈ کی کاپیاں
- پاسپورٹ سائز تصاویر
- آزاد رضامندی کی حلف نامہ`,
        roman: `Adalti shadi ka tareeqa kar:

Zarooriyat:
1. Dono fareeqain baligh hone chahiye (18+ saal)
2. Dono fareeqain ki azad razamandi
3. Shadi ke liye koi qanooni rukawat na ho

Tareeqa kar:
1. Union Council ya adalat ka daura karein
2. Shadi ke liye darkhwast jama karain
3. Nikah Khawan/Registrar nikah karta hai
4. Do baligh Muslim gawahon ki zaroorat hai
5. Shadi ka certificate jari kiya jata hai
6. NADRA ke sath shadi register karain

Darkar dastaweezat:
- Dono fareeqain ki CNIC ki copies
- Gawahon ki CNIC ki copies
- Passport size tasaveer
- Azad razamandi ki affidavit`,
        sources: [
          this.createSource('statute', 'Muslim Family Laws Ordinance, 1961', 'MFLO Section 5'),
          this.createSource('procedure', 'Family Court Act, 1964', 'Section 5')
        ]
      }
    }

    const normalizedInput = input.toLowerCase()
    for (const [key, procedure] of Object.entries(procedures)) {
      if (normalizedInput.includes(key) || normalizedInput.includes(key.replace(' ', ''))) {
        return {
          text: procedure.en,
          textUrdu: language === 'roman_urdu' ? procedure.roman : procedure.ur,
          intent: 'procedure_query',
          confidence: 0.9,
          sources: procedure.sources,
          requiresVerification: false
        }
      }
    }

    const responses = {
      en: {
        text: `I can help you with procedures for: FIR filing, bail applications, court marriage, divorce (khula/talaq), property registration, company registration, and consumer complaints.

Please specify which procedure you need information about.`,
        textUrdu: `Please specify which procedure you need.`
      },
      ur: {
        text: `Please specify procedure.`,
        textUrdu: `میں درج ذیل طریقہ کار میں مدد کر سکتا ہوں: ایف آئی آر درج کرنا، ضمانت کی درخواست، عدالتی شادی، طلاق/خلع، جائداد کی رجسٹریشن، کمپنی کی رجسٹریشن، اور صارفین کی شکایات۔

براہ کرم بتائیں کہ آپ کس طریقہ کار کے بارے میں معلومات چاہتے ہیں۔`
      },
      roman_urdu: {
        text: `Please specify procedure.`,
        textUrdu: `Main darj zeel tareeqa kar mein madad kar sakta hoon: FIR darj karna, zamanat ki darkhwast, adalti shadi, talaq/khula, jaidad ki registration, company ki registration, aur saarfeen ki shikayat.

Barah-e-karam batain ke aap kis tareeqa kar ke baare mein maloomat chahte hain.`
      }
    }

    const langResponse = responses[language] || responses.en
    return {
      text: langResponse.text,
      textUrdu: langResponse.textUrdu,
      intent: 'procedure_query',
      confidence: 0.5,
      sources: [],
      requiresVerification: false
    }
  }

  private handleRightsQuery(_input: string, language: 'en' | 'ur' | 'roman_urdu'): ChatResponse {
    const rightsInfo = {
      en: `Fundamental Rights under Constitution of Pakistan (Articles 8-28):

Key Rights:
- Right to life and liberty (Article 9)
- Right to dignity (Article 14)
- Right to freedom of speech (Article 19)
- Right to information (Article 19A)
- Right to education (Article 25A)
- Right to equality (Article 25)
- Right to fair trial (Article 10A)
- Right to property (Article 24)
- Protection against slavery (Article 11)
- Protection against retrospective punishment (Article 12)

If your rights are violated:
1. File a complaint with relevant authorities
2. Approach the High Court under Article 199
3. Contact the Ombudsman
4. Seek legal representation`,
      ur: `آئین پاکستان کے تحت بنیادی حقوق (آرٹیکل 8-28):

اہم حقوق:
- زندگی اور آزادی کا حق (آرٹیکل 9)
- وقار کا حق (آرٹیکل 14)
- اظہار رائے کی آزادی کا حق (آرٹیکل 19)
- معلومات کا حق (آرٹیکل 19A)
- تعلیم کا حق (آرٹیکل 25A)
- مساوات کا حق (آرٹیکل 25)
- منصفانہ سماعت کا حق (آرٹیکل 10A)
- جائداد کا حق (آرٹیکل 24)
- غلامی کے خلاف تحفظ (آرٹیکل 11)
- ریٹروایکٹو سزا کے خلاف تحفظ (آرٹیکل 12)

اگر آپ کے حقوق کی خلاف ورزی ہو:
1. متعلقہ حکام کے سامنے شکایت دائر کریں
2. آرٹیکل 199 کے تحت ہائی کورٹ سے رجوع کریں
3. امبڈسمین سے رابطہ کریں
4. قانونی نمائندگی حاصل کریں`,
      roman: `Aeen Pakistan ke tehat bunyaadi huqooq (Articles 8-28):

Ahem huqooq:
- Zindagi aur azadi ka haq (Article 9)
- Waqar ka haq (Article 14)
- Izhaar-e-rai ki azadi ka haq (Article 19)
- Maloomat ka haq (Article 19A)
- Taleem ka haq (Article 25A)
- Musawaat ka haq (Article 25)
- Munasana samat ka haq (Article 10A)
- Jaidad ka haq (Article 24)
- Ghulami ke khilaf tahaffuz (Article 11)
- Retroactive saza ke khilaf tahaffuz (Article 12)

Agar aap ke huqooq ki khilaf warzi ho:
1. Mutalliqa hukkam ke samne shikayat dair karein
2. Article 199 ke tehat High Court se ruju karein
3. Ombudsman se rabta karein
4. Qanooni numaindagi hasil karein`
    }

    const sources = [
      this.createSource('statute', 'Constitution of Pakistan, 1973', 'Articles 8-28'),
      this.createSource('case_law', 'Fundamental Rights Jurisprudence', 'PLD 2023 SC 1')
    ]

    return {
      text: rightsInfo.en,
      textUrdu: language === 'roman_urdu' ? rightsInfo.roman : rightsInfo.ur,
      intent: 'rights_explanation',
      confidence: 0.85,
      sources,
      requiresVerification: false
    }
  }

  private handleDocumentRequest(_input: string, language: 'en' | 'ur' | 'roman_urdu'): ChatResponse {
    const responses = {
      en: {
        text: `I can help you generate legal documents for Pakistan. Available document types:

- Rent Agreements (Residential/Commercial)
- Power of Attorney
- Affidavits
- Legal Notices
- Partnership Deeds
- Employment Contracts
- Non-Disclosure Agreements
- Bail Applications

Please visit the Documents section to generate your document with a step-by-step wizard.`,
        textUrdu: 'Document generation available.'
      },
      ur: {
        text: 'Document generation available.',
        textUrdu: `میں پاکستان کے لیے قانونی دستاویزات تیار کرنے میں مدد کر سکتا ہوں۔ دستیاب دستاویز کی اقسام:

- کرایہ نامے (رہائشی/تجارتی)
- وکالت نامہ
- حلف نامے
- قانونی نوٹس
- شراکت داری کے دستاویزات
- ملازمت کے معاہدے
- رازداری کے معاہدے
- ضمانت کی درخواستیں

براہ کرم قدم بہ قدم وزرڈ کے ساتھ اپنی دستاویز تیار کرنے کے لیے دستاویزات سیکشن کا دورہ کریں۔`
      },
      roman_urdu: {
        text: 'Document generation available.',
        textUrdu: `Main Pakistan ke liye qanooni dastaweez tayyar karne mein madad kar sakta hoon. Dastiyab dastaweez ki aqsam:

- Kiraya namay (rehaishi/tijarati)
- Vakalat nama
- Half namay
- Qanooni notices
- Sharakat dari ke dastaweez
- Mulazmat ke moahiday
- Razdari ke moahiday
- Zamanat ki darkhwastain

Barah-e-karam qadam ba qadam wizard ke sath apni dastaweez tayyar karne ke liye Documents section ka daura karein.`
      }
    }

    const langResponse = responses[language] || responses.en
    return {
      text: langResponse.text,
      textUrdu: langResponse.textUrdu,
      intent: 'document_request',
      confidence: 0.8,
      sources: [],
      requiresVerification: false,
      alternativeActions: ['Go to Documents page', 'Consult a lawyer for complex documents']
    }
  }

  private handleCaseLawQuery(_input: string, language: 'en' | 'ur' | 'roman_urdu'): ChatResponse {
    const responses = {
      en: {
        text: `I can help you search for Pakistani case law from:
- Supreme Court of Pakistan
- High Courts (Lahore, Karachi, Peshawar, Quetta, Islamabad)
- Federal Shariat Court
- Special Courts and Tribunals

Visit the Research section to search cases by:
- Citation (e.g., PLD 2023 SC 1)
- Keywords
- Date range
- Court
- Topic area`,
        textUrdu: 'Case law search available.'
      },
      ur: {
        text: 'Case law search available.',
        textUrdu: `میں درج ذیل سے پاکستانی کیس لا تلاش کرنے میں مدد کر سکتا ہوں:
- سپریم کورٹ آف پاکستان
- ہائی کورٹس (لاہور، کراچی، پشاور، کوئٹہ، اسلام آباد)
- فیڈرل شرعی عدالت
- خصوصی عدالتیں اور ٹریبونل

تلاش کے لیے تحقیق سیکشن کا دورہ کریں:
- حوالہ (مثلاً، PLD 2023 SC 1)
- کلیدی الفاظ
- تاریخ کی حد
- عدالت
- موضوع`
      },
      roman_urdu: {
        text: 'Case law search available.',
        textUrdu: `Main darj zeel se Pakistani case law talash karne mein madad kar sakta hoon:
- Supreme Court of Pakistan
- High Courts (Lahore, Karachi, Peshawar, Quetta, Islamabad)
- Federal Shariat Court
- Khususi adalaten aur tribunals

Talash ke liye Research section ka daura karein:
- Hawala (maslan, PLD 2023 SC 1)
- Kalidi alfaaz
- Tareekh ki hudood
- Adalat
- Mauzu`
      }
    }

    const langResponse = responses[language] || responses.en
    return {
      text: langResponse.text,
      textUrdu: langResponse.textUrdu,
      intent: 'case_law_search',
      confidence: 0.8,
      sources: [],
      requiresVerification: false,
      alternativeActions: ['Go to Research page', 'Search by citation']
    }
  }

  private handleFarewell(_language: 'en' | 'ur' | 'roman_urdu'): ChatResponse {
    const responses = {
      en: {
        text: 'Thank you for using PakLegal AI. If you have more questions about Pakistani law, feel free to ask. For specific legal matters, please consult a qualified lawyer.',
        textUrdu: 'Thank you for using PakLegal AI.'
      },
      ur: {
        text: 'Thank you.',
        textUrdu: 'پاک لیگل ای آئی استعمال کرنے کا شکریہ۔ اگر آپ کے پاکستانی قانون کے بارے میں مزید سوالات ہیں، تو پوچھنے میں ہچکچاہیں نہیں۔ مخصوص قانونی معاملات کے لیے، براہ کرم اہل وکیل سے مشورہ کریں۔'
      },
      roman_urdu: {
        text: 'Thank you.',
        textUrdu: 'PakLegal AI istemal karne ka shukriya. Agar aap ke Pakistani qanoon ke baare mein mazeed sawalaat hain, to poochne mein hichkichayen nahin. Khusoos qanooni maamlaat ke liye, barah-e-karam ahil wakeel se mashwara karein.'
      }
    }

    const langResponse = responses[_language] || responses.en
    return {
      text: langResponse.text,
      textUrdu: langResponse.textUrdu,
      intent: 'farewell',
      confidence: 1.0,
      sources: [],
      requiresVerification: false
    }
  }

  private handleUnknown(language: 'en' | 'ur' | 'roman_urdu'): ChatResponse {
    const responses = {
      en: {
        text: `I can help you with the following topics related to Pakistani law:

- Pakistan Penal Code sections and punishments
- Legal procedures (FIR, bail, court marriage, etc.)
- Constitutional rights
- Case law from Pakistani courts
- Document templates
- Family law matters
- Property and business law

Please ask a specific question about any of these topics.`,
        textUrdu: 'I can help with Pakistani law topics.'
      },
      ur: {
        text: 'I can help with Pakistani law.',
        textUrdu: `میں پاکستانی قانون سے متعلق درج ذیل موضوعات میں مدد کر سکتا ہوں:

- پاکستان پینل کوڈ کی دفعات اور سزائیں
- قانونی طریقہ کار (ایف آئی آر، ضمانت، عدالتی شادی وغیرہ)
- آئینی حقوق
- پاکستانی عدالتوں سے کیس لا
- دستاویز ٹیمپلیٹس
- خاندانی قانونی معاملات
- جائداد اور کاروباری قانون

براہ کرم ان میں سے کسی بھی موضوع کے بارے میں کوئی مخصوص سوال پوچھیں۔`
      },
      roman_urdu: {
        text: 'I can help with Pakistani law.',
        textUrdu: `Main Pakistani qanoon se mutaliq darj zeel mauzooaat mein madad kar sakta hoon:

- Pakistan Penal Code ki dafaat aur sazain
- Qanooni tareeqa kar (FIR, zamanat, adalti shadi waghera)
- Aeeni huqooq
- Pakistani adalon se case law
- Dastaweez templates
- Khandani qanooni maamlaat
- Jaidad aur karobari qanoon

Barah-e-karam in mein se kisi bhi mauzu ke baare mein koi khusoos sawal poochain.`
      }
    }

    const langResponse = responses[language] || responses.en
    return {
      text: langResponse.text,
      textUrdu: langResponse.textUrdu,
      intent: 'unknown',
      confidence: 0.3,
      sources: [],
      requiresVerification: true,
      alternativeActions: [
        'Ask about PPC sections',
        'Ask about legal procedures',
        'Ask about your rights'
      ]
    }
  }

  processInput(input: string): ChatResponse {
    // First check if query is out of scope (foreign law)
    if (this.isOutOfScope(input)) {
      const language = this.detectLanguage(input)
      return this.getOutOfScopeResponse(language)
    }

    const language = this.detectLanguage(input)
    const intent = this.detectIntent(input, language)
    const response = this.generateResponse(input, intent)
    
    this.conversationHistory.push({ 
      role: 'user', 
      content: input, 
      language 
    })
    this.conversationHistory.push({ 
      role: 'assistant', 
      content: language === 'ur' ? response.textUrdu : response.text, 
      language 
    })

    return response
  }

  getHistory() {
    return this.conversationHistory
  }

  clearHistory() {
    this.conversationHistory = []
  }
}

export const legalAI = new PakistanLegalAI()
