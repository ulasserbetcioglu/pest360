import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ClipboardCheck, Calendar, MapPin, Search, 
  Plus, ChevronRight, Clock, Filter 
} from 'lucide-react';

export default function VisitManagement() {
  const { user } = useAuth();
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchVisits = async () => {
    if (!user?.companyId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('visits')
      .select(`*, customers(name, address), profiles!visits_operator_id_fkey(first_name, last_name)`)
      .eq('company_id', user.companyId)
      .order('scheduled_at', { ascending: false });

    if (!error && data) setVisits(data);
    setLoading(false);
  };

  useEffect(() => { fetchVisits(); }, [user]);

  const filteredVisits = visits.filter(v => 
    v.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="p-6 md:p-10 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Ziyaretler</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Saha Operasyon Takibi</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all">
          <Plus size={20} /> YENİ SERVİS OLUŞTUR
        </button>
      </div>

      <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text"
            placeholder="Müşteri adına göre ara..."
            className="w-full bg-slate-50 border-none p-5 pl-12 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20 font-black text-slate-300 animate-pulse uppercase italic">Veriler Yükleniyor...</div>
          ) : filteredVisits.map((visit) => (
            <div key={visit.id} className="group relative bg-white border border-slate-50 rounded-[2.5rem] p-6 md:p-8 hover:shadow-xl hover:shadow-slate-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${visit.status === 'completed' ? 'bg-green-500 shadow-green-100' : 'bg-blue-500 shadow-blue-100'}`}>
                  <ClipboardCheck size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase leading-none">{visit.customers?.name}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase">
                      <MapPin size={12} /> {visit.customers?.address?.substring(0, 30)}...
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase">
                      <Clock size={12} /> {new Date(visit.scheduled_at).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">Operatör</p>
                  <p className="text-xs font-black text-slate-600 uppercase mt-1">{visit.profiles?.first_name} {visit.profiles?.last_name}</p>
                </div>
                <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}