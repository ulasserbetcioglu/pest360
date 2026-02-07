import { supabase } from './supabase';
import { User } from '../types'; // Import User type

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

// Define a type for your local session
interface LocalSession {
  id: string;
  email: string;
  role: User['role'];
  type: 'operator' | 'company' | 'admin' | 'customer';
  companyId?: string; // Add companyId here
}

// Local authentication for non-admin users
export const localAuth = {
  async login(credentials: LoginCredentials) {
    const { email, password } = credentials;
    
    // Check if user exists in our users table
    const { data: user, error } = await supabase
      .from('users')
      .select(`
        *,
        companies (*)
      `)
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error || !user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    // Verify password (in production, this would be properly hashed)
    // For demo purposes, we'll accept '123456' for all users
    if (password !== '123456') {
      throw new Error('Geçersiz şifre');
    }

    // Check trial period for company users
    if (user.role === 'company' && user.trial_end_date) {
      const trialEnd = new Date(user.trial_end_date);
      if (trialEnd < new Date()) {
        throw new Error('Deneme süreniz sona ermiştir');
      }
    }

    return user;
  },

  async register(data: RegisterData) {
    const { email, password, firstName, lastName, phone, companyName, taxNumber, address, authorizedPerson } = data;
    
    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error('Bu e-posta adresi zaten kullanımda');
    }

    // Check if company tax number already exists
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('id')
      .eq('tax_number', taxNumber)
      .single();

    if (existingCompany) {
      throw new Error('Bu vergi numarası zaten kayıtlı');
    }

    // Hash password (in production)
    const passwordHash = await bcrypt.hash(password, 10);

    // Create company first
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: companyName,
        email: email,
        phone: phone,
        address: address,
        tax_number: taxNumber,
        authorized_person: authorizedPerson,
        is_approved: false, // Requires admin approval
        is_demo: false,
        trial_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
      })
      .select()
      .single();

    if (companyError || !company) {
      throw new Error('Firma kaydı oluşturulamadı');
    }

    // Create user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        email: email,
        password_hash: passwordHash,
        role: 'company',
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        company_id: company.id,
        is_active: false // Will be activated when company is approved
      })
      .select()
      .single();

    if (userError || !user) {
      // Rollback company creation
      await supabase.from('companies').delete().eq('id', company.id);
      throw new Error('Kullanıcı kaydı oluşturulamadı');
    }

    return { user, company };
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