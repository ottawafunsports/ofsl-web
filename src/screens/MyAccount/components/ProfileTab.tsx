import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/toast';
import { supabase } from '../../../lib/supabase';

export function ProfileTab() {
  const { userProfile, refreshUserProfile } = useAuth();
  const { showToast } = useToast();
  
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    email: '',
    preferred_position: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setProfile({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        email: userProfile.email || '',
        preferred_position: userProfile.preferred_position || ''
      });
    }
  }, [userProfile]);

  const handleProfileSave = async () => {
    if (!userProfile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: profile.name,
          phone: profile.phone,
          email: profile.email,
          preferred_position: profile.preferred_position || null,
          date_modified: new Date().toISOString()
        })
        .eq('id', userProfile.id);

      if (error) throw error;

      await refreshUserProfile();
      setIsEditing(false);
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardContent className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#6F6F6F]">Profile Information</h2>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-4 py-2"
            >
              Edit Profile
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Full Name</label>
            {isEditing ? (
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full"
              />
            ) : (
              <p className="text-[#6F6F6F] py-2">{profile.name || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Phone Number</label>
            {isEditing ? (
              <Input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full"
              />
            ) : (
              <p className="text-[#6F6F6F] py-2">{profile.phone || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Email</label>
            {isEditing ? (
              <Input
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full"
                type="email"
              />
            ) : (
              <p className="text-[#6F6F6F] py-2">{profile.email || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Preferred Position</label>
            {isEditing ? (
              <select
                value={profile.preferred_position}
                onChange={(e) => setProfile({ ...profile, preferred_position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000]"
              >
                <option value="">Select position...</option>
                <option value="Guard">Guard</option>
                <option value="Forward">Forward</option>
                <option value="Center">Center</option>
              </select>
            ) : (
              <p className="text-[#6F6F6F] py-2">{profile.preferred_position || 'Not set'}</p>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-4">
              <Button
                onClick={handleProfileSave}
                disabled={saving}
                className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-2"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setProfile({
                    name: userProfile?.name || '',
                    phone: userProfile?.phone || '',
                    email: userProfile?.email || '',
                    preferred_position: userProfile?.preferred_position || ''
                  });
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white rounded-[10px] px-6 py-2"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}