import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  loading: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  companyName: string;
  taxNumber: string;
  address: string;
  authorizedPerson: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for the system
const demoUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@pest360.com',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'company-1',
    email: 'demo@elimspa.com',
    role: 'company',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    phone: '+90 212 555 0001',
    companyId: 'company-1',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'operator-1',
    email: 'operator@elimspa.com',
    role: 'operator',
    firstName: 'Mehmet',
    lastName: 'Kaya',
    phone: '+90 212 555 0002',
    companyId: 'company-1',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'customer-1',
    email: 'musteri@otel.com',
    role: 'customer',
    firstName: 'Fatma',
    lastName: 'Demir',
    phone: '+90 212 555 0003',
    customerId: 'customer-1',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('pest360_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    // Demo login logic
    const foundUser = demoUsers.find(u => u.email === email);
    
    if (foundUser && password === '123456') {
      setUser(foundUser);
      localStorage.setItem('pest360_user', JSON.stringify(foundUser));
    } else {
      throw new Error('Geçersiz giriş bilgileri');
    }
    
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pest360_user');
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    
    // Simulate registration process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In real implementation, this would create a pending company registration
    alert('Kayıt işleminiz alındı. Admin onayından sonra sisteme giriş yapabilirsiniz.');
    
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}