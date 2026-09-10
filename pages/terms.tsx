import { Link } from 'react-router-dom'
import { ChevronRight, Scale, AlertTriangle, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span>Terms of Service</span>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Last updated: March 9, 2025
          </p>
        </div>

        <Card className="mb-8 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5" />
              <div>
                <h2 className="font-semibold mb-2 text-amber-800 dark:text-amber-200">Important Notice</h2>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Please read these Terms of Service carefully before using PakLegal AI. By accessing or using our services, you agree to be bound by these terms.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. Service Description</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>PakLegal AI provides an AI-powered platform that offers:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>General legal information about Pakistani law</li>
              <li>Legal document templates and generation tools</li>
              <li>Case law search and research capabilities</li>
              <li>Educational resources about legal procedures</li>
            </ul>
            <p><strong>Important:</strong> PakLegal AI is not a law firm and does not provide legal advice. The information provided is for general educational purposes only.</p>
          </div>
        </section>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. User Eligibility</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>By using our services, you represent and warrant that:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You are at least 18 years of age</li>
              <li>You have the legal capacity to enter into binding agreements</li>
              <li>You are a resident of Pakistan or accessing Pakistani law information</li>
              <li>You will use the services only for lawful purposes</li>
              <li>All information you provide is accurate and complete</li>
            </ul>
          </div>
        </section>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3. No Attorney-Client Relationship</h2>
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Scale className="h-6 w-6 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2">No Legal Advice</h3>
                  <p className="text-sm text-muted-foreground">
                    Use of PakLegal AI does not create an attorney-client relationship. Communications through our platform are not privileged or confidential in the same manner as communications with a licensed attorney.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">4. Disclaimer of Warranties</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>OUR SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; WITHOUT ANY WARRANTIES OF ANY KIND, INCLUDING BUT NOT LIMITED TO:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Accuracy, completeness, or reliability of legal information</li>
              <li>Merchantability or fitness for a particular purpose</li>
              <li>Non-infringement of third-party rights</li>
              <li>Uninterrupted or error-free service</li>
              <li>Security or freedom from viruses</li>
            </ul>
          </div>
        </section>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">5. Limitation of Liability</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, PAKLEGAL AI AND ITS AFFILIATES SHALL NOT BE LIABLE FOR:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Any direct, indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damages arising from reliance on AI-generated content</li>
              <li>Damages from legal outcomes based on our information</li>
              <li>Service interruptions or technical failures</li>
            </ul>
          </div>
        </section>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">6. Dispute Resolution</h2>
          <div className="space-y-4 text-muted-foreground">
            <p><strong>Governing Law:</strong> These Terms shall be governed by and construed in accordance with the laws of Pakistan.</p>
            <p><strong>Jurisdiction:</strong> Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Lahore, Pakistan.</p>
          </div>
        </section>
      </div>
    </div>
  )
}
