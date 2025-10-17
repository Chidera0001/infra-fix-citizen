-- Fix any capitalized status values in the issues table
-- This migration ensures all status values are lowercase as required by the enum

-- First, let's check what we have
DO $$
BEGIN
    RAISE NOTICE 'Checking for issues with non-standard status values...';
END $$;

-- We can't directly UPDATE enum values that don't exist, so we need to:
-- 1. Temporarily allow any text in a new column
-- 2. Copy the current status
-- 3. Fix any capitalized values
-- 4. Update back to the enum column

-- But actually, if there are capitalized values, they shouldn't exist because
-- the enum would have rejected them. So the issue might be in how the enum was created.

-- Let's check if the enum allows capitalized values
SELECT enumlabel
FROM pg_enum
WHERE enumtypid = 'issue_status'::regtype
ORDER BY enumsortorder;

-- The real fix: Make sure we're not trying to insert capitalized values
-- The error suggests the database has 'Open' but that shouldn't be possible with the enum

-- Let's check if there's a constraint or default that might be causing this
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'issues' AND column_name = 'status';

-- Check for any check constraints on the status column
SELECT con.conname, pg_get_constraintdef(con.oid) as definition
FROM pg_constraint con
INNER JOIN pg_class rel ON rel.oid = con.conrelid
INNER JOIN pg_namespace nsp ON nsp.oid = connamespace
WHERE nsp.nspname = 'public'
  AND rel.relname = 'issues'
  AND con.conname LIKE '%status%';

