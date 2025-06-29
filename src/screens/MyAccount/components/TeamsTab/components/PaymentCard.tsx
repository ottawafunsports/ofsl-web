import { Button } from '../../../../../components/ui/button';
import { Clock, X } from 'lucide-react';
import { LeaguePayment } from '../../../../../lib/payments';

interface PaymentCardProps {
  payment: LeaguePayment;
  onUnregister: (paymentId: number, leagueName: string) => Promise<void>;
  unregisteringPayment: number | null;
}

export function PaymentCard({ payment, onUnregister, unregisteringPayment }: PaymentCardProps) {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-medium text-[#6F6F6F]">{payment.league_name}</h4>
          {payment.team_name && (
            <p className="text-sm text-[#6F6F6F]">Team: {payment.team_name}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm text-[#6F6F6F]">
            <span>Due: ${payment.amount_due.toFixed(2)}</span>
            <span>Paid: ${payment.amount_paid.toFixed(2)}</span>
            {payment.amount_outstanding > 0 && (
              <span className="text-orange-600 font-medium">
                Outstanding: ${payment.amount_outstanding.toFixed(2)}
              </span>
            )}
          </div>
          {payment.due_date && (
            <div className="flex items-center gap-1 mt-1 text-sm text-[#6F6F6F]">
              <Clock className="h-3 w-3" />
              <span>Due: {new Date(payment.due_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(payment.status)}`}>
            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
          </span>
          
          <Button
            onClick={() => onUnregister(payment.id, payment.league_name)}
            disabled={unregisteringPayment === payment.id}
            className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-lg px-4 py-2 text-sm transition-colors"
          >
            {unregisteringPayment === payment.id ? (
              'Unregistering...'
            ) : (
              <>
                <X className="h-4 w-4 mr-1" />
                Unregister
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}