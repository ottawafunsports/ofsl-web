import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/toast';
import { supabase } from '../../../lib/supabase';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

interface Gym {
  id: number;
  gym: string | null;
  address: string | null;
  instructions: string | null;
}

export function SchoolsTab() {
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [showNewGymForm, setShowNewGymForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [newGym, setNewGym] = useState({
    gym: '',
    address: '',
    instructions: ''
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
          instructions: newGym.instructions
        });

      if (error) throw error;

      showToast('Gym/School created successfully!', 'success');
      setShowNewGymForm(false);
      setNewGym({ gym: '', address: '', instructions: '' });
      loadData();
    } catch (error) {
      console.error('Error creating gym:', error);
      showToast('Failed to create gym/school', 'error');
    } finally {
      setSaving(false);
    }
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
        <h2 className="text-2xl font-bold text-[#6F6F6F]">Manage Schools/Gyms</h2>
        <Button
          onClick={() => setShowNewGymForm(true)}
          className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-2 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New School/Gym
        </Button>
      </div>

      {/* New Gym Form */}
      {showNewGymForm && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#6F6F6F]">Add New School/Gym</h3>
              <Button
                onClick={() => setShowNewGymForm(false)}
                className="text-gray-500 hover:text-gray-700"
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

              <div className="flex gap-4">
                <Button
                  onClick={handleCreateGym}
                  disabled={saving || !newGym.gym}
                  className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-2"
                >
                  {saving ? 'Adding...' : 'Add School/Gym'}
                </Button>
                <Button
                  onClick={() => setShowNewGymForm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white rounded-[10px] px-6 py-2"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Gyms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gyms.map(gym => (
          <Card key={gym.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-[#6F6F6F] mb-2">{gym.gym}</h3>
                  <div className="text-sm text-[#6F6F6F] space-y-1">
                    <p><span className="font-medium">Address:</span> {gym.address || 'Not provided'}</p>
                    {gym.instructions && (
                      <p><span className="font-medium">Instructions:</span> {gym.instructions}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-[8px] px-3 py-1 text-sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button className="bg-red-500 hover:bg-red-600 text-white rounded-[8px] px-3 py-1 text-sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}