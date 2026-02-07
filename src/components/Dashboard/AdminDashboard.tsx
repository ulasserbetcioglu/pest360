import React from 'react';
import CompanyManagement from '../Admin/CompanyManagement';

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-600 p-8 rounded-2xl text-white shadow-lg">
        <h1 className="text-3xl font-bold text-white">Sistem Yönetim Paneli</h1>
        <p className="opacity-90 mt-2 text-white">Pest360 platformundaki tüm firmaları ve kullanıcıları buradan yönetebilirsiniz.</p>
      </div>

      {/* Firma Yönetim Bileşeni */}
      <CompanyManagement />
    </div>
  );
};

export default AdminDashboard;