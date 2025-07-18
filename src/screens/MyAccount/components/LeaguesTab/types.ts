import { League } from '../../../../lib/leagues';

export interface Sport {
  id: number;
  name: string;
}

export interface Skill {
  id: number;
  name: string;
}

export interface Gym {
  id: number;
  gym: string | null;
  address: string | null;
  instructions: string | null;
}

export interface LeagueWithTeamCount extends League {
  team_count: number;
  spots_remaining: number;
}

export interface NewLeague {
  name: string;
  description: string;
  sport_id: number | null;
  skill_ids: number[];
  day_of_week: number | null;
  year: string;
  start_date: string;
  end_date: string;
  cost: number | null;
  max_teams: number;
  gym_ids: number[];
}