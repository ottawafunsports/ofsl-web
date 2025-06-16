import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface RegistrationData {
  playerName: string;
  email: string;
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
  experience: string;
  position: string;
  teamName?: string;
  isTeamCaptain: boolean;
  agreeToTerms: boolean;
}

export function useRegistration() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const submitRegistration = async (data: RegistrationData, leagueId: number) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would make the actual API call to register the user
      console.log('Registration data:', { ...data, leagueId, userId: user?.id });
      
      setSubmitStatus('success');
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      setSubmitStatus('error');
      return { success: false, error: 'Registration failed. Please try again.' };
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetStatus = () => {
    setSubmitStatus('idle');
  };

  return {
    submitRegistration,
    isSubmitting,
    submitStatus,
    resetStatus
  };
}