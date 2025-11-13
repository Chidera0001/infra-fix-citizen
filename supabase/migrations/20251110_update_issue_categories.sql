-- Migration: Update issue categories to new 12-category schema
-- Date: 2025-11-10

BEGIN;

-- Create new enum with desired values
CREATE TYPE issue_category_new AS ENUM (
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

-- Drop dependent functions before altering enum type
DROP FUNCTION IF EXISTS get_issues_with_filters(
    issue_status,
    issue_category,
    issue_severity,
    DECIMAL,
    DECIMAL,
    INTEGER,
    INTEGER,
    INTEGER,
    TEXT,
    TEXT
);

DROP FUNCTION IF EXISTS get_issue_statistics(
    DECIMAL,
    DECIMAL,
    INTEGER
);

-- Migrate issue categories to the new enum values
ALTER TABLE issues
  ALTER COLUMN category TYPE issue_category_new
  USING (
    CASE category::text
      WHEN 'pothole' THEN 'bad_roads'
      WHEN 'street_lighting' THEN 'broken_streetlights'
      WHEN 'water_supply' THEN 'water_supply_issues'
      WHEN 'traffic_signal' THEN 'bad_traffic_signals'
      WHEN 'drainage' THEN 'poor_drainages'
      WHEN 'sidewalk' THEN 'unsafe_crossings'
      WHEN 'other' THEN 'construction_debris'
      ELSE category::text
    END
  )::issue_category_new;

-- Replace enum type
DROP TYPE issue_category;
ALTER TYPE issue_category_new RENAME TO issue_category;

-- Refresh categories reference data
TRUNCATE TABLE categories RESTART IDENTITY;

INSERT INTO categories (name, description, icon, color, sort_order, is_active)
VALUES
('bad_roads', 'Road surface damage and potholes', 'construction', '#ef4444', 1, true),
('broken_streetlights', 'Broken or malfunctioning street lights', 'lightbulb', '#f59e0b', 2, true),
('dump_sites', 'Illegal or overflowing waste dump sites', 'trash-2', '#22c55e', 3, true),
('floods', 'Flooded streets and communities', 'waves', '#0ea5e9', 4, true),
('water_supply_issues', 'Water interruptions, leaks, and burst pipes', 'droplets', '#3b82f6', 5, true),
('bad_traffic_signals', 'Malfunctioning traffic signals and signage', 'traffic-cone', '#f97316', 6, true),
('poor_drainages', 'Blocked drainages and waterlogging', 'waves', '#6366f1', 7, true),
('erosion_sites', 'Erosion hotspots affecting infrastructure', 'mountain', '#7c3aed', 8, true),
('collapsed_bridges', 'Damaged or collapsed bridges and culverts', 'bridge', '#f59e0b', 9, true),
('open_manholes', 'Open or damaged manhole covers', 'circle-dot', '#a855f7', 10, true),
('unsafe_crossings', 'Unsafe pedestrian crossings and walkways', 'footprints', '#14b8a6', 11, true),
('construction_debris', 'Construction debris obstructing public areas', 'dump-truck', '#64748b', 12, true);

-- Recreate functions that depend on issue_category
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
            p_lat IS NULL OR 
            p_lng IS NULL OR 
            (
                ROUND(
                    6371 * acos(
                        cos(radians(p_lat)) * 
                        cos(radians(i.location_lat)) * 
                        cos(radians(i.location_lng) - radians(p_lng)) + 
                        sin(radians(p_lat)) * 
                        sin(radians(i.location_lat))
                    ), 2
                ) <= p_radius_km
            )
        )
    ORDER BY
        CASE WHEN p_sort_by = 'created_at' AND p_sort_order = 'ASC' THEN i.created_at END ASC,
        CASE WHEN p_sort_by = 'created_at' AND p_sort_order = 'DESC' THEN i.created_at END DESC,
        CASE WHEN p_sort_by = 'upvotes' AND p_sort_order = 'ASC' THEN i.upvotes END ASC,
        CASE WHEN p_sort_by = 'upvotes' AND p_sort_order = 'DESC' THEN i.upvotes END DESC,
        CASE WHEN p_sort_by = 'severity' AND p_sort_order = 'ASC' THEN i.severity::text END ASC,
        CASE WHEN p_sort_by = 'severity' AND p_sort_order = 'DESC' THEN i.severity::text END DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_issue_statistics(
    p_lat DECIMAL DEFAULT NULL,
    p_lng DECIMAL DEFAULT NULL,
    p_radius_km INTEGER DEFAULT 10
)
RETURNS JSON AS $$
DECLARE
    total_issues INTEGER;
    open_issues INTEGER;
    in_progress_issues INTEGER;
    resolved_issues INTEGER;
    closed_issues INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_issues FROM issues;
    SELECT COUNT(*) INTO open_issues FROM issues WHERE status = 'open';
    SELECT COUNT(*) INTO in_progress_issues FROM issues WHERE status = 'in_progress';
    SELECT COUNT(*) INTO resolved_issues FROM issues WHERE status = 'resolved';
    SELECT COUNT(*) INTO closed_issues FROM issues WHERE status = 'closed';

    RETURN json_build_object(
        'summary', json_build_object(
            'total', total_issues,
            'open', open_issues,
            'in_progress', in_progress_issues,
            'resolved', resolved_issues,
            'closed', closed_issues
        ),
        'by_category', (
            SELECT json_agg(
                json_build_object(
                    'category', category,
                    'count', COUNT(*)
                )
            )
            FROM issues
            GROUP BY category
        ),
        'by_severity', (
            SELECT json_agg(
                json_build_object(
                    'severity', severity,
                    'count', COUNT(*)
                )
            )
            FROM issues
            GROUP BY severity
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;

