import { Link } from 'react-router-dom';
import { Button } from '../../../../../components/ui/button';
import { Calendar, Crown, CreditCard, Users, DollarSign, MapPin, User } from 'lucide-react';
import { getDayName } from '../../../../../lib/leagues';

interface TeamCardProps {
  team: {
    id: number;
    name: string;
    captain_id: string;
    league_id: number;
    league?: {
      id: number;
      name: string;
      day_of_week: number | null;
      cost: number | null;
      sports?: {
        name: string;
      } | null;
    } | null;
    gyms: Array<{
      id: number;
      gym: string | null;
      address: string | null;
    }>;
    payment?: {
      id: number;
      amount_due: number;
      amount_paid: number;
      status: string;
      amount_due: number;
      amount_paid: number;
      status: string;
    };
  };
  currentUserId: string;
  onManageTeam: () => void;
  onPayNow?: (paymentId: number) => void;
}

export function TeamCard({ team, currentUserId, onManageTeam, onPayNow }: TeamCardProps) {
  const isCaptain = currentUserId === team.captain_id;
  
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
        <div className="flex-1 space-y-2">
          <Link 
            to={`/leagues/${team.league_id}`}
            className="block"
          >
            <h3 className="text-lg font-bold text-[#6F6F6F] hover:text-[#B20000] transition-colors cursor-pointer">
              {team.league?.name || 'Unknown League'}
            </h3>
          </Link>
          
          <div className="flex flex-col text-sm text-[#6F6F6F] space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{getDayName(team.league?.day_of_week) || 'Day TBD'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{team.league?.location || 'Location TBD'}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Team: {team.name}</span>
            </div>
          </div>
        </div>
        
        {/* Team Size */}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-500" />
          <p className="text-[#6F6F6F]">{team.roster?.length || 0} players</p>
        </div>
        
        {/* Payment Info */}
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-purple-500" />
          <div className="overflow-hidden">
            {team.payment ? (
              <div className="flex items-center gap-1">
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
              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
                Pending
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Payment due notification */}
      {team.payment && team.payment.amount_due > team.payment.amount_paid && team.captain_id === currentUserId && (
        <div className="mb-4 flex items-center gap-2 text-sm bg-orange-50 p-2 rounded-lg">
          <DollarSign className="h-4 w-4 text-orange-500" />
          <span className="text-orange-600 font-medium">
            Payment due: ${(team.payment.amount_due - team.payment.amount_paid).toFixed(2)}
          </span>
          {onPayNow && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); 
                onPayNow(team.payment!.id);
              }}
              className="ml-auto bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded"
            >
              Pay Now
            </Button>
          )}
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 justify-end">
        <button
          onClick={() => handleManageTeam(team)}
          className="border border-[#B20000] bg-white hover:bg-[#B20000] hover:text-white text-[#B20000] rounded-lg px-3 py-1.5 text-sm transition-colors flex items-center gap-1"
        >
          <Users className="h-3 w-3" />
          {team.captain_id === currentUserId ? 'Manage' : 'View'}
        </button>
        
        {/* Pay Now Button */}
        {team.payment && 
         team.payment.amount_due > team.payment.amount_paid && 
         team.captain_id === currentUserId && (
          <button
            onClick={() => handlePayNow(team.payment!.id)}
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-3 py-1.5 text-sm transition-colors flex items-center gap-1 whitespace-nowrap"
          >
            <DollarSign className="h-3 w-3" />
            Pay
          </button>
        )}
        
        {/* Delete/Leave Team Button */}
        {team.captain_id === currentUserId ? (
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
                Deregister
              </>
            )}
          </button>
        ) : (
          team.payment && (
            <button
              onClick={() => showLeaveTeamConfirmation(team)}
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

        {/* Team metadata and badges */}
        <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
          {/* Skill Level */}
          {team.skill?.name && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {team.skill.name}
            </span>
          )}
          
          {/* Captain Badge */}
          {team.captain_id === currentUserId && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center gap-1">
              <Crown className="h-3 w-3" />
              Captain
            </span>
          )}
        </div>
      </div>
      
      {/* Team details grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 text-sm">
        {/* Captain Info */}
        <div className="flex items-center gap-2">
          <Crown className="h-4 w-4 text-yellow-500" />
          <div className="overflow-hidden">
            <p className="text-[#6F6F6F] truncate">
              {team.captain_id === currentUserId ? 'You' : team.captain_name || 'Unknown'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}