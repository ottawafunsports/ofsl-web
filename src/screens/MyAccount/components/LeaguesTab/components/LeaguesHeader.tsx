import { Button } from '../../../../../components/ui/button';
import { Plus } from 'lucide-react';

interface LeaguesHeaderProps {
  onCreateNew: () => void;
}

export function LeaguesHeader({ onCreateNew }: LeaguesHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-[#6F6F6F]">Manage Leagues</h2>
      <Button
        onClick={onCreateNew}
        className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-2 flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Create New League
      </Button>
    </div>
  );
}