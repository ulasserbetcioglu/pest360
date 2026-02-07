import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, ClipboardCheck, Users, 
  MapPin, Settings, LogOut, Plus, Activity 
} from 'lucide-react';
import VisitManagement from '../Company/VisitManagement';
import OperatorManagement from '../Company/OperatorManagement';
import CustomerManagement from '../Company/CustomerManagement';
import CompanyOverview from './CompanyOverview'; // İstatistiklerin olduğu özet sayfa

export default function CompanyDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Özet', icon: LayoutDashboard },
    { id: 'visits', label: 'Ziyaretler', icon: ClipboardCheck },
    { id: 'customers', label: 'Müşteriler', icon: MapPin },
    { id: 'operators', label: 'Operatörler', icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      {/* MASAÜSTÜ SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-gray-50 h-screen sticky top-0">
        <div className="p-8">
          <h1 className="text-2xl font-black text-blue-600 tracking-tighter uppercase italic">Pest360</h1>
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mt-1">Firma Paneli</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-tighter transition-all ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-100'
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-50">
          <button onClick={logout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase text-red-400 hover:bg-red-50 transition-all">
            <LogOut size={20} /> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* ANA İÇERİK ALANI */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* MOBİL HEADER */}
        <div className="lg:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-50 p-4 flex justify-between items-center">
          <h1 className="text-xl font-black text-blue-600 italic uppercase">Pest360</h1>
          <div className="bg-blue-50 text-blue-600 p-2 rounded-lg font-black text-[10px]">
            {user?.firstName?.toUpperCase()}
          </div>
        </div>

        <div className="w-full">
          {activeTab === 'dashboard' && <CompanyOverview />}
          {activeTab === 'visits' && <VisitManagement />}
          {activeTab === 'customers' && <CustomerManagement />}
          {activeTab === 'operators' && <OperatorManagement />}
        </div>
      </main>

      {/* MOBİL ALT NAVİGASYON */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-3 flex justify-around items-center z-[100] pb-safe">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === item.id ? 'text-blue-600 scale-110' : 'text-gray-300'
            }`}
          >
            <item.icon size={20} />
            <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}