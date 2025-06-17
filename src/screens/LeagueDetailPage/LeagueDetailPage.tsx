import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { 
  mockStandings, 
  mockSchedule, 
  getSportIcon, 
  getTeamNameFromPosition 
} from './utils/leagueUtils';
import { useLeagueDetail, useActiveView, useScoreSubmissionModal } from './hooks/useLeagueDetail';
import { NavigationTabs } from './components/NavigationTabs';
import { LeagueInfo } from './components/LeagueInfo';
import { LeagueSchedule } from './components/LeagueSchedule';
import { LeagueStandings } from './components/LeagueStandings';
import { SkillLevelRequirements } from './components/SkillLevelRequirements';
import { AdditionalLeagueInfo } from './components/AdditionalLeagueInfo';
import { ScoreSubmissionModal } from './components/ScoreSubmissionModal';

export function LeagueDetailPage() {
  const { league } = useLeagueDetail();
  const { activeView, setActiveView } = useActiveView();
  const { 
    showScoreSubmissionModal, 
    selectedTier, 
    openScoreSubmissionModal, 
    closeScoreSubmissionModal 
  } = useScoreSubmissionModal();

  // If league not found
  if (!league) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-[#6F6F6F] mb-6">League Not Found</h1>
        <p className="text-lg text-[#6F6F6F] mb-8">The league you're looking for doesn't exist or has been removed.</p>
        <Link to="/leagues">
          <Button className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-3">
            Back to Leagues
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white w-full">
      <div className="max-w-[1280px] mx-auto px-4 py-12">
        {/* Back button */}
        <div className="mb-8">
          <Link to="/leagues" className="flex items-center text-[#B20000] hover:underline">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Leagues
          </Link>
        </div>

        {/* League title - Separated title and season into different divs */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <img
              src={getSportIcon(league.sport)}
              alt={league.sport}
              className="w-10 h-10 mr-3 flex-shrink-0"
            />
            <h1 className="text-3xl md:text-4xl font-bold text-[#6F6F6F]">{league.name}</h1>
          </div>
          <div className="ml-[52px]"> {/* 40px for icon width + 12px for margin */}
            <p className="text-xl text-[#6F6F6F]">{league.season}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar with grey background */}
          <div className="md:col-span-1">
            <LeagueInfo league={league} sport={league.sport} />
          </div>

          {/* Main content area */}
          <div className="md:col-span-3">
            {/* Navigation tabs */}
            <NavigationTabs 
              activeView={activeView} 
              setActiveView={setActiveView} 
              sport={league.sport} 
            />

            {/* League Info View */}
            {activeView === 'info' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-[#6F6F6F] mb-4">League Description</h2>
                  <p className="text-[#6F6F6F]">{league.description}</p>
                </div>
                
                <SkillLevelRequirements skillLevel={league.skillLevel} />
                <AdditionalLeagueInfo />
              </div>
            )}

            {/* Schedule View - Only for Volleyball */}
            {activeView === 'schedule' && (
              <LeagueSchedule 
                mockSchedule={mockSchedule} 
                openScoreSubmissionModal={openScoreSubmissionModal} 
              />
            )}

            {/* Standings View */}
            {activeView === 'standings' && (
              <LeagueStandings mockStandings={mockStandings} />
            )}
          </div>
        </div>
      </div>

      {/* Score Submission Modal */}
      <ScoreSubmissionModal
        showModal={showScoreSubmissionModal}
        selectedTier={selectedTier}
        mockSchedule={mockSchedule}
        getTeamNameFromPosition={getTeamNameFromPosition}
        closeModal={closeScoreSubmissionModal}
      />
    </div>
  );
}
