import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen w-full bg-white flex flex-col justify-center px-6 sm:px-0">
      
      <div className="w-full max-w-sm mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* HEADER: Sadece Logo ve Başlık */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pest360</h1>
          <p className="text-slate-500 text-sm">Hesabınıza giriş yapın.</p>
        </div>

        {/* FORM ALANI */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* E-POSTA */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-900 uppercase tracking-wider">E-posta</label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl px-4 py-4 text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 transition-all outline-none"
              placeholder="isim@sirket.com"
            />
          </div>

          {/* ŞİFRE */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="block text-xs font-medium text-slate-900 uppercase tracking-wider">Şifre</label>
              <button type="button" className="text-xs text-slate-500 hover:text-slate-900">Unuttum?</button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-4 text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 transition-all outline-none pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* HATA MESAJI (Minimal) */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* BUTON: Siyah/Koyu, Net */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-bold text-sm transition-transform active:scale-[0.98] disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Giriş Yap'}
          </button>
        </form>

        {/* FOOTER */}
        <div className="text-center">
          <p className="text-sm text-slate-500">
            Hesabınız yok mu?{' '}
            <button onClick={onToggleRegister} className="text-slate-900 font-bold hover:underline">
              Kayıt Ol
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}