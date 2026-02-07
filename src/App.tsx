import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import CompanyDashboard from './components/Dashboard/CompanyDashboard';
import OperatorDashboard from './components/Dashboard/OperatorDashboard';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import { Lock, Clock, AlertCircle } from 'lucide-react';

function App() {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  /**
   * 1. YÜKLENME EKRANI (Mobil Uyumlu)
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-500 font-bold animate-pulse text-sm">Pest360 Hazırlanıyor...</p>
        </div>
      </div>
    );
  }

  /**
   * 2. OTURUM AÇILMAMIŞSA (Login / Register)
   */
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div className="w-full max-w-md my-8">
          {showRegister ? (
            <div className="space-y-4">
              <RegisterForm onSuccess={() => setShowRegister(false)} />
              <button 
                onClick={() => setShowRegister(false)} 
                className="w-full py-4 text-sm text-blue-700 font-bold bg-white rounded-2xl shadow-sm hover:bg-blue-50 transition-all border border-blue-100"
              >
                Zaten bir hesabınız var mı? Giriş Yapın
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <LoginForm onToggleRegister={() => setShowRegister(true)} />
            </div>
          )}
        </div>
      </div>
    );
  }

  /**
   * 3. 14 GÜNLÜK DENEME SÜRESİ VE ROL KONTROLÜ
   */
  const renderDashboard = () => {
    // Firma Adminleri için 14 günlük deneme kontrolü
    if (user.role === 'company_admin') {
      // Not: user.trialEndsAt verisinin AuthContext'te profile'dan geldiğinden emin olun
      const trialEndDate = user.trialEndsAt ? new Date(user.trialEndsAt) : null;
      const isExpired = trialEndDate && trialEndDate < new Date();

      if (isExpired) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
            <div className="bg-red-100 p-6 rounded-full text-red-600 mb-6 shadow-inner">
              <Lock size={48} />
            </div>
            <h2 className="text-3xl font-black text-gray-800 tracking-tight">Kullanım Süreniz Doldu</h2>
            <p className="text-gray-500 mt-3 max-w-sm font-medium">
              14 günlük ücretsiz deneme süreniz sona ermiştir. Devam etmek için lütfen paketinizi güncelleyin.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <button className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-200 active:scale-95 transition-all">
                Paket Seç
              </button>
              <button onClick={() => window.location.reload()} className="flex-1 bg-gray-100 text-gray-600 px-8 py-4 rounded-2xl font-bold">
                Yenile
              </button>
            </div>
          </div>
        );
      }
      return <CompanyDashboard />;
    }

    // Diğer Rollerin Yönlendirmesi
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'operator':
        return <OperatorDashboard />;
      default:
        return (
          <div className="p-10 text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-black text-gray-800">Yetkilendirme Hatası</h2>
            <p className="text-gray-500 mt-2">Tanımlanamayan rol: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{user.role}</span></p>
          </div>
        );
    }
  };

  /**
   * 4. ANA YAPI (Layout + Dashboard)
   */
  return (
    <Layout>
      <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden">
        {/* Mobilde Üst Boşluk (Hamburger menü varsa) */}
        <div className="lg:hidden h-16"></div> 
        
        {/* Dashboard İçeriği */}
        <div className="animate-in fade-in duration-500">
          {renderDashboard()}
        </div>
      </div>
    </Layout>
  );
}

export default App;