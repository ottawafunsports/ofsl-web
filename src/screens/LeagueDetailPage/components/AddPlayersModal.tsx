import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { X, Plus, Trash2, CheckCircle, XCircle, Clock, Mail } from 'lucide-react';
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

interface PlayerEmail {
  email: string;
  status: 'pending' | 'found' | 'not-found' | 'invited' | 'error';
  userDetails?: {
    id: string;
    name: string;
    email: string;
  };
  errorMessage?: string;
}

export function AddPlayersModal({ 
  showModal, 
  closeModal, 
  teamId, 
  teamName, 
  currentRoster,
  onPlayersAdded 
}: AddPlayersModalProps) {
  const [playerEmails, setPlayerEmails] = useState<PlayerEmail[]>([{ email: '', status: 'pending' }]);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const { showToast } = useToast();

  const addEmailField = () => {
    setPlayerEmails([...playerEmails, { email: '', status: 'pending' }]);
  };

  const removeEmailField = (index: number) => {
    if (playerEmails.length > 1) {
      setPlayerEmails(playerEmails.filter((_, i) => i !== index));
    }
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...playerEmails];
    newEmails[index] = { email: value, status: 'pending' };
    setPlayerEmails(newEmails);
  };

  const checkEmails = async () => {
    const validEmails = playerEmails.filter(pe => pe.email.trim() && pe.email.includes('@'));
    
    if (validEmails.length === 0) {
      showToast('Please enter at least one valid email address', 'error');
      return;
    }

    setChecking(true);

    try {
      // Check which emails exist in the database
      const emails = validEmails.map(pe => pe.email.trim());
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, email, name')
        .in('email', emails);

      if (usersError) throw usersError;

      const foundEmails = users?.map(user => user.email) || [];
      
      // Update the status of each email
      const updatedEmails = playerEmails.map(pe => {
        if (!pe.email.trim() || !pe.email.includes('@')) {
          return pe;
        }

        const user = users?.find(u => u.email === pe.email.trim());
        if (user) {
          return {
            ...pe,
            status: 'found' as const,
            userDetails: user
          };
        } else {
          return {
            ...pe,
            status: 'not-found' as const
          };
        }
      });

      setPlayerEmails(updatedEmails);
      
      const foundCount = updatedEmails.filter(pe => pe.status === 'found').length;
      const notFoundCount = updatedEmails.filter(pe => pe.status === 'not-found').length;
      
      if (foundCount > 0) {
        showToast(`Found ${foundCount} registered user(s)${notFoundCount > 0 ? `, ${notFoundCount} will need invites` : ''}`, 'success');
      } else if (notFoundCount > 0) {
        showToast(`${notFoundCount} email(s) not found - invites will be sent`, 'warning');
      }

    } catch (error: any) {
      console.error('Error checking emails:', error);
      showToast(error.message || 'Failed to check emails', 'error');
    } finally {
      setChecking(false);
    }
  };

  const sendInviteEmail = async (email: string) => {
    try {
      // Get team and league details for the invite
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select(`
          name,
          leagues:league_id(name),
          users:captain_id(name)
        `)
        .eq('id', teamId)
        .single();

      if (teamError) throw teamError;

      const inviteData = {
        email: email,
        teamName: teamData.name,
        leagueName: teamData.leagues?.name || 'OFSL League',
        captainName: teamData.users?.name || 'Team Captain'
      };

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-invite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inviteData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send invite');
      }

      return true;
    } catch (error) {
      console.error('Error sending invite:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validEmails = playerEmails.filter(pe => pe.email.trim() && pe.email.includes('@'));
    
    if (validEmails.length === 0) {
      showToast('Please enter at least one valid email address', 'error');
      return;
    }

    // Check if emails have been validated
    const hasUncheckedEmails = validEmails.some(pe => pe.status === 'pending');
    if (hasUncheckedEmails) {
      showToast('Please check emails first to see which users exist', 'warning');
      return;
    }

    setLoading(true);

    try {
      // Get users that were found
      const foundUsers = playerEmails.filter(pe => pe.status === 'found' && pe.userDetails);
      const foundUserIds = foundUsers.map(pe => pe.userDetails!.id);
      
      // Get emails that need invites
      const emailsToInvite = playerEmails.filter(pe => pe.status === 'not-found');

      // Filter out users already on the team
      const newPlayerIds = foundUserIds.filter(userId => !currentRoster.includes(userId));

      // Add found users to the team
      if (newPlayerIds.length > 0) {
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
      }

      // Send invites to non-registered emails
      const inviteResults = await Promise.all(
        emailsToInvite.map(async (emailObj) => {
          const success = await sendInviteEmail(emailObj.email);
          return { email: emailObj.email, success };
        })
      );

      // Update email statuses based on invite results
      const updatedEmails = playerEmails.map(pe => {
        if (pe.status === 'not-found') {
          const inviteResult = inviteResults.find(ir => ir.email === pe.email);
          return {
            ...pe,
            status: inviteResult?.success ? 'invited' as const : 'error' as const,
            errorMessage: inviteResult?.success ? undefined : 'Failed to send invite'
          };
        }
        return pe;
      });
      setPlayerEmails(updatedEmails);

      // Create success message
      let message = '';
      if (newPlayerIds.length > 0) {
        const addedUsers = foundUsers.filter(fu => newPlayerIds.includes(fu.userDetails!.id));
        const addedNames = addedUsers.map(fu => fu.userDetails!.name || fu.userDetails!.email).join(', ');
        message += `Added ${newPlayerIds.length} player(s): ${addedNames}`;
      }

      const successfulInvites = inviteResults.filter(ir => ir.success).length;
      if (successfulInvites > 0) {
        if (message) message += '. ';
        message += `Sent ${successfulInvites} invite(s)`;
      }

      const skippedUsers = foundUserIds.filter(userId => currentRoster.includes(userId));
      if (skippedUsers.length > 0) {
        if (message) message += '. ';
        message += `${skippedUsers.length} user(s) already on team`;
      }

      if (message) {
        showToast(message, 'success');
      }

      onPlayersAdded();
      
      // Only close modal if all operations were successful
      const hasErrors = updatedEmails.some(pe => pe.status === 'error');
      if (!hasErrors) {
        setPlayerEmails([{ email: '', status: 'pending' }]);
        closeModal();
      }

    } catch (error: any) {
      console.error('Error adding players:', error);
      showToast(error.message || 'Failed to add players', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPlayerEmails([{ email: '', status: 'pending' }]);
    closeModal();
  };

  const getStatusIcon = (status: PlayerEmail['status']) => {
    switch (status) {
      case 'found':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'not-found':
        return <XCircle className="h-4 w-4 text-orange-500" />;
      case 'invited':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (playerEmail: PlayerEmail) => {
    switch (playerEmail.status) {
      case 'found':
        return `Found: ${playerEmail.userDetails?.name || 'User found'}`;
      case 'not-found':
        return 'Will send invite';
      case 'invited':
        return 'Invite sent';
      case 'error':
        return playerEmail.errorMessage || 'Error occurred';
      default:
        return '';
    }
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
              
              {playerEmails.map((playerEmail, index) => (
                <div key={index} className="mb-3">
                  <div className="flex gap-2 mb-1">
                    <Input
                      type="email"
                      value={playerEmail.email}
                      onChange={(e) => updateEmail(index, e.target.value)}
                      placeholder="player@example.com"
                      className="flex-1"
                    />
                    {playerEmails.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeEmailField(index)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  {/* Status display */}
                  {playerEmail.email && playerEmail.status !== 'pending' && (
                    <div className="flex items-center gap-2 text-sm">
                      {getStatusIcon(playerEmail.status)}
                      <span className={`
                        ${playerEmail.status === 'found' ? 'text-green-600' : ''}
                        ${playerEmail.status === 'not-found' ? 'text-orange-600' : ''}
                        ${playerEmail.status === 'invited' ? 'text-blue-600' : ''}
                        ${playerEmail.status === 'error' ? 'text-red-600' : ''}
                      `}>
                        {getStatusText(playerEmail)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={addEmailField}
                  className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-4 py-2 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Another Email
                </Button>
                
                <Button
                  type="button"
                  onClick={checkEmails}
                  disabled={checking}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center gap-2"
                >
                  {checking ? (
                    <Clock className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  {checking ? 'Checking...' : 'Check Emails'}
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>How it works:</strong>
              </p>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• <strong>Registered users</strong> will be added to your team immediately</li>
                <li>• <strong>Non-registered emails</strong> will receive an invite to join OFSL and your team</li>
                <li>• Click "Check Emails" first to see which users exist</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading || checking}
                className="flex-1 bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-2"
              >
                {loading ? 'Processing...' : 'Add Players & Send Invites'}
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