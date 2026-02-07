import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { localAuth, adminAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('pest360_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('pest360_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Check if this is an admin login attempt (you can determine this by email domain or other criteria)
      const isAdminEmail = email.endsWith('@pest360.com') || email === 'admin@example.com'; // Adjust as needed
      
      if (isAdminEmail) {
        // Use Supabase Auth for admin login
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        if (authData.user) {
          const userObj: User = {
            id: authData.user.id,
            email: authData.user.email!,
            role: 'admin',
            firstName: 'Admin',
            lastName: 'User',
            isActive: true,
            createdAt: new Date(authData.user.created_at || Date.now()),
            updatedAt: new Date()
          };

          setUser(userObj);
          localStorage.setItem('pest360_user', JSON.stringify(userObj));
        }
      } else {
        // Use local auth for company/operator users
        const dbUser = await localAuth.login({ email, password });
        const userObj: User = {
          id: dbUser.id,
          email: dbUser.email,
          role: dbUser.role,
          firstName: dbUser.first_name,
          lastName: dbUser.last_name,
          phone: dbUser.phone,
          companyId: dbUser.company_id,
          customerId: dbUser.customer_id,
          isActive: dbUser.is_active,
          createdAt: new Date(dbUser.created_at),
          updatedAt: new Date(dbUser.updated_at)
        };

        setUser(userObj);
        localStorage.setItem('pest360_user', JSON.stringify(userObj));
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Sign out from Supabase Auth as well
    supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('pest360_user');
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      await localAuth.register(data);
      alert('Kayıt işleminiz alındı. Admin onayından sonra sisteme giriş yapabilirsiniz.');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
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