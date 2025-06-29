import { useState } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { NewLeague } from '../types';

interface UseLeagueActionsProps {
  loadData: () => Promise<void>;
  showToast: (message: string, type: 'success' | 'error') => void;
}

export function useLeagueActions({ loadData, showToast }: UseLeagueActionsProps) {
  const [saving, setSaving] = useState(false);

  const handleCreateLeague = async (newLeague: NewLeague) => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('leagues')
        .insert({
          name: newLeague.name,
          sport_id: newLeague.sport_id,
          skill_id: newLeague.skill_id,
          day_of_week: newLeague.day_of_week,
          start_date: newLeague.start_date,
          end_date: newLeague.end_date,
          cost: newLeague.cost,
          max_teams: newLeague.max_teams,
          gym_ids: newLeague.gym_ids,
          active: true
        });

      if (error) throw error;

      showToast('League created successfully!', 'success');
      await loadData();
    } catch (error) {
      console.error('Error creating league:', error);
      showToast('Failed to create league', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLeague = async (leagueId: number) => {
    if (!confirm('Are you sure you want to delete this league? This action cannot be undone.')) {
      return;
    }

    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('leagues')
        .delete()
        .eq('id', leagueId);

      if (error) throw error;

      showToast('League deleted successfully!', 'success');
      await loadData();
    } catch (error) {
      console.error('Error deleting league:', error);
      showToast('Failed to delete league', 'error');
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    handleCreateLeague,
    handleDeleteLeague
  };
}