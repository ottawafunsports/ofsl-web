export interface Product {
  id: string;
  priceId: string;
  name: string; 
  description: string;
  mode: 'payment' | 'subscription';
  leagueId?: number;
}

export const products: Product[] = [
  {
    id: 'prod_SZm7NnPQbIVmIw',
    priceId: 'price_1RecYrRpSsHF3w12qq55ovZT',
    name: 'Tuesday Women\'s Elite',
    description: 'Registration fee for Tuesday Women\'s Elite',
    mode: 'payment',
    leagueId: 1
  },
  {
    id: 'prod_SZm8NnPQbIVmIx',
    priceId: 'price_1RecYsRpSsHF3w12qq55ovZU',
    name: 'Indoor Coed Intermediate 6s',
    description: 'Registration fee for Indoor Coed Intermediate 6s',
    mode: 'payment',
    leagueId: 2
  },
  {
    id: 'prod_SZm9NnPQbIVmIy',
    priceId: 'price_1RecYtRpSsHF3w12qq55ovZV',
    name: 'Indoor Coed Advanced 6s',
    description: 'Registration fee for Indoor Coed Advanced 6s',
    mode: 'payment',
    leagueId: 3
  },
  {
    id: 'prod_SZmANnPQbIVmIz',
    priceId: 'price_1RecYuRpSsHF3w12qq55ovZW',
    name: 'Indoor Womens Int/Adv 6s',
    description: 'Registration fee for Indoor Womens Int/Adv 6s',
    mode: 'payment',
    leagueId: 4
  },
  {
    id: 'prod_SZmBNnPQbIVmJA',
    priceId: 'price_1RecYvRpSsHF3w12qq55ovZX',
    name: 'Indoor Mens Int/Adv 6s',
    description: 'Registration fee for Indoor Mens Int/Adv 6s',
    mode: 'payment',
    leagueId: 5
  },
  {
    id: 'prod_SZmCNnPQbIVmJB',
    priceId: 'price_1RecYwRpSsHF3w12qq55ovZY',
    name: 'Indoor Coed Int/Adv 4s',
    description: 'Registration fee for Indoor Coed Int/Adv 4s',
    mode: 'payment',
    leagueId: 6
  },
  {
    id: 'prod_SZmDNnPQbIVmJC',
    priceId: 'price_1RecYxRpSsHF3w12qq55ovZZ',
    name: 'Advanced Singles Badminton',
    description: 'Registration fee for Advanced Singles Badminton',
    mode: 'payment',
    leagueId: 7
  },
  {
    id: 'prod_SZmENnPQbIVmJD',
    priceId: 'price_1RecYyRpSsHF3w12qq55ovZa',
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