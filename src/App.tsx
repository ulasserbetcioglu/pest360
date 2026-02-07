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

  // Konsolda kontrol edelim (F12 ile bakabilirsin)
  console.log("App State:", { user, loading });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-500 text-sm">Sistem Hazırlanıyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        {showRegister ? (
          <div className="w-full max-w-md">
            <RegisterForm onSuccess={() => setShowRegister(false)} />
            <button onClick={() => setShowRegister(false)} className="mt-4 w-full text-blue-600 underline text-sm">
              Giriş Yap
            </button>
          </div>
        ) : (
          <LoginForm onToggleRegister={() => setShowRegister(true)} />
        )}
      </div>
    );
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin': return <AdminDashboard />;
      case 'company_admin': return <CompanyDashboard />;
      case 'operator': return <OperatorDashboard />;
      default: return <OperatorDashboard />;
    }
  };

  return <Layout>{renderDashboard()}</Layout>;
}

export default App;