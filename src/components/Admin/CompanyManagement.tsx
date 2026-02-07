import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Building2, Plus, X, Mail, 
  MoreVertical, Trash2, Edit3, 
  Clock, AlertCircle, Phone, MapPin, Shield, CheckCircle2, Power
} from 'lucide-react';

export default function CompanyManagement() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', tax_number: '', 
    tax_office: '', full_address: '', phone: '', authorized_person: ''
  });

  const fetchCompanies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setCompanies(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const getTrialStatus = (endDate: string) => {
    if (!endDate) return { label: 'Tanımsız', color: 'text-gray-500 bg-gray-50', icon: Clock };
    const remaining = Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (remaining > 0) return { label: `${remaining} gün kaldı`, color: 'text-blue-600 bg-blue-50', icon: Clock };
    return { label: 'Süre Doldu', color: 'text-red-600 bg-red-50', icon: AlertCircle };
  };

  const handleExtendTrial = async (id: string, currentEndDate: string) => {
    try {
      const baseDate = new Date(currentEndDate) > new Date() ? new Date(currentEndDate) : new Date();
      const newEndDate = new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();
      const { error } = await supabase.from('companies').update({ trial_ends_at: newEndDate }).eq('id', id);
      if (error) throw error;
      setActiveMenu(null);
      fetchCompanies();
    } catch (err: any) { alert(err.message); }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from('companies').update({ is_active: !currentStatus }).eq('id', id);
      if (error) throw error;
      fetchCompanies();
    } catch (err: any) { alert(err.message); }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu firmayı silmek istediğinize emin misiniz?')) {
      const { error } = await supabase.from('companies').delete().eq('id', id);
      if (!error) fetchCompanies();
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: company, error: compError } = await supabase.from('companies').insert([{
        name: formData.name, tax_number: formData.tax_number, tax_office: formData.tax_office,
        full_address: formData.full_address, email: formData.email, phone: formData.phone,
        authorized_person: formData.authorized_person, status: 'approved', is_active: true
      }]).select().single();
      if (compError) throw compError;
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email, password: formData.password,
        options: { data: { firstName: formData.authorized_person, role: 'company_admin', companyId: company.id } }
      });
      if (authError) throw authError;
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '', tax_number: '', tax_office: '', full_address: '', phone: '', authorized_person: '' });
      fetchCompanies();
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2"><Building2 className="text-blue-600" size={28} /> Firmalar</h2>
          <p className="text-sm text-gray-500 font-medium">Sistem Yönetimi ve Lisans Takibi</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-100 active:scale-95 transition-all">+ Yeni Firma</button>
      </div>

      {/* MASAÜSTÜ TABLO */}
      <div className="hidden md:block bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="p-6">Firma / Yetkili</th>
              <th className="p-6">Lisans Durumu</th>
              <th className="p-6">Hesap Durumu</th>
              <th className="p-6 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {companies.map(c => {
              const trial = getTrialStatus(c.trial_ends_at);
              return (
                <tr key={c.id} className="hover:bg-blue-50/10 transition-colors">
                  <td className="p-6">
                    <div className="font-bold text-gray-900">{c.name}</div>
                    <div className="text-xs text-gray-400 font-medium">{c.authorized_person}</div>
                  </td>
                  <td className="p-6">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold ${trial.color}`}>
                      <trial.icon size={14} /> {trial.label}
                    </span>
                  </td>
                  <td className="p-6">
                    <button onClick={() => toggleStatus(c.id, c.is_active)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black transition-all ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      <Power size={14} /> {c.is_active ? 'AKTİF' : 'PASİF'}
                    </button>
                  </td>
                  <td className="p-6 text-right relative">
                    <button onClick={() => setActiveMenu(activeMenu === c.id ? null : c.id)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl"><MoreVertical size={20} /></button>
                    {activeMenu === c.id && (
                      <div className="absolute right-6 top-14 w-48 bg-white border rounded-2xl shadow-xl z-50 py-1 border-gray-100 overflow-hidden">
                        <button onClick={() => handleExtendTrial(c.id, c.trial_ends_at)} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center gap-2 font-bold text-gray-700"><Edit3 size={16} className="text-blue-500" /> 14 Gün Uzat</button>
                        <button onClick={() => handleDelete(c.id)} className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 font-bold border-t"><Trash2 size={16}/> Firmayı Sil</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBİL KARTLAR */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {companies.map(c => {
          const trial = getTrialStatus(c.trial_ends_at);
          return (
            <div key={c.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-4">
              <div className="flex justify-between items-start">
                <div><h3 className="font-black text-gray-900 text-lg leading-tight">{c.name}</h3><p className="text-xs font-bold text-blue-600">{c.authorized_person}</p></div>
                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase ${trial.color}`}>{trial.label}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleStatus(c.id, c.is_active)} className={`flex-1 py-3 rounded-xl font-black text-[10px] ${c.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{c.is_active ? 'HESAP AKTİF' : 'HESAP PASİF'}</button>
                <button onClick={() => setActiveMenu(activeMenu === c.id ? null : c.id)} className="flex-1 py-3 bg-gray-50 text-gray-600 rounded-xl font-black text-[10px]">İŞLEMLER</button>
              </div>
              {activeMenu === c.id && (
                <div className="bg-blue-50 p-4 rounded-2xl space-y-2">
                  <button onClick={() => handleExtendTrial(c.id, c.trial_ends_at)} className="w-full py-2 text-blue-700 font-black text-xs uppercase border-b border-blue-100">+ 14 GÜN EKLE</button>
                  <button onClick={() => handleDelete(c.id)} className="w-full py-2 text-red-600 font-black text-xs uppercase">FİRMAYI SİL</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-xl rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[95vh]">
            <div className="flex justify-between items-center mb-8"><h3 className="text-2xl font-black text-gray-800">Firma Kaydı</h3><button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-100 rounded-full"><X size={24}/></button></div>
            <form onSubmit={handleCreate} className="space-y-4">
               <input className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none font-medium text-sm" placeholder="Firma Ticari Adı" required onChange={e => setFormData({...formData, name: e.target.value})} />
               <div className="grid grid-cols-2 gap-4">
                 <input className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none font-medium text-sm" placeholder="Vergi No" onChange={e => setFormData({...formData, tax_number: e.target.value})} />
                 <input className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none font-medium text-sm" placeholder="Vergi Dairesi" onChange={e => setFormData({...formData, tax_office: e.target.value})} />
               </div>
               <input className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none font-medium text-sm" placeholder="Yetkili Ad Soyad" required onChange={e => setFormData({...formData, authorized_person: e.target.value})} />
               <input className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none font-medium text-sm" placeholder="E-posta" required type="email" onChange={e => setFormData({...formData, email: e.target.value})} />
               <input className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none font-medium text-sm" placeholder="Giriş Şifresi" required type="text" onChange={e => setFormData({...formData, password: e.target.value})} />
               <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black shadow-xl shadow-blue-100 active:scale-95 transition-all mt-6 uppercase">{loading ? 'KAYDEDİLİYOR...' : 'KAYDET VE HESAP AÇ'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}