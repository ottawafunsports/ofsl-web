import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/toast';
import { supabase } from '../../../lib/supabase';
import { Users, Search, Edit2, Trash2, Crown, Mail, Phone, Calendar, ChevronUp, ChevronDown, Filter, Key } from 'lucide-react';
import { Link } from 'react-router-dom';

interface User {
  id: string;
  auth_id: string | null;
  name: string | null;
  email: string | null;
  phone: string;
  preferred_position: string | null;
  is_admin: boolean | null;
  is_facilitator: boolean | null;
  date_created: string;
  date_modified: string;
  team_ids: number[] | null;
}

type SortField = 'name' | 'email' | 'phone' | 'date_created' | 'is_admin' | 'is_facilitator' | 'team_count';
type SortDirection = 'asc' | 'desc';

interface UserFilters {
  administrator: boolean;
  facilitator: boolean;
  activePlayer: boolean;
}

export function UsersTab() {
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [userRegistrations, setUserRegistrations] = useState<Array<{
    id: number, 
    name: string, 
    sport_name: string | null,
    role: 'captain' | 'player'
  }>>([]);
  const [resettingPassword, setResettingPassword] = useState(false);
  
  // Sorting state
  const [sortField, setSortField] = useState<SortField>('date_created');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Filter state
  const [filters, setFilters] = useState<UserFilters>({
    administrator: false,
    facilitator: false,
    activePlayer: false
  });

  useEffect(() => {
    loadUsers();
  }, []);

  // Add a refresh button to manually reload users
  const handleRefresh = () => {
    loadUsers();
  };

  useEffect(() => {
    // Filter and sort users
    let filtered = users.filter(user => 
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.phone?.includes(searchTerm))
    );
    
    // Apply filters
    if (filters.administrator) {
      filtered = filtered.filter(user => user.is_admin === true);
    }
    if (filters.facilitator) {
      filtered = filtered.filter(user => user.is_facilitator === true);
    }
    if (filters.activePlayer) {
      filtered = filtered.filter(user => user.team_ids && user.team_ids.length > 0);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (sortField) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'email':
          aValue = a.email?.toLowerCase() || '';
          bValue = b.email?.toLowerCase() || '';
          break;
        case 'phone':
          aValue = a.phone || '';
          bValue = b.phone || '';
          break;
        case 'date_created':
          aValue = new Date(a.date_created);
          bValue = new Date(b.date_created);
          break;
        case 'is_admin':
          aValue = a.is_admin ? 1 : 0;
          bValue = b.is_admin ? 1 : 0;
          break;
        case 'is_facilitator':
          aValue = a.is_facilitator ? 1 : 0;
          bValue = b.is_facilitator ? 1 : 0;
          break;
        case 'team_count':
          aValue = a.team_ids?.length || 0;
          bValue = b.team_ids?.length || 0;
          break;
        default:
          aValue = a.date_created;
          bValue = b.date_created;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, filters, sortField, sortDirection]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // First check if the user is an admin
      const { data: adminCheck, error: adminError } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', userProfile?.id)
        .single();

      if (adminError || !adminCheck?.is_admin) {
        console.error('Error checking admin status:', adminError);
        showToast('You must be an admin to view users', 'error');
        setLoading(false);
        return;
      }

      // Use service role client for admin operations if available
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('date_created', { ascending: false });

      if (error) throw error;
      
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (user: User) => {
    setEditingUser(user.id);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      preferred_position: user.preferred_position,
      is_admin: user.is_admin,
      is_facilitator: user.is_facilitator
    });
    
    // Fetch user's league registrations
    await loadUserRegistrations(user.team_ids || []);
  };

  const loadUserRegistrations = async (teamIds: number[]) => {
    if (teamIds.length === 0) {
      setUserRegistrations([]);
      return;
    }

    try {
      const { data: teamsData, error } = await supabase
        .from('teams')
        .select(`
          id,
          captain_id,
          leagues:league_id(
            id, 
            name,
            sports:sport_id(name)
          )
        `)
        .in('id', teamIds);

      if (error) throw error;

      // Process teams to determine role and get unique leagues
      const leagueMap = new Map();
      
      teamsData?.forEach(team => {
        if (team.leagues) {
          const league = team.leagues;
          const isCaptain = team.captain_id === editingUser;
          const sportName = league.sports?.name;
          
          // If we already have this league, update role if user is captain
          if (leagueMap.has(league.id)) {
            const existing = leagueMap.get(league.id);
            if (isCaptain) {
              existing.role = 'captain';
            }
          } else {
            leagueMap.set(league.id, {
              id: league.id,
              name: league.name,
              sport_name: sportName,
              role: isCaptain ? 'captain' : 'player'
            });
          }
        }
      });

      setUserRegistrations(Array.from(leagueMap.values()));
    } catch (error) {
      console.error('Error loading user registrations:', error);
      setUserRegistrations([]);
    }
  };
  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
          preferred_position: editForm.preferred_position,
          is_admin: editForm.is_admin,
          is_facilitator: editForm.is_facilitator,
          date_modified: new Date().toISOString()
        })
        .eq('id', editingUser);

      if (error) throw error;

      showToast('User updated successfully!', 'success');
      setEditingUser(null);
      setEditForm({});
      loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      showToast('Failed to update user', 'error');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      showToast('User deleted successfully!', 'success');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('Failed to delete user', 'error');
    }
  };

  const handleResetPassword = async () => {
    if (!editingUser) return;

    const confirmReset = confirm('Are you sure you want to reset this user\'s password? They will receive an email with instructions to set a new password.');
    if (!confirmReset) return;

    try {
      setResettingPassword(true);
      
      // Get the user's email from the edit form
      const userEmail = editForm.email;
      if (!userEmail) {
        showToast('User email is required to reset password', 'error');
        return;
      }

      // Use Supabase Auth Admin API to reset password
      const { error } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email: userEmail,
        options: {
          redirectTo: `${window.location.origin}/reset-password`
        }
      });

      if (error) throw error;

      showToast('Password reset email sent successfully!', 'success');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      showToast(error.message || 'Failed to reset password', 'error');
    } finally {
      setResettingPassword(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (filterKey: keyof UserFilters) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  const clearFilters = () => {
    setFilters({
      administrator: false,
      facilitator: false,
      activePlayer: false
    });
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 ml-1" /> : 
      <ChevronDown className="h-4 w-4 ml-1" />;
  };

  const isAnyFilterActive = () => {
    return filters.administrator || filters.facilitator || filters.activePlayer;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
    <>
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-[#6F6F6F]" />
          <h2 className="text-2xl font-bold text-[#6F6F6F]">Manage Users</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-[#6F6F6F]">
            Total Users: {users.length}
          </div>
          <Button
            onClick={handleRefresh}
            className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-4 py-2 text-sm"
          >
            Refresh Users
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6F6F6F]" />
          <Input
            placeholder="Search users by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        
        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="filter-admin"
              checked={filters.administrator}
              onChange={() => handleFilterChange('administrator')}
              className="mr-2"
            />
            <label htmlFor="filter-admin" className="text-sm text-[#6F6F6F]">
              Administrator
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="filter-facilitator"
              checked={filters.facilitator}
              onChange={() => handleFilterChange('facilitator')}
              className="mr-2"
            />
            <label htmlFor="filter-facilitator" className="text-sm text-[#6F6F6F]">
              Facilitator
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="filter-active"
              checked={filters.activePlayer}
              onChange={() => handleFilterChange('activePlayer')}
              className="mr-2"
            />
            <label htmlFor="filter-active" className="text-sm text-[#6F6F6F]">
              Active Player
            </label>
          </div>
        </div>
      </div>
      
      {/* Clear filters button */}
      {isAnyFilterActive() && (
        <div className="flex justify-start">
          <Button
            onClick={clearFilters}
            className="text-sm text-[#B20000] hover:text-[#8A0000] bg-transparent hover:bg-transparent p-0"
          >
            Clear all filters
          </Button>
        </div>
      )}

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-[#6F6F6F] uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      User
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-[#6F6F6F] uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      Contact
                      {getSortIcon('email')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-[#6F6F6F] uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('is_admin')}
                  >
                    <div className="flex items-center">
                      Role
                      {getSortIcon('is_admin')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-[#6F6F6F] uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('team_count')}
                  >
                    <div className="flex items-center">
                      Teams
                      {getSortIcon('team_count')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-[#6F6F6F] uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('date_created')}
                  >
                    <div className="flex items-center">
                      Joined
                      {getSortIcon('date_created')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6F6F6F] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-[#6F6F6F]">
                              {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium text-[#6F6F6F]">
                              {user.name || 'No Name'}
                            </div>
                            {user.is_admin && (
                              <Crown className="h-4 w-4 text-yellow-500" title="Admin" />
                            )}
                            {user.is_facilitator && (
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center" title="Facilitator">
                                <span className="text-white text-xs font-bold">F</span>
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {user.email && (
                          <div className="flex items-center gap-1 text-sm text-[#6F6F6F]">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        )}
                        {user.phone && (
                          <div className="flex items-center gap-1 text-sm text-[#6F6F6F]">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          {user.is_admin && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              Admin
                            </span>
                          )}
                          {user.is_facilitator && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              Facilitator
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-[#6F6F6F]">
                          {user.preferred_position || 'No position'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6F6F6F]">
                      {user.team_ids?.length || 0} teams
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-[#6F6F6F]">
                        <Calendar className="h-3 w-3" />
                        {formatDate(user.date_created)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleEditUser(user)}
                          className="bg-transparent hover:bg-blue-50 text-blue-500 hover:text-blue-600 rounded-lg p-2 transition-colors"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-transparent hover:bg-red-50 text-red-500 hover:text-red-600 rounded-lg p-2 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-[#6F6F6F] text-lg">
                {searchTerm ? 'No users found matching your search' : 'No users found'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#6F6F6F] mb-6">Edit User</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Name</label>
                  <Input
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Enter name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Email</label>
                  <Input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Phone</label>
                  <Input
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="Enter phone"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Preferred Position</label>
                  <select
                    value={editForm.preferred_position || ''}
                    onChange={(e) => setEditForm({ ...editForm, preferred_position: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
                  >
                    <option value="">Select position...</option>
                    <option value="Guard">Guard</option>
                    <option value="Forward">Forward</option>
                    <option value="Center">Center</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Registrations</label>
                  <div className="text-sm">
                    {userRegistrations.length > 0 ? (
                      <div className="space-y-1">
                        {userRegistrations.map((league) => (
                          <div key={league.id}>
                            <div className="flex items-center gap-2">
                              <Link 
                                to={`/leagues/${league.id}`}
                                className="text-[#B20000] hover:text-[#8A0000] hover:underline"
                              >
                                {league.name}
                              </Link>
                              {league.sport_name === 'Volleyball' && (
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  league.role === 'captain' 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {league.role === 'captain' ? 'Captain' : 'Player'}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[#6F6F6F]">No league registrations</span>
                    )}
                  </div>
                </div>

                {/* User Role Section */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-[#6F6F6F] mb-3">User Role</h4>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_admin"
                        checked={editForm.is_admin || false}
                        onChange={(e) => setEditForm({ ...editForm, is_admin: e.target.checked })}
                        className="mr-2"
                      />
                      <label htmlFor="is_admin" className="text-sm font-medium text-[#6F6F6F]">
                        Admin privileges
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_facilitator"
                        checked={editForm.is_facilitator || false}
                        onChange={(e) => setEditForm({ ...editForm, is_facilitator: e.target.checked })}
                        className="mr-2"
                      />
                      <label htmlFor="is_facilitator" className="text-sm font-medium text-[#6F6F6F]">
                        Facilitator
                      </label>
                    </div>
                  </div>
                </div>

                {/* Password Reset Section - Only for Admins */}
                {userProfile?.is_admin && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-[#6F6F6F] mb-3">Password Management</h4>
                    <Button
                      onClick={handleResetPassword}
                      disabled={resettingPassword || !editForm.email}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2"
                    >
                      <Key className="h-4 w-4" />
                      {resettingPassword ? 'Sending Reset Email...' : 'Reset Password'}
                    </Button>
                    <p className="text-xs text-[#6F6F6F] mt-2">
                      This will send a password reset email to the user's email address.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-6">
                <Button
                  onClick={handleSaveUser}
                  className="flex-1 bg-[#B20000] hover:bg-[#8A0000] text-white rounded-lg px-6 py-2"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => {
                    setEditingUser(null);
                    setEditForm({});
                    setUserRegistrations([]);
                    setResettingPassword(false);
                  }}
                  className="text-gray-500 hover:text-gray-700 bg-transparent hover:bg-transparent border-none shadow-none p-2"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}