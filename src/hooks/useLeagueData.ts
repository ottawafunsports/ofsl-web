import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export interface LeagueData {
  id: number;
  name: string;
  sport: string;
  format: string;
  day: string;
  playTimes: string[];
  location: string;
  specificLocation: string;
  dates: string;
  skillLevel: string;
  price: number;
  spotsRemaining: number;
  isFeatured?: boolean;
  image: string;
  description: string;
  features: string[];
  requirements: string[];
  schedule: Array<{
    week: number;
    date: string;
    time: string;
    location: string;
  }>;
}

// Mock data - in a real app, this would come from your API
const mockLeagueData: Record<number, LeagueData> = {
  1: {
    id: 1,
    name: "Elite Womens Volleyball",
    sport: "Volleyball",
    format: "6s",
    day: "Monday",
    playTimes: ["7:00 PM - 10:00 PM"],
    location: "Central",
    specificLocation: "Carleton University",
    dates: "May 1 - August 15, 2025",
    skillLevel: "Elite",
    price: 250,
    spotsRemaining: 2,
    isFeatured: true,
    image: "/womens-elite-card.jpg",
    description: "Our Elite Women's Volleyball league is designed for highly skilled players who want to compete at the highest level. This league features fast-paced, competitive gameplay with experienced players who have strong fundamental skills and advanced techniques.",
    features: [
      "Competitive elite-level play",
      "Professional-grade equipment provided",
      "Experienced referees for all matches",
      "Playoff tournament at season end",
      "Team and individual statistics tracking"
    ],
    requirements: [
      "Previous competitive volleyball experience required",
      "Strong fundamental skills in all positions",
      "Ability to commit to full season schedule",
      "Team registration (minimum 8 players)"
    ],
    schedule: [
      { week: 1, date: "May 5, 2025", time: "7:00 PM", location: "Carleton University Gym A" },
      { week: 2, date: "May 12, 2025", time: "7:00 PM", location: "Carleton University Gym A" },
      { week: 3, date: "May 19, 2025", time: "7:00 PM", location: "Carleton University Gym A" },
      { week: 4, date: "May 26, 2025", time: "7:00 PM", location: "Carleton University Gym A" }
    ]
  },
  2: {
    id: 2,
    name: "Coed Intermediate Volleyball",
    sport: "Volleyball",
    format: "6s",
    day: "Tuesday",
    playTimes: ["7:00 PM - 9:00 PM", "9:00 PM - 11:00 PM"],
    location: "Central",
    specificLocation: "University of Ottawa",
    dates: "May 2 - August 16, 2025",
    skillLevel: "Intermediate",
    price: 200,
    spotsRemaining: 8,
    image: "/571North-CR3_0335-Indoor-VB-Header-Featured.jpg",
    description: "Perfect for players looking to improve their skills in a fun, supportive environment. This coed league welcomes players of all genders and focuses on skill development while maintaining competitive play.",
    features: [
      "Coed teams with balanced gender requirements",
      "Skill development focus",
      "Friendly competitive atmosphere",
      "Multiple time slots available",
      "Season-end social event"
    ],
    requirements: [
      "Basic volleyball knowledge",
      "Commitment to regular attendance",
      "Positive attitude and sportsmanship",
      "Individual or team registration accepted"
    ],
    schedule: [
      { week: 1, date: "May 6, 2025", time: "7:00 PM", location: "University of Ottawa Gym 1" },
      { week: 2, date: "May 13, 2025", time: "7:00 PM", location: "University of Ottawa Gym 1" },
      { week: 3, date: "May 20, 2025", time: "7:00 PM", location: "University of Ottawa Gym 1" },
      { week: 4, date: "May 27, 2025", time: "7:00 PM", location: "University of Ottawa Gym 1" }
    ]
  }
};

export function useLeagueData() {
  const { id } = useParams<{ id: string }>();
  const [league, setLeague] = useState<LeagueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const leagueId = parseInt(id || '0');
        const leagueData = mockLeagueData[leagueId];
        
        if (!leagueData) {
          setError('League not found');
          return;
        }
        
        setLeague(leagueData);
      } catch (err) {
        setError('Failed to load league data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeague();
  }, [id]);

  return { league, loading, error };
}