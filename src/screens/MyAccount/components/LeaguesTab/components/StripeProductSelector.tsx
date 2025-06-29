import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { Button } from '../../../../../components/ui/button';
import { RefreshCw } from 'lucide-react';

interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price?: number;
  currency?: string;
  interval?: string | null;
  leagueId?: number | null;
}

interface StripeProductSelectorProps {
  selectedProductId: string | null;
  onChange: (productId: string | null) => void;
  className?: string;
}

export function StripeProductSelector({ 
  selectedProductId, 
  onChange,
  className = ''
}: StripeProductSelectorProps) {
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stripe_products')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error loading Stripe products:', error);
        return;
      }

      setAvailableProducts(data || []);
    } catch (error) {
      console.error('Error in loadProducts:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncProducts = async () => {
    try {
      setSyncing(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('User not authenticated');
      }

      // Call the Stripe products sync edge function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-products-sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to sync products');
      }

      const result = await response.json();
      console.log('Products synced:', result);
      
      // Reload products after sync
      await loadProducts();
      
    } catch (error: any) {
      console.error('Error syncing products:', error);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-[#6F6F6F]">
          Stripe Product
        </label>
        <Button
          onClick={syncProducts}
          disabled={syncing}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-2 py-1 h-7 flex items-center gap-1"
        >
          <RefreshCw className={`h-3 w-3 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Products'}
        </Button>
      </div>
      <select
        value={selectedProductId || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
        disabled={loading || syncing}
      >
        <option value="">No Stripe product linked</option>
        {loading ? (
          <option value="" disabled>Loading products...</option>
        ) : availableProducts.length === 0 ? (
          <option value="" disabled>No products available</option>
        ) : availableProducts.map(product => (
          <option key={product.id} value={product.id}>
            {product.name} - {product.mode === 'payment' ? 'One-time' : 'Subscription'} - ${product.price?.toFixed(2) || '0.00'} 
            {product.leagueId ? ' (Linked)' : ''}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500 mt-1 flex justify-between">
        <span>Link this league to a Stripe product for online payments</span>
        <span>{availableProducts.length} products available</span>
      </p>
    </div>
  );
}