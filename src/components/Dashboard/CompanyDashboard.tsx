import React, { useState } from 'react';
import { 
  Users, MapPin, ClipboardList, TrendingUp, 
  Plus, Search, ChevronRight, briefcase, Calendar
} from 'lucide-react';
import OperatorManagement from '../Company/OperatorManagement'; // Birazdan oluşturacağız
import CustomerManagement from '../Company/CustomerManagement'; // Birazdan oluşturacağız

export default function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'operators' | 'customers'>('overview');

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ÜST NAVİGASYON - Modern & Dinamik */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-50 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase">OPERASYON MERKEZİ</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sistem Aktif</span>
            </div>
          </div>
          <button className="bg-slate-100 p-3 rounded-2xl text-slate-600 hover:bg-blue-600 hover:text-white transition-all">
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* KONTROL SEKMELERİ - Mobilde Kaydırılabilir */}
      <div className="px-4 py-6 max-w-5xl mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'overview', label: 'Özet', icon: TrendingUp },
            { id: 'operators', label: 'Operatörler', icon: Users },
            { id: 'customers', label: 'Müşteriler', icon: MapPin },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-tighter transition-all whitespace-nowrap ${
                activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* İÇERİK ALANI */}
      <div className="max-w-5xl mx-auto px-4 pb-24">
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Hızlı İstatistik Kartları */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-6 rounded-[2.5rem] border border-blue-100">
                <ClipboardList className="text-blue-600 mb-3" size={28} />
                <div className="text-2xl font-black text-blue-900 leading-none">12</div>
                <p className="text-[10px] font-black text-blue-400 uppercase mt-1">Bugünkü İşler</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                <Users className="text-slate-600 mb-3" size={28} />
                <div className="text-2xl font-black text-slate-900 leading-none">5</div>
                <p className="text-[10px] font-black text-slate-400 uppercase mt-1">Aktif Ekip</p>
              </div>
            </div>

            {/* Son Aktiviteler Listesi */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Son İşlemler</h3>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-white border border-slate-50 rounded-3xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-50 text-orange-600 p-3 rounded-2xl">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-sm">Merkez Restoran</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Periyodik İlaçlama • 14:00</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-300" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'operators' && <OperatorManagement />}
        {activeTab === 'customers' && <CustomerManagement />}
      </div>
    </div>
  );
}