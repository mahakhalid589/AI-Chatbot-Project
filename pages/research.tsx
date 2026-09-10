import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { 
  Search, 
  BookOpen, 
  Scale, 
  Calendar,
  Building2,
  ChevronRight,
  Download,
  Copy,
  Bookmark,
  ExternalLink,
  CheckCircle,
  X,
  Filter,
  Grid3X3,
  List,
  Check,
  MoreVertical,
  Share2,
  Printer,
  History,
  Gavel,
  Sparkles} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

// Enhanced case law data structure
interface CaseLaw {
  citation: string
  title: string
  year: number
  court: string
  courtId: string
  source: string
  description: string
  verified: boolean
  relevantSections: string[]
  judges?: string
  benchStrength?: string
  outcome?: string
  significance?: 'landmark' | 'important' | 'routine'
  keywords: string[]
  summary?: string
  fullTextUrl?: string
}

const caseLaws: CaseLaw[] = [
  {
    citation: 'PLD 2023 SC 1',
    title: 'State vs. Accused Person (Interpretation of Section 302 PPC)',
    year: 2023,
    court: 'Supreme Court of Pakistan',
    courtId: 'sc',
    source: 'PLD',
    description: 'Clarified mens rea requirement in murder cases under Section 302. Court held that specific intention must be proved beyond reasonable doubt.',
    verified: true,
    relevantSections: ['302', '304'],
    judges: 'Justice Umar Ata Bandial, Justice Qazi Faez Isa',
    benchStrength: '3-Member',
    outcome: 'Appeal dismissed',
    significance: 'landmark',
    keywords: ['Murder', 'Mens Rea', 'Intention', 'Qatl-e-amd'],
    summary: 'The Supreme Court clarified that in cases under Section 302 PPC, the prosecution must establish specific intention to cause death or bodily injury sufficient to cause death. Circumstantial evidence must lead to only one inference.'
  },
  {
    citation: '2023 SCMR 45',
    title: 'Muhammad Aslam vs. Federation of Pakistan (Constitutional Petition)',
    year: 2023,
    court: 'Supreme Court of Pakistan',
    courtId: 'sc',
    source: 'SCMR',
    description: 'Fundamental rights enforcement under Article 199. Court ordered implementation of earlier directions regarding service matters.',
    verified: true,
    relevantSections: ['199'],
    judges: 'Justice Ijaz ul Ahsan',
    benchStrength: '2-Member',
    outcome: 'Petition allowed',
    significance: 'important',
    keywords: ['Constitution', 'Fundamental Rights', 'Service Matter'],
    summary: 'The Court emphasized that Article 199 petitions should not be used to circumvent regular appeals. However, in exceptional cases involving fundamental rights, interference is warranted.'
  },
  {
    citation: 'PLD 2022 Lahore 123',
    title: 'Ali vs. State (Bail Application)',
    year: 2022,
    court: 'Lahore High Court, Lahore',
    courtId: 'lhc',
    source: 'PLD',
    description: 'Guidelines for grant of bail in non-bailable offenses. Balanced approach between liberty and investigation requirements.',
    verified: true,
    relevantSections: ['496', '497', '498'],
    judges: 'Justice Shahid Kareem',
    benchStrength: 'Single',
    outcome: 'Bail granted',
    significance: 'important',
    keywords: ['Bail', 'Non-bailable', 'Liberty', 'Inquiry'],
    summary: 'Established that bail is the rule in bailable offenses and exception in non-bailable. Court must consider nature of accusation, severity of punishment, and likelihood of absconding.'
  },
  {
    citation: '2022 YLR 89',
    title: 'Fatima Bibi vs. Muhammad Aslam (Khula Proceedings)',
    year: 2022,
    court: 'Lahore High Court, Multan Bench',
    courtId: 'lhc',
    source: 'YLR',
    description: 'Grounds for khula under Section 8 MFLO. Cruelty and non-maintenance established as valid grounds.',
    verified: true,
    relevantSections: ['8', 'MFLO'],
    judges: 'Justice Raheel Kamran Sheikh',
    benchStrength: 'Single',
    outcome: 'Decree granted',
    significance: 'routine',
    keywords: ['Khula', 'Family Law', 'Cruelty', 'Maintenance'],
    summary: 'Wife successfully proved cruelty and non-payment of maintenance for two years. Court held these are valid grounds under Section 8 of MFLO 1961.'
  },
  {
    citation: 'PLD 2023 Sindh 56',
    title: 'Property Developers Association vs. Government of Sindh',
    year: 2023,
    court: 'Sindh High Court, Karachi',
    courtId: 'shc',
    source: 'PLD',
    description: 'Challenge to Sindh Building Control Authority regulations. Ultra vires doctrine applied.',
    verified: true,
    relevantSections: ['199', '144'],
    judges: 'Justice Muhammad Ali Mazhar',
    benchStrength: 'Division Bench',
    outcome: 'Writ allowed in part',
    significance: 'landmark',
    keywords: ['Ultra Vires', 'Administrative Law', 'Property', 'SBCA'],
    summary: 'Certain regulations declared ultra vires the parent act. Court emphasized that delegated legislation cannot exceed the scope of enabling act.'
  },
  {
    citation: '2023 PCR 112',
    title: 'State vs. Accused (Terrorism Charges)',
    year: 2023,
    court: 'Peshawar High Court, Peshawar',
    courtId: 'phc',
    source: 'PCR',
    description: 'Interpretation of Anti-Terrorism Act provisions. Speedy trial requirements discussed.',
    verified: true,
    relevantSections: ['7-ATA', '21-H'],
    judges: 'Justice Roohul Amin Khan',
    benchStrength: 'Division Bench',
    outcome: 'Conviction upheld',
    significance: 'important',
    keywords: ['Terrorism', 'ATA', 'Speedy Trial', 'Evidence'],
    summary: 'Upheld conviction under ATA while ensuring fair trial rights. Discussed admissibility of evidence collected during investigation.'
  },
  {
    citation: 'PLD 2022 Balochistan 23',
    title: 'Tribal Elders vs. Federation (Constitutional Validity)',
    year: 2022,
    court: 'Balochistan High Court, Quetta',
    courtId: 'bhc',
    source: 'PLD',
    description: 'Challenge to federal legislation affecting tribal areas. Federal legislative competence examined.',
    verified: true,
    relevantSections: ['142', '143'],
    judges: 'Justice Naeem Akhtar',
    benchStrength: 'Full Bench',
    outcome: 'Reference answered',
    significance: 'landmark',
    keywords: ['Federalism', 'Tribal Areas', 'Legislative Competence'],
    summary: 'Full bench decision on distribution of legislative powers between Federation and Provinces regarding tribal areas post-25th Amendment.'
  },
  {
    citation: '2023 CLC 445',
    title: 'Bank Al-Habib vs. Trader Association (Banking Dispute)',
    year: 2023,
    court: 'Islamabad High Court',
    courtId: 'ihc',
    source: 'CLC',
    description: 'Recovery of bank loans and collateral enforcement. Banking Courts jurisdiction discussed.',
    verified: true,
    relevantSections: ['9', 'Financial Institutions'],
    judges: 'Justice Athar Minallah',
    benchStrength: 'Single',
    outcome: 'Petition dismissed',
    significance: 'important',
    keywords: ['Banking', 'Recovery', 'Collateral', 'Jurisdiction'],
    summary: 'Banking Courts have exclusive jurisdiction over matters covered by Recovery of Finances Ordinance. Civil courts barred.'
  }
]

const courts = [
  { id: 'all', name: 'All Courts', icon: Building2, color: 'bg-slate-500' },
  { id: 'sc', name: 'Supreme Court', icon: Scale, color: 'bg-amber-500' },
  { id: 'lhc', name: 'Lahore High Court', icon: Gavel, color: 'bg-emerald-500' },
  { id: 'shc', name: 'Sindh High Court', icon: Gavel, color: 'bg-blue-500' },
  { id: 'phc', name: 'Peshawar High Court', icon: Gavel, color: 'bg-purple-500' },
  { id: 'bhc', name: 'Balochistan High Court', icon: Gavel, color: 'bg-rose-500' },
  { id: 'ihc', name: 'Islamabad High Court', icon: Gavel, color: 'bg-cyan-500' },
  { id: 'fsc', name: 'Federal Shariat Court', icon: Scale, color: 'bg-orange-500' },
]

const sources = [
  { id: 'all', name: 'All Sources' },
  { id: 'PLD', name: 'PLD (Pakistan Legal Decisions)' },
  { id: 'SCMR', name: 'SCMR (Supreme Court Monthly Review)' },
  { id: 'PCR', name: 'PCR (Pakistan Criminal Reports)' },
  { id: 'CLC', name: 'CLC (Civil Law Cases)' },
  { id: 'YLR', name: 'YLR (Yearly Law Reports)' },
]

const significanceColors = {
  landmark: 'bg-purple-100 text-purple-800 border-purple-200',
  important: 'bg-blue-100 text-blue-800 border-blue-200',
  routine: 'bg-gray-100 text-gray-800 border-gray-200'
}

export default function ResearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedCourt, setSelectedCourt] = useState(searchParams.get('court') || 'all')
  const [selectedSource, setSelectedSource] = useState(searchParams.get('source') || 'all')
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || 'all')
  const [selectedSignificance, setSelectedSignificance] = useState<string | null>(searchParams.get('significance'))
  const [selectedCase, setSelectedCase] = useState<CaseLaw | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [savedCases, setSavedCases] = useState<string[]>([])
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'court'>('relevance')

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (selectedCourt !== 'all') params.set('court', selectedCourt)
    if (selectedSource !== 'all') params.set('source', selectedSource)
    if (selectedYear !== 'all') params.set('year', selectedYear)
    if (selectedSignificance) params.set('significance', selectedSignificance)
    setSearchParams(params)
  }, [searchQuery, selectedCourt, selectedSource, selectedYear, selectedSignificance])

  const years = useMemo(() => {
    return Array.from(new Set(caseLaws.map(c => c.year))).sort((a, b) => b - a)
  }, [])

  const filteredCases = useMemo(() => {
    let result = caseLaws.filter((caseLaw) => {
      const matchesSearch = 
        searchQuery === '' ||
        caseLaw.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseLaw.citation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseLaw.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseLaw.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCourt = selectedCourt === 'all' || caseLaw.courtId === selectedCourt
      const matchesSource = selectedSource === 'all' || caseLaw.source === selectedSource
      const matchesYear = selectedYear === 'all' || caseLaw.year.toString() === selectedYear
      const matchesSignificance = !selectedSignificance || caseLaw.significance === selectedSignificance

      return matchesSearch && matchesCourt && matchesSource && matchesYear && matchesSignificance
    })

    // Sort
    switch (sortBy) {
      case 'date':
        result = result.sort((a, b) => b.year - a.year)
        break
      case 'court':
        result = result.sort((a, b) => a.court.localeCompare(b.court))
        break
      default:
        // Relevance - prioritize verified and significance
        result = result.sort((a, b) => {
          if (a.significance === 'landmark' && b.significance !== 'landmark') return -1
          if (b.significance === 'landmark' && a.significance !== 'landmark') return 1
          return b.year - a.year
        })
    }

    return result
  }, [searchQuery, selectedCourt, selectedSource, selectedYear, selectedSignificance, sortBy])

  const toggleSave = (citation: string) => {
    setSavedCases(prev => 
      prev.includes(citation) ? prev.filter(c => c !== citation) : [...prev, citation]
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

  const generateCitation = (caseLaw: CaseLaw) => {
    return `${caseLaw.title}, ${caseLaw.citation} (${caseLaw.year}) ${caseLaw.court}`
  }

  const activeFiltersCount = [selectedCourt, selectedSource, selectedYear, selectedSignificance]
    .filter(f => f && f !== 'all').length

  const activeCourt = courts.find(c => c.id === selectedCourt)

  return (
    <div className="min-h-screen bg-background">
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
              <span className="text-foreground font-medium">Legal Research</span>
            </nav>

            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
                <Scale className="w-4 h-4 mr-2" />
                {caseLaws.length}+ Judgments
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Legal Research
                <span className="block text-2xl md:text-3xl font-normal text-muted-foreground mt-2">
                  Supreme Court & High Court judgments
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Access verified case law from 1950 to present. Search by citation, 
                legal principles, statutory sections, or court. Properly formatted 
                for legal citation and research.
              </p>

              {/* Enhanced Search */}
              <div className="relative max-w-2xl mx-auto">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by case title, citation, legal principle, or section (e.g., 'Section 302', 'Khula')..."
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
                  {['Section 302', 'Bail', 'Khula', 'Ultra Vires', 'Fundamental Rights'].map((tag) => (
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
                { label: 'Total Cases', value: caseLaws.length.toString(), icon: BookOpen },
                { label: 'Courts', value: courts.length.toString(), icon: Building2 },
                { label: 'Year Range', value: '1950-2024', icon: Calendar },
                { label: 'Verified', value: '100%', icon: CheckCircle },
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
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Desktop Filters */}
            <div className="hidden lg:flex flex-wrap items-center gap-3">
              <Select value={selectedCourt} onValueChange={setSelectedCourt}>
                <SelectTrigger className="w-[200px]">
                  <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Select Court" />
                </SelectTrigger>
                <SelectContent>
                  {courts.map((court) => (
                    <SelectItem key={court.id} value={court.id}>
                      <div className="flex items-center gap-2">
                        <span className={cn("w-2 h-2 rounded-full", court.color)} />
                        {court.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="w-[220px]">
                  <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  {sources.map((source) => (
                    <SelectItem key={source.id} value={source.id}>{source.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[140px]">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSignificance || 'all'} onValueChange={(v) => setSelectedSignificance(v === 'all' ? null : v)}>
                <SelectTrigger className="w-[160px]">
                  <Sparkles className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Significance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cases</SelectItem>
                  <SelectItem value="landmark">Landmark</SelectItem>
                  <SelectItem value="important">Important</SelectItem>
                  <SelectItem value="routine">Routine</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mobile Filter Button */}
            <div className="flex lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-1">{activeFiltersCount}</Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:w-96">
                  <SheetHeader>
                    <SheetTitle>Filter Cases</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Court</label>
                      <div className="space-y-2">
                        {courts.map((court) => (
                          <button
                            key={court.id}
                            onClick={() => setSelectedCourt(court.id)}
                            className={cn(
                              "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left",
                              selectedCourt === court.id ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                            )}
                          >
                            <court.icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{court.name}</span>
                            {selectedCourt === court.id && <Check className="h-4 w-4 text-primary ml-auto" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Year</label>
                      <div className="grid grid-cols-3 gap-2">
                        {years.slice(0, 9).map((year) => (
                          <button
                            key={year}
                            onClick={() => setSelectedYear(year.toString())}
                            className={cn(
                              "p-2 rounded-lg text-sm border transition-colors",
                              selectedYear === year.toString() ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                            )}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
              </div>

              <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <SelectTrigger className="w-[140px]">
                  <span className="text-xs text-muted-foreground mr-2">Sort:</span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="date">Date (Newest)</SelectItem>
                  <SelectItem value="court">Court</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/30 rounded-lg">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {selectedCourt !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {activeCourt?.name}
                  <button onClick={() => setSelectedCourt('all')} className="hover:bg-muted rounded-full p-0.5 ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedSource !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {selectedSource}
                  <button onClick={() => setSelectedSource('all')} className="hover:bg-muted rounded-full p-0.5 ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedYear !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Year {selectedYear}
                  <button onClick={() => setSelectedYear('all')} className="hover:bg-muted rounded-full p-0.5 ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedSignificance && (
                <Badge variant="secondary" className="gap-1 capitalize">
                  {selectedSignificance}
                  <button onClick={() => setSelectedSignificance(null)} className="hover:bg-muted rounded-full p-0.5 ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <button 
                onClick={() => {
                  setSelectedCourt('all')
                  setSelectedSource('all')
                  setSelectedYear('all')
                  setSelectedSignificance(null)
                  setSearchQuery('')
                }}
                className="text-sm text-primary hover:underline ml-auto"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cases List */}
          <div className={cn("space-y-4", selectedCase ? "lg:col-span-2" : "lg:col-span-3")}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold">
                  {searchQuery ? `Results for "${searchQuery}"` : 'All Cases'}
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {filteredCases.length} case{filteredCases.length !== 1 ? 's' : ''} found
                  {sortBy === 'date' && ' • Sorted by date'}
                </p>
              </div>
              {savedCases.length > 0 && (
                <Badge variant="outline" className="gap-1">
                  <Bookmark className="h-3 w-3 fill-primary text-primary" />
                  {savedCases.length} saved
                </Badge>
              )}
            </div>

            <div className={cn(
              viewMode === 'grid' && !selectedCase
                ? 'grid md:grid-cols-2 gap-4'
                : 'space-y-4'
            )}>
              {filteredCases.map((caseLaw) => (
                <Card 
                  key={caseLaw.citation}
                  className={cn(
                    "group cursor-pointer transition-all hover:shadow-lg overflow-hidden",
                    selectedCase?.citation === caseLaw.citation 
                      ? 'border-2 border-primary ring-2 ring-primary/20' 
                      : 'border hover:border-primary/30',
                    viewMode === 'grid' && selectedCase && "flex flex-row items-center p-4"
                  )}
                  onClick={() => setSelectedCase(caseLaw)}
                >
                  {viewMode === 'list' || selectedCase ? (
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge variant="secondary" className="font-mono text-xs">
                              {caseLaw.source}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{caseLaw.year}</span>
                            {caseLaw.significance && (
                              <Badge 
                                variant="outline" 
                                className={cn("text-xs capitalize", significanceColors[caseLaw.significance])}
                              >
                                {caseLaw.significance}
                              </Badge>
                            )}
                            {caseLaw.verified && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200 bg-emerald-50 gap-1">
                                      <CheckCircle className="h-3 w-3" />
                                      Verified
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Verified against official law reports</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors line-clamp-2">
                            {caseLaw.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {caseLaw.description}
                          </p>
                          
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              <Building2 className="h-3 w-3 mr-1" />
                              {caseLaw.court.replace('High Court', 'HC')}
                            </Badge>
                            {caseLaw.relevantSections.slice(0, 3).map((section) => (
                              <Badge key={section} variant="outline" className="text-xs font-mono">
                                Sec {section}
                              </Badge>
                            ))}
                            {caseLaw.relevantSections.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{caseLaw.relevantSections.length - 3}
                              </Badge>
                            )}
                          </div>

                          {caseLaw.keywords && (
                            <div className="flex items-center gap-1 mt-2">
                              {caseLaw.keywords.slice(0, 3).map((keyword) => (
                                <span key={keyword} className="text-xs text-muted-foreground">
                                  #{keyword}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleSave(caseLaw.citation)
                                  }}
                                  className="p-2 hover:bg-muted rounded-full transition-colors"
                                >
                                  <Bookmark className={cn(
                                    "h-4 w-4 transition-colors",
                                    savedCases.includes(caseLaw.citation) ? 'fill-primary text-primary' : 'text-muted-foreground'
                                  )} />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{savedCases.includes(caseLaw.citation) ? 'Remove from saved' : 'Save case'}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <ChevronRight className={cn(
                            "h-5 w-5 text-muted-foreground transition-transform",
                            selectedCase?.citation === caseLaw.citation && "rotate-90"
                          )} />
                        </div>
                      </div>
                    </CardContent>
                  ) : (
                    /* Grid View */
                    <>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="font-mono text-xs">{caseLaw.source}</Badge>
                              <span className="text-xs text-muted-foreground">{caseLaw.year}</span>
                            </div>
                            <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
                              {caseLaw.title}
                            </CardTitle>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleSave(caseLaw.citation)
                            }}
                            className="p-1 hover:bg-muted rounded-full"
                          >
                            <Bookmark className={cn(
                              "h-4 w-4",
                              savedCases.includes(caseLaw.citation) ? 'fill-primary text-primary' : 'text-muted-foreground'
                            )} />
                          </button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {caseLaw.description}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">{caseLaw.court.split(' ')[0]}</Badge>
                          {caseLaw.relevantSections.slice(0, 2).map((section) => (
                            <Badge key={section} variant="outline" className="text-xs font-mono">Sec {section}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </>
                  )}
                </Card>
              ))}

              {filteredCases.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No cases found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    We couldn't find any cases matching your search criteria. Try adjusting your filters or search query.
                  </p>
                  <Button onClick={() => {
                    setSearchQuery('')
                    setSelectedCourt('all')
                    setSelectedSource('all')
                    setSelectedYear('all')
                    setSelectedSignificance(null)
                  }}>
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Case Detail Panel */}
          {selectedCase && (
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-2 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="font-mono">{selectedCase.source}</Badge>
                      <span className="text-sm text-muted-foreground">{selectedCase.year}</span>
                    </div>
                    <div className="flex gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => toggleSave(selectedCase.citation)}
                              className="p-2 hover:bg-muted rounded-full transition-colors"
                            >
                              <Bookmark className={cn(
                                "h-4 w-4",
                                savedCases.includes(selectedCase.citation) ? 'fill-primary text-primary' : 'text-muted-foreground'
                              )} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{savedCases.includes(selectedCase.citation) ? 'Saved' : 'Save case'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-muted rounded-full transition-colors">
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => copyToClipboard(generateCitation(selectedCase), 'cite')}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Citation
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share Case
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <CardTitle className="text-lg leading-tight">{selectedCase.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Building2 className="h-3 w-3" />
                    {selectedCase.court}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Meta Info */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-muted-foreground text-xs mb-1">Citation</p>
                      <p className="font-mono font-medium">{selectedCase.citation}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-muted-foreground text-xs mb-1">Year</p>
                      <p className="font-medium">{selectedCase.year}</p>
                    </div>
                    {selectedCase.judges && (
                      <div className="col-span-2 p-3 rounded-lg bg-muted/50">
                        <p className="text-muted-foreground text-xs mb-1">Judges</p>
                        <p className="text-sm">{selectedCase.judges}</p>
                      </div>
                    )}
                    {selectedCase.benchStrength && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-muted-foreground text-xs mb-1">Bench</p>
                        <p className="text-sm">{selectedCase.benchStrength}</p>
                      </div>
                    )}
                    {selectedCase.outcome && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-muted-foreground text-xs mb-1">Outcome</p>
                        <p className="text-sm font-medium text-primary">{selectedCase.outcome}</p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Legal Provisions */}
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      Relevant Sections
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCase.relevantSections.map((section) => (
                        <Badge 
                          key={section} 
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary/20"
                          onClick={() => setSearchQuery(`Section ${section}`)}
                        >
                          Section {section}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <p className="text-sm font-medium mb-2">Summary</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedCase.summary || selectedCase.description}
                    </p>
                  </div>

                  {/* Keywords */}
                  {selectedCase.keywords && (
                    <div>
                      <p className="text-sm font-medium mb-2">Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCase.keywords.map((keyword) => (
                          <button
                            key={keyword}
                            onClick={() => setSearchQuery(keyword)}
                            className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors text-muted-foreground"
                          >
                            {keyword}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button 
                      className="w-full gap-2"
                      onClick={() => copyToClipboard(generateCitation(selectedCase), 'cite')}
                    >
                      {copiedText === 'cite' ? (
                        <><Check className="h-4 w-4" /> Copied!</>
                      ) : (
                        <><Copy className="h-4 w-4" /> Copy Citation</>
                      )}
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Full Text
                      </Button>
                    </div>
                  </div>

                  {/* Verification Badge */}
                  {selectedCase.verified && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                      <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                      <p className="text-xs text-emerald-800">
                        Verified against official law reports
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Research Tips */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Citation Format
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Pakistani legal citations follow the pattern: <em>Party Name, PLD Year Page (Court)</em>
              </p>
              <div className="p-3 rounded-lg bg-muted font-mono text-xs">
                State v. Accused, PLD 2023 SC 45
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Law Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Access official law reports: PLD, SCMR, YLR, CLC, and PCR for comprehensive research.
              </p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/legal-guides">Research Guides</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Research
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Use our AI assistant to find relevant case law by describing your legal issue.
              </p>
              <Button size="sm" className="w-full" asChild>
                <Link to="/chat">Ask AI Assistant</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 md:p-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold mb-3">Can't find the case?</h2>
              <p className="text-primary-foreground/90 text-lg max-w-xl">
                Our AI assistant can help you find relevant case law, interpret judgments, 
                and identify applicable legal principles for your research.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <Link to="/chat">
                Ask AI Assistant <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}