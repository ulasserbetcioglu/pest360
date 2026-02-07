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

  // Veritabanındaki profil bilgilerini getiren yardımcı fonksiyon
  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, companies(name)')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Profil çekilirken hata:', error);
      return null;
    }
    return data;
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        if (profile) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: profile.role, // SQL'de güncellediğiniz rol buraya gelir
            firstName: profile.first_name,
            lastName: profile.last_name,
            companyId: profile.company_id,
            companyName: profile.companies?.name
          } as any);
        }
      }
      setLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        if (profile) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: profile.role,
            firstName: profile.first_name,
            lastName: profile.last_name,
            companyId: profile.company_id,
            companyName: profile.companies?.name
          } as any);
        }
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        if (!profile) throw new Error('Profil bulunamadı.');

        setUser({
          id: data.user.id,
          email: data.user.email!,
          role: profile.role,
          firstName: profile.first_name,
          lastName: profile.last_name,
          companyId: profile.company_id,
          companyName: profile.companies?.name
        } as any);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Giriş yapılamadı');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role || 'company_admin'
          }
        }
      });
      
      if (authError) throw authError;

      // Manuel profil oluşturma (Trigger bazen gecikebilir)
      if (authData.user) {
        await supabase.from('profiles').insert([
          {
            id: authData.user.id,
            first_name: data.firstName,
            last_name: data.lastName,
            role: data.role || 'company_admin'
          }
        ]);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Kayıt başarısız');
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
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}