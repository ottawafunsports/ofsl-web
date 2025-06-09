import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Clock, DollarSign, Users, Award, Home } from 'lucide-react';

// Mock data for leagues - using same data as LeaguesPage for now
const leagueData = [
  {
    id: 1,
    name: "Elite Womens Volleyball",
    sport: "Volleyball",
    format: "6s",
    day: "Monday",
    playTimes: ["7:00 PM - 10:00 PM"],
    location: "Central",
    specificLocation: "Carleton University",
    dates: "May 1 - August 15, 2025",
    skillLevel: "Elite",
    price: 250,
    spotsRemaining: 2,
    isFeatured: true,
    description: "Our Elite Women's League is designed for players with high-level experience, including current and former university/college players, club players, and those with extensive competitive playing experience. Teams are tiered based on performance to ensure competitive matches each week.",
    season: "Summer 2025 Season",
    image: "/womens-elite-card.jpg"
  },
  {
    id: 2,
    name: "Coed Intermediate Volleyball",
    sport: "Volleyball",
    format: "6s",
    day: "Tuesday",
    playTimes: ["7:00 PM - 9:00 PM", "9:00 PM - 11:00 PM"],
    location: "Central",
    specificLocation: "University of Ottawa",
    dates: "May 2 - August 16, 2025",
    skillLevel: "Intermediate",
    price: 200,
    spotsRemaining: 8,
    description: "Our Intermediate Coed 6's League is perfect for players with at least moderate volleyball experience. Teams should have consistent serving, passing, and attacking abilities. Play begins with proper 3-hit sequences and basic offensive strategies.",
    season: "Summer 2025 Season",
    image: "/571North-CR3_0335-Indoor-VB-Header-Featured.jpg"
  },
  {
    id: 3,
    name: "Advanced Badminton",
    sport: "Badminton",
    format: "Singles",
    day: "Wednesday",
    playTimes: ["6:30 PM - 9:30 PM"],
    location: "East End",
    specificLocation: "Rideau High School",
    dates: "May 3 - August 17, 2025",
    skillLevel: "Advanced",
    price: 180,
    spotsRemaining: 0,
    isFeatured: true,
    description: "Our Advanced Badminton Singles League is for experienced players with refined technique and strategic understanding of the game. Players should have strong shot variety, court movement, and competitive experience.",
    season: "Summer 2025 Season",
    image: "/badminton-card.png"
  },
  {
    id: 4,
    name: "Coed Competitive Volleyball",
    sport: "Volleyball",
    format: "4s",
    day: "Thursday",
    playTimes: ["7:00 PM - 9:00 PM", "9:00 PM - 11:00 PM"],
    location: "Central",
    specificLocation: "Glebe Collegiate",
    dates: "May 4 - August 18, 2025",
    skillLevel: "Competitive",
    price: 220,
    spotsRemaining: 4,
    isFeatured: true,
    description: "Our Competitive Coed 4's League offers a challenging environment for experienced players. Teams should have strong positional play, offensive and defensive systems, and the ability to run complex plays. This league features tiered play to ensure competitive matches.",
    season: "Summer 2025 Season",
    image: "/571North-CR3_0335-Indoor-VB-Header-Featured.jpg"
  },
  {
    id: 5,
    name: "Intermediate Pickleball",
    sport: "Pickleball",
    format: "Doubles",
    day: "Friday",
    playTimes: ["6:00 PM - 9:00 PM"],
    location: "Central",
    specificLocation: "Carleton University",
    dates: "May 5 - August 19, 2025",
    skillLevel: "Intermediate",
    price: 150,
    spotsRemaining: 12,
    description: "Our Intermediate Pickleball Doubles League is for players who understand the rules and have developed consistent strokes. Players should be able to sustain rallies and are beginning to use strategies and shot placement.",
    season: "Summer 2025 Season",
    image: "/pickleball-card.jpg"
  },
  {
    id: 6,
    name: "Mens Advanced Volleyball",
    sport: "Volleyball",
    format: "6s",
    day: "Saturday",
    playTimes: ["10:00 AM - 1:00 PM", "2:00 PM - 5:00 PM"],
    location: "West End",
    specificLocation: "Nepean Sportsplex",
    dates: "May 6 - August 20, 2025",
    skillLevel: "Advanced",
    price: 230,
    spotsRemaining: 6,
    description: "Our Men's Advanced 6's League is designed for players with significant volleyball experience. Teams should have strong serving, passing, and hitting abilities, with play featuring consistent 3-hit sequences and organized offensive strategies. This league uses a tiered system based on team performance.",
    season: "Summer 2025 Season",
    image: "/indoor-coed.jpg"
  },
  {
    id: 7,
    name: "Competitive Basketball",
    sport: "Basketball",
    format: "5s",
    day: "Sunday",
    playTimes: ["12:00 PM - 3:00 PM"],
    location: "East End",
    specificLocation: "Orleans Recreation Complex",
    dates: "May 7 - August 21, 2025",
    skillLevel: "Competitive",
    price: 190,
    spotsRemaining: 3,
    isFeatured: true,
    description: "Our Competitive Basketball League is for experienced players who understand team concepts and have refined individual skills. Games feature organized offensive and defensive strategies, with an emphasis on teamwork and basketball IQ.",
    season: "Summer 2025 Season",
    image: "/indoor-coed.jpg"
  },
  {
    id: 8,
    name: "Coed Intermediate Badminton",
    sport: "Badminton",
    format: "Doubles",
    day: "Monday",
    playTimes: ["7:30 PM - 10:30 PM"],
    location: "Central",
    specificLocation: "Glebe Collegiate",
    dates: "May 8 - August 22, 2025",
    skillLevel: "Intermediate",
    price: 175,
    spotsRemaining: 8,
    description: "Our Intermediate Coed Badminton Doubles League is perfect for players who have developed consistent strokes and are beginning to implement strategy. Players should understand proper positioning, shot selection, and have some competitive experience.",
    season: "Summer 2025 Season",
    image: "/badminton-card.png"
  },
  {
    id: 9,
    name: "Elite Coed Volleyball",
    sport: "Volleyball",
    format: "4s",
    day: "Tuesday & Thursday",
    playTimes: ["7:00 PM - 10:00 PM", "8:00 PM - 11:00 PM"],
    location: "West End",
    specificLocation: "Kanata Recreation Complex",
    dates: "May 9 - August 23, 2025",
    skillLevel: "Elite",
    price: 275,
    spotsRemaining: 1,
    isFeatured: true,
    description: "Our Elite Coed 4's League is our highest level of play, designed for advanced players with extensive competitive experience. Play features complex offensive systems, strategic defenses, and high-level execution. This league utilizes a strict tiering system to ensure balanced competition.",
    season: "Summer 2025 Season",
    image: "/571North-CR3_0335-Indoor-VB-Header-Featured.jpg"
  }
];

// Mock data for standings
const mockStandings = [
  { id: 1, team: "Setters of Catan", wins: 18, losses: 2, points: 36, pointsAgainst: 10, differentials: "+26" },
  { id: 2, team: "Block Party", wins: 16, losses: 4, points: 32, pointsAgainst: 12, differentials: "+20" },
  { id: 3, team: "Dig It", wins: 15, losses: 5, points: 30, pointsAgainst: 14, differentials: "+16" },
  { id: 4, team: "Net Gains", wins: 14, losses: 6, points: 28, pointsAgainst: 18, differentials: "+10" },
  { id: 5, team: "Serve-ivors", wins: 13, losses: 7, points: 26, pointsAgainst: 18, differentials: "+8" },
  { id: 6, team: "Spiked Punch", wins: 12, losses: 8, points: 24, pointsAgainst: 20, differentials: "+4" },
  { id: 7, team: "Setting Ducks", wins: 11, losses: 9, points: 22, pointsAgainst: 22, differentials: "0" },
  { id: 8, team: "Block and Roll", wins: 10, losses: 10, points: 20, pointsAgainst: 22, differentials: "-2" },
  { id: 9, team: "Ace of Base", wins: 9, losses: 11, points: 18, pointsAgainst: 24, differentials: "-6" },
  { id: 10, team: "Sets on the Beach", wins: 8, losses: 12, points: 16, pointsAgainst: 26, differentials: "-10" },
  { id: 11, team: "Hitting on All Sixes", wins: 7, losses: 13, points: 14, pointsAgainst: 28, differentials: "-14" },
  { id: 12, team: "Set to Kill", wins: 6, losses: 14, points: 12, pointsAgainst: 30, differentials: "-18" },
  { id: 13, team: "Bump Set Psycho", wins: 5, losses: 15, points: 10, pointsAgainst: 32, differentials: "-22" },
  { id: 14, team: "Net Assets", wins: 4, losses: 16, points: 8, pointsAgainst: 34, differentials: "-26" },
  { id: 15, team: "Notorious DIG", wins: 3, losses: 17, points: 6, pointsAgainst: 36, differentials: "-30" },
  { id: 16, team: "Volley Llamas", wins: 2, losses: 18, points: 4, pointsAgainst: 38, differentials: "-34" },
  { id: 17, team: "The Ace Holes", wins: 1, losses: 19, points: 2, pointsAgainst: 40, differentials: "-38" },
  { id: 18, team: "Served Cold", wins: 0, losses: 20, points: 0, pointsAgainst: 42, differentials: "-42" },
  { id: 19, team: "Spike Force", wins: 0, losses: 21, points: 0, pointsAgainst: 44, differentials: "-44" },
  { id: 20, team: "Setting Standards", wins: 0, losses: 22, points: 0, pointsAgainst: 46, differentials: "-46" },
  { id: 21, team: "Dig or Die", wins: 0, losses: 23, points: 0, pointsAgainst: 48, differentials: "-48" },
  { id: 22, team: "Blocking Legends", wins: 0, losses: 24, points: 0, pointsAgainst: 50, differentials: "-50" },
  { id: 23, team: "Serve's Up", wins: 0, losses: 25, points: 0, pointsAgainst: 52, differentials: "-52" },
  { id: 24, team: "The Dig Dudes", wins: 0, losses: 26, points: 0, pointsAgainst: 54, differentials: "-54" },
  { id: 25, team: "Bump Set Spike", wins: 0, losses: 27, points: 0, pointsAgainst: 56, differentials: "-56" },
  { id: 26, team: "Net Navigators", wins: 0, losses: 28, points: 0, pointsAgainst: 58, differentials: "-58" },
  { id: 27, team: "Passing Passion", wins: 0, losses: 29, points: 0, pointsAgainst: 60, differentials: "-60" },
  { id: 28, team: "Rotation Nation", wins: 0, losses: 30, points: 0, pointsAgainst: 62, differentials: "-62" },
  { id: 29, team: "Court Crushers", wins: 0, losses: 31, points: 0, pointsAgainst: 64, differentials: "-64" },
  { id: 30, team: "Libero Legends", wins: 0, losses: 32, points: 0, pointsAgainst: 66, differentials: "-66" },
  { id: 31, team: "Bump Brigade", wins: 0, losses: 33, points: 0, pointsAgainst: 68, differentials: "-68" },
  { id: 32, team: "The Backrow Bombers", wins: 0, losses: 34, points: 0, pointsAgainst: 70, differentials: "-70" },
  { id: 33, team: "Volley Vikings", wins: 0, losses: 35, points: 0, pointsAgainst: 72, differentials: "-72" },
  { id: 34, team: "Setters Paradise", wins: 0, losses: 36, points: 0, pointsAgainst: 74, differentials: "-74" },
  { id: 35, team: "Ace Attackers", wins: 0, losses: 37, points: 0, pointsAgainst: 76, differentials: "-76" },
  { id: 36, team: "The Last Set", wins: 0, losses: 38, points: 0, pointsAgainst: 78, differentials: "-78" }
];

// Function to generate tiered schedule based on teams
const generateTieredSchedule = () => {
  const teamsPerTier = 3;
  const totalTiers = Math.ceil(mockStandings.length / teamsPerTier);
  const tiers = [];
  
  // Locations to cycle through
  const locations = [
    "Carleton University", 
    "University of Ottawa", 
    "Glebe Collegiate", 
    "Nepean Sportsplex", 
    "Orleans Recreation Complex"
  ];
  
  // Time slots to cycle through
  const timeSlots = [
    "7:00 PM - 8:30 PM",
    "8:30 PM - 10:00 PM",
    "6:00 PM - 7:30 PM",
    "7:30 PM - 9:00 PM"
  ];
  
  // Generate each tier
  for (let i = 0; i < totalTiers; i++) {
    const startIndex = i * teamsPerTier;
    const tierTeams = mockStandings.slice(startIndex, startIndex + teamsPerTier);
    
    // If we don't have exactly 3 teams, fill with placeholders
    const teams = { A: null, B: null, C: null };
    const courts = { A: `Court ${(i % 3) + 1}`, B: `Court ${(i % 3) + 1}`, C: `Court ${(i % 3) + 1}` };
    
    // Assign available teams with their rankings
    tierTeams.forEach((team, index) => {
      const position = String.fromCharCode(65 + index); // A, B, C
      teams[position] = {
        name: team.team,
        ranking: startIndex + index + 1 // Ranking based on position in mockStandings
      };
    });
    
    // Only create a tier if we have at least one team
    if (teams.A) {
      // Add tier to the schedule
      tiers.push({
        tierNumber: i + 1,
        location: locations[i % locations.length],
        time: timeSlots[i % timeSlots.length],
        court: `Court ${(i % 3) + 1}`,
        teams: teams,
        courts: courts
      });
    }
  }
  
  return {
    week: 1,
    date: "June 5, 2025",
    tiers: tiers
  };
};

// Generate the schedule
const mockSchedule = [generateTieredSchedule()];

// Get background color based on skill level
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

// Function to get sport icon based on sport type
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

// Function to get spots badge color
const getSpotsBadgeColor = (spots: number) => {
  if (spots === 0) return "bg-red-100 text-red-800";
  if (spots <= 3) return "bg-orange-100 text-orange-800";
  return "bg-green-100 text-green-800";
};

// Function to get spots text
const getSpotsText = (spots: number) => {
  if (spots === 0) return "Full";
  if (spots === 1) return "1 spot left";
  return `${spots} spots left`;
};

export function LeagueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeView, setActiveView] = useState<'info' | 'schedule' | 'standings'>('info');
  const [showScoreSubmissionModal, setShowScoreSubmissionModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  // Get team name from position
  const getTeamNameFromPosition = (tier: any, position: string) => {
    return tier.teams[position]?.name || "";
  };
  
  // Find the league by ID
  const league = leagueData.find(l => l.id === Number(id));
  
  // Handle score submission modal
  const openScoreSubmissionModal = (tierNumber: number) => {
    setSelectedTier(tierNumber);
    setShowScoreSubmissionModal(true);
  };

  // Close score submission modal
  const closeScoreSubmissionModal = () => {
    setShowScoreSubmissionModal(false);
    setSelectedTier(null);
  };

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
            <div className="bg-gray-100 rounded-lg p-6 mb-6">
              {/* Skill Level Badge has been removed */}

              {/* League Details */}
              <div className="space-y-4 mb-6">
                {/* Day & Time */}
                <div className="flex items-start">
                  <Clock className="h-4 w-4 text-[#B20000] mr-2 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#6F6F6F]">{league.day}</p>
                    {league.playTimes.map((time, index) => (
                      <p key={index} className="text-sm text-[#6F6F6F]">
                        {time}
                      </p>
                    ))}
                  </div>
                </div>
                
                {/* Location */}
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-[#B20000] mr-2 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#6F6F6F]">{league.location}</p>
                    {league.specificLocation && (
                      <p className="text-sm text-[#6F6F6F]">
                        {league.specificLocation}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Season Dates */}
                <div className="flex items-start">
                  <Calendar className="h-4 w-4 text-[#B20000] mr-2 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#6F6F6F]">Season Dates</p>
                    <p className="text-sm text-[#6F6F6F]">
                      {league.dates}
                    </p>
                  </div>
                </div>
                
                {/* Price */}
                <div className="flex items-start">
                  <DollarSign className="h-4 w-4 text-[#B20000] mr-2 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#6F6F6F]">Price</p>
                    <p className="text-sm text-[#6F6F6F]">
                      ${league.price} {league.sport === "Volleyball" ? "per team" : "per player"}
                    </p>
                  </div>
                </div>

                {/* Spots Remaining */}
                <div className="flex items-start">
                  <Users className="h-4 w-4 text-[#B20000] mr-2 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#6F6F6F]">Availability</p>
                    <span className={`text-xs font-medium py-1 px-3 rounded-full ${getSpotsBadgeColor(league.spotsRemaining)}`}>
                      {getSpotsText(league.spotsRemaining)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Register Button */}
              <Button
                className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] w-full py-3"
                disabled={league.spotsRemaining === 0}
              >
                {league.spotsRemaining === 0 ? 'Join Waitlist' : 'Register Now'}
              </Button>
            </div>
          </div>

          {/* Main content area */}
          <div className="md:col-span-3">
            {/* Navigation tabs at the top of content area */}
            <div className="flex border-b border-gray-200 mb-8">
              <div className="flex flex-grow">
                <div 
                  onClick={() => setActiveView('info')}
                  className={`px-6 py-3 text-center cursor-pointer relative transition-all ${
                    activeView === 'info' 
                      ? 'text-[#B20000] font-medium' 
                      : 'text-[#6F6F6F] hover:text-[#B20000]'
                  }`}
                >
                  <span>Details</span>
                  {activeView === 'info' && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B20000]"></div>
                  )}
                </div>
                
                {/* Only show Schedule & Standings tabs for Volleyball */}
                {league.sport === 'Volleyball' && (
                  <>
                    <div 
                      onClick={() => setActiveView('schedule')}
                      className={`px-6 py-3 text-center cursor-pointer relative transition-all ${
                        activeView === 'schedule' 
                          ? 'text-[#B20000] font-medium' 
                          : 'text-[#6F6F6F] hover:text-[#B20000]'
                      }`}
                    >
                      <span>Schedule</span>
                      {activeView === 'schedule' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B20000]"></div>
                      )}
                    </div>
                    
                    <div 
                      onClick={() => setActiveView('standings')}
                      className={`px-6 py-3 text-center cursor-pointer relative transition-all ${
                        activeView === 'standings' 
                          ? 'text-[#B20000] font-medium' 
                          : 'text-[#6F6F6F] hover:text-[#B20000]'
                      }`}
                    >
                      <span>Standings</span>
                      {activeView === 'standings' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B20000]"></div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* League Info View */}
            {activeView === 'info' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-[#6F6F6F] mb-4">League Description</h2>
                  <p className="text-[#6F6F6F]">{league.description}</p>
                </div>
                
                {/* Skill level requirements for this league */}
                <div>
                  <h2 className="text-2xl font-bold text-[#6F6F6F] mb-4">Skill Level Requirements</h2>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <Award className="h-6 w-6 text-[#B20000] mr-2" />
                      <span className={`text-sm font-medium py-1 px-3 rounded-full ${getSkillLevelColor(league.skillLevel)}`}>
                        {league.skillLevel} Level
                      </span>
                    </div>
                    
                    {/* Skill level descriptions based on league's skill level */}
                    {league.skillLevel === 'Elite' && (
                      <ul className="space-y-2 text-[#6F6F6F]">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Current or former college/university players</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Advanced offensive and defensive systems</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Consistent high-level execution</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Specialized positions and strategic play</span>
                        </li>
                      </ul>
                    )}
                    
                    {league.skillLevel === 'Competitive' && (
                      <ul className="space-y-2 text-[#6F6F6F]">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Strong competitive experience</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Consistent offensive and defensive execution</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Advanced techniques and strategies</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Solid positional understanding</span>
                        </li>
                      </ul>
                    )}
                    
                    {league.skillLevel === 'Advanced' && (
                      <ul className="space-y-2 text-[#6F6F6F]">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Significant playing experience</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Strong fundamental skills</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Good tactical understanding</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Ability to execute complex plays</span>
                        </li>
                      </ul>
                    )}
                    
                    {league.skillLevel === 'Intermediate' && (
                      <ul className="space-y-2 text-[#6F6F6F]">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Basic understanding of rules and strategies</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Consistent serving and receiving</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Some previous playing experience</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Ability to maintain rallies</span>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
                
                {/* Additional league information */}
                <div>
                  <h2 className="text-2xl font-bold text-[#6F6F6F] mb-4">Additional Information</h2>
                  <ul className="space-y-2 text-[#6F6F6F]">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>League runs for 12 weeks with 10 regular season games and 2 weeks of playoffs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Registered teams receive a schedule of all games for the season</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>All equipment provided (except personal gear)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Please review our <Link to="/standards-of-play" className="text-[#B20000] underline">standards of play</Link> for complete rules</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Schedule View - Only for Volleyball */}
            {activeView === 'schedule' && (
              <div>
                <h2 className="text-2xl font-bold text-[#6F6F6F] mb-6">League Schedule</h2>
                
                {/* Week header - Left justified */}
                <div className="mb-4 text-left">
                  <p className="font-medium text-[#6F6F6F]">
                    Week 1 - June 5, 2025
                  </p>
                </div>
                
                {/* Display tiers for the current week */}
                <div className="space-y-6">
                  {mockSchedule[0].tiers.map((tier, tierIndex) => (
                    <Card key={tierIndex} className="shadow-md overflow-hidden rounded-lg">
                      <CardContent className="p-0 overflow-hidden">
                        {/* Tier Header - Updated with right-justified info and icons */}
                        <div className="bg-[#F8F8F8] border-b p-4">
                          <div className="flex justify-between items-center">
                            {/* Left side - Tier Number with Submit Scores link below */}
                            <div>
                              <h3 className="font-bold text-[#6F6F6F] text-xl">
                                Tier {tier.tierNumber}
                              </h3>
                              <button 
                                onClick={() => openScoreSubmissionModal(tier.tierNumber)}
                                className="text-sm text-[#B20000] hover:underline"
                              >
                                Submit scores
                              </button>
                            </div>
                            
                            {/* Right side - Location, Time, Court info with icons */}
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-end sm:items-center text-right">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 text-[#B20000] mr-1.5" />
                                <span className="text-sm text-[#6F6F6F]">{tier.location}</span>
                              </div>
                              
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-[#B20000] mr-1.5" />
                                <span className="text-sm text-[#6F6F6F]">{tier.time}</span>
                              </div>
                              
                              <div className="flex items-center">
                                <Home className="h-4 w-4 text-[#B20000] mr-1.5" />
                                <span className="text-sm text-[#6F6F6F]">{tier.court}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Teams by Position in a table layout with fixed column widths for consistency */}
                        <div className="overflow-hidden">
                          <table className="w-full table-fixed">
                            <colgroup>
                              <col style={{ width: '20%' }} />
                              <col style={{ width: '60%' }} />
                              <col style={{ width: '20%' }} />
                            </colgroup>
                            <thead className="bg-white">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-[#6F6F6F]">Position</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-[#6F6F6F]">Team</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-[#6F6F6F]">Ranking</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {/* Position A */}
                              <tr className="bg-white">
                                <td className="px-4 py-3 text-sm font-medium text-[#6F6F6F]">A</td>
                                <td className="px-4 py-3 text-sm text-[#6F6F6F] truncate">{tier.teams.A?.name || "-"}</td>
                                <td className="px-4 py-3 text-sm text-[#6F6F6F] text-left">{tier.teams.A?.ranking || "-"}</td>
                              </tr>
                              
                              {/* Position B */}
                              <tr className="bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium text-[#6F6F6F]">B</td>
                                <td className="px-4 py-3 text-sm text-[#6F6F6F] truncate">{tier.teams.B?.name || "-"}</td>
                                <td className="px-4 py-3 text-sm text-[#6F6F6F] text-left">{tier.teams.B?.ranking || "-"}</td>
                              </tr>
                              
                              {/* Position C */}
                              <tr className="bg-white">
                                <td className="px-4 py-3 text-sm font-medium text-[#6F6F6F]">C</td>
                                <td className="px-4 py-3 text-sm text-[#6F6F6F] truncate">{tier.teams.C?.name || "-"}</td>
                                <td className="px-4 py-3 text-sm text-[#6F6F6F] text-left">{tier.teams.C?.ranking || "-"}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Standings View */}
            {activeView === 'standings' && (
              <div>
                <h2 className="text-2xl font-bold text-[#6F6F6F] mb-6">League Standings</h2>
                
                {/* Standings table */}
                <Card className="shadow-md overflow-hidden rounded-lg">
                  <CardContent className="p-0 overflow-hidden">
                    <div className="overflow-hidden">
                      <table className="w-full table-fixed">
                        <colgroup>
                          <col style={{ width: '10%' }} />
                          <col style={{ width: '40%' }} />
                          <col style={{ width: '12.5%' }} />
                          <col style={{ width: '12.5%' }} />
                          <col style={{ width: '12.5%' }} />
                          <col style={{ width: '12.5%' }} />
                        </colgroup>
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#6F6F6F] rounded-tl-lg">Rank</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#6F6F6F]">Team</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-[#6F6F6F]">Wins</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-[#6F6F6F]">Losses</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-[#6F6F6F]">Points</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-[#6F6F6F] hidden md:table-cell rounded-tr-lg">Diff</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {mockStandings.map((team, index) => (
                            <tr 
                              key={team.id} 
                              className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
                                index === mockStandings.length - 1 ? 'last-row' : ''
                              }`}
                            >
                              <td className={`px-4 py-3 text-sm font-medium text-[#6F6F6F] ${
                                index === mockStandings.length - 1 ? 'rounded-bl-lg' : ''
                              }`}>{index + 1}</td>
                              <td className="px-4 py-3 text-sm text-[#6F6F6F]">{team.team}</td>
                              <td className="px-4 py-3 text-sm text-[#6F6F6F] text-center">{team.wins}</td>
                              <td className="px-4 py-3 text-sm text-[#6F6F6F] text-center">{team.losses}</td>
                              <td className="px-4 py-3 text-sm text-[#6F6F6F] text-center">{team.points}</td>
                              <td className={`px-4 py-3 text-sm text-[#6F6F6F] text-center hidden md:table-cell ${
                                index === mockStandings.length - 1 ? 'rounded-br-lg' : ''
                              }`}>{team.differentials}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Score Submission Modal */}
      {showScoreSubmissionModal && selectedTier !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#6F6F6F]">Submit Scores - Tier {selectedTier}</h2>
                <button 
                  onClick={closeScoreSubmissionModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Team Legend */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-bold text-[#6F6F6F] mb-2">Teams</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['A', 'B', 'C'].map((position) => {
                    const tier = mockSchedule[0].tiers.find(t => t.tierNumber === selectedTier);
                    const teamName = tier ? getTeamNameFromPosition(tier, position) : '';
                    
                    return (
                      <div key={position} className="flex items-center">
                        <span className="font-bold text-[#B20000] w-8">
                          {position}:
                        </span>
                        <span className="text-[#6F6F6F] truncate">
                          {teamName || 'No team'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Game Scores Form */}
              <form>
                <div className="mb-6">
                  <h3 className="font-bold text-[#6F6F6F] mb-4">Game Scores</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 border-b text-left text-sm font-medium text-[#6F6F6F]">Game</th>
                          <th className="px-4 py-2 border-b text-left text-sm font-medium text-[#6F6F6F]">Matchup</th>
                          <th className="px-4 py-2 border-b text-center text-sm font-medium text-[#6F6F6F]">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Game 1 */}
                        <tr>
                          <td className="px-4 py-3 border-b">
                            <span className="font-medium">Game 1</span>
                          </td>
                          <td className="px-4 py-3 border-b">
                            <span>A vs C</span>
                          </td>
                          <td className="px-4 py-3 border-b">
                            <div className="flex items-center justify-center gap-2">
                              <input 
                                type="number"
                                min="0" 
                                className="w-16 px-2 py-1 border rounded text-center"
                                placeholder="0"
                              />
                              <span>-</span>
                              <input
                                type="number"
                                min="0"
                                className="w-16 px-2 py-1 border rounded text-center" 
                                placeholder="0"
                              />
                            </div>
                          </td>
                        </tr>
                        
                        {/* Game 2 */}
                        <tr>
                          <td className="px-4 py-3 border-b">
                            <span className="font-medium">Game 2</span>
                          </td>
                          <td className="px-4 py-3 border-b">
                            <span>A vs C</span>
                          </td>
                          <td className="px-4 py-3 border-b">
                            <div className="flex items-center justify-center gap-2">
                              <input 
                                type="number"
                                min="0" 
                                className="w-16 px-2 py-1 border rounded text-center"
                                placeholder="0" 
                              />
                              <span>-</span>
                              <input
                                type="number"
                                min="0"
                                className="w-16 px-2 py-1 border rounded text-center"
                                placeholder="0"
                              />
                            </div>
                          </td>
                        </tr>
                        
                        {/* Game 3 */}
                        <tr>
                          <td className="px-4 py-3 border-b">
                            <span className="font-medium">Game 3</span>
                          </td>
                          <td className="px-4 py-3 border-b">
                            <span>A vs B</span>
                          </td>
                          <td className="px-4 py-3 border-b">
                            <div className="flex items-center justify-center gap-2">
                              <input 
                                type="number"
                                min="0" 
                                className="w-16 px-2 py-1 border rounded text-center"
                                placeholder="0" 
                              />
                              <span>-</span>
                              <input
                                type="number"
                                min="0"
                                className="w-16 px-2 py-1 border rounded text-center"
                                placeholder="0"
                              />
                            </div>
                          </td>
                        </tr>

                        {/* Game 4 */}
                        <tr>
                          <td className="px-4 py-3 border-b">
                            <span className="font-medium">Game 4</span>
                          </td>
                          <td className="px-4 py-3 border-b">
                            <span>A vs B</span>
                          </td>
                          <td className="px-4 py-3 border-b">
                            <div className="flex items-center justify-center gap-2">
                              <input 
                                type="number"
                                min="0" 
                                className="w-16 px-2 py-1 border rounded text-center"
                                placeholder="0" 
                              />
                              <span>-</span>
                              <input
                                type="number"
                                min="0"
                                className="w-16 px-2 py-1 border rounded text-center"
                                placeholder="0"
                              />
                            </div>
                          </td>
                        </tr>

                        {/* Game 5 */}
                        <tr>
                          <td className="px-4 py-3 border-b">
                            <span className="font-medium">Game 5</span>
                          </td>
                          <td className="px-4 py-3 border-b">
                            <span>B vs C</span>
                          </td>
                          <td className="px-4 py-3 border-b">
                            <div className="flex items-center justify-center gap-2">
                              <input 
                                type="number"
                                min="0" 
                                className="w-16 px-2 py-1 border rounded text-center"
                                placeholder="0" 
                              />
                              <span>-</span>
                              <input
                                type="number"
                                min="0"
                                className="w-16 px-2 py-1 border rounded text-center"
                                placeholder="0"
                              />
                            </div>
                          </td>
                        </tr>

                        {/* Game 6 */}
                        <tr>
                          <td className="px-4 py-3">
                            <span className="font-medium">Game 6</span>
                          </td>
                          <td className="px-4 py-3">
                            <span>B vs C</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <input 
                                type="number"
                                min="0" 
                                className="w-16 px-2 py-1 border rounded text-center"
                                placeholder="0" 
                              />
                              <span>-</span>
                              <input
                                type="number"
                                min="0"
                                className="w-16 px-2 py-1 border rounded text-center"
                                placeholder="0"
                              />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Spare Players Section */}
                <div className="mb-6">
                  <h3 className="font-bold text-[#6F6F6F] mb-4">Spare Players</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['A', 'B', 'C'].map((teamPosition) => {
                      const tier = mockSchedule[0].tiers.find(t => t.tierNumber === selectedTier);
                      const teamName = tier ? getTeamNameFromPosition(tier, teamPosition) : '';
                      
                      return (
                        <div key={teamPosition} className="mb-4">
                          <label className="block text-sm font-medium text-[#6F6F6F] mb-2">
                            Team {teamPosition} {teamName ? `(${teamName})` : ''} Spares
                          </label>
                          <textarea 
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            rows={3}
                            placeholder="Enter spare player names..."
                          ></textarea>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="flex justify-end gap-4">
                  <Button 
                    type="button" 
                    onClick={closeScoreSubmissionModal}
                    className="bg-gray-200 hover:bg-gray-300 text-[#6F6F6F] rounded-[10px] px-6 py-2"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-2"
                  >
                    Submit Scores
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}