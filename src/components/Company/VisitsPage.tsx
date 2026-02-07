import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Calendar, MapPin, User, Clock, Plus, Search, Filter, Eye, CreditCard as Edit, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Visit {
  id: string;
  customer: string;
  branch: string;
  operator: string;
  visitType: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  address: string;
  notes?: string;
}

const VisitsPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'>('all');
  const [filterDate, setFilterDate] = useState('');

  // Demo visits - empty for now, will be populated when needed
  const visits: Visit[] = [];

  const filteredVisits = visits.filter(visit => {
    const matchesSearch = visit.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visit.branch.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || visit.status === filterStatus;
    
    const matchesDate = !filterDate || visit.scheduledDate === filterDate;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { color: 'bg-orange-100 text-orange-800', icon: Clock, text: 'Planlandı' },
      in_progress: { color: 'bg-blue-100 text-blue-800', icon: AlertCircle, text: 'Devam Ediyor' },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Tamamlandı' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'İptal Edildi' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('visits.title')}</h1>
          <p className="text-gray-600 mt-2">Ziyaret planlaması ve takibi</p>
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Yeni Ziyaret Planla</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Müşteri veya şube ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="scheduled">Planlandı</option>
              <option value="in_progress">Devam Ediyor</option>
              <option value="completed">Tamamlandı</option>
              <option value="cancelled">İptal Edildi</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1"
            />
          </div>

          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Filtreleri Temizle
          </button>
        </div>
      </div>

      {/* Visits List */}
      {filteredVisits.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Henüz ziyaret planlanmamış
          </h3>
          <p className="text-gray-600 mb-6">
            İlk ziyaretinizi planlayarak başlayın.
          </p>
          <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto">
            <Plus className="w-5 h-5" />
            <span>Ziyaret Planla</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Müşteri</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Tarih & Saat</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Operatör</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Durum</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredVisits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{visit.customer}</p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {visit.branch}
                        </p>
                        <p className="text-xs text-gray-500">{visit.visitType}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(visit.scheduledDate).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                        <Clock className="w-4 h-4" />
                        <span>{visit.scheduledTime}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{visit.operator}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(visit.status)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bugün</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bu Hafta</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bu Ay</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitsPage;