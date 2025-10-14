-- Migration: Add reanalysis columns to tasks table
-- Run this if you have an existing database

-- Add reanalysis columns to tasks table
ALTER TABLE tasks ADD COLUMN last_reanalysis TEXT;
ALTER TABLE tasks ADD COLUMN last_reanalysis_at INTEGER;

-- Note: SQLite doesn't support adding multiple columns in one statement
-- If you get an error about duplicate columns, these columns already exist

