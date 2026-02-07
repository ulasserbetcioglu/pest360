import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { User, Search, Plus, Eye, CreditCard as Edit, Phone, Mail, Calendar, MapPin, CheckCircle, XCircle } from 'lucide-react';

interface Operator {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isActive: boolean;
  joinDate: string;
  totalVisits: number;
  completedVisits: number;
  lastVisitDate?: string;
  specializations: string[];
}

const OperatorsPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Demo operators - empty for now
  const operators: Operator[] = [];

  const filteredOperators = operators.filter(operator => {
    const fullName = `${operator.firstName} ${operator.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         operator.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'active' && operator.isActive) ||
                         (filterStatus === 'inactive' && !operator.isActive);
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('nav.operators')}</h1>
          <p className="text-gray-600 mt-2">Operatör yönetimi ve performans takibi</p>
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Yeni Operatör Ekle</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Operatör ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tüm Operatörler</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Operators List */}
      {filteredOperators.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Henüz operatör eklenmemiş
          </h3>
          <p className="text-gray-600 mb-6">
            İlk operatörünüzü ekleyerek başlayın.
          </p>
          <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto">
            <Plus className="w-5 h-5" />
            <span>Operatör Ekle</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOperators.map((operator) => (
            <div key={operator.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {operator.firstName} {operator.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">Operatör</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  operator.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {operator.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{operator.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{operator.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Başlangıç: {new Date(operator.joinDate).toLocaleDateString('tr-TR')}</span>
                </div>
                {operator.lastVisitDate && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Son ziyaret: {new Date(operator.lastVisitDate).toLocaleDateString('tr-TR')}</span>
                  </div>
                )}
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{operator.totalVisits}</p>
                  <p className="text-xs text-gray-600">Toplam Ziyaret</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{operator.completedVisits}</p>
                  <p className="text-xs text-gray-600">Tamamlanan</p>
                </div>
              </div>

              {/* Specializations */}
              {operator.specializations.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Uzmanlık Alanları:</p>
                  <div className="flex flex-wrap gap-1">
                    {operator.specializations.map((spec, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  <Eye className="w-4 h-4" />
                  <span>Detaylar</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Edit className="w-4 h-4" />
                  <span>Düzenle</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Operatör</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktif Operatör</p>
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
              <p className="text-sm font-medium text-gray-600">Bugün Görevde</p>
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
              <p className="text-sm font-medium text-gray-600">Bu Ay Yeni</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <Plus className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorsPage;