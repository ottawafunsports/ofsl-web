import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/toast';
import { useNavigate } from 'react-router-dom';

interface Skill {
  id: number;
  name: string;
  description: string | null;
}

interface TeamRegistrationModalProps {
  showModal: boolean;
  closeModal: () => void;
  leagueId: number;
  leagueName: string;
}

export function TeamRegistrationModal({ 
  showModal, 
  closeModal, 
  leagueId, 
  leagueName 
}: TeamRegistrationModalProps) {
  const [teamName, setTeamName] = useState('');
  const [skillLevelId, setSkillLevelId] = useState<number | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (showModal) {
      loadSkills();
    }
  }, [showModal]);

  const loadSkills = async () => {
    try {
      setSkillsLoading(true);
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error loading skills:', error);
      showToast('Failed to load skill levels', 'error');
    } finally {
      setSkillsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teamName.trim()) {
      showToast('Please enter a team name', 'error');
      return;
    }

    if (!skillLevelId) {
      showToast('Please select a skill level', 'error');
      return;
    }

    if (!userProfile) {
      showToast('User profile not found', 'error');
      return;
    }

    setLoading(true);

    try {
      // Create the team
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: teamName.trim(),
          league_id: leagueId,
          captain_id: userProfile.id,
          skill_level_id: skillLevelId,
          roster: [userProfile.id], // Captain is automatically added to roster
          active: true
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Update user's team_ids array
      const currentTeamIds = userProfile.team_ids || [];
      const updatedTeamIds = [...currentTeamIds, teamData.id];

      const { error: userError } = await supabase
        .from('users')
        .update({ team_ids: updatedTeamIds })
        .eq('id', userProfile.id);

      if (userError) throw userError;

      showToast(`Team "${teamName}" registered successfully!`, 'success');
      closeModal();
      
      // Navigate to My Teams tab
      navigate('/my-teams');

    } catch (error: any) {
      console.error('Error registering team:', error);
      showToast(error.message || 'Failed to register team', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTeamName('');
    setSkillLevelId(null);
    closeModal();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#6F6F6F]">Register Team</h2>
            <button 
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-[#6F6F6F]">
              <span className="font-medium">League:</span> {leagueName}
            </p>
            <p className="text-sm text-[#6F6F6F] mt-1">
              <span className="font-medium">Captain:</span> {userProfile?.name || 'Current User'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#6F6F6F] mb-2">
                Team Name *
              </label>
              <Input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter your team name"
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6F6F6F] mb-2">
                Team Skill Level *
              </label>
              {skillsLoading ? (
                <div className="text-sm text-[#6F6F6F]">Loading skill levels...</div>
              ) : (
                <select
                  value={skillLevelId || ''}
                  onChange={(e) => setSkillLevelId(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
                  required
                >
                  <option value="">Select skill level...</option>
                  {skills.map(skill => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name}
                      {skill.description && ` - ${skill.description}`}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> You will be automatically added as the team captain and first player. 
                After registration, you can add more players to your team from the "My Teams" page.
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading || skillsLoading}
                className="flex-1 bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-2"
              >
                {loading ? 'Registering...' : 'Register Team'}
              </Button>
              <Button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white rounded-[10px] px-6 py-2"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}