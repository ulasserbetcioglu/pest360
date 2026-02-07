import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Plus, Mail, Eye, EyeOff, Trash2, CalendarPlus, Power, Building2, Edit3, X 
} from 'lucide-react';

export default function CompanyManagement() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any | null>(null); // Düzenleme state'i
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [formData, setFormData] = useState({ name: '', email: '', password: '', authorized_person: '' });

  const fetchCompanies = async () => {
    setLoading(true);
    const { data } = await supabase.from('companies').select('*').order('created_at', { ascending: false });
    if (data) setCompanies(data);
    setLoading(false);
  };

  useEffect(() => { fetchCompanies(); }, []);

  // Düzenleme Modini Aç
  const openEditModal = (company: any) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      email: company.email,
      password: company.plain_password || '',
      authorized_person: company.authorized_person
    });
    setIsModalOpen(true);
  };

  // Yeni Kayıt veya Düzenleme Kaydet
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCompany) {
        // GÜNCELLEME İŞLEMİ
        const { error } = await supabase
          .from('companies')
          .update({
            name: formData.name,
            email: formData.email,
            plain_password: formData.password,
            authorized_person: formData.authorized_person
          })
          .eq('id', editingCompany.id);

        if (error) throw error;
        alert('Firma bilgileri güncellendi.');
      } else {
        // YENİ KAYIT İŞLEMİ (Burada Auth signUp da olmalı)
        // ... (Kayıt fonksiyonun)
      }
      
      setIsModalOpen(false);
      setEditingCompany(null);
      fetchCompanies();
    } catch (err: any) {
      alert('Hata: ' + err.message);
    } finally {
      setLoading(false);
    }
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
    <div className="w-full min-h-screen bg-white">
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white"><Building2 size={20} /></div>
          <h1 className="text-lg font-black tracking-tighter">FİRMA YÖNETİMİ</h1>
        </div>
        <button onClick={() => { setEditingCompany(null); setFormData({name:'', email:'', password:'', authorized_person:''}); setIsModalOpen(true); }} className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-xs font-black">+ YENİ FİRMA</button>
      </div>

      {/* LİSTE */}
      <div className="divide-y divide-gray-50">
        {companies.map(c => {
          const remaining = Math.ceil((new Date(c.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          return (
            <div key={c.id} className="p-5 sm:p-8 hover:bg-slate-50/50 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Sol Alan */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-base font-black text-slate-900 uppercase">{c.name}</h2>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${remaining > 0 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                      {remaining > 0 ? `${remaining} GÜN` : 'SÜRE BİTTİ'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-slate-400">
                    <span className="text-blue-600 uppercase tracking-wider">{c.authorized_person}</span>
                    <span className="flex items-center gap-1"><Mail size={12}/> {c.email}</span>
                  </div>
                </div>

                {/* Şifre Alanı */}
                <div className="flex items-center gap-3 bg-slate-50 self-start md:self-center px-4 py-2 rounded-2xl border border-slate-100">
                  <span className={`font-mono text-xs font-bold ${showPasswords[c.id] ? 'text-slate-900' : 'text-transparent bg-slate-200 rounded'}`}>
                    {c.plain_password || '******'}
                  </span>
                  <button onClick={() => setShowPasswords(p => ({...p, [c.id]: !p[c.id]}))} className="text-slate-400">
                    {showPasswords[c.id] ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>

                {/* Aksiyonlar */}
                <div className="flex items-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                  <button onClick={() => openEditModal(c)} className="flex-1 md:flex-none p-3 bg-amber-50 text-amber-600 rounded-2xl hover:bg-amber-600 hover:text-white transition-all" title="Düzenle">
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => handleExtendTrial(c.id, c.trial_ends_at)} className="flex-1 md:flex-none p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all" title="14 Gün Ekle">
                    <CalendarPlus size={18} />
                  </button>
                  <button onClick={() => toggleStatus(c.id, c.is_active)} className={`flex-1 md:flex-none px-4 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all ${c.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {c.is_active ? 'AKTİF' : 'PASİF'}
                  </button>
                  <button onClick={() => { if(confirm('SİLİNSİN Mİ?')) supabase.from('companies').delete().eq('id', c.id).then(() => fetchCompanies()) }} className="p-3 text-slate-300 hover:text-red-500">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL (YENİ/DÜZENLE) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase tracking-tighter text-slate-800">
                {editingCompany ? 'BİLGİLERİ DÜZENLE' : 'YENİ FİRMA'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-50 rounded-full"><X size={20}/></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Firma Adı</label>
                <input className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-blue-500 transition-all" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Yetkili Ad Soyad</label>
                <input className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-blue-500 transition-all" 
                  value={formData.authorized_person} onChange={e => setFormData({...formData, authorized_person: e.target.value})} required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">E-posta</label>
                <input className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-blue-500 transition-all" 
                  type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Şifre (Görünür Kaydedilir)</label>
                <input className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-blue-500 transition-all" 
                  type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
              </div>
              <button className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all uppercase mt-4">
                {editingCompany ? 'GÜNCELLEMEYİ KAYDET' : 'FİRMAYI OLUŞTUR'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}