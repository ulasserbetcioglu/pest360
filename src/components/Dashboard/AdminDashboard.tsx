import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import DashboardCard from './DashboardCard';
import { Building2, Users, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<any>(null);
  const [pendingCompanies, setPendingCompanies] = useState([]);

  useEffect(() => {
    // API'den gerçek verileri çekmek için:
    // fetch('/api/admin/stats').then(res => res.json()).then(setStats);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')} - Admin Panel</h1>
        <p className="text-gray-600 mt-2">Sistem genel durumu ve firma yönetimi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title={t('dashboard.totalCompanies')}
          value={stats?.totalCompanies || 0}
          icon={Building2}
          color="blue"
        />
        <DashboardCard
          title={t('dashboard.pendingApprovals')}
          value={stats?.pendingApprovals || 0}
          icon={AlertCircle}
          color="orange"
        />
        <DashboardCard
          title="Toplam Operatör"
          value={stats?.totalOperators || 0}
          icon={Users}
          color="green"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Firma Başvuruları</h3>
        {pendingCompanies.length === 0 ? (
          <p className="text-gray-500 text-sm">Bekleyen başvuru bulunmuyor.</p>
        ) : (
          <div className="space-y-4">
            {/* API'den gelen başvurular burada listelenecek */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;