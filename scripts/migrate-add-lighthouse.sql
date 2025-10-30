-- Add lighthouse_data column to analyses table
ALTER TABLE analyses ADD COLUMN lighthouse_data TEXT;

-- Update existing records to have NULL lighthouse_data (they were analyzed before lighthouse integration)
-- This is optional since new analyses will have lighthouse data
