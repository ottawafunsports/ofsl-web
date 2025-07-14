import { Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { PasswordForm, PasswordValidationState } from './types';

interface PasswordSecurityProps {
  showPasswordSection: boolean;
  passwordForm: PasswordForm;
  passwordValidation: PasswordValidationState;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  onTogglePasswordSection: () => void;
  onPasswordFormChange: (form: PasswordForm) => void;
  onToggleCurrentPassword: () => void;
  onToggleNewPassword: () => void;
  onToggleConfirmPassword: () => void;
  onValidateCurrentPassword: (password: string) => Promise<boolean>;
  onValidateNewPassword: (password: string) => boolean;
  onValidateConfirmPassword: (confirmPassword: string) => boolean;
  onPasswordChange: () => void;
  onCancelPasswordChange: () => void;
}

export function PasswordSecurity({
  showPasswordSection,
  passwordForm,
  passwordValidation,
  showCurrentPassword,
  showNewPassword,
  showConfirmPassword,
  onTogglePasswordSection,
  onPasswordFormChange,
  onToggleCurrentPassword,
  onToggleNewPassword,
  onToggleConfirmPassword,
  onValidateCurrentPassword,
  onValidateNewPassword,
  onValidateConfirmPassword,
  onPasswordChange,
  onCancelPasswordChange
}: PasswordSecurityProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#6F6F6F]" />
          <h2 className="text-xl font-bold text-[#6F6F6F]">Password & Security</h2>
        </div>
        <Button 
          onClick={onTogglePasswordSection}
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
          {passwordValidation.passwordError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {passwordValidation.passwordError}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-[#6F6F6F] mb-2">Current Password</label>
            <div className="relative">
              <Input 
                type={showCurrentPassword ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(e) => {
                  onPasswordFormChange({...passwordForm, currentPassword: e.target.value});
                }}
                onBlur={(e) => onValidateCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className={`w-full pr-10 ${passwordValidation.currentPasswordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={onToggleCurrentPassword}
              >
                {showCurrentPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
            {passwordValidation.validatingPassword && (
              <div className="mt-1 text-sm text-blue-600 flex items-center">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                Validating password...
              </div>
            )}
            {passwordValidation.currentPasswordError && (
              <div className="mt-1 text-sm text-red-600">{passwordValidation.currentPasswordError}</div>
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
                  onPasswordFormChange({...passwordForm, newPassword: newValue});
                  if (newValue) onValidateNewPassword(newValue);
                }}
                onBlur={(e) => onValidateNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className={`w-full pr-10 ${passwordValidation.newPasswordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={onToggleNewPassword}
              >
                {showNewPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
            {passwordValidation.newPasswordError && (
              <div className="mt-1 text-sm text-red-600">{passwordValidation.newPasswordError}</div>
            )}
            {!passwordValidation.newPasswordError && passwordForm.newPassword && (
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
                  onPasswordFormChange({...passwordForm, confirmPassword: newValue});
                  if (newValue) onValidateConfirmPassword(newValue);
                }}
                onBlur={(e) => onValidateConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className={`w-full pr-10 ${passwordValidation.confirmPasswordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : passwordValidation.confirmPasswordSuccess ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''}`}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={onToggleConfirmPassword}
              >
                {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
            {passwordValidation.confirmPasswordError && (
              <div className="mt-1 text-sm text-red-600">{passwordValidation.confirmPasswordError}</div>
            )}
            {passwordValidation.confirmPasswordSuccess && !passwordValidation.confirmPasswordError && passwordForm.confirmPassword && (
              <div className="mt-1 text-sm text-green-600">Passwords match</div>
            )}
          </div>
          
          <div className="flex gap-4 pt-2">
            <Button
              onClick={onPasswordChange}
              disabled={passwordValidation.changingPassword}
              className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-lg px-6 py-2"
            >
              {passwordValidation.changingPassword ? 'Updating...' : 'Update Password'}
            </Button>
            <Button
              onClick={onCancelPasswordChange}
              className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-6 py-2"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}