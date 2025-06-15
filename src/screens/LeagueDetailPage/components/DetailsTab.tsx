import React from 'react';
import { Target, Info, MapPin, Calendar, Users, DollarSign } from 'lucide-react';

interface DetailsTabProps {
  league: {
    name: string;
    sport: string;
    skillLevel: string;
    description?: string;
    rules?: string[];
    requirements?: string[];
    location: string;
    specificLocation?: string;
    dates: string;
    price: number;
    maxPlayers?: number;
  };
}

export function DetailsTab({ league }: DetailsTabProps) {
  const getSkillLevelRequirements = (sport: string, level: string) => {
    const requirements: Record<string, Record<string, string[]>> = {
      Volleyball: {
        Elite: [
          "Extensive competitive experience at university, club, or professional level",
          "Advanced understanding of all positions and rotations",
          "Consistent execution of complex plays and strategies",
          "Leadership skills and ability to coach teammates during play"
        ],
        Competitive: [
          "Strong fundamental skills in serving, passing, setting, hitting, and blocking",
          "Good understanding of team strategies and positioning",
          "Experience playing in organized leagues or tournaments",
          "Ability to perform under pressure in competitive situations"
        ],
        Advanced: [
          "Solid fundamental skills with consistent execution",
          "Understanding of basic volleyball strategies and rotations",
          "Some competitive experience preferred",
          "Ability to play multiple positions effectively"
        ],
        Intermediate: [
          "Basic understanding of volleyball rules and gameplay",
          "Developing fundamental skills (serving, passing, hitting)",
          "Some recreational or beginner league experience",
          "Willingness to learn and improve skills"
        ]
      },
      Badminton: {
        Advanced: [
          "Strong technical skills in all strokes (clear, drop, smash, drive)",
          "Good court coverage and footwork",
          "Understanding of singles and doubles strategies",
          "Tournament or competitive league experience"
        ],
        Intermediate: [
          "Basic stroke techniques with room for improvement",
          "Understanding of basic rules and scoring",
          "Some recreational playing experience",
          "Developing court awareness and positioning"
        ]
      }
    };

    return requirements[sport]?.[level] || [
      "Skill level requirements will be provided closer to season start",
      "Contact league organizers for specific skill assessments"
    ];
  };

  const skillRequirements = getSkillLevelRequirements(league.sport, league.skillLevel);

  return (
    <div className="space-y-8">
      {/* League Description */}
      <div>
        <h3 className="text-2xl font-bold text-[#6F6F6F] mb-4 flex items-center">
          <Info className="h-6 w-6 mr-2 text-[#B20000]" />
          About This League
        </h3>
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-[#6F6F6F] text-lg leading-relaxed">
            {league.description || `Join our ${league.skillLevel} ${league.sport} league for an exciting season of competitive play. This league is designed for players who want to challenge themselves while enjoying the camaraderie of team sports.`}
          </p>
        </div>
      </div>

      {/* Skill Level Requirements */}
      <div className="bg-white">
        <h3 className="text-xl font-bold text-[#6F6F6F] mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-[#B20000]" />
          {league.skillLevel} Level Requirements
        </h3>
        <ul className="space-y-3">
          {skillRequirements.map((requirement, index) => (
            <li key={index} className="flex items-start">
              <span className="text-[#B20000] mr-3 mt-1">•</span>
              <span className="text-[#6F6F6F]">{requirement}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* League Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-bold text-[#6F6F6F] mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-[#B20000]" />
            Location Details
          </h4>
          <div className="space-y-2">
            <p className="text-[#6F6F6F]">
              <span className="font-medium">Region:</span> {league.location}
            </p>
            {league.specificLocation && (
              <p className="text-[#6F6F6F]">
                <span className="font-medium">Venue:</span> {league.specificLocation}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-3">
              {league.sport === "Volleyball" 
                ? "Specific venues may vary by week and will be communicated to registered teams."
                : "Venue details will be provided upon registration."
              }
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-bold text-[#6F6F6F] mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-[#B20000]" />
            Season Information
          </h4>
          <div className="space-y-2">
            <p className="text-[#6F6F6F]">
              <span className="font-medium">Duration:</span> {league.dates}
            </p>
            <p className="text-[#6F6F6F]">
              <span className="font-medium">Cost:</span> ${league.price} {league.sport === "Volleyball" ? "per team" : "per player"}
            </p>
            {league.maxPlayers && (
              <p className="text-[#6F6F6F]">
                <span className="font-medium">Max Players:</span> {league.maxPlayers} per team
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Rules and Regulations */}
      {league.rules && league.rules.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-[#6F6F6F] mb-4">League Rules</h3>
          <div className="bg-gray-50 rounded-lg p-6">
            <ul className="space-y-2">
              {league.rules.map((rule, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#B20000] mr-3 mt-1">•</span>
                  <span className="text-[#6F6F6F]">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Contact Information */}
      <div className="bg-[#ffeae5] rounded-lg p-6">
        <h3 className="text-xl font-bold text-[#6F6F6F] mb-4">Questions?</h3>
        <p className="text-[#6F6F6F] mb-4">
          Have questions about this league or need help with registration? We're here to help!
        </p>
        <div className="space-y-2">
          <p className="text-[#6F6F6F]">
            <span className="font-medium">Email:</span>{" "}
            <a href={`mailto:${league.sport.toLowerCase()}@ofsl.ca`} className="text-[#B20000] hover:underline">
              {league.sport.toLowerCase()}@ofsl.ca
            </a>
          </p>
          <p className="text-[#6F6F6F]">
            <span className="font-medium">General inquiries:</span>{" "}
            <a href="mailto:info@ofsl.ca" className="text-[#B20000] hover:underline">
              info@ofsl.ca
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}