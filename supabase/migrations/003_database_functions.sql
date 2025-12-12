-- Function to create or update user profile from Supabase Auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (user_id, email, full_name, user_nickname, role, is_active)
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

-- Function to get issues with filters and pagination
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

-- Function to get issue statistics
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

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_issue_id UUID,
    p_title TEXT,
    p_message TEXT,
    p_type TEXT
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

-- Function to toggle issue upvote
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
