import { useState } from 'react';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent } from '../../../../../components/ui/card';
import { Input } from '../../../../../components/ui/input';
import { RichTextEditor } from '../../../../../components/ui/rich-text-editor';
import { X } from 'lucide-react';
import { NewLeague, Sport, Skill, Gym } from '../types';

interface NewLeagueFormProps {
  sports: Sport[];
  skills: Skill[];
  gyms: Gym[];
  saving: boolean;
  onClose: () => void;
  onSubmit: (league: NewLeague) => Promise<void>;
}

export function NewLeagueForm({ 
  sports, 
  skills, 
  gyms, 
  saving, 
  onClose, 
  onSubmit 
}: NewLeagueFormProps) {
  const [newLeague, setNewLeague] = useState<NewLeague>({
    name: '',
    description: '',
    additional_info: '',
    sport_id: null,
    skill_id: null,
    day_of_week: null,
    start_date: '',
    end_date: '',
    cost: null,
    max_teams: 20,
    gym_ids: []
  });

  const handleSubmit = async () => {
    await onSubmit(newLeague);
    setNewLeague({
      name: '',
      description: '',
      additional_info: '',
      sport_id: null,
      skill_id: null,
      day_of_week: null,
      start_date: '',
      end_date: '',
      cost: null,
      max_teams: 20,
      gym_ids: []
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#6F6F6F]">Create New League</h3>
          <Button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 bg-transparent hover:bg-transparent border-none shadow-none p-2"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#6F6F6F] mb-2">League Name</label>
            <Input
              value={newLeague.name}
              onChange={(e) => setNewLeague({ ...newLeague, name: e.target.value })}
              placeholder="Enter league name"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Sport</label>
            <select
              value={newLeague.sport_id || ''}
              onChange={(e) => setNewLeague({ ...newLeague, sport_id: e.target.value ? parseInt(e.target.value) : null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
            >
              <option value="">Select sport...</option>
              {sports.map(sport => (
                <option key={sport.id} value={sport.id}>{sport.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Skill Level</label>
            <select
              value={newLeague.skill_id || ''}
              onChange={(e) => setNewLeague({ ...newLeague, skill_id: e.target.value ? parseInt(e.target.value) : null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
            >
              <option value="">Select skill level...</option>
              {skills.map(skill => (
                <option key={skill.id} value={skill.id}>{skill.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Day of Week</label>
            <select
              value={newLeague.day_of_week || ''}
              onChange={(e) => setNewLeague({ ...newLeague, day_of_week: e.target.value ? parseInt(e.target.value) : null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
            >
              <option value="">Select day...</option>
              <option value="0">Sunday</option>
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Start Date</label>
            <Input
              type="date"
              value={newLeague.start_date}
              onChange={(e) => setNewLeague({ ...newLeague, start_date: e.target.value })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6F6F6F] mb-2">End Date</label>
            <Input
              type="date"
              value={newLeague.end_date}
              onChange={(e) => setNewLeague({ ...newLeague, end_date: e.target.value })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Cost ($)</label>
            <Input
              type="number"
              value={newLeague.cost || ''}
              onChange={(e) => setNewLeague({ ...newLeague, cost: e.target.value ? parseFloat(e.target.value) : null })}
              placeholder="0.00"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Max Teams</label>
            <Input
              type="number"
              value={newLeague.max_teams}
              onChange={(e) => setNewLeague({ ...newLeague, max_teams: parseInt(e.target.value) || 20 })}
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Description</label>
          <RichTextEditor
            value={newLeague.description}
            onChange={(content) => setNewLeague({ ...newLeague, description: content })}
            placeholder="Enter league description"
            rows={3}
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Gyms/Schools</label>
          <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
            {gyms.map(gym => (
              <label key={gym.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={newLeague.gym_ids.includes(gym.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setNewLeague({ ...newLeague, gym_ids: [...newLeague.gym_ids, gym.id] });
                    } else {
                      setNewLeague({ ...newLeague, gym_ids: newLeague.gym_ids.filter(id => id !== gym.id) });
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-sm">{gym.gym}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Button
            onClick={handleSubmit}
            disabled={saving || !newLeague.name || !newLeague.sport_id}
            className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-2"
          >
            {saving ? 'Creating...' : 'Create League'}
          </Button>
          <Button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white rounded-[10px] px-6 py-2"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}