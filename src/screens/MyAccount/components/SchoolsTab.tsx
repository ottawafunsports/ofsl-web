import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/toast';
import { supabase } from '../../../lib/supabase';
import { Plus, X, MapPin, Edit2, Save } from 'lucide-react';

interface Gym {
  id: number;
  gym: string | null;
  address: string | null;
  instructions: string | null;
  active: boolean | null;
}

export function SchoolsTab() {
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [showNewGymForm, setShowNewGymForm] = useState(false);
  const [editingGym, setEditingGym] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [newGym, setNewGym] = useState({
    gym: '',
    address: '',
    instructions: '',
    active: true
  });

  const [editGym, setEditGym] = useState({
    gym: '',
    address: '',
    instructions: '',
    active: true
  });
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
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
          active: newGym.active
        });

      if (error) throw error;

      showToast('School/Gym added successfully!', 'success');
      setShowNewGymForm(false);
      setNewGym({ gym: '', address: '', instructions: '', active: true });
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
      active: gym.active ?? true
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
          active: editGym.active
        })
        .eq('id', editingGym);

      if (error) throw error;

      showToast('School/Gym updated successfully!', 'success');
      setEditingGym(null);
      setEditGym({ gym: '', address: '', instructions: '', active: true });
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
    setEditGym({ gym: '', address: '', instructions: '', active: true });
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
        </div>
        <Button
          onClick={() => setShowNewGymForm(true)}
          className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-lg px-6 py-2"
        >
          Add School
        </Button>
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
            <div className="flex gap-4">
              <Button
                onClick={handleCreateGym}
                disabled={saving || !newGym.gym}
                className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-lg px-6 py-2"
              >
                {saving ? 'Adding...' : 'Add School/Gym'}
              </Button>
              <Button
                onClick={() => setShowNewGymForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-6 py-2"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schools List */}
      <div className="space-y-6">
        {gyms.map(gym => (
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
                <div className="flex gap-4">
                  <Button
                    onClick={handleUpdateGym}
                    disabled={saving || !editGym.gym}
                    className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-lg px-6 py-2 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-6 py-2"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              // View Mode
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#6F6F6F]">{gym.gym}</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`gym-active-${gym.id}`}
                        checked={gym.active ?? true}
                        onChange={async (e) => {
                          try {
                            const { error } = await supabase
                              .from('gyms')
                              .update({ active: e.target.checked })
                              .eq('id', gym.id);
                            
                            if (error) throw error;
                            
                            // Update local state
                            setGyms(prev => prev.map(g => 
                              g.id === gym.id ? { ...g, active: e.target.checked } : g
                            ));
                            
                            showToast(`School/Gym ${e.target.checked ? 'activated' : 'deactivated'} successfully!`, 'success');
                          } catch (error) {
                            console.error('Error updating gym status:', error);
                            showToast('Failed to update gym status', 'error');
                            // Reset checkbox on error
                            e.target.checked = !e.target.checked;
                          }
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`gym-active-${gym.id}`} className="text-sm font-medium text-[#6F6F6F]">
                        Active
                      </label>
                    </div>
                    <Button
                      onClick={() => handleEditGym(gym)}
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-1 text-sm flex items-center gap-1"
                    >
                      <Edit2 className="h-3 w-3" />
                      Edit School/Gym
                    </Button>
                  </div>
                </div>
                
                <div className="text-[#6F6F6F] mb-4">{gym.address}</div>
                
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
        ))}
      </div>
    </div>
  );
}