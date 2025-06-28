import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/toast';
import { supabase } from '../../../lib/supabase';
import { fetchSports } from '../../../lib/leagues';
import { Plus, X, MapPin, Edit2, Save, Search, Filter } from 'lucide-react';

interface Gym {
  id: number;
  gym: string | null;
  address: string | null;
  instructions: string | null;
  active: boolean | null;
  available_days: number[] | null;
  available_sports: number[] | null;
}

interface Sport {
  id: number;
  name: string;
}

interface SchoolFilters {
  status: 'all' | 'active' | 'inactive';
  days: number[];
  sports: number[];
}

export function SchoolsTab() {
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [filteredGyms, setFilteredGyms] = useState<Gym[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewGymForm, setShowNewGymForm] = useState(false);
  const [editingGym, setEditingGym] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [filters, setFilters] = useState<SchoolFilters>({
    status: 'all',
    days: [],
    sports: []
  });
  
  const [newGym, setNewGym] = useState({
    gym: '',
    address: '',
    instructions: '',
    active: true,
    availableDays: [] as number[],
    availableSports: [] as number[]
  });

  const [editGym, setEditGym] = useState({
    gym: '',
    address: '',
    instructions: '',
    active: true,
    availableDays: [] as number[],
    availableSports: [] as number[]
  });
  const daysOfWeek = [
    { id: 0, name: 'Sunday' },
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Filter gyms based on search term and filters
    let filtered = gyms.filter(gym => 
      (gym.gym?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (gym.address?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    // Apply status filter
    if (filters.status === 'active') {
      filtered = filtered.filter(gym => gym.active === true);
    } else if (filters.status === 'inactive') {
      filtered = filtered.filter(gym => gym.active === false);
    }
    
    // Apply days filter
    if (filters.days.length > 0) {
      filtered = filtered.filter(gym => 
        gym.available_days && 
        filters.days.some(dayId => gym.available_days!.includes(dayId))
      );
    }
    
    // Apply sports filter
    if (filters.sports.length > 0) {
      filtered = filtered.filter(gym => 
        gym.available_sports && 
        filters.sports.some(sportId => gym.available_sports!.includes(sportId))
      );
    }
    
    setFilteredGyms(filtered);
  }, [gyms, searchTerm, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load sports data
      const sportsData = await fetchSports();
      setSports(sportsData);
      
      if (userProfile?.is_admin) {
        const { data: gymsResponse, error } = await supabase
          .from('gyms')
          .select('*')
          .order('gym');

        if (error) throw error;
        if (gymsResponse) setGyms(gymsResponse);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGym = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('gyms')
        .insert({
          gym: newGym.gym,
          address: newGym.address,
          instructions: newGym.instructions,
          active: newGym.active,
          available_days: newGym.availableDays,
          available_sports: newGym.availableSports
        });

      if (error) throw error;

      showToast('School/Gym added successfully!', 'success');
      setShowNewGymForm(false);
      setNewGym({ 
        gym: '', 
        address: '', 
        instructions: '', 
        active: true,
        availableDays: [],
        availableSports: []
      });
      loadData();
    } catch (error) {
      console.error('Error creating gym:', error);
      showToast('Failed to add school/gym', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEditGym = (gym: Gym) => {
    setEditingGym(gym.id);
    setEditGym({
      gym: gym.gym || '',
      address: gym.address || '',
      instructions: gym.instructions || '',
      active: gym.active ?? true,
      availableDays: gym.available_days || [],
      availableSports: gym.available_sports || []
    });
  };

  const handleUpdateGym = async () => {
    if (!editingGym) return;

    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('gyms')
        .update({
          gym: editGym.gym,
          address: editGym.address,
          instructions: editGym.instructions,
          active: editGym.active,
          available_days: editGym.availableDays,
          available_sports: editGym.availableSports
        })
        .eq('id', editingGym);

      if (error) throw error;

      showToast('School/Gym updated successfully!', 'success');
      setEditingGym(null);
      setEditGym({ 
        gym: '', 
        address: '', 
        instructions: '', 
        active: true,
        availableDays: [],
        availableSports: []
      });
      loadData();
    } catch (error) {
      console.error('Error updating gym:', error);
      showToast('Failed to update school/gym', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingGym(null);
    setEditGym({ 
      gym: '', 
      address: '', 
      instructions: '', 
      active: true,
      availableDays: [],
      availableSports: []
    });
  };

  const handleDayToggle = (dayId: number, isNewGym: boolean = false) => {
    if (isNewGym) {
      setNewGym(prev => ({
        ...prev,
        availableDays: prev.availableDays.includes(dayId)
          ? prev.availableDays.filter(id => id !== dayId)
          : [...prev.availableDays, dayId]
      }));
    } else {
      setEditGym(prev => ({
        ...prev,
        availableDays: prev.availableDays.includes(dayId)
          ? prev.availableDays.filter(id => id !== dayId)
          : [...prev.availableDays, dayId]
      }));
    }
  };

  const handleSportToggle = (sportId: number, isNewGym: boolean = false) => {
    if (isNewGym) {
      setNewGym(prev => ({
        ...prev,
        availableSports: prev.availableSports.includes(sportId)
          ? prev.availableSports.filter(id => id !== sportId)
          : [...prev.availableSports, sportId]
      }));
    } else {
      setEditGym(prev => ({
        ...prev,
        availableSports: prev.availableSports.includes(sportId)
          ? prev.availableSports.filter(id => id !== sportId)
          : [...prev.availableSports, sportId]
      }));
    }
  };

  const handleFilterChange = (filterType: keyof SchoolFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleDayFilterToggle = (dayId: number) => {
    setFilters(prev => ({
      ...prev,
      days: prev.days.includes(dayId)
        ? prev.days.filter(id => id !== dayId)
        : [...prev.days, dayId]
    }));
  };

  const handleSportFilterToggle = (sportId: number) => {
    setFilters(prev => ({
      ...prev,
      sports: prev.sports.includes(sportId)
        ? prev.sports.filter(id => id !== sportId)
        : [...prev.sports, sportId]
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      days: [],
      sports: []
    });
    setSearchTerm('');
  };

  const isAnyFilterActive = () => {
    return filters.status !== 'all' || 
           filters.days.length > 0 || 
           filters.sports.length > 0 ||
           searchTerm.trim() !== '';
  };

  if (!userProfile?.is_admin) {
    return (
      <div className="text-center py-12">
        <p className="text-[#6F6F6F] text-lg">Access denied. Admin privileges required.</p>
      </div>
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
    <div>
      {/* Header with Add School button */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-[#6F6F6F]" />
          <h2 className="text-2xl font-bold text-[#6F6F6F]">Schools</h2>
          <span className="text-sm text-[#6F6F6F]">({filteredGyms.length} of {gyms.length})</span>
        </div>
        <Button
          onClick={() => setShowNewGymForm(true)}
          className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-lg px-6 py-2"
        >
          Add School
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-[#6F6F6F]" />
          <h3 className="text-lg font-medium text-[#6F6F6F]">Search & Filters</h3>
        </div>
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6F6F6F]" />
            <Input
              placeholder="Search schools by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full max-w-md"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-[#6F6F6F] mb-3">Status</label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="status-all"
                  name="status"
                  checked={filters.status === 'all'}
                  onChange={() => handleFilterChange('status', 'all')}
                  className="mr-2"
                />
                <label htmlFor="status-all" className="text-sm text-[#6F6F6F]">
                  All Schools
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="status-active"
                  name="status"
                  checked={filters.status === 'active'}
                  onChange={() => handleFilterChange('status', 'active')}
                  className="mr-2"
                />
                <label htmlFor="status-active" className="text-sm text-[#6F6F6F]">
                  Active Only
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="status-inactive"
                  name="status"
                  checked={filters.status === 'inactive'}
                  onChange={() => handleFilterChange('status', 'inactive')}
                  className="mr-2"
                />
                <label htmlFor="status-inactive" className="text-sm text-[#6F6F6F]">
                  Inactive Only
                </label>
              </div>
            </div>
          </div>

          {/* Days Filter */}
          <div>
            <label className="block text-sm font-medium text-[#6F6F6F] mb-3">Available Days</label>
            <div className="space-y-2">
              {daysOfWeek.map((day) => (
                <div key={day.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`filter-day-${day.id}`}
                    checked={filters.days.includes(day.id)}
                    onChange={() => handleDayFilterToggle(day.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`filter-day-${day.id}`} className="text-sm text-[#6F6F6F]">
                    {day.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Sports Filter */}
          <div>
            <label className="block text-sm font-medium text-[#6F6F6F] mb-3">Available Sports</label>
            <div className="space-y-2">
              {sports.map((sport) => (
                <div key={sport.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`filter-sport-${sport.id}`}
                    checked={filters.sports.includes(sport.id)}
                    onChange={() => handleSportFilterToggle(sport.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`filter-sport-${sport.id}`} className="text-sm text-[#6F6F6F]">
                    {sport.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Clear Filters Button */}
        {isAnyFilterActive() && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              onClick={clearFilters}
              className="text-sm text-[#B20000] hover:text-[#8A0000] bg-transparent hover:bg-transparent p-0"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      {/* Add School Form */}
      {showNewGymForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#6F6F6F]">Add New School/Gym</h3>
            <Button
              onClick={() => setShowNewGymForm(false)}
              className="text-gray-500 hover:text-gray-700 bg-transparent hover:bg-transparent border-none shadow-none p-2"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#6F6F6F] mb-2">School/Gym Name</label>
              <Input
                value={newGym.gym}
                onChange={(e) => setNewGym({ ...newGym, gym: e.target.value })}
                placeholder="Enter school or gym name"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Address</label>
              <Input
                value={newGym.address}
                onChange={(e) => setNewGym({ ...newGym, address: e.target.value })}
                placeholder="Enter address"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Access Instructions</label>
              <textarea
                value={newGym.instructions}
                onChange={(e) => setNewGym({ ...newGym, instructions: e.target.value })}
                placeholder="Enter instructions for accessing the gym/school"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="new-gym-active"
                checked={newGym.active}
                onChange={(e) => setNewGym({ ...newGym, active: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="new-gym-active" className="text-sm font-medium text-[#6F6F6F]">
                Active
              </label>
            </div>

            {/* Conditional sections when active is checked */}
            {newGym.active && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Available Days Column */}
                <div>
                  <label className="block text-sm font-medium text-[#6F6F6F] mb-3">Available Days</label>
                  <div className="space-y-2">
                    {daysOfWeek.map((day) => (
                      <div key={day.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`new-day-${day.id}`}
                          checked={newGym.availableDays.includes(day.id)}
                          onChange={() => handleDayToggle(day.id, true)}
                          className="mr-2"
                        />
                        <label htmlFor={`new-day-${day.id}`} className="text-sm text-[#6F6F6F]">
                          {day.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Sports Column */}
                <div>
                  <label className="block text-sm font-medium text-[#6F6F6F] mb-3">Available Sports</label>
                  <div className="space-y-2">
                    {sports.map((sport) => (
                      <div key={sport.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`new-sport-${sport.id}`}
                          checked={newGym.availableSports.includes(sport.id)}
                          onChange={() => handleSportToggle(sport.id, true)}
                          className="mr-2"
                        />
                        <label htmlFor={`new-sport-${sport.id}`} className="text-sm text-[#6F6F6F]">
                          {sport.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Button
                onClick={() => setShowNewGymForm(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateGym}
                className="bg-[#B20000] hover:bg-[#8A0000] text-white"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save School'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schools List */}
      <div className="space-y-6">
        {filteredGyms.length === 0 && !loading ? (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-[#6F6F6F] text-lg">
              {isAnyFilterActive() ? 'No schools match your filters' : 'No schools found'}
            </p>
            {isAnyFilterActive() && (
              <Button
                onClick={clearFilters}
                className="mt-4 text-[#B20000] hover:text-[#8A0000] bg-transparent hover:bg-transparent"
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          filteredGyms.map(gym => (
          <div key={gym.id} className="border border-gray-200 rounded-lg p-6">
            {editingGym === gym.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-[#6F6F6F]">Edit School/Gym</h3>
                  <Button
                    onClick={handleCancelEdit}
                    className="text-gray-500 hover:text-gray-700 bg-transparent hover:bg-transparent border-none shadow-none p-2"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#6F6F6F] mb-2">School/Gym Name</label>
                  <Input
                    value={editGym.gym}
                    onChange={(e) => setEditGym({ ...editGym, gym: e.target.value })}
                    placeholder="Enter school or gym name"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Address</label>
                  <Input
                    value={editGym.address}
                    onChange={(e) => setEditGym({ ...editGym, address: e.target.value })}
                    placeholder="Enter address"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Access Instructions</label>
                  <textarea
                    value={editGym.instructions}
                    onChange={(e) => setEditGym({ ...editGym, instructions: e.target.value })}
                    placeholder="Enter instructions for accessing the gym/school"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="edit-gym-active"
                    checked={editGym.active}
                    onChange={(e) => setEditGym({ ...editGym, active: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="edit-gym-active" className="text-sm font-medium text-[#6F6F6F]">
                    Active
                  </label>
                </div>

                {/* Conditional sections when active is checked */}
                {editGym.active && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Available Days Column */}
                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-3">Available Days</label>
                      <div className="space-y-2">
                        {daysOfWeek.map((day) => (
                          <div key={day.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`edit-day-${day.id}`}
                              checked={editGym.availableDays.includes(day.id)}
                              onChange={() => handleDayToggle(day.id, false)}
                              className="mr-2"
                            />
                            <label htmlFor={`edit-day-${day.id}`} className="text-sm text-[#6F6F6F]">
                              {day.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Available Sports Column */}
                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-3">Available Sports</label>
                      <div className="space-y-2">
                        {sports.map((sport) => (
                          <div key={sport.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`edit-sport-${sport.id}`}
                              checked={editGym.availableSports.includes(sport.id)}
                              onChange={() => handleSportToggle(sport.id, false)}
                              className="mr-2"
                            />
                            <label htmlFor={`edit-sport-${sport.id}`} className="text-sm text-[#6F6F6F]">
                              {sport.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-4">
                  <Button
                    onClick={handleCancelEdit}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateGym}
                    className="bg-[#B20000] hover:bg-[#8A0000] text-white"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            ) : (
              // View Mode
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-[#6F6F6F]">{gym.gym}</h3>
                  <Button
                    onClick={() => handleEditGym(gym)}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-1 text-sm flex items-center gap-1"
                  >
                    <Edit2 className="h-3 w-3" />
                    Edit
                  </Button>
                </div>
                
                <div className="text-[#6F6F6F] mb-4">{gym.address}</div>
                
                <div className="mb-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    gym.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {gym.active ? 'Active' : 'Inactive'}
                  </span>
                  
                  {/* Available Days Tags */}
                  {gym.active && gym.available_days && gym.available_days.length > 0 && (
                    <div className="inline-flex flex-wrap gap-1 ml-2">
                      {gym.available_days.map(dayId => {
                        const day = daysOfWeek.find(d => d.id === dayId);
                        return day ? (
                          <span key={dayId} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {day.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                  
                  {/* Available Sports Tags */}
                  {gym.active && gym.available_sports && gym.available_sports.length > 0 && (
                    <div className="inline-flex flex-wrap gap-1 ml-2">
                      {gym.available_sports.map(sportId => {
                        const sport = sports.find(s => s.id === sportId);
                        return sport ? (
                          <span key={sportId} className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                            {sport.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
                
                {gym.instructions && (
                  <div className="mb-4">
                    <span className="font-medium text-[#6F6F6F]">Access Instructions:</span>
                    <p className="text-[#6F6F6F] mt-1">{gym.instructions}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Contact:</span> John Smith
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> 613-520-2600
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> facilities@carleton.ca
                  </div>
                </div>
              </div>
            )}
          </div>
          ))
        )}
      </div>
    </div>
  );
}