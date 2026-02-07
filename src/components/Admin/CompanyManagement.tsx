import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Building2, Plus, X, Mail, Key, Eye, EyeOff,
  MoreVertical, Trash2, Edit3, Clock, Power, ShieldCheck, CalendarPlus
} from 'lucide-react';

export default function CompanyManagement() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', tax_number: '', 
    tax_office: '', full_address: '', phone: '', authorized_person: ''
  });

  const fetchCompanies = async () => {
    setLoading(true);
    const { data } = await supabase.from('companies').select('*').order('created_at', { ascending: false });
    if (data) setCompanies(data);
    setLoading(false);
  };

  useEffect(() => { fetchCompanies(); }, []);

  const getTrialStatus = (endDate: string) => {
    if (!endDate) return { label: 'Tanımsız', color: 'text-gray-400 bg-gray-50' };
    const remaining = Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (remaining > 0) return { label: `${remaining} Gün`, color: 'text-blue-600 bg-blue-50' };
    return { label: 'Süre Doldu', color: 'text-red-600 bg-red-50' };
  };

  const handleExtendTrial = async (id: string, currentEndDate: string) => {
    const baseDate = new Date(currentEndDate) > new Date() ? new Date(currentEndDate) : new Date();
    const newEndDate = new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();
    await supabase.from('companies').update({ trial_ends_at: newEndDate }).eq('id', id);
    fetchCompanies();
    setActiveMenu(null);
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    await supabase.from('companies').update({ is_active: !currentStatus }).eq('id', id);
    fetchCompanies();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('DİKKAT: Bu firma ve tüm verileri SİLİNECEK. Onaylıyor musunuz?')) {
      await supabase.from('companies').delete().eq('id', id);
      fetchCompanies();
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: company, error: compError } = await supabase.from('companies').insert([{
        name: formData.name, email: formData.email, plain_password: formData.password,
        authorized_person: formData.authorized_person, is_active: true
      }]).select().single();
      if (compError) throw compError;
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email, password: formData.password,
        options: { data: { firstName: formData.authorized_person, role: 'company_admin', companyId: company.id } }
      });
      if (authError) throw authError;
      setIsModalOpen(false);
      fetchCompanies();
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-24 md:pb-10">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 md:p-8">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
              <Building2 size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 uppercase">Firma Merkezi</h1>
              <p className="text-gray-500 text-sm font-bold">Toplam {companies.length} Kayıtlı Şirket</p>
            </div>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-200 active:scale-95 transition-all">+ YENİ FİRMA EKLE</button>
        </div>
      </div>

      {/* MASAÜSTÜ TABLO (md ekran üstü) */}
      <div className="hidden md:block max-w-[1600px] mx-auto mt-6 px-4">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Firma & Yetkili</th>
                <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Giriş Bilgileri</th>
                <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Lisans</th>
                <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Süre Uzat</th>
                <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Durum</th>
                <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Aksiyon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {companies.map(c => {
                const trial = getTrialStatus(c.trial_ends_at);
                return (
                  <tr key={c.id} className="hover:bg-blue-50/10">
                    <td className="p-6 font-bold">{c.name} <br/><span className="text-xs text-blue-600 uppercase tracking-tighter">{c.authorized_person}</span></td>
                    <td className="p-6">
                      <div className="text-sm font-bold text-gray-700 flex items-center gap-1"><Mail size={14}/> {c.email}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`font-mono text-[10px] px-2 py-1 rounded ${showPasswords[c.id] ? 'bg-gray-100' : 'bg-gray-200 text-transparent select-none'}`}>{c.plain_password}</span>
                        <button onClick={() => setShowPasswords(p => ({...p, [c.id]: !p[c.id]}))}>{showPasswords[c.id] ? <EyeOff size={14}/> : <Eye size={14}/>}</button>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className={`px-4 py-2 rounded-full text-xs font-black ${trial.color}`}>{trial.label}</span>
                    </td>
                    <td className="p-6 text-center">
                      <button onClick={() => handleExtendTrial(c.id, c.trial_ends_at)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><CalendarPlus size={20}/></button>
                    </td>
                    <td className="p-6 text-center">
                      <button onClick={() => toggleStatus(c.id, c.is_active)} className={`px-4 py-2 rounded-xl text-[10px] font-black ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.is_active ? 'AKTİF' : 'PASİF'}</button>
                    </td>
                    <td className="p-6 text-right"><button onClick={() => handleDelete(c.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={20}/></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBİL KARTLAR (sm ekran altı) */}
      <div className="md:hidden p-4 space-y-4">
        {companies.map(c => {
          const trial = getTrialStatus(c.trial_ends_at);
          return (
            <div key={c.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-4">
              <div className="flex justify-between items-start border-b border-gray-50 pb-4">
                <div><h3 className="font-black text-gray-900 text-lg leading-tight">{c.name}</h3><p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{c.authorized_person}</p></div>
                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase ${trial.color}`}>{trial.label}</span>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-bold text-gray-500 flex items-center gap-2"><Mail size={14}/> {c.email}</div>
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 font-mono text-sm rounded ${showPasswords[c.id] ? 'bg-gray-100' : 'bg-gray-200 text-transparent'}`}>{c.plain_password}</div>
                  <button onClick={() => setShowPasswords(p => ({...p, [c.id]: !p[c.id]}))} className="text-gray-400">{showPasswords[c.id] ? <EyeOff size={16}/> : <Eye size={16}/>}</button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-4">
                <button onClick={() => handleExtendTrial(c.id, c.trial_ends_at)} className="p-3 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><CalendarPlus size={20}/></button>
                <button onClick={() => toggleStatus(c.id, c.is_active)} className={`col-span-1 p-3 rounded-2xl font-black text-[10px] ${c.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{c.is_active ? 'AKTİF' : 'PASİF'}</button>
                <button onClick={() => handleDelete(c.id)} className="p-3 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center"><Trash2 size={20}/></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-t-[2.5rem] sm:rounded-[3rem] p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Firma Tanımla</h2><button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-100 rounded-full"><X size={24}/></button></div>
            <form onSubmit={handleCreate} className="space-y-4">
               <input className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none font-bold" placeholder="Firma Ticari Adı" required onChange={e => setFormData({...formData, name: e.target.value})} />
               <input className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none font-bold" placeholder="Yetkili Ad Soyad" required onChange={e => setFormData({...formData, authorized_person: e.target.value})} />
               <input className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none font-bold" placeholder="E-posta" required type="email" onChange={e => setFormData({...formData, email: e.target.value})} />
               <input className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none font-bold" placeholder="Giriş Şifresi" required type="text" onChange={e => setFormData({...formData, password: e.target.value})} />
               <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-blue-100 mt-6 uppercase">{loading ? 'KAYDEDİLİYOR...' : 'KAYDET VE HESAP AÇ'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}