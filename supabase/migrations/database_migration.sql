-- Update database schema to use user_id instead of clerk_user_id
-- Run this SQL in your Supabase SQL Editor

-- First, add user_id column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Update existing profiles to use user_id instead of clerk_user_id
-- Note: This assumes you have a way to map clerk_user_id to Supabase user_id
-- For new users, this will be handled automatically

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- Update RLS policies to use user_id instead of clerk_user_id
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create new RLS policies using user_id
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Optional: Drop clerk_user_id column after migration is complete
-- ALTER TABLE profiles DROP COLUMN IF EXISTS clerk_user_id;
