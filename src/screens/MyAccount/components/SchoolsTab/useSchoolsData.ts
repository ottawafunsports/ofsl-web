import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useToast } from '../../../../components/ui/toast';
import { supabase } from '../../../../lib/supabase';
import { fetchSports } from '../../../../lib/leagues';
import { Gym, Sport, SchoolFilters, NewGymForm, EditGymForm } from './types';
import { INITIAL_NEW_GYM_FORM, INITIAL_EDIT_GYM_FORM, INITIAL_FILTERS } from './constants';

export function useSchoolsData() {
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [filteredGyms, setFilteredGyms] = useState<Gym[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SchoolFilters>(INITIAL_FILTERS);
  const [newGym, setNewGym] = useState<NewGymForm>(INITIAL_NEW_GYM_FORM);
  const [editGym, setEditGym] = useState<EditGymForm>(INITIAL_EDIT_GYM_FORM);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterGyms();
  }, [gyms, searchTerm, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const sportsData = await fetchSports();
      setSports(sportsData);
      
      if (userProfile?.is_admin) {
        const { data: gymsResponse, error } = await supabase
          .from('gyms')
          .select('*')
          .order('gym');

        if (error) throw error;
        if (gymsResponse) setGyms(gymsResponse);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterGyms = () => {
    let filtered = gyms.filter(gym => 
      (gym.gym?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (gym.address?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    if (filters.status === 'active') {
      filtered = filtered.filter(gym => gym.active === true);
    } else if (filters.status === 'inactive') {
      filtered = filtered.filter(gym => gym.active === false);
    }
    
    if (filters.days.length > 0) {
      filtered = filtered.filter(gym => 
        gym.available_days && 
        filters.days.some(dayId => gym.available_days!.includes(dayId))
      );
    }
    
    if (filters.sports.length > 0) {
      filtered = filtered.filter(gym => 
        gym.available_sports && 
        filters.sports.some(sportId => gym.available_sports!.includes(sportId))
      );
    }
    
    setFilteredGyms(filtered);
  };

  const isAnyFilterActive = () => {
    return filters.status !== 'all' || 
           filters.days.length > 0 || 
           filters.sports.length > 0 ||
           searchTerm.trim() !== '';
  };

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearchTerm('');
  };

  return {
    gyms,
    filteredGyms,
    sports,
    searchTerm,
    loading,
    filters,
    newGym,
    editGym,
    setSearchTerm,
    setFilters,
    setNewGym,
    setEditGym,
    loadData,
    isAnyFilterActive,
    clearFilters
  };
}