-- Add active citizens and average response time to get_issue_statistics function
-- This makes these stats publicly accessible without authentication

CREATE OR REPLACE FUNCTION get_issue_statistics(
    p_lat DECIMAL DEFAULT NULL,
    p_lng DECIMAL DEFAULT NULL,
    p_radius_km INTEGER DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    result JSON;
    total_count INTEGER;
    active_citizens_count INTEGER;
    avg_response_time_hours DECIMAL;
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

    -- Count total active citizens (users with role = 'citizen' in profiles table)
    -- Since profiles table has public read access, we can count citizen users
    SELECT COUNT(*) INTO active_citizens_count
    FROM profiles
    WHERE role = 'citizen' OR role IS NULL; -- Include users with NULL role as citizens (default)

    -- Calculate average response time (in hours) using a comprehensive formula:
    -- Includes both resolved issues (actual resolution time) AND pending/in-progress issues (current waiting time)
    -- This way: faster resolutions decrease the average, delays increase it
    -- Formula: (sum of all response/waiting times) / (total issues)
    SELECT COALESCE(
        (
            -- Sum of resolved times (for resolved/closed issues)
            COALESCE(
                SUM(
                    EXTRACT(EPOCH FROM (
                        COALESCE(resolved_at, updated_at) - created_at
                    )) / 3600
                ) FILTER (
                    WHERE status IN ('resolved', 'closed')
                    AND created_at IS NOT NULL
                    AND (resolved_at IS NOT NULL OR updated_at IS NOT NULL)
                ),
                0
            ) +
            -- Sum of current waiting times (for open/in_progress issues)
            -- This accounts for delays - the longer issues wait, the higher the average
            COALESCE(
                SUM(
                    EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600
                ) FILTER (
                    WHERE status IN ('open', 'in_progress')
                    AND created_at IS NOT NULL
                ),
                0
            )
        ) / GREATEST(
            -- Total count of issues (resolved + pending + in-progress)
            COUNT(*) FILTER (
                WHERE status IN ('resolved', 'closed', 'open', 'in_progress')
                AND created_at IS NOT NULL
            ),
            1
        ),
        0
    ) INTO avg_response_time_hours
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
        'active_citizens', active_citizens_count,
        'avg_response_time_hours', ROUND(avg_response_time_hours, 1),
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

