/*
  # Create leagues table

  1. New Tables
    - `leagues`
      - `id` (bigint, primary key)
      - `name` (text) - league name
      - `description` (text) - league description
      - `additional_info` (text) - additional information
      - `sport_id` (bigint) - foreign key to sports table
      - `skill_id` (bigint) - foreign key to skills table
      - `day_of_week` (smallint) - 0=Sunday, 1=Monday, etc.
      - `start_date` (date) - league start date
      - `end_date` (date) - league end date
      - `cost` (real) - league cost
      - `max_teams` (integer) - maximum number of teams
      - `gym_ids` (bigint[]) - array of gym IDs
      - `active` (boolean) - whether league is active
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `leagues` table
    - Add policy for public read access
    - Add policy for admin-only write access
*/

CREATE TABLE IF NOT EXISTS leagues (
  id bigint PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  name text NOT NULL,
  description text,
  additional_info text,
  sport_id bigint REFERENCES sports(id),
  skill_id bigint REFERENCES skills(id),
  day_of_week smallint CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_date date,
  end_date date,
  cost real,
  max_teams integer DEFAULT 20,
  gym_ids bigint[] DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users"
  ON leagues
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage leagues"
  ON leagues
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.auth_id = auth.uid() AND users.is_admin = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM users 
    WHERE users.auth_id = auth.uid() AND users.is_admin = true
  ));

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leagues_sport_id ON leagues(sport_id);
CREATE INDEX IF NOT EXISTS idx_leagues_skill_id ON leagues(skill_id);
CREATE INDEX IF NOT EXISTS idx_leagues_day_of_week ON leagues(day_of_week);
CREATE INDEX IF NOT EXISTS idx_leagues_active ON leagues(active);