# Project Ordering Feature - Implementation Guide

## Overview
The project ordering system allows you to control the display order of projects in both category-specific views and the "All" category view through simple up/down arrow controls in the dashboard.

## Key Features

### 1. **Dual Ordering System**
- **Category-Specific Order**: Each project has its own order within its category
- **Global Order**: Projects also have a global order for the "All" category view
- Both orders are maintained independently and automatically

### 2. **Simple UI Controls**
- **Up Arrow (↑)**: Moves project up in the list (decreases order number)
- **Down Arrow (↓)**: Moves project down in the list (increases order number)
- Located on the left side of each project card in the dashboard
- Hover effects for better UX

### 3. **Automatic Ordering**
- Projects are automatically ordered when fetched from the API
- Portfolio page and Project Highlight section respect the ordering
- New projects are added to the end of the list by default

## How to Use

### Step 1: Run the Migration
Before using the ordering feature, run the database migration:

```bash
# Apply the migration to add display_order fields
wrangler d1 execute DB --file=./migrations/0006_add_project_display_order.sql
```

This migration:
- Adds `display_order_in_category` column for category-specific ordering
- Adds `display_order_global` column for "All" category ordering
- Creates indexes for better performance
- Initializes orders based on creation date

### Step 2: Access the Dashboard
Navigate to `/dashboard` and log in with your credentials.

### Step 3: Reorder Projects

#### For Category-Specific Ordering:
1. Select a specific category (e.g., "Branding", "Logo design")
2. Click the up/down arrows next to any project
3. The project will swap positions with the adjacent project
4. Changes are saved immediately and reflected in the portfolio page

#### For Global Ordering (All Category):
1. Select "All" category in the dashboard
2. Click the up/down arrows next to any project
3. This controls the order when users view "All" projects on the portfolio page
4. Independent from category-specific ordering

## Technical Implementation

### Database Schema
```sql
-- New columns added to projects table
display_order_in_category INTEGER  -- Order within specific category
display_order_global INTEGER       -- Order in "All" category view
```

### API Endpoints
- **GET /api/projects**: Returns projects sorted by display order
  - Uses `display_order_in_category` when filtered by category
  - Uses `display_order_global` when showing all projects
  
- **POST /api/projects/reorder**: Reorders a project
  ```json
  {
    "projectId": "project-id",
    "direction": "up" | "down",
    "categoryId": 1 | null  // null for global ordering
  }
  ```

### Frontend Components Affected
- **Dashboard** (`/src/app/dashboard/page.tsx`): Shows reorder controls
- **Portfolio Page** (`/src/app/portfolio/page.tsx`): Displays ordered projects
- **Project Highlight** (`/src/components/landing/ProjectHighlight/index.tsx`): Shows first 6 ordered projects

### Ordering Logic
1. When you click "up" on a project, it swaps `display_order` with the project above it
2. When you click "down", it swaps with the project below it
3. The swap is atomic - both projects update simultaneously
4. If a project is already at the top/bottom, the buttons do nothing

## Best Practices

### 1. **Order New Projects After Creation**
- New projects are automatically added to the end
- Reorder them immediately after creation if needed

### 2. **Maintain Both Orders**
- Remember to order projects in both "All" view and category views
- Users can filter by category, so both orderings matter

### 3. **Test After Reordering**
- Check the portfolio page to verify the new order
- Test both desktop and mobile views

### 4. **Consistent Ordering Strategy**
- Decide on a strategy (newest first, best work first, etc.)
- Apply consistently across all categories

## Troubleshooting

### Projects Not Reordering
1. Check browser console for errors
2. Verify migration was applied successfully
3. Ensure you're authenticated in the dashboard

### Order Not Showing on Portfolio Page
1. Clear browser cache
2. Check that the API is returning projects with display_order fields
3. Verify the GET /api/projects endpoint is sorting correctly

### Database Issues
If you need to reset ordering:
```sql
-- Reset to creation date order
UPDATE projects 
SET display_order_in_category = (
    SELECT COUNT(*) 
    FROM projects p2 
    WHERE p2.category_id = projects.category_id 
    AND p2.created_at > projects.created_at
);

UPDATE projects 
SET display_order_global = (
    SELECT COUNT(*) 
    FROM projects p2 
    WHERE p2.created_at > projects.created_at
);
```

## Files Modified

### Database
- `/migrations/0006_add_project_display_order.sql` - Migration file

### Types
- `/src/lib/types.ts` - Added display order fields to DBProject and ProjectWithSlides

### Backend
- `/src/lib/db-utils.ts` - Added reorder method, updated create and getAll
- `/src/app/api/projects/route.ts` - Updated to use display order sorting
- `/src/app/api/projects/reorder/route.ts` - New endpoint for reordering

### Frontend
- `/src/lib/api-client.ts` - Added reorder function
- `/src/app/dashboard/page.tsx` - Added up/down arrow controls

## Future Enhancements

Possible improvements for the future:
1. Drag-and-drop reordering interface
2. Bulk reordering tools
3. Auto-sort options (by date, name, etc.)
4. Order preview before saving
5. Undo/redo functionality

---

**Note**: The ordering system is designed to be simple and intuitive. The up/down arrows provide immediate visual feedback and the changes are reflected across the entire site instantly.
