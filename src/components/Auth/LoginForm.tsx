import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

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
      setError(err.message || 'Giriş yapılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      
      {/* SOL TARAF - GÖRSEL ALAN (Sadece Masaüstü) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
        {/* Dekoratif Arka Plan Efektleri */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1587578726591-fa7b494f1c91?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-600/30 to-slate-900/90 z-10"></div>
        
        {/* Marka Mesajı */}
        <div className="relative z-20 text-white max-w-lg space-y-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/20">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-5xl font-black tracking-tight leading-tight">
            Operasyonunuzu <br/> <span className="text-blue-500">Güvenle</span> Yönetin.
          </h1>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            Pest360 ile saha ekiplerinizi, müşteri ziyaretlerinizi ve raporlamalarınızı tek bir merkezden, profesyonelce kontrol edin.
          </p>
        </div>
      </div>

      {/* SAĞ TARAF - FORM ALANI (Mobil & Masaüstü) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white">
        <div className="w-full max-w-md space-y-10">
          
          {/* Form Başlığı */}
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Giriş Yap</h2>
            <p className="text-slate-500 font-medium">Hesabınıza erişmek için bilgilerinizi girin.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* E-posta */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-widest ml-1">E-posta</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 transition-all outline-none"
                  placeholder="isim@sirket.com"
                />
              </div>
            </div>

            {/* Şifre */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-widest">Şifre</label>
                <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">Şifremi Unuttum?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 rounded-2xl py-4 pl-12 pr-12 font-bold text-slate-900 transition-all outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Hata Mesajı */}
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                {error}
              </div>
            )}

            {/* Buton */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold text-base shadow-xl shadow-slate-200 hover:shadow-2xl hover:shadow-slate-300 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Giriş Yap <ArrowRight size={20} /></>}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-4">
            <p className="text-slate-500 font-medium">
              Henüz üye değil misiniz?{' '}
              <button onClick={onToggleRegister} className="text-blue-600 hover:text-blue-700 font-black hover:underline transition-all">
                Hemen Kayıt Olun
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}