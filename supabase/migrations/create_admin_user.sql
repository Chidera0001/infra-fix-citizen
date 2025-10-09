-- Create Admin User in Supabase
-- Run this SQL in your Supabase SQL Editor

-- First, create a user in auth.users (you'll need to do this through Supabase Auth UI or API)
-- Then update their profile to have admin role

-- Example: Update existing user to admin role
-- Replace 'USER_ID_HERE' with the actual user ID from auth.users table
UPDATE profiles 
SET role = 'admin' 
WHERE user_id = 'USER_ID_HERE';

-- Or create a new admin profile (if user already exists in auth.users)
-- Replace 'USER_ID_HERE' with the actual user ID
INSERT INTO profiles (
  user_id,
  email,
  full_name,
  role,
  is_active
) VALUES (
  'USER_ID_HERE',
  'admin@citizn.ng',
  'System Administrator',
  'admin',
  true
);

-- To find user IDs, run this query:
-- SELECT id, email FROM auth.users;
