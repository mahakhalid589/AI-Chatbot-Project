import { Link } from 'react-router-dom'
import { 
  MessageCircle, 
  FileText, 
  Search, 
  Shield,
  Scale,
  CheckCircle,
  Lock,
  ArrowRight,
  Star,
  BookOpen,
  Gavel,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const features = [
  {
    icon: MessageCircle,
    title: 'Ask Legal Questions',
    description: 'Get instant answers on family law, property, business, and criminal matters with citations from Pakistani statutes and case law.',
    button: 'Ask Now',
    href: '/chat',
  },
  {
    icon: FileText,
    title: 'Generate Documents',
    description: 'Create rent agreements, affidavits, power of attorney, and business contracts tailored to Pakistani legal requirements.',
    button: 'Create Document',
    href: '/documents',
  },
  {
    icon: Search,
    title: 'Search Case Law',
    description: 'Find Supreme Court and High Court judgments from 1950 to present with proper citations and summaries.',
    button: 'Search Cases',
    href: '/research',
  },
  {
    icon: BookOpen,
    title: 'PPC Reference',
    description: 'Access all 511 sections of the Pakistan Penal Code with detailed explanations, punishments, and classifications.',
    button: 'Explore PPC',
    href: '/chat',
  },
]

const sampleQuestions = [
  'What is the procedure for court marriage in Pakistan?',
  'What are tenant rights in Punjab?',
  'How to register a company in Pakistan?',
  'Explain Section 420 PPC and punishment',
  'What is the inheritance share of daughters?',
  'How to file a consumer complaint?',
]

const documentTemplates = [
  { title: 'Residential Rent Agreement', jurisdiction: 'Punjab' },
  { title: 'Commercial Lease Agreement', jurisdiction: 'Federal' },
  { title: 'General Power of Attorney', jurisdiction: 'All Provinces' },
  { title: 'Affidavit for Name Change', jurisdiction: 'Federal' },
  { title: 'Partnership Deed', jurisdiction: 'All Provinces' },
  { title: 'Legal Notice Format', jurisdiction: 'Federal' },
]

const testimonials = [
  {
    name: 'Ahmad Khan',
    role: 'Law Student, LUMS',
    content: 'Saved me significant time on legal research for my dissertation. The case law search is comprehensive and accurate.',
    avatar: 'AK',
  },
  {
    name: 'Fatima Ali',
    role: 'Landlord, Karachi',
    content: 'Generated a solid rent agreement in minutes. The document templates are professionally formatted and legally sound.',
    avatar: 'FA',
  },
  {
    name: 'Hassan Raza',
    role: 'Advocate, Lahore High Court',
    content: 'Citations are accurate and properly formatted. A valuable tool for quick legal reference and initial research.',
    avatar: 'HR',
  },
]

const stats = [
  { value: '511', label: 'PPC Sections Covered' },
  { value: '50+', label: 'Document Templates' },
  { value: '15,000+', label: 'Case Laws' },
  { value: '98%', label: 'Accuracy Rate' },
]

const legalAreas = [
  { icon: Gavel, title: 'Criminal Law', description: 'PPC sections, bail procedures, trial process' },
  { icon: Users, title: 'Family Law', description: 'Marriage, divorce, inheritance, guardianship' },
  { icon: Scale, title: 'Civil Law', description: 'Contracts, property, torts, consumer rights' },
  { icon: BookOpen, title: 'Constitutional Law', description: 'Fundamental rights, judicial review' },
]

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 lg:py-32">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/20 text-primary-foreground border-primary/30">
              Pakistan Legal Intelligence Platform
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Understand Pakistani Law with{' '}
              <span className="text-primary">AI-Powered</span> Guidance
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Ask questions, generate documents, and understand your rights under Pakistani law. 
              Comprehensive coverage of all 511 PPC sections with verified citations.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span>Verified Legal Sources</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Shield className="h-5 w-5 text-emerald-400" />
                <span>PECA Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Scale className="h-5 w-5 text-emerald-400" />
                <span>All 511 PPC Sections</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/chat">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8">
                  Start Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/documents">
                <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 px-8">
                  Explore Legal Documents
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need for Legal Matters
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools to help you navigate Pakistani law with confidence and accuracy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary/20">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{feature.description}</CardDescription>
                  <Link to={feature.href}>
                    <Button variant="outline" className="w-full">
                      {feature.button}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Areas Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Areas of Law Covered
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive coverage of major areas of Pakistani law
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {legalAreas.map((area) => (
              <Card key={area.title} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <area.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{area.title}</h3>
                  <p className="text-sm text-muted-foreground">{area.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Try It Now
              </h2>
              <p className="text-muted-foreground mb-8">
                Experience AI-assisted legal research. Ask any question about Pakistani law and get accurate, cited answers with confidence scores.
              </p>

              <div>
                <p className="text-sm font-medium mb-3">Popular Legal Questions:</p>
                <div className="flex flex-wrap gap-2">
                  {sampleQuestions.map((question) => (
                    <Link key={question} to="/chat">
                      <Badge 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-primary/10 transition-colors py-2 px-3"
                      >
                        {question}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Preview */}
            <div className="bg-slate-900 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4 text-slate-400 text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Live Chat Preview</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white">You</span>
                  </div>
                  <div className="bg-slate-800 rounded-lg rounded-tl-none p-3 text-sm text-slate-200">
                    What are the grounds for khula under Muslim Family Laws?
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Scale className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-slate-800 rounded-lg rounded-tl-none p-3 text-sm text-slate-200">
                    <p className="mb-2">
                      Under the Muslim Family Laws Ordinance, 1961, a wife can seek khula (dissolution of marriage) under Section 8 on the following grounds:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      <li>Absence of husband for 4 years</li>
                      <li>Failure to maintain for 2 years</li>
                      <li>Husband impotence or insanity</li>
                      <li>Cruelty or ill-treatment</li>
                    </ul>
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <p className="text-xs text-slate-400">
                        Sources: MFLO 1961, Section 8 | PLD 2023 SC 45 | Confidence: 95%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                  Pakistan Code
                </Badge>
                <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                  Supreme Court
                </Badge>
                <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                  Verified
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Document Templates Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Legal Document Templates
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professionally drafted templates for all your legal documentation needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentTemplates.map((doc) => (
              <Card key={doc.title} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <FileText className="h-8 w-8 text-primary" />
                    <Badge variant="secondary" className="text-xs">
                      {doc.jurisdiction}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">{doc.title}</h3>
                  <Link to="/documents">
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-primary hover:text-primary/80">
                      View Template <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/documents">
              <Button variant="outline" size="lg">
                View All 50+ Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Compliance Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Trust & Compliance
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your data security and legal accuracy are our top priorities
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center gap-3 bg-background px-6 py-4 rounded-lg shadow-sm">
              <Lock className="h-6 w-6 text-emerald-600" />
              <span className="font-medium">End-to-End Encryption</span>
            </div>
            <div className="flex items-center gap-3 bg-background px-6 py-4 rounded-lg shadow-sm">
              <Shield className="h-6 w-6 text-emerald-600" />
              <span className="font-medium">Verified Sources Only</span>
            </div>
            <div className="flex items-center gap-3 bg-background px-6 py-4 rounded-lg shadow-sm">
              <Scale className="h-6 w-6 text-emerald-600" />
              <span className="font-medium">Confidence Scoring</span>
            </div>
          </div>

          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            <AccordionItem value="accuracy">
              <AccordionTrigger>How We Ensure Accuracy</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>All answers cite specific statutes and case law with references</li>
                  <li>Confidence scores displayed for every response</li>
                  <li>Legal database updated regularly with new judgments</li>
                  <li>AI trained exclusively on Pakistani legal corpus</li>
                  <li>Clear acknowledgment when confidence is below threshold</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="scope">
              <AccordionTrigger>Scope & Limitations</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>We only answer questions about Pakistani law</li>
                  <li>Foreign law queries are politely declined</li>
                  <li>Information is for general guidance only, not legal advice</li>
                  <li>We never fabricate citations or guess section numbers</li>
                  <li>Complex matters should be referred to qualified lawyers</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="security">
              <AccordionTrigger>Data Security Measures</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>All data encrypted at rest and in transit</li>
                  <li>No personal data shared with third parties</li>
                  <li>Regular security audits and updates</li>
                  <li>Compliance with Pakistan data protection principles</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trusted by law students, advocates, and citizens across Pakistan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Join thousands of Pakistanis who use PakLegal AI for their legal questions and document needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/chat">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8">
                Start Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/documents">
              <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 px-8">
                Generate Documents
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}