import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';
import { Database } from '../types/database.ts';

const supabase = createClient<Database>(
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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    if (req.method !== 'POST') {
      return corsResponse({ error: 'Method not allowed' }, 405);
    }

    // Get the payment ID from the request
    const { payment_id } = await req.json();

    if (!payment_id) {
      return corsResponse({ error: 'Payment ID is required' }, 400);
    }

    // Authenticate the user
    const authHeader = req.headers.get('Authorization')!;
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

    // Get the payment details
    const { data: payment, error: paymentError } = await supabase
      .from('league_payments')
      .select('*, leagues(name)')
      .eq('id', payment_id)
      .single();

    if (paymentError) {
      console.error('Error fetching payment:', paymentError);
      return corsResponse({ error: 'Payment not found' }, 404);
    }

    // Verify the payment belongs to the user
    if (payment.user_id !== user.id) {
      return corsResponse({ error: 'Unauthorized' }, 403);
    }

    // Calculate the amount to charge
    const amountOutstanding = payment.amount_due - payment.amount_paid;
    if (amountOutstanding <= 0) {
      return corsResponse({ error: 'Payment is already paid in full' }, 400);
    }

    // Get or create a Stripe customer for the user
    let customerId: string;
    const { data: customer, error: getCustomerError } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .maybeSingle();

    if (getCustomerError) {
      console.error('Failed to fetch customer information from the database', getCustomerError);
      return corsResponse({ error: 'Failed to fetch customer information' }, 500);
    }

    if (!customer || !customer.customer_id) {
      // Create a new Stripe customer
      const newCustomer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      });

      console.log(`Created new Stripe customer ${newCustomer.id} for user ${user.id}`);

      const { error: createCustomerError } = await supabase.from('stripe_customers').insert({
        user_id: user.id,
        customer_id: newCustomer.id,
      });

      if (createCustomerError) {
        console.error('Failed to save customer information in the database', createCustomerError);
        return corsResponse({ error: 'Failed to create customer mapping' }, 500);
      }

      customerId = newCustomer.id;
    } else {
      customerId = customer.customer_id;
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amountOutstanding * 100), // Convert to cents
      currency: 'cad',
      customer: customerId,
      metadata: {
        payment_id: payment_id.toString(),
        league_id: payment.league_id.toString(),
        team_id: payment.team_id ? payment.team_id.toString() : '',
        league_name: payment.leagues?.name || 'League Payment',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return corsResponse({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error: any) {
    console.error(`Payment intent error: ${error.message}`);
    return corsResponse({ error: error.message }, 500);
  }
});