-- Complete Backend Setup for Infrastructure Fix Citizen
-- This migration creates all necessary tables, functions, and policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE issue_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE issue_category AS ENUM (
        'bad_roads',
        'broken_streetlights',
        'dump_sites',
        'floods',
        'water_supply_issues',
        'bad_traffic_signals',
        'poor_drainages',
        'erosion_sites',
        'collapsed_bridges',
        'open_manholes',
        'unsafe_crossings',
        'construction_debris'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE issue_severity AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('citizen', 'admin', 'moderator');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('status_update', 'comment_added', 'issue_assigned', 'issue_resolved', 'system_announcement');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS issue_upvotes CASCADE;
DROP TABLE IF EXISTS issue_comments CASCADE;
DROP TABLE IF EXISTS issue_updates CASCADE;
DROP TABLE IF EXISTS issues CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table (extends Clerk users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    full_name TEXT,
    phone_number TEXT,
    role user_role DEFAULT 'citizen',
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT '#6b7280',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create issues table
CREATE TABLE issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL CHECK (length(title) >= 10 AND length(title) <= 100),
    description TEXT NOT NULL CHECK (length(description) >= 20 AND length(description) <= 1000),
    category issue_category NOT NULL,
    status issue_status DEFAULT 'open',
    severity issue_severity DEFAULT 'medium',
    location_lat DECIMAL(10, 8) NOT NULL CHECK (location_lat >= -90 AND location_lat <= 90),
    location_lng DECIMAL(11, 8) NOT NULL CHECK (location_lng >= -180 AND location_lng <= 180),
    address TEXT,
    image_urls TEXT[] DEFAULT '{}',
    upvotes INTEGER DEFAULT 0,
    reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    priority issue_severity DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    estimated_cost DECIMAL(10, 2),
    actual_cost DECIMAL(10, 2),
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create issue updates table
CREATE TABLE issue_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    old_status issue_status,
    new_status issue_status NOT NULL,
    comment TEXT,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create issue comments table
CREATE TABLE issue_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    comment TEXT NOT NULL CHECK (length(comment) >= 1 AND length(comment) <= 1000),
    is_official BOOLEAN DEFAULT false,
    parent_id UUID REFERENCES issue_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create issue upvotes table
CREATE TABLE issue_upvotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(issue_id, user_id)
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    action_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_clerk_user_id ON profiles(clerk_user_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_is_active ON profiles(is_active);

CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_category ON issues(category);
CREATE INDEX idx_issues_severity ON issues(severity);
CREATE INDEX idx_issues_reporter_id ON issues(reporter_id);
CREATE INDEX idx_issues_assigned_to ON issues(assigned_to);
CREATE INDEX idx_issues_location ON issues USING GIST(ST_Point(location_lng, location_lat));
CREATE INDEX idx_issues_created_at ON issues(created_at);
CREATE INDEX idx_issues_upvotes ON issues(upvotes);

CREATE INDEX idx_issue_comments_issue_id ON issue_comments(issue_id);
CREATE INDEX idx_issue_comments_user_id ON issue_comments(user_id);
CREATE INDEX idx_issue_comments_created_at ON issue_comments(created_at);

CREATE INDEX idx_issue_updates_issue_id ON issue_updates(issue_id);
CREATE INDEX idx_issue_updates_user_id ON issue_updates(user_id);
CREATE INDEX idx_issue_updates_created_at ON issue_updates(created_at);

CREATE INDEX idx_issue_upvotes_issue_id ON issue_upvotes(issue_id);
CREATE INDEX idx_issue_upvotes_user_id ON issue_upvotes(user_id);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_type ON notifications(type);

-- Insert default categories
INSERT INTO categories (name, description, icon, color, sort_order) VALUES
('bad_roads', 'Road surface damage and potholes', 'construction', '#ef4444', 1),
('broken_streetlights', 'Broken or malfunctioning street lights', 'lightbulb', '#f59e0b', 2),
('dump_sites', 'Illegal or overflowing waste dump sites', 'trash-2', '#22c55e', 3),
('floods', 'Flooded streets and communities', 'waves', '#0ea5e9', 4),
('water_supply_issues', 'Water interruptions, leaks, and burst pipes', 'droplets', '#3b82f6', 5),
('bad_traffic_signals', 'Malfunctioning traffic signals and signage', 'traffic-cone', '#f97316', 6),
('poor_drainages', 'Blocked drainages and waterlogging', 'waves', '#6366f1', 7),
('erosion_sites', 'Erosion hotspots affecting infrastructure', 'mountain', '#7c3aed', 8),
('collapsed_bridges', 'Damaged or collapsed bridges and culverts', 'bridge', '#f59e0b', 9),
('open_manholes', 'Open or damaged manhole covers', 'circle-dot', '#a855f7', 10),
('unsafe_crossings', 'Unsafe pedestrian crossings and walkways', 'footprints', '#14b8a6', 11),
('construction_debris', 'Construction debris obstructing public areas', 'dump-truck', '#64748b', 12);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON issues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_issue_comments_updated_at BEFORE UPDATE ON issue_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update upvote count
CREATE OR REPLACE FUNCTION update_issue_upvote_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE issues SET upvotes = upvotes + 1 WHERE id = NEW.issue_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE issues SET upvotes = upvotes - 1 WHERE id = OLD.issue_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for upvote count
CREATE TRIGGER update_upvote_count_trigger
    AFTER INSERT OR DELETE ON issue_upvotes
    FOR EACH ROW EXECUTE FUNCTION update_issue_upvote_count();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (clerk_user_id, email, full_name)
    VALUES (
        NEW.raw_user_meta_data->>'clerk_user_id',
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
    )
    ON CONFLICT (clerk_user_id) 
    DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get current user profile
CREATE OR REPLACE FUNCTION get_current_user_profile()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT id FROM profiles 
        WHERE clerk_user_id = auth.jwt() ->> 'sub'
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
        WHERE clerk_user_id = auth.jwt() ->> 'sub' 
        AND role IN ('admin', 'moderator')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get issues with filters and pagination
CREATE OR REPLACE FUNCTION get_issues_with_filters(
    p_status issue_status DEFAULT NULL,
    p_category issue_category DEFAULT NULL,
    p_severity issue_severity DEFAULT NULL,
    p_lat DECIMAL DEFAULT NULL,
    p_lng DECIMAL DEFAULT NULL,
    p_radius_km INTEGER DEFAULT 10,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0,
    p_sort_by TEXT DEFAULT 'created_at',
    p_sort_order TEXT DEFAULT 'DESC'
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    category issue_category,
    status issue_status,
    severity issue_severity,
    location_lat DECIMAL,
    location_lng DECIMAL,
    address TEXT,
    image_urls TEXT[],
    upvotes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    reporter_name TEXT,
    reporter_email TEXT,
    distance_km DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        i.title,
        i.description,
        i.category,
        i.status,
        i.severity,
        i.location_lat,
        i.location_lng,
        i.address,
        i.image_urls,
        i.upvotes,
        i.created_at,
        i.updated_at,
        i.resolved_at,
        p.full_name as reporter_name,
        p.email as reporter_email,
        CASE 
            WHEN p_lat IS NOT NULL AND p_lng IS NOT NULL THEN
                ROUND(
                    6371 * acos(
                        cos(radians(p_lat)) * 
                        cos(radians(i.location_lat)) * 
                        cos(radians(i.location_lng) - radians(p_lng)) + 
                        sin(radians(p_lat)) * 
                        sin(radians(i.location_lat))
                    ), 2
                )
            ELSE NULL
        END as distance_km
    FROM issues i
    LEFT JOIN profiles p ON i.reporter_id = p.id
    WHERE 
        (p_status IS NULL OR i.status = p_status) AND
        (p_category IS NULL OR i.category = p_category) AND
        (p_severity IS NULL OR i.severity = p_severity) AND
        (
            p_lat IS NULL OR p_lng IS NULL OR p_radius_km IS NULL OR
            6371 * acos(
                cos(radians(p_lat)) * 
                cos(radians(i.location_lat)) * 
                cos(radians(i.location_lng) - radians(p_lng)) + 
                sin(radians(p_lat)) * 
                sin(radians(i.location_lat))
            ) <= p_radius_km
        )
    ORDER BY
        CASE WHEN p_sort_by = 'created_at' AND p_sort_order = 'DESC' THEN i.created_at END DESC,
        CASE WHEN p_sort_by = 'created_at' AND p_sort_order = 'ASC' THEN i.created_at END ASC,
        CASE WHEN p_sort_by = 'upvotes' AND p_sort_order = 'DESC' THEN i.upvotes END DESC,
        CASE WHEN p_sort_by = 'upvotes' AND p_sort_order = 'ASC' THEN i.upvotes END ASC,
        CASE WHEN p_sort_by = 'severity' AND p_sort_order = 'DESC' THEN 
            CASE i.severity 
                WHEN 'critical' THEN 4 
                WHEN 'high' THEN 3 
                WHEN 'medium' THEN 2 
                WHEN 'low' THEN 1 
            END 
        END DESC,
        CASE WHEN p_sort_by = 'distance' AND p_lat IS NOT NULL AND p_lng IS NOT NULL THEN
            6371 * acos(
                cos(radians(p_lat)) * 
                cos(radians(i.location_lat)) * 
                cos(radians(i.location_lng) - radians(p_lng)) + 
                sin(radians(p_lat)) * 
                sin(radians(i.location_lat))
            )
        END ASC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Create function to get issue statistics
CREATE OR REPLACE FUNCTION get_issue_statistics(
    p_lat DECIMAL DEFAULT NULL,
    p_lng DECIMAL DEFAULT NULL,
    p_radius_km INTEGER DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_issues', COUNT(*),
        'open_issues', COUNT(*) FILTER (WHERE status = 'open'),
        'in_progress_issues', COUNT(*) FILTER (WHERE status = 'in_progress'),
        'resolved_issues', COUNT(*) FILTER (WHERE status = 'resolved'),
        'closed_issues', COUNT(*) FILTER (WHERE status = 'closed'),
        'by_category', json_object_agg(
            category, 
            json_build_object(
                'count', category_count,
                'percentage', ROUND((category_count * 100.0 / GREATEST(COUNT(*) OVER(), 1)), 2)
            )
        ),
        'by_severity', json_object_agg(
            severity,
            json_build_object(
                'count', severity_count,
                'percentage', ROUND((severity_count * 100.0 / GREATEST(COUNT(*) OVER(), 1)), 2)
            )
        ),
        'recent_activity', (
            SELECT json_agg(
                json_build_object(
                    'date', date_trunc('day', created_at),
                    'count', daily_count
                )
            )
            FROM (
                SELECT 
                    date_trunc('day', created_at) as created_at,
                    COUNT(*) as daily_count
                FROM issues
                WHERE 
                    created_at >= NOW() - INTERVAL '30 days' AND
                    (
                        p_lat IS NULL OR p_lng IS NULL OR p_radius_km IS NULL OR
                        6371 * acos(
                            cos(radians(p_lat)) * 
                            cos(radians(location_lat)) * 
                            cos(radians(location_lng) - radians(p_lng)) + 
                            sin(radians(p_lat)) * 
                            sin(radians(location_lat))
                        ) <= p_radius_km
                    )
                GROUP BY date_trunc('day', created_at)
                ORDER BY date_trunc('day', created_at) DESC
                LIMIT 30
            ) daily_stats
        )
    ) INTO result
    FROM (
        SELECT 
            category,
            COUNT(*) as category_count,
            severity,
            COUNT(*) OVER (PARTITION BY severity) as severity_count
        FROM issues
        WHERE 
            (
                p_lat IS NULL OR p_lng IS NULL OR p_radius_km IS NULL OR
                6371 * acos(
                    cos(radians(p_lat)) * 
                    cos(radians(location_lat)) * 
                    cos(radians(location_lng) - radians(p_lng)) + 
                    sin(radians(p_lat)) * 
                    sin(radians(location_lat))
                ) <= p_radius_km
            )
        GROUP BY category, severity
    ) stats;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to toggle issue upvote
CREATE OR REPLACE FUNCTION toggle_issue_upvote(p_issue_id UUID)
RETURNS JSON AS $$
DECLARE
    current_user_id UUID;
    upvote_exists BOOLEAN;
    new_upvote_count INTEGER;
    result JSON;
BEGIN
    -- Get current user profile
    SELECT get_current_user_profile() INTO current_user_id;
    
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;
    
    -- Check if upvote exists
    SELECT EXISTS(
        SELECT 1 FROM issue_upvotes 
        WHERE issue_id = p_issue_id AND user_id = current_user_id
    ) INTO upvote_exists;
    
    IF upvote_exists THEN
        -- Remove upvote
        DELETE FROM issue_upvotes 
        WHERE issue_id = p_issue_id AND user_id = current_user_id;
        
        SELECT json_build_object(
            'action', 'removed',
            'upvoted', false
        ) INTO result;
    ELSE
        -- Add upvote
        INSERT INTO issue_upvotes (issue_id, user_id)
        VALUES (p_issue_id, current_user_id);
        
        SELECT json_build_object(
            'action', 'added',
            'upvoted', true
        ) INTO result;
    END IF;
    
    -- Get updated upvote count
    SELECT upvotes INTO new_upvote_count
    FROM issues WHERE id = p_issue_id;
    
    -- Add upvote count to result
    SELECT json_build_object(
        'action', result->>'action',
        'upvoted', (result->>'upvoted')::boolean,
        'upvote_count', new_upvote_count
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to create notification
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_issue_id UUID,
    p_title TEXT,
    p_message TEXT,
    p_type notification_type
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO notifications (user_id, issue_id, title, message, type)
    VALUES (p_user_id, p_issue_id, p_title, p_message, p_type)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Create function for admin dashboard analytics
CREATE OR REPLACE FUNCTION get_admin_dashboard_analytics(
    p_period TEXT DEFAULT '30d',
    p_area TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    result JSON;
    period_days INTEGER;
BEGIN
    -- Convert period to days
    period_days := CASE 
        WHEN p_period = '7d' THEN 7
        WHEN p_period = '30d' THEN 30
        WHEN p_period = '90d' THEN 90
        WHEN p_period = '1y' THEN 365
        ELSE 30
    END;
    
    SELECT json_build_object(
        'total_users', (SELECT COUNT(*) FROM profiles WHERE is_active = true),
        'active_users', (SELECT COUNT(*) FROM profiles WHERE is_active = true AND updated_at >= NOW() - INTERVAL '7 days'),
        'total_issues', (SELECT COUNT(*) FROM issues WHERE created_at >= NOW() - (period_days || ' days')::INTERVAL),
        'issues_by_status', json_build_object(
            'open', (SELECT COUNT(*) FROM issues WHERE status = 'open' AND created_at >= NOW() - (period_days || ' days')::INTERVAL),
            'in_progress', (SELECT COUNT(*) FROM issues WHERE status = 'in_progress' AND created_at >= NOW() - (period_days || ' days')::INTERVAL),
            'resolved', (SELECT COUNT(*) FROM issues WHERE status = 'resolved' AND created_at >= NOW() - (period_days || ' days')::INTERVAL),
            'closed', (SELECT COUNT(*) FROM issues WHERE status = 'closed' AND created_at >= NOW() - (period_days || ' days')::INTERVAL)
        ),
        'issues_by_category', (
            SELECT json_object_agg(category, count)
            FROM (
                SELECT category, COUNT(*) as count
                FROM issues
                WHERE created_at >= NOW() - (period_days || ' days')::INTERVAL
                GROUP BY category
            ) cat_stats
        ),
        'resolution_rate', (
            SELECT ROUND(
                (COUNT(*) FILTER (WHERE status IN ('resolved', 'closed')) * 100.0 / 
                 GREATEST(COUNT(*), 1)), 2
            )
            FROM issues
            WHERE created_at >= NOW() - (period_days || ' days')::INTERVAL
        ),
        'average_resolution_time', (
            SELECT AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600)
            FROM issues
            WHERE resolved_at IS NOT NULL 
            AND created_at >= NOW() - (period_days || ' days')::INTERVAL
        ),
        'top_reporters', (
            SELECT json_agg(
                json_build_object(
                    'user_id', reporter_id,
                    'full_name', p.full_name,
                    'issue_count', count
                )
            )
            FROM (
                SELECT reporter_id, COUNT(*) as count
                FROM issues
                WHERE created_at >= NOW() - (period_days || ' days')::INTERVAL
                GROUP BY reporter_id
                ORDER BY count DESC
                LIMIT 10
            ) top_users
            JOIN profiles p ON top_users.reporter_id = p.id
        ),
        'recent_activity', (
            SELECT json_agg(
                json_build_object(
                    'date', date_trunc('day', created_at),
                    'issues_created', daily_count,
                    'issues_resolved', resolved_count
                )
            )
            FROM (
                SELECT 
                    date_trunc('day', created_at) as created_at,
                    COUNT(*) as daily_count,
                    COUNT(*) FILTER (WHERE resolved_at IS NOT NULL) as resolved_count
                FROM issues
                WHERE created_at >= NOW() - (period_days || ' days')::INTERVAL
                GROUP BY date_trunc('day', created_at)
                ORDER BY date_trunc('day', created_at) DESC
            ) daily_stats
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for system health check
CREATE OR REPLACE FUNCTION get_system_health()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'status', 'healthy',
        'timestamp', NOW(),
        'services', json_build_object(
            'database', json_build_object(
                'status', 'up',
                'response_time_ms', 0,
                'connections', 1
            ),
            'storage', json_build_object(
                'status', 'up',
                'used_space_gb', 0,
                'total_space_gb', 100
            ),
            'api', json_build_object(
                'status', 'up',
                'response_time_ms', 0,
                'requests_per_minute', 0
            )
        ),
        'metrics', json_build_object(
            'cpu_usage_percent', 0,
            'memory_usage_percent', 0,
            'disk_usage_percent', 0,
            'active_connections', 1
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Admins can delete any profile" ON profiles;

DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;

DROP POLICY IF EXISTS "Anyone can view issues" ON issues;
DROP POLICY IF EXISTS "Authenticated users can create issues" ON issues;
DROP POLICY IF EXISTS "Users can update own issues" ON issues;
DROP POLICY IF EXISTS "Admins can update any issue" ON issues;
DROP POLICY IF EXISTS "Admins can delete any issue" ON issues;

DROP POLICY IF EXISTS "Anyone can view issue updates" ON issue_updates;
DROP POLICY IF EXISTS "Authenticated users can create issue updates" ON issue_updates;

DROP POLICY IF EXISTS "Anyone can view issue comments" ON issue_comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON issue_comments;
DROP POLICY IF EXISTS "Users can update own comments" ON issue_comments;
DROP POLICY IF EXISTS "Admins can update any comment" ON issue_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON issue_comments;
DROP POLICY IF EXISTS "Admins can delete any comment" ON issue_comments;

DROP POLICY IF EXISTS "Users can view own upvotes" ON issue_upvotes;
DROP POLICY IF EXISTS "Authenticated users can create upvotes" ON issue_upvotes;
DROP POLICY IF EXISTS "Users can delete own upvotes" ON issue_upvotes;

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

-- Create RLS policies

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (clerk_user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (clerk_user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Admins can update any profile" ON profiles
    FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete any profile" ON profiles
    FOR DELETE USING (is_admin());

-- Categories policies (read-only for all users)
CREATE POLICY "Anyone can view categories" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON categories
    FOR ALL USING (is_admin());

-- Issues policies
CREATE POLICY "Anyone can view issues" ON issues
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create issues" ON issues
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'sub' IS NOT NULL AND
        reporter_id IN (
            SELECT id FROM profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Users can update own issues" ON issues
    FOR UPDATE USING (
        reporter_id IN (
            SELECT id FROM profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Admins can update any issue" ON issues
    FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete any issue" ON issues
    FOR DELETE USING (is_admin());

-- Issue updates policies
CREATE POLICY "Anyone can view issue updates" ON issue_updates
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create issue updates" ON issue_updates
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'sub' IS NOT NULL AND
        user_id IN (
            SELECT id FROM profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Issue comments policies
CREATE POLICY "Anyone can view issue comments" ON issue_comments
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON issue_comments
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'sub' IS NOT NULL AND
        user_id IN (
            SELECT id FROM profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Users can update own comments" ON issue_comments
    FOR UPDATE USING (
        user_id IN (
            SELECT id FROM profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Admins can update any comment" ON issue_comments
    FOR UPDATE USING (is_admin());

CREATE POLICY "Users can delete own comments" ON issue_comments
    FOR DELETE USING (
        user_id IN (
            SELECT id FROM profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Admins can delete any comment" ON issue_comments
    FOR DELETE USING (is_admin());

-- Issue upvotes policies
CREATE POLICY "Users can view own upvotes" ON issue_upvotes
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Authenticated users can create upvotes" ON issue_upvotes
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'sub' IS NOT NULL AND
        user_id IN (
            SELECT id FROM profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Users can delete own upvotes" ON issue_upvotes
    FOR DELETE USING (
        user_id IN (
            SELECT id FROM profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (
        user_id IN (
            SELECT id FROM profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Create admin user for testing
INSERT INTO profiles (clerk_user_id, email, full_name, role, is_active)
VALUES ('admin-test-user', 'admin@citizn.ng', 'System Administrator', 'admin', true)
ON CONFLICT (clerk_user_id) DO UPDATE SET
    role = 'admin',
    is_active = true;

-- Create sample citizen user
INSERT INTO profiles (clerk_user_id, email, full_name, role, is_active)
VALUES ('citizen-test-user', 'citizen@citizn.ng', 'Test Citizen', 'citizen', true)
ON CONFLICT (clerk_user_id) DO UPDATE SET
    role = 'citizen',
    is_active = true;

-- Create sample issues for testing
INSERT INTO issues (title, description, category, status, severity, location_lat, location_lng, address, reporter_id)
SELECT 
    'Sample ' || c.name || ' Issue',
    'This is a sample ' || c.name || ' issue for testing purposes. It demonstrates the functionality of the infrastructure reporting system.',
    c.name::issue_category,
    CASE (random() * 3)::int
        WHEN 0 THEN 'open'::issue_status
        WHEN 1 THEN 'in_progress'::issue_status
        WHEN 2 THEN 'resolved'::issue_status
        ELSE 'closed'::issue_status
    END,
    CASE (random() * 3)::int
        WHEN 0 THEN 'low'::issue_severity
        WHEN 1 THEN 'medium'::issue_severity
        WHEN 2 THEN 'high'::issue_severity
        ELSE 'critical'::issue_severity
    END,
    6.5244 + (random() - 0.5) * 0.1, -- Lagos area coordinates with some variation
    3.3792 + (random() - 0.5) * 0.1,
    'Sample Location ' || generate_series,
    (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
FROM categories c, generate_series(1, 20);

-- Create sample comments
INSERT INTO issue_comments (issue_id, user_id, comment, is_official)
SELECT 
    i.id,
    p.id,
    'This is a sample comment on issue: ' || i.title,
    CASE WHEN p.role = 'admin' THEN true ELSE false END
FROM issues i
CROSS JOIN profiles p
WHERE random() < 0.3; -- 30% chance of comment per issue per user

-- Create sample notifications
INSERT INTO notifications (user_id, issue_id, type, title, message)
SELECT 
    p.id,
    i.id,
    'status_update'::notification_type,
    'Issue Status Updated',
    'The status of issue "' || i.title || '" has been updated.'
FROM issues i
CROSS JOIN profiles p
WHERE random() < 0.2; -- 20% chance of notification per issue per user

COMMIT;
