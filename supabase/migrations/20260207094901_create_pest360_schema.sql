/*
  # Pest360 Database Schema

  ## Overview
  Complete database schema for Pest360 pest control management system with multi-role authentication.

  ## New Tables
  
  ### 1. companies
  Pest control companies registered in the system
  - `id` (uuid, primary key)
  - `name` (text) - Company name
  - `email` (text) - Company contact email
  - `phone` (text) - Company phone
  - `address` (text) - Company address
  - `tax_number` (text) - Tax identification number
  - `authorized_person` (text) - Authorized contact person
  - `is_approved` (boolean) - Admin approval status
  - `is_demo` (boolean) - Demo account flag
  - `trial_end_date` (timestamptz) - Trial period end date
  - `license_number` (text) - Business license number
  - `application_types` (text[]) - Types of applications offered
  - `target_pests` (text[]) - Target pests list
  - `treatment_methods` (text[]) - Treatment methods available
  - `equipment_types` (text[]) - Equipment inventory
  - `safety_measures` (text[]) - Safety equipment and measures
  - `working_hours_start` (text) - Start time
  - `working_hours_end` (text) - End time
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. users
  System users (company admins, operators, customers)
  - `id` (uuid, primary key)
  - `email` (text, unique) - User email
  - `password_hash` (text) - Hashed password
  - `role` (text) - User role: admin, company, operator, customer
  - `first_name` (text) - First name
  - `last_name` (text) - Last name
  - `phone` (text) - Phone number
  - `company_id` (uuid, foreign key) - Reference to company
  - `customer_id` (uuid, foreign key) - Reference to customer (for customer role)
  - `is_active` (boolean) - Account status
  - `trial_end_date` (timestamptz) - Trial end date
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. customers
  Customer companies that receive pest control services
  - `id` (uuid, primary key)
  - `company_id` (uuid, foreign key) - Service provider company
  - `name` (text) - Customer name
  - `email` (text) - Customer email
  - `phone` (text) - Customer phone
  - `address` (text) - Customer address
  - `contact_person` (text) - Contact person name
  - `contract_start_date` (date) - Contract start
  - `contract_end_date` (date) - Contract end
  - `is_active` (boolean) - Customer status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. branches
  Customer branch locations
  - `id` (uuid, primary key)
  - `customer_id` (uuid, foreign key) - Reference to customer
  - `name` (text) - Branch name
  - `address` (text) - Branch address
  - `contact_person` (text) - Branch contact
  - `phone` (text) - Branch phone
  - `area` (numeric) - Area in square meters
  - `building_type` (text) - Type of building
  - `special_requirements` (text) - Special notes
  - `is_active` (boolean) - Branch status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. chemical_products
  Chemical products used in treatments
  - `id` (uuid, primary key)
  - `company_id` (uuid, foreign key) - Owning company
  - `name` (text) - Product name
  - `active_ingredient` (text) - Active ingredient
  - `concentration` (text) - Concentration info
  - `manufacturer` (text) - Manufacturer name
  - `registration_number` (text) - Registration number
  - `safety_data_sheet` (text) - SDS document URL
  - `application_rate` (text) - Application rate info
  - `target_pests` (text[]) - Target pests
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. visit_types
  Service visit type definitions
  - `id` (uuid, primary key)
  - `company_id` (uuid, foreign key) - Owning company
  - `name` (text) - Visit type name
  - `description` (text) - Description
  - `duration` (integer) - Expected duration in minutes
  - `price` (numeric) - Default price
  - `required_equipment` (text[]) - Required equipment
  - `default_products` (text[]) - Default products used
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 7. visits
  Service visit records
  - `id` (uuid, primary key)
  - `company_id` (uuid, foreign key) - Service provider
  - `customer_id` (uuid, foreign key) - Customer
  - `branch_id` (uuid, foreign key) - Branch location
  - `operator_id` (uuid, foreign key) - Operator assigned
  - `visit_type_id` (uuid, foreign key) - Type of visit
  - `scheduled_date` (timestamptz) - Scheduled date/time
  - `actual_date` (timestamptz) - Actual date/time
  - `status` (text) - Visit status: scheduled, in_progress, completed, cancelled
  - `equipment` (text[]) - Equipment used
  - `findings` (text) - Findings during visit
  - `treatment` (text) - Treatment applied
  - `recommendations` (text) - Recommendations
  - `total_cost` (numeric) - Total cost
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 8. visit_products
  Products used in each visit
  - `id` (uuid, primary key)
  - `visit_id` (uuid, foreign key) - Related visit
  - `product_id` (uuid, foreign key) - Product used
  - `quantity` (numeric) - Quantity used
  - `concentration` (text) - Concentration applied
  - `application_method` (text) - Method used
  - `target_areas` (text[]) - Target areas
  - `created_at` (timestamptz)

  ### 9. inventory_items
  Inventory management
  - `id` (uuid, primary key)
  - `company_id` (uuid, foreign key) - Owning company
  - `product_id` (uuid, foreign key) - Product reference
  - `current_stock` (numeric) - Current stock level
  - `minimum_stock` (numeric) - Minimum stock alert level
  - `last_restock_date` (date) - Last restock date
  - `expiration_date` (date) - Expiration date
  - `supplier` (text) - Supplier name
  - `cost` (numeric) - Unit cost
  - `location` (text) - Storage location
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 10. price_items
  Price list items
  - `id` (uuid, primary key)
  - `company_id` (uuid, foreign key) - Owning company
  - `name` (text) - Item name
  - `type` (text) - Type: service or material
  - `price` (numeric) - Unit price
  - `unit` (text) - Unit of measurement
  - `description` (text) - Description
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Policies for each role (admin, company, operator, customer)
  - Admin users can access all data
  - Company users can access their own company data
  - Operators can view and update their assigned data
  - Customers can only view their own data
*/

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  address text,
  tax_number text,
  authorized_person text,
  is_approved boolean DEFAULT false,
  is_demo boolean DEFAULT false,
  trial_end_date timestamptz,
  license_number text,
  application_types text[],
  target_pests text[],
  treatment_methods text[],
  equipment_types text[],
  safety_measures text[],
  working_hours_start text,
  working_hours_end text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'company', 'operator', 'customer')),
  first_name text,
  last_name text,
  phone text,
  company_id text REFERENCES companies(id) ON DELETE CASCADE,
  customer_id text,
  is_active boolean DEFAULT true,
  trial_end_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id text PRIMARY KEY,
  company_id text NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
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

-- Add foreign key for users.customer_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'users_customer_id_fkey'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_customer_id_fkey 
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create branches table
CREATE TABLE IF NOT EXISTS branches (
  id text PRIMARY KEY,
  customer_id text NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text,
  contact_person text,
  phone text,
  area numeric,
  building_type text,
  special_requirements text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chemical_products table
CREATE TABLE IF NOT EXISTS chemical_products (
  id text PRIMARY KEY,
  company_id text NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  active_ingredient text,
  concentration text,
  manufacturer text,
  registration_number text,
  safety_data_sheet text,
  application_rate text,
  target_pests text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create visit_types table
CREATE TABLE IF NOT EXISTS visit_types (
  id text PRIMARY KEY,
  company_id text NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  duration integer,
  price numeric,
  required_equipment text[],
  default_products text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create visits table
CREATE TABLE IF NOT EXISTS visits (
  id text PRIMARY KEY,
  company_id text NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id text NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  branch_id text REFERENCES branches(id) ON DELETE SET NULL,
  operator_id text REFERENCES users(id) ON DELETE SET NULL,
  visit_type_id text REFERENCES visit_types(id) ON DELETE SET NULL,
  scheduled_date timestamptz NOT NULL,
  actual_date timestamptz,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  equipment text[],
  findings text,
  treatment text,
  recommendations text,
  total_cost numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create visit_products table
CREATE TABLE IF NOT EXISTS visit_products (
  id text PRIMARY KEY,
  visit_id text NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
  product_id text NOT NULL REFERENCES chemical_products(id) ON DELETE CASCADE,
  quantity numeric,
  concentration text,
  application_method text,
  target_areas text[],
  created_at timestamptz DEFAULT now()
);

-- Create inventory_items table
CREATE TABLE IF NOT EXISTS inventory_items (
  id text PRIMARY KEY,
  company_id text NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  product_id text NOT NULL REFERENCES chemical_products(id) ON DELETE CASCADE,
  current_stock numeric DEFAULT 0,
  minimum_stock numeric DEFAULT 0,
  last_restock_date date,
  expiration_date date,
  supplier text,
  cost numeric,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create price_items table
CREATE TABLE IF NOT EXISTS price_items (
  id text PRIMARY KEY,
  company_id text NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text CHECK (type IN ('service', 'material')),
  price numeric NOT NULL,
  unit text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE chemical_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies table
CREATE POLICY "Admin users can view all companies"
  ON companies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Company users can view own company"
  ON companies FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text
    )
  );

CREATE POLICY "Admin users can insert companies"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin users can update companies"
  ON companies FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Company users can update own company"
  ON companies FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'company'
    )
  );

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid()::text);

CREATE POLICY "Admin users can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()::text 
      AND u.role = 'admin'
    )
  );

CREATE POLICY "Company users can view their company users"
  ON users FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text
    )
  );

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid()::text)
  WITH CHECK (id = auth.uid()::text);

CREATE POLICY "Admin users can insert users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Company users can insert their company users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'company'
    )
  );

-- RLS Policies for customers table
CREATE POLICY "Admin users can view all customers"
  ON customers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Company users can view their customers"
  ON customers FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text
    )
  );

CREATE POLICY "Customer users can view own customer data"
  ON customers FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT customer_id FROM users 
      WHERE users.id = auth.uid()::text
    )
  );

CREATE POLICY "Company users can insert customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'company'
    )
  );

CREATE POLICY "Company users can update their customers"
  ON customers FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'company'
    )
  );

CREATE POLICY "Company users can delete their customers"
  ON customers FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'company'
    )
  );

-- RLS Policies for branches table
CREATE POLICY "Users can view branches of their customers"
  ON branches FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers 
      WHERE company_id IN (
        SELECT company_id FROM users 
        WHERE users.id = auth.uid()::text
      )
      OR id IN (
        SELECT customer_id FROM users 
        WHERE users.id = auth.uid()::text
      )
    )
  );

CREATE POLICY "Company users can insert branches"
  ON branches FOR INSERT
  TO authenticated
  WITH CHECK (
    customer_id IN (
      SELECT id FROM customers 
      WHERE company_id IN (
        SELECT company_id FROM users 
        WHERE users.id = auth.uid()::text 
        AND users.role = 'company'
      )
    )
  );

CREATE POLICY "Company users can update branches"
  ON branches FOR UPDATE
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers 
      WHERE company_id IN (
        SELECT company_id FROM users 
        WHERE users.id = auth.uid()::text 
        AND users.role = 'company'
      )
    )
  );

CREATE POLICY "Company users can delete branches"
  ON branches FOR DELETE
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers 
      WHERE company_id IN (
        SELECT company_id FROM users 
        WHERE users.id = auth.uid()::text 
        AND users.role = 'company'
      )
    )
  );

-- RLS Policies for chemical_products table
CREATE POLICY "Company users can view their products"
  ON chemical_products FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text
    )
  );

CREATE POLICY "Company users can insert products"
  ON chemical_products FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'company'
    )
  );

CREATE POLICY "Company users can update their products"
  ON chemical_products FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'company'
    )
  );

CREATE POLICY "Company users can delete their products"
  ON chemical_products FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'company'
    )
  );

-- RLS Policies for visit_types table
CREATE POLICY "Company users can view their visit types"
  ON visit_types FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text
    )
  );

CREATE POLICY "Company users can insert visit types"
  ON visit_types FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'company'
    )
  );

CREATE POLICY "Company users can update their visit types"
  ON visit_types FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'company'
    )
  );

CREATE POLICY "Company users can delete their visit types"
  ON visit_types FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'company'
    )
  );

-- RLS Policies for visits table
CREATE POLICY "Company users can view their visits"
  ON visits FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text
    )
  );

CREATE POLICY "Customer users can view their visits"
  ON visits FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM users 
      WHERE users.id = auth.uid()::text
    )
  );

CREATE POLICY "Company users can insert visits"
  ON visits FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role IN ('company', 'operator')
    )
  );

CREATE POLICY "Company users can update their visits"
  ON visits FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role IN ('company', 'operator')
    )
  );

CREATE POLICY "Company users can delete their visits"
  ON visits FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'company'
    )
  );

-- RLS Policies for visit_products table
CREATE POLICY "Users can view visit products"
  ON visit_products FOR SELECT
  TO authenticated
  USING (
    visit_id IN (
      SELECT id FROM visits 
      WHERE company_id IN (
        SELECT company_id FROM users 
        WHERE users.id = auth.uid()::text
      )
      OR customer_id IN (
        SELECT customer_id FROM users 
        WHERE users.id = auth.uid()::text
      )
    )
  );

CREATE POLICY "Company users can insert visit products"
  ON visit_products FOR INSERT
  TO authenticated
  WITH CHECK (
    visit_id IN (
      SELECT id FROM visits 
      WHERE company_id IN (
        SELECT company_id FROM users 
        WHERE users.id = auth.uid()::text 
        AND users.role IN ('company', 'operator')
      )
    )
  );

CREATE POLICY "Company users can update visit products"
  ON visit_products FOR UPDATE
  TO authenticated
  USING (
    visit_id IN (
      SELECT id FROM visits 
      WHERE company_id IN (
        SELECT company_id FROM users 
        WHERE users.id = auth.uid()::text 
        AND users.role IN ('company', 'operator')
      )
    )
  );

CREATE POLICY "Company users can delete visit products"
  ON visit_products FOR DELETE
  TO authenticated
  USING (
    visit_id IN (
      SELECT id FROM visits 
      WHERE company_id IN (
        SELECT company_id FROM users 
        WHERE users.id = auth.uid()::text 
        AND users.role = 'company'
      )
    )
  );

-- RLS Policies for inventory_items table
CREATE POLICY "Company users can view their inventory"
  ON inventory_items FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text
    )
  );

CREATE POLICY "Company users can insert inventory items"
  ON inventory_items FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'company'
    )
  );

CREATE POLICY "Company users can update their inventory"
  ON inventory_items FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'company'
    )
  );

CREATE POLICY "Company users can delete inventory items"
  ON inventory_items FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'company'
    )
  );

-- RLS Policies for price_items table
CREATE POLICY "Company users can view their price items"
  ON price_items FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text
    )
  );

CREATE POLICY "Company users can insert price items"
  ON price_items FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'company'
    )
  );

CREATE POLICY "Company users can update their price items"
  ON price_items FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'company'
    )
  );

CREATE POLICY "Company users can delete price items"
  ON price_items FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'company'
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_customer_id ON users(customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_company_id ON customers(company_id);
CREATE INDEX IF NOT EXISTS idx_branches_customer_id ON branches(customer_id);
CREATE INDEX IF NOT EXISTS idx_chemical_products_company_id ON chemical_products(company_id);
CREATE INDEX IF NOT EXISTS idx_visit_types_company_id ON visit_types(company_id);
CREATE INDEX IF NOT EXISTS idx_visits_company_id ON visits(company_id);
CREATE INDEX IF NOT EXISTS idx_visits_customer_id ON visits(customer_id);
CREATE INDEX IF NOT EXISTS idx_visits_operator_id ON visits(operator_id);
CREATE INDEX IF NOT EXISTS idx_visit_products_visit_id ON visit_products(visit_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_company_id ON inventory_items(company_id);
CREATE INDEX IF NOT EXISTS idx_price_items_company_id ON price_items(company_id);