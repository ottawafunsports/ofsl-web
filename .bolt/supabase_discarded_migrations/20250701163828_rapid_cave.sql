/*
  # Backfill existing auth users to public users table

  1. Purpose
    - Find users in auth.users that don't have corresponding records in public.users
    - Create public.users records for these auth users
    - Ensure data consistency between auth and public schemas

  2. Implementation
    - Create a temporary function to handle the backfill process
    - Properly cast UUID to text for comparison
    - Insert records with appropriate defaults
    - Log the number of users processed
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
  -- Note: Explicitly cast auth.users.id (UUID) to TEXT for comparison with public.users.id (TEXT)
  FOR auth_user IN 
    SELECT au.* 
    FROM auth.users au
    LEFT JOIN public.users pu ON au.id::text = pu.id
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
      auth_user.id::text,
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

-- Drop the function after use (keeps the schema clean)
DROP FUNCTION backfill_existing_users();