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
import { getDayName, formatLeagueDates, getPrimaryLocation } from '../../../lib/leagues';

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

interface LeagueWithTeamCount extends League {
  team_count: number;
  spots_remaining: number;
}
interface NewLeague {
  name: string;
  description: string;
  additional_info: string;
  year: string;
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
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [showNewLeagueForm, setShowNewLeagueForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [newLeague, setNewLeague] = useState<NewLeague>({
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
        // Load gyms and leagues in parallel
        const [gymsResponse, leaguesResponse] = await Promise.all([
          supabase.from('gyms').select('*').order('gym'),
          supabase.from('leagues').select(`
            *,
            sports:sport_id(name),
            skills:skill_id(name)
          `).order('created_at', { ascending: false })
        ]);

        if (gymsResponse.data) setGyms(gymsResponse.data);
        
        const { data: leaguesData, error: leaguesError } = leaguesResponse;
        if (leaguesError) throw leaguesError;
        
        // Get team counts for each league
        const { data: teamCounts, error: teamCountsError } = await supabase
          .from('teams')
          .select('league_id, id')
          .eq('active', true);

        if (teamCountsError) {
          console.error('Error fetching team counts:', teamCountsError);
        }

        // Get all unique gym IDs from leagues
        const allGymIds = new Set<number>();
        leaguesData?.forEach(league => {
          if (league.gym_ids) {
            league.gym_ids.forEach((id: number) => allGymIds.add(id));
          }
        });

        // Fetch gym information for leagues
        const { data: leagueGymsData, error: gymsError } = await supabase
          .from('leagues')
          .select(`
            *,
            sports:sport_id(name),
            skills:skill_id(name)
          `)
          .order('created_at', { ascending: false });

        if (gymsError) {
          console.error('Error fetching gyms:', gymsError);
        }

        const gymsMap = new Map(gyms.map(gym => [gym.id, gym]) || []);
        const teamCountsMap = new Map<number, number>();
        
        // Count teams per league
        teamCounts?.forEach(team => {
          const currentCount = teamCountsMap.get(team.league_id) || 0;
          teamCountsMap.set(team.league_id, currentCount + 1);
        });
        
        if (leaguesData) {
          const leaguesWithDetails = leaguesData.map(league => {
            const teamCount = teamCountsMap.get(league.id) || 0;
            const maxTeams = league.max_teams || 20;
            const spotsRemaining = Math.max(0, maxTeams - teamCount);

            // Get gyms for this league
            const leagueGyms = (league.gym_ids || [])
              .map((gymId: number) => gymsMap.get(gymId))
              .filter(gym => gym !== undefined);

            return {
            ...league,
            sport_name: league.sports?.name || null,
            skill_name: league.skills?.name || null,
            gyms: leagueGyms,
            team_count: teamCount,
            spots_remaining: spotsRemaining
            };
          });
          setLeagues(leaguesWithDetails);
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

  // Function to get badge color based on spots remaining
  const getSpotsBadgeColor = (spots: number) => {
    if (spots === 0) return "bg-red-100 text-red-800";
    if (spots <= 3) return "bg-orange-100 text-orange-800";
    return "bg-green-100 text-green-800";
  };

  // Function to get spots text
  const getSpotsText = (spots: number) => {
    if (spots === 0) return "Full";
    if (spots === 1) return "1 spot left";
    return `${spots} spots left`;
  };

  // Function to get sport icon based on sport type
  const getSportIcon = (sport: string | null) => {
    if (!sport) return "";
    switch (sport) {
      case 'Volleyball':
        return "/Volleyball.png";
      case 'Badminton':
        return "/Badminton.png";
      case 'Basketball':
        return "/Basketball.png";
      case 'Pickleball':
        return "/pickleball.png";
      default:
        return "";
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
                <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Year</label>
                <select
                  value={newLeague.year}
                  onChange={(e) => setNewLeague({ ...newLeague, year: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
                >
                  <option value="2025">2025</option>
                  <option value="2025/26">2025/26</option>
                  <option value="2026">2026</option>
                  <option value="2026/27">2026/27</option>
                  <option value="2027">2027</option>
                  <option value="2027/28">2027/28</option>
                  <option value="2028">2028</option>
                  <option value="2028/29">2028/29</option>
                  <option value="2029">2029</option>
                  <option value="2029/30">2029/30</option>
                  <option value="2030">2030</option>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leagues.map(league => (
          <Card 
            key={league.id}
            className="overflow-hidden rounded-lg border border-gray-200 flex flex-col h-full"
          >
            <CardContent className="p-0 flex flex-col h-full">
              {/* Card Header with League Name and Sport Icon */}
              <div className="bg-[#F8F8F8] border-b border-gray-200 p-4 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-[#6F6F6F] line-clamp-2">{league.name}</h3>
                </div>
                <img 
                  src={getSportIcon(league.sport_name)} 
                  alt={`${league.sport_name} icon`}
                  className="w-8 h-8 object-contain ml-2"
                />
              </div>
              
              {/* Card Body with Info */}
              <div className="p-4 flex-grow flex flex-col space-y-4">
                {/* Day & Time */}
                <div className="space-y-1">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-[#B20000] mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                    </svg>
                    <p className="text-sm font-medium text-[#6F6F6F]">{getDayName(league.day_of_week)}</p>
                  </div>
                  <p className="text-sm text-[#6F6F6F] ml-6">
                    Times vary by tier
                  </p>
                </div>
                
                {/* Dates */}
                <div className="space-y-1">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-[#B20000] mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z"/>
                    </svg>
                    <p className="text-sm font-medium text-[#6F6F6F]">{formatLeagueDates(league.start_date, league.end_date)}</p>
                  </div>
                </div>
                
                {/* Location */}
                <div className="space-y-1">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-[#B20000] mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13C19,5.13 15.87,2 12,2zM7,9c0,-2.76 2.24,-5 5,-5s5,2.24 5,5c0,2.88 -2.88,7.19 -5,9.88C9.92,16.21 7,11.85 7,9z"/>
                      <circle cx="12" cy="9" r="2.5"/>
                    </svg>
                    <p className="text-sm font-medium text-[#6F6F6F]">{getPrimaryLocation(league.gyms) || 'Location TBD'}</p>
                  </div>
                  {league.sport_name === "Volleyball" && (
                    <p className="text-xs text-gray-500 ml-6">Location varies by tier</p>
                  )}
                </div>
                
                {/* Price */}
                <div className="space-y-1">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-[#B20000] mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
                    </svg>
                    <p className="text-sm font-medium text-[#6F6F6F]">
                      ${league.cost} {league.sport_name === "Volleyball" ? "per team" : "per player"}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Admin Actions with spots remaining */}
              <div className="mt-auto p-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-[#B20000] mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z"/>
                  </svg>
                  <span className={`text-xs font-medium py-0.5 px-2 rounded-full ${getSpotsBadgeColor(league.spots_remaining)}`}>
                    {getSpotsText(league.spots_remaining)}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Link to={`/my-account/leagues/edit/${league.id}`}>
                    <Button className="bg-transparent hover:bg-blue-50 text-blue-500 rounded-[8px] p2 transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => handleDeleteLeague(league.id)}
                    className="bg-transparent hover:bg-red-50 text-red-500 rounded-[8px] p-2 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* No Results Message */}
      {leagues.length === 0 && !loading && (
        <div className="text-center py-12">
          <h3 className="text-xl font-bold text-[#6F6F6F] mb-2">No leagues found</h3>
          <p className="text-[#6F6F6F]">Create your first league to get started.</p>
        </div>
      )}
    </div>
  );
}