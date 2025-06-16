import { Card, CardContent } from "../ui/card";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LeagueData } from "../../hooks/useLeagueData";

interface LeagueStandingsProps {
  league: LeagueData;
}

interface TeamStanding {
  rank: number;
  teamName: string;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  winPercentage: number;
  streak: string;
  lastWeekRank?: number;
}

export function LeagueStandings({ league }: LeagueStandingsProps) {
  // Mock standings data - in a real app, this would come from your API
  const standings: TeamStanding[] = [
    {
      rank: 1,
      teamName: "Spike Squad",
      wins: 8,
      losses: 1,
      pointsFor: 245,
      pointsAgainst: 180,
      winPercentage: 0.889,
      streak: "W5",
      lastWeekRank: 2
    },
    {
      rank: 2,
      teamName: "Net Ninjas",
      wins: 7,
      losses: 2,
      pointsFor: 230,
      pointsAgainst: 195,
      winPercentage: 0.778,
      streak: "W3",
      lastWeekRank: 1
    },
    {
      rank: 3,
      teamName: "Block Party",
      wins: 6,
      losses: 3,
      pointsFor: 220,
      pointsAgainst: 210,
      winPercentage: 0.667,
      streak: "L1",
      lastWeekRank: 3
    },
    {
      rank: 4,
      teamName: "Ace Attackers",
      wins: 5,
      losses: 4,
      pointsFor: 205,
      pointsAgainst: 215,
      winPercentage: 0.556,
      streak: "W2",
      lastWeekRank: 5
    },
    {
      rank: 5,
      teamName: "Dig Deep",
      wins: 4,
      losses: 5,
      pointsFor: 190,
      pointsAgainst: 225,
      winPercentage: 0.444,
      streak: "L2",
      lastWeekRank: 4
    },
    {
      rank: 6,
      teamName: "Set Point",
      wins: 3,
      losses: 6,
      pointsFor: 175,
      pointsAgainst: 240,
      winPercentage: 0.333,
      streak: "L3",
      lastWeekRank: 6
    },
    {
      rank: 7,
      teamName: "Bump & Grind",
      wins: 2,
      losses: 7,
      pointsFor: 160,
      pointsAgainst: 255,
      winPercentage: 0.222,
      streak: "L4",
      lastWeekRank: 7
    },
    {
      rank: 8,
      teamName: "Serve Yourself",
      wins: 1,
      losses: 8,
      pointsFor: 145,
      pointsAgainst: 270,
      winPercentage: 0.111,
      streak: "L6",
      lastWeekRank: 8
    }
  ];

  const getRankChangeIcon = (currentRank: number, lastWeekRank?: number) => {
    if (!lastWeekRank) return <Minus className="h-4 w-4 text-gray-400" />;
    
    if (currentRank < lastWeekRank) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (currentRank > lastWeekRank) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRankChangeText = (currentRank: number, lastWeekRank?: number) => {
    if (!lastWeekRank) return "";
    
    const change = lastWeekRank - currentRank;
    if (change > 0) return `+${change}`;
    if (change < 0) return `${change}`;
    return "—";
  };

  const getStreakColor = (streak: string) => {
    if (streak.startsWith('W')) return 'text-green-600 bg-green-100';
    if (streak.startsWith('L')) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-6">
      {/* Standings Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[#6F6F6F] mb-4">
          Current Standings
        </h2>
        <p className="text-[#6F6F6F] mb-6">
          Updated after Week 9 • {standings.length} teams
        </p>
      </div>

      {/* Standings Table */}
      <Card className="border border-gray-200 rounded-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    W-L
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Win %
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PF
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PA
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Streak
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {standings.map((team) => (
                  <tr key={team.rank} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {team.rank <= 3 && (
                          <Trophy className={`h-4 w-4 mr-2 ${
                            team.rank === 1 ? 'text-yellow-500' : 
                            team.rank === 2 ? 'text-gray-400' : 
                            'text-orange-600'
                          }`} />
                        )}
                        <span className="text-sm font-medium text-[#6F6F6F]">
                          {team.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#6F6F6F]">
                        {team.teamName}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-[#6F6F6F]">
                        {team.wins}-{team.losses}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-[#6F6F6F]">
                        {(team.winPercentage * 100).toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-[#6F6F6F]">
                        {team.pointsFor}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-[#6F6F6F]">
                        {team.pointsAgainst}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStreakColor(team.streak)}`}>
                        {team.streak}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center">
                        {getRankChangeIcon(team.rank, team.lastWeekRank)}
                        <span className="ml-1 text-xs text-gray-500">
                          {getRankChangeText(team.rank, team.lastWeekRank)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Playoff Information */}
      <Card className="border border-gray-200 rounded-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-[#6F6F6F] mb-4">Playoff Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-[#6F6F6F] mb-2">Playoff Format</h4>
              <ul className="text-sm text-[#6F6F6F] space-y-1">
                <li>• Top 6 teams qualify for playoffs</li>
                <li>• Single elimination tournament</li>
                <li>• Playoffs begin Week 12</li>
                <li>• Championship game Week 14</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#6F6F6F] mb-2">Current Playoff Picture</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-600">✓ Clinched:</span>
                  <span className="text-[#6F6F6F]">Spike Squad, Net Ninjas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-600">⚠ In contention:</span>
                  <span className="text-[#6F6F6F]">Block Party, Ace Attackers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">✗ Eliminated:</span>
                  <span className="text-[#6F6F6F]">Serve Yourself</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="text-center text-xs text-gray-500">
        <p>PF = Points For • PA = Points Against • W = Win • L = Loss</p>
      </div>
    </div>
  );
}