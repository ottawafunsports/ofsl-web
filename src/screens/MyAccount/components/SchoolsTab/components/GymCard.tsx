import { Button } from '../../../../../components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { Gym, Sport, DayOfWeek } from '../types';

interface GymCardProps {
  gym: Gym;
  sports: Sport[];
  daysOfWeek: DayOfWeek[];
  deleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function GymCard({ gym, sports, daysOfWeek, deleting, onEdit, onDelete }: GymCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-[#6F6F6F]">{gym.gym}</h3>
        <div className="flex items-center gap-2">
          <Button
            onClick={onEdit}
            className="bg-transparent hover:bg-blue-50 text-blue-500 hover:text-blue-600 rounded-lg p-2 transition-colors"
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button
            onClick={onDelete}
            disabled={deleting}
            className="bg-transparent hover:bg-red-50 text-red-500 hover:text-red-600 rounded-lg p-2 transition-colors"
          >
            {deleting ? (
              <div className="h-3 w-3 border-t-2 border-red-500 rounded-full animate-spin"></div>
            ) : (
              <Trash2 className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="text-[#6F6F6F] mb-4">{gym.address}</div>
      
      <div className="mb-4">
        <span className={`px-2 py-1 text-xs rounded-full ${
          gym.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {gym.active ? 'Active' : 'Inactive'}
        </span>
        
        {gym.active && gym.available_days && gym.available_days.length > 0 && (
          <div className="inline-flex flex-wrap gap-1 ml-2">
            {gym.available_days.map(dayId => {
              const day = daysOfWeek.find(d => d.id === dayId);
              return day ? (
                <span key={dayId} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                  {day.name}
                </span>
              ) : null;
            })}
          </div>
        )}
        
        {gym.active && gym.available_sports && gym.available_sports.length > 0 && (
          <div className="inline-flex flex-wrap gap-1 ml-2">
            {gym.available_sports.map(sportId => {
              const sport = sports.find(s => s.id === sportId);
              return sport ? (
                <span key={sportId} className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                  {sport.name}
                </span>
              ) : null;
            })}
          </div>
        )}
      </div>
      
      {gym.instructions && (
        <div className="mb-4">
          <span className="font-medium text-[#6F6F6F]">Access Instructions:</span>
          <p className="text-[#6F6F6F] mt-1">{gym.instructions}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <span className="font-medium">Contact:</span> John Smith
        </div>
        <div>
          <span className="font-medium">Phone:</span> 613-520-2600
        </div>
        <div>
          <span className="font-medium">Email:</span> facilities@carleton.ca
        </div>
      </div>
    </div>
  );
}