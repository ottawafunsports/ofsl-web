import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useToast } from '../../../../components/ui/toast';
import { supabase } from '../../../../lib/supabase';
import { getUserSubscription } from '../../../../lib/stripe';
import { getUserPaymentSummary, getUserLeaguePayments, type LeaguePayment } from '../../../../lib/payments';
import { Users, Calendar, CheckCircle, AlertCircle, CreditCard } from 'lucide-react';
import { TeamDetailsModal } from '../TeamDetailsModal';
import { StatsCard } from './components/StatsCard';
import { TeamCard } from './components/TeamCard';
import { PaymentCard } from './components/PaymentCard';
import { BalanceNotice } from './components/BalanceNotice';
import { SubscriptionBanner } from './components/SubscriptionBanner';

interface Team {
  id: number;
  name: string;
  league_id: number;
  captain_id: string;
  roster: string[];
  roster_details: Array<{
    id: string;
    name: string;
    email: string;
  }>;
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
  const [subscription, setSubscription] = useState<any>(null);
  
  // Payment-related state
  const [outstandingBalance, setOutstandingBalance] = useState<number>(0);
  const [paymentSummary, setPaymentSummary] = useState<any>(null);
  const [leaguePayments, setLeaguePayments] = useState<LeaguePayment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);

  // Add state for unregistering
  const [unregisteringPayment, setUnregisteringPayment] = useState<number | null>(null);

  // Stats calculations from actual data
  const activeTeams = teams.filter(team => team.active).length;
  const captainTeams = teams.filter(team => team.captain_id === userProfile?.id);
  
  // For now, using placeholder data for stats that require additional tables
  // In a real implementation, these would come from schedule/games tables
  const nextGameDate = "TBD"; // Would come from schedule table
  const totalWins = "TBD"; // Would come from games/results table

  useEffect(() => {
    loadUserTeams();
    loadSubscription();
    loadPaymentData();
  }, [userProfile]);

  const loadSubscription = async () => {
    try {
      const subscriptionData = await getUserSubscription();
      setSubscription(subscriptionData);
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };

  const loadPaymentData = async () => {
    if (!userProfile) return;

    try {
      setPaymentsLoading(true);
      
      const [summary, payments] = await Promise.all([
        getUserPaymentSummary(),
        getUserLeaguePayments()
      ]);

      setPaymentSummary(summary);
      setLeaguePayments(payments);
      setOutstandingBalance(summary.total_outstanding);
      
    } catch (error) {
      console.error('Error loading payment data:', error);
    } finally {
      setPaymentsLoading(false);
    }
  };

  const handleUnregister = async (paymentId: number, leagueName: string) => {
    const confirmUnregister = confirm(`Are you sure you want to unregister from ${leagueName}? This action cannot be undone and you may lose your spot in the league.`);
    
    if (!confirmUnregister) return;

    try {
      setUnregisteringPayment(paymentId);
      
      // Get the league payment details first to find associated team
      const { data: paymentData, error: paymentError } = await supabase
        .from('league_payments')
        .select('team_id, league_id, user_id')
        .eq('id', paymentId);

      if (paymentError) throw paymentError;
      
      if (!paymentData || paymentData.length === 0) {
        throw new Error('Payment record not found');
      }

      const payment = paymentData[0];

      // If there's a team associated, remove user from team and update team roster
      if (payment.team_id) {
        // Get current team data
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .select('roster, captain_id')
          .eq('id', payment.team_id)
          .single();

        if (teamError) throw teamError;

        // Remove user from roster
        const updatedRoster = (teamData.roster || []).filter((userId: string) => userId !== payment.user_id);
        
        // If user was the captain and there are other players, we need to handle captain transfer
        // For now, we'll just remove them and let admin handle captain reassignment
        const updates: any = { roster: updatedRoster };
        
        // If the user was the captain and no one else is left, deactivate the team
        if (teamData.captain_id === payment.user_id) {
          if (updatedRoster.length === 0) {
            updates.active = false;
            updates.captain_id = null;
          } else {
            // Set the first remaining player as captain
            updates.captain_id = updatedRoster[0];
          }
        }

        // Update team
        const { error: updateTeamError } = await supabase
          .from('teams')
          .update(updates)
          .eq('id', payment.team_id);

        if (updateTeamError) throw updateTeamError;

        // Update user's team_ids array
        if (userProfile) {
          const currentTeamIds = userProfile.team_ids || [];
          const updatedTeamIds = currentTeamIds.filter((teamId: number) => teamId !== payment.team_id);
          
          const { error: userUpdateError } = await supabase
            .from('users')
            .update({ team_ids: updatedTeamIds })
            .eq('id', userProfile.id);

          if (userUpdateError) throw userUpdateError;
        }
      }

      // Delete the league payment record
      const { error: deleteError } = await supabase
        .from('league_payments')
        .delete()
        .eq('id', paymentId);

      if (deleteError) throw deleteError;

      showToast('Successfully unregistered from league', 'success');
      
      // Reload all data to update the UI and amounts
      await loadPaymentData();
      await loadUserTeams();
      
      // Reload the page to stay on current tab and refresh all data
      window.location.reload();
      
    } catch (error: any) {
      console.error('Error unregistering from league:', error);
      showToast(error.message || 'Failed to unregister from league', 'error');
    } finally {
      setUnregisteringPayment(null);
    }
  };

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

  if (teamsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B20000]"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Subscription Status Banner */}
      <SubscriptionBanner subscription={subscription} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Active Teams */}
        <StatsCard 
          value={activeTeams}
          label="Active Teams"
          icon={<Users className="h-8 w-8 text-[#B20000]" />}
          bgColor="bg-red-50"
          textColor="text-[#B20000]"
        />

        {/* Next Game */}
        <StatsCard 
          value={nextGameDate}
          label="Next Game"
          icon={<Calendar className="h-8 w-8 text-blue-600" />}
          bgColor="bg-blue-50"
          textColor="text-blue-600"
        />

        {/* Total Wins */}
        <StatsCard 
          value={totalWins}
          label="Total Wins"
          icon={<CheckCircle className="h-8 w-8 text-green-600" />}
          bgColor="bg-green-50"
          textColor="text-green-600"
        />

        {/* Amount Owing */}
        <StatsCard 
          value={`$${outstandingBalance.toFixed(2)}`}
          label="Amount Owing"
          icon={outstandingBalance > 0 ? 
            <AlertCircle className="h-8 w-8 text-orange-600" /> : 
            <CheckCircle className="h-8 w-8 text-gray-600" />
          }
          bgColor={outstandingBalance > 0 ? 'bg-orange-50' : 'bg-gray-50'}
          textColor={outstandingBalance > 0 ? 'text-orange-600' : 'text-gray-600'}
        />
      </div>

      {/* Outstanding Balance Notice */}
      <BalanceNotice 
        outstandingBalance={outstandingBalance} 
        paymentSummary={paymentSummary} 
      />

      {/* League Payments Section */}
      {leaguePayments.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#6F6F6F] mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            League Payments
          </h3>
          
          <div className="space-y-4">
            {leaguePayments.map(payment => (
              <PaymentCard 
                key={payment.id}
                payment={payment}
                onUnregister={handleUnregister}
                unregisteringPayment={unregisteringPayment}
              />
            ))}
          </div>
        </div>
      )}

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
              <TeamCard
                key={team.id}
                team={team}
                currentUserId={userProfile?.id || ''}
                onManageTeam={() => handleManageTeam(team)}
              />
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