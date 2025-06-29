import { useState, useEffect, useCallback } from 'react';
import { getStripeProducts, syncStripeProducts } from '../../../../../lib/stripe';
import { Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '../../../../../components/ui/toast';
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
  leagueId?: number;
}

export function StripeProductSelector({ 
  selectedProductId, 
  onChange,
  className = '',
  leagueId
}: StripeProductSelectorProps) {
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const products = await getStripeProducts();
      setAvailableProducts(products);
    } catch (error) {
      console.error('Error loading Stripe products:', error);
    } finally {
      setLoading(false);
    }

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
  
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);
  
  const handleSyncProducts = async () => {
    try {
      setSyncing(true);
      const result = await syncStripeProducts();
      showToast(result.message || 'Products synced successfully', 'success');
      await loadProducts();
    } catch (error: any) {
      console.error('Error syncing Stripe products:', error);
      showToast(error.message || 'Failed to sync products', 'error');
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
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-[#6F6F6F]">
          Stripe Product
        </label>
        <button
          onClick={handleSyncProducts}
          disabled={syncing}
          className="text-sm text-[#B20000] hover:text-[#8A0000] flex items-center gap-1"
        >
          {syncing ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="h-3 w-3" />
              Sync Products
            </>
          )}
        </button>
      </div>
      <div className="relative">
        {loading && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}
        <select
          value={selectedProductId || ''}
          onChange={(e) => onChange(e.target.value || null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
          disabled={loading || syncing}
        >
          <option value="">No Stripe product linked</option>
          {availableProducts.map(product => (
            <option 
              key={product.id} 
              value={product.id}
              disabled={product.league_id && product.league_id !== leagueId}
            >
              {product.name} - {product.mode === 'payment' ? 'One-time' : 'Subscription'} - ${product.price?.toFixed(2) || '0.00'}
              {product.league_id && product.league_id !== leagueId ? ' (Already linked)' : ''}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-between items-center mt-1">
        <p className="text-xs text-gray-500">
          Link this league to a Stripe product for online payments
        </p>
        {loading && <p className="text-xs text-gray-500">Loading products...</p>}
      </div>
    </div>
  );
}