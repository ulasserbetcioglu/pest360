import { supabase } from './supabase';
import { User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
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

interface LocalSession {
  id: string;
  email: string;
  role: User['role'];
  type: 'operator' | 'company' | 'admin' | 'customer';
  companyId?: string;
}

export const localAuth = {
  async login(credentials: LoginCredentials) {
    const { email, password } = credentials;

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      throw new Error('E-posta veya şifre hatalı');
    }

    if (!authData.user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        companies (*)
      `)
      .eq('id', authData.user.id)
      .eq('is_active', true)
      .single();

    if (profileError || !profile) {
      throw new Error('Kullanıcı profili bulunamadı veya hesap aktif değil');
    }

    const userCompany = profile.companies as any;
    if (profile.role === 'company' && userCompany && !userCompany.is_approved) {
      throw new Error('Firma henüz admin tarafından onaylanmamış');
    }

    return profile;
  },

  async register(data: RegisterData) {
    const { email, password, firstName, lastName, phone, companyName, taxNumber, address, authorizedPerson } = data;

    const { data: existingCompany } = await supabase
      .from('companies')
      .select('id')
      .eq('tax_number', taxNumber)
      .maybeSingle();

    if (existingCompany) {
      throw new Error('Bu vergi numarası zaten kayıtlı');
    }

    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: companyName,
        email: email,
        phone: phone,
        address: address,
        tax_number: taxNumber,
        authorized_person: authorizedPerson,
        is_approved: false
      })
      .select()
      .single();

    if (companyError || !company) {
      throw new Error('Firma kaydı oluşturulamadı: ' + companyError?.message);
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          role: 'company',
          company_id: company.id,
          is_active: false
        }
      }
    });

    if (authError) {
      await supabase.from('companies').delete().eq('id', company.id);
      throw new Error(authError.message || 'Kayıt oluşturulamadı');
    }

    if (!authData.user) {
      await supabase.from('companies').delete().eq('id', company.id);
      throw new Error('Kullanıcı oluşturulamadı');
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email: email,
        role: 'company',
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        company_id: company.id,
        is_active: false
      });

    if (profileError) {
      await supabase.from('companies').delete().eq('id', company.id);
      throw new Error('Kullanıcı profili oluşturulamadı: ' + profileError.message);
    }

    return { user: authData.user, company };
  },

  getSession(): LocalSession | null {
    const storedUser = localStorage.getItem('pest360_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        return {
          id: user.id,
          email: user.email,
          role: user.role,
          type: user.role,
          companyId: user.companyId, // Ensure companyId is returned
        };
      } catch (e) {
        console.error('Failed to parse stored user session:', e);
        return null;
      }
    }
    return null;
  },

  getCurrentOperatorId(): string | null {
    const session = this.getSession();
    if (session && session.role === 'operator') {
      return session.id;
    }
    return null;
  },

  // Yeni eklenen: Mevcut kullanıcının companyId'sini döndürür
  getCurrentCompanyId(): string | null {
    const session = this.getSession();
    return session?.companyId || null;
  }
};

// Admin authentication using Supabase Auth
export const adminAuth = {
  async login(credentials: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    
    if (error) {
      throw new Error('Giriş başarısız: ' + error.message);
    }

    return data.user;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error('Çıkış yapılamadı');
    }
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async isAdmin(userId: string) {
    // Check if user has admin role in your system
    // You can implement this based on your admin user management
    const { data } = await supabase
      .from('admin_users') // You might want to create this table
      .select('id')
      .eq('user_id', userId)
      .single();
    
    return !!data;
  }
};