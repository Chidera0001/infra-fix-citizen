-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Categories policies (read-only for all users)
CREATE POLICY "Anyone can view categories" ON categories
    FOR SELECT USING (true);

-- Issues policies
CREATE POLICY "Anyone can view issues" ON issues
    FOR SELECT USING (true);

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

CREATE POLICY "Admins can update any issue" ON issues
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'moderator')
        )
    );

-- Issue updates policies
CREATE POLICY "Anyone can view issue updates" ON issue_updates
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create issue updates" ON issue_updates
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND
        user_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

-- Issue upvotes policies
CREATE POLICY "Anyone can view issue upvotes" ON issue_upvotes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage own upvotes" ON issue_upvotes
    FOR ALL USING (
        user_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

-- Issue comments policies
CREATE POLICY "Anyone can view issue comments" ON issue_comments
    FOR SELECT USING (true);

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

-- Notifications policies
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

-- Create function to get current user profile
CREATE OR REPLACE FUNCTION get_current_user_profile()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT id FROM profiles 
        WHERE user_id = auth.uid()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() 
        AND role IN ('admin', 'moderator')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
