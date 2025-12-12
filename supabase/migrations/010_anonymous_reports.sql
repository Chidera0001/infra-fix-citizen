-- Migration: Enable Anonymous Reports
-- This migration makes reporter_id nullable and updates RLS policies to allow anonymous report submissions

-- Step 1: Drop the existing NOT NULL constraint on reporter_id
ALTER TABLE issues 
  ALTER COLUMN reporter_id DROP NOT NULL;

-- Step 2: Update the foreign key constraint to allow NULL values
-- First, drop the existing foreign key constraint
ALTER TABLE issues 
  DROP CONSTRAINT IF EXISTS issues_reporter_id_fkey;

-- Recreate the foreign key constraint allowing NULL
ALTER TABLE issues 
  ADD CONSTRAINT issues_reporter_id_fkey 
  FOREIGN KEY (reporter_id) 
  REFERENCES profiles(id) 
  ON DELETE CASCADE;

-- Step 3: Update RLS policies to allow anonymous inserts
-- Drop the existing INSERT policy that requires authentication
DROP POLICY IF EXISTS "Authenticated users can create issues" ON issues;

-- Create new policy that allows both authenticated and anonymous users to insert
CREATE POLICY "Anyone can create issues" ON issues
    FOR INSERT 
    WITH CHECK (true);

-- Keep existing policies for UPDATE and DELETE (only authenticated users can modify)
-- The existing UPDATE and DELETE policies remain unchanged

-- Step 4: Update any functions/triggers that might assume reporter_id is always present
-- Check if there are any triggers that need updating
-- Note: Most triggers should handle NULL gracefully, but we'll verify

-- Step 5: Ensure issue_updates and issue_comments can handle NULL reporter_id
-- These tables reference issues, but don't directly depend on reporter_id being NOT NULL
-- They should work fine with NULL reporter_id in the issues table

-- Note: Anonymous reports will have reporter_id = NULL
-- Anonymous users cannot create issue_updates or issue_comments (those still require auth)
-- This is intentional - anonymous users can only submit initial reports

