import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface FilterState {
  sport: string;
  format: string;
  location: string;
  skillLevel: string;
  day: string;
}

export const filterOptions = {
  sport: ["All Sports", "Volleyball", "Badminton", "Basketball", "Pickleball"],
  format: ["All Formats", "6s", "4s", "2s", "Singles", "Doubles", "5s"],
  location: ["All Locations", "Central", "West End", "East End"],
  skillLevel: ["All Skill Levels", "Elite", "Competitive", "Advanced", "Intermediate"],
  day: ["All Days", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
};

export function useLeagueFilters() {
  const [searchParams] = useSearchParams();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  const [filters, setFilters] = useState<FilterState>({
    sport: "All Sports",
    format: "All Formats",
    location: "All Locations",
    skillLevel: "All Skill Levels",
    day: "All Days"
  });

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

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const toggleDropdown = (dropdown: string) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdown);
    }
  };

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

  const clearFilters = () => {
    setFilters({
      sport: "All Sports",
      format: "All Formats",
      location: "All Locations",
      skillLevel: "All Skill Levels",
      day: "All Days"
    });
  };

  const isAnyFilterActive = () => {
    return Object.values(filters).some(
      (value, index) => value !== Object.values(filterOptions)[index][0]
    );
  };

  return {
    filters,
    openDropdown,
    dropdownRefs,
    toggleDropdown,
    handleFilterChange,
    clearFilters,
    isAnyFilterActive
  };
}