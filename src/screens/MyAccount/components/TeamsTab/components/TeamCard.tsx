import { Link } from 'react-router-dom';
import { Button } from '../../../../../components/ui/button';
import { Calendar, Crown, CreditCard, Users, DollarSign } from 'lucide-react';
import { getDayName } from '../../../../../lib/leagues';

interface TeamCardProps {
  team: {
    id: number;
    name: string;
    league_id: number;
    captain_id: string;
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
              <span>{getPrimaryLocation(team.gyms)}</span>
            </div>
            <div className="flex items-center gap-1">
              <CreditCard className="h-4 w-4" />
              <span>{formatCostWithIcon(team.league?.cost)}</span>
            </div>
            <div>
              <span>Record: TBD</span>
            </div>
            
            {/* Payment Status */}
            {team.payment && team.payment.amount_due > team.payment.amount_paid && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-orange-500" />
                <span className="text-orange-600 font-medium">
                  Payment due: ${(team.payment.amount_due - team.payment.amount_paid).toFixed(2)}
                </span>
                {onPayNow && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPayNow(team.payment!.id);
                    }}
                    className="ml-2 bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded"
                  >
                    Pay Now
                  </Button>
                )}
              </div>
            )}
          </div>
          
          <div className="text-sm text-[#6F6F6F]">
            <span className="font-medium">Next Game:</span> Schedule TBD
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          {isCaptain && (
            <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              <Crown className="h-3 w-3" />
              Captain
            </span>
          )}
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
            Active
          </span>
          <Button
            onClick={onManageTeam}
            className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-lg px-4 py-2 text-sm transition-colors"
          >
            Manage Players
          </Button>
        </div>
      </div>
    </div>
  );
}