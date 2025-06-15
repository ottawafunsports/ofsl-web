import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/toast';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  Target, 
  Info, 
  Trophy, 
  TrendingUp 
} from 'lucide-react';

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

// Mock schedule data
const mockScheduleData = [
  {
    id: 1,
    date: "2025-01-15",
    time: "7:00 PM",
    homeTeam: "Thunder Bolts",
    awayTeam: "Lightning Strikes",
    location: "Carleton University - Gym A",
    status: "upcoming" as const
  },
  {
    id: 2,
    date: "2025-01-15",
    time: "8:00 PM",
    homeTeam: "Net Ninjas",
    awayTeam: "Spike Squad",
    location: "Carleton University - Gym B",
    status: "upcoming" as const
  },
  {
    id: 3,
    date: "2025-01-08",
    time: "7:00 PM",
    homeTeam: "Thunder Bolts",
    awayTeam: "Net Ninjas",
    location: "Carleton University - Gym A",
    status: "completed" as const,
    homeScore: 2,
    awayScore: 1
  },
  {
    id: 4,
    date: "2025-01-08",
    time: "8:00 PM",
    homeTeam: "Lightning Strikes",
    awayTeam: "Spike Squad",
    location: "Carleton University - Gym B",
    status: "completed" as const,
    homeScore: 0,
    awayScore: 2
  }
];

// Mock standings data
const mockStandingsData = [
  {
    id: 1,
    name: "Thunder Bolts",
    wins: 8,
    losses: 2,
    setsWon: 18,
    setsLost: 8,
    pointsFor: 450,
    pointsAgainst: 320,
    winPercentage: 0.8
  },
  {
    id: 2,
    name: "Lightning Strikes",
    wins: 7,
    losses: 3,
    setsWon: 16,
    setsLost: 10,
    pointsFor: 420,
    pointsAgainst: 380,
    winPercentage: 0.7
  },
  {
    id: 3,
    name: "Net Ninjas",
    wins: 5,
    losses: 5,
    setsWon: 13,
    setsLost: 13,
    pointsFor: 390,
    pointsAgainst: 390,
    winPercentage: 0.5
  },
  {
    id: 4,
    name: "Spike Squad",
    wins: 4,
    losses: 6,
    setsWon: 11,
    setsLost: 15,
    pointsFor: 360,
    pointsAgainst: 420,
    winPercentage: 0.4
  },
  {
    id: 5,
    name: "Block Party",
    wins: 2,
    losses: 8,
    setsWon: 7,
    setsLost: 17,
    pointsFor: 310,
    pointsAgainst: 470,
    winPercentage: 0.2
  }
];

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 2:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 3:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-white text-[#6F6F6F] border-gray-200';
    }
  };

  const getWinPercentageColor = (percentage: number) => {
    if (percentage >= 0.7) return 'text-green-600';
    if (percentage >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSkillLevelRequirements = (sport: string, level: string) => {
    const requirements: Record<string, Record<string, string[]>> = {
      Volleyball: {
        Elite: [
          "Extensive competitive experience at university, club, or professional level",
          "Advanced understanding of all positions and rotations",
          "Consistent execution of complex plays and strategies",
          "Leadership skills and ability to coach teammates during play"
        ],
        Competitive: [
          "Strong fundamental skills in serving, passing, setting, hitting, and blocking",
          "Good understanding of team strategies and positioning",
          "Experience playing in organized leagues or tournaments",
          "Ability to perform under pressure in competitive situations"
        ],
        Advanced: [
          "Solid fundamental skills with consistent execution",
          "Understanding of basic volleyball strategies and rotations",
          "Some competitive experience preferred",
          "Ability to play multiple positions effectively"
        ],
        Intermediate: [
          "Basic understanding of volleyball rules and gameplay",
          "Developing fundamental skills (serving, passing, hitting)",
          "Some recreational or beginner league experience",
          "Willingness to learn and improve skills"
        ]
      },
      Badminton: {
        Advanced: [
          "Strong technical skills in all strokes (clear, drop, smash, drive)",
          "Good court coverage and footwork",
          "Understanding of singles and doubles strategies",
          "Tournament or competitive league experience"
        ],
        Intermediate: [
          "Basic stroke techniques with room for improvement",
          "Understanding of basic rules and scoring",
          "Some recreational playing experience",
          "Developing court awareness and positioning"
        ]
      }
    };

    return requirements[sport]?.[level] || [
      "Skill level requirements will be provided closer to season start",
      "Contact league organizers for specific skill assessments"
    ];
  };

  const upcomingGames = mockScheduleData.filter(game => game.status === 'upcoming');
  const completedGames = mockScheduleData.filter(game => game.status === 'completed');
  const skillRequirements = getSkillLevelRequirements(league.sport, league.skillLevel);

  return (
    <div className="bg-white w-full">
      {/* Hero Section */}
      <div className="relative">
        {/* Hero Image */}
        <div className="relative h-[400px] w-full">
          <img
            src={league.image}
            alt={league.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="text-center text-white max-w-4xl">
              <div className="flex items-center justify-center mb-4">
                <img 
                  src={getSportIcon(league.sport)} 
                  alt={`${league.sport} icon`}
                  className="w-12 h-12 mr-4"
                />
                <h1 className="text-4xl md:text-5xl font-bold">{league.name}</h1>
              </div>
              <p className="text-xl mb-8">
                {league.skillLevel} level • {league.sport}
              </p>
            </div>
          </div>
        </div>

        {/* League Info Cards */}
        <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Time Card */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-[#B20000] mr-2" />
                <h3 className="font-semibold text-[#6F6F6F]">Schedule</h3>
              </div>
              <p className="text-sm text-[#6F6F6F] font-medium">{league.day}</p>
              <p className="text-xs text-gray-500">{league.playTimes.join(", ")}</p>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 text-[#B20000] mr-2" />
                <h3 className="font-semibold text-[#6F6F6F]">Location</h3>
              </div>
              <p className="text-sm text-[#6F6F6F] font-medium">{league.location}</p>
              {league.specificLocation && (
                <p className="text-xs text-gray-500">{league.specificLocation}</p>
              )}
            </div>

            {/* Dates Card */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 text-[#B20000] mr-2" />
                <h3 className="font-semibold text-[#6F6F6F]">Season</h3>
              </div>
              <p className="text-sm text-[#6F6F6F] font-medium">{league.dates}</p>
            </div>

            {/* Price Card */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center mb-2">
                <DollarSign className="h-5 w-5 text-[#B20000] mr-2" />
                <h3 className="font-semibold text-[#6F6F6F]">Cost</h3>
              </div>
              <p className="text-sm text-[#6F6F6F] font-medium">
                ${league.price} {league.sport === "Volleyball" ? "per team" : "per player"}
              </p>
            </div>
          </div>

          {/* Registration Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-[#B20000] mr-2" />
                <span className={`text-sm font-medium py-1 px-3 rounded-full ${getSpotsBadgeColor(league.spotsRemaining)}`}>
                  {getSpotsText(league.spotsRemaining)}
                </span>
              </div>
              <Button 
                onClick={handleRegisterClick}
                className={`bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-8 py-3 ${
                  league.spotsRemaining === 0 ? 'opacity-90' : ''
                }`}
                disabled={league.spotsRemaining === 0}
              >
                {league.spotsRemaining === 0 ? 'Join Waitlist' : 'Register Now'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'details' as const, label: 'Details' },
              { id: 'schedule' as const, label: 'Schedule' },
              { id: 'standings' as const, label: 'Standings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-lg transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#B20000] text-[#B20000]'
                    : 'border-transparent text-[#6F6F6F] hover:text-[#B20000] hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'details' && (
          <div className="space-y-8">
            {/* League Description */}
            <div>
              <h3 className="text-2xl font-bold text-[#6F6F6F] mb-4 flex items-center">
                <Info className="h-6 w-6 mr-2 text-[#B20000]" />
                About This League
              </h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-[#6F6F6F] text-lg leading-relaxed">
                  {league.description}
                </p>
              </div>
            </div>

            {/* Skill Level Requirements */}
            <div className="bg-white">
              <h3 className="text-xl font-bold text-[#6F6F6F] mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-[#B20000]" />
                {league.skillLevel} Level Requirements
              </h3>
              <ul className="space-y-3">
                {skillRequirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#B20000] mr-3 mt-1">•</span>
                    <span className="text-[#6F6F6F]">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* League Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-bold text-[#6F6F6F] mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-[#B20000]" />
                  Location Details
                </h4>
                <div className="space-y-2">
                  <p className="text-[#6F6F6F]">
                    <span className="font-medium">Region:</span> {league.location}
                  </p>
                  {league.specificLocation && (
                    <p className="text-[#6F6F6F]">
                      <span className="font-medium">Venue:</span> {league.specificLocation}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-3">
                    {league.sport === "Volleyball" 
                      ? "Specific venues may vary by week and will be communicated to registered teams."
                      : "Venue details will be provided upon registration."
                    }
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-bold text-[#6F6F6F] mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-[#B20000]" />
                  Season Information
                </h4>
                <div className="space-y-2">
                  <p className="text-[#6F6F6F]">
                    <span className="font-medium">Duration:</span> {league.dates}
                  </p>
                  <p className="text-[#6F6F6F]">
                    <span className="font-medium">Cost:</span> ${league.price} {league.sport === "Volleyball" ? "per team" : "per player"}
                  </p>
                  {league.maxPlayers && (
                    <p className="text-[#6F6F6F]">
                      <span className="font-medium">Max Players:</span> {league.maxPlayers} per team
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Rules and Regulations */}
            {league.rules && league.rules.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-[#6F6F6F] mb-4">League Rules</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <ul className="space-y-2">
                    {league.rules.map((rule, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[#B20000] mr-3 mt-1">•</span>
                        <span className="text-[#6F6F6F]">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-[#ffeae5] rounded-lg p-6">
              <h3 className="text-xl font-bold text-[#6F6F6F] mb-4">Questions?</h3>
              <p className="text-[#6F6F6F] mb-4">
                Have questions about this league or need help with registration? We're here to help!
              </p>
              <div className="space-y-2">
                <p className="text-[#6F6F6F]">
                  <span className="font-medium">Email:</span>{" "}
                  <a href={`mailto:${league.sport.toLowerCase()}@ofsl.ca`} className="text-[#B20000] hover:underline">
                    {league.sport.toLowerCase()}@ofsl.ca
                  </a>
                </p>
                <p className="text-[#6F6F6F]">
                  <span className="font-medium">General inquiries:</span>{" "}
                  <a href="mailto:info@ofsl.ca" className="text-[#B20000] hover:underline">
                    info@ofsl.ca
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-8">
            {/* League Schedule Info */}
            <div className="bg-[#ffeae5] rounded-lg p-6">
              <h3 className="text-xl font-bold text-[#6F6F6F] mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-[#B20000]" />
                Schedule Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-[#B20000] mr-2" />
                  <span className="text-[#6F6F6F]">
                    <span className="font-medium">Game Day:</span> {league.day}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-[#B20000] mr-2" />
                  <span className="text-[#6F6F6F]">
                    <span className="font-medium">Time Slots:</span> {league.playTimes.join(", ")}
                  </span>
                </div>
              </div>
              <p className="text-sm text-[#6F6F6F] mt-4">
                Game schedules are updated weekly. Teams will be notified of any changes via email and WhatsApp.
              </p>
            </div>

            {/* Upcoming Games */}
            <div>
              <h3 className="text-2xl font-bold text-[#6F6F6F] mb-6">Upcoming Games</h3>
              {upcomingGames.length > 0 ? (
                <div className="space-y-4">
                  {upcomingGames.map((game) => (
                    <div key={game.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <Calendar className="h-4 w-4 text-[#B20000] mr-2" />
                            <span className="font-medium text-[#6F6F6F]">{formatDate(game.date)}</span>
                            <Clock className="h-4 w-4 text-[#B20000] ml-4 mr-2" />
                            <span className="text-[#6F6F6F]">{game.time}</span>
                          </div>
                          <div className="text-lg font-bold text-[#6F6F6F] mb-2">
                            {game.homeTeam} vs {game.awayTeam}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mr-1" />
                            {game.location}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(game.status)}`}>
                            {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[#6F6F6F]">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No upcoming games scheduled at this time.</p>
                </div>
              )}
            </div>

            {/* Recent Results */}
            <div>
              <h3 className="text-2xl font-bold text-[#6F6F6F] mb-6">Recent Results</h3>
              {completedGames.length > 0 ? (
                <div className="space-y-4">
                  {completedGames.map((game) => (
                    <div key={game.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <Calendar className="h-4 w-4 text-[#B20000] mr-2" />
                            <span className="font-medium text-[#6F6F6F]">{formatDate(game.date)}</span>
                            <Clock className="h-4 w-4 text-[#B20000] ml-4 mr-2" />
                            <span className="text-[#6F6F6F]">{game.time}</span>
                          </div>
                          <div className="text-lg font-bold text-[#6F6F6F] mb-2">
                            {game.homeTeam} {game.homeScore} - {game.awayScore} {game.awayTeam}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mr-1" />
                            {game.location}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(game.status)}`}>
                            Final
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[#6F6F6F]">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No completed games yet this season.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'standings' && (
          <div className="space-y-8">
            {/* Standings Header */}
            <div className="bg-[#ffeae5] rounded-lg p-6">
              <h3 className="text-xl font-bold text-[#6F6F6F] mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-[#B20000]" />
                Current Standings
              </h3>
              <p className="text-[#6F6F6F]">
                Standings are updated after each game week. Teams are ranked by win percentage, 
                with tiebreakers determined by head-to-head record and set differential.
              </p>
            </div>

            {/* Standings Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-[#6F6F6F] uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-[#6F6F6F] uppercase tracking-wider">
                        Team
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-[#6F6F6F] uppercase tracking-wider">
                        W-L
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-[#6F6F6F] uppercase tracking-wider">
                        Win %
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-[#6F6F6F] uppercase tracking-wider">
                        Sets
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-[#6F6F6F] uppercase tracking-wider">
                        Points
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockStandingsData.map((team, index) => (
                      <tr key={team.id} className={`hover:bg-gray-50 ${getRankColor(index + 1)}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-lg font-bold text-[#6F6F6F]">
                              {index + 1}
                            </span>
                            {index < 3 && (
                              <Trophy className="h-4 w-4 ml-2 text-[#B20000]" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-medium text-[#6F6F6F]">
                            {team.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-lg font-medium text-[#6F6F6F]">
                            {team.wins}-{team.losses}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`text-lg font-medium ${getWinPercentageColor(team.winPercentage)}`}>
                            {(team.winPercentage * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm text-[#6F6F6F]">
                            {team.setsWon}-{team.setsLost}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm text-[#6F6F6F]">
                            {team.pointsFor}-{team.pointsAgainst}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Playoff Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-[#6F6F6F] mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-[#B20000]" />
                Playoff Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-[#6F6F6F] mb-2">Playoff Qualification</h4>
                  <p className="text-sm text-[#6F6F6F]">
                    Top 4 teams qualify for playoffs. Playoffs begin the week following the regular season.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-[#6F6F6F] mb-2">Tiebreaker Rules</h4>
                  <p className="text-sm text-[#6F6F6F]">
                    1. Head-to-head record<br />
                    2. Set differential<br />
                    3. Points differential
                  </p>
                </div>
              </div>
            </div>

            {/* League Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-[#B20000]" />
                <div className="text-2xl font-bold text-[#6F6F6F]">{mockStandingsData.length}</div>
                <div className="text-sm text-[#6F6F6F]">Teams</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-[#B20000]" />
                <div className="text-2xl font-bold text-[#6F6F6F]">
                  {mockStandingsData.reduce((total, team) => total + team.wins + team.losses, 0)}
                </div>
                <div className="text-sm text-[#6F6F6F]">Games Played</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-[#B20000]" />
                <div className="text-2xl font-bold text-[#6F6F6F]">
                  {Math.round(mockStandingsData.reduce((total, team) => total + team.winPercentage, 0) / mockStandingsData.length * 100)}%
                </div>
                <div className="text-sm text-[#6F6F6F]">Avg Win Rate</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};