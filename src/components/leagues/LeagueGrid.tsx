import { LeagueCard } from "./LeagueCard";
import { League } from "../../hooks/useLeaguesData";

interface LeagueGridProps {
  leagues: League[];
}

export function LeagueGrid({ leagues }: LeagueGridProps) {
  if (leagues.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-bold text-[#6F6F6F] mb-2">No leagues match your filters</h3>
        <p className="text-[#6F6F6F]">Try adjusting your filter criteria to find available leagues.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {leagues.map(league => (
        <LeagueCard key={league.id} league={league} />
      ))}
    </div>
  );
}