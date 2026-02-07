import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './hooks/useLanguage';
import Layout from './components/Layout/Layout';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import CompanyDashboard from './components/Dashboard/CompanyDashboard';
import OperatorDashboard from './components/Dashboard/OperatorDashboard';
import CompaniesPage from './components/Admin/CompaniesPage';
import ApprovalsPage from './components/Admin/ApprovalsPage';
import ReportsPage from './components/Admin/ReportsPage';
import SettingsPage from './components/Admin/SettingsPage';
import VisitsPage from './components/Company/VisitsPage';
import CustomersPage from './components/Company/CustomersPage';
import OperatorsPage from './components/Company/OperatorsPage';
import CalendarPage from './components/Company/CalendarPage';
import InventoryPage from './components/Company/InventoryPage';
import CompanyReportsPage from './components/Company/CompanyReportsPage';
import CompanySettingsPage from './components/Company/CompanySettingsPage';
import VisitDetails from './components/Operator/VisitDetails'; // Yeni bileşeni import edin
import { Toaster } from 'sonner'; // Toaster bileşenini import edin

function AppContent() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  // Simple routing based on current path
  const currentPath = window.location.pathname;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (currentPath === '/register') {
      return <RegisterForm />;
    }
    return <LoginForm />;
  }

  const getDashboardComponent = () => {
    // Admin routes (Pest360 genel admini)
    if (user.role === 'admin') {
      switch (currentPath) {
        case '/companies':
          return <CompaniesPage />;
        case '/approvals':
          return <ApprovalsPage />;
        case '/reports':
          return <ReportsPage />;
        case '/settings':
          return <SettingsPage />;
        default:
          return <AdminDashboard />;
      }
    }

    // Rol tabanlı dashboard'lar
    switch (user.role) {
      case 'company': // İlaçlama firmasının admini/yöneticisi
        switch (currentPath) {
          case '/visits':
            return <VisitsPage />;
          case '/calendar':
            return <CalendarPage />;
          case '/customers':
            return <CustomersPage />;
          case '/operators':
            return <OperatorsPage />;
          case '/inventory':
            return <InventoryPage />;
          case '/reports':
            return <CompanyReportsPage />;
          case '/settings':
            return <CompanySettingsPage />;
          default:
            return <CompanyDashboard />;
        }
      case 'operator':
        if (currentPath.startsWith('/operator/visits/')) {
          const visitId = currentPath.split('/operator/visits/')[1];
          return <VisitDetails visitId={visitId} key={visitId} />;
        }
        // Diğer operatör rotaları veya varsayılan dashboard
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Müşteri Paneli
            </h2>
            <p className="text-gray-600">
              Müşteri dashboard yakında eklenecek...
            </p>
          </div>
        );
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('common.welcome')}
            </h2>
            <p className="text-gray-600">
              Dashboard yükleniyor...
            </p>
          </div>
        );
    }
  };

  return (
    <Layout>
      {getDashboardComponent()}
    </Layout>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
        <Toaster richColors position="top-right" /> {/* Toaster bileşenini ekleyin */}
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;