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
      const isAdminEmail = email.endsWith('@pest360.com');

      if (isAdminEmail) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (authError) throw new Error('E-posta veya şifre hatalı');

        if (!authData.user) {
          throw new Error('Giriş başarısız');
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (profileError || !profile) {
          throw new Error('Kullanıcı profili bulunamadı');
        }

        const userObj: User = {
          id: profile.id,
          email: profile.email,
          role: 'admin',
          firstName: profile.first_name || 'Admin',
          lastName: profile.last_name || 'User',
          phone: profile.phone,
          companyId: profile.company_id,
          customerId: profile.customer_id,
          isActive: true,
          createdAt: new Date(profile.created_at),
          updatedAt: new Date(profile.updated_at)
        };

        setUser(userObj);
        localStorage.setItem('pest360_user', JSON.stringify(userObj));
      } else {
        const profile = await localAuth.login({ email, password });

        const userObj: User = {
          id: profile.id,
          email: profile.email,
          role: profile.role,
          firstName: profile.first_name,
          lastName: profile.last_name,
          phone: profile.phone,
          companyId: profile.company_id,
          customerId: profile.customer_id,
          isActive: profile.is_active,
          createdAt: new Date(profile.created_at),
          updatedAt: new Date(profile.updated_at)
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