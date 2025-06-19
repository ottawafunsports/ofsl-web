import { Award } from 'lucide-react';

// Get background color based on skill level
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

interface SkillLevelRequirementsProps {
  skillLevel: string;
}

export function SkillLevelRequirements({ skillLevel }: SkillLevelRequirementsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#6F6F6F] mb-4">Skill Level Requirements</h2>
      <div className="bg-white p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <Award className="h-6 w-6 text-[#B20000] mr-2" />
          <span className={`text-sm font-medium py-1 px-3 rounded-full ${getSkillLevelColor(skillLevel)}`}>
            {skillLevel} Level
          </span>
        </div>
        
        {/* Skill level descriptions based on league's skill level */}
        {skillLevel === 'Elite' && (
          <ul className="space-y-2 text-[#6F6F6F]">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Current or former college/university players</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Advanced offensive and defensive systems</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Consistent high-level execution</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Specialized positions and strategic play</span>
            </li>
          </ul>
        )}
        
        {skillLevel === 'Competitive' && (
          <ul className="space-y-2 text-[#6F6F6F]">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Strong competitive experience</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Consistent offensive and defensive execution</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Advanced techniques and strategies</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Solid positional understanding</span>
            </li>
          </ul>
        )}
        
        {skillLevel === 'Advanced' && (
          <ul className="space-y-2 text-[#6F6F6F]">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Significant playing experience</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Strong fundamental skills</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Good tactical understanding</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Ability to execute complex plays</span>
            </li>
          </ul>
        )}
        
        {skillLevel === 'Intermediate' && (
          <ul className="space-y-2 text-[#6F6F6F]">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Basic understanding of rules and strategies</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Consistent serving and receiving</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Some previous playing experience</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Ability to maintain rallies</span>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

