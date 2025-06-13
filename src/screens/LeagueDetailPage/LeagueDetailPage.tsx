import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { MapPin, Calendar, Clock, Users, DollarSign, Target, MessageSquare, AlertCircle } from "lucide-react";

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

  // Function to get badge color based on spots remaining
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

  const getTabClasses = (tab: string) => {
    return `px-6 py-3 font-medium text-lg border-b-2 transition-colors ${
      activeTab === tab
        ? 'border-[#B20000] text-[#B20000]'
        : 'border-transparent text-[#6F6F6F] hover:text-[#B20000]'
    }`;
  };

  // Mock schedule data
  const scheduleData = [
    {
      week: 1,
      date: "May 6, 2025",
      games: [
        { time: "7:00 PM", team1: "Thunder Bolts", team2: "Net Ninjas", location: "Carleton University" },
        { time: "8:00 PM", team1: "Spike Squad", team2: "Ace Attackers", location: "Carleton University" },
        { time: "9:00 PM", team1: "Block Party", team2: "Set Point", location: "Carleton University" }
      ]
    },
    {
      week: 2,
      date: "May 13, 2025",
      games: [
        { time: "7:00 PM", team1: "Net Ninjas", team2: "Spike Squad", location: "University of Ottawa" },
        { time: "8:00 PM", team1: "Ace Attackers", team2: "Block Party", location: "University of Ottawa" },
        { time: "9:00 PM", team1: "Set Point", team2: "Thunder Bolts", location: "University of Ottawa" }
      ]
    },
    {
      week: 3,
      date: "May 20, 2025",
      games: [
        { time: "7:00 PM", team1: "Thunder Bolts", team2: "Spike Squad", location: "Glebe Collegiate" },
        { time: "8:00 PM", team1: "Net Ninjas", team2: "Block Party", location: "Glebe Collegiate" },
        { time: "9:00 PM", team1: "Ace Attackers", team2: "Set Point", location: "Glebe Collegiate" }
      ]
    }
  ];

  // Mock standings data
  const standingsData = [
    { rank: 1, team: "Thunder Bolts", wins: 8, losses: 1, points: 24, streak: "W5" },
    { rank: 2, team: "Net Ninjas", wins: 7, losses: 2, points: 21, streak: "W3" },
    { rank: 3, team: "Spike Squad", wins: 6, losses: 3, points: 18, streak: "L1" },
    { rank: 4, team: "Ace Attackers", wins: 5, losses: 4, points: 15, streak: "W2" },
    { rank: 5, team: "Block Party", wins: 3, losses: 6, points: 9, streak: "L2" },
    { rank: 6, team: "Set Point", wins: 1, losses: 8, points: 3, streak: "L6" }
  ];

  const getStreakColor = (streak: string) => {
    return streak.startsWith('W') ? 'text-green-600' : 'text-red-600';
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800';
    if (rank <= 4) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white w-full">
      {/* Hero Image */}
      <div className="relative w-full h-[300px] md:h-[400px]">
        <img
          className="w-full h-full object-cover"
          alt={league.name}
          src={league.image}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="text-center text-white max-w-4xl">
            <div className="flex items-center justify-center mb-4">
              <img 
                src={getSportIcon(league.sport)} 
                alt={`${league.sport} icon`}
                className="w-12 h-12 object-contain mr-4"
              />
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getSkillLevelColor(league.skillLevel)}`}>
                {league.skillLevel}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{league.name}</h1>
            <p className="text-xl mb-6">
              Join our {league.skillLevel.toLowerCase()} level {league.sport.toLowerCase()} league
            </p>
          </div>
        </div>
      </div>

      {/* Quick Info Bar */}
      <div className="bg-[#ffeae5] py-6">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start">
              <Clock className="h-5 w-5 text-[#B20000] mr-2" />
              <div>
                <p className="font-medium text-[#6F6F6F]">{league.day}</p>
                <p className="text-sm text-[#6F6F6F]">{league.playTimes.join(", ")}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start">
              <Calendar className="h-5 w-5 text-[#B20000] mr-2" />
              <div>
                <p className="font-medium text-[#6F6F6F]">Season</p>
                <p className="text-sm text-[#6F6F6F]">{league.dates}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start">
              <MapPin className="h-5 w-5 text-[#B20000] mr-2" />
              <div>
                <p className="font-medium text-[#6F6F6F]">{league.location}</p>
                {league.sport === "Volleyball" ? (
                  <p className="text-sm text-[#6F6F6F]">Location varies</p>
                ) : (
                  league.specificLocation && league.location !== league.specificLocation && (
                    <p className="text-sm text-[#6F6F6F]">{league.specificLocation}</p>
                  )
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start">
              <DollarSign className="h-5 w-5 text-[#B20000] mr-2" />
              <div>
                <p className="font-medium text-[#6F6F6F]">
                  ${league.price} {league.sport === "Volleyball" ? "per team" : "per player"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start">
              <Users className="h-5 w-5 text-[#B20000] mr-2" />
              <div className="flex items-center">
                <span className={`text-sm font-medium py-1 px-3 rounded-full ${getSpotsBadgeColor(league.spotsRemaining)}`}>
                  {getSpotsText(league.spotsRemaining)}
                </span>
                <Button 
                  className={`ml-4 bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 ${
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
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-8 md:py-12">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('details')}
            className={getTabClasses('details')}
          >
            League Details
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={getTabClasses('schedule')}
          >
            Schedule
          </button>
          <button
            onClick={() => setActiveTab('standings')}
            className={getTabClasses('standings')}
          >
            Standings
          </button>
        </div>

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-8">
            {/* League Overview */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-[#6F6F6F] mb-6 flex items-center">
                  <Users className="h-6 w-6 mr-2 text-[#B20000]" />
                  League Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-[#6F6F6F] mb-2">Format</h3>
                    <p className="text-[#6F6F6F]">
                      {league.sport === "Volleyball" ? "6v6 Indoor Volleyball" : 
                       league.sport === "Badminton" ? "Singles/Doubles Badminton" :
                       league.sport === "Basketball" ? "5v5 Basketball" : 
                       "Doubles Pickleball"}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#6F6F6F] mb-2">Season Length</h3>
                    <p className="text-[#6F6F6F]">12 weeks + playoffs</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#6F6F6F] mb-2">Game Duration</h3>
                    <p className="text-[#6F6F6F]">
                      {league.sport === "Volleyball" ? "Best 2 of 3 sets" :
                       league.sport === "Badminton" ? "Best 2 of 3 games to 21" :
                       league.sport === "Basketball" ? "Two 20-minute halves" :
                       "Best 2 of 3 games to 11"}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#6F6F6F] mb-2">Team Size</h3>
                    <p className="text-[#6F6F6F]">
                      {league.sport === "Volleyball" ? "6 players on court, 8-12 roster" :
                       league.sport === "Badminton" ? "1-2 players per match" :
                       league.sport === "Basketball" ? "5 players on court, 8-10 roster" :
                       "2 players per team"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule & Location */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-[#6F6F6F] mb-6 flex items-center">
                  <MapPin className="h-6 w-6 mr-2 text-[#B20000]" />
                  Schedule & Location
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-[#6F6F6F] mb-2">Game Day</h3>
                    <p className="text-[#6F6F6F] mb-4">{league.day}</p>
                    
                    <h3 className="font-bold text-[#6F6F6F] mb-2">Game Times</h3>
                    <ul className="text-[#6F6F6F] space-y-1">
                      {league.playTimes.map((time, index) => (
                        <li key={index}>• {time}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#6F6F6F] mb-2">Location</h3>
                    <p className="text-[#6F6F6F] mb-2">{league.location}</p>
                    {league.sport === "Volleyball" ? (
                      <p className="text-sm text-gray-500">
                        Games are played at various high schools and community centers throughout Ottawa. 
                        Specific locations are announced weekly based on availability.
                      </p>
                    ) : (
                      league.specificLocation && league.location !== league.specificLocation && (
                        <p className="text-sm text-gray-500">{league.specificLocation}</p>
                      )
                    )}
                    
                    <h3 className="font-bold text-[#6F6F6F] mb-2 mt-4">Season Dates</h3>
                    <p className="text-[#6F6F6F]">{league.dates}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skill Level Requirements */}
            <div className="bg-white">
              <h3 className="text-xl font-bold text-[#6F6F6F] mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-[#B20000]" />
                Skill Level Requirements - {league.skillLevel}
              </h3>
              <div className="text-[#6F6F6F] space-y-3">
                {league.skillLevel === "Elite" && (
                  <>
                    <p>• Extensive competitive experience at high school, college, or club level</p>
                    <p>• Advanced technical skills and game knowledge</p>
                    <p>• Ability to execute complex strategies and plays</p>
                    <p>• Strong physical conditioning and athletic ability</p>
                    <p>• Experience playing in organized leagues or tournaments</p>
                  </>
                )}
                {league.skillLevel === "Competitive" && (
                  <>
                    <p>• Solid fundamental skills and good game understanding</p>
                    <p>• Some competitive experience preferred</p>
                    <p>• Ability to execute basic strategies and team plays</p>
                    <p>• Good physical fitness and coordination</p>
                    <p>• Comfortable with fast-paced, competitive gameplay</p>
                  </>
                )}
                {league.skillLevel === "Advanced" && (
                  <>
                    <p>• Strong fundamental skills and good technique</p>
                    <p>• Understanding of game strategy and positioning</p>
                    <p>• Some league or organized play experience</p>
                    <p>• Good fitness level and coordination</p>
                    <p>• Ability to play consistently at a higher level</p>
                  </>
                )}
                {league.skillLevel === "Intermediate" && (
                  <>
                    <p>• Basic to solid fundamental skills</p>
                    <p>• Understanding of basic rules and gameplay</p>
                    <p>• Some recreational or casual play experience</p>
                    <p>• Willingness to learn and improve</p>
                    <p>• Comfortable with moderate pace of play</p>
                  </>
                )}
              </div>
            </div>

            {/* Registration Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-[#6F6F6F] mb-6 flex items-center">
                  <MessageSquare className="h-6 w-6 mr-2 text-[#B20000]" />
                  Registration Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-[#6F6F6F] mb-2">How to Register</h3>
                    {league.sport === "Volleyball" ? (
                      <div className="text-[#6F6F6F] space-y-2">
                        <p>• Team captains must register their team and roster</p>
                        <p>• Individual players can sign up as free agents to be placed on a team</p>
                        <p>• All players must create an OFSL account before joining</p>
                        <p>• Payment is required to secure your spot in the league</p>
                      </div>
                    ) : (
                      <div className="text-[#6F6F6F] space-y-2">
                        <p>• Individual registration - no need to form a team in advance</p>
                        <p>• Players are matched based on skill level and availability</p>
                        <p>• Create an OFSL account and complete your player profile</p>
                        <p>• Payment is required to secure your spot in the league</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-[#6F6F6F] mb-2">What's Included</h3>
                    <div className="text-[#6F6F6F] space-y-2">
                      <p>• 12 weeks of regular season games</p>
                      <p>• Playoff tournament for qualifying teams</p>
                      <p>• Professional referees for all games</p>
                      <p>• Online schedule and standings</p>
                      <p>• League administration and support</p>
                      {league.sport === "Badminton" && <p>• Shuttlecocks provided for all matches</p>}
                      {league.sport === "Volleyball" && <p>• Volleyballs provided for all matches</p>}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-[#6F6F6F] mb-2">Payment & Refunds</h3>
                    <div className="text-[#6F6F6F] space-y-2">
                      <p>• Full payment due upon registration</p>
                      <p>• Refunds available up to 14 days before season start</p>
                      <p>• 50% refund available within 14 days of season start</p>
                      <p>• No refunds once the season begins</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-[#6F6F6F] mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
                  Important Notes
                </h2>
                <div className="text-[#6F6F6F] space-y-2">
                  <p>• All players must be 18+ to participate in OFSL leagues</p>
                  <p>• Proof of age may be required during registration</p>
                  <p>• Players are responsible for their own equipment (except balls/shuttles)</p>
                  <p>• Non-marking indoor court shoes are mandatory</p>
                  <p>• OFSL reserves the right to move players between divisions based on skill assessment</p>
                  <p>• Regular attendance is expected - excessive absences may affect playoff eligibility</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#6F6F6F] mb-2">League Schedule</h2>
              <p className="text-[#6F6F6F]">
                Games are scheduled weekly. Locations may vary based on facility availability.
              </p>
            </div>

            {scheduleData.map((week) => (
              <Card key={week.week}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-5 w-5 text-[#B20000] mr-2" />
                    <h3 className="text-xl font-bold text-[#6F6F6F]">
                      Week {week.week} - {week.date}
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    {week.games.map((game, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-[#B20000] mr-2" />
                            <span className="font-medium text-[#6F6F6F]">{game.time}</span>
                          </div>
                          
                          <div className="text-center">
                            <span className="text-[#6F6F6F] font-medium">
                              {game.team1} <span className="text-[#B20000]">vs</span> {game.team2}
                            </span>
                          </div>
                          
                          <div className="flex items-center md:justify-end">
                            <MapPin className="h-4 w-4 text-[#B20000] mr-2" />
                            <span className="text-sm text-[#6F6F6F]">{game.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#6F6F6F] mb-2">Schedule Notes</h3>
                <ul className="text-[#6F6F6F] space-y-1 text-sm">
                  <li>• Game locations are confirmed 48 hours before each match</li>
                  <li>• Teams should arrive 15 minutes before their scheduled game time</li>
                  <li>• Rescheduling requests must be submitted at least 72 hours in advance</li>
                  <li>• Playoff schedule will be released after the regular season concludes</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Standings Tab */}
        {activeTab === 'standings' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#6F6F6F] mb-2">Current Standings</h2>
              <p className="text-[#6F6F6F]">
                Updated after Week 9 games. Top 4 teams qualify for playoffs.
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 font-bold text-[#6F6F6F]">Rank</th>
                        <th className="text-left py-3 px-2 font-bold text-[#6F6F6F]">Team</th>
                        <th className="text-center py-3 px-2 font-bold text-[#6F6F6F]">Wins</th>
                        <th className="text-center py-3 px-2 font-bold text-[#6F6F6F]">Losses</th>
                        <th className="text-center py-3 px-2 font-bold text-[#6F6F6F]">Points</th>
                        <th className="text-center py-3 px-2 font-bold text-[#6F6F6F]">Streak</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standingsData.map((team) => (
                        <tr key={team.rank} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-2">
                            <div className="flex items-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRankBadge(team.rank)}`}>
                                #{team.rank}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <span className="font-medium text-[#6F6F6F]">{team.team}</span>
                            {team.rank <= 4 && (
                              <span className="ml-2 text-xs text-green-600 font-medium">Playoff Bound</span>
                            )}
                          </td>
                          <td className="py-4 px-2 text-center font-medium text-[#6F6F6F]">{team.wins}</td>
                          <td className="py-4 px-2 text-center font-medium text-[#6F6F6F]">{team.losses}</td>
                          <td className="py-4 px-2 text-center font-bold text-[#B20000]">{team.points}</td>
                          <td className="py-4 px-2 text-center">
                            <span className={`font-medium ${getStreakColor(team.streak)}`}>
                              {team.streak}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-[#6F6F6F] mb-4">Playoff Picture</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium text-[#6F6F6F]">Playoff Spots</span>
                      <span className="text-green-600 font-bold">Top 4 Teams</span>
                    </div>
                    <div className="text-sm text-[#6F6F6F] space-y-1">
                      <p>• Thunder Bolts - Clinched #1 seed</p>
                      <p>• Net Ninjas - Clinched playoff spot</p>
                      <p>• Spike Squad - Clinched playoff spot</p>
                      <p>• Ace Attackers - Clinched playoff spot</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-[#6F6F6F] mb-4">Scoring System</h3>
                  <div className="space-y-2 text-sm text-[#6F6F6F]">
                    <div className="flex justify-between">
                      <span>Win (2-0 or 2-1)</span>
                      <span className="font-medium">3 points</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Loss (1-2)</span>
                      <span className="font-medium">1 point</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Loss (0-2)</span>
                      <span className="font-medium">0 points</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Forfeit Loss</span>
                      <span className="font-medium">-1 point</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#6F6F6F] mb-2">Standings Notes</h3>
                <ul className="text-[#6F6F6F] space-y-1 text-sm">
                  <li>• Standings are updated within 24 hours of completed games</li>
                  <li>• Tiebreakers: 1) Head-to-head record, 2) Point differential, 3) Total points scored</li>
                  <li>• Teams must maintain 75% attendance to be eligible for playoffs</li>
                  <li>• Playoff format: Semi-finals (1v4, 2v3) followed by Championship game</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};