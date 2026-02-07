import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Plus, Mail, Eye, EyeOff, Trash2, CalendarPlus, Power, Building2 
} from 'lucide-react';

export default function CompanyManagement() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [formData, setFormData] = useState({ name: '', email: '', password: '', authorized_person: '' });

  const fetchCompanies = async () => {
    setLoading(true);
    const { data } = await supabase.from('companies').select('*').order('created_at', { ascending: false });
    if (data) setCompanies(data);
    setLoading(false);
  };

  useEffect(() => { fetchCompanies(); }, []);

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
    <div className="w-full">
      {/* BAŞLIK VE EKLEME: İnce ve Modern Sabit Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Building2 size={20} />
          </div>
          <h1 className="text-lg font-black text-gray-900 tracking-tighter">FİRMALAR</h1>
          <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold">{companies.length}</span>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-black active:scale-95 transition-transform"
        >
          + EKLE
        </button>
      </div>

      {/* LİSTE: Kenardan kenara, kutusuz tasarım */}
      <div className="divide-y divide-gray-50">
        {companies.map(c => {
          const remaining = Math.ceil((new Date(c.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          return (
            <div key={c.id} className="p-4 sm:p-6 hover:bg-gray-50/50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Sol Alan: Firma ve Yetkili */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h2 className="text-base font-black text-gray-900 truncate uppercase">{c.name}</h2>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${remaining > 0 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                      {remaining > 0 ? `${remaining} GÜN` : 'BİTTİ'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-gray-400 mt-0.5 uppercase tracking-wider">{c.authorized_person}</p>
                </div>

                {/* Orta Alan: Giriş Bilgileri */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={14} className="text-gray-300" />
                    <span className="text-xs font-bold">{c.email}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-lg">
                    <span className={`font-mono text-xs font-bold ${showPasswords[c.id] ? 'text-gray-900' : 'text-transparent bg-gray-300 rounded'}`}>
                      {c.plain_password}
                    </span>
                    <button onClick={() => setShowPasswords(p => ({...p, [c.id]: !p[c.id]}))} className="text-gray-400">
                      {showPasswords[c.id] ? <EyeOff size={14}/> : <Eye size={14}/>}
                    </button>
                  </div>
                </div>

                {/* Sağ Alan: Hızlı Aksiyonlar */}
                <div className="flex items-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <button onClick={() => handleExtendTrial(c.id, c.trial_ends_at)} className="flex-1 sm:flex-none bg-blue-50 text-blue-600 p-2.5 rounded-xl transition-colors hover:bg-blue-600 hover:text-white" title="Süre Uzat">
                    <CalendarPlus size={18} />
                  </button>
                  <button onClick={() => toggleStatus(c.id, c.is_active)} className={`flex-1 sm:flex-none p-2.5 rounded-xl font-black text-[10px] transition-all ${c.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {c.is_active ? 'AKTİF' : 'PASİF'}
                  </button>
                  <button onClick={() => { if(confirm('SİLİNSİN Mİ?')) supabase.from('companies').delete().eq('id', c.id).then(() => fetchCompanies()) }} className="p-2.5 text-gray-300 hover:text-red-500">
                    <Trash2 size={18} />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: Sadece gerektiğinde çıkan tertemiz bir form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-black mb-6 uppercase tracking-tighter text-gray-800">YENİ KAYIT</h2>
            <form onSubmit={(e) => { e.preventDefault(); /* handleCreate */ }} className="space-y-4">
              <input className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-blue-500 transition-all" placeholder="Firma Adı" required />
              <input className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-blue-500 transition-all" placeholder="Yetkili" required />
              <input className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-blue-500 transition-all" placeholder="E-posta" type="email" required />
              <input className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-blue-500 transition-all" placeholder="Şifre" type="text" required />
              <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all">KAYDET</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}