import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Command } from 'lucide-react';

export default function LoginForm({ onToggleRegister }: { onToggleRegister: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Giriş başarısız.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex bg-white font-sans">
      
      {/* SOL TARAFI (Marka Alanı) - Sadece Masaüstünde Görünür */}
      {/* Resim yok, kırılma riski yok. CSS Gradient var. */}
      <div className="hidden lg:flex w-1/2 bg-black relative flex-col justify-between p-16 overflow-hidden">
        {/* Modern Arka Plan Efekti */}
        <div className="absolute top-0 left-0 w-full h-full">
           <div className="absolute top-[-20%] right-[-20%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px]"></div>
           <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px]"></div>
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <Command size={20} className="text-black" />
          </div>
          <span className="text-white text-xl font-bold tracking-tight">Pest360</span>
        </div>

        {/* Mesaj */}
        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-medium text-white tracking-tighter leading-[1.1] mb-6">
            Operasyonunuzu <br/> <span className="text-gray-500">hızlandırın.</span>
          </h1>
          <p className="text-gray-400 text-lg font-normal">
            Saha ekipleri, müşteri takibi ve raporlama için geliştirilmiş yeni nesil işletim sistemi.
          </p>
        </div>

        {/* Footer Text */}
        <div className="relative z-10 text-gray-500 text-sm">
          © 2026 Pest360 Inc. Tüm hakları saklıdır.
        </div>
      </div>

      {/* SAĞ TARAF (Form Alanı) - Mobil ve Masaüstü */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[400px] space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Mobil Logo (Sadece mobilde görünür) */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center"><Command size={16}/></div>
            <span className="text-xl font-bold tracking-tight">Pest360</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Giriş Yap</h2>
            <p className="text-gray-500 text-sm">Devam etmek için e-posta adresinizi girin.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs font-medium rounded-lg flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"/>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-900">E-posta</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-black focus:border-transparent block w-full pl-10 p-3 outline-none transition-all placeholder:text-gray-300"
                    placeholder="isim@sirket.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                   <label className="text-xs font-medium text-gray-900">Şifre</label>
                   <button type="button" className="text-xs text-gray-500 hover:text-black">Unuttum?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-black focus:border-transparent block w-full pl-10 pr-10 p-3 outline-none transition-all placeholder:text-gray-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 font-medium py-3 px-4 rounded-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Giriş Yapılıyor...' : <>Giriş Yap <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="text-center text-sm text-gray-500">
            Hesabınız yok mu?{' '}
            <button onClick={onToggleRegister} className="text-black font-semibold hover:underline">
              Hesap oluştur
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}