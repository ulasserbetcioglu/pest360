import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Users, Briefcase, MapPin, ClipboardList, Plus, ChevronRight, Activity } from 'lucide-react';

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    operators: 0,
    customers: 0,
    branches: 0,
    tasks: 0
  });
  const [loading, setLoading] = useState(true);

  // Veritabanından gerçek sayıları çekme
  const fetchStats = async () => {
    if (!user?.companyId) return;
    
    setLoading(true);
    // Operatör sayısı (profiles tablosunda bu companyId'ye sahip operatörler)
    const { count: opCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', user.companyId)
      .eq('role', 'operator');

    // Müşteri sayısı
    const { count: cusCount } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', user.companyId);

    setStats({
      operators: opCount || 0,
      customers: cusCount || 0,
      branches: 0, // Şubeler tablon varsa buradan çekebilirsin
      tasks: 0     // İşlemler tablon varsa buradan çekebilirsin
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  const statItems = [
    { title: 'Operatörler', value: stats.operators, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Müşteriler', value: stats.customers, icon: Briefcase, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Şubeler', value: stats.branches, icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'İşlemler', value: stats.tasks, icon: ClipboardList, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="w-full min-h-screen bg-white pb-24">
      {/* Üst Karşılama - Kutusuz, Modern Header */}
      <div className="p-6 md:p-10 border-b border-gray-50 bg-gray-50/30">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-blue-600 p-2 rounded-xl text-white">
            <Activity size={20} />
          </div>
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Yönetim Merkezi</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
          HOŞ GELDİN, {user?.firstName}
        </h1>
        <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-wider flex items-center gap-2">
          {user?.companies?.name || 'Pest360 Firma Paneli'} 
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
        </p>
      </div>

      <div className="p-6 md:p-10 space-y-10 max-w-[1600px] mx-auto">
        
        {/* İstatistikler - Mobilde 2 sütun, çerçevesiz şık kartlar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {statItems.map((stat, index) => (
            <div key={index} className="flex flex-col gap-2 p-2 group cursor-default">
              <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
                <p className="text-3xl font-black text-slate-900 leading-none mt-1">
                  {loading ? '...' : stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Hızlı İşlemler - Modern Aksiyon Listesi */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">Hızlı Aksiyonlar</h3>
            <div className="grid grid-cols-1 gap-3">
              <button className="flex items-center justify-between p-6 bg-blue-50/50 hover:bg-blue-600 group transition-all rounded-[2rem] border border-blue-100/50">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-2xl text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                    <Users size={24} />
                  </div>
                  <span className="font-black text-slate-800 group-hover:text-white uppercase tracking-tight">Yeni Operatör Tanımla</span>
                </div>
                <ChevronRight size={24} className="text-blue-200 group-hover:text-white" />
              </button>

              <button className="flex items-center justify-between p-6 bg-green-50/50 hover:bg-green-600 group transition-all rounded-[2rem] border border-green-100/50">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-2xl text-green-600 shadow-sm group-hover:scale-110 transition-transform">
                    <Briefcase size={24} />
                  </div>
                  <span className="font-black text-slate-800 group-hover:text-white uppercase tracking-tight">Yeni Müşteri Kaydı</span>
                </div>
                <ChevronRight size={24} className="text-green-200 group-hover:text-white" />
              </button>
            </div>
          </div>

          {/* Aktivite Akışı - Temiz Liste */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">Son Aktiviteler</h3>
            <div className="bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200 p-10 flex flex-col items-center justify-center text-center">
              <div className="bg-white p-5 rounded-full shadow-sm mb-4">
                <ClipboardList className="text-slate-200" size={40} />
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-loose">
                Henüz bir operasyonel kayıt<br/>bulunmuyor.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}