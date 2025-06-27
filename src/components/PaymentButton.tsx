import { useState } from 'react';
import { Button } from './ui/button';
import { createCheckoutSession } from '../lib/stripe';
import { useToast } from './ui/toast';
import { CreditCard, Loader2 } from 'lucide-react';

interface PaymentButtonProps {
  priceId: string;
  productName: string;
  mode: 'payment' | 'subscription';
  className?: string;
  children?: React.ReactNode;
}

export function PaymentButton({ 
  priceId, 
  productName, 
  mode, 
  className,
  children 
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      const { url } = await createCheckoutSession({
        priceId,
        mode,
        successUrl: `${window.location.origin}/success?product=${encodeURIComponent(productName)}`,
        cancelUrl: window.location.href
      });

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error: any) {
      console.error('Payment error:', error);
      showToast(error.message || 'Failed to start payment process', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        children || (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            {mode === 'subscription' ? 'Subscribe' : 'Purchase'} - {productName}
          </>
        )
      )}
    </Button>
  );
}