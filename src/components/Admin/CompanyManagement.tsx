import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Building2, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function CompanyManagement() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    tax_number: '',
    tax_office: '',
    full_address: '',
    phone: '',
    authorized_person: ''
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCompanies(data || []);
    } catch (err: any) {
      console.error('Liste yükleme hatası:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompanyWithAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Şirketi Ekle (ID göndermiyoruz, veritabanı otomatik oluşturacak)
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
        .select()
        .single();

      if (compError) throw compError;

      // 2. Auth Kullanıcısını Oluştur
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            firstName: formData.authorized_person,
            lastName: '(Firma Yetkilisi)',
            role: 'company_admin',
            companyId: company.id
          }
        }
      });

      if (authError) throw authError;

      alert('Firma ve Yönetici hesabı başarıyla oluşturuldu!');
      setIsModalOpen(false);
      // Formu temizle
      setFormData({ name: '', email: '', password: '', tax_number: '', tax_office: '', full_address: '', phone: '', authorized_person: '' });
      fetchCompanies();
    } catch (err: any) {
      alert('İşlem başarısız: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <Building2 className="text-blue-600" size={28} /> İlaçlama Firmaları
        </h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-md transition-all active:scale-95"
        >
          <Plus size={20} /> Yeni Firma & Yönetici Ekle
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-xs uppercase tracking-wider font-semibold text-gray-500">
              <tr>
                <th className="p-4">Firma / Yetkili</th>
                <th className="p-4">Vergi Bilgileri</th>
                <th className="p-4">İletişim</th>
                <th className="p-4">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{company.name}</div>
                    <div className="text-gray-500 text-xs">{company.authorized_person || '-'}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <div className="font-medium">{company.tax_number || '-'}</div>
                    <div className="text-gray-400 text-xs">{company.tax_office || '-'}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <div className="font-medium">{company.email}</div>
                    <div className="text-gray-400 text-xs">{company.phone || '-'}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" /> Onaylı
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && <div className="p-12 text-center text-blue-600 font-medium animate-pulse">Veriler güncelleniyor...</div>}
        {!loading && companies.length === 0 && (
          <div className="p-12 text-center text-gray-400">Henüz kayıtlı firma bulunmuyor.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8 border-b pb-5">
              <h3 className="text-2xl font-bold text-gray-800">Firma ve Yönetici Tanımla</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <XCircle size={28} />
              </button>
            </div>
            
            <form onSubmit={handleCreateCompanyWithAdmin} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-full font-bold text-blue-600 text-sm uppercase tracking-widest border-l-4 border-blue-600 pl-3">Firma Bilgileri</div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Firma Ticari Adı</label>
                  <input className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" required
                    onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Yetkili Ad Soyad</label>
                  <input className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" required
                    onChange={e => setFormData({...formData, authorized_person: e.target.value})} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Vergi Numarası</label>
                  <input className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" required
                    onChange={e => setFormData({...formData, tax_number: e.target.value})} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Vergi Dairesi</label>
                  <input className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" required
                    onChange={e => setFormData({...formData, tax_office: e.target.value})} />
                </div>

                <div className="col-span-full space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Tam Adres</label>
                  <textarea rows={2} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" required
                    onChange={e => setFormData({...formData, full_address: e.target.value})} />
                </div>

                <div className="col-span-full font-bold text-blue-600 text-sm uppercase tracking-widest border-l-4 border-blue-600 pl-3 pt-4">Giriş Bilgileri</div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">E-posta</label>
                  <input type="email" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" required
                    onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Şifre</label>
                  <input type="text" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" required
                    onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Telefon</label>
                  <input type="tel" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                    onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-8 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors">
                  İptal
                </button>
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95">
                  {loading ? 'Oluşturuluyor...' : 'Firmayı ve Hesabı Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}