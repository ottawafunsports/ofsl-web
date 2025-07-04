import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getStripeProductByLeagueId, updateStripeProductLeagueId } from '../../../lib/stripe';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/toast';
import { supabase } from '../../../lib/supabase';
import { fetchSports, fetchSkills } from '../../../lib/leagues';
import { ChevronLeft, Save, X } from 'lucide-react';
import { RichTextEditor } from '../../../components/ui/rich-text-editor';
import { StripeProductSelector } from './LeaguesTab/components/StripeProductSelector';

export function LeagueNewPage() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  
  const [sports, setSports] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [gyms, setGyms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [newLeague, setNewLeague] = useState<{
    name: string;
    description: string;
    location: string;
    sport_id: number | null;
    skill_id: number | null;
    day_of_week: number | null;
    start_date: string;
    end_date: string;
    year: string;
    cost: number | null;
    max_teams: number;
    gym_ids: number[];
    hide_day?: boolean;
  }>({
    name: '',
    description: '',
    location: '',
    sport_id: null,
    skill_id: null,
    day_of_week: null,
    start_date: '',
    end_date: '',
    year: '2025',
    cost: null,
    max_teams: 20,
    gym_ids: []
  });
  
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    if (!userProfile?.is_admin) {
      navigate('/my-account/profile');
      return;
    }
    
    loadData();
  }, [userProfile]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [sportsData, skillsData] = await Promise.all([
        fetchSports(), 
        fetchSkills() 
      ]);
      
      setSports(sportsData);
      setSkills(skillsData);

      // Load gyms
      const { data: gymsData, error: gymsError } = await supabase
        .from('gyms')
        .select('*')
        .order('gym');

      if (gymsError) throw gymsError;
      if (gymsData) setGyms(gymsData);
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
      
      // Create the league
      const { data: leagueData, error } = await supabase
        .from('leagues')
        .insert({
          name: newLeague.name,
          description: newLeague.description,
          location: newLeague.location,
          sport_id: newLeague.sport_id,
          skill_id: newLeague.skill_id,
          day_of_week: newLeague.day_of_week,
          year: newLeague.year,
          start_date: newLeague.start_date,
          end_date: newLeague.end_date,
          hide_day: newLeague.hide_day,
          cost: newLeague.cost,
          max_teams: newLeague.max_teams,
          gym_ids: newLeague.gym_ids,
          active: true
        })
        .select()
        .single();

      if (error) throw error;
      
      // Link the Stripe product if one was selected
      if (selectedProductId && leagueData) {
        try {
          await updateStripeProductLeagueId(selectedProductId, leagueData.id);
        } catch (productError) {
          console.error('Error updating product association:', productError);
          // Don't fail the whole operation if just the product linking fails
          showToast('League created but product linking failed', 'warning');
        }
      }

      showToast('League created successfully!', 'success');
      navigate(`/leagues/${leagueData.id}`);
    } catch (error) {
      console.error('Error creating league:', error);
      showToast('Failed to create league', 'error');
    } finally {
      setSaving(false);
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

  return (
    <div className="bg-white w-full min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/my-account/leagues" className="flex items-center text-[#B20000] hover:underline mb-4">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Manage Leagues
          </Link>
          
          <h2 className="text-2xl font-bold text-[#6F6F6F]">Create New League</h2>
        </div>

        {/* Create League Form - Using same Card structure as Edit League */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
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
                <label className="block text-sm font-medium text-[#6F6F6F] mb-2">League Name</label>
                <Input
                  value={newLeague.name}
                  onChange={(e) => setNewLeague({ ...newLeague, name: e.target.value })}
                  placeholder="Enter league name"
                  className="w-full"
                />
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
                <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Location</label>
                <select
                  value={newLeague.location || ''}
                  onChange={(e) => setNewLeague({ ...newLeague, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
                >
                  <option value="">Select location...</option>
                  <option value="Various (see details)">Various (see details)</option>
                  <option value="Inner city">Inner city</option>
                  <option value="East end">East end</option>
                  <option value="West end">West end</option>
                  <option value="Orleans">Orleans</option>
                  <option value="Kanata">Kanata</option>
                  <option value="Barrhaven">Barrhaven</option>
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
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newLeague.hide_day || false}
                  onChange={(e) => setNewLeague({ ...newLeague, hide_day: e.target.checked })}
                  className="rounded border-gray-300 text-[#B20000] focus:ring-[#B20000]"
                  id="hide-day"
                />
                <label htmlFor="hide-day" className="ml-2 text-sm font-medium text-[#6F6F6F]">
                  Hide day of week
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                When checked, only month and year will be displayed for the end date
              </p>
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
              
              <div>
                <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Description</label>
                <RichTextEditor
                  value={newLeague.description}
                  onChange={(value) => setNewLeague({ ...newLeague, description: value })}
                  placeholder="Enter league description"
                  rows={6}
                />
              </div>
              
              <div>
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
              
              <div>
                <StripeProductSelector
                  leagueId={null}
                  selectedProductId={selectedProductId}
                  onChange={setSelectedProductId}
                />
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                onClick={handleCreateLeague}
                disabled={saving || !newLeague.name || !newLeague.sport_id}
                className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-2 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Creating...' : 'Create League'}
              </Button>
              <Link to="/my-account/leagues">
                <Button
                className="bg-gray-500 hover:bg-gray-600 text-white rounded-[10px] px-6 py-2"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}