import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Mail, Lock, LogIn, AlertTriangle, Eye, EyeOff, Loader2, ArrowRight 
} from 'lucide-react';

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
      setError(err.message || 'Giriş yapılamadı. Bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden">
        
        {/* Header Alanı */}
        <div className="px-8 pt-10 pb-6 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Lock size={28} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tekrar Hoş Geldiniz</h2>
          <p className="text-slate-400 font-medium text-sm mt-2">
            Hesabınıza erişmek için bilgilerinizi girin.
          </p>
        </div>

        {/* Hata Mesajı */}
        {error && (
          <div className="mx-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
            <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={18} />
            <p className="text-xs font-bold text-red-600 leading-relaxed">{error}</p>
          </div>
        )}

        {/* Form Alanı */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          
          {/* E-posta Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">E-posta Adresi</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                <Mail size={20} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500 text-slate-900 p-4 pl-12 rounded-2xl outline-none font-bold text-sm transition-all placeholder:text-slate-300"
                placeholder="ornek@sirket.com"
              />
            </div>
          </div>

          {/* Şifre Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Şifre</label>
              <button type="button" className="text-[10px] font-bold text-blue-600 hover:underline">Şifremi Unuttum?</button>
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500 text-slate-900 p-4 pl-12 pr-12 rounded-2xl outline-none font-bold text-sm transition-all placeholder:text-slate-300"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Giriş Butonu */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                Giriş Yap <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer / Kayıt Ol Linki */}
        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
          <p className="text-slate-500 text-xs font-bold">
            Hesabınız yok mu?{' '}
            <button
              onClick={onToggleRegister}
              className="text-blue-600 hover:text-blue-700 font-black uppercase tracking-wide hover:underline ml-1"
            >
              Firma Kaydı Oluştur
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}