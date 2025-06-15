import React from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { MapPin, Calendar, Clock, Users, DollarSign, Star } from "lucide-react";

interface LeagueHeaderProps {
  league: {
    id: number;
    name: string;
    sport: string;
    format: string;
    day: string;
    playTimes: string[];
    location: string;
    specificLocation: string;
    dates: string;
    skillLevel: string;
    price: number;
    spotsRemaining: number;
    isFeatured?: boolean;
    image: string;
  };
  onRegisterClick: () => void;
}

export function LeagueHeader({ league, onRegisterClick }: LeagueHeaderProps) {
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

  return (
    <div className="relative w-full h-[400px] mb-8">
      <img
        className="w-full h-full object-cover"
        alt={league.name}
        src={league.image}
      />
      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4">
        <div className="text-center text-white max-w-4xl">
          <div className="flex items-center justify-center mb-4">
            <img 
              src={getSportIcon(league.sport)} 
              alt={`${league.sport} icon`}
              className="w-12 h-12 object-contain mr-4"
            />
            <h1 className="text-4xl md:text-5xl font-bold">{league.name}</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-sm">
            <div className="flex items-center justify-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{league.day} - {league.playTimes.join(", ")}</span>
            </div>
            <div className="flex items-center justify-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{league.dates}</span>
            </div>
            <div className="flex items-center justify-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{league.location}</span>
            </div>
            <div className="flex items-center justify-center">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>${league.price} {league.sport === "Volleyball" ? "per team" : "per player"}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSkillLevelColor(league.skillLevel)}`}>
              {league.skillLevel}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSpotsBadgeColor(league.spotsRemaining)}`}>
              {getSpotsText(league.spotsRemaining)}
            </span>
            <Button 
              onClick={onRegisterClick}
              className={`bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-2 ${
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
  );
}