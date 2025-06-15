import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { useToast } from "../../components/ui/toast";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  Star,
  Target,
  Trophy,
  MessageSquare,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";

// Mock league data - in a real app, this would come from the database
const mockLeagueData = {
  1: {
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
    image: "/womens-elite-card.jpg",
    description: "Our most competitive women's volleyball league featuring elite-level play. Teams compete at the highest level with advanced strategies and exceptional skill requirements.",
    requirements: [
      "Minimum 3 years competitive volleyball experience",
      "Strong fundamental skills in all positions",
      "Understanding of advanced volleyball strategies",
      "Commitment to attend all games and practices"
    ],
    schedule: [
      { date: "May 5, 2025", time: "7:00 PM", opponent: "Team Thunder", location: "Carleton University - Gym A" },
      { date: "May 12, 2025", time: "7:00 PM", opponent: "Team Lightning", location: "Carleton University - Gym B" },
      { date: "May 19, 2025", time: "8:00 PM", opponent: "Team Storm", location: "University of Ottawa - Gym 1" },
      { date: "May 26, 2025", time: "7:00 PM", opponent: "Team Blaze", location: "Carleton University - Gym A" }
    ]
  },
  2: {
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
    image: "/571North-CR3_0335-Indoor-VB-Header-Featured.jpg",
    description: "A welcoming coed volleyball league perfect for intermediate players looking to improve their skills while having fun in a competitive environment.",
    requirements: [
      "Basic volleyball skills and knowledge of rules",
      "Ability to serve, pass, and spike consistently",
      "Good sportsmanship and team attitude",
      "Regular attendance commitment"
    ],
    schedule: [
      { date: "May 6, 2025", time: "7:00 PM", opponent: "Team Spike", location: "University of Ottawa - Gym 2" },
      { date: "May 13, 2025", time: "9:00 PM", opponent: "Team Ace", location: "University of Ottawa - Gym 1" },
      { date: "May 20, 2025", time: "7:00 PM", opponent: "Team Volley", location: "University of Ottawa - Gym 2" },
      { date: "May 27, 2025", time: "9:00 PM", opponent: "Team Net", location: "University of Ottawa - Gym 1" }
    ]
  },
  3: {
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
    image: "/badminton-card.png",
    description: "High-level badminton competition for advanced players. Features singles and doubles play with competitive tournament-style matches.",
    requirements: [
      "Advanced badminton techniques and footwork",
      "Tournament or competitive league experience",
      "Own badminton racket and appropriate footwear",
      "Understanding of advanced game strategies"
    ],
    schedule: [
      { date: "May 7, 2025", time: "6:30 PM", opponent: "Singles Tournament", location: "Rideau High School - Gym" },
      { date: "May 14, 2025", time: "6:30 PM", opponent: "Doubles Tournament", location: "Rideau High School - Gym" },
      { date: "May 21, 2025", time: "6:30 PM", opponent: "Mixed Tournament", location: "Rideau High School - Gym" },
      { date: "May 28, 2025", time: "6:30 PM", opponent: "Championship", location: "Rideau High School - Gym" }
    ]
  }
};

interface RegistrationForm {
  teamName: string;
  captainName: string;
  captainEmail: string;
  captainPhone: string;
  players: Array<{
    name: string;
    email: string;
    phone: string;
    position: string;
  }>;
  additionalInfo: string;
}

export const LeagueDetailPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [league, setLeague] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [gymInfo, setGymInfo] = useState<any>(null);
  
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>({
    teamName: '',
    captainName: '',
    captainEmail: user?.email || '',
    captainPhone: '',
    players: [
      { name: '', email: '', phone: '', position: '' },
      { name: '', email: '', phone: '', position: '' },
      { name: '', email: '', phone: '', position: '' },
      { name: '', email: '', phone: '', position: '' },
      { name: '', email: '', phone: '', position: '' },
      { name: '', email: '', phone: '', position: '' }
    ],
    additionalInfo: ''
  });

  useEffect(() => {
    if (id) {
      fetchLeagueData();
    }
  }, [id]);

  const fetchLeagueData = async () => {
    try {
      setLoading(true);
      
      // For now, use mock data
      const leagueData = mockLeagueData[parseInt(id!) as keyof typeof mockLeagueData];
      
      if (leagueData) {
        setLeague(leagueData);
        
        // Fetch gym information from database if available
        await fetchGymInfo(leagueData.specificLocation);
      } else {
        showToast('League not found', 'error');
      }
    } catch (error) {
      console.error('Error fetching league data:', error);
      showToast('Error loading league data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchGymInfo = async (gymName: string) => {
    try {
      // Try to find gym info in the database
      const { data: gymData, error } = await supabase
        .from('gyms')
        .select('*')
        .ilike('gym', `%${gymName}%`)
        .limit(1)
        .single();

      if (!error && gymData) {
        setGymInfo(gymData);
      }
    } catch (error) {
      // Gym not found in database, that's okay
      console.log('Gym info not found in database');
    }
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      showToast('Please log in to register', 'error');
      return;
    }

    // Validate required fields
    if (!registrationForm.teamName || !registrationForm.captainName || !registrationForm.captainPhone) {
      showToast('Please fill in all required team and captain information', 'error');
      return;
    }

    // Validate at least minimum number of players
    const validPlayers = registrationForm.players.filter(player => 
      player.name.trim() && player.email.trim() && player.phone.trim()
    );

    const minPlayers = league?.sport === 'Volleyball' ? 6 : 4;
    if (validPlayers.length < minPlayers) {
      showToast(`Please provide information for at least ${minPlayers} players`, 'error');
      return;
    }

    setRegistering(true);

    try {
      // In a real app, you would submit this to your registration system
      // For now, we'll just simulate the registration
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      showToast('Registration submitted successfully! You will receive a confirmation email shortly.', 'success');
      setShowRegistrationForm(false);
      
      // Reset form
      setRegistrationForm({
        teamName: '',
        captainName: '',
        captainEmail: user?.email || '',
        captainPhone: '',
        players: Array(6).fill({ name: '', email: '', phone: '', position: '' }),
        additionalInfo: ''
      });
      
    } catch (error) {
      console.error('Error submitting registration:', error);
      showToast('Error submitting registration. Please try again.', 'error');
    } finally {
      setRegistering(false);
    }
  };

  const updatePlayer = (index: number, field: string, value: string) => {
    setRegistrationForm(prev => ({
      ...prev,
      players: prev.players.map((player, i) => 
        i === index ? { ...player, [field]: value } : player
      )
    }));
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
    if (spots === 0) return "Full - Join Waitlist";
    if (spots === 1) return "1 spot left";
    return `${spots} spots left`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B20000]"></div>
      </div>
    );
  }

  if (!league) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#6F6F6F] mb-4">League Not Found</h1>
          <Link to="/leagues">
            <Button className="bg-[#B20000] hover:bg-[#8A0000] text-white">
              Back to Leagues
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 py-8 md:py-12">
        {/* Back Button */}
        <Link 
          to="/leagues" 
          className="inline-flex items-center text-[#B20000] hover:text-[#8A0000] mb-6 font-medium"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Leagues
        </Link>

        {/* League Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* League Image */}
          <div className="lg:col-span-1">
            <img
              src={league.image}
              alt={league.name}
              className="w-full h-[300px] object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* League Info */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={getSportIcon(league.sport)} 
                  alt={`${league.sport} icon`}
                  className="w-8 h-8 object-contain"
                />
                <h1 className="text-4xl font-bold text-[#6F6F6F]">{league.name}</h1>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSkillLevelColor(league.skillLevel)}`}>
                {league.skillLevel}
              </span>
            </div>

            <p className="text-lg text-[#6F6F6F] mb-6">{league.description}</p>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-[#B20000] mr-2" />
                <div>
                  <p className="font-medium text-[#6F6F6F]">{league.day}</p>
                  <p className="text-sm text-gray-500">{league.playTimes.join(", ")}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-[#B20000] mr-2" />
                <div>
                  <p className="font-medium text-[#6F6F6F]">Season Dates</p>
                  <p className="text-sm text-gray-500">{league.dates}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-[#B20000] mr-2" />
                <div>
                  <p className="font-medium text-[#6F6F6F]">{league.location}</p>
                  <p className="text-sm text-gray-500">
                    {league.sport === "Volleyball" ? "Location varies" : league.specificLocation}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-[#B20000] mr-2" />
                <div>
                  <p className="font-medium text-[#6F6F6F]">
                    ${league.price} {league.sport === "Volleyball" ? "per team" : "per player"}
                  </p>
                  <p className="text-sm text-gray-500">Registration fee</p>
                </div>
              </div>
            </div>

            {/* Availability and Registration */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-[#B20000]" />
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSpotsBadgeColor(league.spotsRemaining)}`}>
                  {getSpotsText(league.spotsRemaining)}
                </span>
              </div>
              
              {user ? (
                <Button 
                  onClick={() => setShowRegistrationForm(true)}
                  className={`bg-[#B20000] hover:bg-[#8A0000] text-white px-8 py-3 ${
                    league.spotsRemaining === 0 ? 'opacity-90' : ''
                  }`}
                >
                  {league.spotsRemaining === 0 ? 'Join Waitlist' : 'Register Team'}
                </Button>
              ) : (
                <Link to="/login">
                  <Button className="bg-[#B20000] hover:bg-[#8A0000] text-white px-8 py-3">
                    Login to Register
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Gym Information */}
        {gymInfo && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-[#6F6F6F] mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-[#B20000]" />
                Gym Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-[#6F6F6F] mb-2">Location</h4>
                  <p className="text-[#6F6F6F]">{gymInfo.gym}</p>
                  <p className="text-sm text-gray-500">{gymInfo.address}</p>
                </div>
                {gymInfo.instructions && (
                  <div>
                    <h4 className="font-medium text-[#6F6F6F] mb-2">Access Instructions</h4>
                    <p className="text-sm text-[#6F6F6F]">{gymInfo.instructions}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skill Level Requirements */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-[#6F6F6F] mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-[#B20000]" />
                  Skill Level Requirements
                </h3>
                <ul className="space-y-2">
                  {league.requirements.map((requirement: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-[#6F6F6F]">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-[#6F6F6F] mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-[#B20000]" />
                  Upcoming Schedule
                </h3>
                <div className="space-y-4">
                  {league.schedule.map((game: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="font-medium text-[#6F6F6F]">{game.date} at {game.time}</p>
                          <p className="text-sm text-gray-500">vs {game.opponent}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-[#6F6F6F]">{game.location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* League Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#6F6F6F] mb-4 flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-[#B20000]" />
                  League Info
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#6F6F6F]">Format:</span>
                    <span className="font-medium">{league.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6F6F6F]">Teams:</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6F6F6F]">Games per team:</span>
                    <span className="font-medium">10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6F6F6F]">Playoffs:</span>
                    <span className="font-medium">Top 8</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#6F6F6F] mb-4 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-[#B20000]" />
                  Questions?
                </h3>
                <p className="text-[#6F6F6F] mb-4">
                  Have questions about this league? Contact our league coordinator.
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Email:</strong> {league.sport.toLowerCase()}@ofsl.ca
                  </p>
                  <p className="text-sm">
                    <strong>Phone:</strong> (613) 798-6375
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Registration Form Modal */}
        {showRegistrationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#6F6F6F]">Register for {league.name}</h2>
                  <button
                    onClick={() => setShowRegistrationForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleRegistrationSubmit} className="space-y-6">
                  {/* Team Information */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-bold text-[#6F6F6F] mb-4">Team Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                            Team Name *
                          </label>
                          <Input
                            value={registrationForm.teamName}
                            onChange={(e) => setRegistrationForm(prev => ({ ...prev, teamName: e.target.value }))}
                            placeholder="Enter team name"
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Captain Information */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-bold text-[#6F6F6F] mb-4">Team Captain Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                            Captain Name *
                          </label>
                          <Input
                            value={registrationForm.captainName}
                            onChange={(e) => setRegistrationForm(prev => ({ ...prev, captainName: e.target.value }))}
                            placeholder="Enter captain name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                            Captain Email *
                          </label>
                          <Input
                            type="email"
                            value={registrationForm.captainEmail}
                            onChange={(e) => setRegistrationForm(prev => ({ ...prev, captainEmail: e.target.value }))}
                            placeholder="Enter captain email"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                            Captain Phone *
                          </label>
                          <Input
                            type="tel"
                            value={registrationForm.captainPhone}
                            onChange={(e) => setRegistrationForm(prev => ({ ...prev, captainPhone: e.target.value }))}
                            placeholder="Enter captain phone"
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Player Information */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-bold text-[#6F6F6F] mb-4">
                        Player Information 
                        <span className="text-sm font-normal text-gray-500 ml-2">
                          (Minimum {league.sport === 'Volleyball' ? '6' : '4'} players required)
                        </span>
                      </h3>
                      <div className="space-y-4">
                        {registrationForm.players.map((player, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-[#6F6F6F] mb-3">Player {index + 1}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-[#6F6F6F] mb-1">
                                  Name
                                </label>
                                <Input
                                  value={player.name}
                                  onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                                  placeholder="Player name"
                                  className="text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-[#6F6F6F] mb-1">
                                  Email
                                </label>
                                <Input
                                  type="email"
                                  value={player.email}
                                  onChange={(e) => updatePlayer(index, 'email', e.target.value)}
                                  placeholder="Player email"
                                  className="text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-[#6F6F6F] mb-1">
                                  Phone
                                </label>
                                <Input
                                  type="tel"
                                  value={player.phone}
                                  onChange={(e) => updatePlayer(index, 'phone', e.target.value)}
                                  placeholder="Player phone"
                                  className="text-sm"
                                />
                              </div>
                              {league.sport === 'Volleyball' && (
                                <div>
                                  <label className="block text-xs font-medium text-[#6F6F6F] mb-1">
                                    Preferred Position
                                  </label>
                                  <select
                                    value={player.position}
                                    onChange={(e) => updatePlayer(index, 'position', e.target.value)}
                                    className="w-full px-3 py-2 border border-[#D4D4D4] rounded-lg text-sm focus:border-[#B20000] focus:ring-[#B20000] focus:outline-none"
                                  >
                                    <option value="">Select position</option>
                                    <option value="Outside Hitter">Outside Hitter</option>
                                    <option value="Middle Blocker">Middle Blocker</option>
                                    <option value="Setter">Setter</option>
                                    <option value="Libero">Libero</option>
                                    <option value="Opposite">Opposite</option>
                                    <option value="Defensive Specialist">Defensive Specialist</option>
                                  </select>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Additional Information */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-bold text-[#6F6F6F] mb-4">Additional Information</h3>
                      <div>
                        <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                          Additional Comments or Special Requests
                        </label>
                        <textarea
                          value={registrationForm.additionalInfo}
                          onChange={(e) => setRegistrationForm(prev => ({ ...prev, additionalInfo: e.target.value }))}
                          placeholder="Any additional information you'd like to share..."
                          className="w-full px-3 py-2 border rounded-md text-sm"
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Submit Button */}
                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowRegistrationForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#B20000] hover:bg-[#8A0000] text-white"
                      disabled={registering}
                    >
                      {registering ? 'Submitting...' : 'Submit Registration'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};