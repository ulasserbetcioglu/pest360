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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return showRegister ? (
      <div className="w-full flex flex-col items-center">
        <RegisterForm onSuccess={() => setShowRegister(false)} />
        <button onClick={() => setShowRegister(false)} className="mt-4 text-blue-600 underline text-sm">
          Geri Dön
        </button>
      </div>
    ) : (
      <LoginForm onToggleRegister={() => setShowRegister(true)} />
    );
  }

  const renderDashboard = () => {
    // Veritabanındaki 'role' sütunundaki değerlere göre:
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'company_admin':
      case 'company':
        return <CompanyDashboard />;
      case 'operator':
        return <OperatorDashboard />;
      default:
        // Eğer rol tanınmıyorsa operatöre atar
        return <OperatorDashboard />;
    }
  };

  return <Layout>{renderDashboard()}</Layout>;
}

export default App;