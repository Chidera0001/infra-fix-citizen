-- ============================================================================
-- COMPREHENSIVE MIGRATION: Fix user_id usage and remove clerk_user_id dependencies
-- ============================================================================
-- This script:
-- 1. Ensures user_id has UNIQUE constraint
-- 2. Updates handle_new_user() to use user_id
-- 3. Updates get_current_user_profile() to use user_id
-- 4. Updates is_admin() to use user_id
-- 5. Updates ALL RLS policies to use user_id instead of clerk_user_id
-- 6. Creates trigger for auto-profile creation
-- ============================================================================

-- Step 1: Ensure user_id column exists and has UNIQUE constraint
DO $$
BEGIN
    -- Add user_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE profiles ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

    -- Create unique constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conrelid = 'profiles'::regclass 
        AND conname = 'profiles_user_id_unique'
    ) THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
    END IF;

    -- Create index if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'profiles' AND indexname = 'idx_profiles_user_id'
    ) THEN
        CREATE INDEX idx_profiles_user_id ON profiles(user_id);
    END IF;
END $$;

-- Step 2: Update handle_new_user() function to use user_id
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create profile if it doesn't already exist
    -- This prevents conflicts with manual profile creation in frontend
    INSERT INTO profiles (
        user_id,
        email,
        full_name,
        user_nickname,
        role,
        is_active
    )
    VALUES (
        NEW.id,  -- Use auth.users.id as user_id
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            'User'
        ),
        NEW.raw_user_meta_data->>'user_nickname',
        'citizen',
        true
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        user_nickname = COALESCE(EXCLUDED.user_nickname, profiles.user_nickname),
        updated_at = NOW();
    
    RETURN NEW;
EXCEPTION
    WHEN others THEN
        -- Log error but don't fail the transaction
        -- This prevents signup from failing if profile creation has issues
        RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Update get_current_user_profile() to use user_id
CREATE OR REPLACE FUNCTION get_current_user_profile()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT id FROM profiles 
        WHERE user_id = auth.uid()  -- Use auth.uid() instead of clerk_user_id
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Update is_admin() to use user_id
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid()  -- Use auth.uid() instead of clerk_user_id
        AND role IN ('admin', 'moderator')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Drop and recreate RLS policies to use user_id
-- Drop existing policies that reference clerk_user_id
DROP POLICY IF EXISTS "Authenticated users can create issues" ON issues;
DROP POLICY IF EXISTS "Users can update own issues" ON issues;
DROP POLICY IF EXISTS "Authenticated users can create issue updates" ON issue_updates;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON issue_comments;
DROP POLICY IF EXISTS "Users can update own comments" ON issue_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON issue_comments;
DROP POLICY IF EXISTS "Users can view own upvotes" ON issue_upvotes;
DROP POLICY IF EXISTS "Authenticated users can create upvotes" ON issue_upvotes;
DROP POLICY IF EXISTS "Users can delete own upvotes" ON issue_upvotes;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

-- Recreate policies using user_id (profiles policies are already correct, but we'll ensure they're right)
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Profiles policies (using user_id)
-- Note: "Users can view all profiles" policy should already exist and doesn't need updating
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Issues policies (using user_id)
CREATE POLICY "Authenticated users can create issues" ON issues
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND
        reporter_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own issues" ON issues
    FOR UPDATE USING (
        reporter_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

-- Issue updates policies (using user_id)
CREATE POLICY "Authenticated users can create issue updates" ON issue_updates
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND
        user_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

-- Issue comments policies (using user_id)
CREATE POLICY "Authenticated users can create comments" ON issue_comments
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND
        user_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own comments" ON issue_comments
    FOR UPDATE USING (
        user_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own comments" ON issue_comments
    FOR DELETE USING (
        user_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

-- Issue upvotes policies (using user_id)
CREATE POLICY "Users can view own upvotes" ON issue_upvotes
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Authenticated users can create upvotes" ON issue_upvotes
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND
        user_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own upvotes" ON issue_upvotes
    FOR DELETE USING (
        user_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

-- Notifications policies (using user_id)
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (
        user_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

-- Step 6: Create trigger for auto-profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- VERIFICATION QUERIES (Optional - run these to verify setup)
-- ============================================================================
-- Check unique constraint:
-- SELECT conname, contype FROM pg_constraint 
-- WHERE conrelid = 'profiles'::regclass AND conname = 'profiles_user_id_unique';

-- Check trigger:
-- SELECT trigger_name, event_manipulation, event_object_table 
-- FROM information_schema.triggers 
-- WHERE trigger_name = 'on_auth_user_created';

-- Check function definitions:
-- SELECT proname, prosrc FROM pg_proc 
-- WHERE proname IN ('handle_new_user', 'get_current_user_profile', 'is_admin');

-- Check policies:
-- SELECT schemaname, tablename, policyname, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename IN ('profiles', 'issues', 'issue_comments', 'issue_updates', 'issue_upvotes', 'notifications')
-- ORDER BY tablename, policyname;
-- ============================================================================

