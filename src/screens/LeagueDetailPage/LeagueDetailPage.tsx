import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { LeagueHeader } from "./components/LeagueHeader";
import { TabNavigation } from "./components/TabNavigation";
import { DetailsTab } from "./components/DetailsTab";
import { ScheduleTab } from "./components/ScheduleTab";
import { StandingsTab } from "./components/StandingsTab";

// Mock league data - in a real app, this would come from an API
const leagueData = {
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
    image: "/womens-elite-card.jpg"
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
    image: "/571North-CR3_0335-Indoor-VB-Header-Featured.jpg"
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
    image: "/badminton-card.png"
  }
};

export const LeagueDetailPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'details' | 'schedule' | 'standings'>('details');
  
  const leagueId = parseInt(id || '1');
  const league = leagueData[leagueId as keyof typeof leagueData] || leagueData[1];

  // Utility functions
  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'Volleyball':
        return "/Volleyball.png";
      case 'Badminton':
        return "/Badminton.png";
      case 'Basketball':
        return "/Basketball.png";
      case 'Pickleball':
        return "/Pickleball.png";
      default:
        return "";
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Elite':
        return 'bg-purple-100 text-purple-800';
      case 'Competitive':
        return 'bg-blue-100 text-blue-800';
      case 'Advanced':
        return 'bg-indigo-100 text-indigo-800';
      case 'Intermediate':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSpotsBadgeColor = (spots: number) => {
    if (spots === 0) return "bg-red-100 text-red-800";
    if (spots <= 3) return "bg-orange-100 text-orange-800";
    return "bg-green-100 text-green-800";
  };

  const getSpotsText = (spots: number) => {
    if (spots === 0) return "Full";
    if (spots === 1) return "1 spot left";
    return `${spots} spots left`;
  };

  return (
    <div className="bg-white w-full">
      <LeagueHeader 
        league={league}
        getSportIcon={getSportIcon}
        getSkillLevelColor={getSkillLevelColor}
        getSpotsBadgeColor={getSpotsBadgeColor}
        getSpotsText={getSpotsText}
      />

      <div className="max-w-[1280px] mx-auto px-4 py-8 md:py-12">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'details' && <DetailsTab league={league} />}
        {activeTab === 'schedule' && <ScheduleTab />}
        {activeTab === 'standings' && <StandingsTab />}
      </div>
    </div>
  );
};