import React from 'react';
import { Trophy, TrendingUp, Users } from 'lucide-react';

interface StandingsTabProps {
  league: {
    name: string;
    sport: string;
    skillLevel: string;
  };
}

interface TeamStanding {
  id: number;
  name: string;
  wins: number;
  losses: number;
  setsWon: number;
  setsLost: number;
  pointsFor: number;
  pointsAgainst: number;
  winPercentage: number;
}

export function StandingsTab({ league }: StandingsTabProps) {
  // Mock standings data - in a real app, this would come from the database
  const standings: TeamStanding[] = [
    {
      id: 1,
      name: "Thunder Bolts",
      wins: 8,
      losses: 2,
      setsWon: 18,
      setsLost: 8,
      pointsFor: 450,
      pointsAgainst: 320,
      winPercentage: 0.8
    },
    {
      id: 2,
      name: "Lightning Strikes",
      wins: 7,
      losses: 3,
      setsWon: 16,
      setsLost: 10,
      pointsFor: 420,
      pointsAgainst: 380,
      winPercentage: 0.7
    },
    {
      id: 3,
      name: "Net Ninjas",
      wins: 5,
      losses: 5,
      setsWon: 13,
      setsLost: 13,
      pointsFor: 390,
      pointsAgainst: 390,
      winPercentage: 0.5
    },
    {
      id: 4,
      name: "Spike Squad",
      wins: 4,
      losses: 6,
      setsWon: 11,
      setsLost: 15,
      pointsFor: 360,
      pointsAgainst: 420,
      winPercentage: 0.4
    },
    {
      id: 5,
      name: "Block Party",
      wins: 2,
      losses: 8,
      setsWon: 7,
      setsLost: 17,
      pointsFor: 310,
      pointsAgainst: 470,
      winPercentage: 0.2
    }
  ];

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 2:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 3:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-white text-[#6F6F6F] border-gray-200';
    }
  };

  const getWinPercentageColor = (percentage: number) => {
    if (percentage >= 0.7) return 'text-green-600';
    if (percentage >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      {/* Standings Header */}
      <div className="bg-[#ffeae5] rounded-lg p-6">
        <h3 className="text-xl font-bold text-[#6F6F6F] mb-4 flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-[#B20000]" />
          Current Standings
        </h3>
        <p className="text-[#6F6F6F]">
          Standings are updated after each game week. Teams are ranked by win percentage, 
          with tiebreakers determined by head-to-head record and set differential.
        </p>
      </div>

      {/* Standings Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#6F6F6F] uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#6F6F6F] uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-[#6F6F6F] uppercase tracking-wider">
                  W-L
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-[#6F6F6F] uppercase tracking-wider">
                  Win %
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-[#6F6F6F] uppercase tracking-wider">
                  Sets
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-[#6F6F6F] uppercase tracking-wider">
                  Points
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {standings.map((team, index) => (
                <tr key={team.id} className={`hover:bg-gray-50 ${getRankColor(index + 1)}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-[#6F6F6F]">
                        {index + 1}
                      </span>
                      {index < 3 && (
                        <Trophy className="h-4 w-4 ml-2 text-[#B20000]" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-medium text-[#6F6F6F]">
                      {team.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-lg font-medium text-[#6F6F6F]">
                      {team.wins}-{team.losses}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`text-lg font-medium ${getWinPercentageColor(team.winPercentage)}`}>
                      {(team.winPercentage * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-[#6F6F6F]">
                      {team.setsWon}-{team.setsLost}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-[#6F6F6F]">
                      {team.pointsFor}-{team.pointsAgainst}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Playoff Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-[#6F6F6F] mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-[#B20000]" />
          Playoff Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-[#6F6F6F] mb-2">Playoff Qualification</h4>
            <p className="text-sm text-[#6F6F6F]">
              Top 4 teams qualify for playoffs. Playoffs begin the week following the regular season.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-[#6F6F6F] mb-2">Tiebreaker Rules</h4>
            <p className="text-sm text-[#6F6F6F]">
              1. Head-to-head record<br />
              2. Set differential<br />
              3. Points differential
            </p>
          </div>
        </div>
      </div>

      {/* League Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <Users className="h-8 w-8 mx-auto mb-2 text-[#B20000]" />
          <div className="text-2xl font-bold text-[#6F6F6F]">{standings.length}</div>
          <div className="text-sm text-[#6F6F6F]">Teams</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <Trophy className="h-8 w-8 mx-auto mb-2 text-[#B20000]" />
          <div className="text-2xl font-bold text-[#6F6F6F]">
            {standings.reduce((total, team) => total + team.wins + team.losses, 0)}
          </div>
          <div className="text-sm text-[#6F6F6F]">Games Played</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <TrendingUp className="h-8 w-8 mx-auto mb-2 text-[#B20000]" />
          <div className="text-2xl font-bold text-[#6F6F6F]">
            {Math.round(standings.reduce((total, team) => total + team.winPercentage, 0) / standings.length * 100)}%
          </div>
          <div className="text-sm text-[#6F6F6F]">Avg Win Rate</div>
        </div>
      </div>
    </div>
  );
}