import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
  Scale, 
  Users, 
  GraduationCap, 
  FileCheck, 
  Building,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Search,
  ChevronRight,
  Info,
  AlertCircle,
  CheckCircle2,
  Clock,
  Globe,
  Bookmark,
  X,
  Filter,
  Grid3X3,
  List,
  Copy,
  Check,
  ArrowRight,
  Shield,
  GraduationCap as EducationIcon,
  PhoneCall,
  HelpCircle
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

// Enhanced data structure with metadata and stats
const barCouncils = [
  {
    id: 1,
    name: 'Pakistan Bar Council',
    shortName: 'PBC',
    type: 'Federal',
    tier: 'supreme',
    address: 'Room 318-320, 3rd Floor, Block H, FGEHF, G-8/1, Islamabad',
    phone: '+92-51-9106541',
    fax: '+92-51-9106542',
    email: 'pbc@pakistanbarcouncil.org',
    website: 'www.pakistanbarcouncil.org',
    established: '1973',
    president: 'Mr. Muhammad Farooq Awan',
    vicePresident: 'Mr. Haroon ur Rashid',
    members: 'Representatives from all Provincial Bar Councils',
    memberCount: 25,
    functions: ['Regulation of legal profession', 'Enrollment of advocates', 'Disciplinary matters', 'Legal education standards', 'International representation'],
    stats: { enrolled: '95,000+', annualExams: '12,000+', disciplinary: '150+' },
    color: 'bg-amber-500',
  },
  {
    id: 2,
    name: 'Punjab Bar Council',
    shortName: 'PbBC',
    type: 'Provincial',
    tier: 'provincial',
    province: 'Punjab',
    address: 'Bar Council Building, Lower Mall, Lahore 54000',
    phone: '+92-42-99211142',
    fax: '+92-42-99211143',
    email: 'info@punjabbarcouncil.com',
    website: 'www.punjabbarcouncil.com',
    established: '1973',
    president: 'Elected annually',
    vicePresident: 'Elected annually',
    members: '75 elected members from across Punjab',
    memberCount: 75,
    functions: ['Enrollment of advocates in Punjab', 'Conducting bar elections', 'Disciplinary proceedings', 'Welfare of advocates', 'Continuing legal education'],
    stats: { enrolled: '45,000+', annualExams: '6,000+', districts: '36' },
    color: 'bg-emerald-500',
  },
  {
    id: 3,
    name: 'Sindh Bar Council',
    shortName: 'SBC',
    type: 'Provincial',
    tier: 'provincial',
    province: 'Sindh',
    address: 'Sindh High Court Building, Karachi',
    phone: '+92-21-99232151',
    fax: '+92-21-99232152',
    email: 'sindhbarcouncil@gmail.com',
    website: 'www.sindhbarcouncil.org',
    established: '1973',
    president: 'Elected annually',
    vicePresident: 'Elected annually',
    members: 'Representatives from district bars in Sindh',
    memberCount: 60,
    functions: ['Enrollment of advocates in Sindh', 'Regulation of legal practice', 'Continuing legal education', 'Advocates welfare', 'Legal aid services'],
    stats: { enrolled: '32,000+', annualExams: '4,000+', districts: '29' },
    color: 'bg-blue-500',
  },
  {
    id: 4,
    name: 'Khyber Pakhtunkhwa Bar Council',
    shortName: 'KPBC',
    type: 'Provincial',
    tier: 'provincial',
    province: 'KPK',
    address: 'Peshawar High Court Premises, Peshawar',
    phone: '+92-91-9210525',
    fax: '+92-91-9210526',
    email: 'kpkbarcouncil@gmail.com',
    website: 'www.kpkbarcouncil.gov.pk',
    established: '1973',
    president: 'Elected annually',
    vicePresident: 'Elected annually',
    members: 'Members from district bars in KPK',
    memberCount: 45,
    functions: ['Enrollment and regulation', 'Disciplinary control', 'Professional standards', 'Welfare activities', 'Training programs'],
    stats: { enrolled: '12,000+', annualExams: '1,500+', districts: '25' },
    color: 'bg-purple-500',
  },
  {
    id: 5,
    name: 'Balochistan Bar Council',
    shortName: 'BBC',
    type: 'Provincial',
    tier: 'provincial',
    province: 'Balochistan',
    address: 'High Court Building, Quetta',
    phone: '+92-81-9202231',
    fax: '+92-81-9202232',
    email: 'balochistanbar@gmail.com',
    website: 'www.balochistanbarcouncil.com',
    established: '1973',
    president: 'Elected annually',
    vicePresident: 'Elected annually',
    members: 'Representatives from district bars',
    memberCount: 30,
    functions: ['Advocates enrollment', 'Professional conduct', 'Legal aid', 'Bar elections', 'Regional development'],
    stats: { enrolled: '3,500+', annualExams: '400+', districts: '32' },
    color: 'bg-rose-500',
  },
  {
    id: 6,
    name: 'Islamabad Bar Council',
    shortName: 'IBC',
    type: 'Territorial',
    tier: 'territorial',
    province: 'Islamabad',
    address: 'District Courts Complex, Islamabad',
    phone: '+92-51-9106541',
    fax: '+92-51-9106542',
    email: 'islamabadbar@gmail.com',
    website: 'www.islamabadbarcouncil.com',
    established: '1973',
    president: 'Elected annually',
    vicePresident: 'Elected annually',
    members: 'Members from Islamabad district bars',
    memberCount: 20,
    functions: ['ICT advocates enrollment', 'Regulation of practice', 'Disciplinary matters', 'Professional development', 'Islamabad specific matters'],
    stats: { enrolled: '8,000+', annualExams: '1,200+', districts: '1' },
    color: 'bg-cyan-500',
  },
]

const enrollmentSteps = [
  {
    step: 1,
    title: 'Law Degree',
    description: 'Complete LL.B (5 years) or LL.B (2 years after graduation) from a recognized university with minimum 50% marks',
    duration: '5 years',
    icon: GraduationCap,
    details: ['HEC recognized university', 'Minimum 50% aggregate', 'Internship during final year'],
  },
  {
    step: 2,
    title: 'Bar Examination',
    description: 'Pass the Bar Examination conducted by the Pakistan Bar Council with at least 50% marks',
    duration: '3 months prep',
    icon: FileCheck,
    details: ['Multiple choice questions', 'Viva voce examination', 'Conducted twice yearly'],
  },
  {
    step: 3,
    title: 'Pupillage',
    description: 'Complete 6 months practical training under a senior advocate with 10+ years experience',
    duration: '6 months',
    icon: Users,
    details: ['Senior advocate with 10+ years', 'Daily court attendance', 'Case file maintenance'],
  },
  {
    step: 4,
    title: 'Enrollment Application',
    description: 'Submit application with required documents, fees, and certificates to respective Bar Council',
    duration: '2-3 months',
    icon: Scale,
    details: ['Character certificate', 'Pupillage certificate', 'Enrollment fee submission'],
  },
]

const verificationSteps = [
  {
    step: 1,
    title: 'Visit Official Website',
    description: 'Navigate to the official Bar Council website and locate the "Verify Advocate" section',
  },
  {
    step: 2,
    title: 'Enter Details',
    description: 'Input the enrollment number (format: PBC/12345) or CNIC number (without dashes)',
  },
  {
    step: 3,
    title: 'Check Status',
    description: 'Review enrollment status, validity period, and any disciplinary remarks',
  },
  {
    step: 4,
    title: 'Cross-Verify',
    description: 'For additional verification, contact the Bar Council directly using official phone numbers',
  },
]

const quickStats = [
  { label: 'Total Enrolled Advocates', value: '95,000+', icon: Users },
  { label: 'Bar Councils', value: '6', icon: Building },
  { label: 'Annual Enrollments', value: '12,000+', icon: GraduationCap },
  { label: 'District Bars', value: '150+', icon: MapPin },
]

const requiredDocuments = [
  { name: 'LL.B Degree', description: 'Attested copy from HEC recognized university', required: true },
  { name: 'Matric Certificate', description: 'Attested copy for age verification', required: true },
  { name: 'Intermediate Certificate', description: 'Attested copy showing academic record', required: true },
  { name: 'Character Certificate', description: 'From university principal/dean', required: true },
  { name: 'CNIC Copy', description: 'Valid Computerized National Identity Card', required: true },
  { name: 'Photographs', description: '4 passport size recent photos', required: true },
  { name: 'Pupillage Certificate', description: 'From supervising senior advocate', required: true },
  { name: 'Bar Exam Certificate', description: 'Passing certificate from PBC', required: true },
  { name: 'Domicile Certificate', description: 'Proof of residence in relevant province', required: false },
  { name: 'Fee Challan', description: 'Paid enrollment fee receipt', required: true },
]

const faqs = [
  {
    question: 'What is the difference between Advocate and Lawyer?',
    answer: 'In Pakistan, "Lawyer" is a general term for anyone with a law degree. "Advocate" specifically refers to a lawyer who has passed the Bar Examination, completed pupillage, and is enrolled with a Bar Council, giving them the right to practice in courts.',
  },
  {
    question: 'How long does the enrollment process take?',
    answer: 'The complete process typically takes 6-8 months after obtaining your law degree. This includes 3 months for Bar Exam preparation, 3-6 months waiting for results, 6 months of pupillage, and 2-3 months for application processing.',
  },
  {
    question: 'Can I practice in any province after enrollment?',
    answer: 'No. You must enroll with the specific Provincial Bar Council where you intend to practice primarily. However, enrolled advocates can appear in any court across Pakistan, but voting rights and bar membership are province-specific.',
  },
  {
    question: 'What happens if I fail the Bar Examination?',
    answer: 'You can reappear in the next examination. There is no limit on attempts, but you must pay the examination fee each time. Many candidates pass on their second or third attempt.',
  },
  {
    question: 'Is pupillage mandatory for all candidates?',
    answer: 'Yes, 6 months of pupillage under a senior advocate with at least 10 years of standing is mandatory for all candidates seeking enrollment. This cannot be waived.',
  },
]

const councilTypes = [
  { id: 'all', name: 'All Councils', icon: Building },
  { id: 'Federal', name: 'Federal', icon: Scale },
  { id: 'Provincial', name: 'Provincial', icon: MapPin },
  { id: 'Territorial', name: 'Territorial', icon: Shield },
]

export default function BarCouncilPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [savedCouncils, setSavedCouncils] = useState<number[]>([])
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('councils')

  // Enhanced filtering logic
  const filteredCouncils = useMemo(() => {
    return barCouncils.filter(council => {
      const matchesSearch = 
        council.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        council.province?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        council.shortName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = selectedType === 'all' || council.type === selectedType
      return matchesSearch && matchesType
    })
  }, [searchQuery, selectedType])

  const toggleSave = (id: number) => {
    setSavedCouncils(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
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

  const activeCouncilType = councilTypes.find(t => t.id === selectedType)

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
              <span className="text-foreground font-medium">Bar Councils</span>
            </nav>

            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
                <Scale className="w-4 h-4 mr-2" />
                Legal Profession Regulation
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Bar Council Directory
                <span className="block text-2xl md:text-3xl font-normal text-muted-foreground mt-2">
                  Enrollment, verification & professional standards
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Comprehensive information about Pakistan's Bar Councils. Verify advocates, 
                understand enrollment procedures, and access professional resources.
              </p>

              {/* Enhanced Search */}
              <div className="relative max-w-2xl mx-auto">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by name, province, or code (e.g., 'Punjab', 'PBC')..."
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
                
                {/* Quick filters */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <span className="text-sm text-muted-foreground">Quick filters:</span>
                  {['Punjab', 'Sindh', 'KPK', 'Federal'].map((tag) => (
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
              {quickStats.map((stat) => (
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
        {/* Important Notice */}
        <Alert className="mb-8 border-l-4 border-l-amber-500 bg-amber-50/50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <span className="font-semibold">Important:</span> Always verify an advocate's enrollment status before engaging their services. 
            Only advocates enrolled with a Bar Council can legally practice law in Pakistan. 
            Check the "Verify Advocate" tab below for verification steps.
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <TabsList className="grid w-full md:w-auto grid-cols-3 h-12">
              <TabsTrigger value="councils" className="gap-2">
                <Building className="h-4 w-4" />
                <span className="hidden sm:inline">Bar Councils</span>
                <span className="sm:hidden">Councils</span>
              </TabsTrigger>
              <TabsTrigger value="enrollment" className="gap-2">
                <GraduationCap className="h-4 w-4" />
                <span className="hidden sm:inline">Enrollment</span>
                <span className="sm:hidden">Enroll</span>
              </TabsTrigger>
              <TabsTrigger value="verify" className="gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Verification</span>
                <span className="sm:hidden">Verify</span>
              </TabsTrigger>
            </TabsList>

            {activeTab === 'councils' && (
              <div className="flex items-center gap-3">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                      {selectedType !== 'all' && (
                        <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs flex items-center justify-center">1</Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filter Councils</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-3">Council Type</h4>
                        <div className="space-y-2">
                          {councilTypes.map((type) => (
                            <button
                              key={type.id}
                              onClick={() => setSelectedType(type.id)}
                              className={cn(
                                "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left",
                                selectedType === type.id 
                                  ? 'border-primary bg-primary/5' 
                                  : 'hover:bg-muted'
                              )}
                            >
                              <type.icon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{type.name}</span>
                              {selectedType === type.id && (
                                <CheckCircle2 className="h-4 w-4 text-primary ml-auto" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

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
            )}
          </div>

          {/* Bar Councils Tab */}
          <TabsContent value="councils" className="space-y-6">
            {/* Active Filters */}
            {selectedType !== 'all' && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-muted-foreground">Filtered by:</span>
                <Badge variant="secondary" className="gap-1">
                  {activeCouncilType?.name}
                  <button 
                    onClick={() => setSelectedType('all')}
                    className="hover:bg-muted rounded-full p-0.5 ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
                <button 
                  onClick={() => { setSelectedType('all'); setSearchQuery(''); }}
                  className="text-sm text-primary hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Councils Grid/List */}
            <div className={cn(
              viewMode === 'grid' 
                ? 'grid md:grid-cols-2 gap-6'
                : 'space-y-4'
            )}>
              {filteredCouncils.map((council) => (
                <Card 
                  key={council.id} 
                  className={cn(
                    "group hover:shadow-xl transition-all overflow-hidden border-l-4",
                    viewMode === 'list' && "flex flex-row items-center p-4",
                    council.tier === 'supreme' ? "border-l-amber-500" :
                    council.tier === 'provincial' ? "border-l-emerald-500" : "border-l-cyan-500"
                  )}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge 
                                variant={council.type === 'Federal' ? 'default' : 'secondary'}
                                className="font-medium"
                              >
                                {council.type}
                              </Badge>
                              {council.tier === 'supreme' && (
                                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                                  Supreme Body
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                              {council.name}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" />
                              {council.province || 'Federal Capital'} • Est. {council.established}
                            </CardDescription>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => toggleSave(council.id)}
                                  className="p-2 hover:bg-muted rounded-full transition-colors"
                                >
                                  <Bookmark className={cn(
                                    "h-5 w-5 transition-colors",
                                    savedCouncils.includes(council.id) ? 'fill-primary text-primary' : 'text-muted-foreground'
                                  )} />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{savedCouncils.includes(council.id) ? 'Remove from saved' : 'Save for later'}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-muted/50">
                          <div className="text-center">
                            <div className="text-lg font-bold text-primary">{council.stats.enrolled}</div>
                            <div className="text-xs text-muted-foreground">Enrolled</div>
                          </div>
                          <div className="text-center border-x">
                            <div className="text-lg font-bold text-primary">{council.stats.annualExams}</div>
                            <div className="text-xs text-muted-foreground">Annual Exams</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-primary">{council.memberCount}</div>
                            <div className="text-xs text-muted-foreground">Council Members</div>
                          </div>
                        </div>

                        {/* Contact Info with Copy */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2 group/item">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            <span className="flex-1">{council.address}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 group/item">
                            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="flex-1">{council.phone}</span>
                            <button
                              onClick={() => copyToClipboard(council.phone, `phone-${council.id}`)}
                              className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-muted rounded transition-all"
                              title="Copy phone"
                            >
                              {copiedText === `phone-${council.id}` ? (
                                <Check className="h-3 w-3 text-green-500" />
                              ) : (
                                <Copy className="h-3 w-3 text-muted-foreground" />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center gap-2 group/item">
                            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                            <a href={`mailto:${council.email}`} className="flex-1 text-primary hover:underline truncate">
                              {council.email}
                            </a>
                            <button
                              onClick={() => copyToClipboard(council.email, `email-${council.id}`)}
                              className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-muted rounded transition-all"
                              title="Copy email"
                            >
                              {copiedText === `email-${council.id}` ? (
                                <Check className="h-3 w-3 text-green-500" />
                              ) : (
                                <Copy className="h-3 w-3 text-muted-foreground" />
                              )}
                            </button>
                          </div>

                          {council.website && council.website !== '-' && (
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                              <a 
                                href={`https://${council.website}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex-1 text-primary hover:underline flex items-center gap-1"
                              >
                                {council.website}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Leadership */}
                        <div className="pt-3 border-t space-y-1">
                          <p className="text-xs">
                            <span className="font-medium">President:</span>{' '}
                            <span className="text-muted-foreground">{council.president}</span>
                          </p>
                          <p className="text-xs">
                            <span className="font-medium">Vice President:</span>{' '}
                            <span className="text-muted-foreground">{council.vicePresident}</span>
                          </p>
                        </div>

                        {/* Functions */}
                        <div className="pt-2">
                          <div className="flex flex-wrap gap-1">
                            {council.functions.slice(0, 3).map((func, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs font-normal">
                                {func}
                              </Badge>
                            ))}
                            {council.functions.length > 3 && (
                              <Badge variant="outline" className="text-xs font-normal">
                                +{council.functions.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-0">
                        <Button variant="ghost" size="sm" className="w-full" asChild>
                          <a 
                            href={council.website !== '-' ? `https://${council.website}` : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2"
                          >
                            Visit Official Website
                            <ArrowRight className="h-4 w-4" />
                          </a>
                        </Button>
                      </CardFooter>
                    </>
                  ) : (
                    /* List View */
                    <>
                      <div className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 mr-4",
                        council.color, "text-white"
                      )}>
                        <span className="text-lg font-bold">{council.shortName}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={council.type === 'Federal' ? 'default' : 'secondary'} className="text-xs">
                            {council.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{council.province || 'Federal'}</span>
                        </div>
                        <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                          {council.name}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">{council.address}</p>
                      </div>
                      <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground ml-4">
                        <div className="text-center">
                          <div className="font-semibold text-foreground">{council.stats.enrolled}</div>
                          <div className="text-xs">Enrolled</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <PhoneCall className="h-4 w-4" />
                          <span className="hidden lg:inline">{council.phone}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => toggleSave(council.id)}
                                className="p-2 hover:bg-muted rounded-full transition-colors"
                              >
                                <Bookmark className={cn(
                                  "h-4 w-4 transition-colors",
                                  savedCouncils.includes(council.id) ? 'fill-primary text-primary' : 'text-muted-foreground'
                                )} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{savedCouncils.includes(council.id) ? 'Saved' : 'Save'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={council.website !== '-' ? `https://${council.website}` : '#'} target="_blank" rel="noopener noreferrer">
                            Visit
                          </a>
                        </Button>
                      </div>
                    </>
                  )}
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredCouncils.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Bar Councils found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn't find any Bar Councils matching your search criteria. Try adjusting your filters.
                </p>
                <Button onClick={() => { setSearchQuery(''); setSelectedType('all'); }}>
                  Clear all filters
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Enrollment Process Tab */}
          <TabsContent value="enrollment" className="space-y-8">
            {/* Process Steps - Visual Timeline */}
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                {enrollmentSteps.map((item, index) => (
                  <div key={item.step} className="relative">
                    <Card className="h-full border-t-4 border-t-primary hover:shadow-lg transition-all">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 relative">
                            <item.icon className="h-8 w-8 text-primary" />
                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                              {item.step}
                            </div>
                          </div>
                          <Badge variant="outline" className="mb-2 text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {item.duration}
                          </Badge>
                          <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                          <ul className="text-left w-full space-y-1">
                            {item.details.map((detail, idx) => (
                              <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                                <CheckCircle2 className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                    {/* Connector Line */}
                    {index < enrollmentSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border">
                        <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-border" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Required Documents */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-primary" />
                      Required Documents Checklist
                    </CardTitle>
                    <CardDescription>
                      Ensure you have all required documents before applying for enrollment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {requiredDocuments.map((doc, index) => (
                        <div 
                          key={index} 
                          className={cn(
                            "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                            doc.required ? "bg-background" : "bg-muted/30 border-dashed"
                          )}
                        >
                          <div className={cn(
                            "w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5",
                            doc.required ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          )}>
                            {doc.required ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <span className="text-xs">?</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{doc.name}</span>
                              {doc.required && (
                                <Badge variant="destructive" className="text-[10px] h-4 px-1">Required</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{doc.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* FAQ Section */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-primary" />
                      Frequently Asked Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left text-sm hover:no-underline">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground text-sm">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>

              {/* Fees & Timeline */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Enrollment Fees</CardTitle>
                    <CardDescription>Approximate fee structure (subject to change)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {[
                        { label: 'Application Fee', amount: 'PKR 5,000 - 10,000', note: 'Non-refundable' },
                        { label: 'Enrollment Fee', amount: 'PKR 15,000 - 25,000', note: 'One-time' },
                        { label: 'Identity Card', amount: 'PKR 1,000 - 2,000', note: 'With photo' },
                        { label: 'Annual Subscription', amount: 'PKR 2,000 - 5,000', note: 'Per year' },
                      ].map((fee, idx) => (
                        <div key={idx} className="flex justify-between items-start py-2 border-b last:border-0">
                          <div>
                            <p className="font-medium text-sm">{fee.label}</p>
                            <p className="text-xs text-muted-foreground">{fee.note}</p>
                          </div>
                          <span className="text-sm font-semibold text-primary">{fee.amount}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-xs text-amber-800">
                        <Info className="h-3 w-3 inline mr-1" />
                        Fees vary by province. Contact respective Bar Council for exact amounts.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Important Dates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="flex-1">Bar Exam: Held twice yearly (Jan & July)</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="flex-1">Results: Usually within 3 months</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="flex-1">Enrollment: Open year-round</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="flex-1">Card Issuance: 4-6 weeks after enrollment</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <EducationIcon className="h-5 w-5 text-primary" />
                      Need Help?
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Contact your nearest Bar Council office for guidance on the enrollment process.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/chat">
                        Chat with AI Assistant
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Verification Tab */}
          <TabsContent value="verify" className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      How to Verify an Advocate
                    </CardTitle>
                    <CardDescription>
                      Follow these steps to confirm an advocate's enrollment status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {verificationSteps.map((step, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                              {step.step}
                            </div>
                            {index < verificationSteps.length - 1 && (
                              <div className="w-0.5 h-full bg-border my-2" />
                            )}
                          </div>
                          <div className="pb-6">
                            <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Alert className="mt-4 bg-red-50 border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800 text-sm">
                        <span className="font-semibold">Warning:</span> Practicing law without enrollment is illegal 
                        under the Legal Practitioners and Bar Councils Act, 1973, punishable by fine and imprisonment.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Red Flags to Watch For</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {[
                        'Refuses to provide enrollment number',
                        'Enrollment number not found in official records',
                        'Charges unusually low fees',
                        'No physical office or bar association membership',
                        'Reluctant to sign official documents',
                        'Asks for cash payments without receipts'
                      ].map((flag, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Verification Links</CardTitle>
                    <CardDescription>
                      Direct links to official verification portals
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {barCouncils.filter(c => c.website !== '-').map((council) => (
                      <Button
                        key={council.id}
                        variant="outline"
                        className="w-full justify-between h-auto py-3 px-4 group"
                        asChild
                      >
                        <a 
                          href={`https://${council.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="text-left">
                            <div className="font-medium text-sm group-hover:text-primary transition-colors">
                              {council.shortName} Verification
                            </div>
                            <div className="text-xs text-muted-foreground font-normal">
                              {council.name}
                            </div>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </a>
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                      <div>
                        <h4 className="font-semibold text-emerald-900 mb-1">Valid Enrollment Indicators</h4>
                        <ul className="text-sm text-emerald-800 space-y-1">
                          <li>• Valid enrollment number (format: PBC/12345)</li>
                          <li>• Photo ID card from Bar Council</li>
                          <li>• Name appears in official online directory</li>
                          <li>• Membership in local Bar Association</li>
                          <li>• Regular payment of annual subscription</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Report Fraud</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      If you suspect someone is practicing law without enrollment, report to the 
                      nearest Bar Council or police station immediately.
                    </p>
                    <Button variant="destructive" className="w-full" asChild>
                      <Link to="/chat">
                        Report Illegal Practice
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom CTA */}
        <div className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 md:p-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold mb-3">Starting Your Legal Career?</h2>
              <p className="text-primary-foreground/90 text-lg max-w-xl">
                Get personalized guidance on enrollment procedures, exam preparation, and career advice 
                from our AI legal assistant.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" variant="secondary" className="gap-2">
                <Link to="/chat">
                  Get Career Guidance <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/legal-guides">
                  Browse Legal Guides
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}