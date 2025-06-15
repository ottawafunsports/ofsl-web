/*
  # Create get_current_user_id function

  1. Function
    - `get_current_user_id()` returns the current user's ID from the users table
    - Used in RLS policies to match the user ID format

  2. Security
    - Function is accessible to authenticated users
    - Returns null if user not found
*/

CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT id FROM users WHERE auth_id = auth.uid();
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_current_user_id() TO authenticated;
GRANT EXECUTE ON FUNCTION get_current_user_id() TO anon;