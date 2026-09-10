import { Link } from 'react-router-dom'
import { ChevronRight, AlertTriangle, Scale, Shield, MessageSquare, FileText, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span>Disclaimer</span>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Legal Disclaimer
          </h1>
          <p className="text-muted-foreground">
            Please read this disclaimer carefully before using PakLegal AI
          </p>
        </div>

        <Card className="mb-8 border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center">
              <AlertTriangle className="h-16 w-16 text-red-600 mb-4" />
              <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">
                NOT LEGAL ADVICE
              </h2>
              <p className="text-red-700 dark:text-red-300 max-w-2xl">
                PakLegal AI provides general legal information for educational purposes only. 
                This is NOT legal advice. Always consult a qualified Pakistani advocate for 
                specific legal matters.
              </p>
            </div>
          </CardContent>
        </Card>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            General Disclaimer
          </h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                PakLegal AI is an artificial intelligence-powered platform designed to provide 
                general information about Pakistani law. While we strive for accuracy, the 
                information provided:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>May not reflect the most current legal developments</li>
                <li>May not apply to your specific situation</li>
                <li>May contain errors or omissions</li>
                <li>Should not be relied upon as the sole basis for any legal decision</li>
                <li>Does not constitute legal advice, opinion, or recommendation</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            No Attorney-Client Relationship
          </h2>
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                <strong>Important:</strong> Use of PakLegal AI does NOT create an attorney-client 
                relationship between you and PakLegal AI, its employees, or any affiliated legal 
                professionals.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Communications through this platform are not privileged or confidential</li>
                <li>We do not represent you in any legal matter</li>
                <li>We do not owe you any fiduciary duties</li>
                <li>We are not responsible for any legal outcomes</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            AI Limitations
          </h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                Our AI system has inherent limitations that users must understand:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold">Potential Issues</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>AI may generate incorrect or incomplete information</li>
                    <li>Outdated legal precedents or statutes</li>
                    <li>Misinterpretation of complex legal questions</li>
                    <li>Inability to understand case-specific nuances</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold">What AI Cannot Do</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Understand your complete factual situation</li>
                    <li>Provide strategic legal advice</li>
                    <li>Represent you in court or negotiations</li>
                    <li>Guarantee accuracy of legal citations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Document Templates
          </h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                Our document templates are provided as starting points only:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Templates may not be suitable for your specific situation</li>
                <li>Legal requirements vary by jurisdiction and case type</li>
                <li>Templates should be reviewed by a qualified attorney before use</li>
                <li>We are not responsible for any disputes arising from template use</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            When to Consult a Lawyer
          </h2>
          <Card className="bg-slate-900 text-white">
            <CardContent className="p-6">
              <p className="mb-4 text-slate-300">
                You should consult a qualified Pakistani advocate for:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Court proceedings and litigation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Criminal matters and investigations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Significant financial transactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Family law disputes (divorce, custody)</span>
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Property disputes and real estate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Business formation and contracts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Constitutional rights violations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Any matter with serious consequences</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            PECA Compliance
          </h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                Users must comply with the Prevention of Electronic Crimes Act, 2025 (PECA 2025). 
                Specifically, you must NOT use our platform to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Generate false information or fake news</li>
                <li>Create defamatory or harassing content</li>
                <li>Produce material that incites violence or hatred</li>
                <li>Violate any provisions of Pakistani cybercrime laws</li>
                <li>Engage in any unlawful activity</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20">
          <CardContent className="p-6 text-center">
            <p className="text-emerald-800 dark:text-emerald-200 mb-6">
              By using PakLegal AI, you acknowledge that you have read, understood, 
              and agree to this disclaimer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/chat">
                <Button className="bg-primary hover:bg-primary/90">
                  I Understand - Continue to Platform
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline">
                  Return to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
