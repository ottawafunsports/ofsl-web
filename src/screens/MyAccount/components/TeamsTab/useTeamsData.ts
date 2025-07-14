import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { LeaguePayment, Team } from './types';

export function useTeamsData(userId?: string) {
  const [leaguePayments, setLeaguePayments] = useState<LeaguePayment[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const fetchLeaguePayments = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('user_payment_summary')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      setLeaguePayments(data || []);
    } catch (error) {
      console.error('Error fetching league payments:', error);
    }
  };

  const fetchTeams = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          league:leagues(name, location)
        `)
        .contains('roster', [userId]);

      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchLeaguePayments(), fetchTeams()]);
  };

  const refetchLeaguePayments = () => {
    fetchLeaguePayments();
  };

  return {
    leaguePayments,
    teams,
    loading,
    setLeaguePayments,
    refetchLeaguePayments
  };
}