import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Filter, Search } from 'lucide-react';
import { SchoolFilters, Sport, DayOfWeek } from '../types';

interface SearchAndFiltersProps {
  searchTerm: string;
  filters: SchoolFilters;
  sports: Sport[];
  daysOfWeek: DayOfWeek[];
  isAnyFilterActive: boolean;
  onSearchChange: (term: string) => void;
  onFilterChange: (filterType: keyof SchoolFilters, value: any) => void;
  onDayFilterToggle: (dayId: number) => void;
  onSportFilterToggle: (sportId: number) => void;
  onClearFilters: () => void;
}

export function SearchAndFilters({
  searchTerm,
  filters,
  sports,
  daysOfWeek,
  isAnyFilterActive,
  onSearchChange,
  onFilterChange,
  onDayFilterToggle,
  onSportFilterToggle,
  onClearFilters
}: SearchAndFiltersProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 hidden md:block">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-[#6F6F6F]" />
        <h3 className="text-lg font-medium text-[#6F6F6F]">Search & Filters</h3>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6F6F6F]" />
          <Input
            placeholder="Search schools by name or address..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full max-w-md"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#6F6F6F] mb-3">Status</label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="status-all"
                name="status"
                checked={filters.status === 'all'}
                onChange={() => onFilterChange('status', 'all')}
                className="mr-2"
              />
              <label htmlFor="status-all" className="text-sm text-[#6F6F6F]">
                All Schools
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="status-active"
                name="status"
                checked={filters.status === 'active'}
                onChange={() => onFilterChange('status', 'active')}
                className="mr-2"
              />
              <label htmlFor="status-active" className="text-sm text-[#6F6F6F]">
                Active Only
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="status-inactive"
                name="status"
                checked={filters.status === 'inactive'}
                onChange={() => onFilterChange('status', 'inactive')}
                className="mr-2"
              />
              <label htmlFor="status-inactive" className="text-sm text-[#6F6F6F]">
                Inactive Only
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6F6F6F] mb-3">Available Days</label>
          <div className="space-y-2">
            {daysOfWeek.map((day) => (
              <div key={day.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`filter-day-${day.id}`}
                  checked={filters.days.includes(day.id)}
                  onChange={() => onDayFilterToggle(day.id)}
                  className="mr-2"
                />
                <label htmlFor={`filter-day-${day.id}`} className="text-sm text-[#6F6F6F]">
                  {day.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6F6F6F] mb-3">Available Sports</label>
          <div className="space-y-2">
            {sports.map((sport) => (
              <div key={sport.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`filter-sport-${sport.id}`}
                  checked={filters.sports.includes(sport.id)}
                  onChange={() => onSportFilterToggle(sport.id)}
                  className="mr-2"
                />
                <label htmlFor={`filter-sport-${sport.id}`} className="text-sm text-[#6F6F6F]">
                  {sport.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {isAnyFilterActive && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button
            onClick={onClearFilters}
            className="text-sm text-[#B20000] hover:text-[#8A0000] bg-transparent hover:bg-transparent p-0"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}