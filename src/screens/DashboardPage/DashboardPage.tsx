import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../components/ui/toast";
import { supabase } from "../../lib/supabase";
import { fetchSports, fetchSkills, type League } from "../../lib/leagues";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";

interface Gym {
  id: number;
  gym: string | null;
  address: string | null;
  instructions: string | null;
}

interface Sport {
  id: number;
  name: string;
}

interface Skill {
  id: number;
  name: string;
}

interface NewLeague {
  name: string;
  description: string;
  additional_info: string;
  sport_id: number | null;
  skill_id: number | null;
  day_of_week: number | null;
  start_date: string;
  end_date: string;
  cost: number | null;
  max_teams: number;
  gym_ids: number[];
}

export const DashboardPage = (): JSX.Element => {
  const { userProfile, refreshUserProfile } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'teams' | 'leagues' | 'schools'>('profile');
  
  // Profile state
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    email: '',
    preferred_position: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Leagues management state
  const [leagues, setLeagues] = useState<League[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [showNewLeagueForm, setShowNewLeagueForm] = useState(false);
  const [newLeague, setNewLeague] = useState<NewLeague>({
    name: '',
    description: '',
    additional_info: '',
    sport_id: null,
    skill_id: null,
    day_of_week: null,
    start_date: '',
    end_date: '',
    cost: null,
    max_teams: 20,
    gym_ids: []
  });

  // Schools/Gyms management state
  const [showNewGymForm, setShowNewGymForm] = useState(false);
  const [newGym, setNewGym] = useState({
    gym: '',
    address: '',
    instructions: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      setProfile({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        email: userProfile.email || '',
        preferred_position: userProfile.preferred_position || ''
      });
    }
    loadData();
  }, [userProfile]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load sports and skills for league management
      const [sportsData, skillsData] = await Promise.all([
        fetchSports(),
        fetchSkills()
      ]);
      
      setSports(sportsData);
      setSkills(skillsData);

      // Load gyms and leagues if user is admin
      if (userProfile?.is_admin) {
        const [gymsResponse, leaguesResponse] = await Promise.all([
          supabase.from('gyms').select('*').order('gym'),
          supabase.from('leagues').select(`
            *,
            sports:sport_id(name),
            skills:skill_id(name)
          `).order('created_at', { ascending: false })
        ]);

        if (gymsResponse.data) setGyms(gymsResponse.data);
        if (leaguesResponse.data) {
          const leaguesWithNames = leaguesResponse.data.map(league => ({
            ...league,
            sport_name: league.sports?.name || null,
            skill_name: league.skills?.name || null,
            gyms: [] // We'll load this separately if needed
          }));
          setLeagues(leaguesWithNames);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async () => {
    if (!userProfile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: profile.name,
          phone: profile.phone,
          email: profile.email,
          preferred_position: profile.preferred_position || null,
          date_modified: new Date().toISOString()
        })
        .eq('id', userProfile.id);

      if (error) throw error;

      await refreshUserProfile();
      setIsEditing(false);
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateLeague = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('leagues')
        .insert({
          name: newLeague.name,
          description: newLeague.description,
          additional_info: newLeague.additional_info,
          sport_id: newLeague.sport_id,
          skill_id: newLeague.skill_id,
          day_of_week: newLeague.day_of_week,
          start_date: newLeague.start_date,
          end_date: newLeague.end_date,
          cost: newLeague.cost,
          max_teams: newLeague.max_teams,
          gym_ids: newLeague.gym_ids,
          active: true
        });

      if (error) throw error;

      showToast('League created successfully!', 'success');
      setShowNewLeagueForm(false);
      setNewLeague({
        name: '',
        description: '',
        additional_info: '',
        sport_id: null,
        skill_id: null,
        day_of_week: null,
        start_date: '',
        end_date: '',
        cost: null,
        max_teams: 20,
        gym_ids: []
      });
      loadData();
    } catch (error) {
      console.error('Error creating league:', error);
      showToast('Failed to create league', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateGym = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('gyms')
        .insert({
          gym: newGym.gym,
          address: newGym.address,
          instructions: newGym.instructions
        });

      if (error) throw error;

      showToast('Gym/School created successfully!', 'success');
      setShowNewGymForm(false);
      setNewGym({ gym: '', address: '', instructions: '' });
      loadData();
    } catch (error) {
      console.error('Error creating gym:', error);
      showToast('Failed to create gym/school', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getDayName = (day: number | null) => {
    if (day === null) return '';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day] || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B20000]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#6F6F6F] mb-8">My Account</h1>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 text-center cursor-pointer relative transition-all ${
              activeTab === 'profile' 
                ? 'text-[#B20000] font-medium' 
                : 'text-[#6F6F6F] hover:text-[#B20000]'
            }`}
          >
            Profile
            {activeTab === 'profile' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B20000]"></div>
            )}
          </button>

          <button
            onClick={() => setActiveTab('teams')}
            className={`px-6 py-3 text-center cursor-pointer relative transition-all ${
              activeTab === 'teams' 
                ? 'text-[#B20000] font-medium' 
                : 'text-[#6F6F6F] hover:text-[#B20000]'
            }`}
          >
            My Teams
            {activeTab === 'teams' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B20000]"></div>
            )}
          </button>

          {userProfile?.is_admin && (
            <>
              <button
                onClick={() => setActiveTab('leagues')}
                className={`px-6 py-3 text-center cursor-pointer relative transition-all ${
                  activeTab === 'leagues' 
                    ? 'text-[#B20000] font-medium' 
                    : 'text-[#6F6F6F] hover:text-[#B20000]'
                }`}
              >
                Manage Leagues
                {activeTab === 'leagues' && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B20000]"></div>
                )}
              </button>

              <button
                onClick={() => setActiveTab('schools')}
                className={`px-6 py-3 text-center cursor-pointer relative transition-all ${
                  activeTab === 'schools' 
                    ? 'text-[#B20000] font-medium' 
                    : 'text-[#6F6F6F] hover:text-[#B20000]'
                }`}
              >
                Manage Schools
                {activeTab === 'schools' && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B20000]"></div>
                )}
              </button>
            </>
          )}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card className="max-w-2xl">
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#6F6F6F]">Profile Information</h2>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-4 py-2"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Full Name</label>
                  {isEditing ? (
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-[#6F6F6F] py-2">{profile.name || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Phone Number</label>
                  {isEditing ? (
                    <Input
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-[#6F6F6F] py-2">{profile.phone || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Email</label>
                  {isEditing ? (
                    <Input
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full"
                      type="email"
                    />
                  ) : (
                    <p className="text-[#6F6F6F] py-2">{profile.email || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Preferred Position</label>
                  {isEditing ? (
                    <select
                      value={profile.preferred_position}
                      onChange={(e) => setProfile({ ...profile, preferred_position: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
                    >
                      <option value="">Select position...</option>
                      <option value="Guard">Guard</option>
                      <option value="Forward">Forward</option>
                      <option value="Center">Center</option>
                    </select>
                  ) : (
                    <p className="text-[#6F6F6F] py-2">{profile.preferred_position || 'Not set'}</p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-4">
                    <Button
                      onClick={handleProfileSave}
                      disabled={saving}
                      className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-2"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setProfile({
                          name: userProfile?.name || '',
                          phone: userProfile?.phone || '',
                          email: userProfile?.email || '',
                          preferred_position: userProfile?.preferred_position || ''
                        });
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white rounded-[10px] px-6 py-2"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* My Teams Tab */}
        {activeTab === 'teams' && (
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-[#6F6F6F] mb-6">My Teams</h2>
              <p className="text-[#6F6F6F]">Team management functionality coming soon...</p>
            </CardContent>
          </Card>
        )}

        {/* Manage Leagues Tab - Admin Only */}
        {activeTab === 'leagues' && userProfile?.is_admin && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#6F6F6F]">Manage Leagues</h2>
              <Button
                onClick={() => setShowNewLeagueForm(true)}
                className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-2 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create New League
              </Button>
            </div>

            {/* New League Form */}
            {showNewLeagueForm && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-[#6F6F6F]">Create New League</h3>
                    <Button
                      onClick={() => setShowNewLeagueForm(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-2">League Name</label>
                      <Input
                        value={newLeague.name}
                        onChange={(e) => setNewLeague({ ...newLeague, name: e.target.value })}
                        placeholder="Enter league name"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Sport</label>
                      <select
                        value={newLeague.sport_id || ''}
                        onChange={(e) => setNewLeague({ ...newLeague, sport_id: e.target.value ? parseInt(e.target.value) : null })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
                      >
                        <option value="">Select sport...</option>
                        {sports.map(sport => (
                          <option key={sport.id} value={sport.id}>{sport.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Skill Level</label>
                      <select
                        value={newLeague.skill_id || ''}
                        onChange={(e) => setNewLeague({ ...newLeague, skill_id: e.target.value ? parseInt(e.target.value) : null })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
                      >
                        <option value="">Select skill level...</option>
                        {skills.map(skill => (
                          <option key={skill.id} value={skill.id}>{skill.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Day of Week</label>
                      <select
                        value={newLeague.day_of_week || ''}
                        onChange={(e) => setNewLeague({ ...newLeague, day_of_week: e.target.value ? parseInt(e.target.value) : null })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
                      >
                        <option value="">Select day...</option>
                        <option value="0">Sunday</option>
                        <option value="1">Monday</option>
                        <option value="2">Tuesday</option>
                        <option value="3">Wednesday</option>
                        <option value="4">Thursday</option>
                        <option value="5">Friday</option>
                        <option value="6">Saturday</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Start Date</label>
                      <Input
                        type="date"
                        value={newLeague.start_date}
                        onChange={(e) => setNewLeague({ ...newLeague, start_date: e.target.value })}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-2">End Date</label>
                      <Input
                        type="date"
                        value={newLeague.end_date}
                        onChange={(e) => setNewLeague({ ...newLeague, end_date: e.target.value })}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Cost ($)</label>
                      <Input
                        type="number"
                        value={newLeague.cost || ''}
                        onChange={(e) => setNewLeague({ ...newLeague, cost: e.target.value ? parseFloat(e.target.value) : null })}
                        placeholder="0.00"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Max Teams</label>
                      <Input
                        type="number"
                        value={newLeague.max_teams}
                        onChange={(e) => setNewLeague({ ...newLeague, max_teams: parseInt(e.target.value) || 20 })}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Description</label>
                    <textarea
                      value={newLeague.description}
                      onChange={(e) => setNewLeague({ ...newLeague, description: e.target.value })}
                      placeholder="Enter league description"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Additional Information</label>
                    <textarea
                      value={newLeague.additional_info}
                      onChange={(e) => setNewLeague({ ...newLeague, additional_info: e.target.value })}
                      placeholder="Enter additional information"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Gyms/Schools</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                      {gyms.map(gym => (
                        <label key={gym.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newLeague.gym_ids.includes(gym.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewLeague({ ...newLeague, gym_ids: [...newLeague.gym_ids, gym.id] });
                              } else {
                                setNewLeague({ ...newLeague, gym_ids: newLeague.gym_ids.filter(id => id !== gym.id) });
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{gym.gym}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-4">
                    <Button
                      onClick={handleCreateLeague}
                      disabled={saving || !newLeague.name || !newLeague.sport_id}
                      className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-2"
                    >
                      {saving ? 'Creating...' : 'Create League'}
                    </Button>
                    <Button
                      onClick={() => setShowNewLeagueForm(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white rounded-[10px] px-6 py-2"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Existing Leagues */}
            <div className="grid grid-cols-1 gap-4">
              {leagues.map(league => (
                <Card key={league.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-[#6F6F6F] mb-2">{league.name}</h3>
                        <div className="text-sm text-[#6F6F6F] space-y-1">
                          <p><span className="font-medium">Sport:</span> {league.sport_name}</p>
                          <p><span className="font-medium">Skill Level:</span> {league.skill_name}</p>
                          <p><span className="font-medium">Day:</span> {getDayName(league.day_of_week)}</p>
                          <p><span className="font-medium">Cost:</span> ${league.cost}</p>
                          <p><span className="font-medium">Max Teams:</span> {league.max_teams}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-[8px] px-3 py-1 text-sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button className="bg-red-500 hover:bg-red-600 text-white rounded-[8px] px-3 py-1 text-sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Manage Schools Tab - Admin Only */}
        {activeTab === 'schools' && userProfile?.is_admin && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#6F6F6F]">Manage Schools/Gyms</h2>
              <Button
                onClick={() => setShowNewGymForm(true)}
                className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-2 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add New School/Gym
              </Button>
            </div>

            {/* New Gym Form */}
            {showNewGymForm && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-[#6F6F6F]">Add New School/Gym</h3>
                    <Button
                      onClick={() => setShowNewGymForm(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-2">School/Gym Name</label>
                      <Input
                        value={newGym.gym}
                        onChange={(e) => setNewGym({ ...newGym, gym: e.target.value })}
                        placeholder="Enter school or gym name"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Address</label>
                      <Input
                        value={newGym.address}
                        onChange={(e) => setNewGym({ ...newGym, address: e.target.value })}
                        placeholder="Enter address"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Access Instructions</label>
                      <textarea
                        value={newGym.instructions}
                        onChange={(e) => setNewGym({ ...newGym, instructions: e.target.value })}
                        placeholder="Enter instructions for accessing the gym/school"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={handleCreateGym}
                        disabled={saving || !newGym.gym}
                        className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-2"
                      >
                        {saving ? 'Adding...' : 'Add School/Gym'}
                      </Button>
                      <Button
                        onClick={() => setShowNewGymForm(false)}
                        className="bg-gray-500 hover:bg-gray-600 text-white rounded-[10px] px-6 py-2"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Existing Gyms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gyms.map(gym => (
                <Card key={gym.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-[#6F6F6F] mb-2">{gym.gym}</h3>
                        <div className="text-sm text-[#6F6F6F] space-y-1">
                          <p><span className="font-medium">Address:</span> {gym.address || 'Not provided'}</p>
                          {gym.instructions && (
                            <p><span className="font-medium">Instructions:</span> {gym.instructions}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-[8px] px-3 py-1 text-sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button className="bg-red-500 hover:bg-red-600 text-white rounded-[8px] px-3 py-1 text-sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};