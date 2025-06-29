export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      stripe_customers: {
        Row: {
          id: number
          user_id: string
          customer_id: string
          created_at: string | null
          updated_at: string | null
          deleted_at: string | null
        }
        Insert: {
          id?: never
          user_id: string
          customer_id: string
          created_at?: string | null
          updated_at?: string | null
          deleted_at?: string | null
        }
        Update: {
          id?: never
          user_id?: string
          customer_id?: string
          created_at?: string | null
          updated_at?: string | null
          deleted_at?: string | null
        }
      }
      stripe_subscriptions: {
        Row: {
          id: number
          customer_id: string
          subscription_id: string | null
          price_id: string | null
          current_period_start: number | null
          current_period_end: number | null
          cancel_at_period_end: boolean | null
          payment_method_brand: string | null
          payment_method_last4: string | null
          status: string
          created_at: string | null
          updated_at: string | null
          deleted_at: string | null
        }
        Insert: {
          id?: never
          customer_id: string
          subscription_id?: string | null
          price_id?: string | null
          current_period_start?: number | null
          current_period_end?: number | null
          cancel_at_period_end?: boolean | null
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          status: string
          created_at?: string | null
          updated_at?: string | null
          deleted_at?: string | null
        }
        Update: {
          id?: never
          customer_id?: string
          subscription_id?: string | null
          price_id?: string | null
          current_period_start?: number | null
          current_period_end?: number | null
          cancel_at_period_end?: boolean | null
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          status?: string
          created_at?: string | null
          updated_at?: string | null
          deleted_at?: string | null
        }
      }
      stripe_orders: {
        Row: {
          id: number
          checkout_session_id: string
          payment_intent_id: string
          customer_id: string
          amount_subtotal: number
          amount_total: number
          currency: string
          payment_status: string
          status: string
          created_at: string | null
          updated_at: string | null
          deleted_at: string | null
        }
        Insert: {
          id?: never
          checkout_session_id: string
          payment_intent_id: string
          customer_id: string
          amount_subtotal: number
          amount_total: number
          currency: string
          payment_status: string
          status?: string
          created_at?: string | null
          updated_at?: string | null
          deleted_at?: string | null
        }
        Update: {
          id?: never
          checkout_session_id?: string
          payment_intent_id?: string
          customer_id?: string
          amount_subtotal?: number
          amount_total?: number
          currency?: string
          payment_status?: string
          status?: string
          created_at?: string | null
          updated_at?: string | null
          deleted_at?: string | null
        }
      }
      league_payments: {
        Row: {
          id: number
          user_id: string
          team_id: number | null
          league_id: number
          amount_due: number
          amount_paid: number
          due_date: string | null
          status: string
          payment_method: string | null
          stripe_order_id: number | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: never
          user_id: string
          team_id?: number | null
          league_id: number
          amount_due: number
          amount_paid?: number
          due_date?: string | null
          status?: string
          payment_method?: string | null
          stripe_order_id?: number | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: never
          user_id?: string
          team_id?: number | null
          league_id?: number
          amount_due?: number
          amount_paid?: number
          due_date?: string | null
          status?: string
          payment_method?: string | null
          stripe_order_id?: number | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      stripe_user_subscriptions: {
        Row: {
          customer_id: string | null
          subscription_id: string | null
          subscription_status: string | null
          price_id: string | null
          current_period_start: number | null
          current_period_end: number | null
          cancel_at_period_end: boolean | null
          payment_method_brand: string | null
          payment_method_last4: string | null
        }
      }
      stripe_user_orders: {
        Row: {
          customer_id: string | null
          order_id: number | null
          checkout_session_id: string | null
          payment_intent_id: string | null
          amount_subtotal: number | null
          amount_total: number | null
          currency: string | null
          payment_status: string | null
          order_status: string | null
          order_date: string | null
        }
      }
      user_payment_summary: {
        Row: {
          user_id: string | null
          league_name: string | null
          team_name: string | null
          amount_due: number | null
          amount_paid: number | null
          amount_outstanding: number | null
          status: string | null
          due_date: string | null
          payment_method: string | null
          created_at: string | null
          updated_at: string | null
        }
      }
    }
    Functions: {
      calculate_user_outstanding_balance: {
        Args: {
          p_user_id: string
        }
        Returns: number
      }
    }
  }
}