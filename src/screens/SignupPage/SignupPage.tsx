import { useState, FormEvent } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { Loader2, ArrowRight } from "lucide-react";
import { SportSkillSelector } from "./SportSkillSelector";

interface SportSkill {
  sport_id: number;
  skill_id: number;
  sport_name?: string;
  skill_name?: string;
}

export function SignupPage() {
  // Form steps
  const [currentStep, setCurrentStep] = useState(1);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sportsSkills, setSportsSkills] = useState<SportSkill[]>([]);
  const [sportSkillError, setSportSkillError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

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
    setPhone(formattedPhone);
  };

  const handleStep1Submit = (e: FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!name || !email || !phone || !password) {
      console.log('Form validation failed: missing required fields');
      setError("All fields are required");
      return;
    }
    
    // Validate phone number format
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      console.log('Phone validation failed: not 10 digits');
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    
    if (emailError) {
      console.log('Email validation failed:', emailError);
      setError(emailError);
      return;
    }
    
    if (password !== confirmPassword) {
      console.log('Password validation failed: passwords do not match');
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 12) {
      console.log('Password validation failed: too short');
      setError("Password must be at least 12 characters");
      return;
    }
    
    setError(null);
    setCurrentStep(2);
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setGoogleLoading(true);
    console.log('Starting Google sign-up flow');
    
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        console.error('Google sign-up error:', error.message);
        setError(error.message);
        setGoogleLoading(false);
      } else {
        console.log('Google sign-up initiated successfully, redirecting to OAuth provider');
        // The redirect will happen automatically via the Google OAuth flow
        // Keep the loading state to show the user something is happening
      }
      // Note: Don't set loading to false here as the user will be redirected
      // The loading state will be reset when the component unmounts
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
      setGoogleLoading(false);
    }
  };

  // Check if email already exists
  const checkEmailExists = async (email: string) => {
    if (!email || !email.includes('@')) return;
    
    try {
      setEmailChecking(true);
      console.log('Checking if email exists:', email);
      setEmailError(null);
      
      // Check public.users table for existing email
      const { data: publicUsers, error: publicError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .limit(1);
        
      if (publicError) {
        console.error('Error checking public users:', publicError);
      }
      
      if (publicUsers && publicUsers.length > 0) {
        setEmailError('An account with this email already exists');
        console.log('Email already exists in users table');
      }
      
    } catch (error) {
      console.error('Error checking email:', error);
    } finally {
      setEmailChecking(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate sports and skills
    if (sportsSkills.length === 0) {
      setSportSkillError("Please select at least one sport and skill level");
      return;
    }
    
    setError(null);
    setSportSkillError(null);
    setLoading(true);
    
    try {
      // Step 1: Sign up with Supabase Auth
      console.log('Creating new user account with email:', email);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone: phone
          },
          emailRedirectTo: `${window.location.origin}/my-account/profile`
        }
      });
      
      if (authError) {
        // Handle specific rate limit error
        if (authError.message.includes('rate limit') || authError.message.includes('Email rate limit exceeded')) {
          console.error('Rate limit error during signup:', authError.message);
          setError("Too many signup attempts. Please wait a few minutes before trying again, or contact support if this persists.");
          return;
        }
        
        // Handle "User already registered" error
        if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
          console.error('User already exists error:', authError.message);
          setError("An account with this email already exists. Please try logging in instead.");
          return;
        }
        
        console.error('Auth error during signup:', authError.message);
        setError(authError.message);
        return;
      }
      
      if (!authData.user || !authData.user.id) {
        console.error('No user returned from signup');
        setError("Failed to create user account");
        return;
      }

      console.log('User account created successfully, user ID:', authData.user.id);
      
      // Step 2: Create user profile with sports and skills
      try {
        const { error: profileError } = await supabase
          .from('users')
          .update({
            user_sports_skills: sportsSkills
          })
          .eq('auth_id', authData.user.id);
          
        if (profileError) {
          console.error('Error updating user sports and skills:', profileError);
          // Continue anyway, as the basic account was created
        }
      } catch (profileError) {
        console.error('Error updating user profile:', profileError);
        // Continue anyway, as the basic account was created
      }
      
      // Step 2: Account created successfully, let AuthContext handle profile creation
      // Navigate to login page with success message
      console.log('Redirecting to login page with success message');
      navigate('/login', {
        state: { 
          message: "Account created successfully! Please check your email for verification instructions and then log in with your credentials." 
        } 
      });
      
    } catch (err) {
      console.error("Unexpected error during signup:", err);
      if (err instanceof Error) {
        console.error("Error details:", err.message);
      }
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-135px)] bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-[560px] bg-white rounded-lg shadow-lg">
        <CardContent className="p-8">
          <h1 className="text-[32px] font-bold text-center mb-8 text-[#6F6F6F]">
            {currentStep === 1 ? "Create Account" : "Select Your Sports"}
          </h1>
          
          {/* Step indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 1 ? 'bg-[#B20000] text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              1
            </div>
            <div className={`h-1 w-16 ${
              currentStep === 2 ? 'bg-[#B20000]' : 'bg-gray-200'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 2 ? 'bg-[#B20000] text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              2
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Google Sign Up Button */}
          <Button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading || loading}
            className="w-full h-12 bg-white hover:bg-gray-50 text-[#6F6F6F] border border-[#D4D4D4] rounded-[10px] font-medium text-base mb-6 flex items-center justify-center gap-3"
          >
            {googleLoading ? (
              "Signing up with Google..."
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          {currentStep === 1 ? (
            <>
              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#D4D4D4]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-[#6F6F6F]">Or continue with email</span>
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleStep1Submit}>
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[#6F6F6F]"
                  >
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full h-12 px-4 rounded-lg border border-[#D4D4D4] focus:border-[#B20000] focus:ring-[#B20000]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className={`w-full h-12 px-4 rounded-lg border ${
                        emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-[#D4D4D4] focus:border-[#B20000] focus:ring-[#B20000]'
                      }`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => checkEmailExists(email)}
                      required
                    />
                    {emailChecking && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                      </div>
                    )}
                  </div>
                  {emailError && (
                    <p className="mt-1 text-sm text-red-600">{emailError}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-[#6F6F6F]"
                  >
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="###-###-####"
                    className="w-full h-12 px-4 rounded-lg border border-[#D4D4D4] focus:border-[#B20000] focus:ring-[#B20000]"
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={12} // Limit to formatted length
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#6F6F6F]"
                  >
                    Password (minimum 12 characters)
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password (min 12 characters)"
                      className="w-full h-12 px-4 rounded-lg border border-[#D4D4D4] focus:border-[#B20000] focus:ring-[#B20000]"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <Eye className="h-5 w-5" />
                      ) : (
                        <EyeOff className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-[#6F6F6F]"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="w-full h-12 px-4 rounded-lg border border-[#D4D4D4] focus:border-[#B20000] focus:ring-[#B20000]"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <Eye className="h-5 w-5" />
                      ) : (
                        <EyeOff className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full h-12 bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] font-medium text-base"
                  disabled={loading || googleLoading}
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="mb-6 text-center">
                <p className="text-[#6F6F6F] mb-2">
                  <span className="font-medium">Tell us about your sports interests</span>
                </p>
                <p className="text-[#6F6F6F]">
                  Select the sports you're interested in playing and your skill level for each one.
                </p>
              </div>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <SportSkillSelector 
                  value={sportsSkills}
                  onChange={setSportsSkills}
                  error={sportSkillError}
                />
                
                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white rounded-[10px] font-medium text-base"
                  >
                    Back
                  </Button>
                  
                  <Button
                    type="submit"
                    className="flex-1 h-12 bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] font-medium text-base"
                    disabled={loading || googleLoading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </form>
            </>
          )}
          
          <div className="mt-6 text-center">
            <span className="text-[#6F6F6F]">Already have an account? </span>
            <Link to="/login" className="text-[#B20000] hover:underline font-bold">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}