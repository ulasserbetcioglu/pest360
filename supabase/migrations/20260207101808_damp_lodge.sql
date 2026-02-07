/*
  # Fix Company Relationships and Structure - FINAL FIXED VERSION
  
  1. Schema Updates
    - Adds created_by_admin_id to companies (UUID reference to auth.users)
    - Adds company_id to users and operators
  2. RLS Policies
    - Resets and recreates strict policies
  3. Data Repair (DO Block)
    - Safely handles UUID casting
    - Links existing demo company to admin
*/

-- 1. SCHEMA UPDATES
-- Ensure companies table has proper structure
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS created_by_admin_id uuid REFERENCES auth.users(id);

-- Update users table to ensure proper company relationship
DO $$
BEGIN
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


-- 2. RLS POLICIES (Reset and Re-apply)

-- Clear existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admin users can view all companies" ON companies;
DROP POLICY IF EXISTS "Company users can view own company" ON companies;
DROP POLICY IF EXISTS "Admin users can insert companies" ON companies;
DROP POLICY IF EXISTS "Company users can update own company" ON companies;
DROP POLICY IF EXISTS "Admin users can update companies" ON companies;
DROP POLICY IF EXISTS "Admin users can manage all companies" ON companies;

-- Create New Company Policies
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
  );

-- Clear User Policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admin users can view all users" ON users;
DROP POLICY IF EXISTS "Company users can view their company users" ON users;
DROP POLICY IF EXISTS "Admin users can insert users" ON users;
DROP POLICY IF EXISTS "Company users can insert their company users" ON users;
DROP POLICY IF EXISTS "Admin users can manage all users" ON users;
DROP POLICY IF EXISTS "Company users can manage their company users" ON users;

-- Create New User Policies
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
  );

-- Clear Operator Policies
DROP POLICY IF EXISTS "Operators can view own profile" ON operators;
DROP POLICY IF EXISTS "Admin can view all operators" ON operators;
DROP POLICY IF EXISTS "Admin can insert operators" ON operators;
DROP POLICY IF EXISTS "Admin can update operators" ON operators;
DROP POLICY IF EXISTS "Company users can view their operators" ON operators;
DROP POLICY IF EXISTS "Admin can manage all operators" ON operators;
DROP POLICY IF EXISTS "Company users can manage their operators" ON operators;

-- Create New Operator Policies
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
  );


-- 3. DATA REPAIR & DEMO SETUP (Fixed Logic)
DO $$
DECLARE
  v_admin_auth_id uuid;
  v_company_id text;
  v_demo_email text := 'demo@elimspa.com';
  v_admin_email text := 'admin@pest360.com'; -- BURASI SİZİN ADMİN MAİLİNİZ OLMALI
BEGIN
  -- 1. Gerçek Auth tablosundan Admin ID'sini bul (UUID)
  SELECT id INTO v_admin_auth_id FROM auth.users WHERE email = v_admin_email LIMIT 1;

  -- 2. Eğer Auth tablosunda admin yoksa işlem yapma (Hata almamak için)
  IF v_admin_auth_id IS NOT NULL THEN
    
    -- Admin'i public.users tablosuna admin rolüyle ekle/güncelle
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, is_active)
    VALUES (v_admin_auth_id::text, v_admin_email, 'managed_by_supabase_auth', 'admin', 'System', 'Admin', true)
    ON CONFLICT (id) DO UPDATE 
    SET role = 'admin', is_active = true;

    -- 3. Demo Şirketi Bul veya Oluştur
    SELECT id INTO v_company_id FROM companies WHERE email = v_demo_email LIMIT 1;

    IF v_company_id IS NULL THEN
      -- Yeni şirket oluştur
      INSERT INTO companies (
        id, name, email, phone, address, tax_number, authorized_person,
        is_approved, is_demo, trial_end_date, created_by_admin_id
      ) VALUES (
        'company-' || gen_random_uuid()::text, -- Benzersiz ID
        'Elit İlaçlama Hizmetleri', 
        v_demo_email, 
        '+90 212 555 0001', 
        'Çankaya, Ankara', 
        '1234567890', 
        'Ahmet Yılmaz',
        true, 
        true, 
        NOW() + INTERVAL '30 days', 
        v_admin_auth_id -- UUID olarak atandı
      )
      RETURNING id INTO v_company_id;
    ELSE
      -- Mevcut şirketi admin'e bağla
      UPDATE companies 
      SET created_by_admin_id = v_admin_auth_id
      WHERE id = v_company_id;
    END IF;

    -- 4. Kullanıcıları Şirkete Bağla
    IF v_company_id IS NOT NULL THEN
        -- Demo kullanıcısını güncelle/ekle
        INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, company_id, is_active)
        VALUES (
            'company-user-' || gen_random_uuid()::text, 
            v_demo_email, 
            'hashed_password', 
            'company', 
            'Ahmet', 
            'Yılmaz', 
            '+90 212 555 0001', 
            v_company_id, 
            true
        )
        ON CONFLICT (email) DO UPDATE SET 
            company_id = v_company_id,
            role = 'company';

        -- Operatör kullanıcısını güncelle/ekle
        INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, company_id, is_active)
        VALUES (
            'operator-user-' || gen_random_uuid()::text, 
            'operator@elimspa.com', 
            'hashed_password', 
            'operator', 
            'Mehmet', 
            'Kaya', 
            '+90 212 555 0002', 
            v_company_id, 
            true
        )
        ON CONFLICT (email) DO UPDATE SET 
            company_id = v_company_id,
            role = 'operator';

        -- Operatörler tablosunu güncelle (Eğer varsa)
        UPDATE operators 
        SET company_id = v_company_id 
        WHERE company_id IS NULL;
    END IF;

  END IF;
END $$;