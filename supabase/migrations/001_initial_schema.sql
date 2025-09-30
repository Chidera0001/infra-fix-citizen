-- Create custom types
CREATE TYPE issue_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE issue_category AS ENUM ('pothole', 'street_lighting', 'water_supply', 'traffic_signal', 'drainage', 'sidewalk', 'other');
CREATE TYPE issue_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE user_role AS ENUM ('citizen', 'admin', 'moderator');

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, description, icon, color) VALUES
('pothole', 'Road potholes and surface damage', 'construction', '#ef4444'),
('street_lighting', 'Broken or malfunctioning street lights', 'lightbulb', '#f59e0b'),
('water_supply', 'Water supply disruptions and leaks', 'droplets', '#3b82f6'),
('traffic_signal', 'Malfunctioning traffic lights and signals', 'traffic-light', '#10b981'),
('drainage', 'Blocked drains and flooding issues', 'waves', '#6366f1'),
('sidewalk', 'Sidewalk damage and accessibility issues', 'footprints', '#8b5cf6'),
('other', 'Other infrastructure issues', 'alert-triangle', '#6b7280');

-- Create issues table
CREATE TABLE issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category issue_category NOT NULL,
    status issue_status DEFAULT 'open',
    severity issue_severity DEFAULT 'medium',
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lng DECIMAL(11, 8) NOT NULL,
    address TEXT,
    image_urls TEXT[] DEFAULT '{}',
    reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    -- Add spatial index for location queries
    CONSTRAINT valid_coordinates CHECK (
        location_lat >= -90 AND location_lat <= 90 AND
        location_lng >= -180 AND location_lng <= 180
    )
);

-- Create issue_updates table for tracking status changes
CREATE TABLE issue_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    old_status issue_status,
    new_status issue_status NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create upvotes table for citizen support
CREATE TABLE issue_upvotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one upvote per user per issue
    UNIQUE(issue_id, user_id)
);

-- Create comments table
CREATE TABLE issue_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    comment TEXT NOT NULL,
    is_official BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'status_update', 'comment', 'upvote', etc.
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_category ON issues(category);
CREATE INDEX idx_issues_reporter ON issues(reporter_id);
CREATE INDEX idx_issues_location ON issues(location_lat, location_lng);
CREATE INDEX idx_issues_created_at ON issues(created_at DESC);
CREATE INDEX idx_issue_updates_issue_id ON issue_updates(issue_id);
CREATE INDEX idx_issue_upvotes_issue_id ON issue_upvotes(issue_id);
CREATE INDEX idx_issue_comments_issue_id ON issue_comments(issue_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON issues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_issue_comments_updated_at BEFORE UPDATE ON issue_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update issue upvote count
CREATE OR REPLACE FUNCTION update_issue_upvotes()
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
$$ language 'plpgsql';

-- Add upvote trigger
CREATE TRIGGER trigger_update_issue_upvotes
    AFTER INSERT OR DELETE ON issue_upvotes
    FOR EACH ROW EXECUTE FUNCTION update_issue_upvotes();

-- Create function to auto-update resolved_at timestamp
CREATE OR REPLACE FUNCTION update_resolved_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
        NEW.resolved_at = NOW();
    ELSIF NEW.status != 'resolved' AND OLD.status = 'resolved' THEN
        NEW.resolved_at = NULL;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add resolved_at trigger
CREATE TRIGGER trigger_update_resolved_at
    BEFORE UPDATE ON issues
    FOR EACH ROW EXECUTE FUNCTION update_resolved_at();
