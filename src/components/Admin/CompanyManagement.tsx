import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Building2, Plus, X, Mail, Key, Eye, EyeOff,
  Trash2, Edit3, Clock, Power, CalendarPlus, ChevronRight
} from 'lucide-react';

export default function CompanyManagement() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', authorized_person: ''
  });

  const fetchCompanies = async () => {
    setLoading(true);
    const { data } = await supabase.from('companies').select('*').order('created_at', { ascending: false });
    if (data) setCompanies(data);
    setLoading(false);
  };

  useEffect(() => { fetchCompanies(); }, []);

  const getTrialStatus = (endDate: string) => {
    const remaining = Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return remaining > 0 
      ? { label: `${remaining} GÜN`, color: 'text-blue-600 bg-blue-50' }
      : { label: 'BİTTİ', color: 'text-red-600 bg-red-50' };
  };

  const handleExtendTrial = async (id: string, currentEndDate: string) => {
    const baseDate = new Date(currentEndDate) > new Date() ? new Date(currentEndDate) : new Date();
    const newEndDate = new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();
    await supabase.from('companies').update({ trial_ends_at: newEndDate }).eq('id', id);
    fetchCompanies();
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    await supabase.from('companies').update({ is_active: !currentStatus }).eq('id', id);
    fetchCompanies();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ÜST BAR: Sabit ve Temiz */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-4 md:px-8">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">FİRMALAR</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{companies.length} Kayıtlı</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 p-3 rounded-2xl text-white shadow-xl shadow-blue-200 active:scale-90 transition-transform"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* LİSTE ALANI */}
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-4">
        {companies.map(c => {
          const trial = getTrialStatus(c.trial_ends_at);
          return (
            <div key={c.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-all active:ring-2 active:ring-blue-100">
              {/* Kart Üst Bilgi */}
              <div className="p-5 flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white ${c.is_active ? 'bg-blue-600' : 'bg-slate-300'}`}>
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 leading-tight">{c.name}</h3>
                    <p className="text-xs font-bold text-blue-600 uppercase mt-0.5">{c.authorized_person}</p>
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-[10px] font-black ${trial.color}`}>
                  {trial.label}
                </div>
              </div>

              {/* Bilgi Satırları */}
              <div className="px-5 pb-5 space-y-3">
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-600 truncate max-w-[150px]">{c.email}</span>
                  </div>
                  <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                    <span className={`font-mono text-xs font-bold ${showPasswords[c.id] ? 'text-slate-900' : 'text-transparent bg-slate-200 rounded'}`}>
                      {c.plain_password}
                    </span>
                    <button onClick={() => setShowPasswords(p => ({...p, [c.id]: !p[c.id]}))} className="text-slate-400">
                      {showPasswords[c.id] ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  </div>
                </div>

                {/* HIZLI AKSİYON BUTONLARI - Tam Mobil Uyumlu */}
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => handleExtendTrial(c.id, c.trial_ends_at)}
                    className="flex flex-col items-center justify-center gap-1 bg-blue-50 text-blue-700 py-3 rounded-2xl transition-colors active:bg-blue-100"
                  >
                    <CalendarPlus size={20} />
                    <span className="text-[9px] font-black uppercase tracking-tighter">+14 GÜN</span>
                  </button>
                  
                  <button 
                    onClick={() => toggleStatus(c.id, c.is_active)}
                    className={`flex flex-col items-center justify-center gap-1 py-3 rounded-2xl transition-colors ${
                      c.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}
                  >
                    <Power size={20} />
                    <span className="text-[9px] font-black uppercase tracking-tighter">{c.is_active ? 'AKTİF' : 'PASİF'}</span>
                  </button>

                  <button 
                    onClick={() => { if(confirm('SİLİNSİN Mİ?')) supabase.from('companies').delete().eq('id', c.id).then(() => fetchCompanies()) }}
                    className="flex flex-col items-center justify-center gap-1 bg-slate-50 text-slate-400 py-3 rounded-2xl active:bg-red-50 active:text-red-600"
                  >
                    <Trash2 size={20} />
                    <span className="text-[9px] font-black uppercase tracking-tighter">SİL</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* YENİ FİRMA EKLEME MODALI - Alttan Kayarak Açılan (Sheet Style) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden" />
            <h2 className="text-2xl font-black text-slate-800 mb-6 tracking-tighter">YENİ FİRMA TANIMLA</h2>
            <form onSubmit={(e) => { e.preventDefault(); /* handleCreate buraya */ }} className="space-y-4 pb-12 sm:pb-0">
              <input className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none font-bold text-slate-700 transition-all" placeholder="Firma Adı" required />
              <input className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none font-bold text-slate-700 transition-all" placeholder="Yetkili Kişi" required />
              <input className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none font-bold text-slate-700 transition-all" placeholder="E-posta" type="email" required />
              <input className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none font-bold text-slate-700 transition-all" placeholder="Şifre Belirle" type="text" required />
              <button className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-blue-100 mt-4 active:scale-95 transition-transform uppercase">
                KAYDI TAMAMLA
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}