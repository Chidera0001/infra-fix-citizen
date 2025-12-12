-- Migration: Enable Anonymous Image Uploads
-- This migration adds a policy to allow anonymous users to upload images to the issue-images bucket
-- This is required for anonymous report submissions
-- 
-- Note: RLS is already enabled on storage.objects by Supabase
-- We only need to create the policy

-- Drop the policy if it already exists (to allow re-running this migration)
DROP POLICY IF EXISTS "Anonymous users can upload images" ON storage.objects;

-- Add policy to allow anonymous users to upload images
-- This policy allows anyone (including unauthenticated users) to insert images into the issue-images bucket
CREATE POLICY "Anonymous users can upload images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'issue-images'
);

-- Note: The existing "Public can view images" policy already allows public read access
-- The existing "Authenticated users can upload images" policy remains for authenticated uploads
-- This new policy specifically allows anonymous uploads

-- ============================================================================
-- VERIFICATION QUERIES (Run these to verify the policies are set up correctly)
-- ============================================================================

-- 1. Check all storage policies for issue-images bucket
-- SELECT 
--   policyname,
--   roles,
--   cmd,
--   qual,
--   with_check
-- FROM pg_policies 
-- WHERE schemaname = 'storage' 
--   AND tablename = 'objects'
--   AND (qual::text LIKE '%issue-images%' OR with_check::text LIKE '%issue-images%')
-- ORDER BY policyname;

-- 2. Verify the bucket exists and is public
-- SELECT id, name, public, file_size_limit, allowed_mime_types
-- FROM storage.buckets 
-- WHERE id = 'issue-images';

