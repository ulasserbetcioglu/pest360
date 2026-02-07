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
      console.log('Profil çekiliyor:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Profil çekilirken SQL hatası:', error.message);
        return null;
      }
      console.log('Profil başarıyla çekildi:', data);
      return data;
    } catch (err) {
      console.error('Beklenmedik hata:', err);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const initAuth = async () => {
      console.log('🔵 Auth başlatılıyor...');
      
      // Timeout ekleyelim - 5 saniye içinde cevap gelmezse loading'i kapat
      const timeoutId = setTimeout(() => {
        if (mounted) {
          console.warn('⚠️ Supabase bağlantısı zaman aşımına uğradı, loading kapatılıyor...');
          setLoading(false);
        }
      }, 5000);

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Session hatası:', error);
          throw error;
        }

        console.log('Session durumu:', session ? '✅ Var' : '❌ Yok');
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          if (profile && mounted) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              role: profile.role,
              firstName: profile.first_name,
              lastName: profile.last_name,
              companyId: profile.company_id
            } as any);
            console.log('✅ Kullanıcı set edildi:', profile.role);
          } else if (mounted) {
            console.warn('⚠️ Profil bulunamadı, oturum kapatılıyor');
            await supabase.auth.signOut();
            setUser(null);
          }
        } else if (mounted) {
          console.log('ℹ️ Session yok, user null yapılıyor');
          setUser(null);
        }
      } catch (e) {
        console.error('❌ Başlatma hatası:', e);
        if (mounted) {
          setUser(null);
        }
      } finally {
        clearTimeout(timeoutId);
        if (mounted) {
          console.log('✅ Loading false yapılıyor');
          setLoading(false);
        }
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Auth event:', event);
      
      if (!mounted) return;

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
            companyId: profile.company_id
          } as any);
        }
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  const register = async (data: any) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { firstName: data.firstName, lastName: data.lastName } }
    });
    setLoading(false);
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