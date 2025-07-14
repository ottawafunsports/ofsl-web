import { Card, CardContent } from '../../../../components/ui/card';
import { Users, Crown, Mail, Trash2 } from 'lucide-react';
import { TeamMember } from './types';

interface TeamMembersProps {
  teamMembers: TeamMember[];
  captainId: string;
  onRemoveMember: (memberId: string) => void;
}

export function TeamMembers({ teamMembers, captainId, onRemoveMember }: TeamMembersProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#6F6F6F] flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members ({teamMembers.length})
          </h3>
        </div>

        <div className="space-y-3">
          {teamMembers.length === 0 ? (
            <div className="text-center py-8 text-[#6F6F6F]">
              <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No team members found</p>
            </div>
          ) : (
            teamMembers.map((member) => (
              <div 
                key={member.id} 
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-[#6F6F6F] font-medium">
                      {(member.name || member.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#6F6F6F]">
                        {member.name || 'No Name'}
                      </span>
                      {member.id === captainId && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          <Crown className="h-3 w-3" />
                          Captain
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-[#6F6F6F]">
                      <Mail className="h-3 w-3" />
                      {member.email}
                    </div>
                  </div>
                </div>

                {member.id !== captainId && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onRemoveMember(member.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                      title="Remove from team"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}