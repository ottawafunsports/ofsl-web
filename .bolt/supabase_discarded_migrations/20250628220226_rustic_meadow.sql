/*
  # Remove additional_info column from leagues table

  1. Changes
    - Merge additional_info content into description field where applicable
    - Remove additional_info column from leagues table
    - Preserve all existing data by merging it into the description field

  2. Security
    - No changes to existing RLS policies
*/

-- First, merge additional_info into description for all leagues that have both fields populated
UPDATE leagues
SET description = description || E'\n\n' || additional_info
WHERE description IS NOT NULL 
AND additional_info IS NOT NULL
AND description != ''
AND additional_info != '';

-- For leagues that have additional_info but no description, move additional_info to description
UPDATE leagues
SET description = additional_info
WHERE (description IS NULL OR description = '')
AND additional_info IS NOT NULL
AND additional_info != '';

-- Now that we've preserved all the data, drop the additional_info column
ALTER TABLE leagues DROP COLUMN IF EXISTS additional_info;