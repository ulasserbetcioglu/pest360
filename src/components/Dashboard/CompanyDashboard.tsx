import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../hooks/useLanguage';
import DashboardCard from './DashboardCard';
import { Calendar, Users, Package, Clock } from 'lucide-react';

const CompanyDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState<any>(null);
  const [todayVisits, setTodayVisits] = useState([]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('common.welcome')}, {user?.companyName || 'Firma Yetkilisi'}
        </h1>
        <p className="text-gray-600 mt-2">Firma yönetim paneli - Güncel aktiviteler</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard title={t('dashboard.todayVisits')} value={stats?.todayVisits || 0} icon={Calendar} color="blue" />
        <DashboardCard title={t('dashboard.totalCustomers')} value={stats?.totalCustomers || 0} icon={Users} color="purple" />
        <DashboardCard title={t('dashboard.lowStock')} value={stats?.lowStockItems || 0} icon={Package} color="orange" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Bugünkü Ziyaret Programı
        </h3>
        {todayVisits.length === 0 ? (
          <p className="text-gray-500 text-sm">Planlanmış ziyaret bulunmuyor.</p>
        ) : (
          <div className="space-y-3">
            {/* Ziyaret listesi map ile buraya gelecek */}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;