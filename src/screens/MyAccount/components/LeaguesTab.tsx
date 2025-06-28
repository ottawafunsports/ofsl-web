import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/toast';
import { supabase } from '../../../lib/supabase';
import { fetchSports, fetchSkills, type League } from '../../../lib/leagues';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RichTextEditor } from '../../../components/ui/rich-text-editor';

interface Sport {
  id: number;
  name: string;
}

interface Skill {
  id: number;
  name: string;
}

interface Gym {
  id: number;
  gym: string | null;
  address: string | null;
  instructions: string | null;
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

export function LeaguesTab() {
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  
  const [leagues, setLeagues] = useState<League[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [showNewLeagueForm, setShowNewLeagueForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [sportsData, skillsData] = await Promise.all([
        fetchSports(),
        fetchSkills()
      ]);
      
      setSports(sportsData);
      setSkills(skillsData);

      if (userProfile?.is_admin) {
        const { data: leaguesResponse, error: leaguesError } = await supabase
          .from('leagues')
          .select(`
            *,
            sports:sport_id(name),
            skills:skill_id(name)
          `)
          .order('created_at', { ascending: false });

        if (leaguesError) throw leaguesError;
        
        if (leaguesResponse) {
          const leaguesWithNames = leaguesResponse.map(league => ({
            ...league,
            sport_name: league.sports?.name || null,
            skill_name: league.skills?.name || null,
            gyms: []
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




  const handleDeleteLeague = async (leagueId: number) => {
    if (!confirm('Are you sure you want to delete this league? This action cannot be undone.')) {
      return;
    }

    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('leagues')
        .delete()
        .eq('id', leagueId);

      if (error) throw error;

      showToast('League deleted successfully!', 'success');
      loadData();
    } catch (error) {
      console.error('Error deleting league:', error);
      showToast('Failed to delete league', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getDayName = (day: number | null) => {
    if (day === null) return '';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day] || '';
  };

  if (!userProfile?.is_admin) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-[#6F6F6F] text-lg">Access denied. Admin privileges required.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B20000]"></div>
      </div>
    );
  }

  return (
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
                className="text-gray-500 hover:text-gray-700 bg-transparent hover:bg-transparent border-none shadow-none p-2"
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
              <RichTextEditor
                value={newLeague.description}
                onChange={(e) => setNewLeague({ ...newLeague, description: e.target.value })}
                placeholder="Enter league description"
                rows={3}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Additional Information</label>
              <RichTextEditor
                value={newLeague.additional_info}
                onChange={(e) => setNewLeague({ ...newLeague, additional_info: e.target.value })}
                placeholder="Enter additional information"
                rows={3}
              />
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
                  <Link to={`/my-account/leagues/edit/${league.id}`}>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-[8px] px-3 py-1 text-sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => handleDeleteLeague(league.id)}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-[8px] px-3 py-1 text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}