import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ChevronRight, 
  Shield, 
  Lock, 
  Eye, 
  Trash2, 
  User, 
  ArrowLeft,
  CheckCircle2,
  Server,
  Cookie,
  Mail,
  Phone,
  MapPin,
  Printer,
  Download,
  Search,
  X,
  AlertCircle,
  Clock,
  Database,
  EyeOff,
  Hand,
  RefreshCcw,
  ScrollText,
  BadgeCheck
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription } from '@/components/ui/alert'

// ==================== TYPES ====================

interface PolicySection {
  id: string
  title: string
  icon: React.ElementType
  content: React.ReactNode
  lastUpdated?: string
}

interface DataRetentionItem {
  category: string
  duration: string
  purpose: string
  deletable: boolean
}

// ==================== DATA ====================

const lastUpdated = new Date('2025-03-09')
const nextReview = new Date('2025-09-09')

const dataRetentionItems: DataRetentionItem[] = [
  { category: 'Account Information', duration: 'Until account deletion', purpose: 'Service provision', deletable: true },
  { category: 'Query History', duration: '30 days', purpose: 'Service improvement', deletable: true },
  { category: 'Generated Documents', duration: 'User-controlled', purpose: 'User access', deletable: true },
  { category: 'Analytics Data', duration: '90 days', purpose: 'Platform optimization', deletable: false },
  { category: 'Security Logs', duration: '1 year', purpose: 'Fraud prevention', deletable: false },
  { category: 'Payment Records', duration: '5 years', purpose: 'Legal compliance', deletable: false },
]

const certifications = [
  { name: 'ISO 27001', desc: 'Information Security' },
  { name: 'GDPR Compliant', desc: 'Data Protection' },
  { name: 'SOC 2 Type II', desc: 'Security Controls' },
  { name: 'PDPB Ready', desc: 'Pakistan Data Law' },
]

// ==================== SUB-COMPONENTS ====================

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = (window.scrollY / scrollHeight) * 100
      setProgress(scrolled)
    }
    
    window.addEventListener('scroll', updateProgress)
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])
  
  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-primary/10 z-50">
      <div 
        className="h-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

const TableOfContents = ({ sections, activeSection }: { sections: PolicySection[], activeSection: string }) => {
  const [] = useState(false)
  
  return (
    <div className="hidden lg:block fixed left-8 top-32 w-64 z-40">
      <Card className="shadow-lg border-primary/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ScrollText className="h-4 w-4" />
            Contents
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ScrollArea className="h-[calc(100vh-300px)]">
            <nav className="space-y-1">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all duration-200",
                    activeSection === section.id 
                      ? "bg-primary text-primary-foreground font-medium" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <section.icon className="h-4 w-4" />
                  <span className="line-clamp-1">{section.title}</span>
                </a>
              ))}
            </nav>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

const SecurityBadge = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 hover:border-emerald-300 transition-colors cursor-help">
          <Icon className="h-5 w-5 text-emerald-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-sm text-emerald-900 dark:text-emerald-100">{title}</h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">{description}</p>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs">Click to learn more about our {title.toLowerCase()} practices</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

const DataRetentionTable = () => (
  <div className="overflow-x-auto rounded-lg border">
    <table className="w-full text-sm">
      <thead className="bg-muted">
        <tr>
          <th className="text-left p-3 font-semibold">Data Category</th>
          <th className="text-left p-3 font-semibold">Retention Period</th>
          <th className="text-left p-3 font-semibold">Purpose</th>
          <th className="text-center p-3 font-semibold">User Deletion</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {dataRetentionItems.map((item, idx) => (
          <tr key={idx} className="hover:bg-muted/50 transition-colors">
            <td className="p-3 font-medium">{item.category}</td>
            <td className="p-3 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                {item.duration}
              </div>
            </td>
            <td className="p-3 text-muted-foreground">{item.purpose}</td>
            <td className="p-3 text-center">
              {item.deletable ? (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Yes
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  Required
                </Badge>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const RightsExerciser = () => {
  const [selectedRight, setSelectedRight] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  
  const rights = [
    { id: 'access', label: 'Access my data', icon: Eye, desc: 'Request a copy of all your personal data' },
    { id: 'delete', label: 'Delete my data', icon: Trash2, desc: 'Request complete deletion of your account and data' },
    { id: 'correct', label: 'Correct my data', icon: RefreshCcw, desc: 'Update inaccurate or incomplete information' },
    { id: 'port', label: 'Export my data', icon: Download, desc: 'Receive your data in a portable format' },
    { id: 'restrict', label: 'Restrict processing', icon: Hand, desc: 'Limit how we use your data' },
    { id: 'object', label: 'Object to processing', icon: EyeOff, desc: 'Opt-out of certain data uses including AI training' },
  ]
  
  if (submitted) {
    return (
      <Card className="bg-emerald-50 border-emerald-200">
        <CardContent className="p-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-emerald-900 mb-2">Request Received</h3>
          <p className="text-emerald-700 mb-4">
            We've received your request and will process it within 30 days as required by law.
          </p>
          <Button variant="outline" onClick={() => setSubmitted(false)}>Submit Another Request</Button>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        {rights.map((right) => (
          <button
            key={right.id}
            onClick={() => setSelectedRight(right.id)}
            className={cn(
              "flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-all duration-200",
              selectedRight === right.id 
                ? "border-primary bg-primary/5" 
                : "border-muted hover:border-primary/50 hover:bg-muted/50"
            )}
          >
            <right.icon className={cn(
              "h-5 w-5 mt-0.5",
              selectedRight === right.id ? "text-primary" : "text-muted-foreground"
            )} />
            <div>
              <h4 className="font-semibold text-sm">{right.label}</h4>
              <p className="text-xs text-muted-foreground mt-1">{right.desc}</p>
            </div>
          </button>
        ))}
      </div>
      
      {selectedRight && (
        <div className="animate-in slide-in-from-top-2 duration-300 space-y-4 pt-4 border-t">
          <div className="space-y-2">
            <Label htmlFor="request-email">Email Address</Label>
            <Input 
              id="request-email"
              type="email" 
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              We'll send a verification link to confirm your identity before processing this request.
            </p>
          </div>
          <Button 
            className="w-full"
            disabled={!email}
            onClick={() => setSubmitted(true)}
          >
            Submit Request
          </Button>
        </div>
      )}
    </div>
  )
}

// ==================== MAIN COMPONENT ====================

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('intro')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  })
  
  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -80% 0px' }
    )
    
    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section)
    })
    
    return () => observer.disconnect()
  }, [])
  
  const sections: PolicySection[] = [
    {
      id: 'intro',
      title: 'Introduction',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-primary/5 to-emerald-500/5 p-6 rounded-xl border border-primary/10">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-primary" />
              Our Privacy Promise
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              PakLegal AI is committed to protecting your privacy and ensuring the security of your personal information. 
              We believe that trust is the foundation of our relationship with users, especially when dealing with sensitive legal matters.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Zero Data Selling</p>
                  <p className="text-xs text-muted-foreground">We never sell your data to third parties</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Full Transparency</p>
                  <p className="text-xs text-muted-foreground">Clear data practices, no hidden tracking</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'collection',
      title: 'Information We Collect',
      icon: Database,
      content: (
        <div className="space-y-6">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="mt-4 space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Account Information</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span><strong>Identity:</strong> Name, email, phone number, CNIC (for verification)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span><strong>Professional:</strong> Bar Council number, firm name, practice areas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span><strong>Preferences:</strong> Language, notification settings, display preferences</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="usage" className="mt-4 space-y-4">
              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  <strong>Important:</strong> Legal queries are processed securely and are not used to train our AI models unless you explicitly opt-in.
                </AlertDescription>
              </Alert>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                  <span>Search queries and AI conversations</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                  <span>Documents generated and templates used</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                  <span>Feature usage and interaction patterns</span>
                </li>
              </ul>
            </TabsContent>
            
            <TabsContent value="technical" className="mt-4">
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                  <span>IP address and device information</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                  <span>Browser type and operating system</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                  <span>Cookies and local storage data</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                  <span>Error logs and performance data</span>
                </li>
              </ul>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-3">
                  <strong>Document Security:</strong> All legal documents you upload or generate are:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Encrypted at rest with AES-256
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Transmitted via TLS 1.3
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Stored in Pakistan-based servers (primary) with EU backup
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Automatically deleted after 30 days (configurable)
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )
    },
    {
      id: 'usage',
      title: 'How We Use Your Information',
      icon: Eye,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-base">Service Provision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  To provide legal AI assistance, document generation, and case law research tailored to Pakistani jurisdiction.
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-base">Service Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  To enhance our AI models, fix bugs, and improve user experience. <strong>Optional and opt-out available.</strong>
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-emerald-500">
              <CardHeader>
                <CardTitle className="text-base">Security & Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  To prevent fraud, ensure platform security, and comply with legal obligations under Pakistani law.
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader>
                <CardTitle className="text-base">Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  To send updates, security alerts, and respond to your inquiries. You can manage preferences anytime.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              AI Training & Your Data
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              By default, your queries and documents are <strong>NOT</strong> used to train our AI models. 
              If you choose to opt-in to help improve our service:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• All personally identifiable information is stripped before use</li>
              <li>• Only aggregated, anonymized patterns are analyzed</li>
              <li>• You can withdraw consent at any time from your account settings</li>
              <li>• Legal documents are never used for training under any circumstances</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      title: 'Data Storage & Security',
      icon: Lock,
      content: (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <SecurityBadge 
              icon={Lock} 
              title="End-to-End Encryption" 
              description="All data encrypted in transit and at rest using AES-256 and TLS 1.3" 
            />
            <SecurityBadge 
              icon={Server} 
              title="Secure Infrastructure" 
              description="ISO 27001 certified data centers with 24/7 monitoring" 
            />
            <SecurityBadge 
              icon={Eye} 
              title="Access Controls" 
              description="Role-based access with multi-factor authentication required" 
            />
            <SecurityBadge 
              icon={Trash2} 
              title="Secure Deletion" 
              description="Cryptographic erasure when you delete your data" 
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Data Retention Schedule
              </CardTitle>
              <CardDescription>
                How long we keep different types of data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataRetentionTable />
            </CardContent>
          </Card>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {certifications.map((cert) => (
              <Badge key={cert.name} variant="secondary" className="px-3 py-1 text-sm">
                <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" />
                {cert.name}
                <span className="text-muted-foreground ml-1">• {cert.desc}</span>
              </Badge>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'cookies',
      title: 'Cookies & Tracking',
      icon: Cookie,
      content: (
        <div className="space-y-6">
          <p className="text-muted-foreground">
            We use cookies and similar technologies to enhance your experience. 
            You can manage your preferences below:
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="space-y-1">
                <h4 className="font-semibold flex items-center gap-2">
                  Necessary Cookies
                  <Badge variant="outline" className="text-xs">Required</Badge>
                </h4>
                <p className="text-sm text-muted-foreground">Essential for the website to function properly</p>
              </div>
              <Switch checked={cookiePreferences.necessary} disabled />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="space-y-1">
                <h4 className="font-semibold">Analytics Cookies</h4>
                <p className="text-sm text-muted-foreground">Help us improve our website by collecting anonymous usage data</p>
              </div>
              <Switch 
                checked={cookiePreferences.analytics} 
                onCheckedChange={(checked) => setCookiePreferences(prev => ({ ...prev, analytics: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="space-y-1">
                <h4 className="font-semibold">Marketing Cookies</h4>
                <p className="text-sm text-muted-foreground">Used to deliver relevant advertisements (we rarely use these)</p>
              </div>
              <Switch 
                checked={cookiePreferences.marketing} 
                onCheckedChange={(checked) => setCookiePreferences(prev => ({ ...prev, marketing: checked }))}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={() => alert('Preferences saved!')}>
              Save Cookie Preferences
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 'rights',
      title: 'Your Rights',
      icon: User,
      content: (
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Under the Pakistan Personal Data Protection Bill (PDPB) 2023 and applicable regulations, 
            you have the following rights regarding your personal data:
          </p>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="access">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-primary" />
                  <span>Right to Access</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-8">
                You can request a complete copy of all personal data we hold about you. 
                We will provide this within 30 days in a commonly used electronic format.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="correction">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-3">
                  <RefreshCcw className="h-5 w-5 text-primary" />
                  <span>Right to Correction</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-8">
                If any information we hold is inaccurate or incomplete, you have the right to have it corrected. 
                You can update most information directly in your account settings.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="deletion">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-3">
                  <Trash2 className="h-5 w-5 text-primary" />
                  <span>Right to Deletion (Right to be Forgotten)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-8">
                You can request deletion of your personal data. We will comply unless we are required by law to retain it 
                (e.g., financial records for 5 years as per tax laws).
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="portability">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-primary" />
                  <span>Right to Data Portability</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-8">
                You can request your data in a structured, commonly used, machine-readable format 
                (JSON, CSV) to transfer to another service.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Hand className="h-5 w-5" />
                Exercise Your Rights
              </CardTitle>
              <CardDescription>
                Submit a request to exercise your data protection rights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RightsExerciser />
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'contact',
      title: 'Contact Us',
      icon: Mail,
      content: (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <Mail className="h-8 w-8 text-primary mb-3" />
                <h4 className="font-semibold mb-1">Email</h4>
                <a href="mailto:privacy@paklegal.ai" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  privacy@paklegal.ai
                </a>
                <p className="text-xs text-muted-foreground mt-2">Response within 24 hours</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <Phone className="h-8 w-8 text-primary mb-3" />
                <h4 className="font-semibold mb-1">Phone</h4>
                <p className="text-sm text-muted-foreground">+92-42-XXXX-XXXX</p>
                <p className="text-xs text-muted-foreground mt-2">Mon-Fri, 9AM-5PM PKT</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <MapPin className="h-8 w-8 text-primary mb-3" />
                <h4 className="font-semibold mb-1">Address</h4>
                <p className="text-sm text-muted-foreground">
                  PakLegal AI<br />
                  Suite 404, Business Center<br />
                  Gulberg III, Lahore, Pakistan
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border">
            <h4 className="font-semibold mb-4">Data Protection Officer</h4>
            <p className="text-sm text-muted-foreground mb-4">
              For privacy-specific concerns or to exercise your rights under Pakistani data protection law, 
              contact our Data Protection Officer:
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Ahmad Hassan</p>
                <p className="text-sm text-muted-foreground">dpo@paklegal.ai</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
  ]

  // Filter sections based on search
  const filteredSections = sections.filter(section => 
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (typeof section.content === 'string' && section.content.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      
      <TableOfContents sections={sections} activeSection={activeSection} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:pl-80">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary flex items-center gap-1 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>Privacy Policy</span>
          </div>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => window.print()}>
                    <Printer className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Print Policy</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setShowSearch(!showSearch)}>
                    <Search className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Search Policy</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Search Bar */}
        {showSearch && (
          <div className="mb-6 animate-in slide-in-from-top-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search privacy policy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Shield className="h-4 w-4" />
            Legal Document
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Last updated: {lastUpdated.toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <RefreshCcw className="h-4 w-4" />
              Next review: {nextReview.toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          {filteredSections.map((section, index) => (
            <section 
              key={section.id} 
              id={section.id}
              className="scroll-mt-32"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <section.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{section.title}</h2>
                    <Badge variant="outline" className="text-xs">
                      Sec {index + 1}
                    </Badge>
                  </div>
                  {section.lastUpdated && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Updated {section.lastUpdated}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {section.content}
              </div>
              
              <Separator className="mt-16" />
            </section>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-muted rounded-xl">
          <div className="text-center sm:text-left">
            <h3 className="font-semibold mb-1">Have questions about your privacy?</h3>
            <p className="text-sm text-muted-foreground">Our team is here to help you understand your rights</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
            <Button asChild>
              <Link to="/chat">Ask AI Assistant</Link>
            </Button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-1">Legal Notice</h4>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                This privacy policy is provided for informational purposes and represents our commitment to data protection. 
                It does not create contractual rights. For the legally binding version, please refer to the Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}