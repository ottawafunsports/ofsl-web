import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useToast } from '../../../../components/ui/toast';
import { Card, CardContent } from '../../../../components/ui/card';
import { LeaguesHeader } from './components/LeaguesHeader';
import { NewLeagueForm } from './components/NewLeagueForm';
import { LeaguesList } from './components/LeaguesList';
import { useLeaguesData } from './hooks/useLeaguesData';
import { useLeagueActions } from './hooks/useLeagueActions';

export function LeaguesTab() {
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  const [showNewLeagueForm, setShowNewLeagueForm] = useState(false);

  const {
    leagues,
    sports,
    skills,
    gyms,
    loading,
    loadData
  } = useLeaguesData();

  const {
    saving,
    handleCreateLeague,
    handleDeleteLeague
  } = useLeagueActions({ loadData, showToast });

  useEffect(() => {
    loadData();
  }, []);

  if (!userProfile?.is_admin) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-[#6F6F6F] text-lg">Access denied. Admin privileges required.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B20000]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LeaguesHeader onCreateNew={() => setShowNewLeagueForm(true)} />

      {showNewLeagueForm && (
        <NewLeagueForm 
          sports={sports}
          skills={skills}
          gyms={gyms}
          saving={saving}
          onClose={() => setShowNewLeagueForm(false)}
          onSubmit={handleCreateLeague}
        />
      )}

      <LeaguesList
        leagues={leagues}
        onDelete={handleDeleteLeague}
      />
    </div>
  );
}