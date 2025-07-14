export interface LeaguePayment {
  id: number;
  league_name: string;
  team_name: string;
  amount_due: number;
  amount_paid: number;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  due_date: string;
  payment_method: string | null;
}

export interface Team {
  id: number;
  name: string;
  league?: {
    name: string;
    location?: string;
  };
  captain_id: string;
  roster: string[];
  active: boolean;
}