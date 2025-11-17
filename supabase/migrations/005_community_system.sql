-- Migration: Community System with Duplicate Detection and Upvoting
-- Description: Adds functions for checking duplicate issues and fetching community issues

-- Drop the old function first to allow return type changes
DROP FUNCTION IF EXISTS check_duplicate_issue(issue_category, DECIMAL, DECIMAL);

-- Function to check for duplicate issues within 50 meters
CREATE OR REPLACE FUNCTION check_duplicate_issue(
    p_category issue_category,
    p_lat DECIMAL,
    p_lng DECIMAL
)
RETURNS TABLE (
    issue_id UUID,
    title TEXT,
    description TEXT,
    address TEXT,
    image_urls TEXT[],
    upvotes INTEGER,
    distance_meters DECIMAL,
    reporter_id UUID,
    reporter_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id as issue_id,
        i.title,
        i.description,
        i.address,
        i.image_urls,
        i.upvotes,
        ROUND(
            ST_Distance(
                ST_GeographyFromText('POINT(' || p_lng || ' ' || p_lat || ')'),
                ST_GeographyFromText('POINT(' || i.location_lng || ' ' || i.location_lat || ')')
            )::numeric
        ) as distance_meters,
        i.reporter_id,
        p.full_name as reporter_name,
        i.created_at
    FROM issues i
    LEFT JOIN profiles p ON i.reporter_id = p.id
    WHERE 
        i.category = p_category
        AND i.status IN ('open', 'in_progress')
        AND ST_DWithin(
            ST_GeographyFromText('POINT(' || p_lng || ' ' || p_lat || ')'),
            ST_GeographyFromText('POINT(' || i.location_lng || ' ' || i.location_lat || ')'),
            50
        )
    ORDER BY distance_meters ASC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the old function first (if it exists with different parameters)
DROP FUNCTION IF EXISTS get_community_issues(DECIMAL, DECIMAL, DECIMAL, issue_category, issue_status, TEXT, INTEGER, INTEGER);

-- Function to get community issues with filters
CREATE OR REPLACE FUNCTION get_community_issues(
    p_lat DECIMAL,
    p_lng DECIMAL,
    p_radius_km DECIMAL DEFAULT 5,
    p_category issue_category DEFAULT NULL,
    p_status issue_status DEFAULT NULL,
    p_sort_by TEXT DEFAULT 'upvotes',
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0,
    p_exclude_own_issues BOOLEAN DEFAULT TRUE
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
    reporter_name TEXT,
    reporter_email TEXT,
    distance_km DECIMAL,
    user_has_upvoted BOOLEAN
) AS $$
DECLARE
    current_user_id UUID;
BEGIN
    -- Get current user profile
    SELECT get_current_user_profile() INTO current_user_id;
    
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
        p.full_name as reporter_name,
        p.email as reporter_email,
        ROUND(
            (ST_Distance(
                ST_GeographyFromText('POINT(' || p_lng || ' ' || p_lat || ')'),
                ST_GeographyFromText('POINT(' || i.location_lng || ' ' || i.location_lat || ')')
            ) / 1000)::numeric, 2
        ) as distance_km,
        EXISTS(
            SELECT 1 FROM issue_upvotes 
            WHERE issue_id = i.id AND user_id = current_user_id
        ) as user_has_upvoted
    FROM issues i
    LEFT JOIN profiles p ON i.reporter_id = p.id
    WHERE 
        ST_DWithin(
            ST_GeographyFromText('POINT(' || p_lng || ' ' || p_lat || ')'),
            ST_GeographyFromText('POINT(' || i.location_lng || ' ' || i.location_lat || ')'),
            p_radius_km * 1000
        )
        AND (p_category IS NULL OR i.category = p_category)
        AND (p_status IS NULL OR i.status = p_status)
        AND (NOT p_exclude_own_issues OR i.reporter_id != current_user_id)
    ORDER BY 
        CASE 
            WHEN p_sort_by = 'upvotes' THEN i.upvotes
            WHEN p_sort_by = 'distance' THEN ROUND((ST_Distance(
                ST_GeographyFromText('POINT(' || p_lng || ' ' || p_lat || ')'),
                ST_GeographyFromText('POINT(' || i.location_lng || ' ' || i.location_lat || ')')
            ) / 1000)::numeric, 2)::integer
            ELSE 0
        END DESC,
        CASE WHEN p_sort_by = 'recent' THEN i.created_at END DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create index for better performance on distance queries
CREATE INDEX IF NOT EXISTS idx_issues_category_status ON issues(category, status);

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION check_duplicate_issue TO authenticated;
GRANT EXECUTE ON FUNCTION get_community_issues TO authenticated;

