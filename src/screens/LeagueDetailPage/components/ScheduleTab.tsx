import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface ScheduleTabProps {
  league: {
    name: string;
    sport: string;
    day: string;
    playTimes: string[];
  };
}

interface ScheduleGame {
  id: number;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  homeScore?: number;
  awayScore?: number;
}

export function ScheduleTab({ league }: ScheduleTabProps) {
  // Mock schedule data - in a real app, this would come from the database
  const scheduleGames: ScheduleGame[] = [
    {
      id: 1,
      date: "2025-01-15",
      time: "7:00 PM",
      homeTeam: "Thunder Bolts",
      awayTeam: "Lightning Strikes",
      location: "Carleton University - Gym A",
      status: "upcoming"
    },
    {
      id: 2,
      date: "2025-01-15",
      time: "8:00 PM",
      homeTeam: "Net Ninjas",
      awayTeam: "Spike Squad",
      location: "Carleton University - Gym B",
      status: "upcoming"
    },
    {
      id: 3,
      date: "2025-01-08",
      time: "7:00 PM",
      homeTeam: "Thunder Bolts",
      awayTeam: "Net Ninjas",
      location: "Carleton University - Gym A",
      status: "completed",
      homeScore: 2,
      awayScore: 1
    },
    {
      id: 4,
      date: "2025-01-08",
      time: "8:00 PM",
      homeTeam: "Lightning Strikes",
      awayTeam: "Spike Squad",
      location: "Carleton University - Gym B",
      status: "completed",
      homeScore: 0,
      awayScore: 2
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingGames = scheduleGames.filter(game => game.status === 'upcoming');
  const completedGames = scheduleGames.filter(game => game.status === 'completed');

  return (
    <div className="space-y-8">
      {/* League Schedule Info */}
      <div className="bg-[#ffeae5] rounded-lg p-6">
        <h3 className="text-xl font-bold text-[#6F6F6F] mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-[#B20000]" />
          Schedule Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-[#B20000] mr-2" />
            <span className="text-[#6F6F6F]">
              <span className="font-medium">Game Day:</span> {league.day}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-[#B20000] mr-2" />
            <span className="text-[#6F6F6F]">
              <span className="font-medium">Time Slots:</span> {league.playTimes.join(", ")}
            </span>
          </div>
        </div>
        <p className="text-sm text-[#6F6F6F] mt-4">
          Game schedules are updated weekly. Teams will be notified of any changes via email and WhatsApp.
        </p>
      </div>

      {/* Upcoming Games */}
      <div>
        <h3 className="text-2xl font-bold text-[#6F6F6F] mb-6">Upcoming Games</h3>
        {upcomingGames.length > 0 ? (
          <div className="space-y-4">
            {upcomingGames.map((game) => (
              <div key={game.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 text-[#B20000] mr-2" />
                      <span className="font-medium text-[#6F6F6F]">{formatDate(game.date)}</span>
                      <Clock className="h-4 w-4 text-[#B20000] ml-4 mr-2" />
                      <span className="text-[#6F6F6F]">{game.time}</span>
                    </div>
                    <div className="text-lg font-bold text-[#6F6F6F] mb-2">
                      {game.homeTeam} vs {game.awayTeam}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {game.location}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(game.status)}`}>
                      {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[#6F6F6F]">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No upcoming games scheduled at this time.</p>
          </div>
        )}
      </div>

      {/* Recent Results */}
      <div>
        <h3 className="text-2xl font-bold text-[#6F6F6F] mb-6">Recent Results</h3>
        {completedGames.length > 0 ? (
          <div className="space-y-4">
            {completedGames.map((game) => (
              <div key={game.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 text-[#B20000] mr-2" />
                      <span className="font-medium text-[#6F6F6F]">{formatDate(game.date)}</span>
                      <Clock className="h-4 w-4 text-[#B20000] ml-4 mr-2" />
                      <span className="text-[#6F6F6F]">{game.time}</span>
                    </div>
                    <div className="text-lg font-bold text-[#6F6F6F] mb-2">
                      {game.homeTeam} {game.homeScore} - {game.awayScore} {game.awayTeam}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {game.location}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(game.status)}`}>
                      Final
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[#6F6F6F]">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No completed games yet this season.</p>
          </div>
        )}
      </div>
    </div>
  );
}