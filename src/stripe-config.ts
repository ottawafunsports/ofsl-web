export interface Product {
  id: string;
  priceId: string;
  name: string; 
  description: string;
  mode: 'payment' | 'subscription';
  leagueId?: number;
}

// Replace these with your actual Stripe product and price IDs
export const products: Product[] = [
  // These are placeholder products - replace with your actual Stripe products
  {
    id: 'prod_placeholder1',
    priceId: 'price_placeholder1',
    name: 'Tuesday Women\'s Elite',
    description: 'Registration fee for Tuesday Women\'s Elite',
    mode: 'payment',
    leagueId: 1
  },
  {
    id: 'prod_placeholder2',
    priceId: 'price_placeholder2',
    name: 'Indoor Coed Intermediate 6s',
    description: 'Registration fee for Indoor Coed Intermediate 6s',
    mode: 'payment',
    leagueId: 2
  },
  {
    id: 'prod_placeholder3',
    priceId: 'price_placeholder3',
    name: 'Indoor Coed Advanced 6s',
    description: 'Registration fee for Indoor Coed Advanced 6s',
    mode: 'payment',
    leagueId: 3
  },
  {
    id: 'prod_placeholder4',
    priceId: 'price_placeholder4',
    name: 'Indoor Womens Int/Adv 6s',
    description: 'Registration fee for Indoor Womens Int/Adv 6s',
    mode: 'payment',
    leagueId: 4
  },
  {
    id: 'prod_placeholder5',
    priceId: 'price_placeholder5',
    name: 'Indoor Mens Int/Adv 6s',
    description: 'Registration fee for Indoor Mens Int/Adv 6s',
    mode: 'payment',
    leagueId: 5
  },
  {
    id: 'prod_placeholder6',
    priceId: 'price_placeholder6',
    name: 'Indoor Coed Int/Adv 4s',
    description: 'Registration fee for Indoor Coed Int/Adv 4s',
    mode: 'payment',
    leagueId: 6
  },
  {
    id: 'prod_placeholder7',
    priceId: 'price_placeholder7',
    name: 'Advanced Singles Badminton',
    description: 'Registration fee for Advanced Singles Badminton',
    mode: 'payment',
    leagueId: 7
  },
  {
    id: 'prod_placeholder8',
    priceId: 'price_placeholder8',
    name: 'Intermediate Doubles Badminton',
    description: 'Registration fee for Intermediate Doubles Badminton',
    mode: 'payment',
    leagueId: 8
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