import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { HeroBanner } from "../../components/HeroBanner";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../components/ui/toast";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  Star,
  UserPlus,
  Crown,
  Shield,
  User,
  Trash2,
  Edit3,
  Save,
  X
} from "lucide-react";

// Mock league data - in real app, this would come from the database
const mockLeagueData = {
  1: {
    id: 1,
    name: "Elite Womens Volleyball",
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
    maxPlayers: 18,
    description: "Our elite women's volleyball league is designed for players with advanced skills and competitive experience. This league features fast-paced, high-level play with experienced officials.",
    requirements: [
      "Minimum 3 years competitive volleyball experience",
      "Strong fundamental skills required",
      "Previous league or club experience preferred",
      "Commitment to full season attendance"
    ],
    image: "/womens-elite-card.jpg"
  },
  2: {
    id: 2,
    name: "Coed Intermediate Volleyball",
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
    maxPlayers: 18,
    description: "Perfect for players looking to improve their skills in a fun, supportive environment. This coed league welcomes players of all backgrounds.",
    requirements: [
      "Basic volleyball knowledge required",
      "Open to all skill levels",
      "Positive attitude and sportsmanship",
      "Willingness to learn and improve"
    ],
    image: "/571North-CR3_0335-Indoor-VB-Header-Featured.jpg"
  },
  3: {
    id: 3,
    name: "Advanced Badminton",
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
    maxPlayers: 16,
    description: "Advanced badminton league for experienced players seeking competitive singles play.",
    requirements: [
      "Advanced badminton skills",
      "Tournament experience preferred",
      "Own equipment required",
      "Competitive mindset"
    ],
    image: "/badminton-card.png"
  }
};

// Mock team roster data
const mockTeamRoster = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "613-555-0123",
    role: "captain",
    position: "Outside Hitter",
    joinDate: "2024-09-15"
  },
  {
    id: 2,
    name: "Emily Chen",
    email: "emily.chen@email.com",
    phone: "613-555-0124",
    role: "co-captain",
    position: "Setter",
    joinDate: "2024-09-16"
  },
  {
    id: 3,
    name: "Jessica Martinez",
    email: "jessica.martinez@email.com",
    phone: "613-555-0125",
    role: "player",
    position: "Middle Blocker",
    joinDate: "2024-09-18"
  },
  {
    id: 4,
    name: "Amanda Wilson",
    email: "amanda.wilson@email.com",
    phone: "613-555-0126",
    role: "player",
    position: "Libero",
    joinDate: "2024-09-20"
  },
  {
    id: 5,
    name: "Rachel Thompson",
    email: "rachel.thompson@email.com",
    phone: "613-555-0127",
    role: "player",
    position: "Outside Hitter",
    joinDate: "2024-09-22"
  },
  {
    id: 6,
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    phone: "613-555-0128",
    role: "player",
    position: "Right Side",
    joinDate: "2024-09-25"
  }
];

interface TeamMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'captain' | 'co-captain' | 'player';
  position: string;
  joinDate: string;
}

export const LeagueDetailPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'details' | 'roster'>('details');
  const [teamRoster, setTeamRoster] = useState<TeamMember[]>(mockTeamRoster);
  const [editingMember, setEditingMember] = useState<number | null>(null);
  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    role: 'player' as 'captain' | 'co-captain' | 'player'
  });
  const [showAddMember, setShowAddMember] = useState(false);

  // Get league data
  const leagueId = parseInt(id || '1');
  const league = mockLeagueData[leagueId as keyof typeof mockLeagueData];

  // Check if current user is captain (mock - in real app, check against database)
  const isUserCaptain = user && league?.sport === "Volleyball"; // Assume user is captain of volleyball teams

  if (!league) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#6F6F6F] mb-4">League not found</h1>
          <Link to="/leagues">
            <Button className="bg-[#B20000] hover:bg-[#8A0000] text-white">
              Back to Leagues
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddMember = () => {
    if (!newMemberForm.name || !newMemberForm.email || !newMemberForm.phone) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const newMember: TeamMember = {
      id: Math.max(...teamRoster.map(m => m.id)) + 1,
      ...newMemberForm,
      joinDate: new Date().toISOString().split('T')[0]
    };

    setTeamRoster(prev => [...prev, newMember]);
    setNewMemberForm({
      name: '',
      email: '',
      phone: '',
      position: '',
      role: 'player'
    });
    setShowAddMember(false);
    showToast('Team member added successfully', 'success');
  };

  const handleRemoveMember = (memberId: number) => {
    const member = teamRoster.find(m => m.id === memberId);
    if (member?.role === 'captain') {
      showToast('Cannot remove the team captain', 'error');
      return;
    }

    setTeamRoster(prev => prev.filter(m => m.id !== memberId));
    showToast('Team member removed successfully', 'success');
  };

  const handleRoleChange = (memberId: number, newRole: 'captain' | 'co-captain' | 'player') => {
    if (newRole === 'captain') {
      // Only one captain allowed - demote current captain to co-captain
      setTeamRoster(prev => prev.map(member => {
        if (member.role === 'captain') {
          return { ...member, role: 'co-captain' as const };
        }
        if (member.id === memberId) {
          return { ...member, role: newRole };
        }
        return member;
      }));
      showToast('Captain role transferred successfully', 'success');
    } else {
      setTeamRoster(prev => prev.map(member => 
        member.id === memberId ? { ...member, role: newRole } : member
      ));
      showToast('Role updated successfully', 'success');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'captain':
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'co-captain':
        return <Shield className="h-4 w-4 text-blue-600" />;
      case 'player':
        return <User className="h-4 w-4 text-gray-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'captain':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'co-captain':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'player':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Elite':
        return 'bg-purple-100 text-purple-800';
      case 'Competitive':
        return 'bg-blue-100 text-blue-800';
      case 'Advanced':
        return 'bg-indigo-100 text-indigo-800';
      case 'Intermediate':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSpotsBadgeColor = (spots: number) => {
    if (spots === 0) return "bg-red-100 text-red-800";
    if (spots <= 3) return "bg-orange-100 text-orange-800";
    return "bg-green-100 text-green-800";
  };

  const getSpotsText = (spots: number) => {
    if (spots === 0) return "Full";
    if (spots === 1) return "1 spot left";
    return `${spots} spots left`;
  };

  return (
    <div className="bg-white w-full">
      {/* Hero Banner */}
      <HeroBanner
        image={league.image}
        imageAlt={league.name}
        height="400px"
      >
        <div className="text-center text-white max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{league.name}</h1>
          <p className="text-xl mb-6">{league.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-3"
              disabled={league.spotsRemaining === 0}
            >
              {league.spotsRemaining === 0 ? 'Join Waitlist' : 'Register Now'}
            </Button>
            <Link to="/leagues">
              <Button
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white hover:text-[#B20000] rounded-[10px] px-6 py-3"
              >
                Back to Leagues
              </Button>
            </Link>
          </div>
        </div>
      </HeroBanner>

      <div className="max-w-[1280px] mx-auto px-4 py-12">
        {/* Tab Navigation - Only show roster tab for captains of volleyball teams */}
        {isUserCaptain && (
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-3 font-medium text-lg border-b-2 transition-colors ${
                activeTab === 'details'
                  ? 'border-[#B20000] text-[#B20000]'
                  : 'border-transparent text-[#6F6F6F] hover:text-[#B20000]'
              }`}
            >
              League Details
            </button>
            <button
              onClick={() => setActiveTab('roster')}
              className={`px-6 py-3 font-medium text-lg border-b-2 transition-colors ${
                activeTab === 'roster'
                  ? 'border-[#B20000] text-[#B20000]'
                  : 'border-transparent text-[#6F6F6F] hover:text-[#B20000]'
              }`}
            >
              <Users className="inline-block w-5 h-5 mr-2" />
              Team Roster
            </button>
          </div>
        )}

        {/* League Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-8">
            {/* League Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Schedule Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Clock className="h-6 w-6 text-[#B20000] mr-3" />
                    <h3 className="text-xl font-bold text-[#6F6F6F]">Schedule</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[#6F6F6F]"><strong>Day:</strong> {league.day}</p>
                    <p className="text-[#6F6F6F]"><strong>Times:</strong></p>
                    {league.playTimes.map((time, index) => (
                      <p key={index} className="text-[#6F6F6F] ml-4">• {time}</p>
                    ))}
                    <p className="text-[#6F6F6F]"><strong>Season:</strong> {league.dates}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Location Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <MapPin className="h-6 w-6 text-[#B20000] mr-3" />
                    <h3 className="text-xl font-bold text-[#6F6F6F]">Location</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[#6F6F6F]"><strong>Region:</strong> {league.location}</p>
                    <p className="text-[#6F6F6F]"><strong>Venue:</strong> {league.specificLocation}</p>
                    {league.sport === "Volleyball" && (
                      <p className="text-sm text-gray-500">* Specific courts may vary by week</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Registration Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Users className="h-6 w-6 text-[#B20000] mr-3" />
                    <h3 className="text-xl font-bold text-[#6F6F6F]">Registration</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[#6F6F6F]">Price:</span>
                      <span className="font-bold text-[#6F6F6F]">
                        ${league.price} {league.sport === "Volleyball" ? "per team" : "per player"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#6F6F6F]">Skill Level:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(league.skillLevel)}`}>
                        {league.skillLevel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#6F6F6F]">Availability:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSpotsBadgeColor(league.spotsRemaining)}`}>
                        {getSpotsText(league.spotsRemaining)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Requirements Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-[#6F6F6F] mb-4">League Requirements</h3>
                <ul className="space-y-2">
                  {league.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <Star className="h-5 w-5 text-[#B20000] mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-[#6F6F6F]">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Registration CTA */}
            <Card className="bg-[#ffeae5] border-none">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-[#6F6F6F] mb-4">Ready to Join?</h3>
                <p className="text-[#6F6F6F] mb-6">
                  {league.spotsRemaining === 0 
                    ? "This league is currently full, but you can join the waitlist to be notified when spots become available."
                    : `Only ${league.spotsRemaining} spots remaining! Register now to secure your place in this league.`
                  }
                </p>
                <Button
                  className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-8 py-3 text-lg"
                  disabled={league.spotsRemaining === 0}
                >
                  {league.spotsRemaining === 0 ? 'Join Waitlist' : 'Register Now'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Team Roster Tab - Only visible to captains */}
        {activeTab === 'roster' && isUserCaptain && (
          <div className="space-y-6">
            {/* Roster Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#6F6F6F]">Team Roster</h2>
              <Button
                onClick={() => setShowAddMember(true)}
                className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px]"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Player
              </Button>
            </div>

            {/* Add Member Form */}
            {showAddMember && (
              <Card className="bg-[#ffeae5] border-none">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-[#6F6F6F] mb-4">Add New Team Member</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                        Full Name *
                      </label>
                      <Input
                        value={newMemberForm.name}
                        onChange={(e) => setNewMemberForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter player's name"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                        Email *
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
                        Phone Number *
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
                        Position
                      </label>
                      <Input
                        value={newMemberForm.position}
                        onChange={(e) => setNewMemberForm(prev => ({ ...prev, position: e.target.value }))}
                        placeholder="e.g., Outside Hitter, Setter"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                        Role
                      </label>
                      <select
                        value={newMemberForm.role}
                        onChange={(e) => setNewMemberForm(prev => ({ ...prev, role: e.target.value as 'captain' | 'co-captain' | 'player' }))}
                        className="w-full h-12 px-4 rounded-lg border border-[#D4D4D4] focus:border-[#B20000] focus:ring-[#B20000] focus:outline-none"
                      >
                        <option value="player">Player</option>
                        <option value="co-captain">Co-Captain</option>
                        <option value="captain">Captain</option>
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
                        setShowAddMember(false);
                        setNewMemberForm({
                          name: '',
                          email: '',
                          phone: '',
                          position: '',
                          role: 'player'
                        });
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
            <div className="space-y-4">
              {teamRoster.map((member) => (
                <Card key={member.id} className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-[#ffeae5] rounded-full">
                          {getRoleIcon(member.role)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-[#6F6F6F]">{member.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(member.role)}`}>
                              {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-[#6F6F6F]">
                            <div>
                              <strong>Email:</strong> {member.email}
                            </div>
                            <div>
                              <strong>Phone:</strong> {member.phone}
                            </div>
                            <div>
                              <strong>Position:</strong> {member.position || 'Not specified'}
                            </div>
                            <div>
                              <strong>Joined:</strong> {new Date(member.joinDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Role Change Dropdown */}
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value as 'captain' | 'co-captain' | 'player')}
                          className="px-3 py-1 rounded border border-gray-300 text-sm focus:border-[#B20000] focus:outline-none"
                        >
                          <option value="player">Player</option>
                          <option value="co-captain">Co-Captain</option>
                          <option value="captain">Captain</option>
                        </select>
                        
                        {/* Remove Button - Disabled for captain */}
                        <Button
                          onClick={() => handleRemoveMember(member.id)}
                          variant="outline"
                          size="sm"
                          disabled={member.role === 'captain'}
                          className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Roster Summary */}
            <Card className="bg-gray-50 border-none">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#6F6F6F] mb-4">Roster Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#B20000]">{teamRoster.length}</div>
                    <div className="text-sm text-[#6F6F6F]">Total Players</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {teamRoster.filter(m => m.role === 'captain').length}
                    </div>
                    <div className="text-sm text-[#6F6F6F]">Captain</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {teamRoster.filter(m => m.role === 'co-captain').length}
                    </div>
                    <div className="text-sm text-[#6F6F6F]">Co-Captains</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-600">
                      {teamRoster.filter(m => m.role === 'player').length}
                    </div>
                    <div className="text-sm text-[#6F6F6F]">Players</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};