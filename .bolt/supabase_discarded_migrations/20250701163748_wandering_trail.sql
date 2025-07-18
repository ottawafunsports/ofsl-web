/*
  # Backfill existing auth users to public users table

  1. New Function
    - `backfill_existing_users()` - One-time function to create public.users records for existing auth users
    - Runs once during migration to ensure all existing auth users have corresponding public records
    - Uses the same logic as the handle_new_user trigger

  2. Data Migration
    - Executes the backfill function immediately during migration
    - Only creates records for auth users that don't already have a public.users entry
    - Preserves existing data in public.users table
*/

-- Create a function to backfill existing auth users to public.users table
CREATE OR REPLACE FUNCTION backfill_existing_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  auth_user RECORD;
  now_timestamp TIMESTAMP WITH TIME ZONE := now();
  counter INTEGER := 0;
BEGIN
  -- Loop through all auth users that don't have a corresponding public user
  FOR auth_user IN 
    SELECT au.* 
    FROM auth.users au
    LEFT JOIN public.users pu ON au.id = pu.id
    WHERE pu.id IS NULL
  LOOP
    -- Insert a new record into public.users
    INSERT INTO public.users (
      id,
      auth_id,
      name,
      email,
      phone,
      date_created,
      date_modified,
      is_admin
    ) VALUES (
      auth_user.id,
      auth_user.id,
      COALESCE(auth_user.raw_user_meta_data->>'full_name', auth_user.raw_user_meta_data->>'name', ''),
      auth_user.email,
      COALESCE(auth_user.raw_user_meta_data->>'phone', ''),
      now_timestamp,
      now_timestamp,
      false
    )
    -- If the user already exists, do nothing (extra safety)
    ON CONFLICT (id) DO NOTHING;
    
    counter := counter + 1;
  END LOOP;
  
  -- Log the number of users backfilled
  RAISE NOTICE 'Backfilled % users from auth.users to public.users', counter;
END;
$$;

-- Execute the backfill function immediately
SELECT backfill_existing_users();

-- Drop the function after use (optional, but keeps the schema clean)
DROP FUNCTION backfill_existing_users();