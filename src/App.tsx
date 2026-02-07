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

  // Uygulama yüklenirken veya oturum kontrol edilirken loading göster
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Kullanıcı oturum açmamışsa Giriş veya Kayıt formunu göster
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        {showRegister ? (
          <div className="w-full max-w-md">
            <RegisterForm onSuccess={() => setShowRegister(false)} />
            <button
              onClick={() => setShowRegister(false)}
              className="mt-4 w-full text-sm text-blue-600 hover:underline text-center"
            >
              Zaten hesabınız var mı? Giriş yapın
            </button>
          </div>
        ) : (
          <LoginForm onToggleRegister={() => setShowRegister(true)} />
        )}
      </div>
    );
  }

  // Kullanıcı rolüne göre ilgili Dashboard'u belirle
  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'company_admin':
        return <CompanyDashboard />;
      case 'operator':
        return <OperatorDashboard />;
      default:
        return <OperatorDashboard />;
    }
  };

  // Oturum açılmışsa Layout içinde Dashboard'u göster
  return (
    <Layout>
      {renderDashboard()}
    </Layout>
  );
}

export default App;