import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../hooks/useLanguage';
import DashboardCard from './DashboardCard';
import { Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';

const OperatorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [tasks, setTasks] = useState([]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('common.welcome')}, {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-gray-600 mt-2">Operatör paneli - Bugünkü görevleriniz</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Bugünkü Ziyaretler" value={tasks.length} icon={Calendar} color="blue" />
        <DashboardCard title="Aylık Toplam" value={0} icon={MapPin} color="purple" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Bugünkü Görevlerim
          </h3>
        </div>
        <div className="p-6">
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-sm">Atanmış bir göreviniz bulunmuyor.</p>
          ) : (
            <div className="divide-y divide-gray-200">
              {/* Görev kartları buraya gelecek */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OperatorDashboard;