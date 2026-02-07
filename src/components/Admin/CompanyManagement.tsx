import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Building2, Plus, X, Mail, Key, Eye, EyeOff,
  MoreVertical, Trash2, Edit3, Clock, Power, ShieldCheck 
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Şirketi Ekle (Şifreyi plain_password kolonuna da yazıyoruz)
      const { data: company, error: compError } = await supabase
        .from('companies')
        .insert([{
          name: formData.name,
          email: formData.email,
          plain_password: formData.password, // AÇIK ŞİFRE BURAYA KAYDOLUYOR
          authorized_person: formData.authorized_person,
          tax_number: formData.tax_number,
          tax_office: formData.tax_office,
          full_address: formData.full_address,
          phone: formData.phone,
          status: 'approved',
          is_active: true
        }])
        .select().single();

      if (compError) throw compError;

      // 2. Auth Kullanıcısını Oluştur
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { firstName: formData.authorized_person, role: 'company_admin', companyId: company.id } }
      });

      if (authError) throw authError;

      setIsModalOpen(false);
      fetchCompanies();
      alert('Firma başarıyla oluşturuldu.');
    } catch (err: any) {
      alert('Hata: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3 uppercase tracking-tight">
              <Building2 className="text-blue-600" size={32} /> Sistem Admin Paneli
            </h1>
            <p className="text-gray-500 font-medium">Tüm firmaların giriş e-postalarını ve şifrelerini buradan görebilirsiniz.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-100 active:scale-95 transition-all">
            YENİ FİRMA KAYDET
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-100">
              <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Firma & Yetkili</th>
              <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Giriş E-postası</th>
              <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Açık Şifre</th>
              <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Durum</th>
              <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {companies.map((c) => (
              <tr key={c.id} className="hover:bg-blue-50/10 transition-colors font-medium">
                <td className="p-6">
                  <div className="font-bold text-gray-900">{c.name}</div>
                  <div className="text-xs text-blue-600 font-bold">{c.authorized_person}</div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2 text-gray-800 tracking-tight">
                    <Mail size={14} className="text-gray-400" /> {c.email}
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-sm px-2 py-1 bg-gray-100 rounded ${showPasswords[c.id] ? 'text-gray-900' : 'text-transparent bg-gray-200 select-none'}`}>
                      {c.plain_password || '---'}
                    </span>
                    <button 
                      onClick={() => setShowPasswords(prev => ({...prev, [c.id]: !prev[c.id]}))}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      {showPasswords[c.id] ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  </div>
                </td>
                <td className="p-6 text-center">
                  <span className={`px-3 py-1.5 rounded-full text-[10px] font-black ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {c.is_active ? 'AKTİF' : 'PASİF'}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <button onClick={() => setActiveMenu(activeMenu === c.id ? null : c.id)} className="p-2 text-gray-300 hover:bg-gray-100 rounded-lg">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Kayıt Modalı */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Yeni Firma Tanımla</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-100 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"><X size={24}/></button>
            </div>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none font-bold" 
                placeholder="Firma Adı" required onChange={e => setFormData({...formData, name: e.target.value})} />
              <input className="bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none font-bold" 
                placeholder="Yetkili Ad Soyad" required onChange={e => setFormData({...formData, authorized_person: e.target.value})} />
              <input className="bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none font-bold" 
                placeholder="Giriş E-postası" type="email" required onChange={e => setFormData({...formData, email: e.target.value})} />
              <input className="bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none font-bold" 
                placeholder="Giriş Şifresi" type="text" required onChange={e => setFormData({...formData, password: e.target.value})} />
              <button type="submit" className="md:col-span-2 bg-blue-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-blue-100 mt-4 uppercase">
                {loading ? 'KAYDEDİLİYOR...' : 'FİRMAYI KAYDET VE ŞİFREYİ SAKLA'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}