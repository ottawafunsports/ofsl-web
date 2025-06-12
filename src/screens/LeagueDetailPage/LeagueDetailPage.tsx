import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../components/ui/toast";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  Trophy,
  UserPlus,
  Edit3,
  Save,
  X,
  Trash2,
  Crown,
  User
} from "lucide-react";

interface League {
  id: number;
  name: string;
  sport: string;
  format: string;
  day: string;
  playTimes: string[];
  location: string;
  specificLocation: string;
  dates: string;
  skillLevel: string;
  price: number;
  spotsRemaining: number;
  description: string;
  image: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Player' | 'Co-Captain';
  joinedDate: string;
}

interface StandingsTeam {
  rank: number;
  teamName: string;
  wins: number;
  losses: number;
  points: number;
  gamesPlayed: number;
}

export const LeagueDetailPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'standings' | 'team'>('overview');
  const [league, setLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'Captain' | 'Co-Captain' | 'Player' | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [addingMember, setAddingMember] = useState(false);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Player' as 'Player' | 'Co-Captain'
  });

  // Mock league data
  const mockLeagues: Record<string, League> = {
    '1': {
      id: 1,
      name: "Elite Womens Volleyball - Winter 2025",
      sport: "Volleyball",
      format: "6s",
      day: "Monday",
      playTimes: ["7:00 PM - 10:00 PM"],
      location: "Central",
      specificLocation: "Carleton University",
      dates: "May 1 - August 15, 2025",
      skillLevel: "Elite",
      price: 250,
      spotsRemaining: 2,
      description: "Elite level women's volleyball league for highly skilled players. This league features competitive play with advanced strategies and techniques.",
      image: "/womens-elite-card.jpg"
    },
    '2': {
      id: 2,
      name: "Coed Intermediate Volleyball - Winter 2025",
      sport: "Volleyball",
      format: "6s",
      day: "Tuesday",
      playTimes: ["7:00 PM - 9:00 PM", "9:00 PM - 11:00 PM"],
      location: "Central",
      specificLocation: "University of Ottawa",
      dates: "May 2 - August 16, 2025",
      skillLevel: "Intermediate",
      price: 200,
      spotsRemaining: 8,
      description: "Coed intermediate volleyball league perfect for players looking to improve their skills in a fun, competitive environment.",
      image: "/571North-CR3_0335-Indoor-VB-Header-Featured.jpg"
    },
    '3': {
      id: 3,
      name: "Advanced Badminton - Fall 2024",
      sport: "Badminton",
      format: "Singles",
      day: "Wednesday",
      playTimes: ["6:30 PM - 9:30 PM"],
      location: "East End",
      specificLocation: "Rideau High School",
      dates: "May 3 - August 17, 2025",
      skillLevel: "Advanced",
      price: 180,
      spotsRemaining: 0,
      description: "Advanced badminton league for experienced players seeking competitive singles play.",
      image: "/badminton-card.png"
    }
  };

  // Mock team members data
  const mockTeamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '613-555-0123',
      role: 'Co-Captain',
      joinedDate: '2024-12-01'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '613-555-0124',
      role: 'Player',
      joinedDate: '2024-12-05'
    },
    {
      id: '3',
      name: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      phone: '613-555-0125',
      role: 'Player',
      joinedDate: '2024-12-10'
    },
    {
      id: '4',
      name: 'David Rodriguez',
      email: 'david.rodriguez@email.com',
      phone: '613-555-0126',
      role: 'Player',
      joinedDate: '2024-12-15'
    }
  ];

  // Mock standings data
  const mockStandings: StandingsTeam[] = [
    { rank: 1, teamName: "Spike Masters", wins: 12, losses: 2, points: 36, gamesPlayed: 14 },
    { rank: 2, teamName: "Net Ninjas", wins: 10, losses: 4, points: 30, gamesPlayed: 14 },
    { rank: 3, teamName: "Volleyball Vipers", wins: 9, losses: 5, points: 27, gamesPlayed: 14 },
    { rank: 4, teamName: "Court Crushers", wins: 8, losses: 6, points: 24, gamesPlayed: 14 },
    { rank: 5, teamName: "Ace Attackers", wins: 6, losses: 8, points: 18, gamesPlayed: 14 },
    { rank: 6, teamName: "Block Busters", wins: 4, losses: 10, points: 12, gamesPlayed: 14 },
    { rank: 7, teamName: "Serve Savages", wins: 3, losses: 11, points: 9, gamesPlayed: 14 },
    { rank: 8, teamName: "Dig Deep", wins: 2, losses: 12, points: 6, gamesPlayed: 14 }
  ];

  useEffect(() => {
    if (id) {
      fetchLeagueData(id);
    }
  }, [id]);

  const fetchLeagueData = async (leagueId: string) => {
    try {
      setLoading(true);
      
      // In a real app, you would fetch from the database
      const leagueData = mockLeagues[leagueId];
      
      if (!leagueData) {
        showToast('League not found', 'error');
        navigate('/leagues');
        return;
      }
      
      setLeague(leagueData);
      
      // For volleyball leagues, set user as captain for demo purposes
      if (leagueData.sport === 'Volleyball') {
        setUserRole('Captain');
        setTeamMembers(mockTeamMembers);
      } else {
        setUserRole('Player');
      }
      
    } catch (error) {
      console.error('Error fetching league data:', error);
      showToast('Error loading league data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = () => {
    if (!newMemberForm.name || !newMemberForm.email || !newMemberForm.phone) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: newMemberForm.name,
      email: newMemberForm.email,
      phone: newMemberForm.phone,
      role: newMemberForm.role,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setTeamMembers(prev => [...prev, newMember]);
    setNewMemberForm({ name: '', email: '', phone: '', role: 'Player' });
    setAddingMember(false);
    showToast('Team member added successfully', 'success');
  };

  const handleUpdateMemberRole = (memberId: string, newRole: 'Player' | 'Co-Captain') => {
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === memberId ? { ...member, role: newRole } : member
      )
    );
    setEditingMember(null);
    showToast('Member role updated successfully', 'success');
  };

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId));
    showToast('Team member removed successfully', 'success');
  };

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'Volleyball':
        return "/Volleyball.png";
      case 'Badminton':
        return "/Badminton.png";
      case 'Basketball':
        return "/Basketball.png";
      case 'Pickleball':
        return "/Pickleball.png";
      default:
        return "";
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Co-Captain':
        return 'bg-purple-100 text-purple-800';
      case 'Player':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B20000]"></div>
      </div>
    );
  }

  if (!league) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#6F6F6F] mb-4">League not found</h2>
          <Button onClick={() => navigate('/leagues')} className="bg-[#B20000] hover:bg-[#8A0000] text-white">
            Back to Leagues
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full">
      <div className="max-w-[1280px] mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <img 
              src={getSportIcon(league.sport)} 
              alt={`${league.sport} icon`}
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-4xl font-bold text-[#6F6F6F]">{league.name}</h1>
              <p className="text-lg text-[#6F6F6F]">{league.skillLevel} • {league.format}</p>
            </div>
          </div>
          
          <Button 
            onClick={() => navigate('/leagues')}
            variant="outline"
            className="border-[#B20000] text-[#B20000] hover:bg-[#B20000] hover:text-white"
          >
            ← Back to Leagues
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium text-lg border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-[#B20000] text-[#B20000]'
                : 'border-transparent text-[#6F6F6F] hover:text-[#B20000]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('standings')}
            className={`px-6 py-3 font-medium text-lg border-b-2 transition-colors ${
              activeTab === 'standings'
                ? 'border-[#B20000] text-[#B20000]'
                : 'border-transparent text-[#6F6F6F] hover:text-[#B20000]'
            }`}
          >
            <Trophy className="inline-block w-5 h-5 mr-2" />
            Standings
          </button>
          {/* Team tab - only show for captains */}
          {userRole === 'Captain' && (
            <button
              onClick={() => setActiveTab('team')}
              className={`px-6 py-3 font-medium text-lg border-b-2 transition-colors ${
                activeTab === 'team'
                  ? 'border-[#B20000] text-[#B20000]'
                  : 'border-transparent text-[#6F6F6F] hover:text-[#B20000]'
              }`}
            >
              <Users className="inline-block w-5 h-5 mr-2" />
              Team
            </button>
          )}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* League Details */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-[#6F6F6F] mb-6">League Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-[#B20000] mr-3" />
                      <div>
                        <p className="font-medium text-[#6F6F6F]">{league.day}</p>
                        <p className="text-sm text-gray-500">{league.playTimes.join(", ")}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-[#B20000] mr-3" />
                      <div>
                        <p className="font-medium text-[#6F6F6F]">Season Dates</p>
                        <p className="text-sm text-gray-500">{league.dates}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-[#B20000] mr-3" />
                      <div>
                        <p className="font-medium text-[#6F6F6F]">{league.location}</p>
                        <p className="text-sm text-gray-500">{league.specificLocation}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-[#B20000] mr-3" />
                      <div>
                        <p className="font-medium text-[#6F6F6F]">
                          ${league.price} {league.sport === "Volleyball" ? "per team" : "per player"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-[#6F6F6F] mb-3">About this League</h3>
                    <p className="text-[#6F6F6F] leading-relaxed">{league.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Registration */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#6F6F6F] mb-2">Registration</h3>
                    <p className="text-[#6F6F6F]">
                      {league.spotsRemaining > 0 
                        ? `${league.spotsRemaining} spots remaining`
                        : 'League is full - join waitlist'
                      }
                    </p>
                  </div>
                  <Button 
                    className={`bg-[#B20000] hover:bg-[#8A0000] text-white ${
                      league.spotsRemaining === 0 ? 'opacity-90' : ''
                    }`}
                    disabled={league.spotsRemaining === 0}
                  >
                    {league.spotsRemaining === 0 ? 'Join Waitlist' : 'Register Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Standings Tab */}
        {activeTab === 'standings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#6F6F6F]">League Standings</h2>
            
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Team
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Games Played
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Wins
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Losses
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Points
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockStandings.map((team) => (
                        <tr key={team.rank} className={team.rank <= 3 ? 'bg-yellow-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`text-sm font-medium ${
                                team.rank === 1 ? 'text-yellow-600' :
                                team.rank === 2 ? 'text-gray-600' :
                                team.rank === 3 ? 'text-orange-600' :
                                'text-[#6F6F6F]'
                              }`}>
                                {team.rank}
                              </span>
                              {team.rank <= 3 && (
                                <Trophy className={`ml-2 h-4 w-4 ${
                                  team.rank === 1 ? 'text-yellow-500' :
                                  team.rank === 2 ? 'text-gray-400' :
                                  'text-orange-500'
                                }`} />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-[#6F6F6F]">{team.teamName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6F6F6F]">
                            {team.gamesPlayed}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                            {team.wins}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                            {team.losses}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#6F6F6F]">
                            {team.points}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Team Tab - Only visible for captains */}
        {activeTab === 'team' && userRole === 'Captain' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#6F6F6F]">Team Management</h2>
              <Button 
                onClick={() => setAddingMember(true)}
                className="bg-[#B20000] hover:bg-[#8A0000] text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>

            {/* Add Member Form */}
            {addingMember && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-[#6F6F6F] mb-4">Add New Team Member</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                        Full Name
                      </label>
                      <Input
                        value={newMemberForm.name}
                        onChange={(e) => setNewMemberForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter full name"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={newMemberForm.email}
                        onChange={(e) => setNewMemberForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email address"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                        Phone Number
                      </label>
                      <Input
                        value={newMemberForm.phone}
                        onChange={(e) => setNewMemberForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter phone number"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                        Role
                      </label>
                      <select
                        value={newMemberForm.role}
                        onChange={(e) => setNewMemberForm(prev => ({ ...prev, role: e.target.value as 'Player' | 'Co-Captain' }))}
                        className="w-full h-12 px-4 rounded-lg border border-[#D4D4D4] focus:border-[#B20000] focus:ring-[#B20000] focus:outline-none"
                      >
                        <option value="Player">Player</option>
                        <option value="Co-Captain">Co-Captain</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleAddMember}
                      className="bg-[#B20000] hover:bg-[#8A0000] text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Add Member
                    </Button>
                    <Button
                      onClick={() => {
                        setAddingMember(false);
                        setNewMemberForm({ name: '', email: '', phone: '', role: 'Player' });
                      }}
                      variant="outline"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Team Members List */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#6F6F6F] mb-4">Team Members ({teamMembers.length})</h3>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#B20000] rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-[#6F6F6F]">{member.name}</h4>
                          <p className="text-sm text-gray-500">{member.email}</p>
                          <p className="text-sm text-gray-500">{member.phone}</p>
                          <p className="text-xs text-gray-400">Joined: {new Date(member.joinedDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {editingMember === member.id ? (
                          <div className="flex items-center gap-2">
                            <select
                              defaultValue={member.role}
                              onChange={(e) => handleUpdateMemberRole(member.id, e.target.value as 'Player' | 'Co-Captain')}
                              className="px-3 py-1 rounded border border-[#D4D4D4] focus:border-[#B20000] focus:outline-none text-sm"
                            >
                              <option value="Player">Player</option>
                              <option value="Co-Captain">Co-Captain</option>
                            </select>
                            <Button
                              onClick={() => setEditingMember(null)}
                              variant="outline"
                              size="sm"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                              {member.role === 'Co-Captain' && <Crown className="inline h-3 w-3 mr-1" />}
                              {member.role}
                            </span>
                            <Button
                              onClick={() => setEditingMember(member.id)}
                              variant="outline"
                              size="sm"
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={() => handleRemoveMember(member.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};