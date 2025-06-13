import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Calendar, Clock, MapPin } from 'lucide-react';

export const ScheduleTab: React.FC = () => {
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

  return (
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
  );
};