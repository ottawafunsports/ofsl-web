/*
  # Fix league payments RLS policy for team registration

  1. Changes
    - Add INSERT policy for league_payments table to allow users to create their own payment records
    - This fixes the error when registering for a team where the trigger tries to create a payment record

  2. Security
    - Only allows users to create payment records where they are the user_id
    - Uses the get_current_user_id() function to ensure proper user identification
*/

-- Add INSERT policy for league_payments to allow users to create their own payment records
CREATE POLICY "Users can create their own league payments"
  ON league_payments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = get_current_user_id());