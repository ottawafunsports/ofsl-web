import { useState } from 'react';
import { Button } from './ui/button';
import { X, CreditCard, DollarSign } from 'lucide-react';
import { createPaymentIntent } from '../lib/stripe';
import { useToast } from './ui/toast';
import { StripePaymentForm } from './StripePaymentForm';

interface PaymentModalProps {
  showModal: boolean;
  closeModal: () => void;
  paymentId: number;
  leagueName: string;
  teamName?: string | null;
  amountDue: number;
  amountPaid: number;
  onPaymentSuccess: () => void;
}

export function PaymentModal({
  showModal,
  closeModal,
  paymentId,
  leagueName,
  teamName,
  amountDue,
  amountPaid,
  onPaymentSuccess
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { showToast } = useToast();
  
  const amountOutstanding = amountDue - amountPaid;

  const handleInitiatePayment = async () => {
    try {
      setLoading(true);
      
      const { clientSecret: secret } = await createPaymentIntent(paymentId);
      setClientSecret(secret);
      
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      showToast(error.message || 'Failed to initiate payment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    onPaymentSuccess();
    setTimeout(() => {
      closeModal();
    }, 2000);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#6F6F6F]">Make Payment</h2>
            <button 
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700 bg-transparent hover:bg-gray-100 rounded-full p-2 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-[#6F6F6F]">
              <span className="font-medium">League:</span> {leagueName}
            </p>
            {teamName && (
              <p className="text-sm text-[#6F6F6F] mt-1">
                <span className="font-medium">Team:</span> {teamName}
              </p>
            )}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-xs text-[#6F6F6F]">Amount Due</p>
                <p className="text-lg font-bold text-[#6F6F6F]">${amountDue.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-[#6F6F6F]">Amount Paid</p>
                <p className="text-lg font-bold text-green-600">${amountPaid.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-[#6F6F6F]">Outstanding</p>
                <p className="text-lg font-bold text-[#B20000]">${amountOutstanding.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {clientSecret ? (
            <StripePaymentForm 
              clientSecret={clientSecret}
              amount={amountOutstanding}
              onSuccess={handlePaymentSuccess}
              onCancel={() => setClientSecret(null)}
            />
          ) : (
            <div className="space-y-6">
              <p className="text-[#6F6F6F]">
                You can pay your outstanding balance securely using credit or debit card.
              </p>
              
              <Button
                onClick={handleInitiatePayment}
                disabled={loading || amountOutstanding <= 0}
                className="w-full border-[#B20000] bg-white hover:bg-[#B20000] text-[#B20000] hover:text-white rounded-[10px] px-6 py-3 flex items-center justify-center gap-2"
                variant="outline"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Preparing Payment...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>Pay with Card</span>
                  </>
                )}
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-[#6F6F6F]">
                  For other payment methods, please contact us at{' '}
                  <a href="mailto:info@ofsl.ca" className="text-[#B20000] underline">
                    info@ofsl.ca
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}