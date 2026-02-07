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
      console.log('📋 Profil çekiliyor, User ID:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Profil SQL hatası:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return null;
      }
      
      if (!data) {
        console.error('❌ Profil bulunamadı! User ID:', userId);
        console.log('💡 İpucu: Supabase profiles tablosunda bu user ID var mı kontrol edin!');
        return null;
      }
      
      console.log('✅ Profil başarıyla çekildi:', data);
      return data;
    } catch (err) {
      console.error('❌ Beklenmedik hata:', err);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const initAuth = async () => {
      console.log('🚀 Auth başlatılıyor...');
      
      const timeoutId = setTimeout(() => {
        if (mounted) {
          console.warn('⏰ Timeout: 5 saniye geçti, loading kapatılıyor...');
          setLoading(false);
        }
      }, 5000);

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Session hatası:', error);
          throw error;
        }

        console.log('Session durumu:', session ? '✅ Mevcut' : '❌ Yok');
        
        if (session?.user) {
          console.log('👤 User bulundu:', session.user.id);
          const profile = await fetchUserProfile(session.user.id);
          
          if (profile && mounted) {
            const userData = {
              id: session.user.id,
              email: session.user.email!,
              role: profile.role,
              firstName: profile.first_name,
              lastName: profile.last_name,
              companyId: profile.company_id
            };
            setUser(userData as any);
            console.log('✅ User state set edildi:', userData);
          } else if (mounted) {
            console.warn('⚠️ Profil bulunamadı, oturum kapatılıyor...');
            await supabase.auth.signOut();
            setUser(null);
          }
        } else if (mounted) {
          console.log('ℹ️ Session yok, user null');
          setUser(null);
        }
      } catch (e) {
        console.error('❌ Init hatası:', e);
        if (mounted) {
          setUser(null);
        }
      } finally {
        clearTimeout(timeoutId);
        if (mounted) {
          console.log('✅ Loading: false (init sonrası)');
          setLoading(false);
        }
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Auth Event:', event, 'Session:', session ? 'Var' : 'Yok');
      
      if (!mounted) {
        console.log('⚠️ Component unmounted, işlem iptal');
        return;
      }

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('🔐 SIGNED_IN event - User ID:', session.user.id);
        console.log('⏳ Loading: true (login başlangıç)');
        setLoading(true);
        
        try {
          const profile = await fetchUserProfile(session.user.id);
          console.log('Profil sonucu:', profile);
          
          if (profile && mounted) {
            const userData = {
              id: session.user.id,
              email: session.user.email!,
              role: profile.role,
              firstName: profile.first_name,
              lastName: profile.last_name,
              companyId: profile.company_id
            };
            console.log('👤 User data hazır:', userData);
            setUser(userData as any);
            console.log('✅ setUser çağrıldı');
          } else if (mounted) {
            console.error('❌ Profil yok veya component unmounted');
            await supabase.auth.signOut();
            setUser(null);
          }
        } catch (error) {
          console.error('❌ Login sırasında hata:', error);
          if (mounted) {
            setUser(null);
          }
        } finally {
          if (mounted) {
            console.log('✅ Loading: false (login sonrası)');
            setLoading(false);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 SIGNED_OUT event');
        setUser(null);
        setLoading(false);
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 Token yenilendi');
      } else {
        console.log('ℹ️ Diğer event:', event);
      }
    });

    return () => {
      console.log('🧹 Cleanup çalıştı');
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log('🔑 Login çağrıldı:', email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('❌ Login hatası:', error);
      throw error;
    }
    console.log('✅ signInWithPassword başarılı, session:', data.session ? 'Var' : 'Yok');
  };

  const logout = async () => {
    console.log('👋 Logout çağrıldı');
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  const register = async (data: any) => {
    console.log('📝 Register çağrıldı:', data.email);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { firstName: data.firstName, lastName: data.lastName } }
    });
    setLoading(false);
    if (error) {
      console.error('❌ Register hatası:', error);
      throw error;
    }
  };

  console.log('🎨 AuthContext render - User:', user ? user.email : 'null', 'Loading:', loading);

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