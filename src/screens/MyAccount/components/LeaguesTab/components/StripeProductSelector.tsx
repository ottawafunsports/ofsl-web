import { useState, useEffect } from 'react';
import { products, Product } from '../../../../../stripe-config';

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
  
  useEffect(() => {
    // Filter out products that are already linked to leagues
    setAvailableProducts(products);
  }, []);

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-[#6F6F6F] mb-2">
        Stripe Product
      </label>
      <select
        value={selectedProductId || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
      >
        <option value="">No Stripe product linked</option>
        {availableProducts.map(product => (
          <option key={product.id} value={product.id}>
            {product.name} - {product.mode === 'payment' ? 'One-time' : 'Subscription'} - ${product.price?.toFixed(2) || '0.00'}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500 mt-1">
        Link this league to a Stripe product for online payments
      </p>
    </div>
  );
}