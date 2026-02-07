/*
  # Add password_hash to profiles
  
  ## Changes
  - Adds password_hash column to profiles table for local authentication
  - Removes auth trigger since only admin uses Supabase Auth
  - Makes id column not require foreign key to auth.users (only for admin)
  
  ## Security
  - password_hash will store bcrypt hashed passwords
  - Admin users still use Supabase Auth
  - Other users use local authentication with profiles table
*/

-- Drop the auth trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop foreign key constraint on profiles.id
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Add password_hash column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash text;

-- Make id column independent (not always linked to auth.users)
-- Profiles for admin will still reference auth.users.id
-- Profiles for others will have UUID generated