import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, MapPin, Users, Filter, User, Briefcase, Phone, Mail, Award, 
  Plus, Building, ChevronDown, Network, Shield, CheckCircle, Clock,
  AlertCircle, BarChart3, TrendingUp, Globe, Star, UserCheck, X,
  ChevronRight, FileText, Calendar, DollarSign, Activity, ChevronUp, 
  ArrowLeft, AlertTriangle, Navigation, Home, Layers, Settings,
  RefreshCw, Database, FileCheck, Map, UserPlus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { toast } from 'sonner';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import PartnerRegistration from '../components/talent-partner-network/PartnerRegistration';

// State codes and names
const STATE_CODES: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
  'DC': 'District of Columbia'
};

// Specializations
const SPECIALIZATIONS = [
  'Property', 'Auto', 'Catastrophe', 'Commercial', 'Residential', 
  'Fire', 'Flood', 'Wind', 'Hail', 'Liability', 'Workers Comp'
];

// Partner Services
const PARTNER_SERVICES = [
  'Engineering', 'Restoration', 'Roofing', 'Plumbing', 'Electrical',
  'HVAC', 'Mold Remediation', 'Water Extraction', 'Contents', 'Legal'
];

// Types for our data
interface License {
  state: string;
  number: string;
  expires: Date;
  status: 'active' | 'expiring' | 'expired';
  type: string;
}

interface Adjuster {
  id: string;
  name: string;
  type: 'internal';
  licenses: License[];
  currentLocation: string;
  deploymentHistory: any[];
  specializations: string[];
  availability: 'available' | 'deployed' | 'unavailable';
  ratings: { average: number; count: number };
  email: string;
  phone: string;
  employeeId: string;
  yearsExperience?: number;
  certifications?: string[];
}

interface Partner {
  id: string;
  companyName: string;
  type: 'external';
  serviceAreas: string[];
  services: string[];
  currentCapacity: number;
  activeProjects: number;
  contactName: string;
  email: string;
  phone: string;
  rating: number;
  contractStatus: 'active' | 'pending' | 'expired';
  insuranceVerified?: boolean;
  preferredVendor?: boolean;
}

// Mock data generator for realistic testing
const generateMockAdjusters = (): Adjuster[] => {
  const adjusters: Adjuster[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      type: 'internal',
      licenses: [
        { state: 'FL', number: 'FL-2024-0001', expires: new Date('2025-12-31'), status: 'active', type: 'All Lines' },
        { state: 'TX', number: 'TX-2024-0001', expires: new Date('2025-06-30'), status: 'active', type: 'Property' },
        { state: 'SC', number: 'SC-2024-0001', expires: new Date('2025-03-15'), status: 'expiring', type: 'Property' },
        { state: 'NC', number: 'NC-2024-0001', expires: new Date('2025-11-30'), status: 'active', type: 'All Lines' }
      ],
      currentLocation: 'FL',
      deploymentHistory: [],
      specializations: ['Property', 'Catastrophe', 'Commercial'],
      availability: 'available',
      ratings: { average: 4.8, count: 342 },
      email: 'sarah.johnson@coastalclaims.com',
      phone: '(555) 123-4567',
      employeeId: 'ADJ-001',
      yearsExperience: 8,
      certifications: ['CPCU', 'AIC']
    },
    {
      id: '2',
      name: 'Michael Chen',
      type: 'internal',
      licenses: [
        { state: 'CA', number: 'CA-2024-0002', expires: new Date('2025-09-30'), status: 'active', type: 'Property' },
        { state: 'NV', number: 'NV-2024-0002', expires: new Date('2025-08-31'), status: 'active', type: 'Property' },
        { state: 'AZ', number: 'AZ-2024-0002', expires: new Date('2025-02-28'), status: 'expiring', type: 'Auto' }
      ],
      currentLocation: 'CA',
      deploymentHistory: [],
      specializations: ['Auto', 'Liability', 'Commercial'],
      availability: 'deployed',
      ratings: { average: 4.9, count: 287 },
      email: 'michael.chen@coastalclaims.com',
      phone: '(555) 234-5678',
      employeeId: 'ADJ-002',
      yearsExperience: 6,
      certifications: ['AIC']
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      type: 'internal',
      licenses: [
        { state: 'FL', number: 'FL-2024-0003', expires: new Date('2025-10-31'), status: 'active', type: 'All Lines' },
        { state: 'GA', number: 'GA-2024-0003', expires: new Date('2025-07-31'), status: 'active', type: 'Property' },
        { state: 'AL', number: 'AL-2024-0003', expires: new Date('2025-01-31'), status: 'expiring', type: 'Property' },
        { state: 'MS', number: 'MS-2024-0003', expires: new Date('2024-12-31'), status: 'expired', type: 'Property' }
      ],
      currentLocation: 'GA',
      deploymentHistory: [],
      specializations: ['Wind', 'Hail', 'Catastrophe', 'Residential'],
      availability: 'available',
      ratings: { average: 4.7, count: 198 },
      email: 'emily.rodriguez@coastalclaims.com',
      phone: '(555) 345-6789',
      employeeId: 'ADJ-003',
      yearsExperience: 5,
      certifications: ['CPCU']
    },
    {
      id: '4',
      name: 'James Wilson',
      type: 'internal',
      licenses: [
        { state: 'TX', number: 'TX-2024-0004', expires: new Date('2025-11-30'), status: 'active', type: 'All Lines' },
        { state: 'LA', number: 'LA-2024-0004', expires: new Date('2025-05-31'), status: 'active', type: 'Property' }
      ],
      currentLocation: 'TX',
      deploymentHistory: [],
      specializations: ['Flood', 'Catastrophe', 'Commercial'],
      availability: 'available',
      ratings: { average: 4.6, count: 156 },
      email: 'james.wilson@coastalclaims.com',
      phone: '(555) 456-7890',
      employeeId: 'ADJ-004',
      yearsExperience: 10,
      certifications: ['CPCU', 'AIC', 'NFIP']
    },
    {
      id: '5',
      name: 'Amanda Foster',
      type: 'internal',
      licenses: [
        { state: 'NY', number: 'NY-2024-0005', expires: new Date('2025-09-30'), status: 'active', type: 'All Lines' },
        { state: 'NJ', number: 'NJ-2024-0005', expires: new Date('2025-08-31'), status: 'active', type: 'Property' },
        { state: 'PA', number: 'PA-2024-0005', expires: new Date('2025-07-31'), status: 'active', type: 'Property' },
        { state: 'CT', number: 'CT-2024-0005', expires: new Date('2025-03-31'), status: 'expiring', type: 'Auto' }
      ],
      currentLocation: 'NY',
      deploymentHistory: [],
      specializations: ['Commercial', 'Liability', 'Workers Comp'],
      availability: 'unavailable',
      ratings: { average: 4.9, count: 423 },
      email: 'amanda.foster@coastalclaims.com',
      phone: '(555) 567-8901',
      employeeId: 'ADJ-005',
      yearsExperience: 12,
      certifications: ['CPCU', 'ARM']
    },
    {
      id: '6',
      name: 'Robert Martinez',
      type: 'internal',
      licenses: [
        { state: 'FL', number: 'FL-2024-0006', expires: new Date('2025-08-31'), status: 'active', type: 'All Lines' },
        { state: 'TX', number: 'TX-2024-0006', expires: new Date('2025-09-30'), status: 'active', type: 'All Lines' },
        { state: 'LA', number: 'LA-2024-0006', expires: new Date('2025-07-31'), status: 'active', type: 'Property' }
      ],
      currentLocation: 'TX',
      deploymentHistory: [],
      specializations: ['Catastrophe', 'Commercial', 'Fire'],
      availability: 'available',
      ratings: { average: 4.7, count: 298 },
      email: 'robert.martinez@coastalclaims.com',
      phone: '(555) 678-9012',
      employeeId: 'ADJ-006',
      yearsExperience: 7,
      certifications: ['AIC']
    }
  ];
  return adjusters;
};

const generateMockPartners = (): Partner[] => {
  const partners: Partner[] = [
    {
      id: 'P1',
      companyName: 'Southeast Engineering Group',
      type: 'external',
      serviceAreas: ['FL', 'GA', 'AL', 'SC', 'NC'],
      services: ['Engineering', 'Structural Assessment'],
      currentCapacity: 85,
      activeProjects: 12,
      contactName: 'Robert Hughes',
      email: 'rhughes@seg-engineering.com',
      phone: '(555) 111-2222',
      rating: 4.7,
      contractStatus: 'active',
      insuranceVerified: true,
      preferredVendor: true
    },
    {
      id: 'P2',
      companyName: 'Rapid Restoration Services',
      type: 'external',
      serviceAreas: ['TX', 'LA', 'OK', 'AR'],
      services: ['Restoration', 'Water Extraction', 'Mold Remediation'],
      currentCapacity: 65,
      activeProjects: 8,
      contactName: 'Maria Gonzalez',
      email: 'mgonzalez@rapidrestore.com',
      phone: '(555) 222-3333',
      rating: 4.8,
      contractStatus: 'active',
      insuranceVerified: true,
      preferredVendor: false
    },
    {
      id: 'P3',
      companyName: 'National Roofing Contractors',
      type: 'external',
      serviceAreas: ['FL', 'TX', 'GA', 'SC', 'NC', 'VA'],
      services: ['Roofing', 'Emergency Tarping'],
      currentCapacity: 70,
      activeProjects: 15,
      contactName: 'David Thompson',
      email: 'dthompson@nrc-roofing.com',
      phone: '(555) 333-4444',
      rating: 4.5,
      contractStatus: 'active',
      insuranceVerified: true,
      preferredVendor: true
    },
    {
      id: 'P4',
      companyName: 'Priority Contents Specialists',
      type: 'external',
      serviceAreas: ['CA', 'NV', 'AZ', 'OR', 'WA'],
      services: ['Contents', 'Pack Out', 'Storage'],
      currentCapacity: 90,
      activeProjects: 5,
      contactName: 'Jennifer Lee',
      email: 'jlee@prioritycontents.com',
      phone: '(555) 444-5555',
      rating: 4.9,
      contractStatus: 'active',
      insuranceVerified: true,
      preferredVendor: false
    }
  ];
  return partners;
};

const TalentPartnerNetwork = () => {
  const { user } = useUser();
  const isAdmin = user?.role === 'admin' || user?.role === 'user-admin' || user?.role === 'org-admin';

  // Core filtering state
  const [resourceType, setResourceType] = useState<'all' | 'adjusters' | 'partners'>('all');
  const [selectedLicensedStates, setSelectedLicensedStates] = useState<string[]>([]);
  const [currentLocationFilter, setCurrentLocationFilter] = useState<string>('all');
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [licenseStatusFilter, setLicenseStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'list' | 'map' | 'deployment' | 'states' | 'adjusters' | 'partners'>('list');
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [selectedAdjuster, setSelectedAdjuster] = useState<Adjuster | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPartnerRegistration, setShowPartnerRegistration] = useState(false);
  const [showAdjusterRegistration, setShowAdjusterRegistration] = useState(false);

  // Data
  const [adjusters, setAdjusters] = useState<Adjuster[]>(generateMockAdjusters());
  const [partners, setPartners] = useState<Partner[]>(generateMockPartners());

  // Load data from backend
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Try to fetch from backend
      const [adjustersRes, partnersRes] = await Promise.all([
        axios.get('/api/talent/adjusters').catch(() => null),
        axios.get('/api/talent/partners').catch(() => null)
      ]);

      if (adjustersRes?.data) {
        setAdjusters(adjustersRes.data);
      }
      if (partnersRes?.data) {
        setPartners(partnersRes.data);
      }
    } catch (error) {
      console.log('Using mock data - backend not available');
    } finally {
      setIsLoading(false);
    }
  };

  // Advanced filtering logic
  const filteredData = useMemo(() => {
    let results: any[] = [];

    // Filter adjusters
    if (resourceType === 'adjusters' || resourceType === 'all') {
      const filteredAdjusters = adjusters.filter(adj => {
        // Search filter
        if (searchQuery && !adj.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !adj.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !adj.licenses.some(l => l.number.toLowerCase().includes(searchQuery.toLowerCase()))) {
          return false;
        }

        // Licensed states filter (adjuster must be licensed in ALL selected states)
        if (selectedLicensedStates.length > 0) {
          const adjusterLicensedStates = adj.licenses.map(l => l.state);
          if (!selectedLicensedStates.every(state => adjusterLicensedStates.includes(state))) {
            return false;
          }
        }

        // Current location filter
        if (currentLocationFilter !== 'all' && adj.currentLocation !== currentLocationFilter) {
          return false;
        }

        // Specializations filter
        if (selectedSpecializations.length > 0) {
          if (!selectedSpecializations.some(spec => adj.specializations.includes(spec))) {
            return false;
          }
        }

        // Availability filter
        if (availabilityFilter !== 'all' && adj.availability !== availabilityFilter) {
          return false;
        }

        // License status filter
        if (licenseStatusFilter !== 'all') {
          const hasStatus = adj.licenses.some(l => l.status === licenseStatusFilter);
          if (!hasStatus) return false;
        }

        return true;
      });

      if (resourceType === 'adjusters') {
        results = filteredAdjusters;
      } else {
        results = [...results, ...filteredAdjusters];
      }
    }

    // Filter partners
    if (resourceType === 'partners' || resourceType === 'all') {
      const filteredPartners = partners.filter(partner => {
        // Search filter
        if (searchQuery && !partner.companyName.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !partner.contactName.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }

        // Service areas filter (partner must service ALL selected states)
        if (selectedLicensedStates.length > 0) {
          if (!selectedLicensedStates.every(state => partner.serviceAreas.includes(state))) {
            return false;
          }
        }

        // Services filter (reusing specializations for partners)
        if (selectedSpecializations.length > 0) {
          const partnerServicesLower = partner.services.map(s => s.toLowerCase());
          if (!selectedSpecializations.some(spec => 
            partnerServicesLower.some(service => service.includes(spec.toLowerCase())))) {
            return false;
          }
        }

        return true;
      });

      if (resourceType === 'partners') {
        results = filteredPartners;
      } else {
        results = [...results, ...filteredPartners];
      }
    }

    return results;
  }, [resourceType, selectedLicensedStates, currentLocationFilter, selectedSpecializations, 
      availabilityFilter, licenseStatusFilter, searchQuery, adjusters, partners]);

  // Calculate statistics
  const stats = useMemo(() => {
    const activeStates = new Set<string>();
    let totalLicenses = 0;
    let expiringLicenses = 0;
    let expiredLicenses = 0;
    let availableAdjusters = 0;
    let deployedAdjusters = 0;

    adjusters.forEach(adj => {
      if (adj.availability === 'available') availableAdjusters++;
      if (adj.availability === 'deployed') deployedAdjusters++;
      
      adj.licenses.forEach(license => {
        activeStates.add(license.state);
        totalLicenses++;
        if (license.status === 'expiring') expiringLicenses++;
        if (license.status === 'expired') expiredLicenses++;
      });
    });

    partners.forEach(partner => {
      partner.serviceAreas.forEach(state => activeStates.add(state));
    });

    return {
      activeStates: activeStates.size,
      totalAdjusters: adjusters.length,
      totalPartners: partners.length,
      totalLicenses,
      expiringLicenses,
      expiredLicenses,
      availableAdjusters,
      deployedAdjusters,
      deploymentRate: adjusters.length > 0 ? (deployedAdjusters / adjusters.length * 100).toFixed(1) : 0
    };
  }, [adjusters, partners]);

  // Helper functions
  const toggleStateSelection = (state: string) => {
    setSelectedLicensedStates(prev => 
      prev.includes(state) 
        ? prev.filter(s => s !== state)
        : [...prev, state]
    );
  };

  const toggleSpecialization = (spec: string) => {
    setSelectedSpecializations(prev =>
      prev.includes(spec)
        ? prev.filter(s => s !== spec)
        : [...prev, spec]
    );
  };

  const clearAllFilters = () => {
    setResourceType('all');
    setSelectedLicensedStates([]);
    setCurrentLocationFilter('all');
    setSelectedSpecializations([]);
    setAvailabilityFilter('all');
    setLicenseStatusFilter('all');
    setSearchQuery('');
  };

  const getLicenseStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'expiring':
        return <Badge className="bg-yellow-100 text-yellow-800">Expiring Soon</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      default:
        return null;
    }
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case 'deployed':
        return <Badge className="bg-blue-100 text-blue-800">Deployed</Badge>;
      case 'unavailable':
        return <Badge className="bg-gray-100 text-gray-800">Unavailable</Badge>;
      default:
        return null;
    }
  };

  const deployAdjuster = async (adjusterId: string, targetState: string) => {
    try {
      // API call would go here
      toast.success('Adjuster deployed successfully');
      
      // Update local state
      setAdjusters(prev => prev.map(adj => 
        adj.id === adjusterId 
          ? { ...adj, availability: 'deployed', currentLocation: targetState }
          : adj
      ));
    } catch (error) {
      toast.error('Failed to deploy adjuster');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-[1600px]">
        {/* Header */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Talent & Partner Network
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Multi-state license tracking and deployment management
              </p>
            </div>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setActiveView('states')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeView === 'states' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <MapPin className="w-4 h-4 inline mr-1" />
                States
              </button>
              <button
                onClick={() => setActiveView('adjusters')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeView === 'adjusters' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <User className="w-4 h-4 inline mr-1" />
                Adjusters
              </button>
              <button
                onClick={() => setActiveView('partners')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeView === 'partners' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4 inline mr-1" />
                Partners
              </button>
              <button
                onClick={() => setActiveView('list')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeView === 'list' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4 inline mr-1" />
                Combined
              </button>
              <button
                onClick={() => setActiveView('deployment')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeView === 'deployment' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Navigation className="w-4 h-4 inline mr-1" />
                Deploy
              </button>
              {isAdmin && (
                <>
                  <Button variant="outline" size="sm" onClick={loadData}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Sheet open={showPartnerRegistration} onOpenChange={setShowPartnerRegistration}>
                    <SheetTrigger asChild>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Register Partner
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-4xl overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Partner Registration</SheetTitle>
                        <SheetDescription>
                          Complete the 8-step registration process to become a verified partner
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-6">
                        <PartnerRegistration 
                          onComplete={() => {
                            setShowPartnerRegistration(false);
                            toast.success('Partner registration completed successfully!');
                            loadData(); // Refresh the data
                          }}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </>
              )}
            </div>
          </div>

          {/* Quick Actions for Non-Admin Users */}
          {!isAdmin && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Become a Partner</h3>
                    <p className="text-sm text-gray-600">Join our network of trusted service providers</p>
                  </div>
                  <Sheet open={showPartnerRegistration} onOpenChange={setShowPartnerRegistration}>
                    <SheetTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Register as Partner
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-4xl overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Partner Registration</SheetTitle>
                        <SheetDescription>
                          Complete the 8-step registration process to become a verified partner
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-6">
                        <PartnerRegistration 
                          onComplete={() => {
                            setShowPartnerRegistration(false);
                            toast.success('Partner registration completed successfully!');
                            loadData();
                          }}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active States</p>
                    <p className="text-2xl font-bold">{stats.activeStates}</p>
                  </div>
                  <Globe className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Adjusters</p>
                    <p className="text-2xl font-bold">{stats.totalAdjusters}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Available</p>
                    <p className="text-2xl font-bold">{stats.availableAdjusters}</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Deployed</p>
                    <p className="text-2xl font-bold">{stats.deployedAdjusters}</p>
                  </div>
                  <Navigation className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Expiring</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.expiringLicenses}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Partners</p>
                    <p className="text-2xl font-bold">{stats.totalPartners}</p>
                  </div>
                  <Building className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Search & Filters
                </span>
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  Clear All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Resource Type Selection */}
              <div className="flex items-center space-x-6 pb-4 border-b">
                <Label className="font-semibold">Type:</Label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="resourceType"
                      value="all"
                      checked={resourceType === 'all'}
                      onChange={(e) => setResourceType(e.target.value as any)}
                      className="text-blue-600"
                    />
                    <span>All Resources</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="resourceType"
                      value="adjusters"
                      checked={resourceType === 'adjusters'}
                      onChange={(e) => setResourceType(e.target.value as any)}
                      className="text-blue-600"
                    />
                    <span>Adjusters</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="resourceType"
                      value="partners"
                      checked={resourceType === 'partners'}
                      onChange={(e) => setResourceType(e.target.value as any)}
                      className="text-blue-600"
                    />
                    <span>Partners</span>
                  </label>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, ID, license number, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Multi-State License Filter */}
                <div className="relative">
                  <Label className="text-sm font-medium mb-2 block">Licensed States (ALL of):</Label>
                  <div className="relative">
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => setShowStateDropdown(!showStateDropdown)}
                    >
                      {selectedLicensedStates.length > 0 
                        ? `${selectedLicensedStates.length} states`
                        : 'Select states...'}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    
                    {showStateDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-60 overflow-auto">
                        {Object.entries(STATE_CODES).map(([code, name]) => (
                          <label key={code} className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                            <Checkbox
                              checked={selectedLicensedStates.includes(code)}
                              onCheckedChange={() => toggleStateSelection(code)}
                            />
                            <span className="ml-2 text-sm">{code} - {name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {selectedLicensedStates.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {selectedLicensedStates.map(state => (
                        <Badge key={state} variant="secondary" className="text-xs">
                          {state}
                          <X 
                            className="h-3 w-3 ml-1 cursor-pointer" 
                            onClick={() => toggleStateSelection(state)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Current Location */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Current Location:</Label>
                  <Select value={currentLocationFilter} onValueChange={setCurrentLocationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any location</SelectItem>
                      {Object.entries(STATE_CODES).map(([code, name]) => (
                        <SelectItem key={code} value={code}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Availability:</Label>
                  <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="deployed">Deployed</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* License Status */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">License Status:</Label>
                  <Select value={licenseStatusFilter} onValueChange={setLicenseStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expiring">Expiring Soon</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Specializations */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  {resourceType === 'partners' ? 'Services:' : 'Specializations:'}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {(resourceType === 'partners' ? PARTNER_SERVICES : SPECIALIZATIONS).map(spec => (
                    <Badge
                      key={spec}
                      variant={selectedSpecializations.includes(spec) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleSpecialization(spec)}
                    >
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Found {filteredData.length} {resourceType === 'all' ? 'resources' : resourceType}
              {selectedLicensedStates.length > 0 && ` licensed in ALL of: ${selectedLicensedStates.join(', ')}`}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {activeView === 'list' && (
          <div className="space-y-4">
            {filteredData.map((item) => {
              const isAdjuster = item.type === 'internal';
              
              return (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold">
                              {isAdjuster ? item.name : item.companyName}
                            </h3>
                            <Badge variant={isAdjuster ? 'default' : 'secondary'}>
                              {isAdjuster ? 'Adjuster' : 'Partner'}
                            </Badge>
                            {isAdjuster && getAvailabilityBadge(item.availability)}
                            {!isAdjuster && item.preferredVendor && (
                              <Badge className="bg-purple-100 text-purple-800">
                                <Star className="h-3 w-3 mr-1" />
                                Preferred
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                            {/* Contact Info */}
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail className="h-4 w-4 mr-2" />
                                {item.email}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-4 w-4 mr-2" />
                                {item.phone}
                              </div>
                              {isAdjuster && (
                                <>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <User className="h-4 w-4 mr-2" />
                                    ID: {item.employeeId}
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Award className="h-4 w-4 mr-2" />
                                    {item.yearsExperience} years exp
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Location/Service Info */}
                            <div className="space-y-1">
                              {isAdjuster ? (
                                <>
                                  <div className="flex items-center text-sm">
                                    <Home className="h-4 w-4 mr-2 text-gray-400" />
                                    Currently in: <span className="font-medium ml-1">{STATE_CODES[item.currentLocation]}</span>
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <Shield className="h-4 w-4 mr-2 text-gray-400" />
                                    Licensed in: <span className="font-medium ml-1">{item.licenses.length} states</span>
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <Star className="h-4 w-4 mr-2 text-gray-400" />
                                    Rating: <span className="font-medium ml-1">{item.ratings.average} ({item.ratings.count})</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center text-sm">
                                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                    Services: <span className="font-medium ml-1">{item.serviceAreas.join(', ')}</span>
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <Activity className="h-4 w-4 mr-2 text-gray-400" />
                                    Capacity: <span className="font-medium ml-1">{item.currentCapacity}%</span>
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                                    Active: <span className="font-medium ml-1">{item.activeProjects} projects</span>
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Specializations/Services */}
                            <div>
                              <div className="text-sm text-gray-600 mb-1">
                                {isAdjuster ? 'Specializations:' : 'Services:'}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {(isAdjuster ? item.specializations : item.services).map((spec: string) => (
                                  <Badge key={spec} variant="outline" className="text-xs">
                                    {spec}
                                  </Badge>
                                ))}
                              </div>
                              {isAdjuster && item.certifications && (
                                <div className="mt-2">
                                  <div className="text-sm text-gray-600 mb-1">Certifications:</div>
                                  <div className="flex flex-wrap gap-1">
                                    {item.certifications.map((cert: string) => (
                                      <Badge key={cert} className="text-xs bg-blue-100 text-blue-800">
                                        {cert}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Licenses for Adjusters */}
                          {isAdjuster && (
                            <div className="mt-4 border-t pt-4">
                              <div className="text-sm font-medium mb-2 flex items-center">
                                <FileCheck className="h-4 w-4 mr-2" />
                                State Licenses:
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                {item.licenses.map((license: License, idx: number) => (
                                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2">
                                        <span className="font-medium">{license.state}</span>
                                        <span className="text-xs text-gray-500">{license.type}</span>
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {license.number}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        Exp: {new Date(license.expires).toLocaleDateString()}
                                      </div>
                                    </div>
                                    <div className="ml-2">
                                      {getLicenseStatusBadge(license.status)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="ml-4 space-y-2">
                          {isAdjuster && item.availability === 'available' && isAdmin && (
                            <Button 
                              size="sm" 
                              className="w-full"
                              onClick={() => setSelectedAdjuster(item)}
                            >
                              <Navigation className="h-4 w-4 mr-2" />
                              Deploy
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="w-full">
                            <FileText className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                          {isAdmin && (
                            <Button size="sm" variant="outline" className="w-full">
                              <Settings className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filteredData.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-gray-500">
                    {selectedLicensedStates.length > 0 
                      ? `No resources found licensed in ALL of: ${selectedLicensedStates.join(', ')}`
                      : 'Try adjusting your filters or search query'}
                  </p>
                  <Button variant="outline" className="mt-4" onClick={clearAllFilters}>
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeView === 'map' && (
          <Card>
            <CardHeader>
              <CardTitle>Geographic Coverage Map</CardTitle>
              <CardDescription>
                Visual representation of adjuster licenses and partner coverage by state
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">State Coverage Summary</h3>
                  <div className="space-y-2 max-h-96 overflow-auto">
                    {Object.entries(STATE_CODES).map(([code, name]) => {
                      const adjustersInState = adjusters.filter(adj => 
                        adj.licenses.some(l => l.state === code && l.status === 'active')
                      );
                      const partnersInState = partners.filter(p => 
                        p.serviceAreas.includes(code)
                      );
                      
                      return (
                        <div key={code} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-sm">{code}</span>
                            <span className="text-sm text-gray-600">{name}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4 text-blue-500" />
                              <span className="text-sm">{adjustersInState.length}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Building className="h-4 w-4 text-purple-500" />
                              <span className="text-sm">{partnersInState.length}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 flex items-center justify-center">
                  <div className="text-center">
                    <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Interactive map visualization</p>
                    <p className="text-sm text-gray-400 mt-2">Heat map showing resource density by state</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeView === 'deployment' && (
          <div className="space-y-4">
            {/* Deployment Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Deployment Dashboard</CardTitle>
                <CardDescription>
                  Real-time deployment status and management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {stats.availableAdjusters}
                    </div>
                    <div className="text-sm text-gray-600">Ready to Deploy</div>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.deployedAdjusters}
                    </div>
                    <div className="text-sm text-gray-600">Currently Deployed</div>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {stats.deploymentRate}%
                    </div>
                    <div className="text-sm text-gray-600">Deployment Rate</div>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {stats.activeStates}
                    </div>
                    <div className="text-sm text-gray-600">Active States</div>
                  </div>
                </div>

                {/* Quick Deploy Section */}
                {isAdmin && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3">Quick Deploy</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm mb-2 block">Select Adjuster</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose available adjuster..." />
                          </SelectTrigger>
                          <SelectContent>
                            {adjusters.filter(a => a.availability === 'available').map(adj => (
                              <SelectItem key={adj.id} value={adj.id}>
                                {adj.name} - Licensed in {adj.licenses.length} states
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm mb-2 block">Deploy to State</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose target state..." />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(STATE_CODES).map(([code, name]) => (
                              <SelectItem key={code} value={code}>{name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button className="mt-4">
                      <Navigation className="h-4 w-4 mr-2" />
                      Deploy Adjuster
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Deployments */}
            <Card>
              <CardHeader>
                <CardTitle>Active Deployments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {adjusters.filter(a => a.availability === 'deployed').map(adj => (
                    <div key={adj.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-medium">
                          {adj.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium">{adj.name}</div>
                          <div className="text-sm text-gray-500">
                            Deployed to {STATE_CODES[adj.currentLocation]} • {adj.employeeId}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                        {isAdmin && (
                          <Button size="sm" variant="outline">
                            Recall
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {adjusters.filter(a => a.availability === 'deployed').length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No active deployments
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* License Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                  License Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {adjusters.flatMap(adj => 
                    adj.licenses
                      .filter(l => l.status === 'expiring' || l.status === 'expired')
                      .map(license => ({
                        ...license,
                        adjusterName: adj.name,
                        adjusterId: adj.id
                      }))
                  ).map((alert, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className={`h-5 w-5 ${alert.status === 'expired' ? 'text-red-500' : 'text-yellow-500'}`} />
                        <div>
                          <div className="font-medium text-sm">{alert.adjusterName}</div>
                          <div className="text-sm text-gray-600">
                            {alert.state} license {alert.status === 'expired' ? 'expired' : 'expiring'} - {alert.number}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getLicenseStatusBadge(alert.status)}
                        {isAdmin && (
                          <Button size="sm" variant="outline">
                            Renew
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === 'adjusters' && (
          <div className="space-y-4">
            {/* Adjusters Header with Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search adjusters by name, ID, or license..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={currentLocationFilter} onValueChange={setCurrentLocationFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All States</SelectItem>
                        {Object.entries(STATE_CODES).map(([code, name]) => (
                          <SelectItem key={code} value={code}>
                            {code} - {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="deployed">Deployed</SelectItem>
                        <SelectItem value="unavailable">Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Adjusters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredData
                .filter(item => item.type === 'internal')
                .map((adjuster) => (
                  <Card key={adjuster.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {adjuster.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {adjuster.employeeId}
                          </p>
                          <div className="mt-2">
                            {getAvailabilityBadge(adjuster.availability)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          Currently in: {STATE_CODES[adjuster.currentLocation]}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Shield className="h-4 w-4 mr-2" />
                          Licensed in {adjuster.licenses.length} states
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          {adjuster.phone}
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <div className="text-xs font-medium text-gray-700 mb-2">Licensed States:</div>
                        <div className="flex flex-wrap gap-1">
                          {adjuster.licenses.map((license, idx) => (
                            <Badge 
                              key={idx} 
                              variant={license.status === 'active' ? 'default' : 
                                       license.status === 'expiring' ? 'secondary' : 'destructive'}
                              className="text-xs"
                            >
                              {license.state}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <div className="text-xs font-medium text-gray-700 mb-2">Specializations:</div>
                        <div className="flex flex-wrap gap-1">
                          {adjuster.specializations.map((spec) => (
                            <Badge key={spec} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {filteredData.filter(item => item.type === 'internal').length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No adjusters found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search query</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeView === 'partners' && (
          <div className="space-y-4">
            {/* Partners Header with Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search partners by company, contact, or service..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={currentLocationFilter} onValueChange={setCurrentLocationFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All States</SelectItem>
                        {Object.entries(STATE_CODES).map(([code, name]) => (
                          <SelectItem key={code} value={code}>
                            {code} - {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="relative">
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Services</SelectItem>
                          {PARTNER_SERVICES.map(service => (
                            <SelectItem key={service} value={service}>{service}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Partners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredData
                .filter(item => item.type === 'external')
                .map((partner) => (
                  <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {partner.companyName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {partner.contactName}
                          </p>
                          <div className="mt-2 flex items-center space-x-2">
                            <Badge className={`text-xs ${
                              partner.contractStatus === 'active' ? 'bg-green-100 text-green-800' :
                              partner.contractStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {partner.contractStatus}
                            </Badge>
                            {partner.preferredVendor && (
                              <Badge className="bg-purple-100 text-purple-800 text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Preferred
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          {partner.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          {partner.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Activity className="h-4 w-4 mr-2" />
                          Capacity: {partner.currentCapacity}%
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <div className="text-xs font-medium text-gray-700 mb-2">Service Areas:</div>
                        <div className="flex flex-wrap gap-1">
                          {partner.serviceAreas.map((state) => (
                            <Badge key={state} variant="default" className="text-xs">
                              {state}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <div className="text-xs font-medium text-gray-700 mb-2">Services:</div>
                        <div className="flex flex-wrap gap-1">
                          {partner.services.map((service) => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {filteredData.filter(item => item.type === 'external').length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No partners found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search query</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeView === 'states' && (
          <div className="space-y-4">
            {/* States Overview Header */}
            <Card>
              <CardHeader>
                <CardTitle>State-by-State Resource Overview</CardTitle>
                <CardDescription>
                  Click on any state to view detailed resources and filter by that state
                </CardDescription>
              </CardHeader>
            </Card>

            {/* States Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Object.entries(STATE_CODES).map(([code, name]) => {
                // Calculate counts for this state
                const stateAdjusters = adjusters.filter(adj => 
                  adj.licenses.some(l => l.state === code && l.status === 'active')
                );
                const statePartners = partners.filter(p => 
                  p.serviceAreas.includes(code)
                );
                const hasExpiring = adjusters.some(adj =>
                  adj.licenses.some(l => l.state === code && (l.status === 'expiring' || l.status === 'expired'))
                );
                
                const totalResources = stateAdjusters.length + statePartners.length;
                
                return (
                  <Card 
                    key={code}
                    className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                      currentLocationFilter === code ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => {
                      // Toggle state filter
                      if (currentLocationFilter === code) {
                        setCurrentLocationFilter('all');
                        setSelectedLicensedStates([]);
                      } else {
                        setCurrentLocationFilter(code);
                        setSelectedLicensedStates([code]);
                      }
                      setActiveView('list'); // Switch to list view with state filter
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{code}</h3>
                          <p className="text-xs text-gray-500">{name}</p>
                        </div>
                        <div className={`p-2 rounded-full ${
                          totalResources > 0 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <MapPin className="h-4 w-4" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            Adjusters
                          </span>
                          <span className="font-medium">{stateAdjusters.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center">
                            <Building className="h-3 w-3 mr-1" />
                            Partners
                          </span>
                          <span className="font-medium">{statePartners.length}</span>
                        </div>
                      </div>
                      
                      {hasExpiring && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center text-xs text-yellow-600">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            License issues
                          </div>
                        </div>
                      )}
                      
                      {totalResources === 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="text-xs text-gray-400 text-center">
                            No coverage
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* State Statistics Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Coverage Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Object.entries(STATE_CODES).filter(([code]) => 
                        adjusters.some(adj => adj.licenses.some(l => l.state === code)) ||
                        partners.some(p => p.serviceAreas.includes(code))
                      ).length}
                    </div>
                    <div className="text-sm text-gray-600">States Covered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Object.entries(STATE_CODES).filter(([code]) => 
                        adjusters.filter(adj => adj.licenses.some(l => l.state === code)).length >= 3
                      ).length}
                    </div>
                    <div className="text-sm text-gray-600">Well-Staffed States</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {Object.entries(STATE_CODES).filter(([code]) => 
                        adjusters.some(adj => adj.licenses.some(l => l.state === code && l.status === 'expiring'))
                      ).length}
                    </div>
                    <div className="text-sm text-gray-600">States w/ Expiring</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {Object.entries(STATE_CODES).filter(([code]) => 
                        !adjusters.some(adj => adj.licenses.some(l => l.state === code)) &&
                        !partners.some(p => p.serviceAreas.includes(code))
                      ).length}
                    </div>
                    <div className="text-sm text-gray-600">No Coverage</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default TalentPartnerNetwork;