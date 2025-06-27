export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const products: Product[] = [
  {
    id: 'prod_SZm7NnPQbIVmIw',
    priceId: 'price_1RecYrRpSsHF3w12qq55ovZT',
    name: 'Tuesday Women\'s Elite',
    description: 'Registration fee for Tuesday Women\'s Elite',
    mode: 'payment'
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): Product | undefined => {
  return products.find(product => product.priceId === priceId);
};