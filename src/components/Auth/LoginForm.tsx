import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Command, CheckCircle2 } from 'lucide-react';

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
    // h-screen ve w-full ile ekranı zorla kaplatıyoruz
    <div className="flex w-full h-screen bg-white overflow-hidden">
      
      {/* SOL TARAFI (Marka Alanı) 
          DÜZELTME: 'lg:flex' yerine 'md:flex' yaptık. 
          Artık tablet ve dar preview ekranlarında da bu alan görünecek. 
      */}
      <div className="hidden md:flex w-1/2 bg-zinc-950 relative flex-col justify-between p-12 text-white">
        
        {/* Arka Plan Deseni (CSS ile) */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        </div>
        
        {/* Dekoratif Gradient */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

        {/* Logo Alanı */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="bg-white text-black p-2 rounded-lg">
            <Command size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">Pest360</span>
        </div>

        {/* Orta Mesaj */}
        <div className="relative z-10 space-y-6 max-w-md">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-tight">
            İşinizi yönetmenin <br/>
            <span className="text-zinc-500">en akıllı yolu.</span>
          </h1>
          <ul className="space-y-3 text-zinc-400">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="text-blue-500" size={20} />
              <span>Saha ekiplerini canlı takip et</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="text-blue-500" size={20} />
              <span>Müşteri ziyaretlerini planla</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="text-blue-500" size={20} />
              <span>Raporları otomatik oluştur</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-zinc-600 text-xs font-medium">
          © 2026 Pest360 Inc. v2.4.0
        </div>
      </div>

      {/* SAĞ TARAF (Form Alanı) - Her zaman görünür */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-[380px] space-y-8">
          
          {/* Mobil Logo (Sadece mobilde görünür) */}
          <div className="md:hidden mb-8">
            <div className="flex items-center gap-2 text-zinc-900">
              <div className="bg-zinc-900 text-white p-2 rounded-lg">
                <Command size={20} />
              </div>
              <span className="text-lg font-bold tracking-tight">Pest360</span>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Giriş Yap</h2>
            <p className="text-zinc-500 text-sm">Devam etmek için hesap bilgilerinizi girin.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-medium rounded-lg flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"/>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-900">E-posta</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent block w-full pl-10 p-3 outline-none transition-all placeholder:text-zinc-300"
                    placeholder="isim@sirket.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                   <label className="text-xs font-medium text-zinc-900">Şifre</label>
                   <button type="button" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">Şifremi unuttum</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent block w-full pl-10 pr-10 p-3 outline-none transition-all placeholder:text-zinc-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-black text-white font-medium py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-zinc-200"
            >
              {loading ? 'Giriş Yapılıyor...' : <>Giriş Yap <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="text-center">
             <button onClick={onToggleRegister} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
               Hesabınız yok mu? <span className="font-semibold text-zinc-900 underline decoration-zinc-300 underline-offset-4">Kayıt Ol</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}