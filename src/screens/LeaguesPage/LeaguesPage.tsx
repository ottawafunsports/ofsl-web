import { useLeagueFilters } from "../../hooks/useLeagueFilters";
import { useLeaguesData } from "../../hooks/useLeaguesData";
import { LeagueFilters } from "../../components/leagues/LeagueFilters";
import { LeagueGrid } from "../../components/leagues/LeagueGrid";

export const LeaguesPage = (): JSX.Element => {
  const filterHook = useLeagueFilters();
  const { leagues } = useLeaguesData(filterHook.filters);

  return (
    <div className="bg-white w-full">
      <div className="max-w-[1280px] mx-auto px-4 py-8 md:py-12">
        {/* Page Title */}
        <h1 className="text-4xl md:text-5xl text-[#6F6F6F] font-bold mb-8 md:mb-12 text-center">
          Find a league
        </h1>

        {/* Filters Section */}
        <LeagueFilters {...filterHook} />

        {/* League Cards Grid */}
        <LeagueGrid leagues={leagues} />
      </div>
    </div>
  );
};