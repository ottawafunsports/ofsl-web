import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/toast';
import { supabase } from '../../../lib/supabase';
import { User, Shield, Bell } from 'lucide-react';

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

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    gameReminders: true,
    leagueUpdates: false,
    paymentReminders: true
  });

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

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-8">
      {/* Profile Information Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-[#6F6F6F]" />
            <h2 className="text-xl font-bold text-[#6F6F6F]">Profile Information</h2>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
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
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full"
              />
            ) : (
              <p className="text-[#6F6F6F] py-2">{profile.name || 'Hong'}</p>
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
              <p className="text-[#6F6F6F] py-2">{profile.email || 'hzhang83@gmail.com'}</p>
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
              <p className="text-[#6F6F6F] py-2">{profile.phone || '613-255-6778'}</p>
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
              <p className="text-[#6F6F6F] py-2">{profile.preferred_position || 'Forward'}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-4 mt-6">
            <Button
              onClick={handleProfileSave}
              disabled={saving}
              className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-lg px-6 py-2"
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
              className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-6 py-2"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Password & Security Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#6F6F6F]" />
            <h2 className="text-xl font-bold text-[#6F6F6F]">Password & Security</h2>
          </div>
          <Button className="border border-[#B20000] text-[#B20000] bg-white hover:bg-[#B20000] hover:text-white rounded-lg px-4 py-2">
            Change Password
          </Button>
        </div>

        <p className="text-[#6F6F6F] mb-4">Keep your account secure by using a strong password.</p>
        <p className="text-sm text-[#6F6F6F]"><span className="font-medium">Last updated:</span> Never</p>
      </div>

      {/* Notification Preferences Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="h-5 w-5 text-[#6F6F6F]" />
          <h2 className="text-xl font-bold text-[#6F6F6F]">Notification Preferences</h2>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-[#6F6F6F]">Email Notifications</h3>
              <p className="text-sm text-[#6F6F6F]">Receive general updates via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailNotifications}
                onChange={() => handleNotificationToggle('emailNotifications')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B20000]"></div>
            </label>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-[#6F6F6F]">Game Reminders</h3>
              <p className="text-sm text-[#6F6F6F]">Get notified before upcoming games</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.gameReminders}
                onChange={() => handleNotificationToggle('gameReminders')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B20000]"></div>
            </label>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-[#6F6F6F]">League Updates</h3>
              <p className="text-sm text-[#6F6F6F]">Stay informed about league news and changes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.leagueUpdates}
                onChange={() => handleNotificationToggle('leagueUpdates')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B20000]"></div>
            </label>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-[#6F6F6F]">Payment Reminders</h3>
              <p className="text-sm text-[#6F6F6F]">Receive reminders for upcoming payments</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.paymentReminders}
                onChange={() => handleNotificationToggle('paymentReminders')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B20000]"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}