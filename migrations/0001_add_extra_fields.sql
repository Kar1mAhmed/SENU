-- Migration: Add extra_fields column to projects table
-- File: migrations/add_extra_fields.sql

-- Add extra_fields column to store up to 4 custom project information fields
-- This will store JSON data as text with field name and value pairs
ALTER TABLE projects ADD COLUMN extra_fields TEXT;

-- Add comment for documentation
-- extra_fields format: JSON array of objects with 'name' and 'value' properties
-- Example: [{"name": "CLIENT", "value": "GOLA"}, {"name": "TIMELINE", "value": "4 WEEKS"}]
-- Maximum 4 fields allowed per project
