import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Calendar, Clock, MapPin, Users, DollarSign } from "lucide-react";
import { League } from "../../hooks/useLeaguesData";

interface LeagueCardProps {
  league: League;
}

export function LeagueCard({ league }: LeagueCardProps) {
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
        return "/pickleball.png";
      default:
        return "";
    }
  };

  return (
    <Link 
      to={`/leagues/${league.id}`}
      className="block rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <Card 
        className="overflow-hidden rounded-lg border border-gray-200 flex flex-col h-full"
      >
        <CardContent className="p-0 flex flex-col h-full">
          {/* Card Header with League Name and Sport Icon */}
          <div className="bg-[#F8F8F8] border-b border-gray-200 p-4 flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-[#6F6F6F] line-clamp-2">{league.name}</h3>
            </div>
            {/* Sport Icon in top right */}
            <img 
              src={getSportIcon(league.sport)} 
              alt={`${league.sport} icon`}
              className="w-8 h-8 object-contain ml-2"
            />
          </div>
          
          {/* Card Body with Info in Rows - Rearranged to match required order */}
          <div className="p-4 flex-grow flex flex-col space-y-4">
            {/* 1. Time (Day & Time) */}
             <div className="space-y-1">
               <div className="flex items-center">
                <Clock className="h-4 w-4 text-[#B20000] mr-1.5" />
                <p className="text-sm font-medium text-[#6F6F6F]">{league.day}</p>
              </div>
              <p className="text-sm text-[#6F6F6F] ml-6">
                {league.playTimes.join(", ")}
              </p>
            </div>
            
            {/* 2. Dates (Season Dates) */}
            <div className="space-y-1">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-[#B20000] mr-1.5" />
                <p className="text-sm font-medium text-[#6F6F6F]">{league.dates}</p>
              </div>
            </div>
            
            {/* 3. Location */}
            <div className="space-y-1">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-[#B20000] mr-1.5" />
                <p className="text-sm font-medium text-[#6F6F6F]">{league.location}</p>
              </div>
              {league.sport === "Volleyball" ? (
                <p className="text-xs text-gray-500 ml-6">Location varies</p>
              ) : (
                league.specificLocation && league.location !== league.specificLocation && (
                  <p className="text-xs text-gray-500 ml-6">{league.specificLocation}</p>
                )
              )}
            </div>
            
            {/* 4. Price (replacing Skill Level) - Now conditionally showing per team or per player */}
            <div className="space-y-1">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-[#B20000] mr-1.5" />
                <p className="text-sm font-medium text-[#6F6F6F]">
                  ${league.price} {league.sport === "Volleyball" ? "per team" : "per player"}
                </p>
              </div>
            </div>
          </div>
          
          {/* Register Button with spots remaining - In same line */}
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
  );
}