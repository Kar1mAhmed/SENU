-- Migration: Replace URLs with keys for media storage
-- File: migrations/0002_media_keys_migration.sql

-- Drop old URL columns and add key columns
ALTER TABLE projects DROP COLUMN thumbnail_url;
ALTER TABLE projects DROP COLUMN client_logo;
ALTER TABLE projects ADD COLUMN thumbnail_key TEXT;
ALTER TABLE projects ADD COLUMN client_logo_key TEXT;

ALTER TABLE project_slides DROP COLUMN media_url;
ALTER TABLE project_slides ADD COLUMN media_key TEXT NOT NULL DEFAULT '';

-- Create indexes for the new key columns
CREATE INDEX IF NOT EXISTS idx_projects_thumbnail_key ON projects(thumbnail_key);
CREATE INDEX IF NOT EXISTS idx_projects_client_logo_key ON projects(client_logo_key);
CREATE INDEX IF NOT EXISTS idx_slides_media_key ON project_slides(media_key);