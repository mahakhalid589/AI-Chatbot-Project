import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Home, 
  Building2, 
  Users, 
  Scale,
  ChevronRight,
  ChevronLeft,
  Check,
  Download,
  Eye,
  ArrowLeft,
  Save,
  Loader2,
  FileText,
  Shield,
  AlertCircle,
  Info,
  Printer,
  Share2,
  Copy,
  CheckCircle2,
  Search,
  History,
  Clock,
  MapPin,
  FileCheck,
  Trash2} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

// ==================== TYPES & INTERFACES ====================

interface FormField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'date' | 'select' | 'number' | 'cnic'
  placeholder?: string
  required?: boolean
  helpText?: string
  options?: { value: string; label: string }[]
  validation?: (value: string) => string | null
  dependsOn?: { field: string; value: string | boolean }
}

interface Template {
  id: string
  name: string
  description: string
  difficulty: 'Simple' | 'Standard' | 'Complex'
  estimatedTime: string
  fields: FormField[]
  clauses?: { id: string; label: string; default: boolean }[]
}

interface Category {
  id: string
  name: string
  description: string
  icon: React.ElementType
  color: string
  templates: Template[]
}

interface Jurisdiction {
  id: string
  name: string
  shortName: string
}

interface SavedDocument {
  id: string
  templateId: string
  templateName: string
  categoryName: string
  jurisdictionName: string
  formData: Record<string, string>
  createdAt: string
  updatedAt: string
  isFavorite?: boolean
}

interface FormErrors {
  [key: string]: string
}

// ==================== DATA ====================

const jurisdictions: Jurisdiction[] = [
  { id: 'federal', name: 'Federal', shortName: 'Federal' },
  { id: 'punjab', name: 'Punjab', shortName: 'Punjab' },
  { id: 'sindh', name: 'Sindh', shortName: 'Sindh' },
  { id: 'kpk', name: 'Khyber Pakhtunkhwa', shortName: 'KPK' },
  { id: 'balochistan', name: 'Balochistan', shortName: 'Balochistan' },
  { id: 'ict', name: 'Islamabad Capital Territory', shortName: 'ICT' },
  { id: 'gb', name: 'Gilgit-Baltistan', shortName: 'GB' },
]

const documentCategories: Category[] = [
  {
    id: 'property',
    name: 'Property & Real Estate',
    description: 'Rent agreements, sale deeds, power of attorney',
    icon: Home,
    color: 'bg-emerald-500',
    templates: [
      { 
        id: 'rent-residential', 
        name: 'Residential Rent Agreement', 
        description: 'Standard 11-month rental contract for residential properties',
        difficulty: 'Standard',
        estimatedTime: '5 min',
        fields: [
          { id: 'landlordName', label: 'Landlord Full Name', type: 'text', required: true, placeholder: 'As per CNIC' },
          { id: 'landlordCnic', label: 'Landlord CNIC', type: 'cnic', required: true, placeholder: 'XXXXX-XXXXXXX-X' },
          { id: 'tenantName', label: 'Tenant Full Name', type: 'text', required: true },
          { id: 'tenantCnic', label: 'Tenant CNIC', type: 'cnic', required: true },
          { id: 'propertyAddress', label: 'Property Address', type: 'textarea', required: true, placeholder: 'Complete address with area and city' },
          { id: 'monthlyRent', label: 'Monthly Rent (PKR)', type: 'number', required: true },
          { id: 'securityDeposit', label: 'Security Deposit (PKR)', type: 'number', required: true },
          { id: 'startDate', label: 'Agreement Start Date', type: 'date', required: true },
          { id: 'duration', label: 'Duration (Months)', type: 'select', required: true, options: [
            { value: '11', label: '11 Months (Standard)' },
            { value: '12', label: '1 Year' },
            { value: '24', label: '2 Years' },
          ]},
          { id: 'utilities', label: 'Utilities Included', type: 'select', options: [
            { value: 'tenant', label: 'Paid by Tenant' },
            { value: 'landlord', label: 'Paid by Landlord' },
          ]},
        ],
        clauses: [
          { id: 'renewal', label: 'Automatic Renewal Clause', default: true },
          { id: 'maintenance', label: 'Tenant Maintenance Responsibilities', default: true },
          { id: 'subletting', label: 'No Subletting Without Consent', default: true },
        ]
      },
      { 
        id: 'rent-commercial', 
        name: 'Commercial Lease Agreement', 
        description: 'Lease contract for commercial properties and shops',
        difficulty: 'Complex',
        estimatedTime: '8 min',
        fields: [
          { id: 'lessorName', label: 'Lessor (Owner) Name', type: 'text', required: true },
          { id: 'lessorCnic', label: 'Lessor CNIC', type: 'cnic', required: true },
          { id: 'lesseeName', label: 'Lessee (Business) Name', type: 'text', required: true },
          { id: 'lesseeCnic', label: 'Authorized Representative CNIC', type: 'cnic', required: true },
          { id: 'businessType', label: 'Type of Business', type: 'text', required: true },
          { id: 'propertyAddress', label: 'Commercial Property Address', type: 'textarea', required: true },
          { id: 'monthlyRent', label: 'Monthly Rent (PKR)', type: 'number', required: true },
          { id: 'advanceRent', label: 'Advance Rent (Months)', type: 'select', required: true, options: [
            { value: '1', label: '1 Month' },
            { value: '3', label: '3 Months' },
            { value: '6', label: '6 Months' },
          ]},
          { id: 'leaseTerm', label: 'Lease Term', type: 'select', required: true, options: [
            { value: '1', label: '1 Year' },
            { value: '3', label: '3 Years' },
            { value: '5', label: '5 Years' },
          ]},
          { id: 'permittedUse', label: 'Permitted Use', type: 'text', required: true, helpText: 'Specify exact business activities allowed' },
        ]
      },
      { 
        id: 'sale-deed', 
        name: 'Property Sale Deed', 
        description: 'Transfer of immovable property ownership',
        difficulty: 'Complex',
        estimatedTime: '10 min',
        fields: [
          { id: 'sellerName', label: 'Seller (Vendor) Name', type: 'text', required: true },
          { id: 'sellerCnic', label: 'Seller CNIC', type: 'cnic', required: true },
          { id: 'buyerName', label: 'Buyer (Purchaser) Name', type: 'text', required: true },
          { id: 'buyerCnic', label: 'Buyer CNIC', type: 'cnic', required: true },
          { id: 'propertyDescription', label: 'Property Description', type: 'textarea', required: true, helpText: 'Include plot number, measuring, location as per registry' },
          { id: 'totalAmount', label: 'Total Sale Amount (PKR)', type: 'number', required: true },
          { id: 'advanceAmount', label: 'Advance Amount Paid (PKR)', type: 'number', required: true },
          { id: 'balanceAmount', label: 'Balance Amount (PKR)', type: 'number', required: true },
          { id: 'possessionDate', label: 'Date of Possession', type: 'date', required: true },
        ]
      },
      { 
        id: 'power-attorney', 
        name: 'Power of Attorney', 
        description: 'Authorize someone to act on your behalf for property or legal matters',
        difficulty: 'Standard',
        estimatedTime: '6 min',
        fields: [
          { id: 'principalName', label: 'Principal (Grantor) Name', type: 'text', required: true },
          { id: 'principalCnic', label: 'Principal CNIC', type: 'cnic', required: true },
          { id: 'attorneyName', label: 'Attorney (Agent) Name', type: 'text', required: true },
          { id: 'attorneyCnic', label: 'Attorney CNIC', type: 'cnic', required: true },
          { id: 'powers', label: 'Scope of Powers', type: 'select', required: true, options: [
            { value: 'property', label: 'Property Matters Only' },
            { value: 'court', label: 'Court and Legal Proceedings' },
            { value: 'banking', label: 'Banking Transactions' },
            { value: 'general', label: 'General (All Matters)' },
          ]},
          { id: 'propertyDetails', label: 'Property Details (if applicable)', type: 'textarea', helpText: 'Required if powers include property matters' },
          { id: 'validityPeriod', label: 'Validity Period', type: 'select', required: true, options: [
            { value: '6', label: '6 Months' },
            { value: '12', label: '1 Year' },
            { value: 'permanent', label: 'Until Revoked' },
          ]},
          { id: 'irrevocable', label: 'Is this Irrevocable?', type: 'select', options: [
            { value: 'no', label: 'No (Can be revoked anytime)' },
            { value: 'yes', label: 'Yes (Cannot be revoked unilaterally)' },
          ]},
        ]
      },
    ]
  },
  {
    id: 'business',
    name: 'Business & Corporate',
    description: 'Partnership deeds, MOUs, employment contracts',
    icon: Building2,
    color: 'bg-blue-500',
    templates: [
      { 
        id: 'partnership', 
        name: 'Partnership Deed', 
        description: 'Define terms of business partnership under Partnership Act 1932',
        difficulty: 'Complex',
        estimatedTime: '12 min',
        fields: [
          { id: 'firmName', label: 'Firm Name', type: 'text', required: true, placeholder: 'As registered or to be registered' },
          { id: 'businessAddress', label: 'Principal Place of Business', type: 'textarea', required: true },
          { id: 'businessNature', label: 'Nature of Business', type: 'text', required: true },
          { id: 'partner1Name', label: 'Partner 1 Name', type: 'text', required: true },
          { id: 'partner1Cnic', label: 'Partner 1 CNIC', type: 'cnic', required: true },
          { id: 'partner1Share', label: 'Partner 1 Profit Share (%)', type: 'number', required: true },
          { id: 'partner1Capital', label: 'Partner 1 Capital Contribution (PKR)', type: 'number', required: true },
          { id: 'partner2Name', label: 'Partner 2 Name', type: 'text', required: true },
          { id: 'partner2Cnic', label: 'Partner 2 CNIC', type: 'cnic', required: true },
          { id: 'partner2Share', label: 'Partner 2 Profit Share (%)', type: 'number', required: true },
          { id: 'partner2Capital', label: 'Partner 2 Capital Contribution (PKR)', type: 'number', required: true },
          { id: 'accountingYear', label: 'Financial Year End', type: 'date', required: true },
          { id: 'bankerName', label: 'Bankers Name', type: 'text', placeholder: 'Name of bank for firm account' },
        ]
      },
      { 
        id: 'mou', 
        name: 'Memorandum of Understanding', 
        description: 'Non-binding agreement outlining preliminary understanding',
        difficulty: 'Simple',
        estimatedTime: '4 min',
        fields: [
          { id: 'partyAName', label: 'Party A Name', type: 'text', required: true },
          { id: 'partyBName', label: 'Party B Name', type: 'text', required: true },
          { id: 'purpose', label: 'Purpose of MOU', type: 'textarea', required: true },
          { id: 'keyTerms', label: 'Key Terms', type: 'textarea', required: true, placeholder: 'Bullet points of main terms' },
          { id: 'validityDays', label: 'Validity (Days)', type: 'number', required: true, placeholder: '90' },
          { id: 'exclusive', label: 'Exclusive Arrangement?', type: 'select', options: [
            { value: 'yes', label: 'Yes - Parties cannot negotiate with others' },
            { value: 'no', label: 'No - Non-exclusive' },
          ]},
        ]
      },
      { 
        id: 'employment', 
        name: 'Employment Contract', 
        description: 'Comprehensive employment agreement compliant with labor laws',
        difficulty: 'Standard',
        estimatedTime: '7 min',
        fields: [
          { id: 'employerName', label: 'Employer/Company Name', type: 'text', required: true },
          { id: 'employeeName', label: 'Employee Full Name', type: 'text', required: true },
          { id: 'employeeCnic', label: 'Employee CNIC', type: 'cnic', required: true },
          { id: 'designation', label: 'Job Title/Designation', type: 'text', required: true },
          { id: 'department', label: 'Department', type: 'text', required: true },
          { id: 'startDate', label: 'Joining Date', type: 'date', required: true },
          { id: 'salary', label: 'Monthly Gross Salary (PKR)', type: 'number', required: true },
          { id: 'probationMonths', label: 'Probation Period (Months)', type: 'select', required: true, options: [
            { value: '3', label: '3 Months' },
            { value: '6', label: '6 Months' },
          ]},
          { id: 'noticePeriod', label: 'Notice Period (Days)', type: 'select', required: true, options: [
            { value: '30', label: '30 Days' },
            { value: '60', label: '60 Days' },
            { value: '90', label: '90 Days' },
          ]},
          { id: 'benefits', label: 'Additional Benefits', type: 'textarea', placeholder: 'Health insurance, car, etc.' },
        ]
      },
      { 
        id: 'nda', 
        name: 'Non-Disclosure Agreement', 
        description: 'Protect confidential business information',
        difficulty: 'Standard',
        estimatedTime: '5 min',
        fields: [
          { id: 'disclosingParty', label: 'Disclosing Party Name', type: 'text', required: true },
          { id: 'receivingParty', label: 'Receiving Party Name', type: 'text', required: true },
          { id: 'purpose', label: 'Purpose of Disclosure', type: 'textarea', required: true },
          { id: 'confidentialInfo', label: 'Description of Confidential Info', type: 'textarea', required: true },
          { id: 'termYears', label: 'Term (Years)', type: 'select', required: true, options: [
            { value: '2', label: '2 Years' },
            { value: '3', label: '3 Years' },
            { value: '5', label: '5 Years' },
          ]},
          { id: 'returnPeriod', label: 'Return Period (Days after termination)', type: 'number', required: true, placeholder: '30' },
          { id: 'jurisdictionNda', label: 'Jurisdiction for Disputes', type: 'text', required: true, placeholder: 'City/High Court jurisdiction' },
        ]
      },
    ]
  },
  {
    id: 'family',
    name: 'Family & Personal',
    description: 'Affidavits, guardianship, wills',
    icon: Users,
    color: 'bg-rose-500',
    templates: [
      { 
        id: 'affidavit', 
        name: 'General Affidavit', 
        description: 'Sworn statement for various legal purposes',
        difficulty: 'Simple',
        estimatedTime: '3 min',
        fields: [
          { id: 'deponentName', label: 'Deponent Name (Person swearing)', type: 'text', required: true },
          { id: 'deponentCnic', label: 'Deponent CNIC', type: 'cnic', required: true },
          { id: 'fatherHusbandName', label: 'Father/Husband Name', type: 'text', required: true },
          { id: 'address', label: 'Complete Address', type: 'textarea', required: true },
          { id: 'purpose', label: 'Purpose of Affidavit', type: 'select', required: true, options: [
            { value: 'residence', label: 'Proof of Residence' },
            { value: 'relationship', label: 'Relationship Proof' },
            { value: 'income', label: 'Income/Salary Certificate' },
            { value: 'same_person', label: 'Same Person (Name difference)' },
            { value: 'other', label: 'Other (Specify in details)' },
          ]},
          { id: 'statement', label: 'Statement/Declaration', type: 'textarea', required: true, placeholder: 'I solemnly affirm that...' },
        ]
      },
      { 
        id: 'name-change', 
        name: 'Name Change Affidavit', 
        description: 'Legal declaration for name change',
        difficulty: 'Simple',
        estimatedTime: '3 min',
        fields: [
          { id: 'oldName', label: 'Current/Old Name', type: 'text', required: true },
          { id: 'newName', label: 'New Name', type: 'text', required: true },
          { id: 'cnicNumber', label: 'CNIC Number', type: 'cnic', required: true },
          { id: 'fatherName', label: 'Father Name', type: 'text', required: true },
          { id: 'address', label: 'Residential Address', type: 'textarea', required: true },
          { id: 'reason', label: 'Reason for Name Change', type: 'select', required: true, options: [
            { value: 'spelling', label: 'Spelling Correction' },
            { value: 'marriage', label: 'After Marriage' },
            { value: 'religious', label: 'Religious Conversion' },
            { value: 'personal', label: 'Personal Preference' },
          ]},
          { id: 'publication', label: 'Already Published in Newspaper?', type: 'select', options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]},
        ]
      },
      { 
        id: 'guardianship', 
        name: 'Guardianship Declaration', 
        description: 'Appoint a legal guardian for minor or incapacitated person',
        difficulty: 'Standard',
        estimatedTime: '6 min',
        fields: [
          { id: 'guardianName', label: 'Proposed Guardian Name', type: 'text', required: true },
          { id: 'guardianCnic', label: 'Guardian CNIC', type: 'cnic', required: true },
          { id: 'guardianRelation', label: 'Relationship with Ward', type: 'text', required: true },
          { id: 'wardName', label: 'Ward (Minor) Name', type: 'text', required: true },
          { id: 'wardDob', label: 'Ward Date of Birth', type: 'date', required: true },
          { id: 'fatherName', label: 'Father Name (if living)', type: 'text' },
          { id: 'motherName', label: 'Mother Name', type: 'text', required: true },
          { id: 'reason', label: 'Reason for Guardianship', type: 'textarea', required: true },
          { id: 'assets', label: 'Property/Assets of Ward', type: 'textarea', placeholder: 'List immovable property if any' },
        ]
      },
      { 
        id: 'will', 
        name: 'Simple Will (Wasiyat)', 
        description: 'Last will and testament under Islamic inheritance laws',
        difficulty: 'Complex',
        estimatedTime: '15 min',
        fields: [
          { id: 'testatorName', label: 'Testator Name', type: 'text', required: true },
          { id: 'testatorCnic', label: 'Testator CNIC', type: 'cnic', required: true },
          { id: 'age', label: 'Age (Must be adult and sound mind)', type: 'number', required: true },
          { id: 'address', label: 'Residential Address', type: 'textarea', required: true },
          { id: 'executorName', label: 'Executor Name', type: 'text', required: true, helpText: 'Person who will execute the will' },
          { id: 'executorCnic', label: 'Executor CNIC', type: 'cnic', required: true },
          { id: 'bequestDetails', label: 'Bequest Details (if any)', type: 'textarea', helpText: 'Remember: Only 1/3 can be bequeathed to non-heirs without consent' },
          { id: 'specificGifts', label: 'Specific Gifts/Legacies', type: 'textarea', placeholder: 'Specific items to specific people' },
          { id: 'residuaryClause', label: 'Residuary Estate', type: 'textarea', required: true, placeholder: 'Distribution of remaining estate per Islamic shares' },
        ]
      },
    ]
  },
  {
    id: 'court',
    name: 'Court & Litigation',
    description: 'Legal notices, bail applications, petitions',
    icon: Scale,
    color: 'bg-amber-500',
    templates: [
      { 
        id: 'legal-notice', 
        name: 'Legal Notice', 
        description: 'Formal legal communication before filing suit',
        difficulty: 'Standard',
        estimatedTime: '8 min',
        fields: [
          { id: 'senderName', label: 'Sender/Client Name', type: 'text', required: true },
          { id: 'senderAddress', label: 'Sender Address', type: 'textarea', required: true },
          { id: 'recipientName', label: 'Recipient Name', type: 'text', required: true },
          { id: 'recipientAddress', label: 'Recipient Address', type: 'textarea', required: true },
          { id: 'causeOfAction', label: 'Cause of Action', type: 'textarea', required: true, placeholder: 'Brief facts of the dispute' },
          { id: 'reliefSought', label: 'Relief/Demand', type: 'textarea', required: true, placeholder: 'What you want the recipient to do' },
          { id: 'timeLimit', label: 'Time to Comply (Days)', type: 'select', required: true, options: [
            { value: '7', label: '7 Days' },
            { value: '15', label: '15 Days' },
            { value: '30', label: '30 Days' },
          ]},
          { id: 'lawyerName', label: 'Advocate Name (if through lawyer)', type: 'text' },
          { id: 'lawyerEnrollment', label: 'Advocate Enrollment Number', type: 'text' },
        ]
      },
      { 
        id: 'bail-application', 
        name: 'Bail Application', 
        description: 'Application for bail under CrPC',
        difficulty: 'Complex',
        estimatedTime: '10 min',
        fields: [
          { id: 'courtName', label: 'Court Name', type: 'text', required: true, placeholder: 'e.g., Additional Sessions Judge, Lahore' },
          { id: 'firNumber', label: 'FIR Number', type: 'text', required: true },
          { id: 'policeStation', label: 'Police Station', type: 'text', required: true },
          { id: 'sections', label: 'Sections of Law', type: 'text', required: true, placeholder: 'e.g., 302 PPC, 34 PPC' },
          { id: 'applicantName', label: 'Applicant/Accused Name', type: 'text', required: true },
          { id: 'applicantCnic', label: 'Applicant CNIC', type: 'cnic', required: true },
          { id: 'fatherName', label: 'Father Name', type: 'text', required: true },
          { id: 'address', label: 'Permanent Address', type: 'textarea', required: true },
          { id: 'arrestDate', label: 'Date of Arrest', type: 'date', required: true },
          { id: 'grounds', label: 'Grounds for Bail', type: 'textarea', required: true, placeholder: 'Legal and factual grounds' },
          { id: 'suretyAmount', label: 'Proposed Surety Amount (PKR)', type: 'number', required: true },
          { id: 'lawyerName', label: 'Advocate Name', type: 'text', required: true },
        ]
      },
    ]
  },
]

// ==================== HELPER FUNCTIONS ====================

const validateCnic = (cnic: string): string | null => {
  const cnicRegex = /^\d{5}-\d{7}-\d$/
  if (!cnic) return 'CNIC is required'
  if (!cnicRegex.test(cnic)) return 'Invalid CNIC format (XXXXX-XXXXXXX-X)'
  return null
}

const formatCnic = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length <= 5) return cleaned
  if (cleaned.length <= 12) return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 12)}-${cleaned.slice(12, 13)}`
}

// ==================== SUB-COMPONENTS ====================

const StepIndicator = ({ currentStep, totalSteps, stepLabels }: { currentStep: number; totalSteps: number; stepLabels: string[] }) => (
  <div className="mb-8">
    <div className="flex justify-between mb-2">
      {stepLabels.map((label, idx) => {
        const stepNum = idx + 1
        const isActive = stepNum === currentStep
        const isCompleted = stepNum < currentStep
        return (
          <div key={idx} className="flex flex-col items-center flex-1">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 mb-1",
              isActive ? 'bg-primary text-primary-foreground scale-110 shadow-lg' :
              isCompleted ? 'bg-emerald-500 text-white' :
              'bg-muted text-muted-foreground'
            )}>
              {isCompleted ? <Check className="h-4 w-4" /> : stepNum}
            </div>
            <span className={cn(
              "text-xs font-medium transition-colors hidden sm:block",
              isActive ? 'text-primary' :
              isCompleted ? 'text-emerald-600' :
              'text-muted-foreground'
            )}>
              {label}
            </span>
          </div>
        )
      })}
    </div>
    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
      <div 
        className="absolute h-full bg-gradient-to-r from-emerald-500 to-primary transition-all duration-500 ease-out rounded-full"
        style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
      />
    </div>
  </div>
)

const FormFieldComponent = ({ 
  field, 
  value, 
  onChange, 
  error 
}: { 
  field: FormField; 
  value: string; 
  onChange: (value: string) => void;
  error?: string
}) => {
  const inputClasses = cn(
    "transition-all duration-200",
    error && "border-red-500 focus-visible:ring-red-500"
  )

  const renderInput = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.id}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={cn("min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", inputClasses)}
          />
        )
      case 'select':
        return (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className={inputClasses}>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case 'cnic':
        return (
          <Input
            id={field.id}
            placeholder={field.placeholder || 'XXXXX-XXXXXXX-X'}
            value={value || ''}
            onChange={(e) => onChange(formatCnic(e.target.value))}
            maxLength={15}
            className={inputClasses}
          />
        )
      case 'number':
        return (
          <Input
            id={field.id}
            type="number"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={inputClasses}
          />
        )
      case 'date':
        return (
          <Input
            id={field.id}
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={inputClasses}
          />
        )
      default:
        return (
          <Input
            id={field.id}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={inputClasses}
          />
        )
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={field.id} className="flex items-center gap-1">
          {field.label}
          {field.required && <span className="text-red-500">*</span>}
        </Label>
        {field.helpText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{field.helpText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {renderInput()}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 animate-in slide-in-from-top-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  )
}

// ==================== MAIN COMPONENT ====================

export default function DocumentsPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [jurisdiction, setJurisdiction] = useState('')
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<FormErrors>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [savedDocuments, setSavedDocuments] = useState<SavedDocument[]>([])
  const [activeTab, setActiveTab] = useState<'new' | 'saved'>('new')
  const [templateSearch, setTemplateSearch] = useState('')
  const [selectedClauses, setSelectedClauses] = useState<Record<string, boolean>>({})

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('legalDocuments')
    if (saved) {
      try {
        setSavedDocuments(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse saved documents')
      }
    }
    
    // Check for draft
    const draft = localStorage.getItem('documentDraft')
    if (draft) {
      // Optional: Show recovery dialog
    }
  }, [])

  // Auto-save draft
  useEffect(() => {
    if (step > 1 && selectedTemplate) {
      const draft = {
        step,
        selectedCategory,
        selectedTemplate,
        jurisdiction,
        formData,
        savedAt: new Date().toISOString()
      }
      localStorage.setItem('documentDraft', JSON.stringify(draft))
    }
  }, [step, selectedCategory, selectedTemplate, jurisdiction, formData])

  const selectedCategoryData = documentCategories.find(c => c.id === selectedCategory)
  const selectedTemplateData = selectedCategoryData?.templates.find(t => t.id === selectedTemplate)

  const totalSteps = 4
  const stepLabels = ['Category', 'Template', 'Details', 'Download']

  // Validation logic
  const validateStep = useCallback((stepNum: number): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    if (stepNum === 3 && selectedTemplateData) {
      selectedTemplateData.fields.forEach(field => {
        if (field.required && !formData[field.id]) {
          newErrors[field.id] = `${field.label} is required`
          isValid = false
        }
        if (field.type === 'cnic' && formData[field.id]) {
          const cnicError = validateCnic(formData[field.id])
          if (cnicError) {
            newErrors[field.id] = cnicError
            isValid = false
          }
        }
        if (field.validation && formData[field.id]) {
          const customError = field.validation(formData[field.id])
          if (customError) {
            newErrors[field.id] = customError
            isValid = false
          }
        }
      })
    }

    setErrors(newErrors)
    return isValid
  }, [formData, selectedTemplateData])

  const handleNext = () => {
    if (step === 3 && !validateStep(3)) {
      // Shake animation or scroll to error
      const firstError = document.querySelector('.text-red-500')
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    
    if (step < totalSteps) {
      setStep(step + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSaveDocument = () => {
  if (!selectedTemplateData || !selectedCategoryData || !selectedTemplate || !selectedCategory) return
  
  const jurisdictionName = jurisdictions.find(j => j.id === jurisdiction)?.name || ''
  
  const newDoc: SavedDocument = {
    id: Date.now().toString(),
    templateId: selectedTemplate, // now guaranteed string
    templateName: selectedTemplateData.name,
    categoryName: selectedCategoryData.name,
    jurisdictionName: jurisdictionName,
    formData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isFavorite: false
  }
  
  const updated = [newDoc, ...savedDocuments].slice(0, 10)
  setSavedDocuments(updated)
  localStorage.setItem('legalDocuments', JSON.stringify(updated))
  setShowSuccess(true)
}

  const loadSavedDocument = (doc: SavedDocument) => {
    const cat = documentCategories.find(c => c.name === doc.categoryName)
    const temp = cat?.templates.find(t => t.name === doc.templateName)
    
    if (cat && temp) {
      setSelectedCategory(cat.id)
      setSelectedTemplate(temp.id)
      setJurisdiction(jurisdictions.find(j => j.name === doc.jurisdictionName)?.id || '')
      setFormData(doc.formData)
      setStep(3)
      setActiveTab('new')
    }
  }

  const deleteSavedDocument = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = savedDocuments.filter(d => d.id !== id)
    setSavedDocuments(updated)
    localStorage.setItem('legalDocuments', JSON.stringify(updated))
  }

  const handleDownload = async (format: 'pdf' | 'docx') => {
    setIsGenerating(true)
    // Simulate generation
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsGenerating(false)
    
    // In real app, trigger actual download
    alert(`Document generated as ${format.toUpperCase()}! In production, this would download the actual file.`)
  }



  // Render Steps
  const renderStep1 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Select Document Category</h2>
        <p className="text-muted-foreground">Choose the type of legal document you need to create</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentCategories.map((category) => (
          <Card
            key={category.id}
            className={cn(
              "cursor-pointer transition-all duration-300 hover:shadow-lg group relative overflow-hidden",
              selectedCategory === category.id 
                ? 'border-2 border-primary bg-primary/5 ring-2 ring-primary/20' 
                : 'hover:border-primary/30 border-2 border-transparent'
            )}
            onClick={() => setSelectedCategory(category.id)}
          >
            <div className={cn(
              "absolute top-0 right-0 w-24 h-24 opacity-10 rounded-bl-full transition-transform group-hover:scale-110",
              category.color
            )} />
            <CardContent className="p-6 relative">
              <div className="flex items-start gap-4">
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-md", category.color)}>
                  <category.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    {selectedCategory === category.id && (
                      <CheckCircle2 className="h-5 w-5 text-primary animate-in zoom-in" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                  <p className="text-xs text-muted-foreground mt-2 font-medium">
                    {category.templates.length} templates available
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Select Template</h2>
        <p className="text-muted-foreground">Choose a specific document template from {selectedCategoryData?.name}</p>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          value={templateSearch}
          onChange={(e) => setTemplateSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {selectedCategoryData && (
        <div className="grid grid-cols-1 gap-4">
          {selectedCategoryData.templates.map((template) => (
            <Card
              key={template.id}
              className={cn(
                "cursor-pointer transition-all duration-300 hover:shadow-md",
                selectedTemplate === template.id 
                  ? 'border-2 border-primary bg-primary/5' 
                  : 'hover:border-primary/30'
              )}
              onClick={() => {
                setSelectedTemplate(template.id)
                // Initialize clauses
                if (template.clauses) {
                  const initialClauses: Record<string, boolean> = {}
                  template.clauses.forEach(c => initialClauses[c.id] = c.default)
                  setSelectedClauses(initialClauses)
                }
              }}
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold">{template.name}</h3>
                    <Badge variant={template.difficulty === 'Simple' ? 'default' : template.difficulty === 'Standard' ? 'secondary' : 'destructive'}>
                      {template.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {template.estimatedTime}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
                {selectedTemplate === template.id && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center animate-in zoom-in">
                    <Check className="h-5 w-5 text-primary-foreground" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className={cn(
        "mt-6 p-4 rounded-lg border bg-muted/50 transition-all duration-300",
        jurisdiction ? 'border-primary/30 bg-primary/5' : 'border-muted'
      )}>
        <Label className="mb-2 block font-semibold flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Jurisdiction
          <span className="text-red-500">*</span>
        </Label>
        <Select value={jurisdiction} onValueChange={setJurisdiction}>
          <SelectTrigger className="w-full bg-background">
            <SelectValue placeholder="Select jurisdiction for this document" />
          </SelectTrigger>
          <SelectContent>
            {jurisdictions.map((j) => (
              <SelectItem key={j.id} value={j.id}>{j.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-2">
          This determines applicable laws and stamp duty calculations
        </p>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Document Details</h2>
        <p className="text-muted-foreground">Fill in the required information for {selectedTemplateData?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {selectedTemplateData?.fields.map((field) => (
          <div key={field.id} className={cn(
            field.type === 'textarea' && "md:col-span-2"
          )}>
            <FormFieldComponent
              field={field}
              value={formData[field.id] || ''}
              onChange={(value) => {
                setFormData(prev => ({ ...prev, [field.id]: value }))
                if (errors[field.id]) {
                  setErrors(prev => { const n = { ...prev }; delete n[field.id]; return n })
                }
              }}
              error={errors[field.id]}
            />
          </div>
        ))}
      </div>

      {selectedTemplateData?.clauses && (
        <div className="mt-8 p-6 bg-muted/30 rounded-lg border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            Additional Clauses
          </h3>
          <div className="space-y-3">
            {selectedTemplateData.clauses.map(clause => (
              <label key={clause.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-background transition-colors cursor-pointer border border-transparent hover:border-border">
                <input
                  type="checkbox"
                  checked={selectedClauses[clause.id] ?? clause.default}
                  onChange={(e) => setSelectedClauses(prev => ({ ...prev, [clause.id]: e.target.checked }))}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">{clause.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <Alert className="bg-amber-50 border-amber-200 text-amber-900">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-sm text-amber-800">
          Please verify all information carefully. Incorrect details may invalidate your document.
        </AlertDescription>
      </Alert>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Preview & Download</h2>
        <p className="text-muted-foreground">Review your document carefully before downloading</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Template</span>
                <span className="font-medium">{selectedTemplateData?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Jurisdiction</span>
                <span className="font-medium">{jurisdictions.find(j => j.id === jurisdiction)?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{selectedCategoryData?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Generated On</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              
              <div className="pt-4 space-y-2">
                <Button 
                  onClick={() => handleDownload('pdf')} 
                  disabled={isGenerating}
                  className="w-full bg-red-600 hover:bg-red-700"
                  size="lg"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Download PDF
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownload('docx')}
                    disabled={isGenerating}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    DOCX
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => window.print()}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={handleSaveDocument}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save to My Documents
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => {}}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => {}}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Text
            </Button>
          </div>
        </div>

        <Card className="bg-muted overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-background border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Live Preview
            </CardTitle>
            <Badge variant="outline" className="text-xs">Page 1 of 2</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="bg-white dark:bg-slate-900 p-8 m-4 rounded shadow-sm min-h-[800px] font-serif text-slate-900 leading-relaxed">
                <div className="text-center mb-8 border-b-2 border-slate-900 pb-4">
                  <h1 className="text-2xl font-bold uppercase tracking-wide mb-2">
                    {selectedTemplateData?.name}
                  </h1>
                  <p className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                    {jurisdictions.find(j => j.id === jurisdiction)?.name}, Islamic Republic of Pakistan
                  </p>
                </div>
                
                <div className="space-y-6 text-justify">
                  <p className="leading-7">
                    <strong>THIS DOCUMENT</strong> is made and executed on this{' '}
                    <span className="border-b border-slate-400 px-4">{new Date().getDate()}</span> day of{' '}
                    <span className="border-b border-slate-400 px-4">{new Date().toLocaleString('default', { month: 'long' })}</span>,{' '}
                    <span className="border-b border-slate-400 px-4">{new Date().getFullYear()}</span>
                  </p>

                  <div className="space-y-4">
                    <p className="font-bold uppercase tracking-wide text-sm text-slate-600">Between</p>
                    
                    {selectedTemplateData?.fields.slice(0, 2).map((field, idx) => (
                      <div key={field.id} className="ml-4 pl-4 border-l-2 border-slate-300">
                        <p className="font-semibold text-lg">{formData[field.id] || `[${field.label}]`}</p>
                        {formData[`${field.id.replace('Name', 'Cnic')}`] && (
                          <p className="text-sm text-slate-600 mt-1">
                            CNIC: {formData[`${field.id.replace('Name', 'Cnic')}`]}
                          </p>
                        )}
                        {idx === 0 && <p className="text-sm font-medium mt-2 text-slate-700">(Hereinafter referred to as the "First Party")</p>}
                        {idx === 1 && <p className="text-sm font-medium mt-2 text-slate-700">(Hereinafter referred to as the "Second Party")</p>}
                      </div>
                    ))}

                    {selectedTemplateData?.fields.find(f => f.id.includes('address') || f.id.includes('Address')) && (
                      <div className="mt-4 p-3 bg-slate-50 rounded border text-sm">
                        <strong>Address:</strong> {formData[selectedTemplateData.fields.find(f => f.id.includes('address') || f.id.includes('Address'))?.id || ''] || '[Address]'}
                      </div>
                    )}
                  </div>

                  <div className="mt-8">
                    <p className="font-bold uppercase tracking-wide text-sm text-slate-600 mb-4">Witnesseth</p>
                    <p className="leading-7 first-letter:text-3xl first-letter:font-bold first-letter:mr-1 first-letter:float-left">
                      WHEREAS the First Party is desirous of [purpose of agreement based on template type] and the Second Party has agreed to [reciprocal obligations], 
                      now therefore this agreement witnesseth as follows:
                    </p>
                  </div>

                  <div className="mt-6 space-y-4">
                    <p className="font-semibold">1. <span className="underline">Term and Duration</span></p>
                    <p className="ml-4 leading-7">
                      This agreement shall commence from the date first written above and shall remain in force for the period stipulated herein 
                      or until terminated in accordance with the provisions hereof.
                    </p>
                    
                    {selectedTemplateData?.clauses?.filter(c => selectedClauses[c.id]).map((clause, idx) => (
                      <div key={clause.id}>
                        <p className="font-semibold">{idx + 2}. <span className="underline">{clause.label}</span></p>
                        <p className="ml-4 leading-7 text-slate-700">
                          [Standard legal text for {clause.label} as per Pakistani law and jurisdiction of {jurisdictions.find(j => j.id === jurisdiction)?.name}]
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 pt-8 border-t">
                    <p className="font-bold mb-8">In witness whereof, the parties have set their hands on the date first above written.</p>
                    
                    <div className="grid grid-cols-2 gap-8 mt-8">
                      <div>
                        <p className="font-bold mb-8 border-b border-slate-400 pb-1 inline-block">First Party</p>
                        <p className="text-sm text-slate-600">Signature</p>
                      </div>
                      <div>
                        <p className="font-bold mb-8 border-b border-slate-400 pb-1 inline-block">Second Party</p>
                        <p className="text-sm text-slate-600">Signature</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 pt-4 text-xs text-slate-500 border-t border-dashed">
                    <p className="font-semibold mb-1">Important Legal Notice:</p>
                    <p>This is a computer-generated preview. The actual document may vary based on jurisdiction-specific requirements. 
                    Please consult a licensed advocate before execution.</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background py-8 print:bg-white print:py-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl print:max-w-none print:px-0">
        {/* Header - Hidden in print */}
        <div className="print:hidden">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary flex items-center gap-1 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>Document Generator</span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Legal Document Generator
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Create professional, legally compliant documents tailored to Pakistani jurisdiction in minutes
            </p>
          </div>
        </div>

        {/* Main Content */}
        {activeTab === 'new' ? (
          <>
            <StepIndicator currentStep={step} totalSteps={totalSteps} stepLabels={stepLabels} />

            <Card className="mb-6 shadow-lg border-0 print:shadow-none print:border-0">
              <CardContent className="p-6 print:p-0">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center print:hidden">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className="gap-2"
                size="lg"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>

              {step < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !selectedCategory) ||
                    (step === 2 && (!selectedTemplate || !jurisdiction))
                  }
                  className="gap-2 bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  size="lg"
                >
                  Create Another Document
                </Button>
              )}
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap justify-center gap-4 print:hidden">
              <Badge variant="outline" className="px-4 py-2 text-sm border-emerald-200 bg-emerald-50 text-emerald-700">
                <Shield className="h-4 w-4 mr-2" />
                Legally Compliant
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm border-blue-200 bg-blue-50 text-blue-700">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Province Specific
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm border-amber-200 bg-amber-50 text-amber-700">
                <FileCheck className="h-4 w-4 mr-2" />
                Updated 2025
              </Badge>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 print:hidden">
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                <strong>Disclaimer:</strong> These templates provide general legal formats and guidance only. 
                For complex legal matters or specific advice, please consult a qualified advocate licensed to practice in Pakistan. 
                The generated documents should be reviewed by a legal professional before execution.
              </p>
            </div>
          </>
        ) : (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">My Saved Documents</h2>
              <Button onClick={() => setActiveTab('new')}>
                Create New Document
              </Button>
            </div>
            
            {savedDocuments.length === 0 ? (
              <div className="text-center py-16 bg-muted/30 rounded-lg border border-dashed">
                <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No saved documents</h3>
                <p className="text-muted-foreground mb-4">Your recently created documents will appear here</p>
                <Button onClick={() => setActiveTab('new')}>Create Your First Document</Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {savedDocuments.map((doc) => (
                  <Card 
                    key={doc.id} 
                    className="cursor-pointer hover:shadow-md transition-all"
                    onClick={() => loadSavedDocument(doc)}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{doc.templateName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {doc.categoryName} • {doc.jurisdictionName} • {new Date(doc.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => deleteSavedDocument(doc.id, e)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Floating Action for Saved Docs */}
        <div className="fixed bottom-6 right-6 print:hidden">
          <Button
            size="lg"
            className="shadow-lg rounded-full h-14 px-6"
            onClick={() => setActiveTab(activeTab === 'new' ? 'saved' : 'new')}
          >
            {activeTab === 'new' ? (
              <>
                <History className="h-5 w-5 mr-2" />
                My Documents
              </>
            ) : (
              <>
                <FileText className="h-5 w-5 mr-2" />
                New Document
              </>
            )}
          </Button>
        </div>

        {/* Success Modal */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                Document Saved!
              </DialogTitle>
              <DialogDescription>
                Your document has been saved to "My Documents" for future access.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowSuccess(false)}>
                Continue Editing
              </Button>
              <Button onClick={() => { setShowSuccess(false); setActiveTab('saved'); }}>
                View My Documents
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}