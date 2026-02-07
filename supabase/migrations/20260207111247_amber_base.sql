/*
  # Remove demo admin data and update auth system

  1. Changes
    - Remove demo admin user from users table
    - Update auth system to use real Supabase Auth
    - Clean up any demo admin related data

  2. Security
    - Remove hardcoded demo credentials
    - Ensure proper Supabase Auth integration
*/

-- Remove demo admin user if exists
DELETE FROM users WHERE email = 'admin@pest360.com';

-- Update RLS policies to work with Supabase Auth uid() function
-- The policies are already correctly set up to use auth.uid()
-- No changes needed for RLS policies as they already use Supabase Auth functions