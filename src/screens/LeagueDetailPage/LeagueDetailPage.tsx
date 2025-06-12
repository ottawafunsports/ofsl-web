import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  Star,
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
    description: "Our most competitive women's volleyball league featuring elite-level play. This league is designed for experienced players who have played at high school varsity, college, or club levels.",
    requirements: [
      "Minimum 3 years of competitive volleyball experience",
      "Strong fundamental skills in all positions",
      "Ability to execute advanced techniques (jump serves, quick sets, etc.)",
      "Understanding of complex offensive and defensive systems",
      "Commitment to high-level competitive play"
    ],
    whatsappLink: "https://chat.whatsapp.com/example1",
    maxPlayers: 18,
    currentPlayers: 16
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
    description: "A great league for players looking to improve their skills in a fun, competitive environment. Perfect for those with some volleyball experience who want to take their game to the next level.",
    requirements: [
      "Basic understanding of volleyball rules and positions",
      "Ability to serve overhand consistently",
      "Comfortable with basic passing, setting, and hitting",
      "1-2 years of recreational or organized play experience",
      "Willingness to learn and improve"
    ],
    whatsappLink: "https://chat.whatsapp.com/example2",
    maxPlayers: 20,
    currentPlayers: 12
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
    description: "High-level badminton competition for experienced players. Features both singles and doubles play with advanced techniques and strategies.",
    requirements: [
      "Strong fundamental badminton techniques",
      "Experience with advanced shots (drops, smashes, clears)",
      "Good court movement and positioning",
      "Understanding of singles and doubles strategies",
      "Competitive tournament experience preferred"
    ],
    whatsappLink: "https://chat.whatsapp.com/example3",
    maxPlayers: 16,
    currentPlayers: 16
  }
};

export const LeagueDetailPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'details' | 'schedule' | 'standings'>('details');
  
  // Get league data based on ID
  const league = mockLeagueData[id as keyof typeof mockLeagueData];
  
  if (!league) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#6F6F6F] mb-4">League Not Found</h1>
          <p className="text-[#6F6F6F] mb-6">The league you're looking for doesn't exist.</p>
          <Link to="/leagues">
            <Button className="bg-[#B20000] hover:bg-[#8A0000] text-white">
              Back to Leagues
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
    if (spots === 0) return "Full - Join Waitlist";
    if (spots === 1) return "1 spot left";
    return `${spots} spots left`;
  };

  // Get skill level stars
  const getSkillLevelStars = (level: string) => {
    const levels = {
      'Elite': 4,
      'Competitive': 3,
      'Advanced': 2.5,
      'Intermediate': 2
    };
    return levels[level as keyof typeof levels] || 1;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="text-[#b20000] fill-[#b20000] w-5 h-5" />);
    }
    
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative w-5 h-5">
          <Star className="text-[#b20000] w-5 h-5" />
          <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden">
            <Star className="text-[#b20000] fill-[#b20000] w-5 h-5" />
          </div>
        </div>
      );
    }
    
    const emptyStars = 4 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-[#b20000] w-5 h-5" />);
    }
    
    return stars;
  };

  return (
    <div className="bg-white w-full min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 py-8 md:py-12">
        {/* Back to Leagues Link */}
        <div className="mb-6">
          <Link 
            to="/leagues" 
            className="text-[#B20000] hover:text-[#8A0000] font-medium flex items-center"
          >
            ← Back to Leagues
          </Link>
        </div>

        {/* League Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-6">
            <img 
              src={getSportIcon(league.sport)} 
              alt={`${league.sport} icon`}
              className="w-16 h-16 object-contain"
            />
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-[#6F6F6F] mb-2">{league.name}</h1>
              <p className="text-lg text-[#6F6F6F]">{league.description}</p>
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-[#ffeae5] border-none">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6F6F6F]">Day & Time</p>
                    <p className="text-lg font-bold text-[#B20000]">{league.day}</p>
                    <p className="text-xs text-[#6F6F6F]">{league.playTimes.join(", ")}</p>
                  </div>
                  <Clock className="h-6 w-6 text-[#B20000]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-none">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6F6F6F]">Location</p>
                    <p className="text-lg font-bold text-blue-600">{league.location}</p>
                    <p className="text-xs text-[#6F6F6F]">{league.specificLocation}</p>
                  </div>
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-none">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6F6F6F]">Price</p>
                    <p className="text-lg font-bold text-green-600">${league.price}</p>
                    <p className="text-xs text-[#6F6F6F]">
                      {league.sport === "Volleyball" ? "per team" : "per player"}
                    </p>
                  </div>
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-none">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6F6F6F]">Availability</p>
                    <p className={`text-lg font-bold ${league.spotsRemaining === 0 ? 'text-red-600' : 'text-purple-600'}`}>
                      {league.currentPlayers}/{league.maxPlayers}
                    </p>
                    <p className="text-xs text-[#6F6F6F]">{getSpotsText(league.spotsRemaining)}</p>
                  </div>
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3 font-medium text-lg border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-[#B20000] text-[#B20000]'
                : 'border-transparent text-[#6F6F6F] hover:text-[#B20000]'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-6 py-3 font-medium text-lg border-b-2 transition-colors ${
              activeTab === 'schedule'
                ? 'border-[#B20000] text-[#B20000]'
                : 'border-transparent text-[#6F6F6F] hover:text-[#B20000]'
            }`}
          >
            Schedule
          </button>
          <button
            onClick={() => setActiveTab('standings')}
            className={`px-6 py-3 font-medium text-lg border-b-2 transition-colors ${
              activeTab === 'standings'
                ? 'border-[#B20000] text-[#B20000]'
                : 'border-transparent text-[#6F6F6F] hover:text-[#B20000]'
            }`}
          >
            Standings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* League Information */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-[#6F6F6F] mb-4">League Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-[#6F6F6F] mb-2">Season Dates</h3>
                      <p className="text-[#6F6F6F] flex items-center">
                        <Calendar className="h-4 w-4 text-[#B20000] mr-2" />
                        {league.dates}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-[#6F6F6F] mb-2">Format</h3>
                      <p className="text-[#6F6F6F]">{league.format}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-[#6F6F6F] mb-2">Skill Level</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {renderStars(getSkillLevelStars(league.skillLevel))}
                        </div>
                        <span className="text-[#6F6F6F] font-medium">{league.skillLevel}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-[#6F6F6F] mb-2">Max Players</h3>
                      <p className="text-[#6F6F6F]">{league.maxPlayers} players</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skill Level Requirements - Updated to remove grey background */}
              <div>
                <h2 className="text-2xl font-bold text-[#6F6F6F] mb-4">Skill Level Requirements</h2>
                <div className="space-y-3">
                  {league.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-[#6F6F6F]">{requirement}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Notes */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Info className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-blue-800 mb-2">Important Notes</h3>
                      <ul className="text-blue-700 space-y-1">
                        <li>• All players must sign a waiver before participating</li>
                        <li>• Teams must have minimum players to avoid forfeit</li>
                        <li>• Payment is due within 7 days of registration</li>
                        <li>• Refund policy applies - see terms and conditions</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Card */}
              <Card className="border-2 border-[#B20000]">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getSpotsBadgeColor(league.spotsRemaining)}`}>
                      {getSpotsText(league.spotsRemaining)}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <Button 
                      className={`w-full bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] ${
                        league.spotsRemaining === 0 ? 'opacity-90' : ''
                      }`}
                      disabled={league.spotsRemaining === 0}
                    >
                      {league.spotsRemaining === 0 ? 'Join Waitlist' : 'Register Now'}
                    </Button>
                    
                    {league.whatsappLink && (
                      <Button 
                        variant="outline" 
                        className="w-full border-[#B20000] text-[#B20000] hover:bg-[#B20000] hover:text-white"
                        onClick={() => window.open(league.whatsappLink, '_blank')}
                      >
                        Join WhatsApp Group
                      </Button>
                    )}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#6F6F6F]">Price:</span>
                      <span className="font-bold text-[#B20000]">
                        ${league.price} {league.sport === "Volleyball" ? "per team" : "per player"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#6F6F6F]">Players:</span>
                      <span className="font-medium text-[#6F6F6F]">
                        {league.currentPlayers}/{league.maxPlayers}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-[#6F6F6F] mb-4">Need Help?</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-[#6F6F6F]">
                      Have questions about this league? Contact us:
                    </p>
                    <div className="space-y-2">
                      <a 
                        href={`mailto:${league.sport.toLowerCase()}@ofsl.ca`}
                        className="block text-[#B20000] hover:underline text-sm"
                      >
                        {league.sport.toLowerCase()}@ofsl.ca
                      </a>
                      <a 
                        href="mailto:info@ofsl.ca"
                        className="block text-[#B20000] hover:underline text-sm"
                      >
                        info@ofsl.ca
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-[#6F6F6F] mb-4">Schedule Coming Soon</h2>
            <p className="text-[#6F6F6F]">
              The schedule will be available closer to the season start date.
            </p>
          </div>
        )}

        {/* Standings Tab */}
        {activeTab === 'standings' && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-[#6F6F6F] mb-4">Standings Coming Soon</h2>
            <p className="text-[#6F6F6F]">
              Standings will be updated throughout the season.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};