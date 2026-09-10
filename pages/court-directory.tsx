import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Globe, 
  Search,
  ExternalLink,
  ChevronRight,
  Filter,
  X,
  Info,
  CheckCircle2,
  Gavel,
  Scale,
  Shield,
  Users,
  ArrowRight,
  Bookmark,
  FileText,
  Landmark,
  ChevronDown} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

// Comprehensive Pakistan Court System Data
const courtTypes = [
  { id: 'all', name: 'All Courts', icon: Building2 },
  { id: 'supreme', name: 'Supreme Court', icon: Scale },
  { id: 'high', name: 'High Courts', icon: Gavel },
  { id: 'federal', name: 'Federal Shariat', icon: Shield },
  { id: 'special', name: 'Special Courts', icon: Landmark },
  { id: 'district', name: 'District Courts', icon: Users },
]

const provinces = [
  { id: 'all', name: 'All Pakistan', short: 'All' },
  { id: 'islamabad', name: 'Islamabad Capital Territory', short: 'ICT' },
  { id: 'punjab', name: 'Punjab', short: 'Punjab' },
  { id: 'sindh', name: 'Sindh', short: 'Sindh' },
  { id: 'kpk', name: 'Khyber Pakhtunkhwa', short: 'KPK' },
  { id: 'balochistan', name: 'Balochistan', short: 'Balochistan' },
]

const courts = [
  // Supreme Court
  {
    id: 1,
    name: 'Supreme Court of Pakistan',
    type: 'Supreme Court',
    typeId: 'supreme',
    province: 'islamabad',
    city: 'Islamabad',
    address: 'Constitution Avenue, G-5/2, Islamabad',
    phone: '+92-51-9220581-90',
    fax: '+92-51-9220458',
    website: 'www.supremecourt.gov.pk',
    email: 'registrar@supremecourt.gov.pk',
    hours: '9:00 AM - 4:00 PM (Mon-Thu)',
    jurisdiction: 'Constitutional matters, appeals from High Courts, inter-governmental disputes',
    judges: 'Chief Justice + 16 Judges',
    established: '1956',
    circuitCourts: ['Lahore', 'Karachi', 'Peshawar', 'Quetta'],
    functions: ['Original jurisdiction in inter-govt disputes', 'Appellate jurisdiction', 'Advisory jurisdiction', 'Fundamental rights enforcement'],
    appealsTo: 'Final Court of Appeal',
    appealsFrom: 'High Courts, Federal Shariat Court',
  },
  // High Courts
  {
    id: 2,
    name: 'Lahore High Court',
    type: 'High Court',
    typeId: 'high',
    province: 'punjab',
    city: 'Lahore',
    address: 'Shahrah-e-Quaid-e-Azam, Lahore 54000',
    phone: '+92-42-99212951-60',
    fax: '+92-42-99213008',
    website: 'www.lhc.gov.pk',
    email: 'registrar@lhc.gov.pk',
    hours: '9:00 AM - 4:00 PM (Mon-Thu)',
    jurisdiction: 'Original & appellate jurisdiction for Punjab Province',
    judges: 'Chief Justice + 60 Judges (sanctioned strength)',
    established: '1919',
    benches: ['Lahore', 'Rawalpindi', 'Multan', 'Bahawalpur'],
    functions: ['Civil appeals', 'Criminal appeals', 'Constitutional petitions', 'Supervisory jurisdiction'],
    appealsTo: 'Supreme Court of Pakistan',
    appealsFrom: 'District Courts, Session Courts',
  },
  {
    id: 3,
    name: 'Sindh High Court',
    type: 'High Court',
    typeId: 'high',
    province: 'sindh',
    city: 'Karachi',
    address: 'Supreme Court Barracks, S.M. Taufiq Road, Karachi',
    phone: '+92-21-99232151-60',
    fax: '+92-21-99232150',
    website: 'www.sindhhighcourt.gov.pk',
    email: 'registrar@sindhhighcourt.gov.pk',
    hours: '9:00 AM - 4:00 PM (Mon-Thu)',
    jurisdiction: 'Original & appellate jurisdiction for Sindh Province',
    judges: 'Chief Justice + 28 Judges',
    established: '1926',
    benches: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana'],
    functions: ['Civil appeals', 'Criminal appeals', 'Constitutional petitions', 'Supervisory jurisdiction'],
    appealsTo: 'Supreme Court of Pakistan',
    appealsFrom: 'District Courts, Session Courts',
  },
  {
    id: 4,
    name: 'Peshawar High Court',
    type: 'High Court',
    typeId: 'high',
    province: 'kpk',
    city: 'Peshawar',
    address: 'Khyber Road, Peshawar Cantonment',
    phone: '+92-91-9210525-34',
    fax: '+92-91-9210535',
    website: 'www.peshawarhighcourt.gov.pk',
    email: 'registrar@peshawarhighcourt.gov.pk',
    hours: '9:00 AM - 4:00 PM (Mon-Thu)',
    jurisdiction: 'Original & appellate jurisdiction for Khyber Pakhtunkhwa',
    judges: 'Chief Justice + 20 Judges',
    established: '1931',
    benches: ['Peshawar', 'Abbottabad', 'D.I. Khan', 'Mingora', 'Bannu'],
    functions: ['Civil appeals', 'Criminal appeals', 'Constitutional petitions', 'Supervisory jurisdiction'],
    appealsTo: 'Supreme Court of Pakistan',
    appealsFrom: 'District Courts, Session Courts',
  },
  {
    id: 5,
    name: 'Balochistan High Court',
    type: 'High Court',
    typeId: 'high',
    province: 'balochistan',
    city: 'Quetta',
    address: 'High Court Road, Quetta',
    phone: '+92-81-9202231-40',
    fax: '+92-81-9202241',
    website: 'www.balochistanhighcourt.gov.pk',
    email: 'registrar@balochistanhighcourt.gov.pk',
    hours: '9:00 AM - 4:00 PM (Mon-Thu)',
    jurisdiction: 'Original & appellate jurisdiction for Balochistan Province',
    judges: 'Chief Justice + 11 Judges',
    established: '1939',
    benches: ['Quetta', 'Sibi', 'Khuzdar', 'Turbat'],
    functions: ['Civil appeals', 'Criminal appeals', 'Constitutional petitions', 'Supervisory jurisdiction'],
    appealsTo: 'Supreme Court of Pakistan',
    appealsFrom: 'District Courts, Session Courts',
  },
  {
    id: 6,
    name: 'Islamabad High Court',
    type: 'High Court',
    typeId: 'high',
    province: 'islamabad',
    city: 'Islamabad',
    address: 'G-10/4, Islamabad',
    phone: '+92-51-9289641-50',
    fax: '+92-51-9289651',
    website: 'www.ihc.gov.pk',
    email: 'registrar@ihc.gov.pk',
    hours: '9:00 AM - 4:00 PM (Mon-Thu)',
    jurisdiction: 'Original & appellate jurisdiction for Islamabad Capital Territory',
    judges: 'Chief Justice + 6 Judges',
    established: '2010',
    benches: ['Islamabad'],
    functions: ['Civil appeals', 'Criminal appeals', 'Constitutional petitions', 'Supervisory jurisdiction'],
    appealsTo: 'Supreme Court of Pakistan',
    appealsFrom: 'District Courts, Session Courts',
  },
  // Federal Shariat Court
  {
    id: 7,
    name: 'Federal Shariat Court',
    type: 'Federal Shariat Court',
    typeId: 'federal',
    province: 'islamabad',
    city: 'Islamabad',
    address: 'Constitution Avenue, Islamabad',
    phone: '+92-51-9204421-30',
    fax: '+92-51-9204431',
    website: 'www.federalshariatcourt.gov.pk',
    email: 'registrar@federalshariatcourt.gov.pk',
    hours: '9:00 AM - 4:00 PM (Mon-Thu)',
    jurisdiction: 'Sharia matters, Riba cases, Hudood laws',
    judges: 'Chief Justice + 8 Judges (3 Ulema required)',
    established: '1980',
    functions: ['Examine laws repugnant to Islam', 'Hear appeals in Hudood cases', 'Revisional jurisdiction'],
    appealsTo: 'Shariat Appellate Bench of Supreme Court',
    appealsFrom: 'Criminal Courts (Hudood cases)',
  },
  // Special Courts
  {
    id: 8,
    name: 'Federal Service Tribunal',
    type: 'Special Court',
    typeId: 'special',
    province: 'islamabad',
    city: 'Islamabad',
    address: 'FST Building, Islamabad',
    phone: '+92-51-9260421',
    website: '-',
    hours: '9:00 AM - 4:00 PM (Mon-Thu)',
    jurisdiction: 'Service matters of federal government employees',
    judges: 'Chairman + Members',
    functions: ['Service appeals', 'Terms and conditions disputes'],
    appealsTo: 'Supreme Court of Pakistan',
  },
  {
    id: 9,
    name: 'Anti-Terrorism Court (Islamabad)',
    type: 'Special Court',
    typeId: 'special',
    province: 'islamabad',
    city: 'Islamabad',
    address: 'District Courts Complex, Islamabad',
    phone: '+92-51-9257855',
    hours: '9:00 AM - 4:00 PM (Mon-Thu)',
    jurisdiction: 'Terrorism-related cases',
    judges: 'Judge ATC',
    functions: ['Speedy trial of terrorism cases'],
    appealsTo: 'High Court',
  },
  // District Courts - Sample major districts
  {
    id: 10,
    name: 'District & Sessions Court Lahore',
    type: 'District Court',
    typeId: 'district',
    province: 'punjab',
    city: 'Lahore',
    address: 'District Courts Complex, Qila Lachman Singh, Lahore',
    phone: '+92-42-99210272',
    website: '-',
    hours: '8:00 AM - 3:00 PM (Mon-Sat)',
    jurisdiction: 'Civil & criminal cases at district level',
    judges: 'District & Sessions Judge + Additional Judges',
    functions: ['Civil suits', 'Criminal trials', 'Appeals from Magistrates'],
    appealsTo: 'Lahore High Court',
  },
  {
    id: 11,
    name: 'District & Sessions Court Karachi (South)',
    type: 'District Court',
    typeId: 'district',
    province: 'sindh',
    city: 'Karachi',
    address: 'City Courts, M.A. Jinnah Road, Karachi',
    phone: '+92-21-99217001',
    website: '-',
    hours: '8:30 AM - 3:30 PM (Mon-Sat)',
    jurisdiction: 'Civil & criminal cases for South Karachi',
    judges: 'District & Sessions Judge + Staff',
    functions: ['Civil suits', 'Criminal trials', 'Appeals from Magistrates'],
    appealsTo: 'Sindh High Court',
  },
  {
    id: 12,
    name: 'District & Sessions Court Peshawar',
    type: 'District Court',
    typeId: 'district',
    province: 'kpk',
    city: 'Peshawar',
    address: 'District Courts Complex, Peshawar',
    phone: '+92-91-9210525',
    website: 'www.sessionscourtpeshawar.gov.pk',
    hours: '8:00 AM - 3:00 PM (Mon-Sat)',
    jurisdiction: 'Civil & criminal cases for Peshawar District',
    judges: 'District & Sessions Judge + 15 Additional Judges',
    functions: ['Civil suits', 'Criminal trials', 'Family courts', 'Rent Controller'],
    appealsTo: 'Peshawar High Court',
  },
]

const courtHierarchy = [
  {
    level: 1,
    title: 'Supreme Court of Pakistan',
    description: 'Highest appellate court, constitutional matters',
    icon: Scale,
    color: 'bg-amber-500',
  },
  {
    level: 2,
    title: 'High Courts (5)',
    description: 'Provincial appellate jurisdiction',
    icon: Gavel,
    color: 'bg-blue-500',
  },
  {
    level: 3,
    title: 'Federal Shariat Court',
    description: 'Sharia compliance, Hudood appeals',
    icon: Shield,
    color: 'bg-emerald-500',
  },
  {
    level: 4,
    title: 'District & Sessions Courts',
    description: 'District level civil & criminal jurisdiction',
    icon: Landmark,
    color: 'bg-purple-500',
  },
  {
    level: 5,
    title: 'Magistrate Courts',
    description: 'Minor criminal cases, judicial magistrates',
    icon: Users,
    color: 'bg-rose-500',
  },
]

const quickStats = [
  { label: 'Superior Courts', value: '6', icon: Scale },
  { label: 'High Courts', value: '5', icon: Gavel },
  { label: 'District Courts', value: '150+', icon: Landmark },
  { label: 'Judges (Approx)', value: '3,000+', icon: Users },
]

const helpfulLinks = [
  { title: 'Case Status Inquiry', description: 'Check your case status online', icon: Search, href: '#' },
  { title: 'Cause Lists', description: 'View daily court schedules', icon: FileText, href: '#' },
  { title: 'Judgments Database', description: 'Search past court decisions', icon: Gavel, href: '/research' },
  { title: 'Court Fees Calculator', description: 'Calculate stamp duty & fees', icon: Landmark, href: '#' },
]

export default function CourtDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProvince, setSelectedProvince] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [savedCourts, setSavedCourts] = useState<number[]>([])
  const [showHierarchy, setShowHierarchy] = useState(false)

  // Filter courts
  const filteredCourts = useMemo(() => {
    return courts.filter(court => {
      const matchesSearch = 
        court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        court.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        court.jurisdiction.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesProvince = selectedProvince === 'all' || court.province === selectedProvince
      const matchesType = selectedType === 'all' || court.typeId === selectedType
      return matchesSearch && matchesProvince && matchesType
    })
  }, [searchQuery, selectedProvince, selectedType])

  // Group by province for tabs
  const courtsByProvince = useMemo(() => {
    const groups: { [key: string]: typeof courts } = {}
    provinces.forEach(p => {
      if (p.id !== 'all') {
        groups[p.id] = filteredCourts.filter(c => c.province === p.id)
      }
    })
    return groups
  }, [filteredCourts])

  const toggleSave = (id: number) => {
    setSavedCourts(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const activeProvince = provinces.find(p => p.id === selectedProvince)
  const activeType = courtTypes.find(t => t.id === selectedType)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Enhanced */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/resources" className="hover:text-primary transition-colors">Resources</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">Court Directory</span>
            </nav>

            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
                <Building2 className="w-4 h-4 mr-2" />
                Official Directory
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Court Directory
                <span className="block text-2xl md:text-3xl font-normal text-muted-foreground mt-2">
                  Find Pakistani courts & tribunal information
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Comprehensive contact information, addresses, and jurisdiction details for all superior and subordinate courts in Pakistan.
              </p>

              {/* Enhanced Search */}
              <div className="relative max-w-2xl mx-auto">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search courts by name, city, or jurisdiction..."
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
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {quickStats.map((stat) => (
                <div key={stat.label} className="text-center p-4 rounded-xl bg-background/50 backdrop-blur-sm border">
                  <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Court Hierarchy Visualization */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Court Hierarchy</h2>
              <p className="text-muted-foreground text-sm mt-1">Understanding Pakistan's judicial structure</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowHierarchy(!showHierarchy)}>
              {showHierarchy ? 'Hide' : 'Show'} Details
            </Button>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {courtHierarchy.map((level, idx) => (
                <div key={level.level} className="relative">
                  <Card className={cn(
                    "h-full border-l-4",
                    idx === 0 ? "border-l-amber-500" :
                    idx === 1 ? "border-l-blue-500" :
                    idx === 2 ? "border-l-emerald-500" :
                    idx === 3 ? "border-l-purple-500" : "border-l-rose-500"
                  )}>
                    <CardContent className="p-4">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
                        level.color, "text-white"
                      )}>
                        <level.icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{level.title}</h3>
                      <p className="text-xs text-muted-foreground">{level.description}</p>
                    </CardContent>
                  </Card>
                  {idx < courtHierarchy.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-border" />
                  )}
                </div>
              ))}
            </div>
            
            {showHierarchy && (
              <div className="mt-6 p-6 rounded-xl bg-muted/50">
                <h3 className="font-semibold mb-4">Understanding the Hierarchy</h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-primary" />
                      Appeals Flow
                    </h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Magistrate Courts → Sessions Courts → High Courts → Supreme Court</li>
                      <li>• Civil Courts → District Courts → High Courts → Supreme Court</li>
                      <li>• Special Courts → High Courts → Supreme Court</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      Key Facts
                    </h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Supreme Court decisions are binding on all courts</li>
                      <li>• High Courts supervise all subordinate courts in their province</li>
                      <li>• Federal Shariat Court examines laws for Islamic compliance</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Court Type Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filter by Court Type:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {courtTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={selectedType === type.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type.id)}
                  className="gap-2"
                >
                  <type.icon className="h-4 w-4" />
                  {type.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Province Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">Filter by Province:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {provinces.map((province) => (
                <Button
                  key={province.id}
                  variant={selectedProvince === province.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedProvince(province.id)}
                >
                  {province.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(selectedProvince !== 'all' || selectedType !== 'all') && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedProvince !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {activeProvince?.name}
                <button onClick={() => setSelectedProvince('all')} className="hover:bg-muted rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedType !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {activeType?.name}
                <button onClick={() => setSelectedType('all')} className="hover:bg-muted rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <button 
              onClick={() => { setSelectedProvince('all'); setSelectedType('all'); }}
              className="text-sm text-primary hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold">
              {searchQuery ? `Search Results` : 
               selectedProvince !== 'all' ? `Courts in ${activeProvince?.name}` : 
               selectedType !== 'all' ? `${activeType?.name}` :
               'All Courts'}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {filteredCourts.length} court{filteredCourts.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-3">
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

        {/* Courts Display */}
        {selectedProvince === 'all' && !searchQuery && selectedType === 'all' ? (
          // Tabbed view when no filters active
          <Tabs defaultValue="islamabad" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="islamabad">Islamabad</TabsTrigger>
              <TabsTrigger value="punjab">Punjab</TabsTrigger>
              <TabsTrigger value="sindh">Sindh</TabsTrigger>
              <TabsTrigger value="kpk">KPK</TabsTrigger>
              <TabsTrigger value="balochistan">Balochistan</TabsTrigger>
            </TabsList>
            
            {Object.entries(courtsByProvince).map(([province, provinceCourts]) => (
              <TabsContent key={province} value={province} className="mt-6">
                {provinceCourts.length > 0 ? (
                  <div className={cn(
                    viewMode === 'grid' 
                      ? 'grid md:grid-cols-2 gap-6'
                      : 'space-y-4'
                  )}>
                    {provinceCourts.map((court) => (
                      <EnhancedCourtCard 
                        key={court.id} 
                        court={court} 
                        viewMode={viewMode}
                        isSaved={savedCourts.includes(court.id)}
                        onToggleSave={() => toggleSave(court.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No courts found in this province matching your criteria</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          // Filtered view
          <div className={cn(
            viewMode === 'grid' 
              ? 'grid md:grid-cols-2 gap-6'
              : 'space-y-4'
          )}>
            {filteredCourts.map((court) => (
              <EnhancedCourtCard 
                key={court.id} 
                court={court}
                viewMode={viewMode}
                isSaved={savedCourts.includes(court.id)}
                onToggleSave={() => toggleSave(court.id)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredCourts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No courts found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn't find any courts matching your search criteria. Try adjusting your filters or search query.
            </p>
            <Button onClick={() => { setSearchQuery(''); setSelectedProvince('all'); setSelectedType('all'); }}>
              Clear all filters
            </Button>
          </div>
        )}

        {/* Helpful Links */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Helpful Resources</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {helpfulLinks.map((link) => (
              <Card key={link.title} className="group hover:shadow-md transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <link.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">{link.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Important Information */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Court Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                <strong>Superior Courts:</strong> Monday-Thursday, 9:00 AM - 4:00 PM<br/>
                <strong>District Courts:</strong> Monday-Saturday, 8:00 AM - 3:00 PM
              </p>
              <p className="text-xs text-muted-foreground">
                Friday hours may vary. Courts remain closed on public holidays. 
                Always check cause lists for specific hearing dates.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Dress Code & Etiquette
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Professional/formal attire required</li>
                <li>• Lawyers must wear black coat and collar</li>
                <li>• Mobile phones must be silent</li>
                <li>• Show respect to judges (stand when they enter)</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Online Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Case status inquiry systems</li>
                <li>• E-filing portals (select courts)</li>
                <li>• Digital cause lists</li>
                <li>• Online verification of judgments</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 md:p-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold mb-3">Need Legal Guidance?</h2>
              <p className="text-primary-foreground/90 text-lg max-w-xl">
                Can't find the right court or need help with procedures? Our AI assistant can guide you through the Pakistani judicial system.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <Link to="/chat">
                Get Help <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced Court Card Component
function EnhancedCourtCard({ 
  court, 
  viewMode,
  isSaved,
  onToggleSave
}: { 
  court: typeof courts[0]
  viewMode: 'grid' | 'list'
  isSaved: boolean
  onToggleSave: () => void
}) {
  const [showDetails, setShowDetails] = useState(false)

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-all">
        <div className="flex items-center gap-4 p-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary">{court.type}</Badge>
              <span className="text-sm text-muted-foreground">{court.city}</span>
            </div>
            <h3 className="font-semibold truncate">{court.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{court.jurisdiction}</p>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {court.phone}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onToggleSave}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                  >
                    <Bookmark className={cn(
                      "h-4 w-4 transition-colors",
                      isSaved ? 'fill-primary text-primary' : 'text-muted-foreground'
                    )} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isSaved ? 'Saved' : 'Save court'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/courts/${court.id}`}>Details</Link>
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="group hover:shadow-lg transition-all overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge>{court.type}</Badge>
              {court.established && (
                <Badge variant="outline" className="text-xs">Est. {court.established}</Badge>
              )}
            </div>
            <CardTitle className="text-xl group-hover:text-primary transition-colors">
              {court.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {court.city}, {court.province === 'kpk' ? 'Khyber Pakhtunkhwa' : court.province.charAt(0).toUpperCase() + court.province.slice(1)}
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onToggleSave}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <Bookmark className={cn(
                    "h-5 w-5 transition-colors",
                    isSaved ? 'fill-primary text-primary' : 'text-muted-foreground'
                  )} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isSaved ? 'Remove from saved' : 'Save for later'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{court.jurisdiction}</p>
        
        <div className="space-y-2 text-sm">
          <p className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <span>{court.address}</span>
          </p>
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>{court.phone}</span>
          </p>
          <p className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>{court.hours}</span>
          </p>
          {court.website && court.website !== '-' && (
            <p className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
              <a 
                href={`https://${court.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1"
              >
                {court.website} <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          )}
        </div>

        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground mb-1">
            <span className="font-medium">Judges:</span> {court.judges}
          </p>
          {court.benches && (
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Benches:</span> {court.benches.join(', ')}
            </p>
          )}
        </div>

        {showDetails && court.functions && (
          <div className="pt-3 border-t animate-in slide-in-from-top-2">
            <p className="text-xs font-medium mb-2">Key Functions:</p>
            <ul className="space-y-1">
              {court.functions.map((func, idx) => (
                <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                  {func}
                </li>
              ))}
            </ul>
            {court.appealsTo && (
              <p className="text-xs text-muted-foreground mt-3">
                <span className="font-medium">Appeals to:</span> {court.appealsTo}
              </p>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Show Less' : 'Show More Details'}
          <ChevronDown className={cn("ml-2 h-4 w-4 transition-transform", showDetails && "rotate-180")} />
        </Button>
      </CardFooter>
    </Card>
  )
}