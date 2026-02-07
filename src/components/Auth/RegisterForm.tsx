import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Building2, Mail, Lock, User, ShieldCheck } from 'lucide-react';

export default function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    fullName: '',
    email: '',
    password: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Önce Şirketi Oluştur (14 günlük deneme otomatik başlar)
      const { data: company, error: compError } = await supabase
        .from('companies')
        .insert([{
          name: formData.companyName,
          email: formData.email,
          authorized_person: formData.fullName,
          status: 'pending', // Yönetici onayı gerekebilir veya direkt 'approved' yapın
          is_active: true
        }])
        .select()
        .single();

      if (compError) throw compError;

      // 2. Auth Kullanıcısını "company_admin" Rolüyle Oluştur
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            firstName: formData.fullName,
            role: 'company_admin', // BURASI KRİTİK: Operatör değil, Firma Admini
            companyId: company.id
          }
        }
      });

      if (authError) throw authError;

      alert('Kayıt başarılı! 14 günlük deneme süreniz tanımlandı. Lütfen giriş yapın.');
      onSuccess();
    } catch (err: any) {
      alert('Kayıt hatası: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
          <Building2 className="text-white" size={32} />
        </div>
        <h2 className="text-2xl font-black text-gray-800">Firma Kaydı</h2>
        <p className="text-gray-500 text-sm mt-1">14 Gün Ücretsiz Deneme Başlatın</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Firma Adı</label>
          <div className="relative">
            <Building2 className="absolute left-4 top-4 text-gray-400" size={18} />
            <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 pl-12 rounded-2xl outline-none transition-all"
              placeholder="Örn: Pest Kontrol Ltd." onChange={e => setFormData({...formData, companyName: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Yetkili Ad Soyad</label>
          <div className="relative">
            <User className="absolute left-4 top-4 text-gray-400" size={18} />
            <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 pl-12 rounded-2xl outline-none transition-all"
              placeholder="Adınız Soyadınız" onChange={e => setFormData({...formData, fullName: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">E-posta</label>
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-gray-400" size={18} />
            <input required type="email" className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 pl-12 rounded-2xl outline-none transition-all"
              placeholder="firma@eposta.com" onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Şifre</label>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-400" size={18} />
            <input required type="password" title="En az 6 karakter" className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 pl-12 rounded-2xl outline-none transition-all"
              placeholder="••••••" onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
        </div>

        <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2">
          {loading ? 'Kaydediliyor...' : <><ShieldCheck size={20}/> Ücretsiz Denemeyi Başlat</>}
        </button>
      </form>
    </div>
  );
}