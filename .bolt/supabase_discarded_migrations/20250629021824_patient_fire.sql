/*
  # Remove year column from leagues table

  1. Changes
    - Remove the redundant `year` column from leagues table
    - This information is already available via start_date and end_date

  2. Security
    - No changes to existing RLS policies
*/

-- Remove the year column from leagues table
ALTER TABLE leagues DROP COLUMN IF EXISTS year;