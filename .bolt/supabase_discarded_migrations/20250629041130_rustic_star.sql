/*
  # Fix payment calculation for user balance

  1. Changes
    - Update the getUserPaymentSummary function to only include payments where:
      - The user is directly responsible for the payment (user_id matches)
      - For team payments, only include if the user is the team captain
    - This ensures the Amount Owing only shows what the current user is responsible for

  2. Security
    - No changes to existing RLS policies
*/

-- Update the getUserPaymentSummary function in lib/payments.ts to filter payments correctly
-- This is a database migration to support the client-side changes

-- Create a function to check if a user is a team captain
CREATE OR REPLACE FUNCTION is_team_captain(p_user_id text, p_team_id bigint)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM teams
    WHERE id = p_team_id AND captain_id = p_user_id
  );
$$;

-- Create a view for user payment summary that filters correctly
CREATE OR REPLACE VIEW user_payment_summary WITH (security_invoker = true) AS
SELECT 
  lp.user_id,
  l.name as league_name,
  t.name as team_name,
  lp.amount_due,
  lp.amount_paid,
  (lp.amount_due - lp.amount_paid) as amount_outstanding,
  lp.status,
  lp.due_date,
  lp.payment_method,
  lp.created_at,
  lp.updated_at
FROM league_payments lp
JOIN leagues l ON l.id = lp.league_id
LEFT JOIN teams t ON t.id = lp.team_id
WHERE lp.user_id = get_current_user_id()
  AND (
    -- Include if it's a direct payment (no team)
    lp.team_id IS NULL
    OR
    -- Include if user is the team captain
    is_team_captain(get_current_user_id(), lp.team_id)
  )
ORDER BY lp.due_date ASC, lp.created_at DESC;

-- Update the calculate_user_outstanding_balance function
CREATE OR REPLACE FUNCTION calculate_user_outstanding_balance(p_user_id text)
RETURNS decimal(10,2)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COALESCE(SUM(amount_due - amount_paid), 0.00)
  FROM league_payments lp
  WHERE lp.user_id = p_user_id
    AND lp.status IN ('pending', 'partial', 'overdue')
    AND (
      -- Include if it's a direct payment (no team)
      lp.team_id IS NULL
      OR
      -- Include if user is the team captain
      is_team_captain(p_user_id, lp.team_id)
    );
$$;