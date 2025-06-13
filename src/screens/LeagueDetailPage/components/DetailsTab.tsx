import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { MapPin, Calendar, Clock, Users, Target, MessageSquare, AlertCircle } from 'lucide-react';

interface DetailsTabProps {
  league: {
    name: string;
    sport: string;
    skillLevel: string;
    day: string;
    playTimes: string[];
    location: string;
    specificLocation?: string;
    dates: string;
    price: number;
    spotsRemaining: number;
  };
}

export const DetailsTab: React.FC<DetailsTabProps> = ({ league }) => {
  return (
    <div className="space-y-8">
      {/* League Overview */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-[#6F6F6F] mb-6 flex items-center">
            <Users className="h-6 w-6 mr-2 text-[#B20000]" />
            League Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-[#6F6F6F] mb-2">Format</h3>
              <p className="text-[#6F6F6F]">
                {league.sport === "Volleyball" ? "6v6 Indoor Volleyball" : 
                 league.sport === "Badminton" ? "Singles/Doubles Badminton" :
                 league.sport === "Basketball" ? "5v5 Basketball" : 
                 "Doubles Pickleball"}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-[#6F6F6F] mb-2">Season Length</h3>
              <p className="text-[#6F6F6F]">12 weeks + playoffs</p>
            </div>
            <div>
              <h3 className="font-bold text-[#6F6F6F] mb-2">Game Duration</h3>
              <p className="text-[#6F6F6F]">
                {league.sport === "Volleyball" ? "Best 2 of 3 sets" :
                 league.sport === "Badminton" ? "Best 2 of 3 games to 21" :
                 league.sport === "Basketball" ? "Two 20-minute halves" :
                 "Best 2 of 3 games to 11"}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-[#6F6F6F] mb-2">Team Size</h3>
              <p className="text-[#6F6F6F]">
                {league.sport === "Volleyball" ? "6 players on court, 8-12 roster" :
                 league.sport === "Badminton" ? "1-2 players per match" :
                 league.sport === "Basketball" ? "5 players on court, 8-10 roster" :
                 "2 players per team"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule & Location */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-[#6F6F6F] mb-6 flex items-center">
            <MapPin className="h-6 w-6 mr-2 text-[#B20000]" />
            Schedule & Location
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-[#6F6F6F] mb-2">Game Day</h3>
              <p className="text-[#6F6F6F] mb-4">{league.day}</p>
              
              <h3 className="font-bold text-[#6F6F6F] mb-2">Game Times</h3>
              <ul className="text-[#6F6F6F] space-y-1">
                {league.playTimes.map((time, index) => (
                  <li key={index}>• {time}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[#6F6F6F] mb-2">Location</h3>
              <p className="text-[#6F6F6F] mb-2">{league.location}</p>
              {league.sport === "Volleyball" ? (
                <p className="text-sm text-gray-500">
                  Games are played at various high schools and community centers throughout Ottawa. 
                  Specific locations are announced weekly based on availability.
                </p>
              ) : (
                league.specificLocation && league.location !== league.specificLocation && (
                  <p className="text-sm text-gray-500">{league.specificLocation}</p>
                )
              )}
              
              <h3 className="font-bold text-[#6F6F6F] mb-2 mt-4">Season Dates</h3>
              <p className="text-[#6F6F6F]">{league.dates}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skill Level Requirements */}
      <div className="bg-white">
        <h3 className="text-xl font-bold text-[#6F6F6F] mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-[#B20000]" />
          Skill Level Requirements - {league.skillLevel}
        </h3>
        <div className="text-[#6F6F6F] space-y-3">
          {league.skillLevel === "Elite" && (
            <>
              <p>• Extensive competitive experience at high school, college, or club level</p>
              <p>• Advanced technical skills and game knowledge</p>
              <p>• Ability to execute complex strategies and plays</p>
              <p>• Strong physical conditioning and athletic ability</p>
              <p>• Experience playing in organized leagues or tournaments</p>
            </>
          )}
          {league.skillLevel === "Competitive" && (
            <>
              <p>• Solid fundamental skills and good game understanding</p>
              <p>• Some competitive experience preferred</p>
              <p>• Ability to execute basic strategies and team plays</p>
              <p>• Good physical fitness and coordination</p>
              <p>• Comfortable with fast-paced, competitive gameplay</p>
            </>
          )}
          {league.skillLevel === "Advanced" && (
            <>
              <p>• Strong fundamental skills and good technique</p>
              <p>• Understanding of game strategy and positioning</p>
              <p>• Some league or organized play experience</p>
              <p>• Good fitness level and coordination</p>
              <p>• Ability to play consistently at a higher level</p>
            </>
          )}
          {league.skillLevel === "Intermediate" && (
            <>
              <p>• Basic to solid fundamental skills</p>
              <p>• Understanding of basic rules and gameplay</p>
              <p>• Some recreational or casual play experience</p>
              <p>• Willingness to learn and improve</p>
              <p>• Comfortable with moderate pace of play</p>
            </>
          )}
        </div>
      </div>

      {/* Registration Information */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-[#6F6F6F] mb-6 flex items-center">
            <MessageSquare className="h-6 w-6 mr-2 text-[#B20000]" />
            Registration Information
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-[#6F6F6F] mb-2">How to Register</h3>
              {league.sport === "Volleyball" ? (
                <div className="text-[#6F6F6F] space-y-2">
                  <p>• Team captains must register their team and roster</p>
                  <p>• Individual players can sign up as free agents to be placed on a team</p>
                  <p>• All players must create an OFSL account before joining</p>
                  <p>• Payment is required to secure your spot in the league</p>
                </div>
              ) : (
                <div className="text-[#6F6F6F] space-y-2">
                  <p>• Individual registration - no need to form a team in advance</p>
                  <p>• Players are matched based on skill level and availability</p>
                  <p>• Create an OFSL account and complete your player profile</p>
                  <p>• Payment is required to secure your spot in the league</p>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-bold text-[#6F6F6F] mb-2">What's Included</h3>
              <div className="text-[#6F6F6F] space-y-2">
                <p>• 12 weeks of regular season games</p>
                <p>• Playoff tournament for qualifying teams</p>
                <p>• Professional referees for all games</p>
                <p>• Online schedule and standings</p>
                <p>• League administration and support</p>
                {league.sport === "Badminton" && <p>• Shuttlecocks provided for all matches</p>}
                {league.sport === "Volleyball" && <p>• Volleyballs provided for all matches</p>}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-[#6F6F6F] mb-2">Payment & Refunds</h3>
              <div className="text-[#6F6F6F] space-y-2">
                <p>• Full payment due upon registration</p>
                <p>• Refunds available up to 14 days before season start</p>
                <p>• 50% refund available within 14 days of season start</p>
                <p>• No refunds once the season begins</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-[#6F6F6F] mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
            Important Notes
          </h2>
          <div className="text-[#6F6F6F] space-y-2">
            <p>• All players must be 18+ to participate in OFSL leagues</p>
            <p>• Proof of age may be required during registration</p>
            <p>• Players are responsible for their own equipment (except balls/shuttles)</p>
            <p>• Non-marking indoor court shoes are mandatory</p>
            <p>• OFSL reserves the right to move players between divisions based on skill assessment</p>
            <p>• Regular attendance is expected - excessive absences may affect playoff eligibility</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};