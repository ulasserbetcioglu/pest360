import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Building2, Plus, X, Search, MoreVertical, Phone, Mail } from 'lucide-react';

export default function CompanyManagement() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', tax_number: '', tax_office: '', full_address: '', phone: '', authorized_person: ''
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
    <div className="p-4 md:p-0 space-y-4">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-800 flex items-center gap-2">
            <Building2 className="text-blue-600" /> Firmalar
          </h2>
          <p className="text-xs text-gray-500 font-medium">Toplam {companies.length} kayıtlı firma</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Plus size={20} /> <span className="sm:inline">Yeni Firma Tanımla</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-gray-50/50 border-b text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="p-4">Firma & Yetkili</th>
                <th className="p-4">İletişim</th>
                <th className="p-4">Vergi Bilgisi</th>
                <th className="p-4 text-center">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {companies.map(c => (
                <tr key={c.id} className="hover:bg-blue-50/20 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.authorized_person}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 text-xs text-gray-600">
                      <span className="flex items-center gap-1"><Mail size={12}/> {c.email}</span>
                      <span className="flex items-center gap-1"><Phone size={12}/> {c.phone || '-'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-xs font-bold text-gray-700">{c.tax_number}</p>
                    <p className="text-[10px] text-gray-400">{c.tax_office}</p>
                  </td>
                  <td className="p-4 text-center">
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && <div className="p-10 text-center animate-pulse text-blue-600 font-bold">Yükleniyor...</div>}
      </div>

      {/* Modal - Tam Mobil Uyumlu */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[999] p-0 sm:p-4">
          <div className="bg-white w-full max-w-xl rounded-t-[2rem] sm:rounded-3xl p-6 md:p-8 shadow-2xl max-h-[95vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-800">Firma Tanımla</h3>
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-100 p-2 rounded-full text-gray-500 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="col-span-full">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Firma Ticari Adı</label>
                    <input className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none bg-gray-50/50" required onChange={e => setFormData({...formData, name: e.target.value})} />
                   </div>
                   <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Vergi No</label>
                    <input className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none bg-gray-50/50" onChange={e => setFormData({...formData, tax_number: e.target.value})} />
                   </div>
                   <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Vergi Dairesi</label>
                    <input className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none bg-gray-50/50" onChange={e => setFormData({...formData, tax_office: e.target.value})} />
                   </div>
                   <div className="col-span-full">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Yetkili Ad Soyad</label>
                    <input className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none bg-gray-50/50" required onChange={e => setFormData({...formData, authorized_person: e.target.value})} />
                   </div>
                   <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Giriş E-postası</label>
                    <input className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none bg-gray-50/50" required type="email" onChange={e => setFormData({...formData, email: e.target.value})} />
                   </div>
                   <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Giriş Şifresi</label>
                    <input className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none bg-gray-50/50" required type="text" onChange={e => setFormData({...formData, password: e.target.value})} />
                   </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="order-2 sm:order-1 flex-1 py-4 font-bold text-gray-500 hover:bg-gray-50 rounded-2xl transition-colors">İptal</button>
                <button type="submit" className="order-1 sm:order-2 flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-100 active:scale-95 transition-all">Kaydet ve Hesap Aç</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}