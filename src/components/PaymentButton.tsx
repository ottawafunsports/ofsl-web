import { useState } from 'react';
import { Button } from './ui/button';
import { createCheckoutSession } from '../lib/stripe';
import { useToast } from './ui/toast';
import { CreditCard, Loader2, DollarSign } from 'lucide-react';

interface PaymentButtonProps {
  priceId: string;
  productName: string;
  mode: 'payment' | 'subscription';
  metadata?: Record<string, string>;
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'outline' | 'secondary';
  icon?: React.ReactNode;
}

export function PaymentButton({ 
  priceId, 
  productName, 
  mode, 
  metadata = {},
  className,
  children,
  variant = 'default',
  icon = <CreditCard className="h-4 w-4 mr-2" />
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      const { url } = await createCheckoutSession({
        priceId,
        mode,
        metadata,
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
      variant={variant}
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
            {icon}
            {mode === 'subscription' ? 'Subscribe' : 'Purchase'} - {productName}
          </>
        )
      )}
    </Button>
  );
}