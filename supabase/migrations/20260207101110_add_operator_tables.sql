/*
  # Add Operator and Warehouse Tables

  1. New Tables
    - `operators` - Operator profiles with assigned customers and branches
      - `id` (uuid, primary key)
      - `auth_id` (uuid) - Reference to auth.users
      - `name` (text) - Operator name
      - `phone` (text) - Phone number
      - `email` (text) - Email
      - `assigned_customers` (text[]) - Array of customer IDs
      - `assigned_branches` (text[]) - Array of branch IDs
      - `is_active` (boolean) - Active status
      - `created_at` (timestamptz)
      
    - `warehouses` - Warehouse locations
      - `id` (uuid, primary key)
      - `name` (text) - Warehouse name
      - `code` (text) - Warehouse code
      - `address` (text) - Address
      - `city` (text) - City
      - `operator_id` (text) - Assigned operator
      - `is_active` (boolean) - Active status
      - `created_at` (timestamptz)
      
    - `warehouse_items` - Stock items in warehouses
      - `id` (uuid, primary key)
      - `warehouse_id` (text) - Reference to warehouse
      - `product_id` (text) - Reference to product
      - `quantity` (numeric) - Stock quantity
      - `created_at` (timestamptz)
      
    - `warehouse_transfers` - Transfers between warehouses
      - `id` (uuid, primary key)
      - `source_warehouse_id` (text) - Source warehouse
      - `target_warehouse_id` (text) - Target warehouse
      - `product_id` (text) - Product being transferred
      - `quantity` (numeric) - Quantity
      - `status` (text) - pending, completed, cancelled
      - `notes` (text) - Transfer notes
      - `transfer_date` (timestamptz) - Transfer date
      - `created_at` (timestamptz)

  2. Updates to visits table
    - Add fields: visit_date, visit_type, pest_types, notes, report_number, equipment_checks
    - Update status to include 'planned'
    
  3. Security
    - Enable RLS on all new tables
    - Add policies for operators to access their data
*/

-- Create operators table
CREATE TABLE IF NOT EXISTS operators (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  auth_id uuid,
  name text NOT NULL,
  phone text,
  email text,
  assigned_customers text[],
  assigned_branches text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create warehouses table
CREATE TABLE IF NOT EXISTS warehouses (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  address text,
  city text,
  operator_id text REFERENCES operators(id) ON DELETE SET NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create warehouse_items table
CREATE TABLE IF NOT EXISTS warehouse_items (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  warehouse_id text NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  product_id text NOT NULL REFERENCES chemical_products(id) ON DELETE CASCADE,
  quantity numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(warehouse_id, product_id)
);

-- Create warehouse_transfers table
CREATE TABLE IF NOT EXISTS warehouse_transfers (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  source_warehouse_id text NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  target_warehouse_id text NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  product_id text NOT NULL REFERENCES chemical_products(id) ON DELETE CASCADE,
  quantity numeric NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  notes text,
  transfer_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Add new columns to visits table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'visits' AND column_name = 'visit_date') THEN
    ALTER TABLE visits ADD COLUMN visit_date timestamptz;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'visits' AND column_name = 'visit_type') THEN
    ALTER TABLE visits ADD COLUMN visit_type text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'visits' AND column_name = 'pest_types') THEN
    ALTER TABLE visits ADD COLUMN pest_types text[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'visits' AND column_name = 'notes') THEN
    ALTER TABLE visits ADD COLUMN notes text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'visits' AND column_name = 'report_number') THEN
    ALTER TABLE visits ADD COLUMN report_number text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'visits' AND column_name = 'equipment_checks') THEN
    ALTER TABLE visits ADD COLUMN equipment_checks jsonb;
  END IF;
END $$;

-- Update visits table status check to include 'planned'
ALTER TABLE visits DROP CONSTRAINT IF EXISTS visits_status_check;
ALTER TABLE visits ADD CONSTRAINT visits_status_check 
  CHECK (status IN ('planned', 'scheduled', 'in_progress', 'completed', 'cancelled'));

-- Enable RLS
ALTER TABLE operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_transfers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for operators
CREATE POLICY "Operators can view own profile"
  ON operators FOR SELECT
  TO authenticated
  USING (auth_id = auth.uid());

CREATE POLICY "Admin can view all operators"
  ON operators FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Company users can view their operators"
  ON operators FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT u.id FROM users u
      WHERE u.company_id IN (
        SELECT company_id FROM users 
        WHERE users.id = auth.uid()::text
      )
      AND u.role = 'operator'
    )
  );

CREATE POLICY "Admin can insert operators"
  ON operators FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin can update operators"
  ON operators FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'admin'
    )
  );

-- RLS Policies for warehouses
CREATE POLICY "Operators can view their warehouses"
  ON warehouses FOR SELECT
  TO authenticated
  USING (
    operator_id IN (
      SELECT id FROM operators 
      WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Admin can view all warehouses"
  ON warehouses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin can manage warehouses"
  ON warehouses FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'admin'
    )
  );

-- RLS Policies for warehouse_items
CREATE POLICY "Users can view warehouse items"
  ON warehouse_items FOR SELECT
  TO authenticated
  USING (
    warehouse_id IN (
      SELECT id FROM warehouses 
      WHERE operator_id IN (
        SELECT id FROM operators 
        WHERE auth_id = auth.uid()
      )
    )
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can manage warehouse items"
  ON warehouse_items FOR ALL
  TO authenticated
  USING (
    warehouse_id IN (
      SELECT id FROM warehouses 
      WHERE operator_id IN (
        SELECT id FROM operators 
        WHERE auth_id = auth.uid()
      )
    )
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'admin'
    )
  );

-- RLS Policies for warehouse_transfers
CREATE POLICY "Users can view warehouse transfers"
  ON warehouse_transfers FOR SELECT
  TO authenticated
  USING (
    source_warehouse_id IN (
      SELECT id FROM warehouses 
      WHERE operator_id IN (
        SELECT id FROM operators 
        WHERE auth_id = auth.uid()
      )
    )
    OR target_warehouse_id IN (
      SELECT id FROM warehouses 
      WHERE operator_id IN (
        SELECT id FROM operators 
        WHERE auth_id = auth.uid()
      )
    )
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can create warehouse transfers"
  ON warehouse_transfers FOR INSERT
  TO authenticated
  WITH CHECK (
    source_warehouse_id IN (
      SELECT id FROM warehouses 
      WHERE operator_id IN (
        SELECT id FROM operators 
        WHERE auth_id = auth.uid()
      )
    )
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin can update warehouse transfers"
  ON warehouse_transfers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_operators_auth_id ON operators(auth_id);
CREATE INDEX IF NOT EXISTS idx_warehouses_operator_id ON warehouses(operator_id);
CREATE INDEX IF NOT EXISTS idx_warehouse_items_warehouse_id ON warehouse_items(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_warehouse_items_product_id ON warehouse_items(product_id);
CREATE INDEX IF NOT EXISTS idx_warehouse_transfers_source ON warehouse_transfers(source_warehouse_id);
CREATE INDEX IF NOT EXISTS idx_warehouse_transfers_target ON warehouse_transfers(target_warehouse_id);
