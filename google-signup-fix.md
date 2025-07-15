# Google Sign-up Fix Documentation

## Issues Identified

1. **Missing Toast Import**: The `GoogleSignupRedirect` component was missing the `useToast` import
2. **Database Function Bug**: The `check_and_fix_user_profile_v4` function has a bug where it tries to use `auth_id` as the primary key `id`
3. **Type Conversion**: Date fields need to be converted to TEXT properly

## Solutions Implemented

### 1. Fixed GoogleSignupRedirect Component
- Added missing `useToast` import
- Component now properly displays success/error messages

### 2. Database Function Issues
The main issue is in the `check_and_fix_user_profile_v4` function at line 138:
```sql
INSERT INTO public.users (
  id,
  ...
) VALUES (
  p_auth_id,  -- This is wrong - should be a generated unique ID
  ...
```

This should be:
```sql
-- Generate a unique user ID first
user_id := EXTRACT(EPOCH FROM NOW())::TEXT || '_' || SUBSTRING(MD5(RANDOM()::TEXT), 1, 8);

INSERT INTO public.users (
  id,
  ...
) VALUES (
  user_id,  -- Use generated ID
  ...
```

### 3. Current Flow Analysis

The Google sign-up flow works as follows:
1. User clicks "Sign in with Google"
2. Supabase redirects to Google OAuth
3. After successful auth, user is redirected to `/google-signup-redirect`
4. AuthContext tries to create user profile using `check_and_fix_user_profile_v4`
5. Database trigger also tries to create user profile using `handle_new_user()`
6. Both attempts fail due to the function bug
7. `GoogleSignupRedirect` component detects incomplete profile and shows form
8. User fills out form and submits
9. Component updates user profile in database

## Recommended Migration

Since we can't modify the database directly, the recommended approach is:

1. Create a new migration file that fixes the `check_and_fix_user_profile_v4` function
2. The function should generate unique IDs instead of using auth_id as the primary key
3. Ensure proper type conversions for date fields

## Temporary Workaround

The current implementation should still work because:
1. The `GoogleSignupRedirect` component handles the case where automatic user creation fails
2. It shows a form to collect user information
3. It manually creates/updates the user profile in the database
4. This ensures users can complete their registration even if the automatic process fails

## Testing Required

After fixing the database function:
1. Test Google sign-up with a new account
2. Verify that user is automatically created in `public.users` table
3. Verify that profile completion form still works for edge cases
4. Test that users are properly redirected after completing profile