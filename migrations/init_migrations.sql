-- Migration: Create projects and slides tables
-- File: migrations/0001_initial.sql

CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    client_name TEXT NOT NULL,
    tags TEXT NOT NULL, -- JSON array as text
    category TEXT NOT NULL CHECK (category IN ('Branding', 'Logo design', 'UI/UX', 'Products', 'Prints', 'Motions', 'Shorts')),
    project_type TEXT NOT NULL CHECK (project_type IN ('image', 'vertical', 'horizontal')),
    date_finished DATE,
    thumbnail_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_slides (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    slide_order INTEGER NOT NULL DEFAULT 0,
    slide_type TEXT NOT NULL CHECK (slide_type IN ('image', 'vertical', 'horizontal')),
    slide_text TEXT,
    media_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(project_type);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_slides_project_id ON project_slides(project_id);
CREATE INDEX IF NOT EXISTS idx_slides_order ON project_slides(project_id, slide_order);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_projects_timestamp 
    AFTER UPDATE ON projects
BEGIN
    UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_slides_timestamp 
    AFTER UPDATE ON project_slides
BEGIN
    UPDATE project_slides SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;