import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Briefcase, MapPin, ClipboardList } from 'lucide-react';

export default function CompanyDashboard() {
  const { user } = useAuth();

  const stats = [
    { title: 'Operatörler', value: '0', icon: Users, color: 'bg-blue-500' },
    { title: 'Müşteriler', value: '0', icon: Briefcase, color: 'bg-green-500' },
    { title: 'Hizmet Noktaları', value: '0', icon: MapPin, color: 'bg-purple-500' },
    { title: 'Bekleyen İşler', value: '0', icon: ClipboardList, color: 'bg-orange-500' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 rounded-2xl text-white shadow-lg">
        <h1 className="text-3xl font-bold">Hoş Geldiniz, {user?.firstName}</h1>
        <p className="opacity-80 mt-2 font-medium">
          {user?.companyName || 'İlaçlama Firması Yönetim Paneli'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`${stat.color} p-3 rounded-xl text-white`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Hızlı İşlemler</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-gray-50 rounded-xl hover:bg-blue-50 text-blue-600 font-semibold transition-colors border border-dashed border-blue-200">
              + Yeni Operatör Ekle
            </button>
            <button className="p-4 bg-gray-50 rounded-xl hover:bg-green-50 text-green-600 font-semibold transition-colors border border-dashed border-green-200">
              + Yeni Müşteri Ekle
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center italic text-gray-400 text-sm">
          Son aktiviteler henüz bulunmuyor.
        </div>
      </div>
    </div>
  );
}