import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import {
  Building2,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Check,
  X,
  Calendar,
  Users,
  Phone,
  Mail
} from 'lucide-react';

interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  taxNumber: string;
  authorizedPerson: string;
  isApproved: boolean;
  isDemo: boolean;
  registrationDate: string;
  trialEndDate?: string;
  operatorCount: number;
  customerCount: number;
}

const CompaniesPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending' | 'demo'>('all');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (companiesError) throw companiesError;

      const formattedCompanies: Company[] = await Promise.all(
        (companiesData || []).map(async (company: any) => {
          const { count: operatorCount } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', company.id)
            .eq('role', 'operator');

          const { count: customerCount } = await supabase
            .from('customers')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', company.id);

          return {
            id: company.id,
            name: company.name,
            email: company.email,
            phone: company.phone || '',
            taxNumber: company.tax_number || '',
            authorizedPerson: company.authorized_person || '',
            isApproved: company.is_approved,
            isDemo: company.is_demo,
            registrationDate: company.created_at,
            trialEndDate: company.trial_end_date,
            operatorCount: operatorCount || 0,
            customerCount: customerCount || 0
          };
        })
      );

      setCompanies(formattedCompanies);
    } catch (error) {
      console.error('Error loading companies:', error);
      toast.error('Firmalar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'approved' && company.isApproved) ||
                         (filterStatus === 'pending' && !company.isApproved) ||
                         (filterStatus === 'demo' && company.isDemo);
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (company: Company) => {
    if (company.isDemo) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Demo</span>;
    }
    if (company.isApproved) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Onaylandı</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">Onay Bekliyor</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Firmalar</h1>
          <p className="text-gray-600 mt-2">Kayıtlı ilaçlama firmalarını yönetin</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Firma ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tüm Firmalar</option>
                <option value="approved">Onaylı</option>
                <option value="pending">Onay Bekleyen</option>
                <option value="demo">Demo</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Companies List */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Yükleniyor...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Firma</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">İletişim</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Durum</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Kayıt Tarihi</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">İstatistikler</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{company.name}</p>
                        <p className="text-sm text-gray-600">VN: {company.taxNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{company.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{company.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(company)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(company.registrationDate).toLocaleDateString('tr-TR')}</span>
                    </div>
                    {company.trialEndDate && (
                      <p className="text-xs text-orange-600 mt-1">
                        Deneme: {new Date(company.trialEndDate).toLocaleDateString('tr-TR')}
                      </p>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{company.operatorCount} operatör</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Building2 className="w-4 h-4" />
                        <span>{company.customerCount} müşteri</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      {!company.isApproved && (
                        <>
                          <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                            <Check className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aradığınız kriterlere uygun firma bulunamadı.</p>
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default CompaniesPage;