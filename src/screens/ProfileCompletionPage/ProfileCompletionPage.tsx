import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { supabase } from '../../lib/supabase';
import { Loader2, CheckCircle } from 'lucide-react';
import { SportSkillSelector } from '../SignupPage/SportSkillSelector';
import { useToast } from '../../components/ui/toast';

interface SportSkill {
  sport_id: number;
  skill_id: number;
  sport_name?: string;
  skill_name?: string;
}

export function ProfileCompletionPage() {
  const { user, userProfile, loading, refreshUserProfile, setIsNewUser } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    preferred_position: '',
    sports_skills: [] as SportSkill[]
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sportSkillError, setSportSkillError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);

  // Check if user is logged in and email is verified
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      // Check email verification status
      const isEmailVerified = user.email_confirmed_at != null;
      setEmailVerified(isEmailVerified);

      if (!isEmailVerified) {
        // Email not verified, redirect to confirmation page
        navigate('/signup-confirmation', {
          state: { email: user.email }
        });
        return;
      }

      // Populate form with existing user data
      setFormData({
        name: userProfile?.name || user.user_metadata?.full_name || user.user_metadata?.name || '',
        phone: userProfile?.phone || '',
        preferred_position: userProfile?.preferred_position || '',
        sports_skills: userProfile?.user_sports_skills || []
      });
      setInitialLoading(false);
    }
  }, [user, userProfile, loading, navigate]);

  // Check if profile is already complete
  useEffect(() => {
    if (userProfile && !loading && !initialLoading && emailVerified) {
      const hasBasicInfo = userProfile.name && userProfile.phone && 
                          userProfile.name.trim() !== '' && userProfile.phone.trim() !== '';
      const hasSportsSkills = userProfile.user_sports_skills && 
                             Array.isArray(userProfile.user_sports_skills) && 
                             userProfile.user_sports_skills.length > 0;
      
      if (hasBasicInfo && hasSportsSkills && userProfile.profile_completed) {
        // Profile already complete, redirect to teams page
        const redirectPath = localStorage.getItem('redirectAfterLogin') || '/my-account/teams';
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      }
    }
  }, [userProfile, loading, initialLoading, emailVerified, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.phone) {
      setError('Please fill out all required fields');
      return;
    }
    
    // Validate phone number format
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    // Validate that at least one sport and skill level is selected
    if (!formData.sports_skills || formData.sports_skills.length === 0) {
      setSportSkillError("Please select at least one sport and skill level");
      return;
    }
    
    setSportSkillError(null);
    setError(null);
    setSubmitting(true);
    
    try {
      // Update user profile with complete information
      const { error: profileError } = await supabase
        .from('users')
        .update({
          name: formData.name,
          phone: formData.phone,
          preferred_position: formData.preferred_position,
          user_sports_skills: formData.sports_skills,
          profile_completed: true,
          email_verified: true,
          date_modified: new Date().toISOString()
        })
        .eq('auth_id', user?.id);
      
      if (profileError) throw profileError;
      
      // Refresh the user profile
      await refreshUserProfile();
      showToast('Profile completed successfully!', 'success');
      
      // Clear the new user flag since profile is now complete
      setIsNewUser(false);
      
      // Redirect to intended page or teams page
      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/my-account/teams';
      localStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath);
      
    } catch (err: any) {
      console.error('Error completing profile:', err);
      setError(err.message || 'Failed to complete profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSportSkillChange = (newSportSkills: SportSkill[]) => {
    setFormData({...formData, sports_skills: newSportSkills});
    if (sportSkillError && newSportSkills.length > 0) {
      setSportSkillError(null);
    }
  };

  // Phone number formatting function
  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, '');
    
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    } else {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setFormData({...formData, phone: formattedPhone});
  };

  if (loading || initialLoading || !user || !emailVerified) {
    return (
      <div className="min-h-[calc(100vh-135px)] bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B20000] mb-4"></div>
        <p className="text-[#6F6F6F]">Loading your account information...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-135px)] bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-[560px] bg-white rounded-lg shadow-lg">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-[32px] font-bold text-[#6F6F6F] mb-2">
              Complete Your Profile
            </h1>
            <p className="text-lg text-[#6F6F6F] mb-2">
              Welcome to Ottawa Fun Sports League!
            </p>
            <p className="text-[#6F6F6F]">
              Please complete your profile to finish setting up your account.
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#6F6F6F]"
              >
                Full Name *
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className="w-full h-12 px-4 rounded-lg border border-[#D4D4D4] focus:border-[#B20000] focus:ring-[#B20000]"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-[#6F6F6F]"
              >
                Phone Number *
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="###-###-####"
                className="w-full h-12 px-4 rounded-lg border border-[#D4D4D4] focus:border-[#B20000] focus:ring-[#B20000]"
                value={formData.phone}
                onChange={handlePhoneChange}
                maxLength={12}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                We use your phone number for important league communications and emergency contact.
              </p>
            </div>
            
            <div className="space-y-2">
              <label
                htmlFor="preferred_position"
                className="block text-sm font-medium text-[#6F6F6F]"
              >
                Preferred Position (Optional)
              </label>
              <select
                id="preferred_position"
                className="w-full h-12 px-4 rounded-lg border border-[#D4D4D4] focus:border-[#B20000] focus:ring-[#B20000]"
                value={formData.preferred_position}
                onChange={(e) => setFormData({...formData, preferred_position: e.target.value})}
              >
                <option value="">Select position (optional)</option>
                <option value="Guard">Guard</option>
                <option value="Forward">Forward</option>
                <option value="Center">Center</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#6F6F6F]">
                Sports & Skill Levels *
              </label>
              <p className="text-xs text-gray-500 mb-4">
                Select the sports you're interested in playing and your skill level for each one.
              </p>
              <SportSkillSelector 
                value={formData.sports_skills}
                onChange={handleSportSkillChange}
                error={sportSkillError}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full h-12 bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] font-medium text-base"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Completing Profile...
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
            
            <p className="text-xs text-center text-gray-500 mt-4">
              By completing your profile, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}