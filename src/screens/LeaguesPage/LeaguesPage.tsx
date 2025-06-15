import React, { useState, useEffect, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { ChevronDown, X, MapPin, Calendar, Clock, Users, DollarSign } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

// Filter options data - Updated to use regions for locations
const filterOptions = {
  sport: ["All Sports", "Volleyball", "Badminton", "Basketball", "Pickleball"],
  format: ["All Formats", "6s", "4s", "2s", "Singles", "Doubles", "5s"],
  location: ["All Locations", "Central", "West End", "East End"],
  skillLevel: ["All Skill Levels", "Elite", "Competitive", "Advanced", "Intermediate"],
  day: ["All Days", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
};

// League data - updated with regions instead of specific locations
const leagueData = [
  {
    id: 1,
    name: "Elite Womens Volleyball",
    sport: "Volleyball",
    format: "6s",
    day: "Monday",
    playTimes: ["7:00 PM - 10:00 PM"],
    location: "Central", // Updated to region
    specificLocation: "Carleton University", // Kept for reference
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
    location: "Central", // Updated to region
    specificLocation: "University of Ottawa", // Kept for reference
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
    location: "East End", // Updated to region
    specificLocation: "Rideau High School", // Kept for reference
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
    location: "Central", // Updated to region
    specificLocation: "Glebe Collegiate", // Kept for reference
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
    location: "Central", // Updated to region
    specificLocation: "Carleton University", // Kept for reference
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
    location: "West End", // Updated to region
    specificLocation: "Nepean Sportsplex", // Kept for reference
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
    location: "East End", // Updated to region
    specificLocation: "Orleans Recreation Complex", // Kept for reference
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
    location: "Central", // Updated to region
    specificLocation: "Glebe Collegiate", // Kept for reference
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
    location: "West End", // Updated to region
    specificLocation: "Kanata Recreation Complex", // Kept for reference
    dates: "May 9 - August 23, 2025",
    skillLevel: "Elite",
    price: 275,
    spotsRemaining: 1,
    isFeatured: true,
    image: "/571North-CR3_0335-Indoor-VB-Header-Featured.jpg"
  }
];

export const LeaguesPage = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  
  // Filter state
  const [filters, setFilters] = useState({
    sport: "All Sports",
    format: "All Formats",
    location: "All Locations",
    skillLevel: "All Skill Levels",
    day: "All Days"
  });

  // Open/close state for dropdowns
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  // Refs for dropdown components
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Initialize filters from URL parameters
  useEffect(() => {
    const sportParam = searchParams.get('sport');
    if (sportParam && filterOptions.sport.includes(sportParam)) {
      setFilters(prev => ({
        ...prev,
        sport: sportParam
      }));
    }
  }, [searchParams]);

  // Effect to close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (openDropdown && dropdownRefs.current[openDropdown]) {
        const dropdown = dropdownRefs.current[openDropdown];
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
    }

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // Toggle dropdown
  const toggleDropdown = (dropdown: string) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdown);
    }
  };

  // Handle filter change with toggle functionality for sport
  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === 'sport' && filters.sport === value) {
      // If clicking the same sport button again, reset to "All Sports"
      setFilters(prev => ({
        ...prev,
        [filterType]: "All Sports"
      }));
    } else {
      // Regular filter change
      setFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    }
    setOpenDropdown(null);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      sport: "All Sports",
      format: "All Formats",
      location: "All Locations",
      skillLevel: "All Skill Levels",
      day: "All Days"
    });
  };

  // Check if any filters are active
  const isAnyFilterActive = () => {
    return Object.values(filters).some(
      (value, index) => value !== Object.values(filterOptions)[index][0]
    );
  };

  // Filter leagues based on selected filters
  const filteredLeagues = leagueData.filter(league => {
    return (
      (filters.sport === "All Sports" || league.sport === filters.sport) &&
      (filters.format === "All Formats" || league.format === filters.format) &&
      (filters.location === "All Locations" || league.location === filters.location) &&
      (filters.skillLevel === "All Skill Levels" || league.skillLevel === filters.skillLevel) &&
      (filters.day === "All Days" || league.day.includes(filters.day))
    );
  });

  // Function to get badge color based on spots remaining
  const getSpotsBadgeColor = (spots: number) => {
    if (spots === 0) return "bg-red-100 text-red-800";
    if (spots <= 3) return "bg-orange-100 text-orange-800";
    return "bg-green-100 text-green-800";
  };

  // Function to get spots text
  const getSpotsText = (spots: number) => {
    if (spots === 0) return "Full";
    if (spots === 1) return "1 spot left";
    return `${spots} spots left`;
  };

  // Get background color based on skill level
  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Elite':
        return 'bg-purple-100 text-purple-800';
      case 'Competitive':
        return 'bg-blue-100 text-blue-800';
      case 'Advanced':
        return 'bg-indigo-100 text-indigo-800';
      case 'Intermediate':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get sport icon based on sport type
  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'Volleyball':
        return "/Volleyball.png";
      case 'Badminton':
        return "/Badminton.png";
      case 'Basketball':
        return "/Basketball.png";
      case 'Pickleball':
        return "/Pickleball.png";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white w-full">
      <div className="max-w-[1280px] mx-auto px-4 py-8 md:py-12">
        {/* Page Title */}
        <h1 className="text-4xl md:text-5xl text-[#6F6F6F] font-bold mb-8 md:mb-12 text-center">
          Find a league
        </h1>

        {/* Filters Section - Combined into one row */}
        <div className="mb-16">
          {/* Combined filters row with both sport buttons and dropdowns */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {/* Sport Filter Buttons */}
            {filterOptions.sport.slice(1).map((sport) => (
              <Button
                key={sport}
                onClick={() => handleFilterChange('sport', sport)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border ${
                  filters.sport === sport 
                    ? 'border-[#B20000] bg-[#ffeae5] text-[#B20000] hover:border-[#B20000] hover:bg-[#ffeae5] hover:text-[#B20000]' 
                    : 'border-gray-300 bg-white text-[#6F6F6F] hover:border-[#B20000] hover:bg-[#ffeae5] hover:text-[#B20000]'
                }`}
              >
                <img 
                  src={getSportIcon(sport)} 
                  alt={`${sport} icon`}
                  className="w-6 h-6" 
                />
                <span className="font-medium">{sport}</span>
              </Button>
            ))}
            
            {/* Location Filter */}
            <div className="relative" ref={el => dropdownRefs.current['location'] = el}>
              <button
                className="flex items-center justify-between w-full md:w-auto min-w-[180px] bg-white border border-[#D4D4D4] rounded-lg px-4 py-2.5 hover:border-[#B20000] transition-colors duration-200"
                onClick={() => toggleDropdown('location')}
              >
                <span className="text-[#6F6F6F]">{filters.location}</span>
                <ChevronDown className="h-5 w-5 text-[#6F6F6F] ml-2" />
              </button>
              {openDropdown === 'location' && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-[#D4D4D4] rounded-lg shadow-lg">
                  {filterOptions.location.map((option) => (
                    <button
                      key={option}
                      className={`block w-full text-left px-4 py-2 transition-colors duration-200 hover:bg-[#ffeae5] hover:text-[#B20000] ${
                        filters.location === option ? 'bg-[#ffeae5] text-[#B20000] font-medium' : ''
                      }`}
                      onClick={() => handleFilterChange('location', option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Skill Level Filter */}
            <div className="relative" ref={el => dropdownRefs.current['skillLevel'] = el}>
              <button
                className="flex items-center justify-between w-full md:w-auto min-w-[160px] bg-white border border-[#D4D4D4] rounded-lg px-4 py-2.5 hover:border-[#B20000] transition-colors duration-200"
                onClick={() => toggleDropdown('skillLevel')}
              >
                <span className="text-[#6F6F6F]">{filters.skillLevel}</span>
                <ChevronDown className="h-5 w-5 text-[#6F6F6F] ml-2" />
              </button>
              {openDropdown === 'skillLevel' && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-[#D4D4D4] rounded-lg shadow-lg">
                  {filterOptions.skillLevel.map((option) => (
                    <button
                      key={option}
                      className={`block w-full text-left px-4 py-2 transition-colors duration-200 hover:bg-[#ffeae5] hover:text-[#B20000] ${
                        filters.skillLevel === option ? 'bg-[#ffeae5] text-[#B20000] font-medium' : ''
                      }`}
                      onClick={() => handleFilterChange('skillLevel', option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Day Filter */}
            <div className="relative" ref={el => dropdownRefs.current['day'] = el}>
              <button
                className="flex items-center justify-between w-full md:w-auto min-w-[140px] bg-white border border-[#D4D4D4] rounded-lg px-4 py-2.5 hover:border-[#B20000] transition-colors duration-200"
                onClick={() => toggleDropdown('day')}
              >
                <span className="text-[#6F6F6F]">{filters.day}</span>
                <ChevronDown className="h-5 w-5 text-[#6F6F6F] ml-2" />
              </button>
              {openDropdown === 'day' && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-[#D4D4D4] rounded-lg shadow-lg">
                  {filterOptions.day.map((option) => (
                    <button
                      key={option}
                      className={`block w-full text-left px-4 py-2 transition-colors duration-200 hover:bg-[#ffeae5] hover:text-[#B20000] ${
                        filters.day === option ? 'bg-[#ffeae5] text-[#B20000] font-medium' : ''
                      }`}
                      onClick={() => handleFilterChange('day', option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Clear Filters Button - Only show if filters are active */}
          {isAnyFilterActive() && (
            <div className="flex justify-center">
              <button
                className="flex items-center text-[#B20000] hover:text-[#8A0000] font-medium"
                onClick={clearFilters}
              >
                <X className="h-4 w-4 mr-1" />
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* League Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeagues.map(league => (
            <Link 
              key={league.id} 
              to={`/leagues/${league.id}`}
              className="block rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <Card 
                className="overflow-hidden rounded-lg border border-gray-200 flex flex-col h-full"
              >
                <CardContent className="p-0 flex flex-col h-full">
                  {/* Card Header with League Name and Sport Icon */}
                  <div className="bg-[#F8F8F8] border-b border-gray-200 p-4 flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-[#6F6F6F] line-clamp-2">{league.name}</h3>
                    </div>
                    {/* Sport Icon in top right */}
                    <img 
                      src={getSportIcon(league.sport)} 
                      alt={`${league.sport} icon`}
                      className="w-8 h-8 object-contain ml-2"
                    />
                  </div>
                  
                  {/* Card Body with Info in Rows - Rearranged to match required order */}
                  <div className="p-4 flex-grow flex flex-col space-y-4">
                    {/* 1. Time (Day & Time) */}
                     <div className="space-y-1">
                       <div className="flex items-center">
                        <Clock className="h-4 w-4 text-[#B20000] mr-1.5" />
                        <p className="text-sm font-medium text-[#6F6F6F]">{league.day}</p>
                      </div>
                      <p className="text-sm text-[#6F6F6F] ml-6">
                        {league.playTimes.join(", ")}
                      </p>
                    </div>
                    
                    {/* 2. Dates (Season Dates) */}
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-[#B20000] mr-1.5" />
                        <p className="text-sm font-medium text-[#6F6F6F]">{league.dates}</p>
                      </div>
                    </div>
                    
                    {/* 3. Location */}
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-[#B20000] mr-1.5" />
                        <p className="text-sm font-medium text-[#6F6F6F]">{league.location}</p>
                      </div>
                      {league.sport === "Volleyball" ? (
                        <p className="text-xs text-gray-500 ml-6">Location varies</p>
                      ) : (
                        league.specificLocation && league.location !== league.specificLocation && (
                          <p className="text-xs text-gray-500 ml-6">{league.specificLocation}</p>
                        )
                      )}
                    </div>
                    
                    {/* 4. Price (replacing Skill Level) - Now conditionally showing per team or per player */}
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-[#B20000] mr-1.5" />
                        <p className="text-sm font-medium text-[#6F6F6F]">
                          ${league.price} {league.sport === "Volleyball" ? "per team" : "per player"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Register Button with spots remaining - In same line */}
                  <div className="mt-auto p-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-[#B20000] mr-1" />
                      <span className={`text-xs font-medium py-0.5 px-2 rounded-full ${getSpotsBadgeColor(league.spotsRemaining)}`}>
                        {getSpotsText(league.spotsRemaining)}
                      </span>
                    </div>
                    
                    <Button 
                      className={`bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-4 ${
                        league.spotsRemaining === 0 ? 'opacity-90' : ''
                      }`}
                      disabled={league.spotsRemaining === 0}
                    >
                      {league.spotsRemaining === 0 ? 'Join Waitlist' : 'View Details'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        {/* No Results Message */}
        {filteredLeagues.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-bold text-[#6F6F6F] mb-2">No leagues match your filters</h3>
            <p className="text-[#6F6F6F]">Try adjusting your filter criteria to find available leagues.</p>
          </div>
        )}
      </div>
    </div>
  );
};