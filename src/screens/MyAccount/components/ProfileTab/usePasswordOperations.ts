import { useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import { useToast } from '../../../../components/ui/toast';
import { PasswordForm, PasswordValidationState } from './types';
import { INITIAL_PASSWORD_FORM, INITIAL_PASSWORD_VALIDATION } from './constants';

export function usePasswordOperations(profile: { email: string }) {
  const { showToast } = useToast();
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>(INITIAL_PASSWORD_FORM);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationState>(INITIAL_PASSWORD_VALIDATION);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validate current password when field is blurred
  const validateCurrentPassword = async (password: string) => {
    if (!password) {
      setPasswordValidation(prev => ({ ...prev, currentPasswordError: "Current password is required" }));
      return false;
    }
    
    try {
      setPasswordValidation(prev => ({ ...prev, validatingPassword: true }));
      
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
        setPasswordValidation(prev => ({ ...prev, currentPasswordError: "Current password is incorrect" }));
        return false;
      }
      
      // Password is correct
      setPasswordValidation(prev => ({ ...prev, currentPasswordError: null }));
      return true;
      
    } catch (error: any) {
      console.error('Error validating password:', error);
      setPasswordValidation(prev => ({ ...prev, currentPasswordError: "Failed to validate password" }));
      return false;
    } finally {
      setPasswordValidation(prev => ({ ...prev, validatingPassword: false }));
    }
  };

  // Validate new password when field is blurred or changed
  const validateNewPassword = (password: string) => {
    if (!password) {
      setPasswordValidation(prev => ({ ...prev, newPasswordError: "New password is required" }));
      return false;
    }
    
    if (password.length < 12) {
      setPasswordValidation(prev => ({ ...prev, newPasswordError: "Password must be at least 12 characters" }));
      return false;
    }
    
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      setPasswordValidation(prev => ({ ...prev, newPasswordError: "Password must contain at least one uppercase letter" }));
      return false;
    }
    
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      setPasswordValidation(prev => ({ ...prev, newPasswordError: "Password must contain at least one lowercase letter" }));
      return false;
    }
    
    // Check for at least one number
    if (!/\d/.test(password)) {
      setPasswordValidation(prev => ({ ...prev, newPasswordError: "Password must contain at least one number" }));
      return false;
    }
    
    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      setPasswordValidation(prev => ({ ...prev, newPasswordError: "Password must contain at least one special character" }));
      return false;
    }
    
    // Password is valid
    setPasswordValidation(prev => ({ ...prev, newPasswordError: null }));
    return true;
  };

  // Validate confirm password when field is changed
  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      setPasswordValidation(prev => ({ 
        ...prev, 
        confirmPasswordError: "Confirm password is required",
        confirmPasswordSuccess: false
      }));
      return false;
    }
    
    if (confirmPassword !== passwordForm.newPassword) {
      setPasswordValidation(prev => ({ 
        ...prev, 
        confirmPasswordError: "Passwords do not match",
        confirmPasswordSuccess: false
      }));
      return false;
    }
    
    // Passwords match
    setPasswordValidation(prev => ({ 
      ...prev, 
      confirmPasswordError: null,
      confirmPasswordSuccess: true
    }));
    return true;
  };

  const handlePasswordChange = async () => {
    // Reset error state
    setPasswordValidation(prev => ({ ...prev, passwordError: null }));
    
    // Validate passwords
    if (!passwordForm.currentPassword) {
      setPasswordValidation(prev => ({ ...prev, passwordError: "Current password is required" }));
      return;
    }
    
    if (!passwordForm.newPassword) {
      setPasswordValidation(prev => ({ ...prev, passwordError: "New password is required" }));
      return;
    }
    
    // Validate the new password
    if (!validateNewPassword(passwordForm.newPassword)) {
      setPasswordValidation(prev => ({ ...prev, passwordError: prev.newPasswordError }));
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordValidation(prev => ({ ...prev, passwordError: "New passwords do not match" }));
      return;
    }
    
    // Current password validation is already done on blur
    if (passwordValidation.currentPasswordError) {
      return;
    }
    
    try {
      setPasswordValidation(prev => ({ ...prev, changingPassword: true }));
      
      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });
      
      if (updateError) {
        throw updateError;
      }
      
      // Reset form and show success message
      setPasswordForm(INITIAL_PASSWORD_FORM);
      setShowPasswordSection(false);
      showToast('Password updated successfully!', 'success');
      
    } catch (error: any) {
      console.error('Error updating password:', error);
      setPasswordValidation(prev => ({ ...prev, passwordError: error.message || 'Failed to update password' }));
    } finally {
      setPasswordValidation(prev => ({ ...prev, changingPassword: false }));
    }
  };

  const handleCancelPasswordChange = () => {
    setShowPasswordSection(false);
    setPasswordForm(INITIAL_PASSWORD_FORM);
    setPasswordValidation(INITIAL_PASSWORD_VALIDATION);
  };

  const handleTogglePasswordSection = () => {
    setShowPasswordSection(!showPasswordSection);
    if (showPasswordSection) {
      handleCancelPasswordChange();
    }
  };

  return {
    showPasswordSection,
    passwordForm,
    passwordValidation,
    showCurrentPassword,
    showNewPassword,
    showConfirmPassword,
    setPasswordForm,
    setShowCurrentPassword,
    setShowNewPassword,
    setShowConfirmPassword,
    handleTogglePasswordSection,
    validateCurrentPassword,
    validateNewPassword,
    validateConfirmPassword,
    handlePasswordChange,
    handleCancelPasswordChange
  };
}