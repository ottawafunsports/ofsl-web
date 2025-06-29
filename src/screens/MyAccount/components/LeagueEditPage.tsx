import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getStripeProductByLeagueId, updateStripeProductLeagueId } from '../../../lib/stripe';
import { getStripeProductByLeagueId, updateStripeProductLeagueId } from '../../../lib/stripe';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/toast';
import { supabase } from '../../../lib/supabase';
import { fetchSports, fetchSkills, fetchLeagueById, type League } from '../../../lib/leagues';
import { ChevronLeft, Save, X } from 'lucide-react';
import { RichTextEditor } from '../../../components/ui/rich-text-editor';
import { StripeProductSelector } from './LeaguesTab/components/StripeProductSelector';

export function LeagueEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [league, setLeague] = useState<any>(null);
  const [sports, setSports] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [gyms, setGyms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [editLeague, setEditLeague] = useState<{
    name: string;
    description: string;
    sport_id: number | null;
    skill_id: number | null;
    day_of_week: number | null;
    start_date: string;
    end_date: string;
    year: string;
    cost: number | null;
    max_teams: number;
    gym_ids: number[];
  }>({
    name: '',
    description: '',
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
    
    if (id) {
      loadData();
    }
  }, [id, userProfile]);

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

      // Load specific league
      const leagueData = await fetchLeagueById(parseInt(id));
      
      if (!leagueData) {
        throw new Error('League not found');
      } else {
        // Get the Stripe product linked to this league
        const linkedProduct = await getStripeProductByLeagueId(parseInt(id));
        if (linkedProduct) {
          setSelectedProductId(linkedProduct.id);
        }
        
        setLeague(leagueData);
        
        setEditLeague({
          name: leagueData.name,
          description: leagueData.description || '',
          sport_id: leagueData.sport_id,
          skill_id: leagueData.skill_id,
          day_of_week: leagueData.day_of_week,
          year: leagueData.year || '2025',
          start_date: leagueData.start_date || '',
          end_date: leagueData.end_date || '',
          cost: leagueData.cost,
          max_teams: leagueData.max_teams || 20,
          gym_ids: leagueData.gym_ids || []
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Failed to load league data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLeague = async () => {
    if (!id) return;

    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('leagues')
        .update({
          name: editLeague.name,
          description: editLeague.description,
          sport_id: editLeague.sport_id,
          skill_id: editLeague.skill_id,
          day_of_week: editLeague.day_of_week,
          year: editLeague.year,
          start_date: editLeague.start_date,
          end_date: editLeague.end_date,
          cost: editLeague.cost,
          max_teams: editLeague.max_teams,
          gym_ids: editLeague.gym_ids
        })
        .eq('id', id);

      if (error) throw error;
      
      // Update the Stripe product mapping if changed
      try {
        // If we have a previous product linked to this league, unlink it
        const currentProduct = await getStripeProductByLeagueId(parseInt(id));
        if (currentProduct && currentProduct.id !== selectedProductId) {
          await updateStripeProductLeagueId(currentProduct.id, null);
        }
        
        // Link the new product to this league
        if (selectedProductId) {
          await updateStripeProductLeagueId(selectedProductId, parseInt(id));
        }

      } catch (productError) {
        console.error('Error updating product association:', productError);
        // Don't fail the whole operation if just the product linking fails
        showToast('League updated but product linking failed', 'warning');
      }

      showToast('League updated successfully!', 'success');
      navigate(`/leagues/${id}`);
    } catch (error) {
      console.error('Error updating league:', error);
      showToast('Failed to update league', 'error');
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

  if (!league) {
    return (
      <div className="bg-white w-full min-h-screen">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-[#6F6F6F] mb-4">League Not Found</h1>
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
          <Link to={`/leagues/${id}`} className="flex items-center text-[#B20000] hover:underline mb-4">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to League Detail
          </Link>
          
          <h2 className="text-2xl font-bold text-[#6F6F6F]">Edit League Details</h2>
        </div>

        {/* Edit League Form - Using same Card structure as Add New League */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#6F6F6F] mb-2">League Name</label>
                <Input
                  value={editLeague.name}
                  onChange={(e) => setEditLeague({ ...editLeague, name: e.target.value })}
                  placeholder="Enter league name"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Sport</label>
                <select
                  value={editLeague.sport_id || ''}
                  onChange={(e) => setEditLeague({ ...editLeague, sport_id: e.target.value ? parseInt(e.target.value) : null })}
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
                  value={editLeague.skill_id || ''}
                  onChange={(e) => setEditLeague({ ...editLeague, skill_id: e.target.value ? parseInt(e.target.value) : null })}
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
                  value={editLeague.day_of_week || ''}
                  onChange={(e) => setEditLeague({ ...editLeague, day_of_week: e.target.value ? parseInt(e.target.value) : null })}
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
                  value={editLeague.start_date}
                  onChange={(e) => setEditLeague({ ...editLeague, start_date: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6F6F6F] mb-2">End Date</label>
                <Input
                  type="date"
                  value={editLeague.end_date}
                  onChange={(e) => setEditLeague({ ...editLeague, end_date: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Cost ($)</label>
                <Input
                  type="number"
                  value={editLeague.cost || ''}
                  onChange={(e) => setEditLeague({ ...editLeague, cost: e.target.value ? parseFloat(e.target.value) : null })}
                  placeholder="0.00"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Max Teams</label>
                <Input
                  type="number"
                  value={editLeague.max_teams}
                  onChange={(e) => setEditLeague({ ...editLeague, max_teams: parseInt(e.target.value) || 20 })}
                  className="w-full"
                />
              </div>
            </div>

            <div className="mt-8 pb-16">
              <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Description</label>
              <RichTextEditor
                value={editLeague.description}
                onChange={(value) => setEditLeague({ ...editLeague, description: value })}
                placeholder="Enter league description"
                rows={6}
              />
            </div>

            <div className="mt-8">
              <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Gyms/Schools</label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                {gyms.map(gym => (
                  <label key={gym.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editLeague.gym_ids.includes(gym.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEditLeague({ ...editLeague, gym_ids: [...editLeague.gym_ids, gym.id] });
                        } else {
                          setEditLeague({ ...editLeague, gym_ids: editLeague.gym_ids.filter(id => id !== gym.id) });
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{gym.gym}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Stripe Product Selector */}
            <div className="mt-8">
              <StripeProductSelector
                selectedProductId={selectedProductId}
                leagueId={parseInt(id)}
                onChange={setSelectedProductId}
              />
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                onClick={handleUpdateLeague}
                disabled={saving || !editLeague.name || !editLeague.sport_id}
                className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-2 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Link to="/my-account/leagues">
                <Button
                className="bg-gray-500 hover:bg-gray-600 text-white rounded-[10px] px-6 py-2"
              >
                Back to Manage Leagues
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}