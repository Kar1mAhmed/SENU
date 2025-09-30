-- Migration: Create contact_messages table
-- File: migrations/0003_contact_messages.sql

CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    contact_method TEXT NOT NULL CHECK (contact_method IN ('whatsapp', 'email', 'phone')),
    country_code TEXT,
    phone_number TEXT,
    email TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_contact_method ON contact_messages(contact_method);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_contact_messages_timestamp 
    AFTER UPDATE ON contact_messages
BEGIN
    UPDATE contact_messages SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
