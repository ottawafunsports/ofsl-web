export interface Product {
  priceId: string;
  name: string;
  description: string;
  mode: string;
  price?: number;
  currency?: string;
  interval?: string;
}

export const products: Product[] = [];
// Products are now loaded from the database

export function formatPrice(amount: number, currency: string = 'CAD'): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}