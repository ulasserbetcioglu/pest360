import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import CompanyDashboard from './components/Dashboard/CompanyDashboard';
import OperatorDashboard from './components/Dashboard/OperatorDashboard';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';

function App() {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  /** * 1. YÜKLENME DURUMU
   * Oturum kontrol edilirken gösterilen mobil uyumlu loading ekranı
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-500 font-bold animate-pulse text-sm">Sistem Hazırlanıyor...</p>
        </div>
      </div>
    );
  }

  /** * 2. GİRİŞ YAPILMAMIŞ DURUMU
   * Kullanıcı oturum açmamışsa Login veya Register formunu gösterir
   */
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transition-all">
          {showRegister ? (
            <div className="p-2">
              <RegisterForm onSuccess={() => setShowRegister(false)} />
              <button 
                onClick={() => setShowRegister(false)} 
                className="w-full py-4 text-sm text-blue-600 font-bold hover:bg-blue-50 transition-colors"
              >
                Zaten bir hesabınız var mı? Giriş Yapın
              </button>
            </div>
          ) : (
            <div className="p-2">
              <LoginForm onToggleRegister={() => setShowRegister(true)} />
            </div>
          )}
        </div>
      </div>
    );
  }

  /** * 3. ROL TABANLI YÖNLENDİRME (RBAC)
   * Veritabanından gelen 'role' bilgisine göre hangi Dashboard'un açılacağını belirler
   */
  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      
      case 'company_admin':
      case 'company': // Veritabanında her iki ihtimale karşı esnek tutuldu
        return <CompanyDashboard />;
      
      case 'operator':
        return <OperatorDashboard />;
      
      case 'customer':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
            <h2 className="text-2xl font-black text-gray-800">Müşteri Paneli</h2>
            <p className="text-gray-500 mt-2">Bu modül geliştirme aşamasındadır.</p>
          </div>
        );

      default:
        // Eğer rol tanımsızsa veya bir hata varsa güvenli çıkış
        return (
          <div className="p-10 text-center">
            <h2 className="text-red-500 font-bold text-xl">Yetkisiz Erişim!</h2>
            <p className="text-gray-600 mt-2">Kullanıcı rolü ({user.role}) sistem tarafından tanınmadı.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Sayfayı Yenile
            </button>
          </div>
        );
    }
  };

  /** * 4. ANA YAPI
   * Seçilen Dashboard'u Layout (Sidebar, Header vb.) sarmalı içinde döndürür
   */
  return (
    <Layout>
      <div className="w-full min-h-screen bg-gray-50">
        {renderDashboard()}
      </div>
    </Layout>
  );
}

export default App;