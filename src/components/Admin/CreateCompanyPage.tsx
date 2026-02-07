import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Building2, User, Mail, Phone, MapPin, Lock, Save, ArrowLeft } from 'lucide-react';
import bcrypt from 'bcryptjs';

const CreateCompanyPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    address: '',
    taxNumber: '',
    authorizedPerson: '',
    licenseNumber: '',
    firstName: '',
    lastName: '',
    userEmail: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Şifreler eşleşmiyor');
      }

      if (formData.password.length < 6) {
        throw new Error('Şifre en az 6 karakter olmalıdır');
      }

      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.userEmail)
        .maybeSingle();

      if (existingUser) {
        throw new Error('Bu e-posta adresi zaten kullanımda');
      }

      const { data: existingCompany } = await supabase
        .from('companies')
        .select('id')
        .eq('tax_number', formData.taxNumber)
        .maybeSingle();

      if (existingCompany) {
        throw new Error('Bu vergi numarası zaten kayıtlı');
      }

      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: formData.companyName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          tax_number: formData.taxNumber,
          authorized_person: formData.authorizedPerson,
          license_number: formData.licenseNumber || null,
          is_approved: true
        })
        .select()
        .single();

      if (companyError || !company) {
        throw new Error('Firma kaydı oluşturulamadı: ' + companyError?.message);
      }

      const passwordHash = await bcrypt.hash(formData.password, 10);

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: crypto.randomUUID(),
          email: formData.userEmail,
          password_hash: passwordHash,
          role: 'company',
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          company_id: company.id,
          is_active: true
        });

      if (profileError) {
        await supabase.from('companies').delete().eq('id', company.id);
        throw new Error('Kullanıcı profili oluşturulamadı: ' + profileError.message);
      }

      toast.success('Firma başarıyla oluşturuldu');

      setFormData({
        companyName: '',
        email: '',
        phone: '',
        address: '',
        taxNumber: '',
        authorizedPerson: '',
        licenseNumber: '',
        firstName: '',
        lastName: '',
        userEmail: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error creating company:', error);
      toast.error(error instanceof Error ? error.message : 'Firma oluşturulurken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Yeni Firma Oluştur</h1>
          <p className="text-gray-600 mt-2">Admin onaylı yeni ilaçlama firması ekleyin</p>
        </div>
        <button
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Geri</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 pb-4 border-b">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Firma Bilgileri</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Firma Adı *</label>
              <input
                type="text"
                name="companyName"
                required
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Firma E-posta *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Telefon *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vergi Numarası *</label>
              <input
                type="text"
                name="taxNumber"
                required
                value={formData.taxNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Yetkili Kişi</label>
              <input
                type="text"
                name="authorizedPerson"
                value={formData.authorizedPerson}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ruhsat Numarası</label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Adres
              </label>
              <textarea
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-2 pb-4 border-b">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Kullanıcı Bilgileri</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ad *</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Soyad *</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Kullanıcı E-posta *
              </label>
              <input
                type="email"
                name="userEmail"
                required
                value={formData.userEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Kullanıcı bu e-posta ile giriş yapacak</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-1" />
                Şifre *
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">En az 6 karakter</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-1" />
                Şifre Tekrar *
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                minLength={6}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Not:</strong> Oluşturulan firma otomatik olarak onaylı durumda olacak ve kullanıcı hemen sisteme giriş yapabilecektir.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span>Oluşturuluyor...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Firma Oluştur</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCompanyPage;
