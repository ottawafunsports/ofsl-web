/*
  # Create Stripe Products Table

  1. New Tables
    - `stripe_products`
      - `id` (text, primary key) - Stripe product ID
      - `price_id` (text) - Stripe price ID
      - `name` (text) - Product name
      - `description` (text) - Product description
      - `mode` (text) - 'payment' or 'subscription'
      - `price` (decimal) - Price amount
      - `currency` (text) - Price currency
      - `interval` (text) - Subscription interval (null for one-time payments)
      - `league_id` (bigint) - Optional reference to leagues table
      - `created_at` (timestamp) - Creation timestamp
      - `updated_at` (timestamp) - Last update timestamp

  2. Functions
    - `check_table_exists` - Checks if a table exists
    - `create_stripe_products_table` - Creates the stripe_products table if it doesn't exist

  3. Security
    - Enable RLS on stripe_products table
    - Allow all users to read products
    - Allow admins to manage products
*/

-- Function to check if a table exists
CREATE OR REPLACE FUNCTION check_table_exists(table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = table_name
  );
END;
$$;

-- Function to create the stripe_products table
CREATE OR REPLACE FUNCTION create_stripe_products_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create the table if it doesn't exist
  CREATE TABLE IF NOT EXISTS stripe_products (
    id text PRIMARY KEY,
    price_id text NOT NULL,
    name text NOT NULL,
    description text,
    mode text NOT NULL,
    price decimal(10,2),
    currency text DEFAULT 'cad',
    interval text,
    league_id bigint REFERENCES leagues(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
  );

  -- Enable RLS
  ALTER TABLE stripe_products ENABLE ROW LEVEL SECURITY;

  -- Create policies
  CREATE POLICY "Allow all users to read products"
    ON stripe_products
    FOR SELECT
    TO public
    USING (true);

  CREATE POLICY "Allow admins to manage products"
    ON stripe_products
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

  -- Create trigger to update updated_at
  CREATE TRIGGER update_stripe_products_updated_at
    BEFORE UPDATE ON stripe_products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
END;
$$;

-- Create the table if it doesn't exist
SELECT create_stripe_products_table() WHERE NOT check_table_exists('stripe_products');