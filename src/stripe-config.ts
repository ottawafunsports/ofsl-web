export interface Product {
  id: string;
  priceId: string;
  name: string; 
  description: string;
  mode: 'payment' | 'subscription';
  price?: number;
  leagueId?: number;
}

export const products: Product[] = [
  {
    id: 'prod_SZm7NnPQbIVmIw',
    priceId: 'price_1RecYrRpSsHF3w12qq55ovZT',
    name: 'Tuesday Women\'s Elite',
    description: 'Registration fee for Tuesday Women\'s Elite',
    mode: 'payment',
    price: 1250.00,
    leagueId: 1
  },
  {
    id: 'prod_SaNrKyXySpWCrl',
    priceId: 'price_1RfD64RpSsHF3w12e3iwiUs4',
    name: 'Thursday Coed Volleyball',
    description: 'Test pricing for Thursday coed vball',
    mode: 'payment',
    price: 650.00,
    leagueId: 2
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): Product | undefined => {
  return products.find(product => product.priceId === priceId);
};

export const getProductByLeagueId = (leagueId: number): Product | undefined => {
  return products.find(product => product.leagueId === leagueId);
};

export const formatPrice = (price: number | undefined): string => {
  if (!price) return '$0.00';
  return `$${price.toFixed(2)}`;
};