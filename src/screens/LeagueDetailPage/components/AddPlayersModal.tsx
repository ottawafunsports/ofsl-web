import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { X, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../../components/ui/toast';

interface AddPlayersModalProps {
  showModal: boolean;
  closeModal: () => void;
  teamId: number;
  teamName: string;
  currentRoster: string[];
  onPlayersAdded: () => void;
}

export function AddPlayersModal({ 
  showModal, 
  closeModal, 
  teamId, 
  teamName, 
  currentRoster,
  onPlayersAdded 
}: AddPlayersModalProps) {
  const [emails, setEmails] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const addEmailField = () => {
    setEmails([...emails, '']);
  };

  const removeEmailField = (index: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
    }
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validEmails = emails.filter(email => email.trim() && email.includes('@'));
    
    if (validEmails.length === 0) {
      showToast('Please enter at least one valid email address', 'error');
      return;
    }

    setLoading(true);

    try {
      // Find users by email addresses
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, email, name')
        .in('email', validEmails);

      if (usersError) throw usersError;

      const foundUserIds = users?.map(user => user.id) || [];
      const foundEmails = users?.map(user => user.email) || [];
      const notFoundEmails = validEmails.filter(email => !foundEmails.includes(email));

      if (notFoundEmails.length > 0) {
        showToast(
          `The following emails were not found: ${notFoundEmails.join(', ')}. Only registered users will be added.`,
          'warning'
        );
      }

      if (foundUserIds.length === 0) {
        showToast('No registered users found with the provided email addresses', 'error');
        setLoading(false);
        return;
      }

      // Filter out users already on the team
      const newPlayerIds = foundUserIds.filter(userId => !currentRoster.includes(userId));

      if (newPlayerIds.length === 0) {
        showToast('All users are already on this team', 'warning');
        setLoading(false);
        return;
      }

      // Update team roster
      const updatedRoster = [...currentRoster, ...newPlayerIds];
      
      const { error: teamError } = await supabase
        .from('teams')
        .update({ roster: updatedRoster })
        .eq('id', teamId);

      if (teamError) throw teamError;

      // Update each user's team_ids array
      for (const userId of newPlayerIds) {
        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('team_ids')
          .eq('id', userId)
          .single();

        if (fetchError) {
          console.error(`Error fetching user ${userId}:`, fetchError);
          continue;
        }

        const currentTeamIds = userData.team_ids || [];
        if (!currentTeamIds.includes(teamId)) {
          const updatedTeamIds = [...currentTeamIds, teamId];
          
          const { error: updateError } = await supabase
            .from('users')
            .update({ team_ids: updatedTeamIds })
            .eq('id', userId);

          if (updateError) {
            console.error(`Error updating user ${userId}:`, updateError);
          }
        }
      }

      const addedUsers = users?.filter(user => newPlayerIds.includes(user.id));
      const addedNames = addedUsers?.map(user => user.name || user.email).join(', ');

      showToast(`Successfully added ${newPlayerIds.length} player(s): ${addedNames}`, 'success');
      setEmails(['']);
      onPlayersAdded();
      closeModal();

    } catch (error: any) {
      console.error('Error adding players:', error);
      showToast(error.message || 'Failed to add players', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmails(['']);
    closeModal();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#6F6F6F]">Add Players</h2>
            <button 
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-[#6F6F6F]">
              <span className="font-medium">Team:</span> {teamName}
            </p>
            <p className="text-sm text-[#6F6F6F] mt-1">
              <span className="font-medium">Current Players:</span> {currentRoster.length}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#6F6F6F] mb-2">
                Player Email Addresses
              </label>
              
              {emails.map((email, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    placeholder="player@example.com"
                    className="flex-1"
                  />
                  {emails.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeEmailField(index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                type="button"
                onClick={addEmailField}
                className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-4 py-2 mt-2 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Another Email
              </Button>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Only users who have already registered accounts can be added to teams. 
                Players not found will be skipped.
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-2"
              >
                {loading ? 'Adding Players...' : 'Add Players'}
              </Button>
              <Button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white rounded-[10px] px-6 py-2"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}