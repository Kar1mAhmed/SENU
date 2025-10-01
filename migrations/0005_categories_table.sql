-- Migration: Create categories table and migrate existing projects
-- File: migrations/0005_categories_table.sql

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories (including existing ones)
INSERT INTO categories (id, name, display_order) VALUES 
    (1, 'Branding', 1),
    (2, 'Logo design', 2),
    (3, 'UI/UX', 3),
    (4, 'Products', 4),
    (5, 'Prints', 5),
    (6, 'Motions', 6),
    (7, 'Shorts', 7);

-- Add new category_id column to projects table
ALTER TABLE projects ADD COLUMN category_id INTEGER;

-- Migrate existing projects to use category_id based on their category text
UPDATE projects SET category_id = 1 WHERE category = 'Branding';
UPDATE projects SET category_id = 2 WHERE category = 'Logo design';
UPDATE projects SET category_id = 3 WHERE category = 'UI/UX';
UPDATE projects SET category_id = 4 WHERE category = 'Products';
UPDATE projects SET category_id = 5 WHERE category = 'Prints';
UPDATE projects SET category_id = 6 WHERE category = 'Motions';
UPDATE projects SET category_id = 7 WHERE category = 'Shorts';

-- Set default category (Branding) for any projects without a matching category
UPDATE projects SET category_id = 1 WHERE category_id IS NULL;

-- Now that all projects have category_id, make it NOT NULL and add foreign key
-- Note: SQLite doesn't support adding constraints to existing columns, so we need to recreate the table

-- Create new projects table with foreign key
CREATE TABLE IF NOT EXISTS projects_new (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    client_name TEXT NOT NULL,
    client_logo_key TEXT,
    tags TEXT NOT NULL,
    category TEXT NOT NULL, -- Keep for backwards compatibility temporarily
    category_id INTEGER NOT NULL,
    project_type TEXT NOT NULL CHECK (project_type IN ('image', 'vertical', 'horizontal')),
    date_finished DATE,
    thumbnail_key TEXT,
    extra_fields TEXT,
    icon_bar_bg_color TEXT,
    icon_bar_icon_color TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT
);

-- Copy data from old table to new table
INSERT INTO projects_new 
SELECT 
    id, name, title, description, client_name, client_logo_key, tags, 
    category, category_id, project_type, date_finished, thumbnail_key, 
    extra_fields, icon_bar_bg_color, icon_bar_icon_color, created_at, updated_at
FROM projects;

-- Drop old table and rename new table
DROP TABLE projects;
ALTER TABLE projects_new RENAME TO projects;

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_projects_category_id ON projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(project_type);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Recreate trigger for updated_at
CREATE TRIGGER IF NOT EXISTS update_projects_timestamp 
    AFTER UPDATE ON projects
BEGIN
    UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Create trigger for categories updated_at
CREATE TRIGGER IF NOT EXISTS update_categories_timestamp 
    AFTER UPDATE ON categories
BEGIN
    UPDATE categories SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
