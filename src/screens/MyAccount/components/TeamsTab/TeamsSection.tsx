import { User, MapPin, Trash2, UserPlus, Clock, DollarSign } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Team, LeaguePayment } from './types';

interface TeamsSectionProps {
  teams: Team[];
  currentUserId?: string;
  leaguePayments: LeaguePayment[];
  unregisteringPayment: number | null;
  onUnregister: (paymentId: number, leagueName: string) => void;
  onManageTeammates?: (teamId: number, teamName: string) => void;
}

export function TeamsSection({ 
  teams, 
  currentUserId, 
  leaguePayments, 
  unregisteringPayment, 
  onUnregister, 
  onManageTeammates 
}: TeamsSectionProps) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-[#6F6F6F] mb-4">My Teams</h3>
      {teams.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>You are not currently on any teams.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {teams.map(team => {
            // Find the corresponding league payment for this team
            const teamPayment = leaguePayments.find(payment => payment.team_name === team.name);
            const isCaptain = team.captain_id === currentUserId;
            
            return (
              <div key={team.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-[#6F6F6F]">{team.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{team.league?.name}</p>
                    
                    <div className="mt-3 space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>Location</span>
                      </div>
                      <div className="text-xs text-gray-500 ml-6">
                        {team.league?.location || 'TBD'}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>Team Size: {team.roster.length} players</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      team.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {team.active ? 'Active' : 'Inactive'}
                    </span>
                    {isCaptain && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        Captain
                      </span>
                    )}
                  </div>
                </div>

                {/* Payment Information */}
                {teamPayment && (
                  <div className="border-t pt-3 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Due: {new Date(teamPayment.due_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>${teamPayment.amount_paid.toFixed(2)} / ${teamPayment.amount_due.toFixed(2)}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        teamPayment.status === 'paid' ? 'bg-green-100 text-green-800' :
                        teamPayment.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                        teamPayment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {teamPayment.status.charAt(0).toUpperCase() + teamPayment.status.slice(1)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between border-t pt-3">
                  <div className="flex items-center gap-2">
                    {isCaptain && onManageTeammates && (
                      <Button
                        onClick={() => onManageTeammates(team.id, team.name)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <UserPlus className="h-4 w-4" />
                        Manage Teammates
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {teamPayment && (
                      <Button
                        onClick={() => onUnregister(teamPayment.id, teamPayment.league_name)}
                        disabled={unregisteringPayment === teamPayment.id}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
                      >
                        {unregisteringPayment === teamPayment.id ? (
                          'Removing...'
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            Delete Registration
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}