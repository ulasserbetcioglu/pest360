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
  const [isOpen, setIsOpen] = useState(false);

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
      case 'company_admin':
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
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 transition-transform duration-300
          w-64 lg:translate-x-0 lg:static
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">Pest360</span>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.href}>
                  
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors group"
                  >
                    <item.icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="px-3 py-2 mb-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-0.5">Kullanıcı</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
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