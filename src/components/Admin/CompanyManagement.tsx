import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Building2, Plus, X, Mail, Phone, 
  FileText, MoreVertical, Trash2, Edit3 
} from 'lucide-react';

export default function CompanyManagement() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null); // İşlemler menüsü için
  
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

  const handleDelete = async (id: string) => {
    if (confirm('Bu firmayı silmek istediğinize emin misiniz?')) {
      const { error } = await supabase.from('companies').delete().eq('id', id);
      if (!error) fetchCompanies();
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
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

      const { error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { firstName: formData.authorized_person, role: 'company_admin', companyId: company.id } }
      });

      if (authError) throw authError;
      setIsModalOpen(false);
      fetchCompanies();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Üst Başlık ve Ekleme Butonu */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <Building2 className="text-blue-600" size={24} /> Firmalar
          </h2>
          <p className="text-sm text-gray-500 font-medium">Sistemdeki tüm ilaçlama şirketleri</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Plus size={20} /> Yeni Firma Ekle
        </button>
      </div>

      {/* MASAÜSTÜ GÖRÜNÜMÜ (Tablo - Sadece md ekranlarda ve üzerinde görünür) */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="p-4">Firma & Yetkili</th>
              <th className="p-4">İletişim</th>
              <th className="p-4">Vergi Bilgisi</th>
              <th className="p-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {companies.map(c => (
              <tr key={c.id} className="hover:bg-blue-50/20 transition-colors">
                <td className="p-4 font-bold text-gray-800">
                  {c.name} <br/> <span className="text-xs text-gray-400 font-normal">{c.authorized_person}</span>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><Mail size={14}/> {c.email}</span>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><FileText size={14}/> {c.tax_number}</span>
                </td>
                <td className="p-4 text-right relative">
                   <button 
                    onClick={() => setActiveMenu(activeMenu === c.id ? null : c.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
                   >
                    <MoreVertical size={20} />
                   </button>
                   {activeMenu === c.id && (
                     <div className="absolute right-4 top-12 w-40 bg-white border rounded-xl shadow-xl z-50 overflow-hidden">
                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                          <Edit3 size={16}/> Düzenle
                        </button>
                        <button 
                          onClick={() => handleDelete(c.id)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                        >
                          <Trash2 size={16}/> Sil
                        </button>
                     </div>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBİL GÖRÜNÜMÜ (Kartlar - Sadece küçük ekranlarda görünür) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {companies.map(c => (
          <div key={c.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-black text-gray-900 text-lg leading-tight">{c.name}</h3>
                <p className="text-sm text-blue-600 font-bold">{c.authorized_person}</p>
              </div>
              <button 
                onClick={() => setActiveMenu(activeMenu === c.id ? null : c.id)}
                className="p-2 bg-gray-50 rounded-lg"
              >
                <MoreVertical size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-50">
              <div className="text-[10px] text-gray-400 font-black uppercase tracking-wider">İletişim</div>
              <div className="text-[10px] text-gray-400 font-black uppercase tracking-wider text-right">Vergi No</div>
              <div className="text-xs text-gray-600 truncate">{c.email}</div>
              <div className="text-xs text-gray-600 text-right">{c.tax_number}</div>
            </div>

            {activeMenu === c.id && (
              <div className="flex gap-2 pt-2">
                <button className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                  <Edit3 size={14}/> Düzenle
                </button>
                <button 
                  onClick={() => handleDelete(c.id)}
                  className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Trash2 size={14}/> Sil
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MODAL (Hızlı Ekleme - Mobilde Alttan Çıkar) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[2rem] sm:rounded-3xl p-6 md:p-8 animate-in slide-in-from-bottom duration-300 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-800 tracking-tight">Firma Kaydı</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4 pb-6 sm:pb-0">
               <input className="w-full border-2 border-gray-50 p-3.5 rounded-2xl focus:border-blue-500 outline-none bg-gray-50/50" placeholder="Firma Ticari Adı" required onChange={e => setFormData({...formData, name: e.target.value})} />
               <div className="grid grid-cols-2 gap-3">
                 <input className="border-2 border-gray-50 p-3.5 rounded-2xl focus:border-blue-500 outline-none bg-gray-50/50" placeholder="Vergi No" onChange={e => setFormData({...formData, tax_number: e.target.value})} />
                 <input className="border-2 border-gray-50 p-3.5 rounded-2xl focus:border-blue-500 outline-none bg-gray-50/50" placeholder="Vergi Dairesi" onChange={e => setFormData({...formData, tax_office: e.target.value})} />
               </div>
               <input className="w-full border-2 border-gray-50 p-3.5 rounded-2xl focus:border-blue-500 outline-none bg-gray-50/50" placeholder="Yetkili Ad Soyad" required onChange={e => setFormData({...formData, authorized_person: e.target.value})} />
               <input className="w-full border-2 border-gray-50 p-3.5 rounded-2xl focus:border-blue-500 outline-none bg-gray-50/50" placeholder="E-posta" required type="email" onChange={e => setFormData({...formData, email: e.target.value})} />
               <input className="w-full border-2 border-gray-50 p-3.5 rounded-2xl focus:border-blue-500 outline-none bg-gray-50/50" placeholder="Şifre" required type="text" onChange={e => setFormData({...formData, password: e.target.value})} />
               
               <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-100 active:scale-95 transition-all mt-4">
                 Firmayı Kaydet ve Hesap Aç
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}