import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/toast';
import { supabase } from '../../../lib/supabase';
import { fetchSports, fetchSkills, type League } from '../../../lib/leagues';
import { ChevronLeft, Save, X } from 'lucide-react';
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

interface EditLeague {
  name: string;
  description: string;
  sport_id: number | null;
  skill_id: number | null;
  day_of_week: number | null;
  start_date: string;
  end_date: string;
  cost: number | null;
  max_teams: number;
  gym_ids: number[];
}

export function LeagueEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  
  const [league, setLeague] = useState<League | null>(null);
  const [sports, setSports] = useState<Sport[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [editLeague, setEditLeague] = useState<EditLeague>({
    name: '',
    description: '',
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
      const { data: leagueData, error: leagueError } = await supabase
        .from('leagues')
        .select(`
          *,
          sports:sport_id(name),
          skills:skill_id(name)
        `)
        .eq('id', id)
        .single();

      if (leagueError) throw leagueError;
      
      if (leagueData) {
        setLeague(leagueData);
        
        // Get the description from the database or generate default if empty
        const description = leagueData.description || getDefaultDescription(leagueData);
        
        setEditLeague({
          name: leagueData.name,
          description: description,
          sport_id: leagueData.sport_id,
          skill_id: leagueData.skill_id,
          day_of_week: leagueData.day_of_week,
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

  // Function to get default description based on league details
  const getDefaultDescription = (leagueData: any) => {
    const sportName = leagueData.sports?.name || '';
    const skillName = leagueData.skills?.name || '';
    const leagueName = leagueData.name || '';
    
    if (sportName === 'Volleyball') {
      if (leagueName.toLowerCase().includes('elite') && leagueName.toLowerCase().includes('women')) {
        return `OFSL's elite women's volleyball league represents the highest level of competitive play for female athletes. This league is designed for current or former college/university players who demonstrate advanced offensive and defensive systems, consistent high-level execution, and specialized positional play.

**Skill Level Requirements - Elite Level:**
• Tournament-level play with advanced techniques and strategies
• Consistent power and precision in all shots
• Excellent court coverage and anticipation skills
• Strong tactical awareness and game management

**Additional Information:**
• League runs for 12 weeks with 10 regular season games and 2 weeks of playoffs
• Registered teams receive a schedule of all games for the season
• All equipment provided (except personal gear)
• Please review our standards of play for complete rules
• Teams are separated by tiers which are updated every week after games
• Focused on individuals who play at an intermediate to elite skill level
• Schools and play times may vary between tiers`;
      } else if (leagueName.toLowerCase().includes('coed') && leagueName.toLowerCase().includes('intermediate')) {
        return `Our coed intermediate volleyball league provides a structured environment for players who are comfortable with basic volleyball skills and are developing consistency in their play. This league welcomes players who understand fundamental rules and strategies.

**Skill Level Requirements - Intermediate Level:**
• Comfortable with basic strokes and serves
• Developing consistency in shot placement
• Learning proper footwork and court positioning
• Eager to improve and learn new techniques

**Additional Information:**
• League runs for 12 weeks with 10 regular season games and 2 weeks of playoffs
• Registered teams receive a schedule of all games for the season
• All equipment provided (except personal gear)
• Please review our standards of play for complete rules
• Teams are separated by tiers which are updated every week after games
• Focused on individuals who play at an intermediate to elite skill level
• Schools and play times may vary between tiers`;
      } else if (leagueName.toLowerCase().includes('coed') && leagueName.toLowerCase().includes('advanced')) {
        return `The coed advanced volleyball league is perfect for players with solid technique in all basic strokes and serves, good footwork and court movement, and the ability to maintain longer rallies with control.

**Skill Level Requirements - Advanced Level:**
• Solid technique in all basic strokes and serves
• Good footwork and court movement
• Ability to maintain longer rallies with control
• Basic understanding of doubles positioning

**Additional Information:**
• League runs for 12 weeks with 10 regular season games and 2 weeks of playoffs
• Registered teams receive a schedule of all games for the season
• All equipment provided (except personal gear)
• Please review our standards of play for complete rules
• Teams are separated by tiers which are updated every week after games
• Focused on individuals who play at an intermediate to elite skill level
• Schools and play times may vary between tiers`;
      } else if (leagueName.toLowerCase().includes('coed') && leagueName.toLowerCase().includes('competitive')) {
        return `Our coed competitive volleyball league features strong fundamental skills with developing advanced techniques. Players should demonstrate good court positioning and shot selection.

**Skill Level Requirements - Competitive Level:**
• Strong fundamental skills with developing advanced techniques
• Good court positioning and shot selection
• Consistent rallies with occasional power shots
• Understanding of basic tactics and game flow

**Additional Information:**
• League runs for 12 weeks with 10 regular season games and 2 weeks of playoffs
• Registered teams receive a schedule of all games for the season
• All equipment provided (except personal gear)
• Please review our standards of play for complete rules
• Teams are separated by tiers which are updated every week after games
• Focused on individuals who play at an intermediate to elite skill level
• Schools and play times may vary between tiers`;
      } else if (leagueName.toLowerCase().includes('4s')) {
        return `This 4-on-4 volleyball format provides a faster-paced, more dynamic game where every player is constantly involved. With fewer players on the court, each participant gets more touches and opportunities.

**About 4s Format:**
• Fast-paced, dynamic gameplay with more player involvement
• Every player gets more touches and opportunities to make plays
• Develops well-rounded skill set through increased participation
• Perfect for intensive action and skill development

**Additional Information:**
• League runs for 12 weeks with 10 regular season games and 2 weeks of playoffs
• Registered teams receive a schedule of all games for the season
• All equipment provided (except personal gear)
• Please review our standards of play for complete rules
• Teams are separated by tiers which are updated every week after games
• Focused on individuals who play at an intermediate to elite skill level
• Schools and play times may vary between tiers`;
      } else {
        return `OFSL volleyball leagues are organized to provide participants with a structured environment that encourages sportsmanship, physical activity and healthy competition. Our tiered system ensures fair and competitive play for all skill levels.

**About Our Volleyball Leagues:**
• Teams are separated by tiers which are updated every week after games
• Focused on individuals who play at an intermediate to elite skill level
• Schools and play times may vary between tiers
• You must be registered to see standings and schedules
• To register a team, captains must create an account and be approved by the league

**Additional Information:**
• League runs for 12 weeks with 10 regular season games and 2 weeks of playoffs
• Registered teams receive a schedule of all games for the season
• All equipment provided (except personal gear)
• Please review our standards of play for complete rules`;
      }
    } else if (sportName === 'Badminton') {
      if (leagueName.toLowerCase().includes('advanced') && leagueName.toLowerCase().includes('singles')) {
        return `Advanced singles badminton for players with solid technique in all basic strokes and serves, excellent footwork and court movement, and the ability to maintain longer rallies with control and precision.

**Skill Level Requirements - Advanced Level:**
• Solid technique in all basic strokes and serves
• Good footwork and court movement
• Ability to maintain longer rallies with control
• Basic understanding of doubles positioning

**About Our Badminton Leagues:**
• Both singles and doubles formats available across all skill levels
• Focused on players who want competitive yet enjoyable matches
• Professional-grade shuttlecocks provided for all league play
• Multiple courts available to ensure optimal playing conditions
• Individual registration - we'll match you with players of similar skill level

**Additional Information:**
• League runs for 12 weeks with 10 regular season games and 2 weeks of playoffs
• Registered teams receive a schedule of all games for the season
• All equipment provided (except personal gear)
• Please review our standards of play for complete rules`;
      } else if (leagueName.toLowerCase().includes('intermediate') && leagueName.toLowerCase().includes('doubles')) {
        return `Intermediate doubles badminton welcomes players who are comfortable with basic strokes and serves, developing consistency in shot placement, and learning proper footwork and court positioning.

**Skill Level Requirements - Intermediate Level:**
• Comfortable with basic strokes and serves
• Developing consistency in shot placement
• Learning proper footwork and court positioning
• Eager to improve and learn new techniques

**About Our Badminton Leagues:**
• Both singles and doubles formats available across all skill levels
• Focused on players who want competitive yet enjoyable matches
• Professional-grade shuttlecocks provided for all league play
• Multiple courts available to ensure optimal playing conditions
• Individual registration - we'll match you with players of similar skill level

**Additional Information:**
• League runs for 12 weeks with 10 regular season games and 2 weeks of playoffs
• Registered teams receive a schedule of all games for the season
• All equipment provided (except personal gear)
• Please review our standards of play for complete rules`;
      } else if (leagueName.toLowerCase().includes('competitive')) {
        return `Competitive badminton featuring strong fundamental skills with developing advanced techniques. Players should demonstrate good court positioning and shot selection.

**Skill Level Requirements - Competitive Level:**
• Strong fundamental skills with developing advanced techniques
• Good court positioning and shot selection
• Consistent rallies with occasional power shots
• Understanding of basic tactics and game flow

**About Our Badminton Leagues:**
• Both singles and doubles formats available across all skill levels
• Focused on players who want competitive yet enjoyable matches
• Professional-grade shuttlecocks provided for all league play
• Multiple courts available to ensure optimal playing conditions
• Individual registration - we'll match you with players of similar skill level

**Additional Information:**
• League runs for 12 weeks with 10 regular season games and 2 weeks of playoffs
• Registered teams receive a schedule of all games for the season
• All equipment provided (except personal gear)
• Please review our standards of play for complete rules`;
      } else {
        return `OFSL badminton leagues offer competitive play for all skill levels, from intermediate to advanced players. Experience fast-paced action and improve your game in a supportive community environment.

**About Our Badminton Leagues:**
• Both singles and doubles formats available across all skill levels
• Focused on players who want competitive yet enjoyable matches
• Professional-grade shuttlecocks provided for all league play
• Multiple courts available to ensure optimal playing conditions
• Individual registration - we'll match you with players of similar skill level

**Additional Information:**
• League runs for 12 weeks with 10 regular season games and 2 weeks of playoffs
• Registered teams receive a schedule of all games for the season
• All equipment provided (except personal gear)
• Please review our standards of play for complete rules`;
      }
    }
    
    return `Join our league for competitive play in a structured, supportive environment. Perfect for players looking to improve their skills while enjoying organized competition and community.

**About Our Leagues:**
• Structured environment promoting sportsmanship and healthy competition
• Multiple skill levels available to ensure fair and competitive play
• Professional organization and game management
• Focus on skill development and community building

**Additional Information:**
• League runs for 12 weeks with regular season games and playoffs
• Registered teams receive a schedule of all games for the season
• All equipment provided (except personal gear)
• Please review our standards of play for complete rules`;
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
          start_date: editLeague.start_date,
          end_date: editLeague.end_date,
          cost: editLeague.cost,
          max_teams: editLeague.max_teams,
          gym_ids: editLeague.gym_ids
        })
        .eq('id', id);

      if (error) throw error;

      showToast('League updated successfully!', 'success');
      navigate('/my-account/leagues');
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
        {/* Header */}
        <div className="mb-8">
          <Link to="/my-account/leagues" className="flex items-center text-[#B20000] hover:underline mb-4">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Manage Leagues
          </Link>
          
          <h2 className="text-2xl font-bold text-[#6F6F6F]">Edit League</h2>
        </div>

        {/* Edit League Form - Using same Card structure as Add New League */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#6F6F6F]">Edit League Details</h3>
              <Button
                onClick={() => navigate('/my-account/leagues')}
                className="text-gray-500 hover:text-gray-700 bg-transparent hover:bg-transparent border-none shadow-none p-2"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

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

            <div className="mt-6">
              <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Description</label>
              <RichTextEditor
                value={editLeague.description}
                onChange={(content) => setEditLeague(prev => ({ ...prev, description: content }))}
                placeholder="Enter league description"
                rows={3}
              />
            </div>


            <div className="mt-6">
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

            <div className="mt-6 flex gap-4">
              <Button
                onClick={handleUpdateLeague}
                disabled={saving || !editLeague.name || !editLeague.sport_id}
                className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-2 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                onClick={() => navigate('/my-account/leagues')}
                className="bg-gray-500 hover:bg-gray-600 text-white rounded-[10px] px-6 py-2"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}