import React, { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useToast } from "../../components/ui/toast";
import { LeagueHeader } from "./components/LeagueHeader";
import { LeagueInfo } from "./components/LeagueInfo";
import { SkillRequirements } from "./components/SkillRequirements";
import { RegistrationForm } from "./components/RegistrationForm";
import { RelatedLeagues } from "./components/RelatedLeagues";

// League data - same as in LeaguesPage
const leagueData = [
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

export const LeagueDetailPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  // Find the league by ID
  const league = leagueData.find(l => l.id === parseInt(id || '0'));

  // If league not found, redirect to leagues page
  if (!league) {
    return <Navigate to="/leagues" replace />;
  }

  const handleRegisterClick = () => {
    setIsRegistrationOpen(true);
  };

  const handleRegistrationSubmit = (formData: any) => {
    // Here you would typically send the registration data to your backend
    console.log('Registration submitted:', formData);
    
    // Show success message
    showToast('Registration submitted successfully! We will contact you soon.', 'success');
    
    // Close the form
    setIsRegistrationOpen(false);
  };

  return (
    <div className="bg-white w-full">
      <LeagueHeader league={league} onRegisterClick={handleRegisterClick} />
      
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <LeagueInfo league={league} />
        <SkillRequirements skillLevel={league.skillLevel} />
        <RelatedLeagues currentLeague={league} allLeagues={leagueData} />
      </div>

      <RegistrationForm
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        leagueName={league.name}
        sport={league.sport}
        onSubmit={handleRegistrationSubmit}
      />
    </div>
  );
};