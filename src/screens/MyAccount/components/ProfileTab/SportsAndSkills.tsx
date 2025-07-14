import { Trash2 } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { SportSkill, Sport, Skill, Profile } from './types';

interface SportsAndSkillsProps {
  profile: Profile;
  sports: Sport[];
  skills: Skill[];
  isEditing: boolean;
  loadingSportsSkills: boolean;
  onEdit: () => void;
  onProfileChange: (profile: Profile) => void;
}

export function SportsAndSkills({
  profile,
  sports,
  skills,
  isEditing,
  loadingSportsSkills,
  onEdit,
  onProfileChange
}: SportsAndSkillsProps) {
  const handleSportSkillChange = (index: number, field: 'sport_id' | 'skill_id', value: number) => {
    const newSportsSkills = [...profile.user_sports_skills];
    
    if (field === 'sport_id') {
      const sport = sports.find(s => s.id === value);
      newSportsSkills[index] = {
        ...newSportsSkills[index],
        sport_id: value,
        sport_name: sport?.name
      };
    } else {
      const skill = skills.find(s => s.id === value);
      newSportsSkills[index] = {
        ...newSportsSkills[index],
        skill_id: value,
        skill_name: skill?.name
      };
    }
    
    onProfileChange({ ...profile, user_sports_skills: newSportsSkills });
  };

  const handleRemoveSportSkill = (index: number) => {
    const newSportsSkills = [...profile.user_sports_skills];
    newSportsSkills.splice(index, 1);
    onProfileChange({ ...profile, user_sports_skills: newSportsSkills });
  };

  const handleAddSportSkill = () => {
    const selectedSportIds = profile.user_sports_skills.map((item: SportSkill) => item.sport_id);
    const availableSport = sports.find(sport => !selectedSportIds.includes(sport.id));
    
    if (availableSport && skills.length > 0) {
      const newSportsSkills = [...profile.user_sports_skills, {
        sport_id: availableSport.id,
        skill_id: skills[0].id,
        sport_name: availableSport.name,
        skill_name: skills[0].name
      }];
      onProfileChange({ ...profile, user_sports_skills: newSportsSkills });
    }
  };

  const handleAddFirstSport = () => {
    if (sports.length > 0 && skills.length > 0) {
      onProfileChange({
        ...profile,
        user_sports_skills: [{
          sport_id: sports[0].id,
          skill_id: skills[0].id,
          sport_name: sports[0].name,
          skill_name: skills[0].name
        }]
      });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-[#6F6F6F]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z"/>
          </svg>
          <h2 className="text-xl font-bold text-[#6F6F6F]">Sports & Skill Levels</h2>
        </div>
        {!isEditing && (
          <Button
            onClick={onEdit}
            className="border border-[#B20000] text-[#B20000] bg-white hover:bg-[#B20000] hover:text-white rounded-lg px-4 py-2"
          >
            Edit
          </Button>
        )}
      </div>

      {loadingSportsSkills ? (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#B20000]"></div>
          <span className="ml-2 text-[#6F6F6F]">Loading sports data...</span>
        </div>
      ) : profile.user_sports_skills && profile.user_sports_skills.length > 0 ? (
        <div className="space-y-4">
          {isEditing ? (
            <>
              {profile.user_sports_skills.map((sportSkill: SportSkill, index: number) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-[#6F6F6F]">Sport {index + 1}</h4>
                    <Button
                      type="button"
                      onClick={() => handleRemoveSportSkill(index)}
                      className="bg-transparent hover:bg-red-50 text-red-500 hover:text-red-600 rounded-lg p-1 h-8 w-8 flex items-center justify-center"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                        Sport
                      </label>
                      <select
                        value={sportSkill.sport_id}
                        onChange={(e) => handleSportSkillChange(index, 'sport_id', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
                      >
                        {sports.map(sport => (
                          <option 
                            key={sport.id} 
                            value={sport.id}
                            disabled={profile.user_sports_skills.some((item: SportSkill, i: number) => 
                              i !== index && item.sport_id === sport.id
                            )}
                          >
                            {sport.name}
                            {profile.user_sports_skills.some((item: SportSkill, i: number) => 
                              i !== index && item.sport_id === sport.id
                            ) ? ' (Already selected)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                        Skill Level
                      </label>
                      <select
                        value={sportSkill.skill_id}
                        onChange={(e) => handleSportSkillChange(index, 'skill_id', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
                      >
                        {skills.map(skill => (
                          <option key={skill.id} value={skill.id}>
                            {skill.name}{skill.description ? ` - ${skill.description}` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                onClick={handleAddSportSkill}
                disabled={profile.user_sports_skills.length >= sports.length}
                className="bg-[#B20000] hover:bg-[#8A0000] text-white text-sm rounded-lg px-4 py-2"
              >
                Add Another Sport
              </Button>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.user_sports_skills.map((sportSkill: SportSkill, index: number) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-[#6F6F6F] mb-2">{sportSkill.sport_name || `Sport ${sportSkill.sport_id}`}</h4>
                  <div className="flex items-center">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {sportSkill.skill_name || `Skill ${sportSkill.skill_id}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-[#6F6F6F] mb-4">You haven't selected any sports or skill levels yet.</p>
          {isEditing && (
            <Button
              onClick={handleAddFirstSport}
              className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-lg px-4 py-2"
            >
              Add Sport & Skill Level
            </Button>
          )}
        </div>
      )}
    </div>
  );
}