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
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferred_position?: string;
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
  const [activeTab, setActiveTab] = useState<'teams' | 'account'>(
    location.pathname === '/my-account' ? 'account' : 'teams'
  );
  const [teams, setTeams] = useState<Team[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
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
      record: "8-2"
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
      record: "5-5"
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
      record: "12-3"
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
                  <p className="text-[#6F6F6F]">
                    Password was last updated on your account creation date.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-[#6F6F6F] mb-6 flex items-center">
                  <Bell className="h-6 w-6 mr-2" />
                  Notification Preferences
                </h2>
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-2">
                      <div>
                        <h3 className="font-medium text-[#6F6F6F]">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {key === 'email_notifications' && 'Receive general email notifications'}
                          {key === 'game_reminders' && 'Get reminders before your games'}
                          {key === 'league_updates' && 'Stay updated on league news and changes'}
                          {key === 'payment_reminders' && 'Receive payment due date reminders'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange(key as keyof NotificationSettings)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-[#B20000]' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
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