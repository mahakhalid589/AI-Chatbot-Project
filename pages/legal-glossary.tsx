import { useState, useMemo, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { 
  BookOpen, 
  Search, 
  ArrowRight,
  Bookmark,
  Scale,
  ChevronRight,
  X,
  Filter,
  Grid3X3,
  List,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Share2,
  ArrowUp,
  Tag,
  GraduationCap,
  Lightbulb
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

// Enhanced glossary data with Pakistani law context
const glossaryTerms = [
  {
    term: 'Affidavit',
    category: 'Procedure',
    difficulty: 'Beginner',
    frequency: 'High',
    definition: 'A written statement confirmed by oath or affirmation, for use as evidence in court or for official purposes.',
    pakistaniContext: 'Under the Qanun-e-Shahadat Order, 1984, affidavits are admissible as evidence but may require attestation by an Oath Commissioner.',
    example: 'The witness submitted an affidavit stating he was present at the scene of the property dispute.',
    related: ['Oath', 'Witness', 'Evidence', 'Notary'],
    sections: ['Order XI CPC', 'Article 17 QSO 1984'],
    tags: ['Evidence', 'Documentation'],
  },
  {
    term: 'Bail',
    category: 'Criminal',
    difficulty: 'Intermediate',
    frequency: 'High',
    definition: 'The temporary release of an accused person awaiting trial, secured by a bond ensuring appearance in court.',
    pakistaniContext: 'Sections 496 and 497 of CrPC distinguish between bailable and non-bailable offenses. Anticipatory bail is available under Section 498.',
    example: 'The court granted bail on the condition of surrendering his passport and furnishing surety bonds of Rs. 100,000.',
    related: ['Bond', 'Surety', 'Remand', 'CrPC'],
    sections: ['Section 496 CrPC', 'Section 497 CrPC', 'Section 498 CrPC'],
    tags: ['Criminal Procedure', 'Liberty'],
  },
  {
    term: 'Cause List',
    category: 'Procedure',
    difficulty: 'Beginner',
    frequency: 'High',
    definition: 'A daily schedule of cases to be heard by a court, showing time, courtroom, and parties involved.',
    pakistaniContext: 'Published daily on court notice boards and websites. Includes case numbers, party names, and advocate names.',
    example: 'Check the cause list at 8 PM the day before to confirm your case number and courtroom.',
    related: ['Hearing', 'Roster', 'Case Number', 'Courtroom'],
    sections: ['High Court Rules'],
    tags: ['Court Procedure', 'Scheduling'],
  },
  {
    term: 'Caveat',
    category: 'Procedure',
    difficulty: 'Advanced',
    frequency: 'Medium',
    definition: 'A notice filed by a third party requesting to be heard before any order is passed in a case.',
    pakistaniContext: 'Under Order XI A CPC, a caveat remains in force for 90 days and must be served on the opposite party.',
    example: 'The bank filed a caveat in the property suit to protect its mortgage interest.',
    related: ['Notice', 'Interim Order', 'Caveat Petition'],
    sections: ['Order XI A CPC'],
    tags: ['Civil Procedure', 'Third Party'],
  },
  {
    term: 'Decree',
    category: 'Civil',
    difficulty: 'Intermediate',
    frequency: 'High',
    definition: 'The formal expression of an adjudication that conclusively determines the rights of parties in a suit.',
    pakistaniContext: 'Under Section 2(2) CPC, a decree includes rejection of plaint and determination of any question under Section 144, but not interim orders.',
    example: 'The court passed a preliminary decree for accounts in the partnership dispute.',
    related: ['Judgment', 'Order', 'Execution', 'Preliminary Decree'],
    sections: ['Section 2(2) CPC', 'Order XX CPC'],
    tags: ['Civil Procedure', 'Final Order'],
  },
  {
    term: 'Discovery',
    category: 'Procedure',
    difficulty: 'Advanced',
    frequency: 'Medium',
    definition: 'Pre-trial process where parties obtain evidence from each other through interrogatories and document requests.',
    pakistaniContext: 'Order XI CPC governs discovery and inspection. Courts may order disclosure of documents in possession of parties.',
    example: 'The plaintiff sought discovery of all email correspondence regarding the contract breach.',
    related: ['Inspection', 'Interrogatories', 'Disclosure', 'Documents'],
    sections: ['Order XI CPC'],
    tags: ['Pre-trial', 'Evidence'],
  },
  {
    term: 'Easement',
    category: 'Property',
    difficulty: 'Intermediate',
    frequency: 'Medium',
    definition: 'A right to use another person\'s land for a specific purpose without possessing it.',
    pakistaniContext: 'The Easements Act, 1882 governs these rights in Pakistan. Common in property disputes involving access roads.',
    example: 'The property has an easement right allowing the neighbor to use the driveway for access.',
    related: ['Right of Way', 'Servitude', 'Property Rights', 'Prescription'],
    sections: ['Easements Act 1882'],
    tags: ['Property Law', 'Land Rights'],
  },
  {
    term: 'Ex Parte',
    category: 'Procedure',
    difficulty: 'Intermediate',
    frequency: 'High',
    definition: 'Proceedings or orders made in the absence of the other party who had proper notice.',
    pakistaniContext: 'Under Order IX CPC, ex parte decrees can be set aside within 30 days on sufficient cause being shown.',
    example: 'The court issued an ex parte injunction as the defendant failed to appear despite service of summons.',
    related: ['Default', 'Injunction', 'Appearance', 'Set Aside'],
    sections: ['Order IX CPC', 'Order XXXIX CPC'],
    tags: ['Default Proceedings', 'Remedy'],
  },
  {
    term: 'Habeas Corpus',
    category: 'Constitutional',
    difficulty: 'Advanced',
    frequency: 'High',
    definition: 'A writ requiring a detained person to be brought before court to determine if detention is lawful.',
    pakistaniContext: 'Under Article 199 of the Constitution, High Courts have jurisdiction to issue writs of habeas corpus against unlawful detention.',
    example: 'He filed a habeas corpus petition in the Lahore High Court challenging his detention under MPO.',
    related: ['Writ', 'Detention', 'Constitution', 'Fundamental Rights'],
    sections: ['Article 199 Constitution', 'Section 491 CrPC'],
    tags: ['Constitutional Remedy', 'Liberty'],
  },
  {
    term: 'Injunction',
    category: 'Remedy',
    difficulty: 'Intermediate',
    frequency: 'High',
    definition: 'A judicial order restraining a person from doing or continuing a specific act.',
    pakistaniContext: 'Order XXXIX CPC governs temporary injunctions. Permanent injunctions are governed by Chapter VIII of Specific Relief Act.',
    example: 'The court issued a mandatory injunction directing the defendant to remove the illegal construction.',
    related: ['Stay Order', 'Status Quo', 'Specific Relief', 'Restraint'],
    sections: ['Order XXXIX CPC', 'Specific Relief Act 1877'],
    tags: ['Equitable Remedy', 'Interim Relief'],
  },
  {
    term: 'Jurisdiction',
    category: 'Procedure',
    difficulty: 'Intermediate',
    frequency: 'High',
    definition: 'The official power of a court to make legal decisions and judgments.',
    pakistaniContext: 'Pecuniary, territorial, and subject matter jurisdiction must be satisfied. Lack of jurisdiction can be raised at any stage.',
    example: 'The High Court has original jurisdiction in constitutional matters under Article 199.',
    related: ['Competence', 'Authority', 'Venue', 'Pecuniary'],
    sections: ['Section 15-25 CPC', 'Article 199 Constitution'],
    tags: ['Court Powers', 'Limitations'],
  },
  {
    term: 'Khula',
    category: 'Family',
    difficulty: 'Intermediate',
    frequency: 'High',
    definition: 'Divorce initiated by the wife by returning her dower or agreeing to forgo it.',
    pakistaniContext: 'Under Section 8 of the Muslim Family Laws Ordinance, 1961, a wife can seek khula on specified grounds without husband\'s consent.',
    example: 'She sought khula under Section 8 MFLO by returning the dower amount of Rs. 50,000.',
    related: ['Divorce', 'Talaq', 'Dower', 'MFLO'],
    sections: ['Section 8 MFLO 1961', 'Dissolution of Muslim Marriages Act 1939'],
    tags: ['Family Law', 'Divorce'],
  },
  {
    term: 'Lien',
    category: 'Property',
    difficulty: 'Advanced',
    frequency: 'Medium',
    definition: 'A right to retain possession of property until a debt is paid.',
    pakistaniContext: 'Common in banking and construction disputes. Banks often exercise lien over fixed deposits as security.',
    example: 'The bank exercised its lien over the fixed deposit to recover the outstanding loan amount.',
    related: ['Charge', 'Security', 'Mortgage', 'Retention'],
    sections: ['Contract Act 1872'],
    tags: ['Security Interest', 'Banking'],
  },
  {
    term: 'Mandamus',
    category: 'Constitutional',
    difficulty: 'Advanced',
    frequency: 'Medium',
    definition: 'A writ commanding a public authority to perform a public or statutory duty.',
    pakistaniContext: 'High Courts issue writs of mandamus under Article 199 to compel government officials to perform their duties.',
    example: 'The court issued mandamus directing the DCO to issue the death certificate as required by law.',
    related: ['Writ', 'Command', 'Public Duty', 'Article 199'],
    sections: ['Article 199 Constitution'],
    tags: ['Constitutional Remedy', 'Public Law'],
  },
  {
    term: 'Negligence',
    category: 'Tort',
    difficulty: 'Intermediate',
    frequency: 'Medium',
    definition: 'Breach of duty of care resulting in damage to another.',
    pakistaniContext: 'Medical negligence cases are common. Standard of care determined by professional norms and hospital protocols.',
    example: 'The surgeon was sued for negligence after leaving surgical instruments inside the patient.',
    related: ['Tort', 'Duty of Care', 'Damages', 'Medical Malpractice'],
    sections: ['General principles of tort'],
    tags: ['Civil Wrong', 'Professional Liability'],
  },
  {
    term: 'Order',
    category: 'Procedure',
    difficulty: 'Beginner',
    frequency: 'High',
    definition: 'A formal expression of any decision of a civil court that is not a decree.',
    pakistaniContext: 'Orders are appealable under Section 104 CPC and Order XLIII. Distinction from decree is crucial for appeals.',
    example: 'The court passed an order for interim maintenance pending final decision of the suit.',
    related: ['Decree', 'Judgment', 'Appealable Order'],
    sections: ['Section 104 CPC', 'Order XLIII CPC'],
    tags: ['Civil Procedure', 'Interim'],
  },
  {
    term: 'Plaintiff',
    category: 'Procedure',
    difficulty: 'Beginner',
    frequency: 'High',
    definition: 'A person who brings a case against another in a court of law.',
    pakistaniContext: 'Under Order VII CPC, the plaintiff files a plaint containing cause of action and relief sought.',
    example: 'The plaintiff alleged breach of contract and claimed damages of Rs. 5 million.',
    related: ['Defendant', 'Complainant', 'Petitioner', 'Plaint'],
    sections: ['Order VII CPC'],
    tags: ['Parties', 'Civil Suit'],
  },
  {
    term: 'Quash',
    category: 'Procedure',
    difficulty: 'Intermediate',
    frequency: 'High',
    definition: 'To nullify or set aside, especially by legal procedure.',
    pakistaniContext: 'High Courts quash FIRs under Section 561-A CrPC or Article 199 if no offense disclosed or mala fide.',
    example: 'The High Court quashed the FIR as the dispute was purely civil in nature.',
    related: ['Nullify', 'Set Aside', '561-A CrPC', 'FIR'],
    sections: ['Section 561-A CrPC', 'Article 199 Constitution'],
    tags: ['Criminal Procedure', 'Remedy'],
  },
  {
    term: 'Res Judicata',
    category: 'Procedure',
    difficulty: 'Advanced',
    frequency: 'Medium',
    definition: 'A matter already adjudicated by a competent court cannot be pursued again by the same parties.',
    pakistaniContext: 'Section 11 CPC embodies this principle. Prevents multiplicity of litigation and ensures finality.',
    example: 'The doctrine of res judicata barred the second suit as the issue was already decided in previous litigation.',
    related: ['Finality', 'Bar', 'Estoppel', 'Section 11 CPC'],
    sections: ['Section 11 CPC'],
    tags: ['Civil Procedure', 'Finality'],
  },
  {
    term: 'Stay Order',
    category: 'Remedy',
    difficulty: 'Intermediate',
    frequency: 'High',
    definition: 'A court order suspending a proceeding or the enforcement of a judgment.',
    pakistaniContext: 'Often granted in appeals to maintain status quo. Must show prima facie case, balance of convenience, and irreparable loss.',
    example: 'The Supreme Court issued stay order halting the execution of the death penalty pending appeal.',
    related: ['Injunction', 'Suspension', 'Status Quo', 'Appeal'],
    sections: ['Order XXXIX CPC', 'Civil Courts Act'],
    tags: ['Interim Relief', 'Appellate Practice'],
  },
  {
    term: 'Talaq',
    category: 'Family',
    difficulty: 'Intermediate',
    frequency: 'High',
    definition: 'Islamic divorce pronounced by the husband in accordance with prescribed procedure.',
    pakistaniContext: 'Under MFLO 1961, talaq must be registered with the Union Council and 90-day iddat period observed.',
    example: 'He pronounced talaq three times and registered it with the Union Council as required by law.',
    related: ['Divorce', 'Khula', 'Iddat', 'MFLO'],
    sections: ['Section 7 MFLO 1961'],
    tags: ['Family Law', 'Divorce'],
  },
  {
    term: 'Ultra Vires',
    category: 'Constitutional',
    difficulty: 'Advanced',
    frequency: 'Medium',
    definition: 'Beyond the legal power or authority of a body or official.',
    pakistaniContext: 'Actions of administrative authorities are often challenged as ultra vires their parent statute or the Constitution.',
    example: 'The court declared the SRO ultra vires the enabling act and therefore void.',
    related: ['Jurisdiction', 'Validity', 'Vires', 'Administrative Law'],
    sections: ['Constitution 1973'],
    tags: ['Constitutional Law', 'Judicial Review'],
  },
  {
    term: 'Vakalatnama',
    category: 'Procedure',
    difficulty: 'Beginner',
    frequency: 'High',
    definition: 'A document empowering a lawyer to act on behalf of a client in legal proceedings.',
    pakistaniContext: 'Must be executed on judicial paper, stamped, and signed by the client. Required for every court appearance.',
    example: 'He signed a vakalatnama authorizing the advocate to represent him in all matters related to the property dispute.',
    related: ['Power of Attorney', 'Advocate', 'Representation', 'Agent'],
    sections: ['Order III CPC', 'Legal Practitioners Act'],
    tags: ['Practice & Procedure', 'Agency'],
  },
  {
    term: 'Writ',
    category: 'Constitutional',
    difficulty: 'Advanced',
    frequency: 'High',
    definition: 'A formal written order issued by a court commanding a person or authority to do or refrain from doing something.',
    pakistaniContext: 'Article 199 of the Constitution empowers High Courts to issue writs. Common types: mandamus, certiorari, prohibition, quo warranto, habeas corpus.',
    example: 'She filed a writ petition challenging the illegal taxation imposed by the provincial government.',
    related: ['Habeas Corpus', 'Mandamus', 'Certiorari', 'Article 199'],
    sections: ['Article 199 Constitution'],
    tags: ['Constitutional Remedy', 'High Court'],
  },
]

const categories = [
  { id: 'All', name: 'All Terms', color: 'bg-slate-500' },
  { id: 'Procedure', name: 'Civil Procedure', color: 'bg-blue-500' },
  { id: 'Criminal', name: 'Criminal Law', color: 'bg-red-500' },
  { id: 'Civil', name: 'Civil Law', color: 'bg-emerald-500' },
  { id: 'Constitutional', name: 'Constitutional', color: 'bg-purple-500' },
  { id: 'Family', name: 'Family Law', color: 'bg-rose-500' },
  { id: 'Property', name: 'Property Law', color: 'bg-amber-500' },
  { id: 'Remedy', name: 'Remedies', color: 'bg-cyan-500' },
  { id: 'Tort', name: 'Tort', color: 'bg-orange-500' },
]

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-800 border-green-200',
  Intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Advanced: 'bg-red-100 text-red-800 border-red-200',
}

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function LegalGlossaryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All')
  const [selectedLetter, setSelectedLetter] = useState<string | null>(searchParams.get('letter'))
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [savedTerms, setSavedTerms] = useState<string[]>([])
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(searchParams.get('difficulty'))
  
  const scrollRef = useRef<HTMLDivElement>(null)

  // Handle scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (selectedCategory !== 'All') params.set('category', selectedCategory)
    if (selectedLetter) params.set('letter', selectedLetter)
    if (selectedDifficulty) params.set('difficulty', selectedDifficulty)
    setSearchParams(params)
  }, [searchQuery, selectedCategory, selectedLetter, selectedDifficulty])

  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter(term => {
      const matchesSearch = 
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.example.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory
      const matchesLetter = !selectedLetter || term.term.startsWith(selectedLetter)
      const matchesDifficulty = !selectedDifficulty || term.difficulty === selectedDifficulty
      return matchesSearch && matchesCategory && matchesLetter && matchesDifficulty
    }).sort((a, b) => a.term.localeCompare(b.term))
  }, [searchQuery, selectedCategory, selectedLetter, selectedDifficulty])

  const groupedTerms = useMemo(() => {
    const groups: { [key: string]: typeof glossaryTerms } = {}
    filteredTerms.forEach(term => {
      const firstLetter = term.term[0]
      if (!groups[firstLetter]) groups[firstLetter] = []
      groups[firstLetter].push(term)
    })
    return groups
  }, [filteredTerms])

  const activeLetters = useMemo(() => {
    const letters = new Set(glossaryTerms.map(t => t.term[0]))
    return letters
  }, [])

  const toggleSave = (term: string) => {
    setSavedTerms(prev => 
      prev.includes(term) ? prev.filter(t => t !== term) : [...prev, term]
    )
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(label)
      setTimeout(() => setCopiedText(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const scrollToLetter = (letter: string) => {
    const element = document.getElementById(`section-${letter}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const activeCategory = categories.find(c => c.id === selectedCategory)

  return (
    <div className="min-h-screen bg-background" ref={scrollRef}>
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/resources" className="hover:text-primary transition-colors">Resources</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">Legal Glossary</span>
            </nav>

            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
                <BookOpen className="w-4 h-4 mr-2" />
                {glossaryTerms.length}+ Legal Terms
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Legal Glossary
                <span className="block text-2xl md:text-3xl font-normal text-muted-foreground mt-2">
                  Understand Pakistani legal terminology
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Comprehensive definitions with Pakistani law context, usage examples, and statutory references. 
                Essential for students, practitioners, and litigants.
              </p>

              {/* Enhanced Search */}
              <div className="relative max-w-2xl mx-auto">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search terms, definitions, or legal concepts (e.g., 'bail', 'writ', 'Section 11')..."
                      className="pl-12 pr-12 h-14 text-lg rounded-xl border-2 shadow-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 p-1 hover:bg-muted rounded-full transition-colors"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Quick search tags */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <span className="text-sm text-muted-foreground">Popular:</span>
                  {['Khula', 'Bail', 'Writ', 'Injunction', 'Jurisdiction'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="text-sm px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { label: 'Legal Terms', value: glossaryTerms.length.toString(), icon: BookOpen },
                { label: 'Categories', value: categories.length.toString(), icon: Tag },
                { label: 'Statutory References', value: '50+', icon: Scale },
                { label: 'Pakistani Context', value: '100%', icon: Sparkles },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 rounded-xl bg-background/50 backdrop-blur-sm border">
                  <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters Section */}
        <div className="mb-8 space-y-6">
          {/* Alphabet Navigation */}
          <div className="bg-muted/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
              <span className="font-medium">Browse by Letter:</span>
              <span className="text-xs">(Click to jump)</span>
            </div>
            <div className="flex flex-wrap justify-center gap-1">
              {alphabet.map((letter) => {
                const hasTerms = activeLetters.has(letter)
                const isActive = selectedLetter === letter
                return (
                  <button
                    key={letter}
                    onClick={() => {
                      if (isActive) {
                        setSelectedLetter(null)
                      } else {
                        setSelectedLetter(letter)
                        scrollToLetter(letter)
                      }
                    }}
                    disabled={!hasTerms}
                    className={cn(
                      "w-9 h-9 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : hasTerms
                        ? 'hover:bg-muted text-foreground hover:scale-105'
                        : 'text-muted-foreground cursor-not-allowed opacity-30'
                    )}
                    title={hasTerms ? `Jump to ${letter}` : 'No terms'}
                  >
                    {letter}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Category & Difficulty Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                    selectedCategory === cat.id
                      ? 'bg-primary text-primary-foreground border-primary shadow-md'
                      : 'bg-background hover:bg-muted border-border'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", cat.color)} />
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    More Filters
                    {(selectedDifficulty || selectedLetter) && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                        {(selectedDifficulty ? 1 : 0) + (selectedLetter ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Glossary</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Difficulty Filter */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Difficulty Level</h4>
                      <div className="space-y-2">
                        {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                          <button
                            key={level}
                            onClick={() => setSelectedDifficulty(selectedDifficulty === level ? null : level)}
                            className={cn(
                              "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors",
                              selectedDifficulty === level 
                                ? 'border-primary bg-primary/5' 
                                : 'hover:bg-muted'
                            )}
                          >
                            <Badge variant="outline" className={cn("text-xs", difficultyColors[level as keyof typeof difficultyColors])}>
                              {level}
                            </Badge>
                            {selectedDifficulty === level && (
                              <Check className="h-4 w-4 text-primary ml-auto" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Clear Filters */}
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setSelectedDifficulty(null)
                        setSelectedLetter(null)
                        setSelectedCategory('All')
                        setSearchQuery('')
                      }}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              {/* View Toggle */}
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  )}
                  title="Grid view"
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  )}
                  title="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedCategory !== 'All' || selectedLetter || selectedDifficulty) && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/30 rounded-lg">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {selectedCategory !== 'All' && (
                <Badge variant="secondary" className="gap-1">
                  {activeCategory?.name}
                  <button onClick={() => setSelectedCategory('All')} className="hover:bg-muted rounded-full p-0.5 ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedLetter && (
                <Badge variant="secondary" className="gap-1">
                  Starts with {selectedLetter}
                  <button onClick={() => setSelectedLetter(null)} className="hover:bg-muted rounded-full p-0.5 ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedDifficulty && (
                <Badge variant="secondary" className="gap-1">
                  {selectedDifficulty}
                  <button onClick={() => setSelectedDifficulty(null)} className="hover:bg-muted rounded-full p-0.5 ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <button 
                onClick={() => { 
                  setSelectedCategory('All'); 
                  setSelectedLetter(null); 
                  setSelectedDifficulty(null);
                  setSearchQuery('');
                }}
                className="text-sm text-primary hover:underline ml-auto"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">
              {searchQuery ? `Results for "${searchQuery}"` : 'All Legal Terms'}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {filteredTerms.length} term{filteredTerms.length !== 1 ? 's' : ''} found
              {filteredTerms.length > 0 && ` • A-Z sorted`}
            </p>
          </div>
          
          {savedTerms.length > 0 && (
            <Badge variant="outline" className="gap-1">
              <Bookmark className="h-3 w-3 fill-primary text-primary" />
              {savedTerms.length} saved
            </Badge>
          )}
        </div>

        {/* Terms Display */}
        <div className="space-y-8">
          {Object.entries(groupedTerms).map(([letter, terms]) => (
            <div key={letter} id={`section-${letter}`} className="scroll-mt-24">
              {/* Letter Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-2xl text-primary border-2 border-primary/20">
                  {letter}
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                <span className="text-sm text-muted-foreground">{terms.length} terms</span>
              </div>
              
              {/* Terms Grid/List */}
              <div className={cn(
                viewMode === 'grid' 
                  ? 'grid md:grid-cols-2 gap-4'
                  : 'space-y-3'
              )}>
                {terms.map((term) => (
                  <Card 
                    key={term.term} 
                    className={cn(
                      "group hover:shadow-xl transition-all overflow-hidden border-l-4",
                      viewMode === 'list' && "flex flex-row items-start p-4",
                      term.difficulty === 'Beginner' ? "border-l-green-500" :
                      term.difficulty === 'Intermediate' ? "border-l-yellow-500" : "border-l-red-500"
                    )}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <Badge variant="outline" className={cn("text-xs", difficultyColors[term.difficulty as keyof typeof difficultyColors])}>
                                  {term.difficulty}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {term.category}
                                </Badge>
                                {term.frequency === 'High' && (
                                  <Badge variant="outline" className="text-xs text-blue-600 border-blue-200 bg-blue-50">
                                    Common
                                  </Badge>
                                )}
                              </div>
                              <CardTitle className="text-xl group-hover:text-primary transition-colors flex items-center gap-2">
                                {term.term}
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button 
                                        onClick={() => copyToClipboard(term.term, `term-${term.term}`)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                                      >
                                        {copiedText === `term-${term.term}` ? (
                                          <Check className="h-3 w-3 text-green-500" />
                                        ) : (
                                          <Copy className="h-3 w-3 text-muted-foreground" />
                                        )}
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Copy term</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </CardTitle>
                            </div>
                            <div className="flex gap-1">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => toggleSave(term.term)}
                                      className="p-2 hover:bg-muted rounded-full transition-colors"
                                    >
                                      <Bookmark className={cn(
                                        "h-4 w-4 transition-colors",
                                        savedTerms.includes(term.term) ? 'fill-primary text-primary' : 'text-muted-foreground'
                                      )} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{savedTerms.includes(term.term) ? 'Remove from saved' : 'Save term'}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-3">
                          {/* Definition */}
                          <p className="text-muted-foreground leading-relaxed">{term.definition}</p>
                          
                          {/* Expandable Content */}
                          {expandedTerm === term.term && (
                            <div className="space-y-3 animate-in slide-in-from-top-2">
                              {/* Pakistani Context */}
                              <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-200">
                                <div className="flex items-start gap-2">
                                  <Sparkles className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                                  <div>
                                    <p className="text-xs font-semibold text-amber-900 mb-1">Pakistani Law Context</p>
                                    <p className="text-sm text-amber-800">{term.pakistaniContext}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Statutory References */}
                              {term.sections && (
                                <div className="flex flex-wrap gap-2">
                                  <span className="text-xs text-muted-foreground">Statutory Reference:</span>
                                  {term.sections.map((section) => (
                                    <Badge key={section} variant="outline" className="text-xs font-mono bg-slate-50">
                                      {section}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Example */}
                          <div className="bg-muted/50 p-3 rounded-lg border-l-2 border-l-primary/30">
                            <p className="text-sm italic text-muted-foreground">
                              <span className="font-medium text-foreground not-italic">Example: </span>
                              "{term.example}"
                            </p>
                          </div>

                          {/* Related Terms */}
                          <div className="flex flex-wrap items-center gap-2 pt-2">
                            <span className="text-xs text-muted-foreground">Related:</span>
                            {term.related.slice(0, 3).map((related) => (
                              <button
                                key={related}
                                onClick={() => setSearchQuery(related)}
                                className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors text-primary"
                              >
                                {related}
                              </button>
                            ))}
                            {term.related.length > 3 && (
                              <span className="text-xs text-muted-foreground">+{term.related.length - 3}</span>
                            )}
                          </div>
                        </CardContent>

                        <CardFooter className="pt-0 flex justify-between items-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setExpandedTerm(expandedTerm === term.term ? null : term.term)}
                            className="gap-1"
                          >
                            {expandedTerm === term.term ? (
                              <>Less <ChevronUp className="h-4 w-4" /></>
                            ) : (
                              <>More <ChevronDown className="h-4 w-4" /></>
                            )}
                          </Button>
                          
                          <div className="flex gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => copyToClipboard(`${term.term}: ${term.definition}`, `def-${term.term}`)}
                                    className="p-2 hover:bg-muted rounded-full transition-colors"
                                  >
                                    {copiedText === `def-${term.term}` ? (
                                      <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <Share2 className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Copy definition</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </CardFooter>
                      </>
                    ) : (
                      /* List View */
                      <>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-lg group-hover:text-primary transition-colors">
                              {term.term}
                            </span>
                            <Badge variant="outline" className={cn("text-xs", difficultyColors[term.difficulty as keyof typeof difficultyColors])}>
                              {term.difficulty}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">{term.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{term.definition}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {term.related.slice(0, 2).map((rel) => (
                              <span key={rel} className="text-xs text-primary">{rel}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => toggleSave(term.term)}
                            className="p-2 hover:bg-muted rounded-full transition-colors"
                          >
                            <Bookmark className={cn(
                              "h-4 w-4 transition-colors",
                              savedTerms.includes(term.term) ? 'fill-primary text-primary' : 'text-muted-foreground'
                            )} />
                          </button>
                          <button
                            onClick={() => copyToClipboard(term.definition, `list-${term.term}`)}
                            className="p-2 hover:bg-muted rounded-full transition-colors"
                          >
                            {copiedText === `list-${term.term}` ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTerms.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No terms found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn't find any legal terms matching your search. Try adjusting your filters or search query.
            </p>
            <Button onClick={() => { 
              setSearchQuery(''); 
              setSelectedCategory('All'); 
              setSelectedLetter(null);
              setSelectedDifficulty(null);
            }}>
              Clear all filters
            </Button>
          </div>
        )}

        {/* Learning Resources */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                For Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Essential terminology for LL.B students and bar exam preparation. 
                Includes statutory references and Pakistani context.
              </p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/legal-guides">Study Guides</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                For Litigants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Understand legal jargon used in your case. Look up terms found in 
                court documents and legal notices.
              </p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/documents">Legal Documents</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Need Explanation?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Can't find a term? Our AI assistant can explain complex legal 
                concepts in simple language.
              </p>
              <Button size="sm" className="w-full" asChild>
                <Link to="/chat">Ask AI Assistant</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 md:p-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold mb-3">Can't find a term?</h2>
              <p className="text-primary-foreground/90 text-lg max-w-xl">
                Our AI assistant can explain any legal term, concept, or procedure in simple Urdu or English. 
                Get instant answers with statutory references.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <Link to="/chat">
                Ask AI Assistant <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-110 z-50"
          title="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}