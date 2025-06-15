import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Target, Star } from "lucide-react";

interface SkillRequirementsProps {
  skillLevel: string;
}

export function SkillRequirements({ skillLevel }: SkillRequirementsProps) {
  const getSkillRequirements = (level: string) => {
    switch (level) {
      case 'Elite':
        return {
          stars: 4,
          requirements: [
            "Exceptional technical skills and game understanding",
            "Competitive or professional playing experience",
            "Advanced tactical awareness and decision-making",
            "Ability to perform under pressure consistently",
            "Leadership qualities and team communication skills"
          ]
        };
      case 'Competitive':
        return {
          stars: 3,
          requirements: [
            "Strong fundamental skills in all areas",
            "Good game sense and tactical understanding",
            "Consistent performance in competitive situations",
            "Experience in organized league or tournament play",
            "Ability to adapt to different playing styles"
          ]
        };
      case 'Advanced':
        return {
          stars: 2.5,
          requirements: [
            "Solid fundamental skills with good consistency",
            "Understanding of game strategy and positioning",
            "Experience in recreational or intermediate leagues",
            "Good physical conditioning and endurance",
            "Positive attitude and sportsmanship"
          ]
        };
      case 'Intermediate':
        return {
          stars: 2,
          requirements: [
            "Basic to intermediate skill level",
            "Some organized playing experience preferred",
            "Willingness to learn and improve",
            "Good attitude and team player mentality",
            "Commitment to regular attendance"
          ]
        };
      default:
        return {
          stars: 1,
          requirements: [
            "Basic understanding of the sport",
            "Enthusiasm to learn and participate",
            "Good sportsmanship and positive attitude"
          ]
        };
    }
  };

  const skillInfo = getSkillRequirements(skillLevel);

  const renderStars = (count: number) => {
    const stars = [];
    const fullStars = Math.floor(count);
    const hasHalfStar = count % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="text-[#B20000] fill-[#B20000] w-5 h-5" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative w-5 h-5">
          <Star className="text-[#B20000] w-5 h-5" />
          <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden">
            <Star className="text-[#B20000] fill-[#B20000] w-5 h-5" />
          </div>
        </div>
      );
    }

    const remainingStars = 4 - Math.ceil(count);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="text-[#B20000] w-5 h-5" />
      );
    }

    return stars;
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-[#6F6F6F] mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-[#B20000]" />
          Skill Level Requirements
        </h3>
        
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <span className="text-lg font-semibold text-[#6F6F6F] mr-3">{skillLevel}</span>
            <div className="flex">
              {renderStars(skillInfo.stars)}
            </div>
          </div>
        </div>
        
        <ul className="space-y-2">
          {skillInfo.requirements.map((requirement, index) => (
            <li key={index} className="flex items-start text-[#6F6F6F]">
              <span className="mr-2 text-[#B20000]">•</span>
              <span>{requirement}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}