import { supabase } from './supabase';

export interface League {
  id: number;
  name: string;
  description: string | null;
  additional_info: string | null;
  sport_id: number | null;
  skill_id: number | null;
  day_of_week: number | null;
  start_date: string | null;
  end_date: string | null;
  cost: number | null;
  max_teams: number | null;
  gym_ids: number[] | null;
  active: boolean | null;
  created_at: string;
  
  // Joined data
  sport_name: string | null;
  skill_name: string | null;
  gyms: Array<{ id: number; gym: string | null; address: string | null }>;
}

export interface LeagueWithTeamCount extends League {
  team_count: number;
  spots_remaining: number;
}

// Convert day_of_week number to day name
export const getDayName = (dayOfWeek: number | null): string => {
  if (dayOfWeek === null) return '';
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek] || '';
};

// Format dates for display
export const formatLeagueDates = (startDate: string | null, endDate: string | null): string => {
  if (!startDate || !endDate) return '';
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  };
  
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
};

// Get primary gym location for display
export const getPrimaryLocation = (gyms: Array<{ gym: string | null; address: string | null }>): string => {
  if (!gyms || gyms.length === 0) return '';
  
  // For now, just return the first gym's name
  // Later we can implement logic to determine region (Central, East End, West End)
  return gyms[0]?.gym || '';
};

// Fetch all leagues with related data
export const fetchLeagues = async (): Promise<LeagueWithTeamCount[]> => {
  try {
    // First, get leagues with sport and skill information
    const { data: leaguesData, error: leaguesError } = await supabase
      .from('leagues')
      .select(`
        *,
        sports:sport_id(name),
        skills:skill_id(name)
      `)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (leaguesError) {
      console.error('Error fetching leagues:', leaguesError);
      return [];
    }

    if (!leaguesData) return [];

    // Get team counts for each league
    const { data: teamCounts, error: teamCountsError } = await supabase
      .from('teams')
      .select('league_id, id')
      .eq('active', true);

    if (teamCountsError) {
      console.error('Error fetching team counts:', teamCountsError);
    }

    // Get all unique gym IDs
    const allGymIds = new Set<number>();
    leaguesData.forEach(league => {
      if (league.gym_ids) {
        league.gym_ids.forEach((id: number) => allGymIds.add(id));
      }
    });

    // Fetch gym information
    const { data: gymsData, error: gymsError } = await supabase
      .from('gyms')
      .select('id, gym, address')
      .in('id', Array.from(allGymIds));

    if (gymsError) {
      console.error('Error fetching gyms:', gymsError);
    }

    const gymsMap = new Map(gymsData?.map(gym => [gym.id, gym]) || []);
    const teamCountsMap = new Map<number, number>();
    
    // Count teams per league
    teamCounts?.forEach(team => {
      const currentCount = teamCountsMap.get(team.league_id) || 0;
      teamCountsMap.set(team.league_id, currentCount + 1);
    });

    // Transform the data
    const leagues: LeagueWithTeamCount[] = leaguesData.map(league => {
      const teamCount = teamCountsMap.get(league.id) || 0;
      const maxTeams = league.max_teams || 20;
      const spotsRemaining = Math.max(0, maxTeams - teamCount);

      // Get gyms for this league
      const leagueGyms = (league.gym_ids || [])
        .map((gymId: number) => gymsMap.get(gymId))
        .filter(gym => gym !== undefined);

      return {
        ...league,
        sport_name: league.sports?.name || null,
        skill_name: league.skills?.name || null,
        gyms: leagueGyms,
        team_count: teamCount,
        spots_remaining: spotsRemaining
      };
    });

    return leagues;
  } catch (error) {
    console.error('Error in fetchLeagues:', error);
    return [];
  }
};

// Fetch a specific league by ID
export const fetchLeagueById = async (id: number): Promise<League | null> => {
  try {
    const { data, error } = await supabase
      .from('leagues')
      .select(`
        *,
        sports:sport_id(name),
        skills:skill_id(name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching league:', error);
      return null;
    }

    if (!data) return null;

    // Get gym information if gym_ids exist
    let gyms: Array<{ id: number; gym: string | null; address: string | null }> = [];
    if (data.gym_ids && data.gym_ids.length > 0) {
      const { data: gymsData, error: gymsError } = await supabase
        .from('gyms')
        .select('id, gym, address')
        .in('id', data.gym_ids);

      if (gymsError) {
        console.error('Error fetching gyms:', gymsError);
      } else {
        gyms = gymsData || [];
      }
    }

    return {
      ...data,
      sport_name: data.sports?.name || null,
      skill_name: data.skills?.name || null,
      gyms: gyms || []
    };
  } catch (error) {
    console.error('Error in fetchLeagueById:', error);
    return null;
  }
};

// Fetch available sports for filtering
export const fetchSports = async () => {
  const { data, error } = await supabase
    .from('sports')
    .select('id, name')
    .eq('active', true)
    .order('name');

  if (error) {
    console.error('Error fetching sports:', error);
    return [];
  }

  return data || [];
};

// Fetch available skills for filtering
export const fetchSkills = async () => {
  const { data, error } = await supabase
    .from('skills')
    .select('id, name')
    .order('order_index');

  if (error) {
    console.error('Error fetching skills:', error);
    return [];
  }

  return data || [];
};