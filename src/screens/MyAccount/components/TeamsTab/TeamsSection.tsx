import { User, MapPin } from 'lucide-react';
import { Team } from './types';

interface TeamsSectionProps {
  teams: Team[];
  currentUserId?: string;
}

export function TeamsSection({ teams, currentUserId }: TeamsSectionProps) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-[#6F6F6F] mb-4">My Teams</h3>
      {teams.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>You are not currently on any teams.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {teams.map(team => (
            <div key={team.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
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
                  {team.captain_id === currentUserId && (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      Captain
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}