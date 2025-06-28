import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/toast';
import { supabase } from '../../../lib/supabase';
import { fetchSkills } from '../../../lib/leagues';
import { ChevronLeft, Save, X, Users, Crown, Mail, Trash2 } from 'lucide-react';

interface Skill {
  id: number;
  name: string;
  description: string | null;
}

interface TeamMember {
  id: string;
  name: string | null;
  email: string | null;
}

export function TeamEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  
  const [team, setTeam] = useState<any>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [editTeam, setEditTeam] = useState<{
    name: string;
    skill_level_id: number | null;
  }>({
    name: '',
    skill_level_id: null
  });

  useEffect(() => {
    if (!userProfile?.is_admin) {
      navigate('/my-account/profile');
      return;
    }
    
    if (id) {
      loadData();
    }
  }, [id, userProfile]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [skillsData] = await Promise.all([
        fetchSkills()
      ]);
      
      setSkills(skillsData);

      // Load specific team
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select(`
          *,
          leagues:league_id(id, name),
          skills:skill_level_id(name),
          users:captain_id(name, email)
        `)
        .eq('id', id)
        .single();
      
      if (teamError) throw teamError;
      
      if (!teamData) {
        throw new Error('Team not found');
      } else {
        setTeam(teamData);
        
        setEditTeam({
          name: teamData.name,
          skill_level_id: teamData.skill_level_id
        });

        // Load team members
        if (teamData.roster && teamData.roster.length > 0) {
          const { data: membersData, error: membersError } = await supabase
            .from('users')
            .select('id, name, email')
            .in('id', teamData.roster);

          if (membersError) {
            console.error('Error loading team members:', membersError);
          } else {
            setTeamMembers(membersData || []);
          }
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Failed to load team data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTeam = async () => {
    if (!id) return;

    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('teams')
        .update({
          name: editTeam.name,
          skill_level_id: editTeam.skill_level_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      showToast('Team updated successfully!', 'success');
      
      // Navigate back to the league detail page
      if (team?.leagues?.id) {
        navigate(`/leagues/${team.leagues.id}?tab=teams`);
      } else {
        navigate('/my-account/leagues');
      }
    } catch (error) {
      console.error('Error updating team:', error);
      showToast('Failed to update team', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!team || !confirm('Are you sure you want to remove this member from the team?')) {
      return;
    }

    try {
      // Don't allow removing the captain
      if (memberId === team.captain_id) {
        showToast('Cannot remove the team captain', 'error');
        return;
      }

      const updatedRoster = team.roster.filter((id: string) => id !== memberId);
      
      const { error: teamError } = await supabase
        .from('teams')
        .update({ roster: updatedRoster })
        .eq('id', id);

      if (teamError) throw teamError;

      // Update user's team_ids array
      const member = teamMembers.find(m => m.id === memberId);
      if (member) {
        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('team_ids')
          .eq('id', memberId)
          .single();

        if (!fetchError && userData) {
          const updatedTeamIds = (userData.team_ids || []).filter((teamId: number) => teamId !== parseInt(id!));
          
          const { error: updateError } = await supabase
            .from('users')
            .update({ team_ids: updatedTeamIds })
            .eq('id', memberId);

          if (updateError) {
            console.error('Error updating user team_ids:', updateError);
          }
        }
      }

      showToast('Member removed successfully', 'success');
      
      // Reload data to update the UI
      await loadData();
    } catch (error) {
      console.error('Error removing member:', error);
      showToast('Failed to remove member', 'error');
    }
  };

  if (!userProfile?.is_admin) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white w-full min-h-screen">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B20000]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="bg-white w-full min-h-screen">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-[#6F6F6F] mb-4">Team Not Found</h1>
            <Link to="/my-account/leagues">
              <Button className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-3">
                Back to Manage Leagues
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="mb-8">
          <Link 
            to={`/leagues/${team.leagues?.id}?tab=teams`} 
            className="flex items-center text-[#B20000] hover:underline mb-4"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to League Teams
          </Link>
          
          <h2 className="text-2xl font-bold text-[#6F6F6F]">Edit Team Registration</h2>
        </div>

        {/* Team Basic Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#6F6F6F]">Team Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Team Name</label>
                <Input
                  value={editTeam.name}
                  onChange={(e) => setEditTeam({ ...editTeam, name: e.target.value })}
                  placeholder="Enter team name"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Skill Level</label>
                <select
                  value={editTeam.skill_level_id || ''}
                  onChange={(e) => setEditTeam({ ...editTeam, skill_level_id: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
                >
                  <option value="">Select skill level...</option>
                  {skills.map(skill => (
                    <option key={skill.id} value={skill.id}>{skill.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#6F6F6F]">
                <div>
                  <span className="font-medium">League:</span> {team.leagues?.name || 'Unknown'}
                </div>
                <div>
                  <span className="font-medium">Registration Date:</span> {new Date(team.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <Button
                onClick={handleUpdateTeam}
                disabled={saving || !editTeam.name}
                className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-2 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#6F6F6F] flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members ({teamMembers.length})
              </h3>
            </div>

            <div className="space-y-3">
              {teamMembers.length === 0 ? (
                <div className="text-center py-8 text-[#6F6F6F]">
                  <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No team members found</p>
                </div>
              ) : (
                teamMembers.map((member) => (
                  <div 
                    key={member.id} 
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {/* Member Avatar */}
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-[#6F6F6F] font-medium">
                          {(member.name || member.email || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      
                      {/* Member Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#6F6F6F]">
                            {member.name || 'No Name'}
                          </span>
                          {member.id === team.captain_id && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              <Crown className="h-3 w-3" />
                              Captain
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-[#6F6F6F]">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {member.id !== team.captain_id && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                          title="Remove from team"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}