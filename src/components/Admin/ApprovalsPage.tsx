import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import {
  Clock,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Check,
  X,
  Eye,
  Calendar
} from 'lucide-react';

interface PendingApproval {
  id: string;
  companyName: string;
  authorizedPerson: string;
  email: string;
  phone: string;
  address: string;
  taxNumber: string;
  registrationDate: string;
  documents: string[];
}

const ApprovalsPage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedApproval, setSelectedApproval] = useState<string | null>(null);

  // Demo pending approvals - empty for now
  const pendingApprovals: PendingApproval[] = [];

  const handleApprove = (id: string) => {
    // Handle approval logic
    console.log('Approving company:', id);
  };

  const handleReject = (id: string) => {
    // Handle rejection logic
    console.log('Rejecting company:', id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Onay Bekleyen Firmalar</h1>
          <p className="text-gray-600 mt-2">Yeni firma başvurularını inceleyin ve onaylayın</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{pendingApprovals.length} başvuru bekliyor</span>
        </div>
      </div>

      {pendingApprovals.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Tüm başvurular işlendi
          </h3>
          <p className="text-gray-600">
            Şu anda onay bekleyen firma başvurusu bulunmuyor.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {pendingApprovals.map((approval) => (
            <div key={approval.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{approval.companyName}</h3>
                    <p className="text-sm text-gray-600">VN: {approval.taxNumber}</p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                  Bekliyor
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{approval.authorizedPerson}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{approval.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{approval.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{approval.address}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(approval.registrationDate).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedApproval(approval.id)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  <span>Detayları Gör</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleReject(approval.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleApprove(approval.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bu Hafta</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bu Ay</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ortalama Süre</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalsPage;