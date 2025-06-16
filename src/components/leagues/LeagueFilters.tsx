import { Button } from "../ui/button";
import { ChevronDown, X } from "lucide-react";
import { filterOptions, useLeagueFilters } from "../../hooks/useLeagueFilters";

interface LeagueFiltersProps {
  filters: ReturnType<typeof useLeagueFilters>['filters'];
  openDropdown: ReturnType<typeof useLeagueFilters>['openDropdown'];
  dropdownRefs: ReturnType<typeof useLeagueFilters>['dropdownRefs'];
  toggleDropdown: ReturnType<typeof useLeagueFilters>['toggleDropdown'];
  handleFilterChange: ReturnType<typeof useLeagueFilters>['handleFilterChange'];
  clearFilters: ReturnType<typeof useLeagueFilters>['clearFilters'];
  isAnyFilterActive: ReturnType<typeof useLeagueFilters>['isAnyFilterActive'];
}

export function LeagueFilters({
  filters,
  openDropdown,
  dropdownRefs,
  toggleDropdown,
  handleFilterChange,
  clearFilters,
  isAnyFilterActive
}: LeagueFiltersProps) {
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
        return "/pickleball.png";
      default:
        return "";
    }
  };

  return (
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
  );
}