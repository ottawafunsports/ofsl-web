import { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
import { TeamsSection } from './TeamsSection';
import { TeammateManagementModal } from './TeammateManagementModal';
import { useTeamsData } from './useTeamsData';
import { useTeamOperations } from './useTeamOperations';

export function TeamsTab() {
  const { user, userProfile } = useAuth();
  const { leaguePayments, teams, loading, setLeaguePayments, refetchTeams } = useTeamsData(userProfile?.id);
  const { unregisteringPayment, handleUnregister } = useTeamOperations();
  const [selectedTeam, setSelectedTeam] = useState<{id: number, name: string, roster: string[], leagueName: string} | null>(null);

  const onUnregisterSuccess = (paymentId: number) => {
    setLeaguePayments(prev => prev.filter(p => p.id !== paymentId));
  };

  const onUnregister = (paymentId: number, leagueName: string) => {
    handleUnregister(paymentId, leagueName, onUnregisterSuccess);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const handleManageTeammates = (teamId: number, teamName: string) => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      setSelectedTeam({ 
        id: teamId, 
        name: teamName, 
        roster: team.roster,
        leagueName: team.league?.name || 'OFSL League'
      });
    }
  };

  const handleRosterUpdate = (newRoster: string[]) => {
    if (selectedTeam) {
      setSelectedTeam({ ...selectedTeam, roster: newRoster });
      refetchTeams();
    }
  };

  return (
    <div className="space-y-6">
      <TeamsSection
        teams={teams}
        currentUserId={userProfile?.id}
        leaguePayments={leaguePayments}
        unregisteringPayment={unregisteringPayment}
        onUnregister={onUnregister}
        onManageTeammates={handleManageTeammates}
      />
      
      {selectedTeam && (
        <TeammateManagementModal
          isOpen={!!selectedTeam}
          onClose={() => setSelectedTeam(null)}
          teamId={selectedTeam.id}
          teamName={selectedTeam.name}
          currentRoster={selectedTeam.roster}
          onRosterUpdate={handleRosterUpdate}
          leagueName={selectedTeam.leagueName}
        />
      )}
    </div>
  );
}