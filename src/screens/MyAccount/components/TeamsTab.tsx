import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/ui/button';
import { Clock, DollarSign, Trash2, User, MapPin } from 'lucide-react';

interface LeaguePayment {
  id: number;
  league_name: string;
  team_name: string;
  amount_due: number;
  amount_paid: number;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  due_date: string;
  payment_method: string | null;
}

interface Team {
  id: number;
  name: string;
  league?: {
    name: string;
    location?: string;
  };
  captain_id: string;
  roster: string[];
  active: boolean;
}

export function TeamsTab() {
  const { user } = useAuth();
  const [leaguePayments, setLeaguePayments] = useState<LeaguePayment[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [unregisteringPayment, setUnregisteringPayment] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      fetchLeaguePayments();
      fetchTeams();
    }
  }, [user]);

  const fetchLeaguePayments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_payment_summary')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setLeaguePayments(data || []);
    } catch (error) {
      console.error('Error fetching league payments:', error);
    }
  };

  const fetchTeams = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          league:leagues(name, location)
        `)
        .contains('roster', [user.id]);

      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async (paymentId: number, leagueName: string) => {
    if (!confirm(`Are you sure you want to delete your registration for ${leagueName}?`)) {
      return;
    }

    setUnregisteringPayment(paymentId);
    try {
      const { error } = await supabase
        .from('league_payments')
        .delete()
        .eq('id', paymentId);

      if (error) throw error;

      setLeaguePayments(prev => prev.filter(p => p.id !== paymentId));
    } catch (error) {
      console.error('Error unregistering:', error);
      alert('Failed to delete registration. Please try again.');
    } finally {
      setUnregisteringPayment(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* League Payments Section */}
      {leaguePayments.length > 0 && (
        <div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800">League Registrations</h3>
                <p className="text-sm text-blue-700 mt-1">
                  You have {leaguePayments.length} active league registration{leaguePayments.length !== 1 ? 's' : ''}. 
                  You can delete registrations here if needed.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {leaguePayments.map(payment => (
              <div key={payment.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-[#6F6F6F]">{payment.league_name}</h4>
                    <div className="flex items-center gap-4 text-sm text-[#6F6F6F] mt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Due: {new Date(payment.due_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${payment.amount_paid.toFixed(2)} / ${payment.amount_due.toFixed(2)}</span>
                      </div>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                        payment.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                        payment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleUnregister(payment.id, payment.league_name)}
                    disabled={unregisteringPayment === payment.id}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-sm transition-colors flex items-center gap-1"
                  >
                    {unregisteringPayment === payment.id ? (
                      'Removing...'
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Delete Registration
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teams Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-[#6F6F6F] mb-4">My Teams</h3>
        {teams.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>You are not currently on any teams.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {teams.map(team => (
              <div key={team.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-[#6F6F6F]">{team.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{team.league?.name}</p>
                    
                    <div className="mt-3 space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>Location</span>
                      </div>
                      <div className="text-xs text-gray-500 ml-6">
                        {team.league?.location || 'TBD'}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>Team Size: {team.roster.length} players</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      team.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {team.active ? 'Active' : 'Inactive'}
                    </span>
                    {team.captain_id === user?.id && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        Captain
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}