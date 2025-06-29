import { useState } from 'react';
import { Button } from './ui/button';
import { createCheckoutSession, getUserSubscription } from '../lib/stripe';
import { useToast } from './ui/toast';
import { CreditCard, Loader2 } from 'lucide-react';
import { getProductByPriceId, formatPrice } from '../stripe-config';

interface PaymentButtonProps {
  priceId: string;
  productName: string;
  mode: 'payment' | 'subscription';
  metadata?: Record<string, string>;
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'outline' | 'secondary';
  price?: number;
  icon?: React.ReactNode;
}

export function PaymentButton({ 
  priceId, 
  productName, 
  mode, 
  metadata = {},
  className,
  children,
  price,
  variant = 'default',
  icon = <CreditCard className="h-4 w-4 mr-2" />
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handlePayment = async () => {
    const product = getProductByPriceId(priceId);
    try {
      setLoading(true);
      
      const { url } = await createCheckoutSession({
        priceId,
        mode,
        metadata,
        successUrl: `${window.location.origin}/success?product=${encodeURIComponent(productName)}&price=${price || (product?.price || 0)}`,
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
          {mode === 'subscription' ? 'Subscribe' : 'Purchase'} {productName} {price ? `- ${formatPrice(price)}` : ''}
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