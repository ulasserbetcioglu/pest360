/*
  # Fix Company Relationships and Structure

  1. Schema Updates
    - Ensure proper foreign key relationships
    - Add missing company_id references
    - Fix user-company relationships
    
  2. Data Structure
    - Companies belong to admin users
    - Customers belong to companies
    - Branches belong to customers
    - Operators belong to companies
    - Visits are linked to companies through operators
    
  3. Security
    - Update RLS policies to reflect proper hierarchy
    - Ensure data isolation between companies
*/

-- First, let's ensure the companies table has proper structure
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS created_by_admin_id uuid REFERENCES auth.users(id);

-- Update users table to ensure proper company relationship
DO $$
BEGIN
  -- Add company_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE users ADD COLUMN company_id text REFERENCES companies(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Ensure operators table has proper company relationship
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'operators' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE operators ADD COLUMN company_id text REFERENCES companies(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_operators_company_id ON operators(company_id);
CREATE INDEX IF NOT EXISTS idx_companies_created_by ON companies(created_by_admin_id);

-- Update RLS policies for proper company isolation

-- Companies policies
DROP POLICY IF EXISTS "Admin users can view all companies" ON companies;
DROP POLICY IF EXISTS "Company users can view own company" ON companies;
DROP POLICY IF EXISTS "Admin users can insert companies" ON companies;
DROP POLICY IF EXISTS "Company users can update own company" ON companies;
DROP POLICY IF EXISTS "Admin users can update companies" ON companies;

CREATE POLICY "Admin users can manage all companies"
  ON companies
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = (auth.uid())::text 
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = (auth.uid())::text 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Company users can view own company"
  ON companies
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT users.company_id 
      FROM users 
      WHERE users.id = (auth.uid())::text
    )
  );

CREATE POLICY "Company users can update own company"
  ON companies
  FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT users.company_id 
      FROM users 
      WHERE users.id = (auth.uid())::text 
      AND users.role = 'company'
    )
  )
  WITH CHECK (
    id IN (
      SELECT users.company_id 
      FROM users 
      WHERE users.id = (auth.uid())::text 
      AND users.role = 'company'
    )
  );

-- Users policies update
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admin users can view all users" ON users;
DROP POLICY IF EXISTS "Company users can view their company users" ON users;
DROP POLICY IF EXISTS "Admin users can insert users" ON users;
DROP POLICY IF EXISTS "Company users can insert their company users" ON users;

CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (id = (auth.uid())::text);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (id = (auth.uid())::text)
  WITH CHECK (id = (auth.uid())::text);

CREATE POLICY "Admin users can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = (auth.uid())::text 
      AND u.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = (auth.uid())::text 
      AND u.role = 'admin'
    )
  );

CREATE POLICY "Company users can view their company users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT users_1.company_id 
      FROM users users_1 
      WHERE users_1.id = (auth.uid())::text
    )
  );

CREATE POLICY "Company users can manage their company users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    company_id IN (
      SELECT users_1.company_id 
      FROM users users_1 
      WHERE users_1.id = (auth.uid())::text 
      AND users_1.role = 'company'
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT users_1.company_id 
      FROM users users_1 
      WHERE users_1.id = (auth.uid())::text 
      AND users_1.role = 'company'
    )
  );

-- Operators policies update
DROP POLICY IF EXISTS "Operators can view own profile" ON operators;
DROP POLICY IF EXISTS "Admin can view all operators" ON operators;
DROP POLICY IF EXISTS "Admin can insert operators" ON operators;
DROP POLICY IF EXISTS "Admin can update operators" ON operators;
DROP POLICY IF EXISTS "Company users can view their operators" ON operators;

CREATE POLICY "Operators can view own profile"
  ON operators
  FOR SELECT
  TO authenticated
  USING (auth_id = auth.uid());

CREATE POLICY "Admin can manage all operators"
  ON operators
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = (auth.uid())::text 
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = (auth.uid())::text 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Company users can manage their operators"
  ON operators
  FOR ALL
  TO authenticated
  USING (
    company_id IN (
      SELECT users.company_id 
      FROM users 
      WHERE users.id = (auth.uid())::text 
      AND users.role = 'company'
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT users.company_id 
      FROM users 
      WHERE users.id = (auth.uid())::text 
      AND users.role = 'company'
    )
  );

-- Insert demo data to fix the current structure
DO $$
DECLARE
  demo_company_id text;
  demo_admin_user_id text;
BEGIN
  -- Get or create admin user
  SELECT id INTO demo_admin_user_id FROM users WHERE role = 'admin' LIMIT 1;
  
  IF demo_admin_user_id IS NULL THEN
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, is_active)
    VALUES ('admin-1', 'admin@pest360.com', 'hashed_password', 'admin', 'Admin', 'User', true)
    RETURNING id INTO demo_admin_user_id;
  END IF;

  -- Get or create demo company
  SELECT id INTO demo_company_id FROM companies WHERE email = 'demo@elimspa.com' LIMIT 1;
  
  IF demo_company_id IS NULL THEN
    INSERT INTO companies (
      id, name, email, phone, address, tax_number, authorized_person,
      is_approved, is_demo, trial_end_date, created_by_admin_id
    ) VALUES (
      'company-1', 'Elit İlaçlama Hizmetleri', 'demo@elimspa.com', 
      '+90 212 555 0001', 'Çankaya, Ankara', '1234567890', 'Ahmet Yılmaz',
      true, true, NOW() + INTERVAL '30 days', demo_admin_user_id
    )
    RETURNING id INTO demo_company_id;
  ELSE
    -- Update existing company to link to admin
UPDATE companies 
SET created_by_admin_id = demo_admin_user_id::uuid 
WHERE id = demo_company_id;

  -- Update existing users to link to company
  UPDATE users 
  SET company_id = demo_company_id 
  WHERE email IN ('demo@elimspa.com', 'operator@elimspa.com') 
  AND company_id IS NULL;

  -- Update operators to link to company
  UPDATE operators 
  SET company_id = demo_company_id 
  WHERE company_id IS NULL;

  -- Ensure company user exists
  INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, company_id, is_active)
  VALUES ('company-1', 'demo@elimspa.com', 'hashed_password', 'company', 'Ahmet', 'Yılmaz', '+90 212 555 0001', demo_company_id, true)
  ON CONFLICT (email) DO UPDATE SET 
    company_id = demo_company_id,
    role = 'company';

  -- Ensure operator user exists
  INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, company_id, is_active)
  VALUES ('operator-1', 'operator@elimspa.com', 'hashed_password', 'operator', 'Mehmet', 'Kaya', '+90 212 555 0002', demo_company_id, true)
  ON CONFLICT (email) DO UPDATE SET 
    company_id = demo_company_id,
    role = 'operator';

END $$;