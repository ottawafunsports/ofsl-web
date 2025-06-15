import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/toast';
import { LeagueHeader } from './components/LeagueHeader';
import { TabNavigation } from './components/TabNavigation';
import { DetailsTab } from './components/DetailsTab';
import { ScheduleTab } from './components/ScheduleTab';
import { StandingsTab } from './components/StandingsTab';

// Mock league data - in a real app, this would come from the database
const mockLeagueData = {
  1: {
    id: 1,
    name: "Elite Womens Volleyball",
    sport: "Volleyball",
    skillLevel: "Elite",
    day: "Monday",
    playTimes: ["7:00 PM - 10:00 PM"],
    location: "Central",
    specificLocation: "Carleton University",
    dates: "May 1 - August 15, 2025",
    price: 250,
    spotsRemaining: 2,
    maxPlayers: 12,
    image: "/womens-elite-card.jpg",
    description: "Our Elite Women's Volleyball league is designed for highly skilled players who have extensive competitive experience. This league features fast-paced, strategic gameplay with teams competing at the highest level of recreational volleyball in Ottawa.",
    rules: [
      "Teams must have a minimum of 8 players and maximum of 12 players on roster",
      "All players must be 18 years or older",
      "Games are played best 2 out of 3 sets to 25 points (cap at 27)",
      "Teams must provide their own jerseys with numbers",
      "Playoff eligibility requires 75% attendance during regular season"
    ]
  },
  2: {
    id: 2,
    name: "Coed Intermediate Volleyball",
    sport: "Volleyball",
    skillLevel: "Intermediate",
    day: "Tuesday",
    playTimes: ["7:00 PM - 9:00 PM", "9:00 PM - 11:00 PM"],
    location: "Central",
    specificLocation: "University of Ottawa",
    dates: "May 2 - August 16, 2025",
    price: 200,
    spotsRemaining: 8,
    maxPlayers: 10,
    image: "/571North-CR3_0335-Indoor-VB-Header-Featured.jpg",
    description: "Perfect for players looking to improve their skills in a fun, supportive environment. This coed league welcomes players with basic volleyball knowledge who want to develop their game.",
    rules: [
      "Teams must have at least 2 females on court at all times",
      "Minimum 6 players, maximum 10 players per team",
      "Games are played best 2 out of 3 sets to 25 points",
      "Substitutions allowed between sets",
      "Good sportsmanship is required at all times"
    ]
  },
  3: {
    id: 3,
    name: "Advanced Badminton",
    sport: "Badminton",
    skillLevel: "Advanced",
    day: "Wednesday",
    playTimes: ["6:30 PM - 9:30 PM"],
    location: "East End",
    specificLocation: "Rideau High School",
    dates: "May 3 - August 17, 2025",
    price: 180,
    spotsRemaining: 0,
    maxPlayers: 8,
    image: "/badminton-card.png",
    description: "Advanced badminton league for experienced players who understand complex strategies and can execute advanced techniques consistently.",
    rules: [
      "Players must provide their own rackets",
      "Matches are best 2 out of 3 games to 21 points",
      "Players must have tournament or competitive league experience",
      "Proper indoor court shoes required",
      "League provides shuttlecocks"
    ]
  }
};

export const LeagueDetailPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'details' | 'schedule' | 'standings'>('details');

  // Get league data
  const leagueId = parseInt(id || '1');
  const league = mockLeagueData[leagueId as keyof typeof mockLeagueData];

  if (!league) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#6F6F6F] mb-4">League Not Found</h1>
          <p className="text-[#6F6F6F] mb-6">The league you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/leagues')}
            className="bg-[#B20000] hover:bg-[#8A0000] text-white px-6 py-3 rounded-lg"
          >
            Back to Leagues
          </button>
        </div>
      </div>
    );
  }

  const handleRegisterClick = () => {
    if (!user) {
      showToast('Please log in to register for leagues', 'error');
      navigate('/login');
      return;
    }

    if (league.spotsRemaining === 0) {
      showToast('This league is currently full. You have been added to the waitlist.', 'success');
    } else {
      showToast('Registration successful! You will receive a confirmation email shortly.', 'success');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return <DetailsTab league={league} />;
      case 'schedule':
        return <ScheduleTab league={league} />;
      case 'standings':
        return <StandingsTab league={league} />;
      default:
        return <DetailsTab league={league} />;
    }
  };

  return (
    <div className="bg-white w-full">
      <LeagueHeader league={league} onRegisterClick={handleRegisterClick} />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        {renderTabContent()}
      </div>
    </div>
  );
};