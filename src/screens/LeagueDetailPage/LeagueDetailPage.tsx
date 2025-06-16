import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLeagueData } from "../../hooks/useLeagueData";
import { LeagueHero } from "../../components/league/LeagueHero";
import { LeagueInfo } from "../../components/league/LeagueInfo";
import { LeagueSchedule } from "../../components/league/LeagueSchedule";
import { RegistrationModal } from "../../components/league/RegistrationModal";

export function LeagueDetailPage() {
  const { user } = useAuth();
  const { league, loading, error } = useLeagueData();
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const handleRegisterClick = () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }
    setIsRegistrationModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B20000]"></div>
      </div>
    );
  }

  if (error || !league) {
    return <Navigate to="/leagues" replace />;
  }

  return (
    <div className="bg-white w-full">
      <LeagueHero 
        league={league} 
        onRegisterClick={handleRegisterClick}
      />
      
      <LeagueInfo league={league} />
      
      <LeagueSchedule league={league} />
      
      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        league={league}
      />
    </div>
  );
}