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

  // Demo data for admin dashboard
  const stats = {
    totalCompanies: 1,
    pendingApprovals: 0,
    totalOperators: 6,
    totalCustomers: 24,
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
          change="Tüm başvurular işlendi"
          changeType="neutral"
          icon={AlertCircle}
          color="green"
        />

        <DashboardCard
          title="Toplam Operatör"
          value={stats.totalOperators}
          change="Demo sistem"
          changeType="neutral"
          icon={Users}
          color="green"
        />

        <DashboardCard
          title={t('dashboard.totalCustomers')}
          value={stats.totalCustomers}
          change="Demo veri"
          changeType="neutral"
          icon={Users}
          color="purple"
        />

        <DashboardCard
          title={t('dashboard.monthlyRevenue')}
          value={stats.monthlyRevenue}
          change="Demo hesaplama"
          changeType="neutral"
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
            Demo Sistem Durumu
          </h3>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-gray-600">
              Demo sistem aktif. 1 firma kayıtlı ve çalışıyor.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sistem Bildirimleri
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Sistem başarıyla başlatıldı</p>
                <p className="text-xs text-gray-600">Demo veriler yüklendi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;