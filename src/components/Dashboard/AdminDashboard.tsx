import React from 'react';
import CompanyManagement from '../Admin/CompanyManagement';

const AdminDashboard: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Gereksiz kutular ve süslü karşılama metinleri kaldırıldı. 
          Doğrudan ana yönetim bileşenine odaklanıyoruz. */}
      <main className="w-full">
        <CompanyManagement />
      </main>
    </div>
  );
};

export default AdminDashboard;