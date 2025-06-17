import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { leagueData } from '../utils/leagueUtils';

export type ActiveView = 'info' | 'schedule' | 'standings';

export const useLeagueDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Find the league by ID
  const league = leagueData.find(l => l.id === Number(id));
  
  return {
    league,
    leagueId: id
  };
};

export const useActiveView = (initialView: ActiveView = 'info') => {
  const [activeView, setActiveView] = useState<ActiveView>(initialView);
  
  return {
    activeView,
    setActiveView
  };
};

export const useScoreSubmissionModal = () => {
  const [showScoreSubmissionModal, setShowScoreSubmissionModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  const openScoreSubmissionModal = (tierNumber: number) => {
    setSelectedTier(tierNumber);
    setShowScoreSubmissionModal(true);
  };

  const closeScoreSubmissionModal = () => {
    setShowScoreSubmissionModal(false);
    setSelectedTier(null);
  };

  return {
    showScoreSubmissionModal,
    selectedTier,
    openScoreSubmissionModal,
    closeScoreSubmissionModal
  };
};

