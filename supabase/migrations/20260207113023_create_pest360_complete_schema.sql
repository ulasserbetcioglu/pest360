/*
  # Pest360 Complete Database Schema
  
  ## Overview
  Complete database schema for Pest360 pest control management system with Supabase Auth integration.
  
  ## System Architecture
  
  ### Roles:
  - **admin**: System administrator - manages all companies, approves new companies
  - **company**: Pest control company - manages operators, customers, branches, visits
  - **operator**: Field operator - views assigned customers/branches, creates visits
  - **customer**: End customer - views their own branches and visits
  
  ## Tables
  
  ### 1. profiles
  User profiles linked to Supabase Auth
  - `id` (uuid, primary key) - References auth.users(id)
  - `email` (text) - User email
  - `role` (text) - User role: admin, company, operator, customer
  - `first_name` (text) - First name
  - `last_name` (text) - Last name
  - `phone` (text) - Phone number
  - `company_id` (uuid) - Reference to company (for company and operator roles)
  - `customer_id` (uuid) - Reference to customer (for customer role)
  - `is_active` (boolean) - Account status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 2. companies
  Pest control companies
  - `id` (uuid, primary key)
  - `name` (text) - Company name
  - `email` (text, unique) - Company email
  - `phone` (text) - Phone number
  - `address` (text) - Address
  - `tax_number` (text) - Tax ID
  - `authorized_person` (text) - Authorized contact
  - `is_approved` (boolean) - Admin approval status
  - `license_number` (text) - Business license
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 3. customers
  Customer companies receiving pest control services
  - `id` (uuid, primary key)
  - `company_id` (uuid) - Service provider company
  - `name` (text) - Customer name
  - `email` (text) - Email
  - `phone` (text) - Phone
  - `address` (text) - Address
  - `contact_person` (text) - Contact person
  - `contract_start_date` (date) - Contract start
  - `contract_end_date` (date) - Contract end
  - `is_active` (boolean) - Active status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 4. customer_branches
  Customer branch locations
  - `id` (uuid, primary key)
  - `customer_id` (uuid) - Parent customer
  - `name` (text) - Branch name
  - `address` (text) - Address
  - `contact_person` (text) - Contact person
  - `phone` (text) - Phone
  - `area` (numeric) - Area in m²
  - `building_type` (text) - Building type
  - `is_active` (boolean) - Active status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 5. chemical_products
  Chemical products inventory
  - `id` (uuid, primary key)
  - `company_id` (uuid) - Owning company
  - `name` (text) - Product name
  - `active_ingredient` (text) - Active ingredient
  - `manufacturer` (text) - Manufacturer
  - `registration_number` (text) - Registration number
  - `target_pests` (text[]) - Target pests
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 6. visits
  Service visits
  - `id` (uuid, primary key)
  - `company_id` (uuid) - Service provider
  - `customer_id` (uuid) - Customer
  - `branch_id` (uuid) - Branch location
  - `operator_id` (uuid) - Assigned operator
  - `scheduled_date` (timestamptz) - Scheduled date
  - `actual_date` (timestamptz) - Actual date
  - `status` (text) - Status: scheduled, in_progress, completed, cancelled
  - `findings` (text) - Visit findings
  - `treatment` (text) - Treatment applied
  - `recommendations` (text) - Recommendations
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 7. visit_products
  Products used in visits
  - `id` (uuid, primary key)
  - `visit_id` (uuid) - Related visit
  - `product_id` (uuid) - Product used
  - `quantity` (numeric) - Quantity used
  - `application_method` (text) - Application method
  - `created_at` (timestamptz)
  
  ### 8. inventory_items
  Inventory management
  - `id` (uuid, primary key)
  - `company_id` (uuid) - Owning company
  - `product_id` (uuid) - Product reference
  - `current_stock` (numeric) - Current stock
  - `minimum_stock` (numeric) - Minimum stock level
  - `last_restock_date` (date) - Last restock
  - `expiration_date` (date) - Expiration date
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ## Security
  - RLS enabled on all tables
  - Admin: Full access to all data
  - Company: Access to own company data and related records
  - Operator: Read access to company's customers and branches, write access to visits
  - Customer: Read access to own customer data and branches
*/

-- =====================================================
-- 1. CREATE TABLES
-- =====================================================

-- Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'company', 'operator', 'customer')),
  first_name text,
  last_name text,
  phone text,
  company_id uuid,
  customer_id uuid,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  address text,
  tax_number text,
  authorized_person text,
  is_approved boolean DEFAULT false,
  license_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key for profiles.company_id
ALTER TABLE profiles 
  ADD CONSTRAINT profiles_company_id_fkey 
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  address text,
  contact_person text,
  contract_start_date date,
  contract_end_date date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key for profiles.customer_id
ALTER TABLE profiles 
  ADD CONSTRAINT profiles_customer_id_fkey 
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

-- Customer branches table
CREATE TABLE IF NOT EXISTS customer_branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text,
  contact_person text,
  phone text,
  area numeric,
  building_type text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Chemical products table
CREATE TABLE IF NOT EXISTS chemical_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  active_ingredient text,
  manufacturer text,
  registration_number text,
  target_pests text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Visits table
CREATE TABLE IF NOT EXISTS visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  branch_id uuid REFERENCES customer_branches(id) ON DELETE SET NULL,
  operator_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  scheduled_date timestamptz NOT NULL,
  actual_date timestamptz,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  findings text,
  treatment text,
  recommendations text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Visit products table
CREATE TABLE IF NOT EXISTS visit_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id uuid NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES chemical_products(id) ON DELETE CASCADE,
  quantity numeric DEFAULT 0,
  application_method text,
  created_at timestamptz DEFAULT now()
);

-- Inventory items table
CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES chemical_products(id) ON DELETE CASCADE,
  current_stock numeric DEFAULT 0,
  minimum_stock numeric DEFAULT 0,
  last_restock_date date,
  expiration_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, product_id)
);

-- =====================================================
-- 2. CREATE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_company_id ON profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_profiles_customer_id ON profiles(customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

CREATE INDEX IF NOT EXISTS idx_companies_email ON companies(email);
CREATE INDEX IF NOT EXISTS idx_companies_is_approved ON companies(is_approved);

CREATE INDEX IF NOT EXISTS idx_customers_company_id ON customers(company_id);
CREATE INDEX IF NOT EXISTS idx_customer_branches_customer_id ON customer_branches(customer_id);

CREATE INDEX IF NOT EXISTS idx_chemical_products_company_id ON chemical_products(company_id);

CREATE INDEX IF NOT EXISTS idx_visits_company_id ON visits(company_id);
CREATE INDEX IF NOT EXISTS idx_visits_customer_id ON visits(customer_id);
CREATE INDEX IF NOT EXISTS idx_visits_branch_id ON visits(branch_id);
CREATE INDEX IF NOT EXISTS idx_visits_operator_id ON visits(operator_id);
CREATE INDEX IF NOT EXISTS idx_visits_status ON visits(status);

CREATE INDEX IF NOT EXISTS idx_visit_products_visit_id ON visit_products(visit_id);
CREATE INDEX IF NOT EXISTS idx_visit_products_product_id ON visit_products(product_id);

CREATE INDEX IF NOT EXISTS idx_inventory_items_company_id ON inventory_items(company_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_product_id ON inventory_items(product_id);

-- =====================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE chemical_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. RLS POLICIES - PROFILES
-- =====================================================

-- Users can view own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Users can update own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admin can view all profiles
CREATE POLICY "Admin can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Admin can insert profiles
CREATE POLICY "Admin can insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Admin can update all profiles
CREATE POLICY "Admin can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Company can view their operators
CREATE POLICY "Company can view their operators"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'company'
    )
  );

-- Company can insert operators
CREATE POLICY "Company can insert operators"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'company'
    )
  );

-- Company can update their operators
CREATE POLICY "Company can update their operators"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'company'
    )
  );

-- =====================================================
-- 5. RLS POLICIES - COMPANIES
-- =====================================================

-- Admin can view all companies
CREATE POLICY "Admin can view all companies"
  ON companies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Admin can insert companies
CREATE POLICY "Admin can insert companies"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Admin can update companies
CREATE POLICY "Admin can update companies"
  ON companies FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Admin can delete companies
CREATE POLICY "Admin can delete companies"
  ON companies FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Company can view own company
CREATE POLICY "Company can view own company"
  ON companies FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT company_id FROM profiles 
      WHERE profiles.id = auth.uid()
    )
  );

-- Company can update own company
CREATE POLICY "Company can update own company"
  ON companies FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT company_id FROM profiles 
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'company'
    )
  );

-- =====================================================
-- 6. RLS POLICIES - CUSTOMERS
-- =====================================================

-- Admin can view all customers
CREATE POLICY "Admin can view all customers"
  ON customers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Company users can view their customers
CREATE POLICY "Company users can view their customers"
  ON customers FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE profiles.id = auth.uid()
    )
  );

-- Customer users can view own customer data
CREATE POLICY "Customer users can view own customer data"
  ON customers FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT customer_id FROM profiles 
      WHERE profiles.id = auth.uid()
    )
  );

-- Company can insert customers
CREATE POLICY "Company can insert customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'company'
    )
  );

-- Company can update their customers
CREATE POLICY "Company can update their customers"
  ON customers FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'company'
    )
  );

-- Company can delete their customers
CREATE POLICY "Company can delete their customers"
  ON customers FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'company'
    )
  );

-- =====================================================
-- 7. RLS POLICIES - CUSTOMER_BRANCHES
-- =====================================================

-- Admin can view all branches
CREATE POLICY "Admin can view all branches"
  ON customer_branches FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Company users can view branches of their customers
CREATE POLICY "Company users can view branches"
  ON customer_branches FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers 
      WHERE company_id IN (
        SELECT company_id FROM profiles 
        WHERE profiles.id = auth.uid()
      )
    )
  );

-- Customer users can view own branches
CREATE POLICY "Customer users can view own branches"
  ON customer_branches FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM profiles 
      WHERE profiles.id = auth.uid()
    )
  );

-- Company can insert branches
CREATE POLICY "Company can insert branches"
  ON customer_branches FOR INSERT
  TO authenticated
  WITH CHECK (
    customer_id IN (
      SELECT id FROM customers 
      WHERE company_id IN (
        SELECT company_id FROM profiles 
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'company'
      )
    )
  );

-- Company can update branches
CREATE POLICY "Company can update branches"
  ON customer_branches FOR UPDATE
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers 
      WHERE company_id IN (
        SELECT company_id FROM profiles 
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'company'
      )
    )
  );

-- Company can delete branches
CREATE POLICY "Company can delete branches"
  ON customer_branches FOR DELETE
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers 
      WHERE company_id IN (
        SELECT company_id FROM profiles 
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'company'
      )
    )
  );

-- =====================================================
-- 8. RLS POLICIES - CHEMICAL_PRODUCTS
-- =====================================================

-- Admin can view all products
CREATE POLICY "Admin can view all products"
  ON chemical_products FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Company users can view their products
CREATE POLICY "Company users can view their products"
  ON chemical_products FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE profiles.id = auth.uid()
    )
  );

-- Company can insert products
CREATE POLICY "Company can insert products"
  ON chemical_products FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'company'
    )
  );

-- Company can update their products
CREATE POLICY "Company can update their products"
  ON chemical_products FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'company'
    )
  );

-- Company can delete their products
CREATE POLICY "Company can delete their products"
  ON chemical_products FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'company'
    )
  );

-- =====================================================
-- 9. RLS POLICIES - VISITS
-- =====================================================

-- Admin can view all visits
CREATE POLICY "Admin can view all visits"
  ON visits FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Company users can view their visits
CREATE POLICY "Company users can view their visits"
  ON visits FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE profiles.id = auth.uid()
    )
  );

-- Customer users can view their visits
CREATE POLICY "Customer users can view their visits"
  ON visits FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM profiles 
      WHERE profiles.id = auth.uid()
    )
  );

-- Company and operators can insert visits
CREATE POLICY "Company and operators can insert visits"
  ON visits FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('company', 'operator')
    )
  );

-- Company and operators can update visits
CREATE POLICY "Company and operators can update visits"
  ON visits FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('company', 'operator')
    )
  );

-- Company can delete visits
CREATE POLICY "Company can delete visits"
  ON visits FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'company'
    )
  );

-- =====================================================
-- 10. RLS POLICIES - VISIT_PRODUCTS
-- =====================================================

-- Admin can view all visit products
CREATE POLICY "Admin can view all visit products"
  ON visit_products FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Users can view visit products of accessible visits
CREATE POLICY "Users can view visit products"
  ON visit_products FOR SELECT
  TO authenticated
  USING (
    visit_id IN (
      SELECT id FROM visits 
      WHERE company_id IN (
        SELECT company_id FROM profiles 
        WHERE profiles.id = auth.uid()
      )
      OR customer_id IN (
        SELECT customer_id FROM profiles 
        WHERE profiles.id = auth.uid()
      )
    )
  );

-- Company and operators can insert visit products
CREATE POLICY "Company and operators can insert visit products"
  ON visit_products FOR INSERT
  TO authenticated
  WITH CHECK (
    visit_id IN (
      SELECT id FROM visits 
      WHERE company_id IN (
        SELECT company_id FROM profiles 
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('company', 'operator')
      )
    )
  );

-- Company and operators can update visit products
CREATE POLICY "Company and operators can update visit products"
  ON visit_products FOR UPDATE
  TO authenticated
  USING (
    visit_id IN (
      SELECT id FROM visits 
      WHERE company_id IN (
        SELECT company_id FROM profiles 
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('company', 'operator')
      )
    )
  );

-- Company can delete visit products
CREATE POLICY "Company can delete visit products"
  ON visit_products FOR DELETE
  TO authenticated
  USING (
    visit_id IN (
      SELECT id FROM visits 
      WHERE company_id IN (
        SELECT company_id FROM profiles 
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'company'
      )
    )
  );

-- =====================================================
-- 11. RLS POLICIES - INVENTORY_ITEMS
-- =====================================================

-- Admin can view all inventory
CREATE POLICY "Admin can view all inventory"
  ON inventory_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Company users can view their inventory
CREATE POLICY "Company users can view their inventory"
  ON inventory_items FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE profiles.id = auth.uid()
    )
  );

-- Company can insert inventory items
CREATE POLICY "Company can insert inventory items"
  ON inventory_items FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'company'
    )
  );

-- Company can update their inventory
CREATE POLICY "Company can update their inventory"
  ON inventory_items FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'company'
    )
  );

-- Company can delete inventory items
CREATE POLICY "Company can delete inventory items"
  ON inventory_items FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'company'
    )
  );

-- =====================================================
-- 12. FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_branches_updated_at BEFORE UPDATE ON customer_branches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chemical_products_updated_at BEFORE UPDATE ON chemical_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visits_updated_at BEFORE UPDATE ON visits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON inventory_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();