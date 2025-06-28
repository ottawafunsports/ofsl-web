import { Link } from 'react-router-dom';

export function AdditionalLeagueInfo() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#6F6F6F] mb-4">League Information</h2>
      <ul className="space-y-2 text-[#6F6F6F]">
        <li className="flex items-start">
          <span className="mr-2">•</span>
          <span>League runs for 12 weeks with 10 regular season games and 2 weeks of playoffs</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2">•</span>
          <span>Registered teams receive a schedule of all games for the season</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2">•</span>
          <span>All equipment provided (except personal gear)</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2">•</span>
          <span>Please review our <Link to="/standards-of-play" className="text-[#B20000] underline">standards of play</Link> for complete rules</span>
        </li>
      </ul>
    </div>
  );
}

