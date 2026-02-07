import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Briefcase, MapPin, ClipboardList, Plus } from 'lucide-react';

export default function CompanyDashboard() {
  const { user } = useAuth();

  const stats = [
    { title: 'Operatörler', value: '0', icon: Users, color: 'bg-blue-500' },
    { title: 'Müşteriler', value: '0', icon: Briefcase, color: 'bg-green-500' },
    { title: 'Şubeler', value: '0', icon: MapPin, color: 'bg-purple-500' },
    { title: 'İşlemler', value: '0', icon: ClipboardList, color: 'bg-orange-500' },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 pb-24 md:pb-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-900 p-6 md:p-8 rounded-3xl text-white shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold">Hoş Geldiniz, {user?.firstName}</h1>
        <p className="opacity-80 mt-1 text-sm md:text-base font-medium">
          {user?.companyName || 'Yönetim Paneli'}
        </p>
      </div>

      {/* Stats Grid - Mobilde 2 sütun, Masaüstünde 4 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-left">
            <div className={`${stat.color} p-3 rounded-xl text-white shrink-0`}>
              <stat.icon size={20} className="md:w-6 md:h-6" />
            </div>
            <div>
              <p className="text-[10px] md:text-sm text-gray-500 font-bold uppercase tracking-wider">{stat.title}</p>
              <p className="text-lg md:text-2xl font-black text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Hızlı İşlemler</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-xl font-bold hover:bg-blue-100 transition-all active:scale-95 border border-blue-200">
              <Plus size={18} /> Operatör Ekle
            </button>
            <button className="flex items-center justify-center gap-2 p-4 bg-green-50 text-green-700 rounded-xl font-bold hover:bg-green-100 transition-all active:scale-95 border border-green-200">
              <Plus size={18} /> Müşteri Ekle
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[150px] flex flex-col items-center justify-center text-center">
          <div className="bg-gray-50 p-4 rounded-full mb-2">
            <ClipboardList className="text-gray-300" size={32} />
          </div>
          <p className="text-gray-400 text-sm italic">Son aktiviteler henüz bulunmuyor.</p>
        </div>
      </div>
    </div>
  );
}