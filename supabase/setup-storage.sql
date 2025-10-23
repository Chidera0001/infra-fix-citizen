-- ============================================================================
-- STORAGE BUCKET SETUP FOR ISSUE IMAGES
-- ============================================================================
-- This script sets up the storage bucket and policies for storing issue images
-- 
-- IMPORTANT: Run this in your Supabase SQL Editor
-- Location: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new
-- 
-- File Size Limit: 4MB per image (enforced at application level)
-- Max Images: 5 per report (enforced at application level)
-- ============================================================================

-- Create storage bucket for issue images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'issue-images', 
  'issue-images', 
  true,  -- Public bucket (images are publicly viewable)
  4194304,  -- 4MB file size limit (4 * 1024 * 1024 bytes)
  ARRAY['image/jpeg', 'image/png', 'image/webp']  -- Allowed file types
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 4194304,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Set up storage policies for issue images bucket
-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

-- Policy 1: Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'issue-images'
);

-- Policy 2: Allow public read access to images
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'issue-images');

-- Policy 3: Allow users to update their own uploaded images
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'issue-images' AND auth.uid() = owner);

-- Policy 4: Allow users to delete their own uploaded images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'issue-images' AND auth.uid() = owner);

-- ============================================================================
-- VERIFICATION QUERY (Optional - run after setup)
-- ============================================================================
-- SELECT * FROM storage.buckets WHERE id = 'issue-images';
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

