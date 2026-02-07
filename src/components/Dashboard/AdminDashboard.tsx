import React from 'react';
import CompanyManagement from '../Admin/CompanyManagement';
import { LayoutDashboard, ShieldCheck, Activity } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-20 md:pb-6">
      {/* Üst Bilgi Kartı (Hero Section) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 p-6 md:p-10 rounded-[2rem] text-white shadow-xl">
        {/* Dekoratif Arka Plan İkonu (Sadece Büyük Ekranlarda) */}
        <ShieldCheck className="absolute right-[-20px] top-[-20px] w-48 h-48 opacity-10 hidden md:block rotate-12" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <LayoutDashboard size={20} className="text-blue-200" />
            <span className="text-xs md:text-sm font-black uppercase tracking-widest text-blue-100">Sistem Admin</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight">Sistem Yönetim Paneli</h1>
          <p className="opacity-80 mt-2 text-sm md:text-lg max-w-xl font-medium leading-relaxed">
            Pest360 platformundaki tüm firmaları, kullanıcıları ve sistem ayarlarını bu panel üzerinden kontrol edebilirsiniz.
          </p>
        </div>
      </div>

      {/* Hızlı İstatistikler (Opsiyonel - Görseli zenginleştirmek için) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Sistem Durumu</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm md:text-lg font-bold text-gray-800">Aktif</span>
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Güvenlik</p>
          <div className="flex items-center gap-2 mt-1">
            <Activity size={16} className="text-blue-500" />
            <span className="text-sm md:text-lg font-bold text-gray-800">SSL Aktif</span>
          </div>
        </div>
        <div className="hidden md:block bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Son Güncelleme</p>
          <span className="text-lg font-bold text-gray-800 block mt-1">Bugün, 14:20</span>
        </div>
      </div>

      {/* Firma Yönetim Bileşeni - Zaten mobil uyumlu hale getirmiştik */}
      <div className="transition-all duration-300">
        <CompanyManagement />
      </div>
    </div>
  );
};

export default AdminDashboard;