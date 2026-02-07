import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import DashboardCard from './DashboardCard';
import {
  Calendar,
  Users,
  Package,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';

const CompanyDashboard: React.FC = () => {
  const { t } = useLanguage();

  // Mock data for company dashboard
  const stats = {
    todayVisits: 8,
    completedVisits: 156,
    totalCustomers: 24,
    activeOperators: 6,
    monthlyRevenue: '₺28,500',
    lowStockItems: 3
  };

  const todayVisits = [
    { id: 1, customer: 'Grand Hotel Ankara', time: '09:00', operator: 'Mehmet K.', status: 'completed' },
    { id: 2, customer: 'Vadi Restaurant', time: '11:30', operator: 'Ayşe D.', status: 'in_progress' },
    { id: 3, customer: 'Plaza AVM', time: '14:00', operator: 'Ali Y.', status: 'scheduled' },
    { id: 4, customer: 'Özel Hastane', time: '16:30', operator: 'Fatma S.', status: 'scheduled' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'in_progress': return 'Devam Ediyor';
      case 'scheduled': return 'Planlandı';
      default: return 'Bilinmiyor';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('common.welcome')}, Elit İlaçlama
        </h1>
        <p className="text-gray-600 mt-2">
          Firma yönetim paneli - Bugünkü aktiviteleriniz
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title={t('dashboard.todayVisits')}
          value={stats.todayVisits}
          change="2 tamamlandı"
          changeType="increase"
          icon={Calendar}
          color="blue"
        />

        <DashboardCard
          title={t('dashboard.completedVisits')}
          value={stats.completedVisits}
          change="+12 bu ay"
          changeType="increase"
          icon={MapPin}
          color="green"
        />

        <DashboardCard
          title={t('dashboard.totalCustomers')}
          value={stats.totalCustomers}
          change="+3 bu ay"
          changeType="increase"
          icon={Users}
          color="purple"
        />

        <DashboardCard
          title={t('dashboard.activeOperators')}
          value={stats.activeOperators}
          change="Tümü aktif"
          changeType="neutral"
          icon={Users}
          color="green"
        />

        <DashboardCard
          title={t('dashboard.monthlyRevenue')}
          value={stats.monthlyRevenue}
          change="+8% geçen aya göre"
          changeType="increase"
          icon={TrendingUp}
          color="green"
        />

        <DashboardCard
          title={t('dashboard.lowStock')}
          value={stats.lowStockItems}
          change="Stok yenileme gerekli"
          changeType="decrease"
          icon={Package}
          color="orange"
        />
      </div>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Bugünkü Ziyaret Programı
          </h3>
          <div className="space-y-3">
            {todayVisits.map((visit) => (
              <div key={visit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{visit.customer}</p>
                  <p className="text-sm text-gray-600">{visit.time} - {visit.operator}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(visit.status)}`}>
                  {getStatusText(visit.status)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Stok Uyarıları
          </h3>
          <div className="space-y-3">
            {[
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.product}</p>
                  <p className="text-sm text-gray-600">Mevcut: {item.current} / Min: {item.minimum}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.urgency === 'critical'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {item.urgency === 'critical' ? 'Kritik' : 'Düşük'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;