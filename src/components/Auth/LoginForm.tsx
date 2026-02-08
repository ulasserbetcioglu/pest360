import React, { useState } from 'react';

import { useAuth } from '../../contexts/AuthContext';

import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';



export default function LoginForm({ onToggleRegister }: { onToggleRegister: () => void }) {

  const { login } = useAuth();

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);



  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setError(null);

    setLoading(true);



    try {

      await login(email, password);

    } catch (err: any) {

      // AuthContext'ten gelen "HESAP PASİF" uyarısını burada yakalıyoruz

      setError(err.message || 'Giriş yapılamadı. Bilgilerinizi kontrol edin.');

    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="w-full bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">

      <div className="text-center mb-8">

        <h2 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">Giriş Yap</h2>

        <p className="text-gray-400 font-medium text-sm mt-1 text-white">Lütfen bilgilerinizi giriniz.</p>

      </div>



      {/* HATA MESAJI ALANI - PASİF UYARISI BURADA GÖRÜNECEK */}

      {error && (

        <div className="mb-6 p-4 bg-red-50 border-2 border-red-100 rounded-2xl flex items-center gap-3 text-red-700 animate-in fade-in zoom-in duration-300">

          <AlertCircle size={24} className="shrink-0" />

          <p className="text-xs font-black uppercase leading-tight">{error}</p>

        </div>

      )}



      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="space-y-1">

          <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">E-posta</label>

          <div className="relative">

            <Mail className="absolute left-4 top-4 text-gray-400" size={18} />

            <input

              type="email"

              required

              value={email}

              onChange={(e) => setEmail(e.target.value)}

              className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 pl-12 rounded-2xl outline-none font-bold transition-all"

              placeholder="mail@adresiniz.com"

            />

          </div>

        </div>



        <div className="space-y-1">

          <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Şifre</label>

          <div className="relative">

            <Lock className="absolute left-4 top-4 text-gray-400" size={18} />

            <input

              type="password"

              required

              value={password}

              onChange={(e) => setPassword(e.target.value)}

              className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 pl-12 rounded-2xl outline-none font-bold transition-all"

              placeholder="••••••••"

            />

          </div>

        </div>



        <button

          type="submit"

          disabled={loading}

          className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase mt-6"

        >

          {loading ? 'Giriş Yapılıyor...' : <><LogIn size={20} /> Sisteme Gir</>}

        </button>

      </form>



      <div className="mt-8 pt-6 border-t border-gray-50 text-center">

        <p className="text-gray-400 text-xs font-bold uppercase mb-3 text-white">Hesabınız yok mu?</p>

        <button

          onClick={onToggleRegister}

          className="text-blue-600 font-black text-sm uppercase tracking-wider hover:underline"

        >

          Yeni Firma Kaydı Oluştur

        </button>

      </div>

    </div>

  );

}

