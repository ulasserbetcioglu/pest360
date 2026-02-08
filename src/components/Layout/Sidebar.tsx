import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Calendar,
  Users,
  Package,
  Settings,
  FileText,
  Building2,
  UserCheck,
  ClipboardList,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // Mobil menü kontrolü

  const getMenuItems = () => {
    const baseItems = [{ icon: Home, label: t('nav.dashboard'), href: '/dashboard' }];

    switch (user?.role) {
      case 'admin':
        return [
          ...baseItems,
          { icon: Building2, label: t('nav.companies'), href: '/companies' },
          { icon: UserCheck, label: 'Onaylar', href: '/approvals' },
          { icon: FileText, label: t('nav.reports'), href: '/reports' },
          { icon: Settings, label: t('nav.settings'), href: '/settings' }
        ];
      case 'company_admin': // Case ismini veritabanı ile eşitledik
      case 'company':
        return [
          ...baseItems,
          { icon: Calendar, label: t('nav.visits'), href: '/visits' },
          { icon: Users, label: t('nav.customers'), href: '/customers' },
          { icon: UserCheck, label: t('nav.operators'), href: '/operators' },
          { icon: Package, label: t('nav.inventory'), href: '/inventory' },
          { icon: FileText, label: t('nav.reports'), href: '/reports' },
          { icon: Settings, label: t('nav.settings'), href: '/settings' }
        ];
      case 'operator':
        return [
          ...baseItems,
          { icon: ClipboardList, label: 'Görevlerim', href: '/my-visits' },
          { icon: Calendar, label: t('nav.calendar'), href: '/calendar' },
          { icon: Package, label: t('nav.inventory'), href: '/inventory' }
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* MOBIL HAMBURGER BUTONU (Sadece mobilde görünür) */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* KARARTMA KATMANI (Mobilde menü açıkken arkaya tıklandığında kapatır) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ANA SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 z-[70] h-full bg-white shadow-2xl transition-transform duration-300 ease-in-out
          w-72 lg:translate-x-0 lg:static lg:block
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* LOGO BÖLÜMÜ */}
          <div className="p-6 flex items-center justify-between border-b border-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <span className="text-white font-black text-xs">P360</span>
              </div>
              <span className="text-2xl font-black text-gray-800 tracking-tight">Pest360</span>
            </div>
            {/* KAPATMA BUTONU (Sadece mobilde görünür) */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* NAVIGASYON LİSTESİ */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3.5 text-gray-600 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all font-semibold group"
                  >
                    <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-[15px]">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* ALT BÖLÜM (LOGOUT) */}
          <div className="p-4 border-t border-gray-50">
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
               <p className="text-xs font-bold text-gray-400 uppercase mb-1">Kullanıcı</p>
               <p className="text-sm font-bold text-gray-800 truncate">{user?.firstName} {user?.lastName}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-3 px-4 py-4 text-gray-500 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all w-full font-bold"
            >
              <LogOut className="w-5 h-5" />
              <span>{t('common.logout')}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
