import React from 'react';
import { Button } from '../../../components/ui/button';
import { MapPin, Calendar, Clock, Users, DollarSign } from 'lucide-react';

interface LeagueHeaderProps {
  league: {
    name: string;
    sport: string;
    skillLevel: string;
    day: string;
    playTimes: string[];
    location: string;
    specificLocation?: string;
    dates: string;
    price: number;
    spotsRemaining: number;
    image: string;
  };
  onRegisterClick: () => void;
}

export function LeagueHeader({ league, onRegisterClick }: LeagueHeaderProps) {
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

  return (
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
              onClick={onRegisterClick}
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
  );
}