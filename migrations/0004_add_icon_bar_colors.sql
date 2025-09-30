-- Migration: Add icon bar color customization fields
-- Description: Adds icon_bar_bg_color and icon_bar_icon_color to projects table

-- Add icon bar background color field (hex color)
ALTER TABLE projects ADD COLUMN icon_bar_bg_color TEXT DEFAULT '#4FAF78';

-- Add icon bar icon color field (hex color)
ALTER TABLE projects ADD COLUMN icon_bar_icon_color TEXT DEFAULT '#FFFFFF';

-- Update existing projects to have default colors
UPDATE projects SET icon_bar_bg_color = '#4FAF78' WHERE icon_bar_bg_color IS NULL;
UPDATE projects SET icon_bar_icon_color = '#FFFFFF' WHERE icon_bar_icon_color IS NULL;
