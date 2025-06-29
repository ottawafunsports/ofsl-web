import { supabase } from './supabase';

/**
 * Interface for checkout session request parameters
 */
export interface CheckoutSessionRequest {
  priceId: string;
  mode: 'payment' | 'subscription';
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
}

/**
 * Interface for checkout session response
 */
export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

/**
 * Creates a Stripe checkout session
 * @param params Checkout session parameters
 * @returns Promise with session ID and URL
 */
export async function createCheckoutSession({
  priceId,
  mode,
  successUrl = `${window.location.origin}/success`,
  cancelUrl = `${window.location.origin}/cancel`,
  metadata = {}
}: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('User not authenticated');
  }

  // Call the Stripe checkout edge function
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      price_id: priceId,
      mode,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata
    }),
  });

  if (!response.ok) {
    try {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    } catch (e) {
      throw new Error('Failed to create checkout session');
    }
  }

  return response.json();
}

/**
 * Gets the current user's Stripe subscription
 * @returns Promise with subscription data or null
 */
export async function getUserSubscription() {
  const { data, error } = await supabase
    .from('stripe_user_subscriptions')
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }

  return data;
}

/**
 * Gets the current user's Stripe order history
 * @returns Promise with array of orders
 */
export async function getUserOrders() {
  const { data, error } = await supabase
    .from('stripe_user_orders')
    .select('*')
    .order('order_date', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data || [];
}

/**
 * Creates a payment intent for a specific league payment
 * @param paymentId The league payment ID
 * @returns Promise with payment intent client secret
 */
export async function createPaymentIntent(paymentId: number) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-payment-intent`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      payment_id: paymentId
    }),
  });

  if (!response.ok) {
    try {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create payment intent');
    } catch (e) {
      throw new Error('Failed to create payment intent');
    }
  }

  return response.json();
}