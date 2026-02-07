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

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, companies(name)')
        .eq('id', userId)
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Profil detayları alınamadı:', err);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
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
        }
      } catch (e) {
        console.error('Auth başlatma hatası:', e);
      } finally {
        setLoading(false); // Her durumda loading'i kapat
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setLoading(true);
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
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // onAuthStateChange SIGNED_IN olayını yakalayacağı için burada sadece isteği atıyoruz
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const register = async (data: any) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { firstName: data.firstName, lastName: data.lastName } }
    });
    if (error) throw error;
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