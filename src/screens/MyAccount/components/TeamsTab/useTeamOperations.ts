import { useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import { LeaguePayment } from './types';

export function useTeamOperations() {
  const [unregisteringPayment, setUnregisteringPayment] = useState<number | null>(null);

  const handleUnregister = async (
    paymentId: number, 
    leagueName: string,
    onSuccess: (paymentId: number) => void
  ) => {
    if (!confirm(`Are you sure you want to delete your registration for ${leagueName}?`)) {
      return;
    }

    setUnregisteringPayment(paymentId);
    try {
      const { error } = await supabase
        .from('league_payments')
        .delete()
        .eq('id', paymentId);

      if (error) throw error;

      onSuccess(paymentId);
    } catch (error) {
      console.error('Error unregistering:', error);
      alert('Failed to delete registration. Please try again.');
    } finally {
      setUnregisteringPayment(null);
    }
  };

  return {
    unregisteringPayment,
    handleUnregister
  };
}