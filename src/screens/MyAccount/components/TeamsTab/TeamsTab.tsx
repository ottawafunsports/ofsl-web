import { useAuth } from '../../../../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
import { LeaguePaymentsSection } from './LeaguePaymentsSection';
import { TeamsSection } from './TeamsSection';
import { useTeamsData } from './useTeamsData';
import { useTeamOperations } from './useTeamOperations';

export function TeamsTab() {
  const { user } = useAuth();
  const { leaguePayments, teams, loading, setLeaguePayments } = useTeamsData(user?.id);
  const { unregisteringPayment, handleUnregister } = useTeamOperations();

  const onUnregisterSuccess = (paymentId: number) => {
    setLeaguePayments(prev => prev.filter(p => p.id !== paymentId));
  };

  const onUnregister = (paymentId: number, leagueName: string) => {
    handleUnregister(paymentId, leagueName, onUnregisterSuccess);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <LeaguePaymentsSection
        leaguePayments={leaguePayments}
        unregisteringPayment={unregisteringPayment}
        onUnregister={onUnregister}
      />
      
      <TeamsSection
        teams={teams}
        currentUserId={user?.id}
      />
    </div>
  );
}