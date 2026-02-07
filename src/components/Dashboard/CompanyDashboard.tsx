import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, ClipboardCheck, Users, 
  MapPin, LogOut, Plus, ChevronRight 
} from 'lucide-react';

// Modüller
import VisitManagement from '../Company/VisitManagement';
import OperatorManagement from '../Company/OperatorManagement';
import CustomerManagement from '../Company/CustomerManagement';
import CompanyOverview from './CompanyOverview';

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
      
      {/* --- SIDEBAR (MASAÜSTÜ) --- */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-gray-100 h-screen sticky top-0 bg-white">
        <div className="p-10">
          <h1 className="text-3xl font-black text-blue-600 tracking-tighter italic uppercase">Pest360</h1>
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mt-1">Firma Yönetimi</p>
        </div>

        <nav className="flex-1 px-6 space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-tighter transition-all ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-100'
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-gray-50">
          <button onClick={logout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase text-red-400 hover:bg-red-50 transition-all">
            <LogOut size={20} /> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* --- ANA İÇERİK ALANI --- */}
      <main className="flex-1 min-w-0 bg-white">
        
        {/* MOBİL ÜST BAR */}
        <div className="lg:hidden sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-50 p-5 flex justify-between items-center">
          <h1 className="text-2xl font-black text-blue-600 italic uppercase tracking-tighter">Pest360</h1>
          <button onClick={() => setActiveTab('dashboard')} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-black text-[10px] uppercase">
            {user?.firstName}
          </button>
        </div>

        {/* DİNAMİK İÇERİK */}
        <div className="w-full">
          {activeTab === 'dashboard' && <CompanyOverview />}
          {activeTab === 'visits' && <VisitManagement />}
          {activeTab === 'customers' && <CustomerManagement />}
          {activeTab === 'operators' && <OperatorManagement />}
        </div>
      </main>

      {/* --- MOBİL ALT NAVİGASYON (TAB BAR) --- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-3 flex justify-around items-center z-[100] pb-safe">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 p-2 transition-all ${
              activeTab === item.id ? 'text-blue-600 scale-110' : 'text-gray-300'
            }`}
          >
            <item.icon size={22} />
            <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
}