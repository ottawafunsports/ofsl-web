import { Link } from 'react-router-dom';
import { Button } from '../../../../../components/ui/button';
import { Calendar, Crown, Users, DollarSign, MapPin, User } from 'lucide-react';
import { getDayName } from '../../../../../lib/leagues';

interface TeamCardProps {
  team: {
    id: number;
    name: string;
    captain_id: string;
    captain_name: string | null;
    league_id: number;
    league?: {
      id: number;
      name: string;
      day_of_week: number | null;
      cost: number | null;
      location: string | null;
      sports?: {
        name: string;
      } | null;
    } | null;
    skill?: {
      name: string;
    } | null;
    payment?: {
      id: number;
      amount_due: number;
      amount_paid: number;
      status: string;
    };
    roster: string[];
  };
  currentUserId: string;
  onManageTeam: (team: any) => void;
  onPayNow?: (paymentId: number) => void;
  showDeleteTeamConfirmation: (team: any) => void;
  showLeaveTeamConfirmation: (team: any) => void;
  deletingTeam: number | null;
  unregisteringPayment: number | null;
}

export function TeamCard({ 
  team, 
  currentUserId, 
  onManageTeam, 
  onPayNow,
  showDeleteTeamConfirmation,
  showLeaveTeamConfirmation,
  deletingTeam,
  unregisteringPayment
}: TeamCardProps) {
  const isCaptain = currentUserId === team.captain_id;
  
  const handleManageTeam = () => {
    onManageTeam(team);
  };

  const handlePayNow = (paymentId: number) => {
    if (onPayNow) {
      onPayNow(paymentId);
    }
  };
  
  // Function to get day name from day number
  const getDayName = (day: number | null | undefined): string => {
    if (day === null || day === undefined) return 'Day TBD';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day] || 'Day TBD';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#6F6F6F] mb-2">{team.league?.name || 'Unknown League'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mt-4">
            {/* Captain */}
            <div className="flex items-center gap-2" title="Captain">
              <Crown className="h-5 w-5 text-yellow-500" />
              <p className="text-[#6F6F6F]">{team.captain_id === currentUserId ? 'You' : (team.captain_name || 'Unknown')}</p>
            </div>

            {/* Team Size */}
            <div className="flex items-center gap-2" title="Players">
              <Users className="h-5 w-5 text-blue-500" />
              <p className="text-[#6F6F6F]">{team.roster?.length || 0} players</p>
            </div>

            {/* Day */}
            <div className="flex items-center gap-2" title="Day">
              <Calendar className="h-5 w-5 text-green-500" />
              <p className="text-[#6F6F6F]">{getDayName(team.league?.day_of_week) || 'Day TBD'}</p>
            </div>

            {/* Payment Info */}
            <div className="flex items-center gap-2" title="Payment">
              <DollarSign className="h-5 w-5 text-purple-500" />
              {team.payment ? (
                <div className="flex items-center gap-2">
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
                </div>
              ) : (
                <p className="text-[#6F6F6F]">
                  ${team.league?.cost ? parseFloat(team.league.cost.toString()).toFixed(2) : '0.00'}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
          {/* Skill Level */}
          {team.skill?.name && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {team.skill.name}
            </span>
          )}

          {/* Payment Status */}
          {team.payment?.status && (
            <span className={`px-3 py-1 text-sm rounded-full ${
              team.payment.status === 'paid' ? 'bg-green-100 text-green-800' :
              team.payment.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
              team.payment.status === 'overdue' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {team.payment.status.charAt(0).toUpperCase() + team.payment.status.slice(1)}
            </span>
          )}
        </div>
      </div>
      
      {/* Location and other details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-[#6F6F6F]">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4 text-[#B20000]" />
          <span>{team.league?.location || 'Location TBD'}</span>
        </div>
        <div className="flex items-center gap-1">
          <User className="h-4 w-4 text-[#B20000]" />
          <span>Team: {team.name}</span>
        </div>
      </div>
      
      {/* Payment Due Notification */}
      
      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
        {/* Skill Level Badge */}
        <div></div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleManageTeam}
            className="border border-[#B20000] bg-white hover:bg-[#B20000] hover:text-white text-[#B20000] rounded-lg px-3 py-1.5 text-sm transition-colors flex items-center gap-1 h-auto"
          >
            <Users className="h-3 w-3" />
            {team.captain_id === currentUserId ? 'Manage' : 'View'}
          </Button>
          
          {/* Pay Now Button */}
          {team.payment && 
           team.payment.amount_due > team.payment.amount_paid && 
           team.captain_id === currentUserId && onPayNow && (
            <Button
              onClick={() => handlePayNow(team.payment!.id)}
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-3 py-1.5 text-sm transition-colors flex items-center gap-1 h-auto"
            >
              <DollarSign className="h-3 w-3" />
              Pay
            </Button>
          )}
          
          {/* Delete/Leave Team Button */}
          {team.captain_id === currentUserId ? (
            <Button
              onClick={() => showDeleteTeamConfirmation(team)}
              disabled={deletingTeam === team.id}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-1.5 text-sm transition-colors flex items-center gap-1 h-auto"
            >
              {deletingTeam === team.id ? (
                'Deleting...'
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                  Deregister
                </>
              )}
            </Button>
          ) : (
            team.payment && (
              <Button
                onClick={() => showLeaveTeamConfirmation(team)}
                disabled={unregisteringPayment === team.payment?.id}
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-1.5 text-sm transition-colors flex items-center gap-1 h-auto"
              >
                {unregisteringPayment === team.payment?.id ? (
                  'Removing...'
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                    Leave
                  </>
                )}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}