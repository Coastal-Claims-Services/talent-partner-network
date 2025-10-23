import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Building, Star, Calendar, Shield,
  Edit, Save, X, Upload, FileText, Award, Clock, TrendingUp,
  CheckCircle, AlertCircle, Briefcase, DollarSign
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner';
import api, { Partner } from '../../services/talent-partner-network/api';

interface PartnerProfileProps {
  partnerId: string;
  onClose?: () => void;
  isEditable?: boolean;
}

const PARTNER_SERVICES = [
  'Engineering', 'Restoration', 'Roofing', 'Plumbing', 'Electrical',
  'HVAC', 'Mold Remediation', 'Water Extraction', 'Contents', 'Legal',
  'Public Adjusting', 'Temporary Housing', 'Tree Removal', 'Debris Removal'
];

const STATE_CODES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const PartnerProfile: React.FC<PartnerProfileProps> = ({ 
  partnerId, 
  onClose, 
  isEditable = false 
}) => {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<Partner>>({});
  const [documents, setDocuments] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    loadPartnerData();
  }, [partnerId]);

  const loadPartnerData = async () => {
    try {
      setIsLoading(true);
      const [partnerData, partnerDocs, partnerMetrics] = await Promise.all([
        api.getPartner(partnerId),
        api.getDocuments('partner', partnerId),
        api.getPerformanceMetrics('partner', partnerId)
      ]);
      
      setPartner(partnerData);
      setEditedData(partnerData);
      setDocuments(partnerDocs);
      setMetrics(partnerMetrics);
    } catch (error) {
      console.error('Error loading partner data:', error);
      toast.error('Failed to load partner profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const updated = await api.updatePartner(partnerId, editedData);
      setPartner(updated);
      setIsEditing(false);
      toast.success('Partner profile updated successfully');
    } catch (error) {
      console.error('Error updating partner:', error);
      toast.error('Failed to update partner profile');
    }
  };

  const handleCancel = () => {
    setEditedData(partner || {});
    setIsEditing(false);
  };

  const handleServiceToggle = (service: string) => {
    const currentServices = editedData.services || [];
    if (currentServices.includes(service)) {
      setEditedData({
        ...editedData,
        services: currentServices.filter(s => s !== service)
      });
    } else {
      setEditedData({
        ...editedData,
        services: [...currentServices, service]
      });
    }
  };

  const handleCoverageToggle = (state: string) => {
    const currentCoverage = editedData.coverage || [];
    if (currentCoverage.includes(state)) {
      setEditedData({
        ...editedData,
        coverage: currentCoverage.filter(s => s !== state)
      });
    } else {
      setEditedData({
        ...editedData,
        coverage: [...currentCoverage, state]
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await api.uploadDocument('partner', partnerId, file);
      setDocuments([...documents, result]);
      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!partner) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Partner not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Building className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{partner.name}</h1>
            <p className="text-gray-500">Partner ID: {partner.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditable && !isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
          {isEditing && (
            <>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
          {onClose && (
            <Button onClick={onClose} variant="ghost">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex items-center gap-2">
        <Badge variant={partner.availability === 'available' ? 'default' : 'secondary'}>
          {partner.availability}
        </Badge>
        <Badge variant="outline">
          <Star className="h-3 w-3 mr-1" />
          {partner.rating.toFixed(1)}
        </Badge>
        <Badge variant="outline">
          <Briefcase className="h-3 w-3 mr-1" />
          {partner.projectsCompleted} Projects
        </Badge>
        <Badge variant="outline">
          <Clock className="h-3 w-3 mr-1" />
          {partner.avgResponseTime}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="coverage">Coverage</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  {isEditing ? (
                    <Input
                      value={editedData.email}
                      onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                    />
                  ) : (
                    <p className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {partner.email}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Phone</Label>
                  {isEditing ? (
                    <Input
                      value={editedData.phone}
                      onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                    />
                  ) : (
                    <p className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {partner.phone}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Headquarters</Label>
                  {isEditing ? (
                    <Input
                      value={editedData.headquarters}
                      onChange={(e) => setEditedData({ ...editedData, headquarters: e.target.value })}
                    />
                  ) : (
                    <p className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {partner.headquarters}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Availability</Label>
                  {isEditing ? (
                    <Select
                      value={editedData.availability}
                      onValueChange={(value: any) => setEditedData({ ...editedData, availability: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="busy">Busy</SelectItem>
                        <SelectItem value="unavailable">Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="mt-1">{partner.availability}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Insurance Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Carrier</Label>
                  {isEditing ? (
                    <Input
                      value={editedData.insurance?.carrier}
                      onChange={(e) => setEditedData({ 
                        ...editedData, 
                        insurance: { ...editedData.insurance!, carrier: e.target.value }
                      })}
                    />
                  ) : (
                    <p className="mt-1">{partner.insurance.carrier}</p>
                  )}
                </div>
                <div>
                  <Label>Policy Number</Label>
                  {isEditing ? (
                    <Input
                      value={editedData.insurance?.policyNumber}
                      onChange={(e) => setEditedData({ 
                        ...editedData, 
                        insurance: { ...editedData.insurance!, policyNumber: e.target.value }
                      })}
                    />
                  ) : (
                    <p className="mt-1">{partner.insurance.policyNumber}</p>
                  )}
                </div>
                <div>
                  <Label>Expires</Label>
                  <p className="mt-1">
                    {new Date(partner.insurance.expires).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Services Offered</CardTitle>
              <CardDescription>
                Select all services this partner provides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {PARTNER_SERVICES.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={service}
                      checked={editedData.services?.includes(service)}
                      onCheckedChange={() => handleServiceToggle(service)}
                      disabled={!isEditing}
                    />
                    <Label htmlFor={service} className="cursor-pointer">
                      {service}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {partner.certifications.map((cert, index) => (
                  <Badge key={index} variant="secondary">
                    <Award className="h-3 w-3 mr-1" />
                    {cert}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coverage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Coverage Areas</CardTitle>
              <CardDescription>
                States where this partner operates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-3">
                {STATE_CODES.map((state) => (
                  <div key={state} className="flex items-center space-x-2">
                    <Checkbox
                      id={state}
                      checked={editedData.coverage?.includes(state)}
                      onCheckedChange={() => handleCoverageToggle(state)}
                      disabled={!isEditing}
                    />
                    <Label htmlFor={state} className="cursor-pointer">
                      {state}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                Insurance certificates, licenses, and other documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditable && (
                <div>
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Click to upload document</p>
                    </div>
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {metrics && (
            <>
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Projects</p>
                        <p className="text-2xl font-bold">{metrics.totalProjects}</p>
                      </div>
                      <Briefcase className="h-8 w-8 text-blue-500 opacity-20" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Avg Response Time</p>
                        <p className="text-2xl font-bold">{metrics.avgResponseTime}</p>
                      </div>
                      <Clock className="h-8 w-8 text-green-500 opacity-20" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Customer Rating</p>
                        <p className="text-2xl font-bold">{metrics.rating}/5.0</p>
                      </div>
                      <Star className="h-8 w-8 text-yellow-500 opacity-20" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Revenue Generated</p>
                        <p className="text-2xl font-bold">${metrics.revenue?.toLocaleString()}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-purple-500 opacity-20" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    <TrendingUp className="h-12 w-12" />
                    <p className="ml-4">Performance chart visualization here</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-500 text-center py-8">
                  Project history will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PartnerProfile;