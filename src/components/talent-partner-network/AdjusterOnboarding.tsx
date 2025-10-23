import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Award, FileText, CheckCircle,
  ChevronRight, ChevronLeft, Upload, Plus, X, Calendar,
  Shield, Briefcase, Clock, AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';
import api from '../../services/talent-partner-network/api';

interface AdjusterOnboardingProps {
  onComplete?: (adjusterId: string) => void;
  onCancel?: () => void;
}

const SPECIALIZATIONS = [
  'Property', 'Auto', 'Catastrophe', 'Commercial', 'Residential', 
  'Fire', 'Flood', 'Wind', 'Hail', 'Liability', 'Workers Comp',
  'Marine', 'Aviation', 'Crop', 'Earthquake', 'Public Adjusting'
];

const STATE_CODES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const LICENSE_TYPES = [
  'All Lines', 'Property', 'Casualty', 'Auto', 'Workers Compensation',
  'General Lines', 'Personal Lines', 'Commercial Lines'
];

const AdjusterOnboarding: React.FC<AdjusterOnboardingProps> = ({ 
  onComplete, 
  onCancel 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Professional Information
    experience: '',
    currentEmployer: '',
    specializations: [] as string[],
    certifications: [] as string[],
    
    // Licenses
    licenses: [] as Array<{
      state: string;
      number: string;
      type: string;
      expires: string;
    }>,
    
    // Availability
    availability: 'available' as 'available' | 'deployed' | 'unavailable',
    deploymentPreferences: [] as string[],
    willingToTravel: false,
    travelRadius: '',
    
    // Documents
    resume: null as File | null,
    certificationDocs: [] as File[],
    references: [] as Array<{
      name: string;
      title: string;
      company: string;
      phone: string;
      email: string;
    }>
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 5;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Personal Information
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
        break;
        
      case 2: // Professional Information
        if (!formData.experience) newErrors.experience = 'Years of experience is required';
        if (formData.specializations.length === 0) {
          newErrors.specializations = 'At least one specialization is required';
        }
        break;
        
      case 3: // Licenses
        if (formData.licenses.length === 0) {
          newErrors.licenses = 'At least one license is required';
        }
        break;
        
      case 4: // Availability
        if (formData.willingToTravel && !formData.travelRadius) {
          newErrors.travelRadius = 'Travel radius is required when willing to travel';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleAddLicense = () => {
    setFormData({
      ...formData,
      licenses: [
        ...formData.licenses,
        { state: '', number: '', type: 'All Lines', expires: '' }
      ]
    });
  };

  const handleRemoveLicense = (index: number) => {
    setFormData({
      ...formData,
      licenses: formData.licenses.filter((_, i) => i !== index)
    });
  };

  const handleLicenseChange = (index: number, field: string, value: string) => {
    const updatedLicenses = [...formData.licenses];
    updatedLicenses[index] = { ...updatedLicenses[index], [field]: value };
    setFormData({ ...formData, licenses: updatedLicenses });
  };

  const handleAddReference = () => {
    setFormData({
      ...formData,
      references: [
        ...formData.references,
        { name: '', title: '', company: '', phone: '', email: '' }
      ]
    });
  };

  const handleRemoveReference = (index: number) => {
    setFormData({
      ...formData,
      references: formData.references.filter((_, i) => i !== index)
    });
  };

  const handleReferenceChange = (index: number, field: string, value: string) => {
    const updatedReferences = [...formData.references];
    updatedReferences[index] = { ...updatedReferences[index], [field]: value };
    setFormData({ ...formData, references: updatedReferences });
  };

  const handleSpecializationToggle = (spec: string) => {
    if (formData.specializations.includes(spec)) {
      setFormData({
        ...formData,
        specializations: formData.specializations.filter(s => s !== spec)
      });
    } else {
      setFormData({
        ...formData,
        specializations: [...formData.specializations, spec]
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare adjuster data
      const adjusterData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        currentLocation: `${formData.city}, ${formData.state}`,
        licenses: formData.licenses.map(l => ({
          ...l,
          expires: new Date(l.expires),
          status: 'active' as const
        })),
        specializations: formData.specializations,
        availability: formData.availability,
        experience: parseInt(formData.experience),
        type: 'internal' as const,
        rating: 0,
        totalClaims: 0,
        avgResponseTime: 'N/A'
      };

      const result = await api.createAdjuster(adjusterData);
      
      toast.success('Adjuster onboarding completed successfully!');
      if (onComplete) {
        onComplete(result.id);
      }
    } catch (error) {
      console.error('Error submitting adjuster:', error);
      toast.error('Failed to complete onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={errors.address ? 'border-red-500' : ''}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => setFormData({ ...formData, state: value })}
                  >
                    <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATE_CODES.map(state => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className={errors.zipCode ? 'border-red-500' : ''}
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="experience">Years of Experience *</Label>
                    <Input
                      id="experience"
                      type="number"
                      min="0"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className={errors.experience ? 'border-red-500' : ''}
                    />
                    {errors.experience && (
                      <p className="text-red-500 text-sm mt-1">{errors.experience}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="employer">Current Employer</Label>
                    <Input
                      id="employer"
                      value={formData.currentEmployer}
                      onChange={(e) => setFormData({ ...formData, currentEmployer: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Specializations *</Label>
                  <p className="text-sm text-gray-500 mb-2">Select all that apply</p>
                  {errors.specializations && (
                    <Alert className="mb-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.specializations}</AlertDescription>
                    </Alert>
                  )}
                  <div className="grid grid-cols-3 gap-3">
                    {SPECIALIZATIONS.map((spec) => (
                      <div key={spec} className="flex items-center space-x-2">
                        <Checkbox
                          id={spec}
                          checked={formData.specializations.includes(spec)}
                          onCheckedChange={() => handleSpecializationToggle(spec)}
                        />
                        <Label htmlFor={spec} className="cursor-pointer text-sm">
                          {spec}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="certifications">Additional Certifications</Label>
                  <Textarea
                    id="certifications"
                    placeholder="List any additional certifications (e.g., CPCU, AIC, etc.)"
                    value={formData.certifications.join(', ')}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      certifications: e.target.value.split(',').map(c => c.trim()).filter(c => c)
                    })}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">License Information</h2>
              {errors.licenses && (
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.licenses}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                {formData.licenses.map((license, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-medium">License #{index + 1}</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveLicense(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>State</Label>
                          <Select
                            value={license.state}
                            onValueChange={(value) => handleLicenseChange(index, 'state', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {STATE_CODES.map(state => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>License Number</Label>
                          <Input
                            value={license.number}
                            onChange={(e) => handleLicenseChange(index, 'number', e.target.value)}
                            placeholder="Enter license number"
                          />
                        </div>
                        <div>
                          <Label>License Type</Label>
                          <Select
                            value={license.type}
                            onValueChange={(value) => handleLicenseChange(index, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {LICENSE_TYPES.map(type => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Expiration Date</Label>
                          <Input
                            type="date"
                            value={license.expires}
                            onChange={(e) => handleLicenseChange(index, 'expires', e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddLicense}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add License
                </Button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Availability & Preferences</h2>
              <div className="space-y-4">
                <div>
                  <Label>Current Availability</Label>
                  <Select
                    value={formData.availability}
                    onValueChange={(value: any) => setFormData({ ...formData, availability: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="deployed">Currently Deployed</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox
                      id="travel"
                      checked={formData.willingToTravel}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, willingToTravel: checked as boolean })
                      }
                    />
                    <Label htmlFor="travel">Willing to travel for deployments</Label>
                  </div>
                  
                  {formData.willingToTravel && (
                    <div>
                      <Label htmlFor="radius">Maximum Travel Radius (miles) *</Label>
                      <Input
                        id="radius"
                        type="number"
                        min="0"
                        value={formData.travelRadius}
                        onChange={(e) => setFormData({ ...formData, travelRadius: e.target.value })}
                        className={errors.travelRadius ? 'border-red-500' : ''}
                      />
                      {errors.travelRadius && (
                        <p className="text-red-500 text-sm mt-1">{errors.travelRadius}</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <Label>Deployment Preferences</Label>
                  <p className="text-sm text-gray-500 mb-2">Select preferred states for deployment</p>
                  <div className="grid grid-cols-6 gap-2">
                    {STATE_CODES.map((state) => (
                      <div key={state} className="flex items-center space-x-1">
                        <Checkbox
                          id={`deploy-${state}`}
                          checked={formData.deploymentPreferences.includes(state)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                deploymentPreferences: [...formData.deploymentPreferences, state]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                deploymentPreferences: formData.deploymentPreferences.filter(s => s !== state)
                              });
                            }
                          }}
                        />
                        <Label htmlFor={`deploy-${state}`} className="cursor-pointer text-xs">
                          {state}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">References & Documents</h2>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-2">Professional References</Label>
                  <div className="space-y-4">
                    {formData.references.map((reference, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="font-medium">Reference #{index + 1}</h3>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveReference(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Name</Label>
                              <Input
                                value={reference.name}
                                onChange={(e) => handleReferenceChange(index, 'name', e.target.value)}
                                placeholder="Full name"
                              />
                            </div>
                            <div>
                              <Label>Title</Label>
                              <Input
                                value={reference.title}
                                onChange={(e) => handleReferenceChange(index, 'title', e.target.value)}
                                placeholder="Job title"
                              />
                            </div>
                            <div>
                              <Label>Company</Label>
                              <Input
                                value={reference.company}
                                onChange={(e) => handleReferenceChange(index, 'company', e.target.value)}
                                placeholder="Company name"
                              />
                            </div>
                            <div>
                              <Label>Phone</Label>
                              <Input
                                value={reference.phone}
                                onChange={(e) => handleReferenceChange(index, 'phone', e.target.value)}
                                placeholder="Phone number"
                              />
                            </div>
                            <div className="col-span-2">
                              <Label>Email</Label>
                              <Input
                                type="email"
                                value={reference.email}
                                onChange={(e) => handleReferenceChange(index, 'email', e.target.value)}
                                placeholder="Email address"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddReference}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Reference
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-2">Document Upload</Label>
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="resume" className="cursor-pointer">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400">
                              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm text-gray-600">
                                {formData.resume ? formData.resume.name : 'Click to upload resume'}
                              </p>
                            </div>
                          </Label>
                          <Input
                            id="resume"
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setFormData({ ...formData, resume: file });
                              }
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Adjuster Onboarding</CardTitle>
          <CardDescription>
            Complete the onboarding process to join our talent network
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={(currentStep / totalSteps) * 100} className="mb-2" />
            <p className="text-sm text-gray-500 text-center">
              Step {currentStep} of {totalSteps}
            </p>
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <div>
              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={isSubmitting}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
              
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Onboarding
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdjusterOnboarding;