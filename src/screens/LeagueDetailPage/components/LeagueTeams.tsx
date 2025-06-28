import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { supabase } from '../../../lib/supabase';
import { Crown, Users, Calendar, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TeamData {
  id: number;
  name: string;
  captain_id: string;
  roster: string[];
  created_at: string;
  skill_level_id: number | null;
  captain_name: string | null;
  skill_name: string | null;
  payment_status: 'pending' | 'partial' | 'paid' | 'overdue' | null;
  amount_due: number | null;
  amount_paid: number | null;
}

interface LeagueTeamsProps {
  leagueId: number;
  onTeamsUpdate?: () => void;
}

export function LeagueTeams({ leagueId, onTeamsUpdate }: LeagueTeamsProps) {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTeams();
  }, [leagueId]);

  useEffect(() => {
    // Notify parent when teams data changes
    if (onTeamsUpdate) {
      onTeamsUpdate();
    }
  }, [teams, onTeamsUpdate]);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get teams with captain info and skill level
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          captain_id,
          roster,
          created_at,
          skill_level_id,
          users:captain_id(name),
          skills:skill_level_id(name)
        `)
        .eq('league_id', leagueId)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (teamsError) throw teamsError;

      if (!teamsData) {
        setTeams([]);
        return;
      }

      // Get payment information for each team
      const teamsWithPayments = await Promise.all(
        teamsData.map(async (team) => {
          const { data: paymentData, error: paymentError } = await supabase
            .from('league_payments')
            .select('status, amount_due, amount_paid')
            .eq('team_id', team.id)
            .eq('league_id', leagueId)
            .maybeSingle();

          if (paymentError) {
            console.error('Error fetching payment for team:', team.id, paymentError);
          }

          return {
            id: team.id,
            name: team.name,
            captain_id: team.captain_id,
            roster: team.roster || [],
            created_at: team.created_at,
            skill_level_id: team.skill_level_id,
            captain_name: team.users?.name || null,
            skill_name: team.skills?.name || null,
            payment_status: paymentData?.status || null,
            amount_due: paymentData?.amount_due || null,
            amount_paid: paymentData?.amount_paid || null,
          };
        })
      );

      setTeams(teamsWithPayments);
    } catch (err) {
      console.error('Error loading teams:', err);
      setError('Failed to load teams data');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatusColor = (status: string | null) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B20000]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-xl font-bold text-[#6F6F6F] mb-2">No Teams Registered</h3>
        <p className="text-[#6F6F6F]">No teams have registered for this league yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#6F6F6F]">Registered Teams</h2>
        <div className="text-sm text-[#6F6F6F]">
          Total Teams: {teams.length}
        </div>
      </div>

      <div className="space-y-4">
        {teams.map((team) => (
          <Card key={team.id} className="shadow-md overflow-hidden rounded-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#6F6F6F] mb-2">{team.name}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    {/* Captain */}
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <div>
                        <span className="font-medium text-[#6F6F6F]">Captain:</span>
                        <p className="text-[#6F6F6F]">{team.captain_name || 'Unknown'}</p>
                      </div>
                    </div>

                    {/* Team Size */}
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <div>
                        <span className="font-medium text-[#6F6F6F]">Players:</span>
                        <p className="text-[#6F6F6F]">{team.roster.length}</p>
                      </div>
                    </div>

                    {/* Registration Date */}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-500" />
                      <div>
                        <span className="font-medium text-[#6F6F6F]">Registered:</span>
                        <p className="text-[#6F6F6F]">{formatDate(team.created_at)}</p>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-purple-500" />
                      <div>
                        <span className="font-medium text-[#6F6F6F]">Payment:</span>
                        {team.amount_due && team.amount_paid !== null ? (
                          <p className="text-[#6F6F6F]">
                            ${team.amount_paid.toFixed(2)} / ${team.amount_due.toFixed(2)}
                          </p>
                        ) : (
                          <p className="text-[#6F6F6F]">No payment required</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 ml-4">
                  {/* Skill Level */}
                  {team.skill_name && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {team.skill_name}
                    </span>
                  )}

                  {/* Payment Status */}
                  {team.payment_status && (
                    <span className={`px-3 py-1 text-sm rounded-full ${getPaymentStatusColor(team.payment_status)}`}>
                      {team.payment_status.charAt(0).toUpperCase() + team.payment_status.slice(1)}
                    </span>
                  )}

                  {/* Edit Registration Link */}
                  <Link 
                    to={`/my-account/teams/edit/${team.id}`}
                    className="text-[#B20000] hover:text-[#8A0000] text-sm hover:underline"
                  >
                    Edit registration
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}