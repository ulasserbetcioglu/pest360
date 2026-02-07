import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Merkezi Profil Çekme ve State Güncelleme
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*, companies(is_active, name, trial_ends_at)')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(profile);
      return profile;
    } catch (err) {
      console.error('Profil hatası:', err);
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    // İlk yüklemede oturumu kontrol et
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) await fetchUserProfile(session.user.id);
      setLoading(false);
    };
    initAuth();

    // Dinleyici: Giriş/Çıkış olaylarını takip et
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (event === 'SIGNED_IN' && session) {
        // Login fonksiyonu zaten state'i güncelliyor, ama sayfa yenileme vb. için garantiye alıyoruz
        await fetchUserProfile(session.user.id);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.user) {
        // Giriş yapan kullanıcının profilini ve şirket durumunu kontrol et
        const profile = await fetchUserProfile(data.user.id);
        
        if (profile && profile.role !== 'admin' && profile.companies && !profile.companies.is_active) {
          await supabase.auth.signOut();
          setUser(null);
          throw new Error(`${profile.companies.name} hesabınız askıya alınmıştır.`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};