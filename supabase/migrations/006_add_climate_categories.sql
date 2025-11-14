-- Add Climate Categories Migration
-- This migration extends the issue_category enum and adds climate-focused categories

-- Extend the issue_category enum type to include new climate categories
DO $$ 
BEGIN
    -- Add new enum values if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'flooding' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'issue_category')) THEN
        ALTER TYPE issue_category ADD VALUE 'flooding';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'erosion' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'issue_category')) THEN
        ALTER TYPE issue_category ADD VALUE 'erosion';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'urban_heat' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'issue_category')) THEN
        ALTER TYPE issue_category ADD VALUE 'urban_heat';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'storm_damage' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'issue_category')) THEN
        ALTER TYPE issue_category ADD VALUE 'storm_damage';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'green_infrastructure' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'issue_category')) THEN
        ALTER TYPE issue_category ADD VALUE 'green_infrastructure';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'water_contamination' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'issue_category')) THEN
        ALTER TYPE issue_category ADD VALUE 'water_contamination';
    END IF;
END $$;

-- Update existing drainage category description to emphasize climate resilience
UPDATE categories 
SET description = 'Blocked drains, flooding issues, and water management problems that impact climate resilience and flood prevention'
WHERE name = 'drainage';

-- Insert new climate-focused categories (using green shades per design preference)
INSERT INTO categories (name, description, icon, color, sort_order) VALUES
('flooding', 'Flooding and water overflow issues that pose climate adaptation challenges and infrastructure risks', 'cloud-rain', '#22c55e', 8),
('erosion', 'Coastal, riverbank, or soil erosion from extreme weather events affecting infrastructure stability', 'mountain', '#16a34a', 9),
('urban_heat', 'Urban heat island effects, lack of green spaces, and poor ventilation impacting community climate resilience', 'thermometer-sun', '#15803d', 10),
('storm_damage', 'Wind, storm, and extreme weather damage to infrastructure requiring climate adaptation measures', 'wind', '#14532d', 11),
('green_infrastructure', 'Lack of trees, parks, permeable surfaces, and urban green space needed for climate mitigation and adaptation', 'tree-pine', '#22c55e', 12),
('water_contamination', 'Post-flooding water contamination, overflow issues, and water quality problems affecting public health and climate resilience', 'flask-conical', '#10b981', 13)
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    sort_order = EXCLUDED.sort_order;

