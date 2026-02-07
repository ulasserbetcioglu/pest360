import React from 'react';
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
  PlusCircle
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { icon: Home, label: t('nav.dashboard'), href: '/dashboard' }
    ];

    switch (user?.role) {
      case 'admin':
        return [
          ...baseItems,
          { icon: Building2, label: t('nav.companies'), href: '/companies' },
          { icon: PlusCircle, label: 'Firma Oluştur', href: '/create-company' },
          { icon: UserCheck, label: 'Onaylar', href: '/approvals' },
          { icon: FileText, label: t('nav.reports'), href: '/reports' },
          { icon: Settings, label: t('nav.settings'), href: '/settings' }
        ];

      case 'company':
        return [
          ...baseItems,
          { icon: Calendar, label: t('nav.visits'), href: '/visits' },
          { icon: Calendar, label: t('nav.calendar'), href: '/calendar' },
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

      case 'customer':
        return [
          ...baseItems,
          { icon: Calendar, label: 'Ziyaret Geçmişi', href: '/visit-history' },
          { icon: ClipboardList, label: 'Raporlarım', href: '/my-reports' }
        ];

      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        bg-white w-64 min-h-screen shadow-lg fixed lg:static z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P360</span>
          </div>
          <span className="text-xl font-bold text-gray-800">Pest360</span>
        </div>
      </div>

      <nav className="px-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  window.location.pathname === item.href
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{t('common.logout')}</span>
        </button>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;