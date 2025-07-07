import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { AlertCircle, Trash, X } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/toast';
import { supabase } from '../../../lib/supabase';
import { fetchSkills } from '../../../lib/leagues';
import { ChevronLeft, Save, Users, Crown, Mail, Trash2, CreditCard, Edit2, History } from 'lucide-react';

// Type definitions
interface Skill {
  id: number;
  name: string;
  description: string | null;
}

interface TeamMember {
  id: string;
  name: string | null;
  email: string | null;
}

interface PaymentInfo {
  id: number;
  amount_due: number;
  amount_paid: number;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  due_date: string | null;
  payment_method: string | null;
  notes: string | null;
}

interface PaymentHistoryEntry {
  id: number;
  amount: number;
  payment_id?: number;
  payment_method: string | null;
  date: string; 
  notes: string | null;
}

interface EditPaymentForm {
  id: number | null;
  amount: string;
  payment_method: string | null;
  date: string;
  notes: string;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Confirmation Modal Component
function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel
}: ConfirmationModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{message}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <Button
              onClick={onCancel}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TeamEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  
  // State for team data
  const [team, setTeam] = useState<any>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // State for team deletion
  const [deleting, setDeleting] = useState(false);
  
  // State for team edit form
  const [editTeam, setEditTeam] = useState<{
    name: string;
    skill_level_id: number | null;
  }>({
    name: '',
    skill_level_id: null
  });

  // State for payment information
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryEntry[]>([]);
  
  // State for new payment form
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('e_transfer');
  const [paymentNotes, setPaymentNotes] = useState<string>('');
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // State for editing payment
  const [editingPayment, setEditingPayment] = useState<EditPaymentForm>({
    id: null,
    amount: '',
    payment_method: null,
    date: '',
    notes: ''
  });
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  // Confirmation modal state
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Load data on component mount
  useEffect(() => {
    if (!userProfile?.is_admin) {
      navigate('/my-account/profile');
      return;
    }
    
    if (id) {
      loadData();
    }
  }, [id, userProfile]);

  // Main data loading function
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load skills data
      const skillsData = await fetchSkills();
      setSkills(skillsData);

      // Load team data
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select(`
          *,
          leagues:league_id(id, name),
          skills:skill_level_id(name),
          users:captain_id(name, email)
        `)
        .eq('id', id)
        .single();
      
      if (teamError) throw teamError;
      
      if (!teamData) {
        throw new Error('Team not found');
      }
      
      setTeam(teamData);
      
      setEditTeam({
        name: teamData.name,
        skill_level_id: teamData.skill_level_id
      });

      // Load team members
      await loadTeamMembers(teamData.roster);
      
      // Load payment information
      await loadPaymentInfo(teamData.id, teamData.league_id);
      
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Failed to load team data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load team members
  const loadTeamMembers = async (roster: string[]) => {
    if (!roster || roster.length === 0) {
      setTeamMembers([]);
      return;
    }
    
    try {
      const { data: membersData, error: membersError } = await supabase
        .from('users')
        .select('id, name, email')
        .in('id', roster);

      if (membersError) {
        console.error('Error loading team members:', membersError);
        return;
      }
      
      setTeamMembers(membersData || []);
    } catch (error) {
      console.error('Error in loadTeamMembers:', error);
    }
  };

  // Load payment information
  const loadPaymentInfo = async (teamId: number, leagueId: number) => {
    try {
      const { data: paymentData, error: paymentError } = await supabase
        .from('league_payments')
        .select('*')
        .eq('team_id', teamId)
        .eq('league_id', leagueId)
        .maybeSingle();

      if (paymentError) {
        console.error('Error loading payment information:', paymentError);
        return;
      }
      
      if (paymentData) {
        setPaymentInfo(paymentData);
        
        // Parse payment history from notes
        parsePaymentHistory(paymentData.notes);
      }
    } catch (error) {
      console.error('Error in loadPaymentInfo:', error);
    }
  };

  // Parse payment history from notes
  const parsePaymentHistory = (notes: string | null) => {
    if (!notes) {
      // Initialize with empty array
      setPaymentHistory([]); 
      return;
    }
    
    try {
      // First try to parse as JSON (for new format)
      try {
        const parsedHistory = JSON.parse(notes); 
        if (Array.isArray(parsedHistory)) {
          setPaymentHistory(parsedHistory);
          return;
        }
      } catch (e) {
        // Not JSON, continue with legacy parsing
      }
      
      // Legacy parsing from plain text notes
      const history: PaymentHistoryEntry[] = [];
      const notesLines = notes.split('\n').filter(line => line.trim() !== '');
      
      notesLines.forEach((note, index) => {
        // Extract payment information from the note
        const amountMatch = note.match(/\$(\d+(\.\d+)?)/);
        const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
      
        // Determine payment method
        let method: string | null = null;
        if (note.toLowerCase().includes('e-transfer') || note.toLowerCase().includes('etransfer') || note.toLowerCase().includes('e_transfer')) {
          method = 'e_transfer';
        } else if (note.toLowerCase().includes('cash')) {
          method = 'cash';
        } else if (note.toLowerCase().includes('online')) {
          method = 'stripe';
        }
      
        // Extract date if present
        const dateMatch = note.match(/(\d{1,2})[-\/](\d{1,2})/);
        let date = new Date().toISOString();
        if (dateMatch) {
          const month = parseInt(dateMatch[1]) - 1; // JS months are 0-indexed
          const day = parseInt(dateMatch[2]);
          const year = new Date().getFullYear();
          date = new Date(year, month, day).toISOString();
        }
      
        history.push({
          id: index + 1,
          amount,
          payment_id: paymentInfo?.id,
          payment_method: method,
          date,
          notes: note.trim()
        });
      });
    
      setPaymentHistory(history);
      
      // If we had to parse legacy format, update the database with the new JSON format
      if (history.length > 0 && paymentInfo) {
        updatePaymentHistoryInDatabase(history, paymentInfo.id);
      }
    } catch (error) {
      console.error('Error parsing payment history:', error);
      setPaymentHistory([]);
    }
  };

  // Helper function to update payment history in database
  const updatePaymentHistoryInDatabase = async (history: PaymentHistoryEntry[], paymentId: number) => {
    try {
      // Calculate total amount from history entries
      const totalAmount = history.reduce((sum, entry) => sum + entry.amount, 0);
      
      // Update the database with JSON format and correct total
      const { error } = await supabase
        .from('league_payments')
        .update({ 
          notes: JSON.stringify(history),
          amount_paid: totalAmount
        })
        .eq('id', paymentId);

      if (error) {
        console.error('Error updating payment history in database:', error);
      }
    } catch (error) {
      console.error('Error in updatePaymentHistoryInDatabase:', error);
    }
  };

  // Show confirmation modal for deleting a payment entry
  const confirmDeletePayment = (entry: PaymentHistoryEntry) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Payment Entry',
      message: `Are you sure you want to delete this payment entry of $${entry.amount.toFixed(2)}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => {
        handleDeletePayment(entry);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
    });
  };

  // Delete a payment entry
  const handleDeletePayment = async (entry: PaymentHistoryEntry) => {
    if (!paymentInfo) return;
    
    try {
      setProcessingPayment(true);
      
      // Remove the entry from payment history
      const updatedHistory = paymentHistory.filter(h => h.id !== entry.id);
      
      // Store history as JSON in notes field
      const updatedNotes = JSON.stringify(updatedHistory);
      
      // Calculate the new total amount paid based on remaining entries - ensure it's a number
      const newAmountPaid = updatedHistory.reduce((total, entry) => {
        const amount = typeof entry.amount === 'number' ? entry.amount : parseFloat(entry.amount.toString()) || 0;
        return total + amount;
      }, 0);
      
      // Update in database
      const { data, error } = await supabase
        .from('league_payments')
        .update({ 
          notes: updatedNotes, 
          amount_paid: newAmountPaid
        })
        .eq('id', paymentInfo.id)
        .select()
        .single();

      if (error) throw error;
      
      // Update local state with the returned data
      if (data) {
        setPaymentInfo({
          ...paymentInfo,
          amount_paid: newAmountPaid,
          payment_method: paymentMethod,
          notes: updatedNotes
        });
        
        // Update payment history
        setPaymentHistory(updatedHistory);
      }

      showToast('Payment entry deleted successfully!', 'success');

    } catch (error) {
      console.error('Error deleting payment entry:', error);
      showToast('Failed to delete payment entry', 'error');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Update team information
  const handleUpdateTeam = async () => {
    if (!id) return;

    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('teams')
        .update({
          name: editTeam.name,
          skill_level_id: editTeam.skill_level_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      showToast('Team updated successfully!', 'success');
      
      // Navigate back to the league detail page
      if (team?.leagues?.id) {
        navigate(`/leagues/${team.leagues.id}?tab=teams`);
      } else {
        navigate('/my-account/leagues');
      }
    } catch (error) {
      console.error('Error updating team:', error);
      showToast('Failed to update team', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete team and associated records
  const handleDeleteTeam = async () => {
    if (!id || !team) {
      setShowDeleteConfirmation(false);
      return;
    }
    
    try {
      setDeleting(true);
      
      // 1. Update team_ids for all users in the roster
      if (team.roster && team.roster.length > 0) {
        for (const userId of team.roster) {
          const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('team_ids')
            .eq('id', userId)
            .single();
            
          if (fetchError) {
            console.error(`Error fetching user ${userId}:`, fetchError);
            continue;
          }
          
          if (userData) {
            const updatedTeamIds = (userData.team_ids || []).filter((teamId: number) => teamId !== parseInt(id));
            
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
      
      // 2. Delete the team (league_payments will be deleted via ON DELETE CASCADE)
      const { error: deleteError } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);
        
      if (deleteError) throw deleteError;
      
      showToast('Team deleted successfully', 'success');
      
      // Navigate back to teams page
      navigate('/my-account/teams');
      
    } catch (error: any) {
      console.error('Error deleting team:', error);
      showToast(error.message || 'Failed to delete team', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Process a new payment
  const handleProcessPayment = async () => {
    if (!paymentInfo || !depositAmount || parseFloat(depositAmount) <= 0) {
      showToast('Please enter a valid deposit amount', 'error');
      return;
    }

    const depositValue = parseFloat(depositAmount);
    const newAmountPaid = paymentInfo.amount_paid + depositValue;

    if (newAmountPaid > paymentInfo.amount_due) {
      showToast('Deposit amount cannot exceed the amount owing', 'error');
      return;
    }

    try {
      setProcessingPayment(true);

      // Format the current date
      const today = new Date();
      const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

      // Create a new payment history entry
      const newHistoryEntry: PaymentHistoryEntry = {
        id: paymentHistory.length > 0 ? Math.max(...paymentHistory.map(h => h.id)) + 1 : 1,
        payment_id: paymentInfo.id,
        amount: parseFloat(editingPayment.amount) || 0, 
        payment_method: paymentMethod,
        date: today.toISOString(),
        notes: paymentNotes.trim() || `Payment of $${depositValue.toFixed(2)} via ${formatPaymentMethod(paymentMethod)}`
      };
      
      // Add new entry to payment history
      const updatedHistory = [...paymentHistory, newHistoryEntry];

      // Store history as JSON in notes field - ensure it's properly formatted
      const updatedNotes = JSON.stringify(updatedHistory);

      // Calculate total from all history entries to ensure consistency
      const totalPaid = updatedHistory.reduce((sum, entry) => sum + entry.amount, 0);

      // Update the payment record
      const { data, error } = await supabase
        .from('league_payments')
        .update({
          amount_paid: totalPaid,
          payment_method: paymentMethod, // Update the payment method
          notes: updatedNotes
        })
        .eq('id', paymentInfo.id)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      if (data) {
        setPaymentInfo(data);
        // Update payment history
        setPaymentHistory(updatedHistory);
      }

      showToast(`Payment of $${depositValue.toFixed(2)} processed successfully!`, 'success');
      
      // Reset form
      setDepositAmount('');
      setPaymentNotes('');
      setPaymentMethod('e_transfer');

    } catch (error) {
      console.error('Error processing payment:', error);
      showToast('Failed to process payment', 'error');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Remove a team member
  const handleRemoveMember = async (memberId: string) => {
    if (!team || !confirm('Are you sure you want to remove this member from the team?')) {
      return;
    }

    try {
      // Don't allow removing the captain
      if (memberId === team.captain_id) {
        showToast('Cannot remove the team captain', 'error');
        return;
      }

      const updatedRoster = team.roster.filter((id: string) => id !== memberId);
      
      const { error: teamError } = await supabase
        .from('teams')
        .update({ roster: updatedRoster })
        .eq('id', id);

      if (teamError) throw teamError;

      // Update user's team_ids array
      const member = teamMembers.find(m => m.id === memberId);
      if (member) {
        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('team_ids')
          .eq('id', memberId)
          .single();

        if (!fetchError && userData) {
          const updatedTeamIds = (userData.team_ids || []).filter((teamId: number) => teamId !== parseInt(id!));
          
          const { error: updateError } = await supabase
            .from('users')
            .update({ team_ids: updatedTeamIds })
            .eq('id', memberId);

          if (updateError) {
            console.error('Error updating user team_ids:', updateError);
          }
        }
      }

      showToast('Member removed successfully', 'success');
      
      // Reload data to update the UI
      await loadData();
    } catch (error) {
      console.error('Error removing member:', error);
      showToast('Failed to remove member', 'error');
    }
  };

  // Edit a payment entry
  const handleEditPayment = (entry: PaymentHistoryEntry) => {
    setEditingNoteId(entry.id);
    setEditingPayment({
      id: entry.id,
      amount: entry.amount.toString(),
      payment_method: entry.payment_method,
      date: entry.date.split('T')[0], // Format date for input
      notes: entry.notes || ''
    });
  };

  // Save edited payment
  const handleSavePaymentEdit = async () => {
    if (!paymentInfo || editingNoteId === null) return;
    
    try {
      setProcessingPayment(true);
      
      const originalEntry = paymentHistory.find(h => h.id === editingNoteId);
      if (!originalEntry) return;
      
      // Create a deep copy of the payment history
      const updatedHistory = [...paymentHistory];
      const entryIndex = updatedHistory.findIndex(h => h.id === editingNoteId);
      
      if (entryIndex !== -1) {
        // Update the entry with new values
        updatedHistory[entryIndex] = {
          ...updatedHistory[entryIndex],
          amount: parseFloat(editingPayment.amount) || 0,
          payment_method: editingPayment.payment_method,
          date: editingPayment.date ? new Date(editingPayment.date).toISOString() : new Date().toISOString(),
          notes: editingPayment.notes
        };
      }
      
      // Convert updated history to JSON format
      const updatedNotes = JSON.stringify(updatedHistory);
      
      // Calculate the new total amount paid based on all entries - ensure it's a number
      const newAmountPaid = updatedHistory.reduce((total, entry) => {
        const amount = typeof entry.amount === 'number' ? entry.amount : parseFloat(entry.amount.toString()) || 0;
        return total + amount;
      }, 0);
      
      // Update in database
      const { data, error } = await supabase
        .from('league_payments')
        .update({ 
          notes: updatedNotes,
          amount_paid: newAmountPaid,
          payment_method: editingPayment.payment_method || paymentInfo.payment_method
        })
        .eq('id', paymentInfo.id)
        .select()
        .single(); 

      if (error) throw error;
      
      // Update local state with the returned data
      if (data) {
        setPaymentInfo({
          ...paymentInfo,
          amount_paid: newAmountPaid,
          payment_method: editingPayment.payment_method || paymentInfo.payment_method,
          notes: updatedNotes
        });
        
        // Update payment history with the new values
        setPaymentHistory(updatedHistory);
      }

      showToast('Payment record updated successfully!', 'success');
      
      // Reset form
      setEditingNoteId(null);
      setEditingPayment({
        id: null,
        amount: '',
        payment_method: null,
        date: '',
        notes: ''
      });

    } catch (error) {
      console.error('Error updating payment record:', error);
      showToast('Failed to update payment record', 'error');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Cancel editing a payment
  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingPayment({
      id: null,
      amount: '',
      payment_method: null,
      date: '',
      notes: ''
    });
  };

  // Confirmation Modal Component
  const DeleteConfirmationModal = () => {
    if (!showDeleteConfirmation) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
          <div className="p-6">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Confirm Team Unregistration</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to unregister the team "{team?.name}"? This action cannot be undone and will remove all team data including registrations and payment records.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <Button
                onClick={() => setShowDeleteConfirmation(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteTeam}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Yes, Unregister Team
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Helper function to get payment status color
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to format payment method for display
  const formatPaymentMethod = (method: string | null) => {
    if (!method) return '-';
    
    // Handle stripe as Online for display
    if (method === 'stripe') return 'ONLINE';
    
    // Convert e_transfer to E-TRANSFER, etc.
    return method.replace('_', '-').toUpperCase();
  };

  if (!userProfile?.is_admin) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white w-full min-h-screen">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B20000]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="bg-white w-full min-h-screen">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-[#6F6F6F] mb-4">Team Not Found</h1>
            <Link to="/my-account/leagues">
              <Button className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-3">
                Back to Manage Leagues
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="mb-8">
          <Link 
            to={`/leagues/${team.leagues?.id}?tab=teams`} 
            className="flex items-center text-[#B20000] hover:underline mb-4"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to League Details
          </Link>
          
          <h2 className="text-2xl font-bold text-[#6F6F6F]">Edit Team Registration</h2>
        </div>

        {/* Team Basic Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#6F6F6F]">Team Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Team Name</label>
                <Input
                  value={editTeam.name}
                  onChange={(e) => setEditTeam({ ...editTeam, name: e.target.value })}
                  placeholder="Enter team name"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Skill Level</label>
                <select
                  value={editTeam.skill_level_id || ''}
                  onChange={(e) => setEditTeam({ ...editTeam, skill_level_id: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
                >
                  <option value="">Select skill level...</option>
                  {skills.map(skill => (
                    <option key={skill.id} value={skill.id}>{skill.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#6F6F6F]">
                <div>
                  <span className="font-medium">League:</span> {team.leagues?.name || 'Unknown'}
                </div>
                <div>
                  <span className="font-medium">Registration Date:</span> {new Date(team.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <Button
                onClick={handleUpdateTeam}
                disabled={saving || !editTeam.name}
                className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-2 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                onClick={() => setShowDeleteConfirmation(true)}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white rounded-[10px] px-6 py-2 flex items-center gap-2"
              >
                <Trash className="h-4 w-4" />
                {deleting ? 'Deleting...' : 'Unregister Team'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        {paymentInfo && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#6F6F6F] flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </h3>
                <span className={`px-3 py-1 text-sm rounded-full ${getPaymentStatusColor(paymentInfo.status)}`}>
                  {paymentInfo.status.charAt(0).toUpperCase() + paymentInfo.status.slice(1)}
                </span>
              </div>

              {/* Payment Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-[#6F6F6F] mb-1">Amount Due</div>
                  <div className="text-2xl font-bold text-[#6F6F6F]">
                    ${paymentInfo.amount_due.toFixed(2)}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-[#6F6F6F] mb-1">Amount Paid</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${paymentInfo.amount_paid.toFixed(2)}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-[#6F6F6F] mb-1">Amount Owing</div>
                  <div className={`text-2xl font-bold ${
                    (paymentInfo.amount_due - paymentInfo.amount_paid) > 0 ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    ${(paymentInfo.amount_due - paymentInfo.amount_paid).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm text-[#6F6F6F]">
                {paymentInfo.due_date && (
                  <div>
                    <span className="font-medium">Due Date:</span> {new Date(paymentInfo.due_date).toLocaleDateString()}
                  </div>
                )}
                {paymentInfo.payment_method && (
                  <div>
                    <span className="font-medium">Payment Method:</span> {formatPaymentMethod(paymentInfo.payment_method)}
                  </div>
                )}
              </div>

              {/* Payment History */}
              {paymentHistory.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium text-[#6F6F6F] flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Payment History
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Date</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                          <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paymentHistory.map((entry) => (
                          <tr key={entry.id}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {editingNoteId === entry.id ? (
                                <Input
                                  type="date"
                                  value={editingPayment.date}
                                  onChange={(e) => {
                                    const newDate = e.target.value;
                                    setEditingPayment({...editingPayment, date: newDate});
                                  }}
                                  className="w-full"
                                />
                              ) : (
                                new Date(entry.date).toLocaleDateString()
                              )}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              {editingNoteId === entry.id ? (
                                <Input
                                  type="number"
                                  step="any"
                                  min="0.01"
                                  value={editingPayment.amount}
                                  onChange={(e) => setEditingPayment({...editingPayment, amount: e.target.value})}
                                  className="w-full"
                                />
                              ) : (
                                entry.amount > 0 ? `$${entry.amount.toFixed(2)}` : '-'
                              )}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {editingNoteId === entry.id ? (
                                <select
                                  value={editingPayment.payment_method || 'e_transfer'}
                                  onChange={(e) => setEditingPayment({...editingPayment, payment_method: e.target.value || null})}
                                  className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
                                >
                                  <option value="e_transfer">E-Transfer</option>
                                  <option value="stripe">Online</option>
                                  <option value="cash">Cash</option>
                                </select>
                              ) : (
                                formatPaymentMethod(entry.payment_method)
                              )}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-500 max-w-xs">
                              {editingNoteId === entry.id ? (
                                <textarea
                                  value={editingPayment.notes}
                                  onChange={(e) => setEditingPayment({...editingPayment, notes: e.target.value || ''})}
                                  className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
                                  rows={2}
                                />
                              ) : (
                                <span className="truncate block">{entry.notes}</span>
                              )}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                              {editingNoteId === entry.id ? (
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    onClick={handleSavePaymentEdit}
                                    className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-lg px-3 py-1 text-xs flex items-center gap-1"
                                  >
                                    <Save className="h-3 w-3" />
                                    Save
                                  </Button>
                                  <Button
                                    onClick={handleCancelEdit}
                                    className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-3 py-1 text-xs flex items-center gap-1"
                                  >
                                    <X className="h-3 w-3" />
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleEditPayment(entry)}
                                    className="bg-transparent hover:bg-blue-50 text-blue-500 hover:text-blue-600 rounded-lg p-1 h-7 w-7 flex items-center justify-center transition-colors"
                                    title="Edit Payment"
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    onClick={() => confirmDeletePayment(entry)}
                                    className="bg-transparent hover:bg-red-50 text-red-500 hover:text-red-600 rounded-lg p-1 h-7 w-7 flex items-center justify-center transition-colors"
                                    title="Delete Payment"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Process Payment Section */}
              {(paymentInfo.amount_due - paymentInfo.amount_paid) > 0 && (
                <div className="border-t pt-6">
                  <h4 className="text-lg font-bold text-[#6F6F6F] mb-4">Process Payment</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-2">
                        Deposit Amount ($)
                      </label>
                      <Input
                        type="number"
                        step="any"
                        min="0.01"
                        max={paymentInfo.amount_due - paymentInfo.amount_paid}
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full"
                      />
                      <div className="text-xs text-[#6F6F6F] mt-1">
                        Maximum: ${(paymentInfo.amount_due - paymentInfo.amount_paid).toFixed(2)}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-2">
                        Payment Method
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
                      >
                        <option value="e_transfer">E-Transfer</option>
                        <option value="stripe">Online</option>
                        <option value="cash">Cash</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-[#6F6F6F] mb-2">
                      Payment Notes (Optional)
                    </label>
                    <textarea
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                      placeholder="Add any notes about this payment..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
                    />
                  </div>

                  <div className="mt-6 flex gap-4">
                    <Button
                      onClick={handleProcessPayment}
                      disabled={processingPayment || !depositAmount || parseFloat(depositAmount) <= 0}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-[10px] px-6 py-2 flex items-center gap-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      {processingPayment ? 'Processing...' : 'Process Payment'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Fully Paid Message */}
              {(paymentInfo.amount_due - paymentInfo.amount_paid) <= 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-green-800 font-medium">Payment completed in full</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Team Members */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#6F6F6F] flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members ({teamMembers.length})
              </h3>
            </div>

            <div className="space-y-3">
              {teamMembers.length === 0 ? (
                <div className="text-center py-8 text-[#6F6F6F]">
                  <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No team members found</p>
                </div>
              ) : (
                teamMembers.map((member) => (
                  <div 
                    key={member.id} 
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {/* Member Avatar */}
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-[#6F6F6F] font-medium">
                          {(member.name || member.email || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      
                      {/* Member Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#6F6F6F]">
                            {member.name || 'No Name'}
                          </span>
                          {member.id === team.captain_id && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              <Crown className="h-3 w-3" />
                              Captain
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-[#6F6F6F]">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {member.id !== team.captain_id && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                          title="Remove from team"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal />
    </div>
  );
}