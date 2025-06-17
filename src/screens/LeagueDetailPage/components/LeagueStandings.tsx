import { Card, CardContent } from '../../../components/ui/card';

interface LeagueStandingsProps {
  mockStandings: any[];
}

export function LeagueStandings({ mockStandings }: LeagueStandingsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#6F6F6F] mb-6">League Standings</h2>
      
      {/* Standings table */}
      <Card className="shadow-md overflow-hidden rounded-lg">
        <CardContent className="p-0 overflow-hidden">
          <div className="overflow-hidden">
            <table className="w-full table-fixed">
              <colgroup>
                <col style={{ width: '10%' }} />
                <col style={{ width: '40%' }} />
                <col style={{ width: '12.5%' }} />
                <col style={{ width: '12.5%' }} />
                <col style={{ width: '12.5%' }} />
                <col style={{ width: '12.5%' }} />
              </colgroup>
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#6F6F6F] rounded-tl-lg">Rank</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#6F6F6F]">Team</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-[#6F6F6F]">Wins</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-[#6F6F6F]">Losses</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-[#6F6F6F]">Points</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-[#6F6F6F] hidden md:table-cell rounded-tr-lg">Diff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockStandings.map((team: any, index: number) => (
                  <tr 
                    key={team.id} 
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
                      index === mockStandings.length - 1 ? 'last-row' : ''
                    }`}
                  >
                    <td className={`px-4 py-3 text-sm font-medium text-[#6F6F6F] ${
                      index === mockStandings.length - 1 ? 'rounded-bl-lg' : ''
                    }`}>{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-[#6F6F6F]">{team.team}</td>
                    <td className="px-4 py-3 text-sm text-[#6F6F6F] text-center">{team.wins}</td>
                    <td className="px-4 py-3 text-sm text-[#6F6F6F] text-center">{team.losses}</td>
                    <td className="px-4 py-3 text-sm text-[#6F6F6F] text-center">{team.points}</td>
                    <td className={`px-4 py-3 text-sm text-[#6F6F6F] text-center hidden md:table-cell ${
                      index === mockStandings.length - 1 ? 'rounded-br-lg' : ''
                    }`}>{team.differentials}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

