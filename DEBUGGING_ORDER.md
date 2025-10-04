# Debugging Project Order Issue

## What We've Implemented

✅ Database migration with `display_order_in_category` and `display_order_global` fields
✅ Database queries sorting by the correct field based on category filter
✅ API endpoint returning sorted projects
✅ Frontend components displaying projects in received order

## Current Logging

I've added comprehensive logging to track the order at each step:

### Backend (API Route)
- **Location**: `/src/app/api/projects/route.ts`
- **Logs**: 
  - `🔢 Projects order from DB` - Shows order directly from database
  - `🔢 Projects order after transform` - Shows order after dbProjectToProject conversion

### Frontend (useProjects Hook)
- **Location**: `/src/lib/hooks/useProjects.ts`
- **Logs**:
  - `📦 Raw projects from API` - Shows order received from API
  - `📦 Transformed projects order` - Shows order after transformProjectsForFrontend

## How to Debug

1. **Restart dev server**: `npm run dev`

2. **Open browser console** and navigate to:
   - Portfolio page: `http://localhost:3000/portfolio`
   - Landing page (for highlights): `http://localhost:3000`

3. **Check the console logs** in this order:
   ```
   🔢 Projects order from DB: [...] 
   🔢 Projects order after transform: [...]
   📦 Raw projects from API: [...]
   📦 Transformed projects order: [...]
   ```

4. **Compare the orders**:
   - If DB order is wrong → Database query issue
   - If transform breaks order → dbProjectToProject issue
   - If API order is wrong → API response issue
   - If frontend order is wrong → Component rendering issue

## Expected Behavior

### For "All" Category (categoryId = null)
- Should sort by `display_order_global ASC`
- Projects with lower numbers appear first

### For Specific Category (categoryId = 1, 2, etc.)
- Should sort by `display_order_in_category ASC`
- Only shows projects in that category
- Projects with lower numbers appear first

## Quick Verification Query

Run this in your local D1 database to check orders:

```sql
-- Check global ordering
SELECT name, display_order_global, category 
FROM projects 
ORDER BY display_order_global ASC;

-- Check category-specific ordering
SELECT name, category, display_order_in_category 
FROM projects 
WHERE category_id = 1  -- Change to your category ID
ORDER BY display_order_in_category ASC;
```

## Common Issues

### Issue 1: All projects have order 0
**Solution**: Run migration 0007 again
```bash
npm run migrations-local
```

### Issue 2: Order changes after page reload
**Cause**: Caching or state management issue
**Solution**: Clear browser cache and check React state

### Issue 3: Dashboard reorder doesn't reflect on portfolio
**Cause**: Need to reload portfolio page
**Solution**: Refresh the portfolio page after reordering

### Issue 4: Different order in different categories
**Expected**: This is correct! Each category has its own order
**Note**: "All" category uses global order, specific categories use category order

## Next Steps

After checking the logs, we can determine:
1. If the database is returning correct order
2. If the transformation is preserving order
3. If the frontend is displaying in correct order

Share the console logs and we can pinpoint the exact issue!
