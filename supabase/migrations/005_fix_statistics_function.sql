-- Fix the get_issue_statistics function
CREATE OR REPLACE FUNCTION get_issue_statistics(
    p_lat DECIMAL DEFAULT NULL,
    p_lng DECIMAL DEFAULT NULL,
    p_radius_km INTEGER DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    result JSON;
    total_count INTEGER;
BEGIN
    -- Get total count first
    SELECT COUNT(*) INTO total_count
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
        );

    -- Build the result JSON
    SELECT json_build_object(
        'total_issues', total_count,
        'open_issues', COUNT(*) FILTER (WHERE status = 'open'),
        'in_progress_issues', COUNT(*) FILTER (WHERE status = 'in_progress'),
        'resolved_issues', COUNT(*) FILTER (WHERE status = 'resolved'),
        'closed_issues', COUNT(*) FILTER (WHERE status = 'closed'),
        'by_category', COALESCE(
            (SELECT json_object_agg(category, json_build_object(
                'count', count,
                'percentage', ROUND((count * 100.0 / GREATEST(total_count, 1)), 2)
            ))
            FROM (
                SELECT category, COUNT(*) as count
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
                GROUP BY category
            ) cat_stats), '{}'::json
        ),
        'by_severity', COALESCE(
            (SELECT json_object_agg(severity, json_build_object(
                'count', count,
                'percentage', ROUND((count * 100.0 / GREATEST(total_count, 1)), 2)
            ))
            FROM (
                SELECT severity, COUNT(*) as count
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
                GROUP BY severity
            ) sev_stats), '{}'::json
        ),
        'recent_activity', COALESCE(
            (SELECT json_agg(
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
            ) daily_stats), '[]'::json
        )
    ) INTO result
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
        );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;
