import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Trophy, TrendingUp } from 'lucide-react';

export const StandingsTab: React.FC = () => {
  // Mock standings data
  const standingsData = [
    { rank: 1, team: "Thunder Bolts", wins: 8, losses: 1, points: 24, streak: "W5" },
    { rank: 2, team: "Net Ninjas", wins: 7, losses: 2, points: 21, streak: "W3" },
    { rank: 3, team: "Spike Squad", wins: 6, losses: 3, points: 18, streak: "L1" },
    { rank: 4, team: "Ace Attackers", wins: 5, losses: 4, points: 15, streak: "W2" },
    { rank: 5, team: "Block Party", wins: 3, losses: 6, points: 9, streak: "L2" },
    { rank: 6, team: "Set Point", wins: 1, losses: 8, points: 3, streak: "L6" }
  ];

  const getStreakColor = (streak: string) => {
    return streak.startsWith('W') ? 'text-green-600' : 'text-red-600';
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800';
    if (rank <= 4) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#6F6F6F] mb-2">Current Standings</h2>
        <p className="text-[#6F6F6F]">
          Updated after Week 9 games. Top 4 teams qualify for playoffs.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-bold text-[#6F6F6F]">Rank</th>
                  <th className="text-left py-3 px-2 font-bold text-[#6F6F6F]">Team</th>
                  <th className="text-center py-3 px-2 font-bold text-[#6F6F6F]">Wins</th>
                  <th className="text-center py-3 px-2 font-bold text-[#6F6F6F]">Losses</th>
                  <th className="text-center py-3 px-2 font-bold text-[#6F6F6F]">Points</th>
                  <th className="text-center py-3 px-2 font-bold text-[#6F6F6F]">Streak</th>
                </tr>
              </thead>
              <tbody>
                {standingsData.map((team) => (
                  <tr key={team.rank} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-2">
                      <div className="flex items-center">
                        {team.rank === 1 && <Trophy className="h-4 w-4 text-yellow-500 mr-2" />}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRankBadge(team.rank)}`}>
                          #{team.rank}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="font-medium text-[#6F6F6F]">{team.team}</span>
                      {team.rank <= 4 && (
                        <span className="ml-2 text-xs text-green-600 font-medium">Playoff Bound</span>
                      )}
                    </td>
                    <td className="py-4 px-2 text-center font-medium text-[#6F6F6F]">{team.wins}</td>
                    <td className="py-4 px-2 text-center font-medium text-[#6F6F6F]">{team.losses}</td>
                    <td className="py-4 px-2 text-center font-bold text-[#B20000]">{team.points}</td>
                    <td className="py-4 px-2 text-center">
                      <span className={`font-medium ${getStreakColor(team.streak)}`}>
                        {team.streak}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-[#6F6F6F] mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-[#B20000]" />
              Playoff Picture
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-[#6F6F6F]">Playoff Spots</span>
                <span className="text-green-600 font-bold">Top 4 Teams</span>
              </div>
              <div className="text-sm text-[#6F6F6F] space-y-1">
                <p>• Thunder Bolts - Clinched #1 seed</p>
                <p>• Net Ninjas - Clinched playoff spot</p>
                <p>• Spike Squad - Clinched playoff spot</p>
                <p>• Ace Attackers - Clinched playoff spot</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-[#6F6F6F] mb-4">Scoring System</h3>
            <div className="space-y-2 text-sm text-[#6F6F6F]">
              <div className="flex justify-between">
                <span>Win (2-0 or 2-1)</span>
                <span className="font-medium">3 points</span>
              </div>
              <div className="flex justify-between">
                <span>Loss (1-2)</span>
                <span className="font-medium">1 point</span>
              </div>
              <div className="flex justify-between">
                <span>Loss (0-2)</span>
                <span className="font-medium">0 points</span>
              </div>
              <div className="flex justify-between">
                <span>Forfeit Loss</span>
                <span className="font-medium">-1 point</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-[#6F6F6F] mb-2">Standings Notes</h3>
          <ul className="text-[#6F6F6F] space-y-1 text-sm">
            <li>• Standings are updated within 24 hours of completed games</li>
            <li>• Tiebreakers: 1) Head-to-head record, 2) Point differential, 3) Total points scored</li>
            <li>• Teams must maintain 75% attendance to be eligible for playoffs</li>
            <li>• Playoff format: Semi-finals (1v4, 2v3) followed by Championship game</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};