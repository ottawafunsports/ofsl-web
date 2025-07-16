import { User } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Profile } from './types';

interface ProfileInformationProps {
  profile: Profile;
  isEditing: boolean;
  saving: boolean;
  userProfile: any;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onProfileChange: (profile: Profile) => void;
}

export function ProfileInformation({
  profile,
  isEditing,
  saving,
  userProfile,
  onEdit,
  onSave,
  onCancel,
  onProfileChange
}: ProfileInformationProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-[#6F6F6F]" />
          <h2 className="text-xl font-bold text-[#6F6F6F]">Profile Information</h2>
        </div>
        {!isEditing && (
          <Button
            onClick={onEdit}
            className="border border-[#B20000] text-[#B20000] bg-white hover:bg-[#B20000] hover:text-white rounded-lg px-4 py-2"
          >
            Edit
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Full Name</label>
          {isEditing ? (
            <Input
              value={profile.name}
              onChange={(e) => onProfileChange({ ...profile, name: e.target.value })}
              className="w-full"
            />
          ) : (
            <p className="text-[#6F6F6F] py-2">{profile.name || 'No name available'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Email</label>
          {isEditing ? (
            <Input
              value={profile.email}
              onChange={(e) => onProfileChange({ ...profile, email: e.target.value })}
              className="w-full"
              type="email"
            />
          ) : (
            <p className="text-[#6F6F6F] py-2">{profile.email || 'No email available'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Phone Number</label>
          {isEditing ? (
            <Input
              value={profile.phone}
              onChange={(e) => onProfileChange({ ...profile, phone: e.target.value })}
              className="w-full"
            />
          ) : (
            <p className="text-[#6F6F6F] py-2">{profile.phone || 'No phone number available'}</p>
          )}
        </div>

      </div>

      {isEditing && (
        <div className="flex gap-4 mt-6">
          <Button
            onClick={onSave}
            disabled={saving}
            className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-lg px-6 py-2"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-6 py-2"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}