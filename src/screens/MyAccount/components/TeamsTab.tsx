import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/toast';
import { supabase } from '../../../lib/supabase';
import { Users, Calendar, CheckCircle } from 'lucide-react';
import { TeamDetailsModal } from './TeamDetailsModal';
import { getDayName } from '../../../lib/leagues';

interface Team {
  id: number;
  name: string;
  league_id: number;
  captain_id: string;
  roster: string[];
  skill_level_id: number | null;
  active: boolean;
  created_at: string;
  league: {
    id: number;
    name: string;
    day_of_week: number | null;
    cost: number | null;
    gym_ids: number[] | null;
    sports: {
      name: string;
    } | null;
  } | null;
  skill: {
    name: string;
  } | null;
  roster_details: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  gyms: Array<{
    id: number;
    gym: string | null;
    address: string | null;
  }>;
}

export function TeamsTab() {
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [showTeamDetailsModal, setShowTeamDetailsModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Stats calculations from actual data
  const activeTeams = teams.filter(team => team.active).length;
  
  // For now, using placeholder data for stats that require additional tables
  // In a real implementation, these would come from schedule/games tables
  const nextGameDate = "TBD"; // Would come from schedule table
  const totalWins = "TBD"; // Would come from games/results table

  useEffect(() => {
    loadUserTeams();
  }, [userProfile]);

  const loadUserTeams = async () => {
    if (!userProfile) return;

    try {
      setTeamsLoading(true);
      
      // Fetch teams with league and sport information
      const { data: teamsData, error } = await supabase
        .from('teams')
        .select(`
          *,
          leagues:league_id(
            id,
            name,
            day_of_week,
            cost,
            gym_ids,
            sports:sport_id(name)
          ),
          skills:skill_level_id(name)
        `)
        .or(`captain_id.eq.${userProfile.id},roster.cs.{${userProfile.id}}`)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process teams and fetch additional data
      const teamsWithFullDetails = await Promise.all(
        (teamsData || []).map(async (team) => {
          let rosterDetails: Array<{ id: string; name: string; email: string; }> = [];
          let gyms: Array<{ id: number; gym: string | null; address: string | null; }> = [];

          // Fetch roster details if roster exists
          if (team.roster && team.roster.length > 0) {
            const { data: rosterData, error: rosterError } = await supabase
              .from('users')
              .select('id, name, email')
              .in('id', team.roster);

            if (rosterError) {
              console.error('Error loading roster for team:', team.id, rosterError);
            } else {
              rosterDetails = rosterData || [];
            }
          }

          // Fetch gym details if gym_ids exist in league
          if (team.leagues?.gym_ids && team.leagues.gym_ids.length > 0) {
            const { data: gymsData, error: gymsError } = await supabase
              .from('gyms')
              .select('id, gym, address')
              .in('id', team.leagues.gym_ids);

            if (gymsError) {
              console.error('Error loading gyms for league:', team.league_id, gymsError);
            } else {
              gyms = gymsData || [];
            }
          }

          return {
            ...team,
            league: team.leagues,
            skill: team.skills,
            roster_details: rosterDetails,
            gyms: gyms
          };
        })
      );

      setTeams(teamsWithFullDetails);
    } catch (error) {
      console.error('Error loading user teams:', error);
      showToast('Failed to load teams', 'error');
    } finally {
      setTeamsLoading(false);
    }
  };

  const handleManageTeam = (team: Team) => {
    setSelectedTeam(team);
    setShowTeamDetailsModal(true);
  };

  const handlePlayersUpdated = () => {
    loadUserTeams();
  };

  // Helper function to get primary gym location
  const getPrimaryLocation = (gyms: Array<{ gym: string | null }>) => {
    if (!gyms || gyms.length === 0) return 'Location TBD';
    return gyms[0]?.gym || 'Location TBD';
  };

  // Helper function to format cost
  const formatCost = (cost: number | null) => {
    if (!cost) return 'Cost TBD';
    return `$${cost}`;
  };

  if (teamsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B20000]"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Active Teams */}
        <div className="bg-red-50 rounded-lg p-6 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-[#B20000] mb-1">{activeTeams}</div>
            <div className="text-[#6F6F6F]">Active Teams</div>
          </div>
          <Users className="h-8 w-8 text-[#B20000]" />
        </div>

        {/* Next Game */}
        <div className="bg-blue-50 rounded-lg p-6 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-blue-600 mb-1">{nextGameDate}</div>
            <div className="text-[#6F6F6F]">Next Game</div>
          </div>
          <Calendar className="h-8 w-8 text-blue-600" />
        </div>

        {/* Total Wins */}
        <div className="bg-green-50 rounded-lg p-6 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-green-600 mb-1">{totalWins}</div>
            <div className="text-[#6F6F6F]">Total Wins</div>
          </div>
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
      </div>

      {/* Your Teams Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#6F6F6F] mb-6">Your Teams</h2>
        
        {teams.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#6F6F6F] text-lg mb-4">You haven't joined any teams yet.</p>
            <p className="text-[#6F6F6F]">Browse our leagues and register a team to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {teams.map(team => (
              <div key={team.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#6F6F6F] mb-2">
                      {team.league?.name || 'Unknown League'} - Winter 2025
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#6F6F6F] mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{getDayName(team.league?.day_of_week) || 'Day TBD'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13C19,5.13 15.87,2 12,2zM7,9c0,-2.76 2.24,-5 5,-5s5,2.24 5,5c0,2.88 -2.88,7.19 -5,9.88C9.92,16.21 7,11.85 7,9z"/>
                          <circle cx="12" cy="9" r="2.5"/>
                        </svg>
                        <span>{getPrimaryLocation(team.gyms)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{formatCost(team.league?.cost)}</span>
                      </div>
                      <div>
                        <span>Record: TBD</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-[#6F6F6F]">
                      <span className="font-medium">Next Game:</span> Schedule TBD
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {userProfile?.id === team.captain_id && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        Captain
                      </span>
                    )}
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      Active
                    </span>
                    <button
                      onClick={() => handleManageTeam(team)}
                      className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-lg px-4 py-2 text-sm transition-colors"
                    >
                      Manage Players
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team Details Modal */}
      {selectedTeam && (
        <TeamDetailsModal
          showModal={showTeamDetailsModal}
          closeModal={() => setShowTeamDetailsModal(false)}
          team={selectedTeam}
          currentUserId={userProfile?.id || ''}
          onPlayersUpdated={handlePlayersUpdated}
        />
      )}
    </div>
  );
}