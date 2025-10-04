-- Quick test to verify project ordering in database

-- 1. Check if display_order columns exist and have values
SELECT 
    'Column Check' as test,
    COUNT(*) as total_projects,
    COUNT(display_order_global) as has_global_order,
    COUNT(display_order_in_category) as has_category_order,
    MIN(display_order_global) as min_global,
    MAX(display_order_global) as max_global
FROM projects;

-- 2. Show all projects with their orders (global view)
SELECT 
    name,
    category,
    display_order_global,
    display_order_in_category,
    created_at
FROM projects
ORDER BY display_order_global ASC;

-- 3. Show projects grouped by category with their category orders
SELECT 
    category_id,
    category,
    name,
    display_order_in_category,
    display_order_global
FROM projects
ORDER BY category_id, display_order_in_category ASC;

-- 4. Check for duplicate orders (should be empty)
SELECT 
    'Duplicate Global Orders' as issue,
    display_order_global,
    COUNT(*) as count
FROM projects
GROUP BY display_order_global
HAVING COUNT(*) > 1

UNION ALL

SELECT 
    'Duplicate Category Orders' as issue,
    category_id || '-' || display_order_in_category as order_key,
    COUNT(*) as count
FROM projects
GROUP BY category_id, display_order_in_category
HAVING COUNT(*) > 1;
