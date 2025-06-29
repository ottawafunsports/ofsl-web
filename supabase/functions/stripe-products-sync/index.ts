import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'OFSL Stripe Integration',
    version: '1.0.0',
  },
});

// Helper function to create responses with CORS headers
function corsResponse(body: string | object | null, status = 200) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };

  // For 204 No Content, don't include Content-Type or body
  if (status === 204) {
    return new Response(null, { status, headers });
  }

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });
}

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return corsResponse({}, 204);
    }

    // Only allow GET and POST methods
    if (req.method !== 'GET' && req.method !== 'POST') {
      return corsResponse({ error: 'Method not allowed' }, 405);
    }

    // Authenticate the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return corsResponse({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser(token);

    if (getUserError) {
      return corsResponse({ error: 'Failed to authenticate user' }, 401);
    }

    if (!user) {
      return corsResponse({ error: 'User not found' }, 404);
    }

    // Check if user is an admin
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('auth_id', user.id)
      .single();

    if (profileError || !userProfile || !userProfile.is_admin) {
      return corsResponse({ error: 'Unauthorized - Admin access required' }, 403);
    }

    // Fetch products from Stripe
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });

    // Transform products to our format
    const transformedProducts = products.data.map(product => {
      const price = product.default_price as Stripe.Price;
      return {
        id: product.id,
        priceId: price?.id || '',
        name: product.name,
        description: product.description || '',
        mode: price?.type === 'recurring' ? 'subscription' : 'payment',
        price: price ? price.unit_amount ? price.unit_amount / 100 : 0 : 0,
        currency: price?.currency || 'usd',
        interval: price?.type === 'recurring' ? price.recurring?.interval : null,
        metadata: product.metadata || {},
        leagueId: product.metadata?.leagueId ? parseInt(product.metadata.leagueId) : null,
      };
    });

    // Store products in the database
    if (req.method === 'POST') {
      // Check if stripe_products table exists, create it if not
      const { error: tableCheckError } = await supabase.rpc('check_table_exists', { table_name: 'stripe_products' });
      
      if (tableCheckError) {
        // Table doesn't exist, create it
        const { error: createTableError } = await supabase.rpc('create_stripe_products_table');
        
        if (createTableError) {
          console.error('Error creating stripe_products table:', createTableError);
          return corsResponse({ error: 'Failed to create products table' }, 500);
        }
      }

      // Clear existing products and insert new ones
      const { error: deleteError } = await supabase
        .from('stripe_products')
        .delete()
        .neq('id', 'placeholder'); // Delete all records

      if (deleteError) {
        console.error('Error clearing products:', deleteError);
        return corsResponse({ error: 'Failed to clear existing products' }, 500);
      }

      // Insert new products
      const { error: insertError } = await supabase
        .from('stripe_products')
        .insert(transformedProducts);

      if (insertError) {
        console.error('Error inserting products:', insertError);
        return corsResponse({ error: 'Failed to insert products' }, 500);
      }

      return corsResponse({ 
        success: true, 
        message: 'Products synced successfully',
        count: transformedProducts.length
      });
    }

    // For GET requests, just return the products without storing them
    return corsResponse({ 
      products: transformedProducts,
      count: transformedProducts.length
    });

  } catch (error: any) {
    console.error(`Error syncing products: ${error.message}`);
    return corsResponse({ 
      error: `Failed to sync products: ${error.message}` 
    }, 500);
  }
});