import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/toast';
import { supabase } from '../../../lib/supabase';
import { getUserSubscription } from '../../../lib/stripe';
import { getUserPaymentSummary, getUserLeaguePayments, type LeaguePayment } from '../../../lib/payments';
import { Users, Calendar, CheckCircle, CreditCard, AlertCircle, Crown, DollarSign, Clock, X } from 'lucide-react';
import { TeamDetailsModal } from './TeamDetailsModal';
import { getDayName } from '../../../lib/leagues';
import { getProductByPriceId } from '../../../stripe-config';
import { Button } from '../../../components/ui/button';

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

  // Helper function to get primary gym location
  const getPrimaryLocation = (gyms: Array<{ gym: string | null }>) => {
    if (!gyms || gyms.length === 0) return 'Location TBD';
    return gyms[0]?.gym || 'Location TBD';
  };

  // Helper function to format cost with icon
  const formatCostWithIcon = (cost: number | null) => {
    if (!cost) return 'Cost TBD';
    return `$${cost}`;
  };

  // Get subscription status display
  const getSubscriptionStatus = () => {
    if (!subscription) return null;
    
    const product = getProductByPriceId(subscription.price_id);
    
    return {
      status: subscription.subscription_status,
      productName: product?.name || 'Unknown Product',
      isActive: subscription.subscription_status === 'active'
    };
  };

  const subscriptionStatus = getSubscriptionStatus();

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
      {subscriptionStatus && (
        <div className={`rounded-lg p-4 mb-6 ${
          subscriptionStatus.isActive 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-orange-50 border border-orange-200'
        }`}>
          <div className="flex items-center gap-2">
            {subscriptionStatus.isActive ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-orange-600" />
            )}
            <div>
              <p className={`font-medium ${
                subscriptionStatus.isActive ? 'text-green-800' : 'text-orange-800'
              }`}>
                {subscriptionStatus.isActive ? 'Active Subscription' : 'Subscription Status'}
              </p>
              <p className={`text-sm ${
                subscriptionStatus.isActive ? 'text-green-700' : 'text-orange-700'
              }`}>
                {subscriptionStatus.productName} - {subscriptionStatus.status}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Amount Owing - Updated with payment summary data */}
        <div className={`${outstandingBalance > 0 ? 'bg-orange-50' : 'bg-gray-50'} rounded-lg p-6 flex items-center justify-between`}>
          <div>
            <div className={`text-2xl font-bold mb-1 ${outstandingBalance > 0 ? 'text-orange-600' : 'text-gray-600'}`}>
              ${outstandingBalance.toFixed(2)}
            </div>
            <div className="text-[#6F6F6F]">Amount Owing</div>
          </div>
          {outstandingBalance > 0 ? (
            <AlertCircle className="h-8 w-8 text-orange-600" />
          ) : (
            <CheckCircle className="h-8 w-8 text-gray-600" />
          )}
        </div>
      </div>

      {/* Outstanding Balance Notice - Enhanced with payment details */}
      {outstandingBalance > 0 && (
        <div className="bg-orange-100 border border-orange-300 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <span className="font-medium text-orange-800">Payment Required</span>
          </div>
          <p className="text-orange-700 text-sm mb-3">
            You have an outstanding balance of <span className="font-medium">${outstandingBalance.toFixed(2)}</span> for league registration fees.
          </p>
          
          {/* Payment breakdown */}
          {paymentSummary && (
            <div className="text-orange-700 text-sm">
              <div className="flex gap-4">
                {paymentSummary.pending_payments > 0 && (
                  <span>{paymentSummary.pending_payments} pending payment{paymentSummary.pending_payments !== 1 ? 's' : ''}</span>
                )}
                {paymentSummary.overdue_payments > 0 && (
                  <span className="font-medium">{paymentSummary.overdue_payments} overdue payment{paymentSummary.overdue_payments !== 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
          )}
          
          <p className="text-orange-700 text-sm mt-2">
            Please contact us at <a href="mailto:info@ofsl.ca" className="underline">info@ofsl.ca</a> to arrange payment.
          </p>
        </div>
      )}

      {/* League Payments Section - New */}
      {leaguePayments.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#6F6F6F] mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            League Payments
          </h3>
          
          <div className="space-y-3">
            {leaguePayments.map(payment => (
              <div key={payment.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-[#6F6F6F]">{payment.league_name}</h4>
                    {payment.team_name && (
                      <p className="text-sm text-[#6F6F6F]">Team: {payment.team_name}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-[#6F6F6F]">
                      <span>Due: ${payment.amount_due.toFixed(2)}</span>
                      <span>Paid: ${payment.amount_paid.toFixed(2)}</span>
                      {payment.amount_outstanding > 0 && (
                        <span className="text-orange-600 font-medium">
                          Outstanding: ${payment.amount_outstanding.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {payment.due_date && (
                      <div className="flex items-center gap-1 mt-1 text-sm text-[#6F6F6F]">
                        <Clock className="h-3 w-3" />
                        <span>Due: {new Date(payment.due_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                      payment.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                      payment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                    
                    <Button
                      onClick={() => handleUnregister(payment.id, payment.league_name)}
                      disabled={unregisteringPayment === payment.id}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-1 text-xs flex items-center gap-1"
                    >
                      {unregisteringPayment === payment.id ? (
                        'Unregistering...'
                      ) : (
                        <>
                          <X className="h-3 w-3" />
                          Unregister
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
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
                        <DollarSign className="h-4 w-4" />
                        <span>{formatCostWithIcon(team.league?.cost)}</span>
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
                      <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        <Crown className="h-3 w-3" />
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