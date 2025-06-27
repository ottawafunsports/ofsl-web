import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/toast';
import { supabase } from '../../../lib/supabase';
import { Users } from 'lucide-react';
import { AddPlayersModal } from '../../LeagueDetailPage/components/AddPlayersModal';

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
    name: string;
    sport_name: string;
  } | null;
  skill: {
    name: string;
  } | null;
  roster_details: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}

export function TeamsTab() {
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [showAddPlayersModal, setShowAddPlayersModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {
    loadUserTeams();
  }, [userProfile]);

  const loadUserTeams = async () => {
    if (!userProfile) return;

    try {
      setTeamsLoading(true);
      
      const { data: teamsData, error } = await supabase
        .from('teams')
        .select(`
          *,
          leagues:league_id(name, sports:sport_id(name)),
          skills:skill_level_id(name)
        `)
        .or(`captain_id.eq.${userProfile.id},roster.cs.{${userProfile.id}}`)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const teamsWithRosterDetails = await Promise.all(
        (teamsData || []).map(async (team) => {
          if (team.roster && team.roster.length > 0) {
            const { data: rosterData, error: rosterError } = await supabase
              .from('users')
              .select('id, name, email')
              .in('id', team.roster);

            if (rosterError) {
              console.error('Error loading roster for team:', team.id, rosterError);
              return {
                ...team,
                league: team.leagues,
                skill: team.skills,
                roster_details: []
              };
            }

            return {
              ...team,
              league: team.leagues,
              skill: team.skills,
              roster_details: rosterData || []
            };
          }

          return {
            ...team,
            league: team.leagues,
            skill: team.skills,
            roster_details: []
          };
        })
      );

      setTeams(teamsWithRosterDetails);
    } catch (error) {
      console.error('Error loading user teams:', error);
      showToast('Failed to load teams', 'error');
    } finally {
      setTeamsLoading(false);
    }
  };

  const handleAddPlayers = (team: Team) => {
    setSelectedTeam(team);
    setShowAddPlayersModal(true);
  };

  const handlePlayersAdded = () => {
    loadUserTeams();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#6F6F6F] mb-6">My Teams</h2>
      
      {teamsLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B20000]"></div>
        </div>
      ) : teams.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-[#6F6F6F] text-lg mb-4">You haven't joined any teams yet.</p>
            <p className="text-[#6F6F6F]">Browse our leagues and register a team to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map(team => (
            <Card key={team.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#6F6F6F] mb-2">{team.name}</h3>
                    <div className="text-sm text-[#6F6F6F] space-y-1">
                      <p><span className="font-medium">League:</span> {team.league?.name || 'Unknown'}</p>
                      <p><span className="font-medium">Sport:</span> {team.league?.sport_name || 'Unknown'}</p>
                      {team.skill && (
                        <p><span className="font-medium">Skill Level:</span> {team.skill.name}</p>
                      )}
                      <p><span className="font-medium">Players:</span> {team.roster?.length || 0}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {userProfile?.id === team.captain_id && (
                      <Button
                        onClick={() => handleAddPlayers(team)}
                        className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[8px] px-3 py-1 text-sm flex items-center gap-2"
                      >
                        <Users className="h-4 w-4" />
                        Add Players
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-[#6F6F6F] mb-2">Team Roster</h4>
                  <div className="space-y-1">
                    {team.roster_details.map(player => (
                      <div key={player.id} className="flex items-center justify-between text-sm">
                        <span className="text-[#6F6F6F]">
                          {player.name || player.email}
                          {userProfile?.id === team.captain_id && player.id === team.captain_id && (
                            <span className="text-[#B20000] font-medium ml-2">(Captain)</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Players Modal */}
      {selectedTeam && (
        <AddPlayersModal
          showModal={showAddPlayersModal}
          closeModal={() => setShowAddPlayersModal(false)}
          teamId={selectedTeam.id}
          teamName={selectedTeam.name}
          currentRoster={selectedTeam.roster || []}
          onPlayersAdded={handlePlayersAdded}
        />
      )}
    </div>
  );
}