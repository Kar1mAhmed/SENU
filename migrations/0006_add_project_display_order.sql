-- Migration: Add display order fields for projects
-- This enables custom ordering of projects per category and globally

-- Add display_order_in_category column for category-specific ordering
ALTER TABLE projects ADD COLUMN display_order_in_category INTEGER DEFAULT 0;

-- Add display_order_global column for "All" category ordering
ALTER TABLE projects ADD COLUMN display_order_global INTEGER DEFAULT 0;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_category_order ON projects(category_id, display_order_in_category);
CREATE INDEX IF NOT EXISTS idx_projects_global_order ON projects(display_order_global);

-- Initialize display orders with simple sequential numbering
-- This ensures all existing projects get unique order numbers

-- For category-specific ordering: assign sequential numbers within each category
WITH numbered_projects AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY created_at DESC, id) as row_num
    FROM projects
)
UPDATE projects 
SET display_order_in_category = (
    SELECT row_num 
    FROM numbered_projects 
    WHERE numbered_projects.id = projects.id
);

-- For global ordering: assign sequential numbers across all projects
WITH numbered_projects_global AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (ORDER BY created_at DESC, id) as row_num
    FROM projects
)
UPDATE projects 
SET display_order_global = (
    SELECT row_num 
    FROM numbered_projects_global 
    WHERE numbered_projects_global.id = projects.id
);
