import { Card, CardContent } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { Save, Trash } from 'lucide-react';
import { Team, EditTeamForm, Skill } from './types';

interface TeamDetailsProps {
  team: Team;
  editTeam: EditTeamForm;
  skills: Skill[];
  saving: boolean;
  deleting: boolean;
  onUpdateTeam: (team: EditTeamForm) => void;
  onSaveTeam: () => void;
  onDeleteTeam: () => void;
}

export function TeamDetails({
  team,
  editTeam,
  skills,
  saving,
  deleting,
  onUpdateTeam,
  onSaveTeam,
  onDeleteTeam
}: TeamDetailsProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#6F6F6F]">Team Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Team Name</label>
            <Input
              value={editTeam.name}
              onChange={(e) => onUpdateTeam({ ...editTeam, name: e.target.value })}
              placeholder="Enter team name"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Skill Level</label>
            <select
              value={editTeam.skill_level_id || ''}
              onChange={(e) => onUpdateTeam({ ...editTeam, skill_level_id: e.target.value ? parseInt(e.target.value) : null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
            >
              <option value="">Select skill level...</option>
              {skills.map(skill => (
                <option key={skill.id} value={skill.id}>{skill.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#6F6F6F]">
            <div>
              <span className="font-medium">League:</span> {team.leagues?.name || 'Unknown'}
            </div>
            <div>
              <span className="font-medium">Registration Date:</span> {new Date(team.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Button
            onClick={onSaveTeam}
            disabled={saving || !editTeam.name}
            className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-2 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            onClick={onDeleteTeam}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700 text-white rounded-[10px] px-6 py-2 flex items-center gap-2"
          >
            <Trash className="h-4 w-4" />
            {deleting ? 'Deleting...' : 'Unregister Team'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}