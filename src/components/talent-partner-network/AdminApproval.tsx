import React, { useState } from 'react';
import { Check, X, Eye, Clock, AlertCircle, Building, User, Mail, Phone, MapPin, Calendar, FileText, Shield } from 'lucide-react';

interface PendingPartner {
  id: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  companyInfo: {
    name: string;
    type: string;
    taxId: string;
    yearEstablished: string;
    website: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  primaryContact: {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    phone: string;
  };
  services: string[];
  certifications: string[];
  insurance: {
    generalLiability: boolean;
    professionalLiability: boolean;
    workersComp: boolean;
    policyLimits: string;
  };
  references: Array<{
    company: string;
    contact: string;
    phone: string;
    email: string;
  }>;
}

const MOCK_PENDING_PARTNERS: PendingPartner[] = [
  {
    id: '1',
    submittedAt: '2024-01-15T10:30:00',
    status: 'pending',
    companyInfo: {
      name: 'Premier Restoration Services',
      type: 'LLC',
      taxId: '12-3456789',
      yearEstablished: '2015',
      website: 'www.premierrestore.com',
      address: '123 Main St',
      city: 'Houston',
      state: 'Texas',
      zip: '77001'
    },
    primaryContact: {
      firstName: 'John',
      lastName: 'Smith',
      title: 'President',
      email: 'john@premierrestore.com',
      phone: '(555) 123-4567'
    },
    services: ['Water Damage', 'Fire Restoration', 'Mold Remediation'],
    certifications: ['IICRC Certified', 'EPA RRP Certified'],
    insurance: {
      generalLiability: true,
      professionalLiability: true,
      workersComp: true,
      policyLimits: '$2,000,000'
    },
    references: [
      {
        company: 'ABC Insurance',
        contact: 'Jane Doe',
        phone: '(555) 987-6543',
        email: 'jane@abcins.com'
      }
    ]
  },
  {
    id: '2',
    submittedAt: '2024-01-14T14:15:00',
    status: 'pending',
    companyInfo: {
      name: 'Sunshine Legal Associates',
      type: 'Professional Corporation',
      taxId: '98-7654321',
      yearEstablished: '2008',
      website: 'www.sunshinelaw.com',
      address: '456 Court Ave',
      city: 'Miami',
      state: 'Florida',
      zip: '33101'
    },
    primaryContact: {
      firstName: 'Maria',
      lastName: 'Garcia',
      title: 'Managing Partner',
      email: 'maria@sunshinelaw.com',
      phone: '(555) 234-5678'
    },
    services: ['Insurance Defense', 'Property Claims', 'Litigation'],
    certifications: ['Florida Bar Member', 'AV Rated'],
    insurance: {
      generalLiability: true,
      professionalLiability: true,
      workersComp: false,
      policyLimits: '$5,000,000'
    },
    references: [
      {
        company: 'XYZ Claims',
        contact: 'Bob Johnson',
        phone: '(555) 876-5432',
        email: 'bob@xyzclaims.com'
      }
    ]
  }
];

const AdminApproval: React.FC = () => {
  const [pendingPartners, setPendingPartners] = useState<PendingPartner[]>(MOCK_PENDING_PARTNERS);
  const [selectedPartner, setSelectedPartner] = useState<PendingPartner | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  const handleApprove = (partnerId: string) => {
    setPendingPartners(prev => 
      prev.map(p => p.id === partnerId ? { ...p, status: 'approved' } : p)
    );
    setShowDetails(false);
    setSelectedPartner(null);
  };

  const handleReject = (partnerId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    setPendingPartners(prev => 
      prev.map(p => p.id === partnerId ? { ...p, status: 'rejected' } : p)
    );
    setShowRejectionModal(false);
    setRejectionReason('');
    setShowDetails(false);
    setSelectedPartner(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Pending Applications Summary */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Pending Partner Applications
          </h2>
          <div className="flex items-center gap-2">
            <Clock className="text-yellow-500" size={20} />
            <span className="text-neutral-600 dark:text-neutral-400">
              {pendingPartners.filter(p => p.status === 'pending').length} Pending
            </span>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-3">
          {pendingPartners.map(partner => (
            <div
              key={partner.id}
              className={`p-4 rounded-lg border transition-all ${
                partner.status === 'pending' 
                  ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20'
                  : partner.status === 'approved'
                  ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                  : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Building className="text-neutral-600 dark:text-neutral-400 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {partner.companyInfo.name}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {partner.companyInfo.city}, {partner.companyInfo.state}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                      Submitted: {formatDate(partner.submittedAt)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {partner.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => {
                          setSelectedPartner(partner);
                          setShowDetails(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleApprove(partner.id)}
                        className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPartner(partner);
                          setShowRejectionModal(true);
                        }}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      partner.status === 'approved'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    }`}>
                      {partner.status === 'approved' ? 'Approved' : 'Rejected'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedPartner && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  Partner Application Details
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Company Information */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Company Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-neutral-600 dark:text-neutral-400">Company Name</label>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      {selectedPartner.companyInfo.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-neutral-600 dark:text-neutral-400">Entity Type</label>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      {selectedPartner.companyInfo.type}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-neutral-600 dark:text-neutral-400">Tax ID</label>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      {selectedPartner.companyInfo.taxId}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-neutral-600 dark:text-neutral-400">Year Established</label>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      {selectedPartner.companyInfo.yearEstablished}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm text-neutral-600 dark:text-neutral-400">Address</label>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      {selectedPartner.companyInfo.address}, {selectedPartner.companyInfo.city}, {selectedPartner.companyInfo.state} {selectedPartner.companyInfo.zip}
                    </p>
                  </div>
                </div>
              </div>

              {/* Primary Contact */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Primary Contact
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-neutral-600 dark:text-neutral-400">Name</label>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      {selectedPartner.primaryContact.firstName} {selectedPartner.primaryContact.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-neutral-600 dark:text-neutral-400">Title</label>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      {selectedPartner.primaryContact.title}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-neutral-600 dark:text-neutral-400">Email</label>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      {selectedPartner.primaryContact.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-neutral-600 dark:text-neutral-400">Phone</label>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      {selectedPartner.primaryContact.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Services & Certifications */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Services & Certifications
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-neutral-600 dark:text-neutral-400">Services Offered</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedPartner.services.map((service, idx) => (
                        <span key={idx} className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm rounded">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-neutral-600 dark:text-neutral-400">Certifications</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedPartner.certifications.map((cert, idx) => (
                        <span key={idx} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Insurance Coverage */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Insurance Coverage
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Shield className={selectedPartner.insurance.generalLiability ? 'text-green-600' : 'text-neutral-400'} size={20} />
                    <span className="text-neutral-900 dark:text-neutral-100">General Liability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className={selectedPartner.insurance.professionalLiability ? 'text-green-600' : 'text-neutral-400'} size={20} />
                    <span className="text-neutral-900 dark:text-neutral-100">Professional Liability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className={selectedPartner.insurance.workersComp ? 'text-green-600' : 'text-neutral-400'} size={20} />
                    <span className="text-neutral-900 dark:text-neutral-100">Workers Compensation</span>
                  </div>
                  <div>
                    <label className="text-sm text-neutral-600 dark:text-neutral-400">Policy Limits</label>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      {selectedPartner.insurance.policyLimits}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowRejectionModal(true);
                    setShowDetails(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedPartner.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedPartner && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Reject Partner Application
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Please provide a reason for rejecting {selectedPartner.companyInfo.name}'s application:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={4}
              placeholder="Enter rejection reason..."
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                }}
                className="px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedPartner.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApproval;