import { useMemo } from 'react';
import { FilterState } from './useLeagueFilters';

export interface League {
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
}

// League data - updated with regions instead of specific locations
const leagueData: League[] = [
  {
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
    image: "/womens-elite-card.jpg"
  },
  {
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
    image: "/571North-CR3_0335-Indoor-VB-Header-Featured.jpg"
  },
  {
    id: 3,
    name: "Advanced Badminton",
    sport: "Badminton",
    format: "Singles",
    day: "Wednesday",
    playTimes: ["6:30 PM - 9:30 PM"],
    location: "East End",
    specificLocation: "Rideau High School",
    dates: "May 3 - August 17, 2025",
    skillLevel: "Advanced",
    price: 180,
    spotsRemaining: 0,
    isFeatured: true,
    image: "/badminton-card.png"
  },
  {
    id: 4,
    name: "Coed Competitive Volleyball",
    sport: "Volleyball",
    format: "4s",
    day: "Thursday",
    playTimes: ["7:00 PM - 9:00 PM", "9:00 PM - 11:00 PM"],
    location: "Central",
    specificLocation: "Glebe Collegiate",
    dates: "May 4 - August 18, 2025",
    skillLevel: "Competitive",
    price: 220,
    spotsRemaining: 4,
    isFeatured: true,
    image: "/571North-CR3_0335-Indoor-VB-Header-Featured.jpg"
  },
  {
    id: 5,
    name: "Intermediate Pickleball",
    sport: "Pickleball",
    format: "Doubles",
    day: "Friday",
    playTimes: ["6:00 PM - 9:00 PM"],
    location: "Central",
    specificLocation: "Carleton University",
    dates: "May 5 - August 19, 2025",
    skillLevel: "Intermediate",
    price: 150,
    spotsRemaining: 12,
    image: "/pickleball-card.jpg"
  },
  {
    id: 6,
    name: "Mens Advanced Volleyball",
    sport: "Volleyball",
    format: "6s",
    day: "Saturday",
    playTimes: ["10:00 AM - 1:00 PM", "2:00 PM - 5:00 PM"],
    location: "West End",
    specificLocation: "Nepean Sportsplex",
    dates: "May 6 - August 20, 2025",
    skillLevel: "Advanced",
    price: 230,
    spotsRemaining: 6,
    image: "/indoor-coed.jpg"
  },
  {
    id: 7,
    name: "Competitive Basketball",
    sport: "Basketball",
    format: "5s",
    day: "Sunday",
    playTimes: ["12:00 PM - 3:00 PM"],
    location: "East End",
    specificLocation: "Orleans Recreation Complex",
    dates: "May 7 - August 21, 2025",
    skillLevel: "Competitive",
    price: 190,
    spotsRemaining: 3,
    isFeatured: true,
    image: "/indoor-coed.jpg"
  },
  {
    id: 8,
    name: "Coed Intermediate Badminton",
    sport: "Badminton",
    format: "Doubles",
    day: "Monday",
    playTimes: ["7:30 PM - 10:30 PM"],
    location: "Central",
    specificLocation: "Glebe Collegiate",
    dates: "May 8 - August 22, 2025",
    skillLevel: "Intermediate",
    price: 175,
    spotsRemaining: 8,
    image: "/badminton-card.png"
  },
  {
    id: 9,
    name: "Elite Coed Volleyball",
    sport: "Volleyball",
    format: "4s",
    day: "Tuesday & Thursday",
    playTimes: ["7:00 PM - 10:00 PM", "8:00 PM - 11:00 PM"],
    location: "West End",
    specificLocation: "Kanata Recreation Complex",
    dates: "May 9 - August 23, 2025",
    skillLevel: "Elite",
    price: 275,
    spotsRemaining: 1,
    isFeatured: true,
    image: "/571North-CR3_0335-Indoor-VB-Header-Featured.jpg"
  }
];

export function useLeaguesData(filters: FilterState) {
  const filteredLeagues = useMemo(() => {
    return leagueData.filter(league => {
      return (
        (filters.sport === "All Sports" || league.sport === filters.sport) &&
        (filters.format === "All Formats" || league.format === filters.format) &&
        (filters.location === "All Locations" || league.location === filters.location) &&
        (filters.skillLevel === "All Skill Levels" || league.skillLevel === filters.skillLevel) &&
        (filters.day === "All Days" || league.day.includes(filters.day))
      );
    });
  }, [filters]);

  return { leagues: filteredLeagues };
}