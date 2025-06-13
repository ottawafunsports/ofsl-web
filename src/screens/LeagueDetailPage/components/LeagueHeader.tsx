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
  getSportIcon: (sport: string) => string;
  getSkillLevelColor: (level: string) => string;
  getSpotsBadgeColor: (spots: number) => string;
  getSpotsText: (spots: number) => string;
}

export const LeagueHeader: React.FC<LeagueHeaderProps> = ({
  league,
  getSportIcon,
  getSkillLevelColor,
  getSpotsBadgeColor,
  getSpotsText
}) => {
  return (
    <>
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
    </>
  );
};