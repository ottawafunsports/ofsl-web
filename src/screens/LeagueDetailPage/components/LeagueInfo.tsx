import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { MapPin, Calendar, Clock, Users, DollarSign, Info } from "lucide-react";

interface LeagueInfoProps {
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
}

export function LeagueInfo({ league }: LeagueInfoProps) {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-[#6F6F6F] mb-6 flex items-center">
          <Info className="h-6 w-6 mr-2 text-[#B20000]" />
          League Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-[#B20000] mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold text-[#6F6F6F] mb-1">Schedule</h3>
                <p className="text-[#6F6F6F]">{league.day}</p>
                <p className="text-sm text-gray-500">{league.playTimes.join(", ")}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-[#B20000] mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold text-[#6F6F6F] mb-1">Season Dates</h3>
                <p className="text-[#6F6F6F]">{league.dates}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-[#B20000] mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold text-[#6F6F6F] mb-1">Location</h3>
                <p className="text-[#6F6F6F]">{league.location}</p>
                {league.sport === "Volleyball" ? (
                  <p className="text-sm text-gray-500">Location varies by tier</p>
                ) : (
                  league.specificLocation && league.location !== league.specificLocation && (
                    <p className="text-sm text-gray-500">{league.specificLocation}</p>
                  )
                )}
              </div>
            </div>
            
            <div className="flex items-start">
              <DollarSign className="h-5 w-5 text-[#B20000] mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold text-[#6F6F6F] mb-1">Cost</h3>
                <p className="text-[#6F6F6F]">
                  ${league.price} {league.sport === "Volleyball" ? "per team" : "per player"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}