import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, Building, User, MapPin, Phone, Mail, Globe, 
  FileText, Shield, DollarSign, Clock, Star, CheckCircle, Upload, 
  Briefcase, Award, Users, CreditCard, FileSignature, AlertCircle,
  ChevronRight, Save
} from 'lucide-react';

interface PartnerRegistrationProps {
  onComplete?: () => void;
}

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 
  'Wisconsin', 'Wyoming', 'Puerto Rico', 'US Virgin Islands'
];

const PartnerRegistration: React.FC<PartnerRegistrationProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Company Information
    companyName: '',
    entityType: '',
    taxId: '',
    yearEstablished: '',
    numberOfEmployees: '',
    website: '',
    companyAddress: '',
    companyCity: '',
    companyState: '',
    companyZip: '',
    
    // Step 2: Primary Contact
    primaryFirstName: '',
    primaryLastName: '',
    primaryTitle: '',
    primaryEmail: '',
    primaryPhone: '',
    primaryMobile: '',
    secondaryFirstName: '',
    secondaryLastName: '',
    secondaryTitle: '',
    secondaryEmail: '',
    secondaryPhone: '',
    
    // Step 3: Service Areas & Specialties
    serviceCategories: [] as string[],
    statesLicensed: [] as string[],
    specializations: [] as string[],
    yearsInBusiness: '',
    projectsCompleted: '',
    averageResponseTime: '',
    emergencyAvailable: false,
    
    // Step 4: Insurance & Certifications
    generalLiability: false,
    generalLiabilityAmount: '',
    generalLiabilityExpiry: '',
    professionalLiability: false,
    professionalLiabilityAmount: '',
    professionalLiabilityExpiry: '',
    workersComp: false,
    workersCompAmount: '',
    workersCompExpiry: '',
    certifications: [] as string[],
    licenses: [] as string[],
    
    // Step 5: Financial Information
    billingMethod: '',
    paymentTerms: '',
    bankName: '',
    accountType: '',
    routingNumber: '',
    accountNumber: '',
    preferredPaymentMethod: '',
    w9Uploaded: false,
    
    // Step 6: References
    references: [
      { company: '', contact: '', phone: '', email: '', relationship: '' },
      { company: '', contact: '', phone: '', email: '', relationship: '' },
      { company: '', contact: '', phone: '', email: '', relationship: '' }
    ],
    
    // Step 7: Agreements & Terms
    termsAccepted: false,
    nondisclosureAccepted: false,
    codeOfConductAccepted: false,
    backgroundCheckConsent: false,
    dataPrivacyAccepted: false,
    signatureName: '',
    signatureTitle: '',
    signatureDate: '',
    
    // Step 8: Documents Upload
    businessLicense: null as File | null,
    insuranceCertificates: [] as File[],
    w9Form: null as File | null,
    portfolio: [] as File[],
    additionalDocs: [] as File[]
  });

  const steps = [
    { number: 1, title: 'Company Information', icon: Building },
    { number: 2, title: 'Contact Details', icon: User },
    { number: 3, title: 'Service Areas', icon: MapPin },
    { number: 4, title: 'Insurance & Certifications', icon: Shield },
    { number: 5, title: 'Financial Information', icon: DollarSign },
    { number: 6, title: 'References', icon: Users },
    { number: 7, title: 'Agreements & Terms', icon: FileSignature },
    { number: 8, title: 'Document Upload', icon: Upload }
  ];

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Submitting partner registration:', formData);
    alert('Partner registration submitted successfully! You will receive a confirmation email shortly.');
    if (onComplete) {
      onComplete();
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={step.number} className="flex items-center">
            <div 
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                currentStep === step.number 
                  ? 'bg-primary-600 text-white' 
                  : currentStep > step.number 
                  ? 'bg-green-600 text-white'
                  : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'
              }`}
            >
              {currentStep > step.number ? (
                <CheckCircle size={20} />
              ) : (
                <Icon size={20} />
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-full h-1 mx-2 transition-colors ${
                currentStep > step.number 
                  ? 'bg-green-600' 
                  : 'bg-neutral-200 dark:bg-neutral-700'
              }`} style={{ width: '60px' }} />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Company Information</h2>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => updateFormData('companyName', e.target.value)}
            className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter company name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Entity Type *
          </label>
          <select
            value={formData.entityType}
            onChange={(e) => updateFormData('entityType', e.target.value)}
            className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select entity type</option>
            <option value="LLC">LLC</option>
            <option value="Corporation">Corporation</option>
            <option value="Partnership">Partnership</option>
            <option value="Sole Proprietorship">Sole Proprietorship</option>
            <option value="Non-Profit">Non-Profit</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Tax ID / EIN *
          </label>
          <input
            type="text"
            value={formData.taxId}
            onChange={(e) => updateFormData('taxId', e.target.value)}
            className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="XX-XXXXXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Year Established *
          </label>
          <input
            type="text"
            value={formData.yearEstablished}
            onChange={(e) => updateFormData('yearEstablished', e.target.value)}
            className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="YYYY"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Number of Employees
          </label>
          <select
            value={formData.numberOfEmployees}
            onChange={(e) => updateFormData('numberOfEmployees', e.target.value)}
            className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select range</option>
            <option value="1-5">1-5</option>
            <option value="6-10">6-10</option>
            <option value="11-25">11-25</option>
            <option value="26-50">26-50</option>
            <option value="51-100">51-100</option>
            <option value="100+">100+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => updateFormData('website', e.target.value)}
            className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="https://www.example.com"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Company Address</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Street Address *
            </label>
            <input
              type="text"
              value={formData.companyAddress}
              onChange={(e) => updateFormData('companyAddress', e.target.value)}
              className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="123 Main Street"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              City *
            </label>
            <input
              type="text"
              value={formData.companyCity}
              onChange={(e) => updateFormData('companyCity', e.target.value)}
              className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="City"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              State *
            </label>
            <select
              value={formData.companyState}
              onChange={(e) => updateFormData('companyState', e.target.value)}
              className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select state</option>
              {US_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              ZIP Code *
            </label>
            <input
              type="text"
              value={formData.companyZip}
              onChange={(e) => updateFormData('companyZip', e.target.value)}
              className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="12345"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Contact Details</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Primary Contact</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={formData.primaryFirstName}
                onChange={(e) => updateFormData('primaryFirstName', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.primaryLastName}
                onChange={(e) => updateFormData('primaryLastName', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Title/Position *
              </label>
              <input
                type="text"
                value={formData.primaryTitle}
                onChange={(e) => updateFormData('primaryTitle', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.primaryEmail}
                onChange={(e) => updateFormData('primaryEmail', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Office Phone *
              </label>
              <input
                type="tel"
                value={formData.primaryPhone}
                onChange={(e) => updateFormData('primaryPhone', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Mobile Phone
              </label>
              <input
                type="tel"
                value={formData.primaryMobile}
                onChange={(e) => updateFormData('primaryMobile', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Secondary Contact (Optional)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={formData.secondaryFirstName}
                onChange={(e) => updateFormData('secondaryFirstName', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formData.secondaryLastName}
                onChange={(e) => updateFormData('secondaryLastName', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Title/Position
              </label>
              <input
                type="text"
                value={formData.secondaryTitle}
                onChange={(e) => updateFormData('secondaryTitle', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.secondaryEmail}
                onChange={(e) => updateFormData('secondaryEmail', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.secondaryPhone}
                onChange={(e) => updateFormData('secondaryPhone', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Service Areas & Specialties</h2>
      
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Service Categories</h3>
        <div className="grid grid-cols-3 gap-3">
          {['Attorney', 'Engineer', 'Appraiser', 'Umpire', 'Contractor', 'Restoration', 'Roofing', 'Plumbing', 'Electrical', 'HVAC', 'Public Adjuster', 'Other'].map(category => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.serviceCategories.includes(category)}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateFormData('serviceCategories', [...formData.serviceCategories, category]);
                  } else {
                    updateFormData('serviceCategories', formData.serviceCategories.filter(c => c !== category));
                  }
                }}
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-neutral-700 dark:text-neutral-300">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">States Licensed to Operate</h3>
        <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg">
          {US_STATES.map(state => (
            <label key={state} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.statesLicensed.includes(state)}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateFormData('statesLicensed', [...formData.statesLicensed, state]);
                  } else {
                    updateFormData('statesLicensed', formData.statesLicensed.filter(s => s !== state));
                  }
                }}
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">{state}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Specializations</h3>
        <div className="grid grid-cols-2 gap-3">
          {['Residential Claims', 'Commercial Claims', 'Hurricane/Wind', 'Flood', 'Fire', 'Hail', 'Water Damage', 'Mold', 'Foundation', 'Liability', 'Auto', 'Workers Comp'].map(spec => (
            <label key={spec} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.specializations.includes(spec)}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateFormData('specializations', [...formData.specializations, spec]);
                  } else {
                    updateFormData('specializations', formData.specializations.filter(s => s !== spec));
                  }
                }}
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-neutral-700 dark:text-neutral-300">{spec}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Average Response Time
          </label>
          <select
            value={formData.averageResponseTime}
            onChange={(e) => updateFormData('averageResponseTime', e.target.value)}
            className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select response time</option>
            <option value="immediate">Immediate (&lt; 1 hour)</option>
            <option value="same-day">Same Day</option>
            <option value="24-hours">24 Hours</option>
            <option value="48-hours">48 Hours</option>
            <option value="3-5-days">3-5 Days</option>
          </select>
        </div>
        <div className="flex items-center">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.emergencyAvailable}
              onChange={(e) => updateFormData('emergencyAvailable', e.target.checked)}
              className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-neutral-700 dark:text-neutral-300">Available for Emergency Response (24/7)</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Insurance & Certifications</h2>
      
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Insurance Coverage</h3>
        
        <div className="space-y-4">
          <div className="p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg">
            <label className="flex items-center space-x-2 mb-3">
              <input
                type="checkbox"
                checked={formData.generalLiability}
                onChange={(e) => updateFormData('generalLiability', e.target.checked)}
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="font-medium text-neutral-700 dark:text-neutral-300">General Liability Insurance</span>
            </label>
            {formData.generalLiability && (
              <div className="grid grid-cols-2 gap-4 ml-6">
                <div>
                  <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Coverage Amount</label>
                  <input
                    type="text"
                    value={formData.generalLiabilityAmount}
                    onChange={(e) => updateFormData('generalLiabilityAmount', e.target.value)}
                    className="w-full px-3 py-1 border border-neutral-200 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    placeholder="$1,000,000"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.generalLiabilityExpiry}
                    onChange={(e) => updateFormData('generalLiabilityExpiry', e.target.value)}
                    className="w-full px-3 py-1 border border-neutral-200 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg">
            <label className="flex items-center space-x-2 mb-3">
              <input
                type="checkbox"
                checked={formData.professionalLiability}
                onChange={(e) => updateFormData('professionalLiability', e.target.checked)}
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="font-medium text-neutral-700 dark:text-neutral-300">Professional Liability / E&O Insurance</span>
            </label>
            {formData.professionalLiability && (
              <div className="grid grid-cols-2 gap-4 ml-6">
                <div>
                  <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Coverage Amount</label>
                  <input
                    type="text"
                    value={formData.professionalLiabilityAmount}
                    onChange={(e) => updateFormData('professionalLiabilityAmount', e.target.value)}
                    className="w-full px-3 py-1 border border-neutral-200 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    placeholder="$1,000,000"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.professionalLiabilityExpiry}
                    onChange={(e) => updateFormData('professionalLiabilityExpiry', e.target.value)}
                    className="w-full px-3 py-1 border border-neutral-200 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg">
            <label className="flex items-center space-x-2 mb-3">
              <input
                type="checkbox"
                checked={formData.workersComp}
                onChange={(e) => updateFormData('workersComp', e.target.checked)}
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="font-medium text-neutral-700 dark:text-neutral-300">Workers' Compensation Insurance</span>
            </label>
            {formData.workersComp && (
              <div className="grid grid-cols-2 gap-4 ml-6">
                <div>
                  <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Coverage Amount</label>
                  <input
                    type="text"
                    value={formData.workersCompAmount}
                    onChange={(e) => updateFormData('workersCompAmount', e.target.value)}
                    className="w-full px-3 py-1 border border-neutral-200 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    placeholder="$500,000"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.workersCompExpiry}
                    onChange={(e) => updateFormData('workersCompExpiry', e.target.value)}
                    className="w-full px-3 py-1 border border-neutral-200 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Professional Certifications & Licenses</h3>
        <div className="grid grid-cols-2 gap-3">
          {['State License', 'IICRC Certified', 'EPA RRP Certified', 'OSHA Certified', 'BBB Accredited', 'Industry Association Member', 'Bonded', 'Other'].map(cert => (
            <label key={cert} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.certifications.includes(cert)}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateFormData('certifications', [...formData.certifications, cert]);
                  } else {
                    updateFormData('certifications', formData.certifications.filter(c => c !== cert));
                  }
                }}
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-neutral-700 dark:text-neutral-300">{cert}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Financial Information</h2>
      
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Billing & Payment</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Preferred Billing Method *
            </label>
            <select
              value={formData.billingMethod}
              onChange={(e) => updateFormData('billingMethod', e.target.value)}
              className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select billing method</option>
              <option value="hourly">Hourly Rate</option>
              <option value="project">Project-Based</option>
              <option value="retainer">Retainer</option>
              <option value="contingency">Contingency</option>
              <option value="mixed">Mixed/Negotiable</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Payment Terms *
            </label>
            <select
              value={formData.paymentTerms}
              onChange={(e) => updateFormData('paymentTerms', e.target.value)}
              className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select payment terms</option>
              <option value="net-15">Net 15</option>
              <option value="net-30">Net 30</option>
              <option value="net-45">Net 45</option>
              <option value="net-60">Net 60</option>
              <option value="due-on-receipt">Due on Receipt</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Banking Information (for Direct Deposit)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Bank Name
            </label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => updateFormData('bankName', e.target.value)}
              className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Account Type
            </label>
            <select
              value={formData.accountType}
              onChange={(e) => updateFormData('accountType', e.target.value)}
              className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select account type</option>
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Routing Number
            </label>
            <input
              type="text"
              value={formData.routingNumber}
              onChange={(e) => updateFormData('routingNumber', e.target.value)}
              className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="9 digits"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Account Number
            </label>
            <input
              type="text"
              value={formData.accountNumber}
              onChange={(e) => updateFormData('accountNumber', e.target.value)}
              className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Tax Information</h3>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.w9Uploaded}
            onChange={(e) => updateFormData('w9Uploaded', e.target.checked)}
            className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-neutral-700 dark:text-neutral-300">I will provide a completed W-9 form</span>
        </label>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">References</h2>
      <p className="text-neutral-600 dark:text-neutral-400">Please provide at least 3 professional references</p>
      
      {[0, 1, 2].map((index) => (
        <div key={index} className="p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Reference {index + 1}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.references[index].company}
                onChange={(e) => {
                  const newRefs = [...formData.references];
                  newRefs[index].company = e.target.value;
                  updateFormData('references', newRefs);
                }}
                className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Contact Name *
              </label>
              <input
                type="text"
                value={formData.references[index].contact}
                onChange={(e) => {
                  const newRefs = [...formData.references];
                  newRefs[index].contact = e.target.value;
                  updateFormData('references', newRefs);
                }}
                className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.references[index].phone}
                onChange={(e) => {
                  const newRefs = [...formData.references];
                  newRefs[index].phone = e.target.value;
                  updateFormData('references', newRefs);
                }}
                className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.references[index].email}
                onChange={(e) => {
                  const newRefs = [...formData.references];
                  newRefs[index].email = e.target.value;
                  updateFormData('references', newRefs);
                }}
                className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Relationship / Type of Work *
              </label>
              <input
                type="text"
                value={formData.references[index].relationship}
                onChange={(e) => {
                  const newRefs = [...formData.references];
                  newRefs[index].relationship = e.target.value;
                  updateFormData('references', newRefs);
                }}
                className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Provided restoration services for 3 years"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderStep7 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Agreements & Terms</h2>
      
      <div className="space-y-4">
        <div className="p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={(e) => updateFormData('termsAccepted', e.target.checked)}
              className="mt-1 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <div>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">Terms of Service</span>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                I agree to the Partner Network Terms of Service, including payment terms, service level agreements, and performance standards.
              </p>
            </div>
          </label>
        </div>

        <div className="p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.nondisclosureAccepted}
              onChange={(e) => updateFormData('nondisclosureAccepted', e.target.checked)}
              className="mt-1 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <div>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">Non-Disclosure Agreement</span>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                I agree to maintain confidentiality of all client information and proprietary business information.
              </p>
            </div>
          </label>
        </div>

        <div className="p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.codeOfConductAccepted}
              onChange={(e) => updateFormData('codeOfConductAccepted', e.target.checked)}
              className="mt-1 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <div>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">Code of Conduct</span>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                I agree to adhere to professional standards, ethical business practices, and maintain appropriate licensing and insurance.
              </p>
            </div>
          </label>
        </div>

        <div className="p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.backgroundCheckConsent}
              onChange={(e) => updateFormData('backgroundCheckConsent', e.target.checked)}
              className="mt-1 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <div>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">Background Check Authorization</span>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                I authorize Coastal Claims to conduct background checks as part of the partner verification process.
              </p>
            </div>
          </label>
        </div>

        <div className="p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.dataPrivacyAccepted}
              onChange={(e) => updateFormData('dataPrivacyAccepted', e.target.checked)}
              className="mt-1 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <div>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">Data Privacy Policy</span>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                I acknowledge and agree to the collection and use of business information as outlined in the Privacy Policy.
              </p>
            </div>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Electronic Signature</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.signatureName}
              onChange={(e) => updateFormData('signatureName', e.target.value)}
              className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Type your full legal name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.signatureTitle}
              onChange={(e) => updateFormData('signatureTitle', e.target.value)}
              className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Your title/position"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Date *
            </label>
            <input
              type="date"
              value={formData.signatureDate}
              onChange={(e) => updateFormData('signatureDate', e.target.value)}
              className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep8 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Document Upload</h2>
      <p className="text-neutral-600 dark:text-neutral-400">Please upload the required documents to complete your registration</p>
      
      <div className="space-y-4">
        <div className="p-4 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-neutral-900 dark:text-neutral-100">Business License *</span>
            {formData.businessLicense && (
              <span className="text-sm text-green-600">✓ Uploaded</span>
            )}
          </div>
          <input
            type="file"
            onChange={(e) => updateFormData('businessLicense', e.target.files?.[0] || null)}
            className="text-sm text-neutral-600 dark:text-neutral-400"
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </div>

        <div className="p-4 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-neutral-900 dark:text-neutral-100">Insurance Certificates *</span>
            {formData.insuranceCertificates.length > 0 && (
              <span className="text-sm text-green-600">✓ {formData.insuranceCertificates.length} file(s)</span>
            )}
          </div>
          <input
            type="file"
            multiple
            onChange={(e) => updateFormData('insuranceCertificates', Array.from(e.target.files || []))}
            className="text-sm text-neutral-600 dark:text-neutral-400"
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </div>

        <div className="p-4 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-neutral-900 dark:text-neutral-100">W-9 Form *</span>
            {formData.w9Form && (
              <span className="text-sm text-green-600">✓ Uploaded</span>
            )}
          </div>
          <input
            type="file"
            onChange={(e) => updateFormData('w9Form', e.target.files?.[0] || null)}
            className="text-sm text-neutral-600 dark:text-neutral-400"
            accept=".pdf"
          />
        </div>

        <div className="p-4 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-neutral-900 dark:text-neutral-100">Portfolio / Work Samples (Optional)</span>
            {formData.portfolio.length > 0 && (
              <span className="text-sm text-green-600">✓ {formData.portfolio.length} file(s)</span>
            )}
          </div>
          <input
            type="file"
            multiple
            onChange={(e) => updateFormData('portfolio', Array.from(e.target.files || []))}
            className="text-sm text-neutral-600 dark:text-neutral-400"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
        </div>

        <div className="p-4 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-neutral-900 dark:text-neutral-100">Additional Documents (Optional)</span>
            {formData.additionalDocs.length > 0 && (
              <span className="text-sm text-green-600">✓ {formData.additionalDocs.length} file(s)</span>
            )}
          </div>
          <input
            type="file"
            multiple
            onChange={(e) => updateFormData('additionalDocs', Array.from(e.target.files || []))}
            className="text-sm text-neutral-600 dark:text-neutral-400"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-600 mt-0.5" size={20} />
          <div>
            <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">Review Checklist</p>
            <ul className="text-sm text-blue-800 dark:text-blue-200 mt-2 space-y-1">
              <li>✓ All required fields are completed</li>
              <li>✓ Insurance information is current</li>
              <li>✓ References have been notified</li>
              <li>✓ All agreements have been reviewed and accepted</li>
              <li>✓ Required documents are uploaded</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      case 7: return renderStep7();
      case 8: return renderStep8();
      default: return null;
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Partner Registration</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Complete all 8 steps to register as a Coastal Claims partner
        </p>
      </div>

      {renderStepIndicator()}
      
      <div className="mt-8">
        {renderCurrentStep()}
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
            currentStep === 1
              ? 'bg-neutral-100 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'
              : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
          }`}
        >
          <ArrowLeft size={20} />
          Previous
        </button>

        {currentStep < 8 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Next
            <ArrowRight size={20} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CheckCircle size={20} />
            Submit Registration
          </button>
        )}
      </div>
    </div>
  );
};

export default PartnerRegistration;