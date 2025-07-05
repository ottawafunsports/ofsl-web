import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import { useToast } from '../../../../components/ui/toast';
import { supabase } from '../../../../lib/supabase'; 
import { getUserSubscription, createPaymentIntent } from '../../../../lib/stripe';
import { getUserPaymentSummary, getUserLeaguePayments, type LeaguePayment } from '../../../../lib/payments';
import { getProductByLeagueId, formatPrice } from '../../../../stripe-config';
import { Users, Calendar, CheckCircle, AlertCircle, CreditCard, AlertTriangle, Crown, DollarSign, Trash2, User } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { TeamDetailsModal } from '../TeamDetailsModal';
import { StatsCard } from './components/StatsCard';
import { TeamCard } from './components/TeamCard';
import { PaymentCard } from './components/PaymentCard';
import { BalanceNotice } from './components/BalanceNotice';
import { ConfirmationModal } from './components/ConfirmationModal';
import { SubscriptionBanner } from './components/SubscriptionBanner';
import { PaymentModal } from '../../../../components/PaymentModal';

interface Team {
  id: number;
  name: string;
  captain_name: string | null;
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

interface TeamWithPayment extends Team {
  payment?: LeaguePayment;
}

// Helper function to get day name
const getDayName = (dayNumber: number | null | undefined): string => {
  if (dayNumber === null || dayNumber === undefined) return 'Day TBD';
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNumber] || 'Day TBD';
};

export function TeamsTab() {
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  
  const [teams, setTeams] = useState<TeamWithPayment[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [showTeamDetailsModal, setShowTeamDetailsModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamWithPayment | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  
  // Payment-related state
  const [outstandingBalance, setOutstandingBalance] = useState<number>(0);
  const [paymentSummary, setPaymentSummary] = useState<any>(null);
  const [leaguePayments, setLeaguePayments] = useState<LeaguePayment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<LeaguePayment | null>(null);

  // Add state for unregistering
  const [unregisteringPayment, setUnregisteringPayment] = useState<number | null>(null);

  // Add state for deleting team
  const [deletingTeam, setDeletingTeam] = useState<number | null>(null);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => {},
    action: '' as 'unregister' | 'delete' | '',
    itemId: null as number | null,
    itemName: ''
  });

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

  const showUnregisterConfirmation = (paymentId: number, leagueName: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Confirm Unregistration',
      message: `Are you sure you want to delete your registration for ${leagueName}? This action cannot be undone and you will lose your spot in the league.`,
      confirmText: 'Yes, Unregister',
      cancelText: 'Cancel',
      onConfirm: () => handleUnregister(paymentId, leagueName),
      action: 'unregister',
      itemId: paymentId,
      itemName: leagueName
    });
  };

  const handleUnregister = async (paymentId: number, leagueName: string) => {
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

      showToast('Successfully deleted league registration', 'success');
      
      // Reload all data to update the UI and amounts
      await loadPaymentData();
      await loadUserTeams();
      
      // Reload the page to stay on current tab and refresh all data
      window.location.reload();
      
    } catch (error: any) {
      console.error('Error deleting league registration:', error);
      showToast(error.message || 'Failed to delete league registration', 'error');
    } finally {
      setUnregisteringPayment(null);
    }
  };

  const showDeleteTeamConfirmation = (team: TeamWithPayment) => {
    setConfirmModal({
      isOpen: true,
      title: 'Confirm Team Deletion',
      message: `Are you sure you want to delete the team "${team.name}"? This action cannot be undone and will remove all team data including registrations and payment records.`,
      confirmText: 'Yes, Delete Team',
      cancelText: 'Cancel',
      onConfirm: () => handleDeleteTeam(team),
      action: 'delete',
      itemId: team.id,
      itemName: team.name
    });
  };

  const handleDeleteTeam = async (team: TeamWithPayment) => {
    try {
      setDeletingTeam(team.id);
      
      // 1. Update team_ids for all users in the roster
      if (team.roster && team.roster.length > 0) {
        for (const userId of team.roster) {
          const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('team_ids')
            .eq('id', userId)
            .single();
            
          if (fetchError) {
            console.error(`Error fetching user ${userId}:`, fetchError);
            continue;
          }
          
          if (userData) {
            const updatedTeamIds = (userData.team_ids || []).filter((id: number) => id !== team.id);
            
            const { error: updateError } = await supabase
              .from('users')
              .update({ team_ids: updatedTeamIds })
              .eq('id', userId);
              
            if (updateError) {
              console.error(`Error updating user ${userId}:`, updateError);
            }
          }
        }
      }
      
      // 2. Delete the team (league_payments will be deleted via ON DELETE CASCADE)
      const { error: deleteError } = await supabase
        .from('teams')
        .delete()
        .eq('id', team.id);
        
      if (deleteError) throw deleteError;
      
      showToast('Team deleted successfully', 'success');
      
      // Reload all data to update the UI
      await loadPaymentData();
      await loadUserTeams();
      
    } catch (error: any) {
      console.error('Error deleting team:', error);
      showToast(error.message || 'Failed to delete team', 'error');
    } finally {
      setDeletingTeam(null);
    }
  };

  const closeConfirmModal = () => {
    setConfirmModal(prev => ({
      ...prev,
      isOpen: false
    }));
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
        .order('created_at', { ascending: false })
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process teams and fetch additional data
      const teamsWithFullDetails = await Promise.all(
        (teamsData || []).map(async (team) => {
          // Get captain name
          let captainName = null;
          if (team.captain_id) {
            const { data: captainData, error: captainError } = await supabase
              .from('users')
              .select('name')
              .eq('id', team.captain_id)
              .single();
              
            if (!captainError && captainData) {
              captainName = captainData.name;
            }
          }
          
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
            captain_name: captainName,
            skill: team.skills,
            roster_details: rosterDetails,
            gyms: gyms
          };
        })
      );
      
      // Get all league payments
      const payments = await getUserLeaguePayments();
      
      // Merge payments with teams
      const teamsWithPayments = teamsWithFullDetails.map(team => {
        const payment = payments.find(p => p.team_id === team.id);
        return {
          ...team,
          payment
        };
      });

      setTeams(teamsWithPayments);
    } catch (error) {
      console.error('Error loading user teams:', error);
      showToast('Failed to load teams', 'error');
    } finally {
      setTeamsLoading(false);
    }
  };

  const handleManageTeam = (team: Team) => {
    setSelectedTeam(team as TeamWithPayment);
    setShowTeamDetailsModal(true);
  };

  const handlePlayersUpdated = () => {
    loadUserTeams();
  };

  const handlePayNow = (paymentId: number) => {
    const payment = leaguePayments.find(p => p.id === paymentId);
    if (payment) {
      // Use custom payment modal
      setSelectedPayment(payment);
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    // Reload payment data and teams
    loadPaymentData();
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
                      <Link 
                        to={`/leagues/${team.league_id}`}
                        className="block"
                      >
                        <h3 className="text-lg font-bold text-[#6F6F6F] mb-2 hover:text-[#B20000] transition-colors cursor-pointer">
                          {team.league?.name || 'Unknown League'}
                        </h3>
                      </Link>
                      
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
                          <span>{team.gyms && team.gyms.length > 0 ? team.gyms[0]?.gym || 'Location TBD' : 'Location TBD'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>Team: {team.name}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {/* Captain Info */}
                        <div className="flex items-center gap-2">
                          <Crown className="h-5 w-5 text-yellow-500" />
                          <div>
                            <p className="text-[#6F6F6F]">
                              {team.captain_id === userProfile?.id ? userProfile.name : team.captain_name || 'Unknown'}
                              {team.captain_id === userProfile?.id && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">You</span>
                              )}
                            </p>
                          </div>
                        </div>
                        
                        {/* Team Size */}
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-[#6F6F6F]">{team.roster.length} players</p>
                          </div>
                        </div>
                        
                        {/* Payment Info */}
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-purple-500" />
                          <div className="flex items-center gap-2">
                            {team.payment ? (
                              <>
                                <p className="text-[#6F6F6F]">
                                  ${team.payment.amount_paid.toFixed(2)} / ${team.payment.amount_due.toFixed(2)}
                                </p>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                  team.payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                                  team.payment.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                                  team.payment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {team.payment.status.charAt(0).toUpperCase() + team.payment.status.slice(1)}
                                </span>
                              </>
                            ) : (
                              <div className="flex items-center gap-2">
                                <p className="text-[#6F6F6F]">
                                  $0.00 / ${team.league?.cost ? parseFloat(team.league.cost.toString()).toFixed(2) : '0.00'}
                                </p>
                                <span className="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-800">
                                  Pending
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 ml-4">
                      <div className="flex flex-col items-end w-full">
                        {/* Skill Level */}
                        {team.skill?.name && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full mb-2">
                            {team.skill.name}
                          </span>
                        )}
                        
                        {/* Action Buttons - Horizontal layout */}
                        <div className="flex gap-2 mt-1 justify-end">
                          <button
                            onClick={() => handleManageTeam(team)}
                            className="border border-[#B20000] bg-white hover:bg-[#B20000] hover:text-white text-[#B20000] rounded-lg px-3 py-1.5 text-sm transition-colors flex items-center gap-1"
                          >
                            <Users className="h-3 w-3" />
                            {team.captain_id === userProfile?.id ? 'Manage' : 'View'}
                          </button>
                          
                          {/* Pay Now Button */}
                          {team.payment && 
                           team.payment.amount_due > team.payment.amount_paid && 
                           team.captain_id === userProfile?.id && (
                            <button
                              onClick={() => handlePayNow(team.payment!.id)}
                              className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-3 py-1.5 text-sm transition-colors flex items-center gap-1 whitespace-nowrap"
                            >
                              <DollarSign className="h-3 w-3" />
                              Pay
                            </button>
                          )}
                          
                          {/* Delete/Leave Team Button */}
                          {team.captain_id === userProfile?.id ? (
                            <button
                              onClick={() => showDeleteTeamConfirmation(team)}
                              disabled={deletingTeam === team.id}
                              className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-1.5 text-sm transition-colors flex items-center gap-1"
                            >
                              {deletingTeam === team.id ? (
                                'Deleting...'
                              ) : (
                                <>
                                  <Trash2 className="h-3 w-3" />
                                  Delete
                                </>
                              )}
                            </button>
                          ) : (
                            team.payment && (
                              <button
                                onClick={() => showUnregisterConfirmation(team.payment!.id, team.league?.name || 'league')}
                                disabled={unregisteringPayment === team.payment?.id}
                                className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-1.5 text-sm transition-colors flex items-center gap-1"
                              >
                                {unregisteringPayment === team.payment?.id ? (
                                  'Removing...'
                                ) : (
                                  <>
                                    <Trash2 className="h-3 w-3" />
                                    Leave
                                  </>
                                )}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
      
      {/* Payment Modal */}
      {selectedPayment && (
        <PaymentModal
          showModal={showPaymentModal}
          closeModal={() => setShowPaymentModal(false)}
          paymentId={selectedPayment.id}
          leagueName={selectedPayment.league_name}
          teamName={selectedPayment.team_name}
          amountDue={selectedPayment.amount_due}
          amountPaid={selectedPayment.amount_paid}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        onConfirm={() => {
          confirmModal.onConfirm();
          closeConfirmModal();
        }}
        onCancel={closeConfirmModal}
      />
    </div>
  );
}