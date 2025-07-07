import React from 'react';
import { Button } from '../../../../../components/ui/button';
import { DollarSign, Users, Trash2 } from 'lucide-react';

interface TeamActionsProps {
  team: {
    id: number;
    captain_id: string;
    payment?: {
      id: number;
      amount_due: number;
      amount_paid: number;
    };
  };
  isCaptain: boolean;
  onManageTeam: (team: any) => void;
  onPayNow?: (paymentId: number) => void;
  showDeleteTeamConfirmation: (team: any) => void;
  showLeaveTeamConfirmation: (team: any) => void;
  deletingTeam: number | null;
  unregisteringPayment: number | null;
}

export function TeamActions({
  team,
  isCaptain,
  onManageTeam,
  onPayNow,
  showDeleteTeamConfirmation,
  showLeaveTeamConfirmation,
  deletingTeam,
  unregisteringPayment
}: TeamActionsProps) {
  const handleManageTeam = () => {
    onManageTeam(team);
  };

  const handlePayNow = () => {
    if (onPayNow && team.payment) {
      onPayNow(team.payment.id);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleManageTeam}
        className="border border-[#B20000] bg-white hover:bg-[#B20000] hover:text-white text-[#B20000] rounded-lg px-3 py-1.5 text-sm transition-colors flex items-center gap-1 h-auto"
      >
        <Users className="h-3 w-3" />
        {isCaptain ? 'Manage' : 'View'}
      </Button>
      
      {/* Pay Now Button */}
      {team.payment && 
       team.payment.amount_due > team.payment.amount_paid && 
       isCaptain && onPayNow && (
        <Button
          onClick={handlePayNow}
          className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-3 py-1.5 text-sm transition-colors flex items-center gap-1 h-auto"
        >
          <DollarSign className="h-3 w-3" />
          Pay
        </Button>
      )}
      
      {/* Delete/Leave Team Button */}
      {isCaptain ? (
        <Button
          onClick={() => showDeleteTeamConfirmation(team)}
          disabled={deletingTeam === team.id}
          className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-1.5 text-sm transition-colors flex items-center gap-1 h-auto"
        >
          {deletingTeam === team.id ? (
            'Deleting...'
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
              Deregister
            </>
          )}
        </Button>
      ) : (
        team.payment && (
          <Button
            onClick={() => showLeaveTeamConfirmation(team)}
            disabled={unregisteringPayment === team.payment?.id}
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-1.5 text-sm transition-colors flex items-center gap-1 h-auto"
          >
            {unregisteringPayment === team.payment?.id ? (
              'Removing...'
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
                Leave
              </>
            )}
          </Button>
        )
      )}
    </div>
  );
}