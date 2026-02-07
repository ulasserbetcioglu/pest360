import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Building2, Plus, X, Mail, Key, 
  MoreVertical, Trash2, Edit3, 
  Clock, AlertCircle, Power, ShieldCheck
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

  useEffect(() => { fetchCompanies(); }, []);

  const getTrialStatus = (endDate: string) => {
    if (!endDate) return { label: 'Tanımsız', color: 'text-gray-400 bg-gray-50' };
    const remaining = Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (remaining > 0) return { label: `${remaining} gün`, color: 'text-blue-600 bg-blue-50' };
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
    if (window.confirm('Bu firmayı SİLMEK istediğinize emin misiniz?')) {
      await supabase.from('companies').delete().eq('id', id);
      fetchCompanies();
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Üst Başlık Alanı - Sayfa Genişliği */}
      <div className="border-b border-gray-100 bg-gray-50/50 p-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <Building2 className="text-blue-600" size={32} />
              Firma Yönetim Merkezi
            </h1>
            <p className="text-gray-500 font-medium mt-1">Sistemdeki tüm kayıtlı ilaçlama firmaları, e-posta adresleri ve lisans durumları.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <Plus size={20} /> Yeni Firma Kaydet
          </button>
        </div>
      </div>

      {/* Tablo Alanı - Kutu tasarımından çıkarıldı, tam genişlik kullanıyor */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Firma Adı & Yetkili</th>
              <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Giriş E-postası</th>
              <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Deneme Süresi</th>
              <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Hesap Durumu</th>
              <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {companies.map((c) => {
              const trial = getTrialStatus(c.trial_ends_at);
              return (
                <tr key={c.id} className="hover:bg-blue-50/20 transition-colors">
                  <td className="p-6">
                    <div className="font-bold text-gray-900 text-base">{c.name}</div>
                    <div className="text-xs text-blue-600 font-bold flex items-center gap-1 mt-1">
                      <ShieldCheck size={14} /> {c.authorized_person}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                      <Mail size={16} className="text-gray-400" />
                      {c.email}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">Şifre: encrypted_at_auth</div>
                  </td>
                  <td className="p-6 text-center">
                    <span className={`px-4 py-2 rounded-full text-xs font-black inline-flex items-center gap-1.5 ${trial.color}`}>
                      <Clock size={14} /> {trial.label}
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <button 
                      onClick={() => toggleStatus(c.id, c.is_active)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                    >
                      {c.is_active ? '● AKTİF' : '○ PASİF'}
                    </button>
                  </td>
                  <td className="p-6 text-right relative">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === c.id ? null : c.id)}
                      className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
                    >
                      <MoreVertical size={22} />
                    </button>
                    {activeMenu === c.id && (
                      <div className="absolute right-8 top-16 w-52 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 py-2 overflow-hidden animate-in fade-in zoom-in duration-150">
                        <button onClick={() => handleExtendTrial(c.id, c.trial_ends_at)} className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 flex items-center gap-3 font-bold text-gray-700">
                          <Edit3 size={18} className="text-blue-600" /> 14 Gün Süre Ekle
                        </button>
                        <button className="w-full text-left px-4 py-3 text-sm hover:bg-orange-50 flex items-center gap-3 font-bold text-orange-600">
                          <Key size={18} /> Şifre Sıfırla
                        </button>
                        <div className="border-t border-gray-50 my-1"></div>
                        <button onClick={() => handleDelete(c.id)} className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 flex items-center gap-3 font-bold text-red-600">
                          <Trash2 size={18} /> Firmayı Tamamen Sil
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Kayıt Modalı - Mobil Uyumluluğu Korundu */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl animate-in slide-in-from-bottom-8 duration-300 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-800">Yeni Firma Oluştur</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-100 rounded-full hover:rotate-90 transition-all"><X size={24}/></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); /* handleCreate buraya gelecek */ }} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input className="bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none font-bold" placeholder="Firma Adı" required />
                <input className="bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none font-bold" placeholder="Yetkili Kişi" required />
                <input className="bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none font-bold" placeholder="E-posta" type="email" required />
                <input className="bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none font-bold" placeholder="Giriş Şifresi" type="text" required />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-blue-100 mt-4">KAYDI TAMAMLA VE HESAP AÇ</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}