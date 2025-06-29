import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/toast';
import { supabase } from '../../../lib/supabase';
import { fetchSkills } from '../../../lib/leagues';
import { ChevronLeft, Save, X, Users, Crown, Mail, Trash2, DollarSign, AlertCircle, Edit2, History } from 'lucide-react';

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
  payment_method: 'cash' | 'e_transfer' | 'online' | null;
  notes: string | null;
}

interface PaymentHistory {
  id: number;
  amount: number;
  payment_method: 'cash' | 'e_transfer' | 'online' | null;
  date: string; 
  notes: string | null;
}

export function TeamEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  
  const [team, setTeam] = useState<any>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'e_transfer' | 'online'>('e_transfer');
  const [paymentNotes, setPaymentNotes] = useState<string>('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [editingPayment, setEditingPayment] = useState<{
    id: number | null;
    amount: string;
    payment_method: 'cash' | 'e_transfer' | 'online' | null;
    date: string;
    notes: string;
  }>({
    id: null,
    amount: '',
    payment_method: null,
    date: '',
    notes: ''
  });
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [editTeam, setEditTeam] = useState<{
    name: string;
    skill_level_id: number | null;
  }>({
    name: '',
    skill_level_id: null
  });

  useEffect(() => {
    if (!userProfile?.is_admin) {
      navigate('/my-account/profile');
      return;
    }
    
    if (id) {
      loadData();
    }
  }, [id, userProfile]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [skillsData] = await Promise.all([
        fetchSkills()
      ]);
      
      setSkills(skillsData);

      // Load specific team
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
      } else {
        setTeam(teamData);
        
        setEditTeam({
          name: teamData.name,
          skill_level_id: teamData.skill_level_id
        });

        // Load team members
        if (teamData.roster && teamData.roster.length > 0) {
          const { data: membersData, error: membersError } = await supabase
            .from('users')
            .select('id, name, email')
            .in('id', teamData.roster);

          if (membersError) {
            console.error('Error loading team members:', membersError);
          } else {
            setTeamMembers(membersData || []);
          }
        }
      }
        // Load payment information
        const { data: paymentData, error: paymentError } = await supabase
          .from('league_payments')
          .select('*')
          .eq('team_id', teamData.id)
          .eq('league_id', teamData.league_id)
          .maybeSingle();

        if (paymentError) {
          console.error('Error loading payment information:', paymentError);
        } else if (paymentData) {
          // Set payment info
          setPaymentInfo(paymentData);
          
          // Parse payment history from notes
          if (paymentData.notes) {
            const mockHistory: PaymentHistory[] = [];
            
            const notesLines = paymentData.notes.split('\n').filter(line => line.trim() !== '');
            
            notesLines.forEach((note, index) => {              
              // Try to extract payment information from the note
              let amount = 0;
              let method: 'stripe' | 'cash' | 'e_transfer' | 'waived' | null = null;
              let date = new Date().toISOString();
              
              // Look for dollar amount pattern like $200
              const amountMatch = note.match(/\$(\d+(\.\d+)?)/);
              if (amountMatch) {
                amount = parseFloat(amountMatch[1]);
              }
              
              // Look for payment method
              if (note.toLowerCase().includes('e-transfer') || note.toLowerCase().includes('etransfer')) {
                method = 'e_transfer';
              } else if (note.toLowerCase().includes('cash')) {
                method = 'cash';
              } else if (note.toLowerCase().includes('online')) {
                method = 'online';
              }
              
              // Look for date pattern like 6-28 or 06/28
              const dateMatch = note.match(/(\d{1,2})[-\/](\d{1,2})/);
              if (dateMatch) {
                const month = parseInt(dateMatch[1]) - 1; // JS months are 0-indexed
                const day = parseInt(dateMatch[2]);
                const year = new Date().getFullYear();
                date = new Date(year, month, day).toISOString();
              }
              
              mockHistory.push({
                id: index + 1,
                amount,
                payment_method: method,
                date,
                notes: note.trim()
              });
            });
            
            setPaymentHistory(mockHistory);
          }
        }
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Failed to load team data', 'error');
    } finally {
      setLoading(false);
    }
  };

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

    // Prepare the updated notes
    let updatedNotes = paymentInfo.notes || '';
    
    // If we're editing an existing note
    if (editingNoteId !== null && paymentHistory.length > 0) {
      const historyEntry = paymentHistory.find(h => h.id === editingNoteId);
      if (historyEntry) {
        // Split notes into lines
        const notesLines = updatedNotes.split('\n');
        
        // Find the line index that matches the history entry
        const lineIndex = notesLines.findIndex(line => 
          line.trim() === historyEntry.notes?.trim()
        );
        
        // Replace that line with the new note
        if (lineIndex !== -1) {
          notesLines[lineIndex] = paymentNotes.trim();
          updatedNotes = notesLines.join('\n');
        }
      }
    } else {
      // Add new note
      if (paymentNotes.trim()) {
        updatedNotes = updatedNotes 
          ? `${updatedNotes}\n${paymentNotes.trim()}`
          : paymentNotes.trim();
      }
    }

    try {
      setProcessingPayment(true);

      const { error } = await supabase
        .from('league_payments')
        .update({
          amount_paid: newAmountPaid,
          payment_method: paymentMethod,
          notes: updatedNotes || null
        })
        .eq('id', paymentInfo.id);

      if (error) throw error;

      showToast(`Payment of $${depositValue.toFixed(2)} processed successfully!`, 'success');
      
      // Reload payment data
      await loadData();
      
      // Reset form
      setDepositAmount('');
      setPaymentNotes('');
      setEditingNoteId(null);
      setPaymentMethod('cash');

    } catch (error) {
      console.error('Error processing payment:', error);
      showToast('Failed to process payment', 'error');
    } finally {
      setProcessingPayment(false);
    }
  };
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

  const handleEditPayment = (entry: PaymentHistory) => {
    setEditingNoteId(entry.id);
    setEditingPayment({
      id: entry.id,
      amount: entry.amount.toString(),
      payment_method: entry.payment_method,
      date: entry.date.split('T')[0], // Format date for input
      notes: entry.notes || ''
    });
  };

  const handleSavePaymentEdit = async () => {
    if (!paymentInfo || editingNoteId === null) return;
    
    try {
      setProcessingPayment(true);
      
      // Find the original entry
      const originalEntry = paymentHistory.find(h => h.id === editingNoteId);
      if (!originalEntry) return;
      
      // Create updated entry
      const updatedEntry = {
        ...originalEntry,
        amount: parseFloat(editingPayment.amount) || 0,
        payment_method: editingPayment.payment_method,
        date: new Date(editingPayment.date).toISOString(),
        notes: editingPayment.notes
      };
      
      // Update the payment history array
      const updatedHistory = paymentHistory.map(entry => 
        entry.id === editingNoteId ? updatedEntry : entry
      );
      
      // Convert updated history to notes format
      const updatedNotes = updatedHistory.map(entry => entry.notes).join('\n');
      
      // Update in database
      const { error } = await supabase
        .from('league_payments')
        .update({
          notes: updatedNotes
        })
        .eq('id', paymentInfo.id);

      if (error) throw error;

      showToast('Payment record updated successfully!', 'success');
      
      // Reload payment data
      await loadData();
      
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
            Back to League Teams
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
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        {paymentInfo && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#6F6F6F] flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
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
                    <span className="font-medium">Payment Method:</span> {paymentInfo.payment_method.replace('_', ' ').toUpperCase()}
                  </div>
                )}
              </div>

              {paymentInfo.notes && (
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
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                          <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                    {paymentHistory.map((entry) => (
                      <tr key={entry.id}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {editingNoteId === entry.id ? (
                            <div className="relative">
                              <Input
                                type="date"
                                value={editingPayment.date}
                                onChange={(e) => setEditingPayment({...editingPayment, date: e.target.value})}
                                className="w-full"
                              />
                            </div>
                          ) : (
                            new Date(entry.date).toLocaleDateString()
                          )}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {editingNoteId === entry.id ? (
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
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
                              value={editingPayment.payment_method || ''}
                              onChange={(e) => setEditingPayment({...editingPayment, payment_method: e.target.value as any})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
                            >
                              <option value="e_transfer">E-Transfer</option>
                              <option value="online">Online</option>
                              <option value="cash">Cash</option>
                            </select>
                          ) : (
                            entry.payment_method ? entry.payment_method.replace('_', ' ').toUpperCase() : '-'
                          )}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-500 max-w-xs">
                          {editingNoteId === entry.id ? (
                            <textarea
                              value={editingPayment.notes}
                              onChange={(e) => setEditingPayment({...editingPayment, notes: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
                              rows={2}
                            />
                          ) : (
                            <span className="truncate block">{entry.notes}</span>
                          )}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
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
                            <Button
                              onClick={() => handleEditPayment(entry)}
                              className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-lg px-3 py-1 text-xs flex items-center gap-1 ml-auto"
                            >
                              <Edit2 className="h-3 w-3" />
                              Edit
                            </Button>
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
                        step="0.01"
                        min="0"
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
                        onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'e_transfer' | 'online')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
                      >
                        <option value="e_transfer">E-Transfer</option>
                        <option value="online">Online</option>
                        <option value="cash">Cash</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-[#6F6F6F] mb-2">
                      {editingNoteId === null ? 'Payment Notes (Optional)' : 'Edit Payment Note'}
                    </label>
                    {editingNoteId === null && (
                      <textarea
                        id="payment-notes-textarea"
                        value={paymentNotes}
                        onChange={(e) => setPaymentNotes(e.target.value)}
                        placeholder="Add any notes about this payment..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
                      />
                    )}
                  </div>

                  <div className="mt-6 flex gap-4">
                    <Button
                      onClick={handleProcessPayment}
                      disabled={processingPayment || (!editingNoteId && (!depositAmount || parseFloat(depositAmount) <= 0))}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-[10px] px-6 py-2 flex items-center gap-2"
                    >
                      {editingNoteId !== null ? (
                        null
                      ) : (
                        <>
                          <DollarSign className="h-4 w-4" />
                          {processingPayment ? 'Processing...' : 'Process Payment'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Fully Paid Message */}
              {(paymentInfo.amount_due - paymentInfo.amount_paid) === 0 && (
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
    </div>
  );
}