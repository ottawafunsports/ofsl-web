import { supabase } from './supabase';

export interface LeaguePayment {
  id: number;
  user_id: string;
  team_id: number | null;
  league_id: number;
  amount_due: number;
  amount_paid: number;
  amount_outstanding: number;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  due_date: string | null;
  payment_method: 'stripe' | 'cash' | 'e_transfer' | 'waived' | null;
  stripe_order_id: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  league_name: string;
  team_name: string | null;
}

export interface PaymentSummary {
  total_outstanding: number;
  total_paid: number;
  pending_payments: number;
  overdue_payments: number;
}

// Get all league payments for the current user
export const getUserLeaguePayments = async (): Promise<LeaguePayment[]> => {
  try {
    const { data, error } = await supabase
      .from('league_payments')
      .select(`
        id,
        user_id,
        team_id,
        league_id,
        amount_due,
        amount_paid,
        status,
        due_date,
        payment_method,
        stripe_order_id,
        notes,
        created_at,
        updated_at,
        leagues!inner(name),
        teams(name)
      `);

    if (error) throw error;

    // Transform the data to match the LeaguePayment interface
    const transformedData = (data || []).map(payment => ({
      id: payment.id,
      user_id: payment.user_id,
      team_id: payment.team_id,
      league_id: payment.league_id,
      amount_due: payment.amount_due,
      amount_paid: payment.amount_paid,
      amount_outstanding: payment.amount_due - payment.amount_paid,
      status: payment.status,
      due_date: payment.due_date,
      payment_method: payment.payment_method,
      stripe_order_id: payment.stripe_order_id,
      notes: payment.notes,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
      league_name: payment.leagues?.name || '',
      team_name: payment.teams?.name || null
    }));

    return transformedData;
  } catch (error) {
    console.error('Error fetching user league payments:', error);
    return [];
  }
};

// Get payment summary for the current user
export const getUserPaymentSummary = async (): Promise<PaymentSummary> => {
  try {
    const { data: payments, error } = await supabase
      .from('user_payment_summary')
      .select('amount_outstanding, amount_paid, status');

    if (error) throw error;

    if (!payments) {
      return {
        total_outstanding: 0,
        total_paid: 0,
        pending_payments: 0,
        overdue_payments: 0
      };
    }

    const summary = payments.reduce((acc, payment) => {
      acc.total_outstanding += payment.amount_outstanding || 0;
      acc.total_paid += payment.amount_paid || 0;
      
      if (payment.status === 'pending' || payment.status === 'partial') {
        acc.pending_payments++;
      } else if (payment.status === 'overdue') {
        acc.overdue_payments++;
      }
      
      return acc;
    }, {
      total_outstanding: 0,
      total_paid: 0,
      pending_payments: 0,
      overdue_payments: 0
    });

    return summary;
  } catch (error) {
    console.error('Error fetching user payment summary:', error);
    return {
      total_outstanding: 0,
      total_paid: 0,
      pending_payments: 0,
      overdue_payments: 0
    };
  }
};

// Create a league payment record (typically called when registering a team)
export const createLeaguePayment = async (params: {
  user_id: string;
  team_id?: number;
  league_id: number;
  amount_due: number;
  due_date?: string;
  notes?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('league_payments')
      .insert({
        user_id: params.user_id,
        team_id: params.team_id,
        league_id: params.league_id,
        amount_due: params.amount_due,
        due_date: params.due_date,
        notes: params.notes,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error creating league payment:', error);
    throw error;
  }
};

// Update a league payment (for manual payments)
export const updateLeaguePayment = async (
  paymentId: number, 
  updates: {
    amount_paid?: number;
    payment_method?: 'stripe' | 'cash' | 'e_transfer' | 'waived';
    notes?: string;
  }
) => {
  try {
    const { data, error } = await supabase
      .from('league_payments')
      .update(updates)
      .eq('id', paymentId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error updating league payment:', error);
    throw error;
  }
};

// Get outstanding balance for a specific user
export const getUserOutstandingBalance = async (userId?: string): Promise<number> => {
  try {
    if (!userId) {
      // Use the SQL function for current user
      const { data, error } = await supabase
        .rpc('calculate_user_outstanding_balance', { p_user_id: null });

      if (error) throw error;
      return data || 0;
    } else {
      // Use the SQL function for specific user
      const { data, error } = await supabase
        .rpc('calculate_user_outstanding_balance', { p_user_id: userId });

      if (error) throw error;
      return data || 0;
    }
  } catch (error) {
    console.error('Error calculating outstanding balance:', error);
    return 0;
  }
};