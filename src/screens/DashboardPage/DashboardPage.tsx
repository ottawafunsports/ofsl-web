import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { useToast } from "../../components/ui/toast";
import { 
  Users, 
  Calendar, 
  Settings, 
  MapPin, 
  Clock, 
  DollarSign,
  Bell,
  User,
  Lock,
  Mail,
  Phone,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface Team {
  id: number;
  league_id?: number; // Add league_id to map to the leagues page
  season_name: string;
  sport: string;
  skill_level: string;
  day_of_week: string;
  location: string;
  cost: number;
  status: string;
  next_game?: string;
  record?: string;
  role?: string; // Add role field
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferred_position?: string;
}

interface School {
  id: number;
  name: string;
  address: string;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  notes?: string;
}

interface SchoolAssignment {
  id: number;
  school_id: number;
  school_name: string;
  night: string;
  tier: string;
  sport: string;
  start_time: string;
  end_time: string;
  notes?: string;
}

interface NotificationSettings {
  email_notifications: boolean;
  game_reminders: boolean;
  league_updates: boolean;
  payment_reminders: boolean;
}

export const DashboardPage = (): JSX.Element => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'teams' | 'account' | 'schools'>(
    location.pathname === '/my-account' ? 'account' : 'teams'
  );
  const [teams, setTeams] = useState<Team[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolAssignments, setSchoolAssignments] = useState<SchoolAssignment[]>([]);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_notifications: true,
    game_reminders: true,
    league_updates: false,
    payment_reminders: true
  });
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferred_position: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // School management state
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [newSchool, setNewSchool] = useState({
    name: '',
    address: '',
    contact_person: '',
    contact_phone: '',
    contact_email: '',
    notes: ''
  });
  const [newAssignment, setNewAssignment] = useState({
    school_id: 0,
    night: '',
    tier: '',
    sport: '',
    start_time: '',
    end_time: '',
    notes: ''
  });
  const [editingAssignment, setEditingAssignment] = useState<number | null>(null);
  const [editAssignmentForm, setEditAssignmentForm] = useState({
    school_id: 0,
    night: '',
    tier: '',
    sport: '',
    start_time: '',
    end_time: '',
    notes: ''
  });

  // Mock data for schools and assignments
  const mockSchools: School[] = [
    { id: 1, name: "Carleton University", address: "1125 Colonel By Dr, Ottawa, ON K1S 5B6", contact_person: "John Smith", contact_phone: "613-520-2600", contact_email: "facilities@carleton.ca" },
    { id: 2, name: "University of Ottawa", address: "75 Laurier Ave E, Ottawa, ON K1N 6N5", contact_person: "Jane Doe", contact_phone: "613-562-5700", contact_email: "sports@uottawa.ca" },
    { id: 3, name: "Glebe Collegiate", address: "212 Glebe Ave, Ottawa, ON K1S 2C9", contact_person: "Mike Johnson", contact_phone: "613-239-2501", contact_email: "admin@glebecollegiate.ca" },
    { id: 4, name: "Rideau High School", address: "815 St Laurent Blvd, Ottawa, ON K1K 3A7", contact_person: "Sarah Wilson", contact_phone: "613-745-9411", contact_email: "office@rideauhigh.ca" }
  ];

  const mockAssignments: SchoolAssignment[] = [
    { id: 1, school_id: 1, school_name: "Carleton University", night: "Monday", tier: "Tier 1", sport: "Volleyball", start_time: "7:00 PM", end_time: "10:00 PM", notes: "Main gym" },
    { id: 2, school_id: 2, school_name: "University of Ottawa", night: "Tuesday", tier: "Tier 2", sport: "Volleyball", start_time: "7:00 PM", end_time: "9:00 PM", notes: "Montpetit Hall" },
    { id: 3, school_id: 3, school_name: "Glebe Collegiate", night: "Wednesday", tier: "Tier 1", sport: "Badminton", start_time: "6:30 PM", end_time: "9:30 PM" },
    { id: 4, school_id: 1, school_name: "Carleton University", night: "Thursday", tier: "Tier 3", sport: "Volleyball", start_time: "8:00 PM", end_time: "11:00 PM", notes: "Secondary gym" }
  ];

  // Mock data for teams - in real app, this would come from the database
  const mockTeams: Team[] = [
    {
      id: 1,
      league_id: 1, // Maps to Elite Womens Volleyball league
      season_name: "Elite Womens Volleyball - Winter 2025",
      sport: "Volleyball",
      skill_level: "Elite",
      day_of_week: "Monday",
      location: "Carleton University",
      cost: 250,
      status: "Active",
      next_game: "Jan 15, 2025 - 7:00 PM",
      record: "8-2",
      role: "Captain"
    },
    {
      id: 2,
      league_id: 2, // Maps to Coed Intermediate Volleyball league
      season_name: "Coed Intermediate Volleyball - Winter 2025",
      sport: "Volleyball",
      skill_level: "Intermediate",
      day_of_week: "Wednesday",
      location: "University of Ottawa",
      cost: 200,
      status: "Active",
      next_game: "Jan 17, 2025 - 8:00 PM",
      record: "5-5",
      role: "Captain"
    },
    {
      id: 3,
      league_id: 3, // Maps to Advanced Badminton league
      season_name: "Advanced Badminton - Fall 2024",
      sport: "Badminton",
      skill_level: "Advanced",
      day_of_week: "Friday",
      location: "Rideau High School",
      cost: 180,
      status: "Completed",
      record: "12-3",
      role: "Player"
    }
  ];

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('id, name, email, phone, preferred_position')
        .eq('auth_id', user?.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        showToast('Error loading profile data', 'error');
      } else if (profile) {
        setUserProfile(profile);
        setProfileForm({
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          preferred_position: profile.preferred_position || ''
        });
      }

      // For now, use mock data for teams
      // In a real app, you would fetch from registrations table
      setTeams(mockTeams);
      setSchools(mockSchools);
      setSchoolAssignments(mockAssignments);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      showToast('Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: profileForm.name,
          email: profileForm.email,
          phone: profileForm.phone,
          preferred_position: profileForm.preferred_position,
          date_modified: new Date().toISOString()
        })
        .eq('auth_id', user?.id);

      if (error) {
        console.error('Error updating profile:', error);
        showToast('Error updating profile', 'error');
      } else {
        setUserProfile(prev => prev ? { ...prev, ...profileForm } : null);
        setEditingProfile(false);
        showToast('Profile updated successfully', 'success');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Error updating profile', 'error');
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) {
        console.error('Error updating password:', error);
        showToast('Error updating password', 'error');
      } else {
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setEditingPassword(false);
        showToast('Password updated successfully', 'success');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      showToast('Error updating password', 'error');
    }
  };

  const handleNotificationChange = (setting: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    // In a real app, you would save this to the database
    showToast('Notification preferences updated', 'success');
  };

  // Handle adding new school
  const handleAddSchool = () => {
    if (!newSchool.name || !newSchool.address) {
      showToast('School name and address are required', 'error');
      return;
    }

    const school: School = {
      id: schools.length + 1,
      ...newSchool
    };

    setSchools(prev => [...prev, school]);
    setNewSchool({
      name: '',
      address: '',
      contact_person: '',
      contact_phone: '',
      contact_email: '',
      notes: ''
    });
    setShowAddSchool(false);
    showToast('School added successfully', 'success');
  };

  // Handle adding new assignment
  const handleAddAssignment = () => {
    if (!newAssignment.school_id || !newAssignment.night || !newAssignment.tier || !newAssignment.sport || !newAssignment.start_time || !newAssignment.end_time) {
      showToast('All fields except notes are required', 'error');
      return;
    }

    const selectedSchool = schools.find(s => s.id === newAssignment.school_id);
    if (!selectedSchool) {
      showToast('Selected school not found', 'error');
      return;
    }

    const assignment: SchoolAssignment = {
      id: schoolAssignments.length + 1,
      school_name: selectedSchool.name,
      ...newAssignment
    };

    setSchoolAssignments(prev => [...prev, assignment]);
    setNewAssignment({
      school_id: 0,
      night: '',
      tier: '',
      sport: '',
      start_time: '',
      end_time: '',
      notes: ''
    });
    setShowAddAssignment(false);
    showToast('School assignment added successfully', 'success');
  };

  // Handle editing assignment
  const handleEditAssignment = (assignment: SchoolAssignment) => {
    setEditingAssignment(assignment.id);
    setEditAssignmentForm({
      school_id: assignment.school_id,
      night: assignment.night,
      tier: assignment.tier,
      sport: assignment.sport,
      start_time: assignment.start_time,
      end_time: assignment.end_time,
      notes: assignment.notes || ''
    });
  };

  // Handle saving edited assignment
  const handleSaveEditedAssignment = () => {
    if (!editAssignmentForm.school_id || !editAssignmentForm.night || !editAssignmentForm.tier || !editAssignmentForm.sport || !editAssignmentForm.start_time || !editAssignmentForm.end_time) {
      showToast('All fields except notes are required', 'error');
      return;
    }

    const selectedSchool = schools.find(s => s.id === editAssignmentForm.school_id);
    if (!selectedSchool) {
      showToast('Selected school not found', 'error');
      return;
    }

    setSchoolAssignments(prev => prev.map(assignment => 
      assignment.id === editingAssignment 
        ? {
            ...assignment,
            school_id: editAssignmentForm.school_id,
            school_name: selectedSchool.name,
            night: editAssignmentForm.night,
            tier: editAssignmentForm.tier,
            sport: editAssignmentForm.sport,
            start_time: editAssignmentForm.start_time,
            end_time: editAssignmentForm.end_time,
            notes: editAssignmentForm.notes
          }
        : assignment
    ));

    setEditingAssignment(null);
    setEditAssignmentForm({
      school_id: 0,
      night: '',
      tier: '',
      sport: '',
      start_time: '',
      end_time: '',
      notes: ''
    });
    showToast('Assignment updated successfully', 'success');
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingAssignment(null);
    setEditAssignmentForm({
      school_id: 0,
      night: '',
      tier: '',
      sport: '',
      start_time: '',
      end_time: '',
      notes: ''
    });
  };

  // Check if user is admin (mock check for now)
  const isAdmin = true; // Temporarily enabled for testing - This would be replaced with actual admin check

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  const handleViewDetails = (team: Team) => {
    if (team.league_id) {
      navigate(`/leagues/${team.league_id}`);
    } else {
      // Fallback if no league_id is available
      showToast('League details not available', 'error');
    }
  };

  // Function to get role badge color based on role
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Captain':
        return 'bg-blue-100 text-blue-800';
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

  return (
    <div className="bg-white w-full min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#6F6F6F] mb-2">
            Welcome back, {userProfile?.name || 'Player'}!
          </h1>
          <p className="text-lg text-[#6F6F6F]">
            Manage your teams, schedules, and account settings
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-6 py-3 font-medium text-lg border-b-2 transition-colors ${
              activeTab === 'teams'
                ? 'border-[#B20000] text-[#B20000]'
                : 'border-transparent text-[#6F6F6F] hover:text-[#B20000]'
            }`}
          >
            <Users className="inline-block w-5 h-5 mr-2" />
            My Teams
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`px-6 py-3 font-medium text-lg border-b-2 transition-colors ${
              activeTab === 'account'
                ? 'border-[#B20000] text-[#B20000]'
                : 'border-transparent text-[#6F6F6F] hover:text-[#B20000]'
            }`}
          >
            <Settings className="inline-block w-5 h-5 mr-2" />
            Account Settings
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('schools')}
              className={`px-6 py-3 font-medium text-lg border-b-2 transition-colors ${
                activeTab === 'schools'
                  ? 'border-[#B20000] text-[#B20000]'
                  : 'border-transparent text-[#6F6F6F] hover:text-[#B20000]'
              }`}
            >
              <MapPin className="inline-block w-5 h-5 mr-2" />
              Manage Schools
            </button>
          )}
        </div>

        {/* Teams Tab */}
        {activeTab === 'teams' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-[#ffeae5] border-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#6F6F6F]">Active Teams</p>
                      <p className="text-3xl font-bold text-[#B20000]">
                        {teams.filter(t => t.status === 'Active').length}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-[#B20000]" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-50 border-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#6F6F6F]">Next Game</p>
                      <p className="text-lg font-bold text-blue-600">Jan 15</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#6F6F6F]">Total Wins</p>
                      <p className="text-3xl font-bold text-green-600">13</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Teams List */}
            <div>
              <h2 className="text-2xl font-bold text-[#6F6F6F] mb-6">Your Teams</h2>
              <div className="space-y-4">
                {teams.map((team) => (
                  <Card key={team.id} className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <img 
                            src={getSportIcon(team.sport)} 
                            alt={`${team.sport} icon`}
                            className="w-12 h-12 object-contain mt-1"
                          />
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#6F6F6F] mb-2">
                              {team.season_name}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-[#6F6F6F]">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-[#B20000] mr-1" />
                                <span>{team.day_of_week}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 text-[#B20000] mr-1" />
                                <span>{team.location}</span>
                              </div>
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 text-[#B20000] mr-1" />
                                <span>${team.cost}</span>
                              </div>
                              {team.record && (
                                <div className="flex items-center">
                                  <span className="font-medium">Record: {team.record}</span>
                                </div>
                              )}
                            </div>
                            {team.next_game && (
                              <div className="mt-2 text-sm text-[#6F6F6F]">
                                <strong>Next Game:</strong> {team.next_game}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {/* Role badge - only show for volleyball leagues */}
                          {team.sport === "Volleyball" && team.role && (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(team.role)}`}>
                              {team.role}
                            </span>
                          )}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(team.status)}`}>
                            {team.status}
                          </span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(team)}
                            className="border-[#B20000] text-[#B20000] hover:bg-[#B20000] hover:text-white"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="space-y-8">
            {/* Profile Information */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#6F6F6F] flex items-center">
                    <User className="h-6 w-6 mr-2" />
                    Profile Information
                  </h2>
                  {!editingProfile && (
                    <Button
                      onClick={() => setEditingProfile(true)}
                      variant="outline"
                      className="border-[#B20000] text-[#B20000] hover:bg-[#B20000] hover:text-white"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>

                {editingProfile ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                          Full Name
                        </label>
                        <Input
                          value={profileForm.name}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                          Email
                        </label>
                        <Input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                          Phone Number
                        </label>
                        <Input
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                          Preferred Position
                        </label>
                        <select
                          value={profileForm.preferred_position}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, preferred_position: e.target.value }))}
                          className="w-full h-12 px-4 rounded-lg border border-[#D4D4D4] focus:border-[#B20000] focus:ring-[#B20000] focus:outline-none"
                        >
                          <option value="">Select Position</option>
                          <option value="Guard">Guard</option>
                          <option value="Forward">Forward</option>
                          <option value="Center">Center</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleProfileUpdate}
                        className="bg-[#B20000] hover:bg-[#8A0000] text-white"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingProfile(false);
                          setProfileForm({
                            name: userProfile?.name || '',
                            email: userProfile?.email || '',
                            phone: userProfile?.phone || '',
                            preferred_position: userProfile?.preferred_position || ''
                          });
                        }}
                        variant="outline"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                        Full Name
                      </label>
                      <p className="text-lg text-[#6F6F6F]">{userProfile?.name || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                        Email
                      </label>
                      <p className="text-lg text-[#6F6F6F]">{userProfile?.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                        Phone Number
                      </label>
                      <p className="text-lg text-[#6F6F6F]">{userProfile?.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                        Preferred Position
                      </label>
                      <p className="text-lg text-[#6F6F6F]">{userProfile?.preferred_position || 'Not specified'}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#6F6F6F] flex items-center">
                    <Lock className="h-6 w-6 mr-2" />
                    Password & Security
                  </h2>
                  {!editingPassword && (
                    <Button
                      onClick={() => setEditingPassword(true)}
                      variant="outline"
                      className="border-[#B20000] text-[#B20000] hover:bg-[#B20000] hover:text-white"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  )}
                </div>

                {editingPassword ? (
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                        Current Password
                      </label>
                      <Input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                        New Password
                      </label>
                      <Input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                        Confirm New Password
                      </label>
                      <Input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handlePasswordUpdate}
                        className="bg-[#B20000] hover:bg-[#8A0000] text-white"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Update Password
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingPassword(false);
                          setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        }}
                        variant="outline"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-[#6F6F6F] mb-4">
                      Keep your account secure by using a strong password.
                    </p>
                    <p className="text-sm text-[#6F6F6F]">
                      Last updated: Never
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-[#6F6F6F] flex items-center mb-6">
                  <Bell className="h-6 w-6 mr-2" />
                  Notification Preferences
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-[#6F6F6F]">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive general updates via email</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('email_notifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.email_notifications ? 'bg-[#B20000]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.email_notifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-[#6F6F6F]">Game Reminders</h3>
                      <p className="text-sm text-gray-500">Get notified before upcoming games</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('game_reminders')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.game_reminders ? 'bg-[#B20000]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.game_reminders ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-[#6F6F6F]">League Updates</h3>
                      <p className="text-sm text-gray-500">Stay informed about league news and changes</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('league_updates')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.league_updates ? 'bg-[#B20000]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.league_updates ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-[#6F6F6F]">Payment Reminders</h3>
                      <p className="text-sm text-gray-500">Receive reminders for upcoming payments</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('payment_reminders')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.payment_reminders ? 'bg-[#B20000]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.payment_reminders ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Schools Tab - Admin Only */}
        {activeTab === 'schools' && isAdmin && (
          <div className="space-y-8">
            {/* Schools Management */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#6F6F6F] flex items-center">
                    <MapPin className="h-6 w-6 mr-2" />
                    Schools
                  </h2>
                  <Button
                    onClick={() => setShowAddSchool(true)}
                    className="bg-[#B20000] hover:bg-[#8A0000] text-white"
                  >
                    Add School
                  </Button>
                </div>

                {showAddSchool && (
                  <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="text-lg font-medium text-[#6F6F6F] mb-4">Add New School</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                          School Name *
                        </label>
                        <Input
                          value={newSchool.name}
                          onChange={(e) => setNewSchool(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                          Address *
                        </label>
                        <Input
                          value={newSchool.address}
                          onChange={(e) => setNewSchool(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                          Contact Person
                        </label>
                        <Input
                          value={newSchool.contact_person}
                          onChange={(e) => setNewSchool(prev => ({ ...prev, contact_person: e.target.value }))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                          Contact Phone
                        </label>
                        <Input
                          value={newSchool.contact_phone}
                          onChange={(e) => setNewSchool(prev => ({ ...prev, contact_phone: e.target.value }))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                          Contact Email
                        </label>
                        <Input
                          type="email"
                          value={newSchool.contact_email}
                          onChange={(e) => setNewSchool(prev => ({ ...prev, contact_email: e.target.value }))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                          Notes
                        </label>
                        <Input
                          value={newSchool.notes}
                          onChange={(e) => setNewSchool(prev => ({ ...prev, notes: e.target.value }))}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <Button
                        onClick={handleAddSchool}
                        className="bg-[#B20000] hover:bg-[#8A0000] text-white"
                      >
                        Add School
                      </Button>
                      <Button
                        onClick={() => setShowAddSchool(false)}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {schools.map((school) => (
                    <div key={school.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-bold text-[#6F6F6F] mb-2">{school.name}</h3>
                      <p className="text-[#6F6F6F] mb-2">{school.address}</p>
                      {school.contact_person && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[#6F6F6F]">
                          <div>
                            <strong>Contact:</strong> {school.contact_person}
                          </div>
                          {school.contact_phone && (
                            <div>
                              <strong>Phone:</strong> {school.contact_phone}
                            </div>
                          )}
                          {school.contact_email && (
                            <div>
                              <strong>Email:</strong> {school.contact_email}
                            </div>
                          )}
                        </div>
                      )}
                      {school.notes && (
                        <p className="text-sm text-gray-500 mt-2">
                          <strong>Notes:</strong> {school.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* School Assignments */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#6F6F6F] flex items-center">
                    <Calendar className="h-6 w-6 mr-2" />
                    School Assignments
                  </h2>
                  <Button
                    onClick={() => setShowAddAssignment(true)}
                    className="bg-[#B20000] hover:bg-[#8A0000] text-white"
                  >
                    Add Assignment
                  </Button>
                </div>

                {showAddAssignment && (
                  <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="text-lg font-medium text-[#6F6F6F] mb-4">Add New Assignment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                          School *
                        </label>
                        <select
                          value={newAssignment.school_id}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, school_id: parseInt(e.target.value) }))}
                          className="w-full h-12 px-4 rounded-lg border border-[#D4D4D4] focus:border-[#B20000] focus:ring-[#B20000] focus:outline-none"
                        >
                          <option value={0}>Select School</option>
                          {schools.map((school) => (
                            <option key={school.id} value={school.id}>
                              {school.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                          Night *
                        </label>
                        <select
                          value={newAssignment.night}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, night: e.target.value }))}
                          className="w-full h-12 px-4 rounded-lg border border-[#D4D4D4] focus:border-[#B20000] focus:ring-[#B20000] focus:outline-none"
                        >
                          <option value="">Select Night</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                          Tier *
                        </label>
                        <select
                          value={newAssignment.tier}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, tier: e.target.value }))}
                          className="w-full h-12 px-4 rounded-lg border border-[#D4D4D4] focus:border-[#B20000] focus:ring-[#B20000] focus:outline-none"
                        >
                          <option value="">Select Tier</option>
                          <option value="Tier 1">Tier 1</option>
                          <option value="Tier 2">Tier 2</option>
                          <option value="Tier 3">Tier 3</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                          Sport *
                        </label>
                        <select
                          value={newAssignment.sport}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, sport: e.target.value }))}
                          className="w-full h-12 px-4 rounded-lg border border-[#D4D4D4] focus:border-[#B20000] focus:ring-[#B20000] focus:outline-none"
                        >
                          <option value="">Select Sport</option>
                          <option value="Volleyball">Volleyball</option>
                          <option value="Badminton">Badminton</option>
                          <option value="Basketball">Basketball</option>
                          <option value="Pickleball">Pickleball</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                          Start Time *
                        </label>
                        <Input
                          type="time"
                          value={newAssignment.start_time}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, start_time: e.target.value }))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                          End Time *
                        </label>
                        <Input
                          type="time"
                          value={newAssignment.end_time}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, end_time: e.target.value }))}
                          className="w-full"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                          Notes
                        </label>
                        <Input
                          value={newAssignment.notes}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, notes: e.target.value }))}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <Button
                        onClick={handleAddAssignment}
                        className="bg-[#B20000] hover:bg-[#8A0000] text-white"
                      >
                        Add Assignment
                      </Button>
                      <Button
                        onClick={() => setShowAddAssignment(false)}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {schoolAssignments.map((assignment) => (
                    <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                      {editingAssignment === assignment.id ? (
                        // Edit form
                        <div>
                          <h3 className="text-lg font-medium text-[#6F6F6F] mb-4">Edit Assignment</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                                School *
                              </label>
                              <select
                                value={editAssignmentForm.school_id}
                                onChange={(e) => setEditAssignmentForm(prev => ({ ...prev, school_id: parseInt(e.target.value) }))}
                                className="w-full h-12 px-4 rounded-lg border border-[#D4D4D4] focus:border-[#B20000] focus:ring-[#B20000] focus:outline-none"
                              >
                                <option value={0}>Select School</option>
                                {schools.map((school) => (
                                  <option key={school.id} value={school.id}>
                                    {school.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                                Night *
                              </label>
                              <select
                                value={editAssignmentForm.night}
                                onChange={(e) => setEditAssignmentForm(prev => ({ ...prev, night: e.target.value }))}
                                className="w-full h-12 px-4 rounded-lg border border-[#D4D4D4] focus:border-[#B20000] focus:ring-[#B20000] focus:outline-none"
                              >
                                <option value="">Select Night</option>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option>
                                <option value="Sunday">Sunday</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                                Tier *
                              </label>
                              <select
                                value={editAssignmentForm.tier}
                                onChange={(e) => setEditAssignmentForm(prev => ({ ...prev, tier: e.target.value }))}
                                className="w-full h-12 px-4 rounded-lg border border-[#D4D4D4] focus:border-[#B20000] focus:ring-[#B20000] focus:outline-none"
                              >
                                <option value="">Select Tier</option>
                                <option value="Tier 1">Tier 1</option>
                                <option value="Tier 2">Tier 2</option>
                                <option value="Tier 3">Tier 3</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                                Sport *
                              </label>
                              <select
                                value={editAssignmentForm.sport}
                                onChange={(e) => setEditAssignmentForm(prev => ({ ...prev, sport: e.target.value }))}
                                className="w-full h-12 px-4 rounded-lg border border-[#D4D4D4] focus:border-[#B20000] focus:ring-[#B20000] focus:outline-none"
                              >
                                <option value="">Select Sport</option>
                                <option value="Volleyball">Volleyball</option>
                                <option value="Badminton">Badminton</option>
                                <option value="Basketball">Basketball</option>
                                <option value="Pickleball">Pickleball</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                                Start Time *
                              </label>
                              <Input
                                type="time"
                                value={editAssignmentForm.start_time}
                                onChange={(e) => setEditAssignmentForm(prev => ({ ...prev, start_time: e.target.value }))}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                                End Time *
                              </label>
                              <Input
                                type="time"
                                value={editAssignmentForm.end_time}
                                onChange={(e) => setEditAssignmentForm(prev => ({ ...prev, end_time: e.target.value }))}
                                className="w-full"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                                Notes
                              </label>
                              <Input
                                value={editAssignmentForm.notes}
                                onChange={(e) => setEditAssignmentForm(prev => ({ ...prev, notes: e.target.value }))}
                                className="w-full"
                              />
                            </div>
                          </div>
                          <div className="flex gap-3 mt-4">
                            <Button
                              onClick={handleSaveEditedAssignment}
                              className="bg-[#B20000] hover:bg-[#8A0000] text-white"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button
                              onClick={handleCancelEdit}
                              variant="outline"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // Display view
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-[#6F6F6F] mb-2">
                              {assignment.school_name}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-[#6F6F6F]">
                              <div>
                                <strong>Night:</strong> {assignment.night}
                              </div>
                              <div>
                                <strong>Tier:</strong> {assignment.tier}
                              </div>
                              <div>
                                <strong>Sport:</strong> {assignment.sport}
                              </div>
                              <div>
                                <strong>Time:</strong> {assignment.start_time} - {assignment.end_time}
                              </div>
                            </div>
                            {assignment.notes && (
                              <p className="text-sm text-gray-500 mt-2">
                                <strong>Notes:</strong> {assignment.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEditAssignment(assignment)}
                              variant="outline"
                              size="sm"
                              className="border-[#B20000] text-[#B20000] hover:bg-[#B20000] hover:text-white"
                            >
                              <Edit3 className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            </div>
                          </div>
                        </div>
                      )}
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