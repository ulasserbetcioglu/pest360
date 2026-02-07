import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Building2, Plus, X, Mail, 
  MoreVertical, Trash2, Edit3, 
  Clock, AlertCircle, Phone, MapPin, Shield
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

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu firmayı ve bağlı tüm kullanıcıları silmek istediğinize emin misiniz?')) {
      const { error } = await supabase.from('companies').delete().eq('id', id);
      if (!error) {
        fetchCompanies();
        setActiveMenu(null);
      } else {
        alert('Silme işlemi başarısız: ' + error.message);
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Şirketi Ekle
      const { data: company, error: compError } = await supabase
        .from('companies')
        .insert([{
          name: formData.name,
          tax_number: formData.tax_number,
          tax_office: formData.tax_office,
          full_address: formData.full_address,
          email: formData.email,
          phone: formData.phone,
          authorized_person: formData.authorized_person,
          status: 'approved',
          is_active: true
        }])
        .select().single();

      if (compError) throw compError;

      // 2. Auth Kullanıcısını Oluştur (Firma Admini Olarak)
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { 
          data: { 
            firstName: formData.authorized_person, 
            role: 'company_admin', 
            companyId: company.id 
          } 
        }
      });

      if (authError) throw authError;

      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '', tax_number: '', tax_office: '', full_address: '', phone: '', authorized_person: '' });
      fetchCompanies();
      alert('Firma ve yönetici hesabı başarıyla oluşturuldu.');
    } catch (err: any) {
      alert('Hata: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Üst Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <Building2 className="text-blue-600" size={28} /> Firmalar
          </h2>
          <p className="text-sm text-gray-500 font-medium">Sistemdeki tüm ilaçlama şirketleri ve lisans durumları</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={20} /> Yeni Firma Tanımla
        </button>
      </div>

      {/* Masaüstü Tablo Görünümü */}
      <div className="hidden md:block bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="p-6">Firma / Yetkili</th>
              <th className="p-6">Lisans Durumu</th>
              <th className="p-6">İletişim</th>
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
                      <trial.icon size={14} />
                      {trial.label}
                    </span>
                  </td>
                  <td className="p-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2 mb-1"><Mail size={14} className="text-gray-300"/> {c.email}</div>
                    <div className="flex items-center gap-2"><Phone size={14} className="text-gray-300"/> {c.phone || '-'}</div>
                  </td>
                  <td className="p-6 text-right relative">
                    <button onClick={() => setActiveMenu(activeMenu === c.id ? null : c.id)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
                      <MoreVertical size={20} />
                    </button>
                    {activeMenu === c.id && (
                      <div className="absolute right-6 top-14 w-48 bg-white border rounded-2xl shadow-xl z-50 overflow-hidden py-1 border-gray-100">
                        <button className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center gap-2 font-bold text-gray-700">
                          <Edit3 size={16} className="text-blue-500" /> Süreyi Uzat
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 font-bold border-t border-gray-50">
                          <Trash2 size={16}/> Firmayı Sil
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {companies.length === 0 && !loading && <div className="p-20 text-center text-gray-400 font-medium">Henüz kayıtlı firma bulunmuyor.</div>}
      </div>

      {/* Mobil Kart Görünümü */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {companies.map(c => {
          const trial = getTrialStatus(c.trial_ends_at);
          return (
            <div key={c.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-4">
              <div className="flex justify-between items-start">
                <div className="max-w-[70%]">
                  <h3 className="font-black text-gray-900 text-lg leading-tight mb-1">{c.name}</h3>
                  <p className="text-xs font-bold text-blue-600 flex items-center gap-1">
                    <Shield size={12} /> {c.authorized_person}
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${trial.color}`}>
                  {trial.label}
                </span>
              </div>
              
              <div className="grid grid-cols-1 gap-2 py-4 border-y border-gray-50">
                <div className="flex items-center gap-2 text-xs text-gray-500"><Mail size={14}/> {c.email}</div>
                <div className="flex items-center gap-2 text-xs text-gray-500"><Phone size={14}/> {c.phone || 'Telefon Yok'}</div>
                <div className="flex items-center gap-2 text-xs text-gray-500"><MapPin size={14}/> {c.tax_office || 'Adres Yok'}</div>
              </div>

              <div className="flex gap-2">
                 <button onClick={() => handleDelete(c.id)} className="flex-1 py-3.5 bg-red-50 text-red-600 rounded-2xl font-black text-xs flex items-center justify-center gap-2">
                  <Trash2 size={16} /> SİL
                 </button>
                 <button onClick={() => setActiveMenu(activeMenu === c.id ? null : c.id)} className="flex-1 py-3.5 bg-gray-50 text-gray-600 rounded-2xl font-black text-xs flex items-center justify-center gap-2">
                  <Edit3 size={16} /> İŞLEMLER
                 </button>
              </div>

              {activeMenu === c.id && (
                <div className="bg-blue-50 p-4 rounded-2xl animate-in slide-in-from-top duration-200">
                  <button className="w-full text-center py-2 text-blue-700 font-bold text-sm">Deneme Süresini Uzat (14 Gün)</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* YENİ FİRMA EKLEME MODALI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-xl rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 md:p-10 shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-y-auto max-h-[95vh]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-gray-800 tracking-tight">Firma Kaydı</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-4 pb-10 sm:pb-0">
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Firma Bilgileri</label>
                 <input className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none transition-all font-medium" 
                   placeholder="Firma Ticari Adı" required onChange={e => setFormData({...formData, name: e.target.value})} />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <input className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none transition-all font-medium" 
                   placeholder="Vergi No" onChange={e => setFormData({...formData, tax_number: e.target.value})} />
                 <input className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none transition-all font-medium" 
                   placeholder="Vergi Dairesi" onChange={e => setFormData({...formData, tax_office: e.target.value})} />
               </div>

               <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Yetkili & Giriş</label>
                 <input className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none transition-all font-medium" 
                   placeholder="Yetkili Ad Soyad" required onChange={e => setFormData({...formData, authorized_person: e.target.value})} />
               </div>

               <input className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none transition-all font-medium" 
                 placeholder="E-posta Adresi" required type="email" onChange={e => setFormData({...formData, email: e.target.value})} />
               
               <input className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none transition-all font-medium" 
                 placeholder="Giriş Şifresi" required type="text" onChange={e => setFormData({...formData, password: e.target.value})} />
               
               <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black shadow-xl shadow-blue-100 active:scale-95 transition-all mt-6 disabled:opacity-50">
                 {loading ? 'KAYDEDİLİYOR...' : 'FİRMAYI KAYDET VE HESAP AÇ'}
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}