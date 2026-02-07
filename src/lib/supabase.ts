import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          role: 'admin' | 'company' | 'operator' | 'customer' | 'branch';
          first_name: string;
          last_name: string;
          phone: string | null;
          company_id: string | null;
          customer_id: string | null;
          branch_id: string | null;
          is_active: boolean;
          trial_end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash: string;
          role?: 'admin' | 'company' | 'operator' | 'customer' | 'branch';
          first_name: string;
          last_name: string;
          phone?: string | null;
          company_id?: string | null;
          customer_id?: string | null;
          branch_id?: string | null;
          is_active?: boolean;
          trial_end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password_hash?: string;
          role?: 'admin' | 'company' | 'operator' | 'customer' | 'branch';
          first_name?: string;
          last_name?: string;
          phone?: string | null;
          company_id?: string | null;
          customer_id?: string | null;
          branch_id?: string | null;
          is_active?: boolean;
          trial_end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      companies: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          address: string;
          tax_number: string;
          authorized_person: string;
          is_approved: boolean;
          is_demo: boolean;
          trial_end_date: string | null;
          license_number: string | null;
          application_types: string[];
          target_pests: string[];
          treatment_methods: string[];
          equipment_types: string[];
          safety_measures: string[];
          working_hours_start: string;
          working_hours_end: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          address: string;
          tax_number: string;
          authorized_person: string;
          is_approved?: boolean;
          is_demo?: boolean;
          trial_end_date?: string | null;
          license_number?: string | null;
          application_types?: string[];
          target_pests?: string[];
          treatment_methods?: string[];
          equipment_types?: string[];
          safety_measures?: string[];
          working_hours_start?: string;
          working_hours_end?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          address?: string;
          tax_number?: string;
          authorized_person?: string;
          is_approved?: boolean;
          is_demo?: boolean;
          trial_end_date?: string | null;
          license_number?: string | null;
          application_types?: string[];
          target_pests?: string[];
          treatment_methods?: string[];
          equipment_types?: string[];
          safety_measures?: string[];
          working_hours_start?: string;
          working_hours_end?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          email: string;
          phone: string;
          address: string;
          contact_person: string;
          contract_start_date: string;
          contract_end_date: string;
          is_active: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          email: string;
          phone: string;
          address: string;
          contact_person: string;
          contract_start_date: string;
          contract_end_date: string;
          is_active?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          email?: string;
          phone?: string;
          address?: string;
          contact_person?: string;
          contract_start_date?: string;
          contract_end_date?: string;
          is_active?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      branches: {
        Row: {
          id: string;
          customer_id: string;
          name: string;
          address: string;
          contact_person: string;
          phone: string;
          area: number;
          building_type: string;
          special_requirements: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          name: string;
          address: string;
          contact_person: string;
          phone: string;
          area: number;
          building_type: string;
          special_requirements?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          name?: string;
          address?: string;
          contact_person?: string;
          phone?: string;
          area?: number;
          building_type?: string;
          special_requirements?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      chemical_products: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          active_ingredient: string;
          concentration: string;
          manufacturer: string;
          registration_number: string;
          safety_data_sheet: string | null;
          application_rate: string;
          target_pests: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          active_ingredient: string;
          concentration: string;
          manufacturer: string;
          registration_number: string;
          safety_data_sheet?: string | null;
          application_rate: string;
          target_pests?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          active_ingredient?: string;
          concentration?: string;
          manufacturer?: string;
          registration_number?: string;
          safety_data_sheet?: string | null;
          application_rate?: string;
          target_pests?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      visit_types: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          description: string | null;
          duration: number;
          price: number;
          required_equipment: string[];
          default_products: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          description?: string | null;
          duration: number;
          price: number;
          required_equipment?: string[];
          default_products?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          description?: string | null;
          duration?: number;
          price?: number;
          required_equipment?: string[];
          default_products?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      price_items: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          type: 'material' | 'service';
          price: number;
          unit: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          type: 'material' | 'service';
          price: number;
          unit: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          type?: 'material' | 'service';
          price?: number;
          unit?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      visits: {
        Row: {
          id: string;
          company_id: string;
          customer_id: string;
          branch_id: string;
          operator_id: string;
          visit_type_id: string | null;
          scheduled_date: string;
          actual_date: string | null;
          status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
          equipment: string[];
          findings: string | null;
          treatment: string | null;
          recommendations: string | null;
          total_cost: number;
          photos: string[];
          signature: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          customer_id: string;
          branch_id: string;
          operator_id: string;
          visit_type_id?: string | null;
          scheduled_date: string;
          actual_date?: string | null;
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
          equipment?: string[];
          findings?: string | null;
          treatment?: string | null;
          recommendations?: string | null;
          total_cost?: number;
          photos?: string[];
          signature?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          customer_id?: string;
          branch_id?: string;
          operator_id?: string;
          visit_type_id?: string | null;
          scheduled_date?: string;
          actual_date?: string | null;
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
          equipment?: string[];
          findings?: string | null;
          treatment?: string | null;
          recommendations?: string | null;
          total_cost?: number;
          photos?: string[];
          signature?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      visit_products: {
        Row: {
          id: string;
          visit_id: string;
          product_id: string;
          quantity: number;
          concentration: string;
          application_method: string;
          target_areas: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          visit_id: string;
          product_id: string;
          quantity: number;
          concentration: string;
          application_method: string;
          target_areas?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          visit_id?: string;
          product_id?: string;
          quantity?: number;
          concentration?: string;
          application_method?: string;
          target_areas?: string[];
          created_at?: string;
        };
      };
      inventory_items: {
        Row: {
          id: string;
          company_id: string;
          product_id: string;
          current_stock: number;
          minimum_stock: number;
          last_restock_date: string | null;
          expiration_date: string;
          supplier: string;
          cost: number;
          location: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          product_id: string;
          current_stock?: number;
          minimum_stock?: number;
          last_restock_date?: string | null;
          expiration_date: string;
          supplier: string;
          cost: number;
          location: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          product_id?: string;
          current_stock?: number;
          minimum_stock?: number;
          last_restock_date?: string | null;
          expiration_date?: string;
          supplier?: string;
          cost?: number;
          location?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}