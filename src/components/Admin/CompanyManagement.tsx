import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Building2, Plus, Trash2, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';

export default function CompanyManagement() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '', // Adminin belirlediği şifre
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
    const { data } = await supabase.from('companies').select('*').order('created_at', { ascending: false });
    if (data) setCompanies(data);
    setLoading(false);
  };

  const handleCreateCompanyWithAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. ADIM: Firmayı Oluştur
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
          status: 'approved', // Admin eklediği için direkt onaylı
          is_active: true
        }])
        .select()
        .single();

      if (compError) throw compError;

      // 2. ADIM: Firma Yöneticisi Kullanıcısını Oluştur (Supabase Auth)
      // Not: Admin yetkisiyle kullanıcı oluşturmak için genelde Edge Functions veya 
      // signUp kullanılır. Burada signUp kullanarak kullanıcıyı oluşturuyoruz.
      const { data: authData, error: authError } = await supabase.auth.signUp({
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

      alert('Firma ve yönetici hesabı başarıyla oluşturuldu!');
      setIsModalOpen(false);
      fetchCompanies();
    } catch (err: any) {
      alert('Hata: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="text-blue-600" /> İlaçlama Firmaları
        </h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} /> Yeni Firma & Yönetici Ekle
        </button>
      </div>

      {/* Liste Tablosu */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b text-sm">
            <tr>
              <th className="p-4">Firma / Yetkili</th>
              <th className="p-4">Vergi Bilgileri</th>
              <th className="p-4">İletişim</th>
              <th className="p-4">Durum</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} className="border-b hover:bg-gray-50 text-sm">
                <td className="p-4">
                  <div className="font-bold">{company.name}</div>
                  <div className="text-gray-500 text-xs">{company.authorized_person}</div>
                </td>
                <td className="p-4">
                  <div>{company.tax_number}</div>
                  <div className="text-gray-500 text-xs">{company.tax_office}</div>
                </td>
                <td className="p-4 text-gray-600">
                  <div>{company.email}</div>
                  <div>{company.phone}</div>
                </td>
                <td className="p-4">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Onaylı</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Gelişmiş Ekleme Modalı */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl my-8">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">Yeni Firma ve Yönetici Tanımla</h3>
            <form onSubmit={handleCreateCompanyWithAdmin} className="grid grid-cols-2 gap-4">
              
              <div className="col-span-2 font-semibold text-blue-600 text-sm">Firma Bilgileri</div>
              <input placeholder="Firma Ticari Adı" className="border p-2 rounded" required
                onChange={e => setFormData({...formData, name: e.target.value})} />
              <input placeholder="Yetkili Ad Soyad" className="border p-2 rounded" required
                onChange={e => setFormData({...formData, authorized_person: e.target.value})} />
              <input placeholder="Vergi Numarası" className="border p-2 rounded" required
                onChange={e => setFormData({...formData, tax_number: e.target.value})} />
              <input placeholder="Vergi Dairesi" className="border p-2 rounded" required
                onChange={e => setFormData({...formData, tax_office: e.target.value})} />
              <textarea placeholder="Tam Adres" className="border p-2 rounded col-span-2" required
                onChange={e => setFormData({...formData, full_address: e.target.value})} />

              <div className="col-span-2 font-semibold text-blue-600 text-sm border-t pt-2">Giriş Bilgileri (Yönetici)</div>
              <input placeholder="Giriş E-postası" type="email" className="border p-2 rounded" required
                onChange={e => setFormData({...formData, email: e.target.value})} />
              <input placeholder="Giriş Şifresi" type="text" className="border p-2 rounded" required
                onChange={e => setFormData({...formData, password: e.target.value})} />
              <input placeholder="Telefon" type="tel" className="border p-2 rounded"
                onChange={e => setFormData({...formData, phone: e.target.value})} />

              <div className="col-span-2 flex gap-2 justify-end mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2">İptal</button>
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">
                  {loading ? 'Oluşturuluyor...' : 'Firmayı Kaydet ve Hesap Aç'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}