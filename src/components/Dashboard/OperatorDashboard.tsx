import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import DashboardCard from './DashboardCard';
import {
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  Navigation,
  AlertTriangle
} from 'lucide-react';

const OperatorDashboard: React.FC = () => {
  const { t } = useLanguage();

  // Mock data for operator dashboard
  const stats = {
    todayVisits: 4,
    completedToday: 2,
    totalThisMonth: 28,
    nextVisit: '14:00'
  };

  const myVisits = [
    {
      id: 1,
      customer: 'Grand Hotel Ankara',
      time: '09:00',
      status: 'completed',
      type: 'Genel İlaçlama',
      location: 'Çankaya, Ankara'
    },
    {
      id: 2,
      customer: 'Vadi Restaurant',
      time: '11:30',
      status: 'completed',
      type: 'Haşere Kontrolü',
      location: 'Kızılay, Ankara'
    },
    {
      id: 3,
      customer: 'Plaza AVM',
      time: '14:00',
      status: 'next',
      type: 'Fare İlaçlaması',
      location: 'Çankaya, Ankara'
    },
    {
      id: 4,
      customer: 'Özel Hastane',
      time: '16:30',
      status: 'scheduled',
      type: 'Dezenfeksiyon',
      location: 'Keçiören, Ankara'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'next': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'next': return 'Sıradaki';
      case 'scheduled': return 'Planlandı';
      default: return 'Bilinmiyor';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('common.welcome')}, Mehmet Kaya
        </h1>
        <p className="text-gray-600 mt-2">
          Operatör paneli - Bugünkü görevleriniz
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Bugünkü Ziyaretler"
          value={stats.todayVisits}
          icon={Calendar}
          color="blue"
        />

        <DashboardCard
          title="Tamamlanan"
          value={stats.completedToday}
          change={`${stats.todayVisits - stats.completedToday} kaldı`}
          icon={CheckCircle}
          color="green"
        />

        <DashboardCard
          title="Aylık Toplam"
          value={stats.totalThisMonth}
          icon={MapPin}
          color="purple"
        />

        <DashboardCard
          title="Sonraki Ziyaret"
          value={stats.nextVisit}
          change="Plaza AVM"
          icon={Clock}
          color="orange"
        />
      </div>

      {/* Mobile-optimized visit list */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Bugünkü Görevlerim
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {myVisits.map((visit) => (
            <div key={visit.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(visit.status)}`}>
                      {getStatusText(visit.status)}
                    </span>
                  </div>
                  <div className="text-lg font-medium text-gray-900">
                    {visit.time}
                  </div>
                </div>
                {visit.status === 'next' && (
                  <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    <Navigation className="w-4 h-4" />
                    <span>Yol Tarifi</span>
                  </button>
                )}
              </div>

              <div className="space-y-1">
                <h4 className="font-semibold text-gray-900">{visit.customer}</h4>
                <p className="text-sm text-gray-600">{visit.type}</p>
                <p className="text-sm text-gray-500 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {visit.location}
                </p>
              </div>

              {visit.status === 'next' && (
                <div className="mt-3 flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Görevi Başlat
                  </button>
                </div>
              )}

              {visit.status === 'scheduled' && (
                <div className="mt-3">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Detayları Görüntüle
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6" />
            <span className="font-medium">Rapor Oluştur</span>
          </div>
        </button>

        <button className="p-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6" />
            <span className="font-medium">Stok Durumu</span>
          </div>
        </button>

        <button className="p-4 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6" />
            <span className="font-medium">Destek Talebi</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default OperatorDashboard;