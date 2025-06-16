import { Card, CardContent } from "../ui/card";
import { Calendar, Clock, MapPin, Users, DollarSign, Star } from "lucide-react";
import { LeagueData } from "../../hooks/useLeagueData";

interface LeagueInfoProps {
  league: LeagueData;
}

export function LeagueInfo({ league }: LeagueInfoProps) {
  const getSpotsBadgeColor = (spots: number) => {
    if (spots === 0) return "bg-red-100 text-red-800";
    if (spots <= 3) return "bg-orange-100 text-orange-800";
    return "bg-green-100 text-green-800";
  };

  const getSpotsText = (spots: number) => {
    if (spots === 0) return "Full";
    if (spots === 1) return "1 spot left";
    return `${spots} spots left`;
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Elite':
        return 'bg-purple-100 text-purple-800';
      case 'Competitive':
        return 'bg-blue-100 text-blue-800';
      case 'Advanced':
        return 'bg-indigo-100 text-indigo-800';
      case 'Intermediate':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* League Details Card */}
      <div className="lg:col-span-2">
        <Card className="border border-gray-200 rounded-lg">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-[#6F6F6F] mb-6">League Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Time */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-[#B20000] mr-2" />
                  <h3 className="font-semibold text-[#6F6F6F]">Schedule</h3>
                </div>
                <p className="text-[#6F6F6F] ml-7">{league.day}</p>
                <p className="text-sm text-gray-500 ml-7">
                  {league.playTimes.join(", ")}
                </p>
              </div>

              {/* Dates */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-[#B20000] mr-2" />
                  <h3 className="font-semibold text-[#6F6F6F]">Season</h3>
                </div>
                <p className="text-[#6F6F6F] ml-7">{league.dates}</p>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-[#B20000] mr-2" />
                  <h3 className="font-semibold text-[#6F6F6F]">Location</h3>
                </div>
                <p className="text-[#6F6F6F] ml-7">{league.location}</p>
                <p className="text-sm text-gray-500 ml-7">{league.specificLocation}</p>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-[#B20000] mr-2" />
                  <h3 className="font-semibold text-[#6F6F6F]">Cost</h3>
                </div>
                <p className="text-[#6F6F6F] ml-7">
                  ${league.price} {league.sport === "Volleyball" ? "per team" : "per player"}
                </p>
              </div>
            </div>

            {/* Skill Level and Availability */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-[#B20000] mr-2" />
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSkillLevelColor(league.skillLevel)}`}>
                    {league.skillLevel}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-[#B20000] mr-2" />
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSpotsBadgeColor(league.spotsRemaining)}`}>
                    {getSpotsText(league.spotsRemaining)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features and Requirements */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-gray-200 rounded-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-[#6F6F6F] mb-4">What's Included</h3>
              <ul className="space-y-2">
                {league.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#B20000] mr-2">•</span>
                    <span className="text-[#6F6F6F]">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 rounded-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-[#6F6F6F] mb-4">Requirements</h3>
              <ul className="space-y-2">
                {league.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#B20000] mr-2">•</span>
                    <span className="text-[#6F6F6F]">{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Registration Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <Card className="border border-gray-200 rounded-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-[#6F6F6F] mb-4">Quick Registration</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#B20000] mb-2">
                    ${league.price}
                  </div>
                  <p className="text-sm text-gray-500">
                    {league.sport === "Volleyball" ? "per team" : "per player"}
                  </p>
                </div>
                
                <div className="text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSpotsBadgeColor(league.spotsRemaining)}`}>
                    {getSpotsText(league.spotsRemaining)}
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-[#6F6F6F] text-center">
                    Registration includes full season play, equipment, and playoffs.
                  </p>
                  
                  <div className="text-xs text-gray-500 text-center">
                    <p>• Secure online registration</p>
                    <p>• Confirmation within 24 hours</p>
                    <p>• Full refund if cancelled 14+ days before start</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}