import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Uygulama başladığında mevcut oturumu kontrol et
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email!,
          role: session.user.user_metadata.role || 'operator',
          firstName: session.user.user_metadata.firstName,
          lastName: session.user.user_metadata.lastName,
          companyId: session.user.user_metadata.companyId,
          companyName: session.user.user_metadata.companyName
        };
        setUser(userData);
      }
      setLoading(false);
    };

    checkUser();

    // Oturum değişikliklerini dinle (Giriş/Çıkış yapıldığında otomatik tetiklenir)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email!,
          role: session.user.user_metadata.role || 'operator',
          firstName: session.user.user_metadata.firstName,
          lastName: session.user.user_metadata.lastName,
          companyId: session.user.user_metadata.companyId,
          companyName: session.user.user_metadata.companyName
        };
        setUser(userData);
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email!,
          role: data.user.user_metadata.role || 'operator',
          firstName: data.user.user_metadata.firstName,
          lastName: data.user.user_metadata.lastName,
          companyId: data.user.user_metadata.companyId,
          companyName: data.user.user_metadata.companyName
        };
        setUser(userData);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Giriş yapılamadı');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role || 'operator',
            companyName: data.companyName
          }
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || 'Kayıt işlemi başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
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