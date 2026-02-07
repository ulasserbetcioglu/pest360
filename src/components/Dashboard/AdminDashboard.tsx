import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import DashboardCard from './DashboardCard';
import {
  Building2,
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();

  // Mock data for admin dashboard
  const stats = {
    totalCompanies: 12,
    pendingApprovals: 3,
    totalOperators: 45,
    totalCustomers: 128,
    monthlyRevenue: '₺245,000',
    systemHealth: '99.9%'
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('dashboard.title')} - Admin Panel
        </h1>
        <p className="text-gray-600 mt-2">
          Sistem genel durumu ve firma yönetimi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title={t('dashboard.totalCompanies')}
          value={stats.totalCompanies}
          change="+2 bu ay"
          changeType="increase"
          icon={Building2}
          color="blue"
        />

        <DashboardCard
          title={t('dashboard.pendingApprovals')}
          value={stats.pendingApprovals}
          change="Acil onay gerekli"
          changeType="decrease"
          icon={AlertCircle}
          color="orange"
        />

        <DashboardCard
          title="Toplam Operatör"
          value={stats.totalOperators}
          change="+8 bu ay"
          changeType="increase"
          icon={Users}
          color="green"
        />

        <DashboardCard
          title={t('dashboard.totalCustomers')}
          value={stats.totalCustomers}
          change="+15 bu ay"
          changeType="increase"
          icon={Users}
          color="purple"
        />

        <DashboardCard
          title={t('dashboard.monthlyRevenue')}
          value={stats.monthlyRevenue}
          change="+12% geçen aya göre"
          changeType="increase"
          icon={TrendingUp}
          color="green"
        />

        <DashboardCard
          title="Sistem Sağlığı"
          value={stats.systemHealth}
          change="Son 30 gün"
          changeType="neutral"
          icon={CheckCircle}
          color="green"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Son Firma Başvuruları
          </h3>
          <div className="space-y-4">
            {[
              { company: 'Elit İlaçlama Hizmetleri', date: '2 saat önce', status: 'pending' },
              { company: 'Pro Pest Control', date: '5 saat önce', status: 'approved' },
              { company: 'Güvenli İlaçlama', date: '1 gün önce', status: 'pending' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.company}</p>
                  <p className="text-sm text-gray-600">{item.date}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.status === 'pending'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {item.status === 'pending' ? 'Bekliyor' : 'Onaylandı'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sistem Bildirimleri
          </h3>
          <div className="space-y-4">
            {[
              { message: 'Demo veri güncellendi', time: '10 dakika önce', type: 'info' },
              { message: '3 yeni firma kaydı bekliyor', time: '2 saat önce', type: 'warning' },
              { message: 'Sistem bakımı tamamlandı', time: '1 gün önce', type: 'success' },
            ].map((notification, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div
                  className={`w-2 h-2 rounded-full ${
                    notification.type === 'warning'
                      ? 'bg-orange-500'
                      : notification.type === 'success'
                      ? 'bg-green-500'
                      : 'bg-blue-500'
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                  <p className="text-xs text-gray-600">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;