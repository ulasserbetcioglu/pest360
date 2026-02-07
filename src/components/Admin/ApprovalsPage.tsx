import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
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
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingApprovals();
  }, []);

  const loadPendingApprovals = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('is_approved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData: PendingApproval[] = (data || []).map((company: any) => ({
        id: company.id,
        companyName: company.name,
        authorizedPerson: company.authorized_person || '',
        email: company.email,
        phone: company.phone || '',
        address: company.address || '',
        taxNumber: company.tax_number || '',
        registrationDate: company.created_at,
        documents: []
      }));

      setPendingApprovals(formattedData);
    } catch (error) {
      console.error('Error loading pending approvals:', error);
      toast.error('Onay bekleyen firmalar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error: companyError } = await supabase
        .from('companies')
        .update({ is_approved: true })
        .eq('id', id);

      if (companyError) throw companyError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_active: true })
        .eq('company_id', id);

      if (profileError) throw profileError;

      toast.success('Firma başarıyla onaylandı');
      loadPendingApprovals();
    } catch (error) {
      console.error('Error approving company:', error);
      toast.error('Firma onaylanırken hata oluştu');
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Bu firmayı reddetmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Firma reddedildi');
      loadPendingApprovals();
    } catch (error) {
      console.error('Error rejecting company:', error);
      toast.error('Firma reddedilirken hata oluştu');
    }
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

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Yükleniyor...</p>
        </div>
      ) : pendingApprovals.length === 0 ? (
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