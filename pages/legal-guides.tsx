import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  ChevronRight, 
  Scale, 
  Users, 
  Home, 
  Building2, 
  FileText,
  Shield,
  Search,
  Gavel,
  ArrowRight,
  Clock,
  Bookmark,
  TrendingUp,
  Eye,
  ChevronDown,
  Filter,
  X,
  Download,
  Printer,
  CheckCircle2,
  Lightbulb,
  ArrowUpRight
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

// Enhanced data structure with more metadata
const categories = [
  { id: 'all', name: 'All Guides', icon: FileText, count: 24, color: 'bg-slate-500' },
  { id: 'family', name: 'Family Law', icon: Users, count: 12, color: 'bg-rose-500', description: 'Marriage, divorce, inheritance, guardianship' },
  { id: 'property', name: 'Property Law', icon: Home, count: 8, color: 'bg-emerald-500', description: 'Registration, transfer, disputes, tenancy' },
  { id: 'business', name: 'Business Law', icon: Building2, count: 10, color: 'bg-blue-500', description: 'Company registration, contracts, compliance' },
  { id: 'criminal', name: 'Criminal Law', icon: Gavel, count: 15, color: 'bg-red-500', description: 'Bail, trials, PPC sections, procedures' },
  { id: 'civil', name: 'Civil Rights', icon: Scale, count: 9, color: 'bg-amber-500', description: 'Constitutional rights, consumer protection' },
  { id: 'constitutional', name: 'Constitutional', icon: Shield, count: 6, color: 'bg-purple-500', description: 'Fundamental rights, judicial review' },
]

const guides = [
  {
    id: 1,
    title: 'Complete Guide to Khula and Divorce Proceedings',
    category: 'Family Law',
    categoryId: 'family',
    readTime: 8,
    views: 12543,
    lastUpdated: '2024-03-15',
    difficulty: 'Intermediate',
    description: 'Step-by-step process for seeking khula under Muslim Family Laws Ordinance, 1961. Includes grounds, procedure, required documentation, and recent case law updates.',
    tags: ['Khula', 'Divorce', 'MFLO 1961', 'Family Court'],
    featured: true,
    trending: true,
    steps: [
      'File petition in Family Court',
      'Serve notice to husband',
      'Attempt reconciliation',
      'Court hearing and decree'
    ],
    keyTakeaway: 'Khula can be granted even without husband\'s consent if wife returns dower.',
  },
  {
    id: 2,
    title: 'Property Registration Process in Pakistan',
    category: 'Property Law',
    categoryId: 'property',
    readTime: 12,
    views: 8921,
    lastUpdated: '2024-03-10',
    difficulty: 'Advanced',
    description: 'Complete walkthrough of property registration, mutation, and transfer procedures across all provinces. Includes stamp duty calculations and required documents.',
    tags: ['Property', 'Registration', 'Mutation', 'Stamp Duty'],
    featured: true,
    trending: false,
    steps: [
      'Verify property documents',
      'Prepare sale deed',
      'Pay stamp duty',
      'Register at Sub-Registrar office',
      'Apply for mutation'
    ],
    keyTakeaway: 'Always verify the seller\'s title and check for any encumbrances before purchase.',
  },
  {
    id: 3,
    title: 'Understanding Bail Procedures in Criminal Cases',
    category: 'Criminal Law',
    categoryId: 'criminal',
    readTime: 6,
    views: 15234,
    lastUpdated: '2024-03-20',
    difficulty: 'Beginner',
    description: 'Types of bail (pre-arrest, post-arrest, anticipatory), conditions, and the procedural requirements for obtaining bail in Pakistani courts.',
    tags: ['Bail', 'Criminal Procedure', 'CrPC', 'Section 496'],
    featured: false,
    trending: true,
    steps: [
      'Determine bail type needed',
      'Prepare bail application',
      'File in competent court',
      'Argue before judge',
      'Furnish bail bonds'
    ],
    keyTakeaway: 'Bail is a right in bailable offenses; court has discretion in non-bailable cases.',
  },
  {
    id: 4,
    title: 'Starting a Business: Legal Requirements',
    category: 'Business Law',
    categoryId: 'business',
    readTime: 10,
    views: 6789,
    lastUpdated: '2024-03-08',
    difficulty: 'Intermediate',
    description: 'SECP registration, NTN requirements, and compliance obligations for new businesses in Pakistan. Includes company vs. sole proprietorship comparison.',
    tags: ['SECP', 'Company Registration', 'NTN', 'Business'],
    featured: false,
    trending: false,
    steps: [
      'Choose business structure',
      'Reserve company name',
      'Prepare incorporation documents',
      'Register with SECP',
      'Obtain NTN and GST'
    ],
    keyTakeaway: 'Private Limited Company offers limited liability but requires more compliance.',
  },
  {
    id: 5,
    title: 'Consumer Rights and Protection Laws',
    category: 'Civil Rights',
    categoryId: 'civil',
    readTime: 5,
    views: 9876,
    lastUpdated: '2024-03-12',
    difficulty: 'Beginner',
    description: 'Your rights as a consumer under Pakistani law and how to file complaints with the Consumer Court. Includes compensation mechanisms.',
    tags: ['Consumer Rights', 'Complaints', 'Consumer Court', 'Defective Goods'],
    featured: false,
    trending: true,
    steps: [
      'Document the issue',
      'Contact seller/service provider',
      'File complaint with Consumer Court',
      'Attend hearings',
      'Enforce judgment'
    ],
    keyTakeaway: 'Consumer Courts provide speedy justice with minimal court fees.',
  },
  {
    id: 6,
    title: 'Drafting a Valid Will (Wasiyat)',
    category: 'Family Law',
    categoryId: 'family',
    readTime: 7,
    views: 7654,
    lastUpdated: '2024-03-05',
    difficulty: 'Intermediate',
    description: 'Legal requirements for creating a valid will under Islamic inheritance laws. Includes restrictions on bequests and executor appointment.',
    tags: ['Will', 'Inheritance', 'Wasiyat', 'Succession'],
    featured: false,
    trending: false,
    steps: [
      'List all assets',
      'Determine legal heirs',
      'Draft will within Islamic limits',
      'Get attested by witnesses',
      'Register if immovable property involved'
    ],
    keyTakeaway: 'Cannot bequeath more than 1/3 to non-heirs without consent of legal heirs.',
  },
  {
    id: 7,
    title: 'Tenant Rights and Eviction Procedures',
    category: 'Property Law',
    categoryId: 'property',
    readTime: 9,
    views: 11234,
    lastUpdated: '2024-03-18',
    difficulty: 'Intermediate',
    description: 'Rights of tenants under tenancy laws, valid grounds for eviction, and the legal process landlords must follow to evict tenants.',
    tags: ['Tenancy', 'Eviction', 'Rent', 'Landlord'],
    featured: false,
    trending: true,
    steps: [
      'Understand tenancy agreement',
      'Know your rights',
      'Respond to eviction notice',
      'File suit if illegal eviction',
      'Seek police help if needed'
    ],
    keyTakeaway: 'Landlord cannot force eviction without court order; tenant can claim damages.',
  },
  {
    id: 8,
    title: 'FIR Registration: Your Rights and Procedures',
    category: 'Criminal Law',
    categoryId: 'criminal',
    readTime: 6,
    views: 18765,
    lastUpdated: '2024-03-22',
    difficulty: 'Beginner',
    description: 'How to register an FIR, what to do if police refuse, and your rights during investigation. Includes Section 154 CrPC requirements.',
    tags: ['FIR', 'Police', 'CrPC', 'Complaint'],
    featured: false,
    trending: true,
    steps: [
      'Approach police station',
      'Provide written complaint',
      'Get copy of FIR free',
      'If refused, approach SP/DPO',
      'Can file private complaint to Magistrate'
    ],
    keyTakeaway: 'Police cannot refuse to register FIR for cognizable offenses; it\'s your right.',
  },
]

const quickLinks = [
  { title: 'Download Legal Forms', icon: Download, href: '/documents' },
  { title: 'Check Case Status', icon: Search, href: '/research' },
  { title: 'Find a Lawyer', icon: Users, href: '/chat' },
  { title: 'Print Guide', icon: Printer, href: '#' },
]

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-800 border-green-200',
  Intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Advanced: 'bg-red-100 text-red-800 border-red-200',
}

export default function LegalGuidesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'time'>('popular')
  const [savedGuides, setSavedGuides] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filter and sort guides
  const filteredGuides = useMemo(() => {
    let result = guides.filter(guide => {
      const matchesSearch = 
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || guide.categoryId === selectedCategory
      const matchesDifficulty = !selectedDifficulty || guide.difficulty === selectedDifficulty
      
      return matchesSearch && matchesCategory && matchesDifficulty
    })

    // Sort
    switch (sortBy) {
      case 'popular':
        result = result.sort((a, b) => b.views - a.views)
        break
      case 'newest':
        result = result.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        break
      case 'time':
        result = result.sort((a, b) => a.readTime - b.readTime)
        break
    }

    return result
  }, [searchQuery, selectedCategory, selectedDifficulty, sortBy])

  const featuredGuides = guides.filter(g => g.featured)
  const trendingGuides = guides.filter(g => g.trending).slice(0, 3)

  const toggleSave = (id: number) => {
    setSavedGuides(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  const activeCategory = categories.find(c => c.id === selectedCategory)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Enhanced with visual hierarchy */}
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
              <span className="text-foreground font-medium">Legal Guides</span>
            </nav>

            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
                <BookOpen className="w-4 h-4 mr-2" />
                24 Comprehensive Guides
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Legal Guides
                <span className="block text-2xl md:text-3xl font-normal text-muted-foreground mt-2">
                  Step-by-step guides to Pakistani law
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Practical, easy-to-understand guides written by legal experts. 
                Learn procedures, know your rights, and navigate the legal system with confidence.
              </p>

              {/* Enhanced Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search guides (e.g., 'khula', 'property registration', 'bail')..."
                      className="pl-12 pr-4 h-14 text-lg rounded-xl border-2 shadow-sm"
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
                  {['Khula', 'Property', 'Bail', 'FIR', 'Business'].map((tag) => (
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
                { label: 'Total Guides', value: '24+' },
                { label: 'Categories', value: '6' },
                { label: 'Monthly Readers', value: '50K+' },
                { label: 'Last Updated', value: 'Today' },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 rounded-xl bg-background/50 backdrop-blur-sm border">
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trending Section - Horizontal Scroll */}
        {!searchQuery && selectedCategory === 'all' && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Trending Now</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {trendingGuides.map((guide) => (
                <Card key={guide.id} className="group hover:shadow-lg transition-all border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">{guide.category}</Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {(guide.views / 1000).toFixed(1)}k
                      </div>
                    </div>
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-2">
                      <Link to={`/legal-guides/${guide.id}`}>{guide.title}</Link>
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{guide.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Categories - Enhanced Cards */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Browse by Category</h2>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {(selectedDifficulty) && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">!</Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Guides</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Difficulty Level</h4>
                    <div className="space-y-2">
                      {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                        <label key={level} className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted transition-colors">
                          <input
                            type="radio"
                            name="difficulty"
                            checked={selectedDifficulty === level}
                            onChange={() => setSelectedDifficulty(selectedDifficulty === level ? null : level)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">{level}</span>
                          <Badge variant="outline" className={cn("ml-auto text-xs", difficultyColors[level as keyof typeof difficultyColors])}>
                            {level}
                          </Badge>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">Quick Links</h4>
                    <div className="space-y-2">
                      {quickLinks.map((link) => (
                        <Link
                          key={link.title}
                          to={link.href}
                          className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                        >
                          <link.icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{link.title}</span>
                          <ArrowUpRight className="h-4 w-4 ml-auto text-muted-foreground" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "relative p-4 rounded-xl border-2 transition-all text-left group overflow-hidden",
                  selectedCategory === cat.id 
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                    : 'border-border hover:border-primary/50 hover:shadow-md'
                )}
              >
                {selectedCategory === cat.id && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full -mr-8 -mt-8" />
                )}
                <cat.icon className={cn(
                  "h-6 w-6 mb-3 transition-colors",
                  selectedCategory === cat.id ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                )} />
                <div className="font-medium text-sm">{cat.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{cat.count} guides</div>
              </button>
            ))}
          </div>

          {/* Category Description */}
          {activeCategory && activeCategory.id !== 'all' && (
            <div className="mt-4 p-4 rounded-lg bg-muted/50 flex items-center gap-3">
              <activeCategory.icon className="h-5 w-5 text-primary" />
              <div>
                <span className="font-medium">{activeCategory.name}:</span>
                <span className="text-muted-foreground ml-2">{activeCategory.description}</span>
              </div>
            </div>
          )}
        </div>

        {/* Featured Guides - Large Cards */}
        {!searchQuery && selectedCategory === 'all' && !selectedDifficulty && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Featured Guides</h2>
                <p className="text-muted-foreground text-sm mt-1">Hand-picked comprehensive resources</p>
              </div>
              <Badge variant="outline" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Expert Verified
              </Badge>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {featuredGuides.map((guide) => (
                <Card key={guide.id} className="group hover:shadow-xl transition-all overflow-hidden border-0 shadow-lg">
                  <div className="flex flex-col h-full">
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                            {guide.category}
                          </Badge>
                          <Badge variant="outline" className={cn("text-xs", difficultyColors[guide.difficulty as keyof typeof difficultyColors])}>
                            {guide.difficulty}
                          </Badge>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => toggleSave(guide.id)}
                                className="p-2 hover:bg-muted rounded-full transition-colors"
                              >
                                <Bookmark className={cn(
                                  "h-5 w-5 transition-colors",
                                  savedGuides.includes(guide.id) ? 'fill-primary text-primary' : 'text-muted-foreground'
                                )} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{savedGuides.includes(guide.id) ? 'Remove from saved' : 'Save for later'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors">
                        <Link to={`/legal-guides/${guide.id}`} className="hover:underline">
                          {guide.title}
                        </Link>
                      </CardTitle>
                      
                      <CardDescription className="text-base mb-4 line-clamp-2">
                        {guide.description}
                      </CardDescription>

                      {/* Steps Preview */}
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          Key Steps:
                        </p>
                        <ol className="space-y-1">
                          {guide.steps.slice(0, 3).map((step, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary font-medium">{idx + 1}.</span>
                              {step}
                            </li>
                          ))}
                          {guide.steps.length > 3 && (
                            <li className="text-sm text-primary">+{guide.steps.length - 3} more steps</li>
                          )}
                        </ol>
                      </div>

                      {/* Key Takeaway */}
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <Lightbulb className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">Key Takeaway: </span>
                          {guide.keyTakeaway}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 py-4 border-t bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {guide.readTime} min read
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {(guide.views / 1000).toFixed(1)}k views
                          </span>
                        </div>
                        <Link 
                          to={`/legal-guides/${guide.id}`}
                          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                        >
                          Read Guide <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Guides Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold">
                {searchQuery ? `Results for "${searchQuery}"` : 
                 selectedCategory !== 'all' ? `${activeCategory?.name} Guides` : 
                 'All Legal Guides'}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {filteredGuides.length} guide{filteredGuides.length !== 1 ? 's' : ''} available
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-background border rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Recently Updated</option>
                  <option value="time">Shortest Read</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  )}
                >
                  <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                    <div className="bg-current rounded-sm" />
                    <div className="bg-current rounded-sm" />
                    <div className="bg-current rounded-sm" />
                    <div className="bg-current rounded-sm" />
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  )}
                >
                  <div className="flex flex-col gap-0.5 w-4 h-4">
                    <div className="bg-current h-0.5 rounded-full" />
                    <div className="bg-current h-0.5 rounded-full" />
                    <div className="bg-current h-0.5 rounded-full" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedDifficulty || selectedCategory !== 'all') && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {activeCategory?.name}
                  <button onClick={() => setSelectedCategory('all')} className="hover:bg-muted rounded-full p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedDifficulty && (
                <Badge variant="secondary" className="gap-1">
                  {selectedDifficulty}
                  <button onClick={() => setSelectedDifficulty(null)} className="hover:bg-muted rounded-full p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <button 
                onClick={() => { setSelectedCategory('all'); setSelectedDifficulty(null); }}
                className="text-sm text-primary hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Guides Grid/List */}
          <div className={cn(
            viewMode === 'grid' 
              ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          )}>
            {filteredGuides.map((guide) => (
              <Card 
                key={guide.id} 
                className={cn(
                  "group hover:shadow-lg transition-all",
                  viewMode === 'list' && "flex flex-row items-center gap-4 p-4"
                )}
              >
                <CardHeader className={cn("pb-3", viewMode === 'list' && "p-0 flex-1")}>
                  <div className={cn(
                    "flex items-start justify-between mb-2",
                    viewMode === 'list' && "flex-col sm:flex-row sm:items-center gap-2"
                  )}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary">{guide.category}</Badge>
                      <Badge variant="outline" className={cn("text-xs", difficultyColors[guide.difficulty as keyof typeof difficultyColors])}>
                        {guide.difficulty}
                      </Badge>
                      {guide.trending && (
                        <Badge variant="outline" className="text-xs gap-1 text-orange-600 border-orange-200 bg-orange-50">
                          <TrendingUp className="h-3 w-3" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    {viewMode === 'grid' && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => toggleSave(guide.id)}
                              className="p-1.5 hover:bg-muted rounded-full transition-colors"
                            >
                              <Bookmark className={cn(
                                "h-4 w-4 transition-colors",
                                savedGuides.includes(guide.id) ? 'fill-primary text-primary' : 'text-muted-foreground'
                              )} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{savedGuides.includes(guide.id) ? 'Saved' : 'Save guide'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  
                  <CardTitle className={cn(
                    "leading-tight group-hover:text-primary transition-colors",
                    viewMode === 'list' ? "text-base" : "text-lg"
                  )}>
                    <Link to={`/legal-guides/${guide.id}`} className="hover:underline">
                      {guide.title}
                    </Link>
                  </CardTitle>
                </CardHeader>

                {viewMode === 'grid' && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {guide.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {guide.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {guide.readTime} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {(guide.views / 1000).toFixed(1)}k
                      </span>
                      <span>Updated {new Date(guide.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </CardContent>
                )}

                {viewMode === 'list' && (
                  <>
                    <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {guide.readTime} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {(guide.views / 1000).toFixed(1)}k
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0" asChild>
                      <Link to={`/legal-guides/${guide.id}`}>
                        Read <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </>
                )}
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredGuides.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No guides found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We couldn't find any guides matching your criteria. Try adjusting your search or filters.
              </p>
              <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedDifficulty(null); }}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: "Are these guides legally binding?",
                a: "No, these guides are for informational purposes only. They provide general guidance on legal procedures but do not constitute legal advice. Always consult a qualified advocate for your specific situation."
              },
              {
                q: "How often are the guides updated?",
                a: "Our legal team reviews and updates guides regularly, typically when there are changes in laws or procedures. Each guide shows its last updated date at the top."
              },
              {
                q: "Can I download or print these guides?",
                a: "Yes, most guides offer a printer-friendly version. Look for the print icon in the guide toolbar. You can also save guides to your account for offline reading."
              },
              {
                q: "What if I need personalized legal advice?",
                a: "While these guides cover general procedures, every case is unique. Use our AI Legal Assistant or consult an advocate through our platform for advice tailored to your specific circumstances."
              },
            ].map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA Section - Enhanced */}
        <div className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 md:p-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold mb-3">Can't find what you need?</h2>
              <p className="text-primary-foreground/90 text-lg max-w-xl">
                Get personalized legal guidance from our AI assistant. Ask any question about Pakistani law and receive accurate, cited answers instantly.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" variant="secondary" className="gap-2">
                <Link to="/chat">
                  Ask AI Assistant <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/documents">
                  Browse Documents
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}