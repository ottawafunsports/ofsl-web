import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Eye, EyeOff, User, Shield, Bell } from 'lucide-react';
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

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    gameReminders: true,
    leagueUpdates: false,
    paymentReminders: true
  });

  // Password change state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [validatingPassword, setValidatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [currentPasswordError, setCurrentPasswordError] = useState<string | null>(null);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [confirmPasswordSuccess, setConfirmPasswordSuccess] = useState(false);

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

  // Validate current password when field is blurred
  const validateCurrentPassword = async (password: string) => {
    if (!password) {
      setCurrentPasswordError("Current password is required");
      return false;
    }
    
    try {
      setValidatingPassword(true);
      
      // Verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: password
      });
      
      if (signInError) {
        // Only log unexpected errors, not invalid credentials which are expected during validation
        if (signInError.message !== 'Invalid login credentials') {
          console.error('Unexpected error validating password:', signInError);
        }
        setCurrentPasswordError("Current password is incorrect");
        return false;
      }
      
      // Password is correct
      setCurrentPasswordError(null);
      return true;
      
    } catch (error: any) {
      console.error('Error validating password:', error);
      setCurrentPasswordError("Failed to validate password");
      return false;
    } finally {
      setValidatingPassword(false);
    }
  };

  // Validate new password when field is blurred or changed
  const validateNewPassword = (password: string) => {
    if (!password) {
      setNewPasswordError("New password is required");
      return false;
    }
    
    if (password.length < 12) {
      setNewPasswordError("Password must be at least 12 characters");
      return false;
    }
    
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      setNewPasswordError("Password must contain at least one uppercase letter");
      return false;
    }
    
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      setNewPasswordError("Password must contain at least one lowercase letter");
      return false;
    }
    
    // Check for at least one number
    if (!/\d/.test(password)) {
      setNewPasswordError("Password must contain at least one number");
      return false;
    }
    
    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      setNewPasswordError("Password must contain at least one special character");
      return false;
    }
    
    // Password is valid
    setNewPasswordError(null);
    return true;
  };

  // Validate confirm password when field is changed
  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError("Confirm password is required");
      setConfirmPasswordSuccess(false);
      return false;
    }
    
    if (confirmPassword !== passwordForm.newPassword) {
      setConfirmPasswordError("Passwords do not match");
      setConfirmPasswordSuccess(false);
      return false;
    }
    
    // Passwords match
    setConfirmPasswordError(null);
    setConfirmPasswordSuccess(true);
    return true;
  };

  const handlePasswordChange = async () => {
    // Reset error state
    setPasswordError(null);
    
    // Validate passwords
    if (!passwordForm.currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    
    if (!passwordForm.newPassword) {
      setPasswordError("New password is required");
      return;
    }
    
    // Validate the new password
    if (!validateNewPassword(passwordForm.newPassword)) {
      setPasswordError(newPasswordError);
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    
    // Current password validation is already done on blur
    if (currentPasswordError) {
      return;
    }
    
    try {
      setChangingPassword(true);
      
      
      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });
      
      if (updateError) {
        throw updateError;
      }
      
      // Reset form and show success message
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordSection(false);
      showToast('Password updated successfully!', 'success');
      
    } catch (error: any) {
      console.error('Error updating password:', error);
      setPasswordError(error.message || 'Failed to update password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleCancelPasswordChange = () => {
    setShowPasswordSection(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError(null);
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
          <Button 
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            className="border border-[#B20000] text-[#B20000] bg-white hover:bg-[#B20000] hover:text-white rounded-lg px-4 py-2"
          >
            {showPasswordSection ? 'Cancel' : 'Change Password'}
          </Button>
        </div>

        {!showPasswordSection ? (
          <>
            <p className="text-[#6F6F6F] mb-4">Keep your account secure by using a strong password.</p>
            <p className="text-sm text-[#6F6F6F]"><span className="font-medium">Last updated:</span> Never</p>
          </>
        ) : (
          <div className="mt-4 space-y-4">
            {passwordError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {passwordError}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Current Password</label>
              <div className="relative">
                <Input 
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) => {
                    setPasswordForm({...passwordForm, currentPassword: e.target.value});
                    // Clear error when user starts typing again
                    if (currentPasswordError) setCurrentPasswordError(null);
                  }}
                  onBlur={(e) => validateCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className={`w-full pr-10 ${currentPasswordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              {validatingPassword && (
                <div className="mt-1 text-sm text-blue-600 flex items-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                  Validating password...
                </div>
              )}
              {currentPasswordError && (
                <div className="mt-1 text-sm text-red-600">{currentPasswordError}</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#6F6F6F] mb-2">New Password (minimum 12 characters)</label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setPasswordForm({...passwordForm, newPassword: newValue});
                    if (newValue) validateNewPassword(newValue);
                  }}
                  onBlur={(e) => validateNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className={`w-full pr-10 ${newPasswordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              {newPasswordError && (
                <div className="mt-1 text-sm text-red-600">{newPasswordError}</div>
              )}
              {!newPasswordError && passwordForm.newPassword && (
                <div className="mt-1 text-sm text-green-600">Password meets requirements</div>
              )}
              <div className="mt-2 text-xs text-gray-500">
                Password must be at least 12 characters and include uppercase, lowercase, number, and special character.
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Confirm New Password</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setPasswordForm({...passwordForm, confirmPassword: newValue});
                    if (newValue) validateConfirmPassword(newValue);
                  }}
                  onBlur={(e) => validateConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className={`w-full pr-10 ${confirmPasswordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : confirmPasswordSuccess ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''}`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              {confirmPasswordError && (
                <div className="mt-1 text-sm text-red-600">{confirmPasswordError}</div>
              )}
              {confirmPasswordSuccess && !confirmPasswordError && passwordForm.confirmPassword && (
                <div className="mt-1 text-sm text-green-600">Passwords match</div>
              )}
            </div>
            
            <div className="flex gap-4 pt-2">
              <Button
                onClick={handlePasswordChange}
                disabled={changingPassword}
                className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-lg px-6 py-2"
              >
                {changingPassword ? 'Updating...' : 'Update Password'}
              </Button>
              <Button
                onClick={handleCancelPasswordChange}
                className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-6 py-2"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
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