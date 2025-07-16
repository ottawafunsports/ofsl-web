import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { useToast } from '../../../../components/ui/toast';
import { X, UserPlus, Trash2, Mail, Phone, User } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface TeammateManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: number;
  teamName: string;
  currentRoster: string[];
  onRosterUpdate: (newRoster: string[]) => void;
}

export function TeammateManagementModal({
  isOpen,
  onClose,
  teamId,
  teamName,
  currentRoster,
  onRosterUpdate
}: TeammateManagementModalProps) {
  const [teammates, setTeammates] = useState<User[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<User | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadTeammates();
    }
  }, [isOpen, currentRoster]);

  const loadTeammates = async () => {
    if (currentRoster.length === 0) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, phone')
        .in('id', currentRoster);

      if (error) throw error;
      setTeammates(data || []);
    } catch (error) {
      console.error('Error loading teammates:', error);
      showToast('Failed to load teammates', 'error');
    } finally {
      setLoading(false);
    }
  };

  const searchUser = async () => {
    if (!searchEmail.trim()) return;
    
    try {
      setSearching(true);
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, phone')
        .eq('email', searchEmail.toLowerCase())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          showToast('User not found with that email', 'error');
          setSearchResult(null);
        } else {
          throw error;
        }
      } else {
        setSearchResult(data);
      }
    } catch (error) {
      console.error('Error searching user:', error);
      showToast('Failed to search for user', 'error');
      setSearchResult(null);
    } finally {
      setSearching(false);
    }
  };

  const addTeammate = async (userId: string) => {
    if (currentRoster.includes(userId)) {
      showToast('User is already on the team', 'error');
      return;
    }

    try {
      const newRoster = [...currentRoster, userId];
      const { error } = await supabase
        .from('teams')
        .update({ roster: newRoster })
        .eq('id', teamId);

      if (error) throw error;
      
      onRosterUpdate(newRoster);
      setSearchEmail('');
      setSearchResult(null);
      showToast('Teammate added successfully', 'success');
      await loadTeammates();
    } catch (error) {
      console.error('Error adding teammate:', error);
      showToast('Failed to add teammate', 'error');
    }
  };

  const removeTeammate = async (userId: string) => {
    try {
      const newRoster = currentRoster.filter(id => id !== userId);
      const { error } = await supabase
        .from('teams')
        .update({ roster: newRoster })
        .eq('id', teamId);

      if (error) throw error;
      
      onRosterUpdate(newRoster);
      showToast('Teammate removed successfully', 'success');
      await loadTeammates();
    } catch (error) {
      console.error('Error removing teammate:', error);
      showToast('Failed to remove teammate', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-[#6F6F6F]">
            Manage Teammates - {teamName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Add Teammate Section */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium text-[#6F6F6F] mb-4">Add Teammate</h3>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter teammate's email address"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchUser()}
                className="flex-1"
              />
              <Button
                onClick={searchUser}
                disabled={searching || !searchEmail.trim()}
                className="bg-[#B20000] hover:bg-[#8A0000] text-white"
              >
                {searching ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {searchResult && (
              <div className="mt-4 p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-[#6F6F6F]">{searchResult.name}</p>
                      <p className="text-sm text-gray-500">{searchResult.email}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => addTeammate(searchResult.id)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Current Teammates Section */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium text-[#6F6F6F] mb-4">
              Current Teammates ({teammates.length})
            </h3>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#B20000]"></div>
                <span className="ml-2 text-gray-600">Loading teammates...</span>
              </div>
            ) : teammates.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No teammates added yet</p>
            ) : (
              <div className="space-y-3">
                {teammates.map((teammate) => (
                  <div key={teammate.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-[#6F6F6F]">{teammate.name}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {teammate.email}
                          </div>
                          {teammate.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {teammate.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => removeTeammate(teammate.id)}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <Button
            onClick={onClose}
            variant="outline"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}