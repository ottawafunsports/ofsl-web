import { Card, CardContent } from "../ui/card";
import { Calendar, MapPin, Clock } from "lucide-react";
import { LeagueData } from "../../hooks/useLeagueData";

interface LeagueScheduleProps {
  league: LeagueData;
}

export function LeagueSchedule({ league }: LeagueScheduleProps) {
  return (
    <div className="max-w-[1280px] mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-[#6F6F6F] mb-8 text-center">
        Season Schedule
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {league.schedule.map((game, index) => (
          <Card key={index} className="border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#6F6F6F]">
                  Week {game.week}
                </h3>
                <span className="text-sm text-gray-500">
                  Game {index + 1}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-[#B20000] mr-2" />
                  <span className="text-[#6F6F6F]">{game.date}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-[#B20000] mr-2" />
                  <span className="text-[#6F6F6F]">{game.time}</span>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-[#B20000] mr-2" />
                  <span className="text-[#6F6F6F] text-sm">{game.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Schedule subject to change. Registered players will be notified of any updates.
        </p>
      </div>
    </div>
  );
}