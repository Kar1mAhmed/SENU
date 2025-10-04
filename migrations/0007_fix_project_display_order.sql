-- Migration: Fix display order initialization for existing projects
-- This migration properly initializes display orders for all existing projects

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
