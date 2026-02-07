import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sayfa yenilendiğinde oturumu kontrol et
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*, companies(is_active, name, trial_ends_at)')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(profile);
    } catch (error) {
      console.error('Profil yükleme hatası:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await fetchUserProfile(session.user.id);
    } else {
      setLoading(false);
    }
  };

  /**
   * LOGIN FONKSİYONU (AKTİF/PASİF KONTROLLÜ)
   */
  const login = async (email: string, password: string) => {
    // 1. Auth girişi yap
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    // 2. Profil ve Şirket bilgilerini çek (is_active burada kontrol ediliyor)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*, companies(is_active, name, trial_ends_at)')
      .eq('id', authData.user.id)
      .single();

    if (profileError) throw profileError;

    // 3. PASİF KONTROLÜ
    // Eğer kullanıcı 'admin' (Süper Admin) değilse ve bağlı olduğu şirket pasifse girişi engelle
    if (profile.role !== 'admin' && profile.companies && !profile.companies.is_active) {
      await supabase.auth.signOut(); // Oluşturulan oturumu hemen sonlandır
      throw new Error(`Hesabınız (${profile.companies.name}) yönetici tarafından askıya alınmıştır.`);
    }

    // 4. Her şey yolundaysa user state'ini güncelle
    setUser(profile);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};