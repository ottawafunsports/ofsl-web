import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

export function GoogleSignupRedirect() {
  const { user, userProfile, loading, refreshUserProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Populate form with user data when available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        email: user.email || '',
        phone: userProfile?.phone || ''
      });
      setInitialLoading(false);
    } else if (!loading) {
      // If no user and not loading, redirect to login
      navigate('/login');
    }
  }, [user, userProfile, loading]);

  // If user already has a complete profile, redirect to teams page
  useEffect(() => {
    if (userProfile && !loading && !initialLoading) {
      const isComplete = userProfile.name && userProfile.phone && 
        userProfile.name.trim() !== '' && userProfile.phone.trim() !== '';
      
      if (isComplete) {
        const redirectPath = localStorage.getItem('redirectAfterLogin') || '/my-account/teams';
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      }
    }
  }, [userProfile, loading, initialLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
    
    setError(null);
    setSubmitting(true);
    
    try {
      // Update the user profile
      const { error } = await supabase
        .from('users')
        .update({
          name: formData.name,
          phone: formData.phone,
          date_modified: new Date().toISOString()
        })
        .eq('auth_id', user?.id);
      
      if (error) throw error;
      
      // Refresh the user profile
      await refreshUserProfile();
      
      // Redirect to the intended destination
      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/my-account/teams';
      localStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath);
      
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  // Phone number formatting function
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const phoneNumber = value.replace(/\D/g, '');
    
    // Format as ###-###-####
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    } else {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };

  // Handle phone number input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setFormData({...formData, phone: formattedPhone});
  };

  if (loading || initialLoading) {
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
          <h1 className="text-[32px] font-bold text-center mb-8 text-[#6F6F6F]">
            Complete Your Profile
          </h1>
          
          <div className="mb-6 text-center">
            <p className="text-[#6F6F6F]">
              Thanks for signing up with Google! Please provide a few more details to complete your profile.
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
                htmlFor="email"
                className="block text-sm font-medium text-[#6F6F6F]"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Your email address"
                className="w-full h-12 px-4 rounded-lg border border-[#D4D4D4] focus:border-[#B20000] focus:ring-[#B20000] bg-gray-100"
                value={formData.email}
                disabled
                readOnly
              />
              <p className="text-xs text-gray-500">
                Email address is provided by Google and cannot be changed.
              </p>
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
                maxLength={12} // Limit to formatted length
                required
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}