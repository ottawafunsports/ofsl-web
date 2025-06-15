import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";
import { Users, MapPin, Calendar, Clock, DollarSign } from "lucide-react";

interface League {
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
}

interface RelatedLeaguesProps {
  currentLeague: League;
  allLeagues: League[];
}

export function RelatedLeagues({ currentLeague, allLeagues }: RelatedLeaguesProps) {
  // Filter related leagues (same sport, different skill level or format)
  const relatedLeagues = allLeagues
    .filter(league => 
      league.id !== currentLeague.id && 
      league.sport === currentLeague.sport
    )
    .slice(0, 3);

  if (relatedLeagues.length === 0) {
    return null;
  }

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
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[#6F6F6F] mb-6">
        Other {currentLeague.sport} Leagues
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedLeagues.map(league => (
          <Link 
            key={league.id} 
            to={`/leagues/${league.id}`}
            className="block rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <Card className="overflow-hidden rounded-lg border border-gray-200 flex flex-col h-full">
              <CardContent className="p-0 flex flex-col h-full">
                <div className="bg-[#F8F8F8] border-b border-gray-200 p-4 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-[#6F6F6F] line-clamp-2">{league.name}</h3>
                  </div>
                  <img 
                    src={getSportIcon(league.sport)} 
                    alt={`${league.sport} icon`}
                    className="w-8 h-8 object-contain ml-2"
                  />
                </div>
                
                <div className="p-4 flex-grow flex flex-col space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-[#B20000] mr-1.5" />
                      <p className="text-sm font-medium text-[#6F6F6F]">{league.day}</p>
                    </div>
                    <p className="text-sm text-[#6F6F6F] ml-6">
                      {league.playTimes.join(", ")}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-[#B20000] mr-1.5" />
                      <p className="text-sm font-medium text-[#6F6F6F]">{league.dates}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-[#B20000] mr-1.5" />
                      <p className="text-sm font-medium text-[#6F6F6F]">{league.location}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-[#B20000] mr-1.5" />
                      <p className="text-sm font-medium text-[#6F6F6F]">
                        ${league.price} {league.sport === "Volleyball" ? "per team" : "per player"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto p-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-[#B20000] mr-1" />
                    <span className={`text-xs font-medium py-0.5 px-2 rounded-full ${getSpotsBadgeColor(league.spotsRemaining)}`}>
                      {getSpotsText(league.spotsRemaining)}
                    </span>
                  </div>
                  
                  <Button 
                    className={`bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-4 ${
                      league.spotsRemaining === 0 ? 'opacity-90' : ''
                    }`}
                    disabled={league.spotsRemaining === 0}
                  >
                    {league.spotsRemaining === 0 ? 'Join Waitlist' : 'View Details'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}