import { Button } from "../ui/button";
import { HeroBanner } from "../HeroBanner";
import { LeagueData } from "../../hooks/useLeagueData";

interface LeagueHeroProps {
  league: LeagueData;
  onRegisterClick: () => void;
}

export function LeagueHero({ league, onRegisterClick }: LeagueHeroProps) {
  return (
    <HeroBanner
      image={league.image}
      imageAlt={`${league.name} league`}
      height="400px"
    >
      <div className="text-center text-white max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{league.name}</h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          {league.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onRegisterClick}
            className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-3"
            disabled={league.spotsRemaining === 0}
          >
            {league.spotsRemaining === 0 ? 'Join Waitlist' : 'Register Now'}
          </Button>
          <Button
            variant="outline"
            className="bg-[#0d0d0d42] text-white border border-white rounded-[10px] px-6 py-3 hover:bg-white hover:text-[#B20000]"
          >
            View Schedule
          </Button>
        </div>
      </div>
    </HeroBanner>
  );
}