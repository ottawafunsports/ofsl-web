import { AlertCircle } from 'lucide-react';

interface BalanceNoticeProps {
  outstandingBalance: number;
  paymentSummary: {
    pending_payments: number;
    overdue_payments: number;
  } | null;
}

export function BalanceNotice({ outstandingBalance, paymentSummary }: BalanceNoticeProps) {
  if (outstandingBalance <= 0) {
    return null;
  }

  return (
    <div className="bg-orange-100 border border-orange-300 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="h-5 w-5 text-orange-600" />
        <span className="font-medium text-orange-800">Payment Required</span>
      </div>
      <p className="text-orange-700 text-sm mb-3">
        You have an outstanding balance of <span className="font-medium">${outstandingBalance.toFixed(2)}</span> for league registration fees.
      </p>
      
      {/* Payment breakdown */}
      {paymentSummary && (
        <div className="text-orange-700 text-sm">
          <div className="flex gap-4">
            {paymentSummary.pending_payments > 0 && (
              <span>{paymentSummary.pending_payments} pending payment{paymentSummary.pending_payments !== 1 ? 's' : ''}</span>
            )}
            {paymentSummary.overdue_payments > 0 && (
              <span className="font-medium">{paymentSummary.overdue_payments} overdue payment{paymentSummary.overdue_payments !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      )}
      
      <p className="text-orange-700 text-sm mt-2">
        Please contact us at <a href="mailto:info@ofsl.ca" className="underline">info@ofsl.ca</a> to arrange payment.
      </p>
    </div>
  );
}