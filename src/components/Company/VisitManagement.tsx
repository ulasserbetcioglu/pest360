import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ClipboardCheck, Calendar, MapPin, User, 
  Search, Plus, ChevronRight, Clock, 
  Filter, CheckCircle2, AlertCircle, MoreHorizontal
} from 'lucide-react';

export default function VisitManagement() {
  const { user } = useAuth();
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchVisits = async () => {
    setLoading(true);
    // Ziyaretleri müşteriler ve operatörlerle birlikte çekiyoruz
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        customers (name, address),
        operators:profiles (first_name, last_name)
      `)
      .eq('company_id', user?.companyId)
      .order('scheduled_at', { ascending: false });

    if (!error && data) setVisits(data);
    setLoading(false);
  };

  useEffect(() => { fetchVisits(); }, [user]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="w-full min-h-screen bg-white pb-24">
      {/* HEADER: Modern & Sabit */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-50 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Ziyaretler</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Servis & Raporlama</p>
          </div>
          <button className="bg-blue-600 text-white p-3 rounded-2xl shadow-xl shadow-blue-100 active:scale-90 transition-transform">
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* ARAMA & FİLTRE: Full Mobil Uyumlu */}
      <div className="p-6 max-w-5xl mx-auto space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Müşteri veya operatör ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border-none p-4 pl-12 rounded-2xl font-bold text-sm outline-none ring-2 ring-transparent focus:ring-blue-100 transition-all"
            />
          </div>
          <button className="bg-slate-50 p-4 rounded-2xl text-slate-600">
            <Filter size={20} />
          </button>
        </div>

        {/* ZİYARET LİSTESİ: Timeline Tasarımı */}
        <div className="space-y-6 mt-8">
          {visits.length === 0 && !loading && (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
              <ClipboardCheck size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Henüz servis kaydı yok</p>
            </div>
          )}

          {visits.map((visit) => (
            <div key={visit.id} className="relative pl-8 group">
              {/* Timeline Çizgisi */}
              <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-slate-100 group-last:bg-transparent"></div>
              {/* Timeline Noktası */}
              <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm z-10 ${
                visit.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
              }`}></div>

              <div className="bg-white border border-slate-50 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow active:scale-[0.98]">
                <div className="flex flex-col gap-4">
                  {/* Durum & Tarih */}
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusStyle(visit.status)}`}>
                      {visit.status === 'completed' ? 'TAMAMLANDI' : 'BEKLEYEN'}
                    </span>
                    <div className="flex items-center gap-2 text-slate-400 font-black text-[10px]">
                      <Calendar size={14} />
                      {new Date(visit.scheduled_at).toLocaleDateString('tr-TR')}
                      <Clock size={14} className="ml-2" />
                      {new Date(visit.scheduled_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {/* Müşteri & Adres Bilgisi */}
                  <div>
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-tight">
                      {visit.customers?.name || 'Bilinmeyen Müşteri'}
                    </h3>
                    <div className="flex items-start gap-1 mt-2 text-slate-500">
                      <MapPin size={14} className="shrink-0 mt-0.5" />
                      <p className="text-xs font-bold leading-relaxed">{visit.customers?.address || 'Adres belirtilmemiş'}</p>
                    </div>
                  </div>

                  {/* Operatör & Aksiyon Çubuğu */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-black text-[10px]">
                        {visit.operators?.first_name?.[0]}{visit.operators?.last_name?.[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-300 uppercase">Operatör</span>
                        <span className="text-xs font-black text-slate-600">
                          {visit.operators?.first_name} {visit.operators?.last_name}
                        </span>
                      </div>
                    </div>
                    
                    <button className="flex items-center gap-1 bg-slate-50 px-4 py-2 rounded-xl text-blue-600 font-black text-[10px] hover:bg-blue-600 hover:text-white transition-all uppercase">
                      Detaylar <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}