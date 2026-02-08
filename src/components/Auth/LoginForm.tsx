import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Command, CheckCircle2 } from 'lucide-react';

export default function LoginForm({ onToggleRegister }: { onToggleRegister: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* SOL TARAFI (Marka Alanı) - Masaüstünde görünür */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 relative overflow-hidden">
        {/* Arka Plan Deseni */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>

        {/* Dekoratif Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>

        {/* İçerik */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo Alanı */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <Command className="w-6 h-6 text-zinc-900" />
            </div>
            <span className="text-2xl font-bold text-white">Pest360</span>
          </div>

          {/* Orta Mesaj */}
          <div className="space-y-8">
            <h1 className="text-5xl font-bold text-white leading-tight">
              İşinizi yönetmenin<br />en akıllı yolu.
            </h1>
            
            <div className="space-y-4">
              {[
                'Saha ekiplerini canlı takip et',
                'Müşteri ziyaretlerini planla',
                'Raporları otomatik oluştur'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-zinc-200 text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-zinc-400 text-sm">
            © 2026 Pest360 Inc. v2.4.0
          </div>
        </div>
      </div>

      {/* SAĞ TARAF (Form Alanı) */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-zinc-50">
        <div className="w-full max-w-md space-y-8">
          {/* Mobil Logo (Sadece mobilde görünür) */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
              <Command className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-zinc-900">Pest360</span>
          </div>

          {/* Form Başlık */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-zinc-900">Giriş Yap</h2>
            <p className="mt-2 text-zinc-600">Devam etmek için hesap bilgilerinizi girin.</p>
          </div>

          {/* Hata Mesajı */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* E-posta */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
                E-posta
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent pl-10 p-3 outline-none transition-all placeholder:text-zinc-300"
                  placeholder="isim@sirket.com"
                />
              </div>
            </div>

            {/* Şifre */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                  Şifre
                </label>
                <a href="#" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
                  Şifremi unuttum
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent pl-10 pr-10 p-3 outline-none transition-all placeholder:text-zinc-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Giriş Butonu */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 text-white font-medium py-3 px-4 rounded-xl hover:bg-zinc-800 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? 'Giriş Yapılıyor...' : (
                <>
                  Giriş Yap
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Kayıt Linki */}
          <p className="text-center text-sm text-zinc-600">
            Hesabınız yok mu?{' '}
            <button
              onClick={onToggleRegister}
              className="font-medium text-zinc-900 hover:underline"
            >
              Kayıt Ol
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}