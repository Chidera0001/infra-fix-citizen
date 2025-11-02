-- ============================================================================
-- OFFLINE SYNC SETUP FOR SERVICE WORKER
-- ============================================================================
-- This script ensures your Supabase database is properly configured for
-- offline-first report syncing via Background Sync API
-- 
-- IMPORTANT: Run this in your Supabase SQL Editor
-- Location: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new
-- ============================================================================

-- ============================================================================
-- 1. VERIFY STORAGE BUCKET EXISTS (NO CHANGES - SAFE)
-- ============================================================================
-- Note: If your 'issue-images' bucket already exists and is working,
-- this section will NOT modify it - it only creates if missing.
-- The ON CONFLICT clause will update limits IF the bucket doesn't have them,
-- but won't change existing functional settings.
--
-- If you want to skip this section entirely, comment it out.
-- Your existing bucket will continue to work regardless.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'issue-images', 
  'issue-images', 
  true,  -- Public bucket (images are publicly viewable)
  4194304,  -- 4MB file size limit (4 * 1024 * 1024 bytes)
  ARRAY['image/jpeg', 'image/png', 'image/webp']  -- Allowed file types
)
ON CONFLICT (id) DO NOTHING;  -- Changed to DO NOTHING - won't modify existing bucket

-- ============================================================================
-- 2. ENSURE PROFILES TABLE HAS USER_ID COLUMN
-- ============================================================================
-- Add user_id column if it doesn't exist (for Supabase Auth integration)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- ============================================================================
-- 3. STORAGE POLICIES FOR SERVICE WORKER
-- ============================================================================
-- IMPORTANT: These policies are added with "IF NOT EXISTS" logic.
-- They will ONLY be created if they don't already exist.
-- Your existing policies will remain untouched.
--
-- If you already have working storage policies, you can SKIP this section.
-- Only run this if you're missing policies needed for service worker uploads.

-- Policy 1: Allow authenticated users to upload images
-- (Only creates if policy doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload images'
  ) THEN
    CREATE POLICY "Authenticated users can upload images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'issue-images');
  END IF;
END $$;

-- Policy 2: Allow public read access to images (only if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public can view images'
  ) THEN
    CREATE POLICY "Public can view images"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'issue-images');
  END IF;
END $$;

-- Policy 3: Allow users to update their own uploaded images (only if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can update own images'
  ) THEN
    CREATE POLICY "Users can update own images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'issue-images' AND auth.uid() = owner);
  END IF;
END $$;

-- Policy 4: Allow users to delete their own uploaded images (only if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can delete own images'
  ) THEN
    CREATE POLICY "Users can delete own images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'issue-images' AND auth.uid() = owner);
  END IF;
END $$;

-- ============================================================================
-- 4. RLS POLICIES FOR PROFILES (Service Worker Compatibility)
-- ============================================================================
-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Service worker can query profiles by user_id" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles by user_id" ON profiles;

-- Policy: Allow authenticated users to query profiles by user_id
-- This is needed for the service worker to get reporter_id
-- Note: This policy works alongside "Anyone can view all profiles" below
-- You can remove this if you prefer public read access
CREATE POLICY "Users can view profiles by user_id"
ON profiles FOR SELECT
TO authenticated
USING (
  -- Allow if querying own profile or any profile (for service worker)
  user_id = auth.uid() OR true
);

-- Allow public read of profiles (simplifies service worker queries)
-- If you want more security, remove this and use the authenticated policy above
DROP POLICY IF EXISTS "Anyone can view all profiles" ON profiles;
CREATE POLICY "Anyone can view all profiles"
ON profiles FOR SELECT
USING (true);

-- ============================================================================
-- 5. RLS POLICIES FOR ISSUES (Service Worker Compatibility)
-- ============================================================================
-- Ensure RLS is enabled
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Service worker can create issues" ON issues;
DROP POLICY IF EXISTS "Authenticated users can create issues via service worker" ON issues;

-- Policy: Allow authenticated users to create issues via service worker
-- This allows the service worker to insert issues with proper reporter_id
CREATE POLICY "Authenticated users can create issues via service worker"
ON issues FOR INSERT
TO authenticated
WITH CHECK (
  -- Ensure the user is authenticated
  auth.uid() IS NOT NULL
  AND
  -- Ensure reporter_id matches a profile that belongs to the authenticated user
  reporter_id IN (
    SELECT id FROM profiles 
    WHERE user_id = auth.uid()
  )
);

-- Policy: Allow anyone to view issues (already should exist)
DROP POLICY IF EXISTS "Anyone can view issues" ON issues;
CREATE POLICY "Anyone can view issues"
ON issues FOR SELECT
USING (true);

-- ============================================================================
-- 6. VERIFICATION QUERIES (Optional - run to verify setup)
-- ============================================================================
-- Verify storage bucket exists:
-- SELECT * FROM storage.buckets WHERE id = 'issue-images';

-- Verify user_id column exists:
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'profiles' AND column_name = 'user_id';

-- Verify RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables 
-- WHERE schemaname = 'public' AND tablename IN ('profiles', 'issues');

-- Verify policies exist:
-- SELECT schemaname, tablename, policyname FROM pg_policies 
-- WHERE schemaname IN ('public', 'storage') 
-- AND tablename IN ('profiles', 'issues', 'objects');

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- Your Supabase database is now configured for offline-first sync.
-- The service worker will be able to:
-- 1. Upload images to the 'issue-images' storage bucket
-- 2. Query profiles by user_id to get reporter_id
-- 3. Insert issues with proper authentication
-- 
-- Next steps:
-- 1. Ensure your service worker is registered (done automatically on app load)
-- 2. Test offline report submission
-- 3. Monitor sync status in your app
-- ============================================================================

