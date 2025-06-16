import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useRegistration, RegistrationData } from "../../hooks/useRegistration";
import { LeagueData } from "../../hooks/useLeagueData";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  league: LeagueData;
}

export function RegistrationModal({ isOpen, onClose, league }: RegistrationModalProps) {
  const { user } = useAuth();
  const { submitRegistration, isSubmitting, submitStatus, resetStatus } = useRegistration();
  
  const [formData, setFormData] = useState<RegistrationData>({
    playerName: '',
    email: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    experience: '',
    position: '',
    teamName: '',
    isTeamCaptain: false,
    agreeToTerms: false
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      resetStatus();
      // Pre-fill with user data if available
      if (user) {
        setFormData(prev => ({
          ...prev,
          playerName: user.user_metadata?.name || '',
          email: user.email || '',
          phone: user.user_metadata?.phone || ''
        }));
      }
    }
  }, [isOpen, user, resetStatus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    const result = await submitRegistration(formData, league.id);
    
    if (result.success) {
      // Keep modal open to show success message
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white rounded-lg max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#6F6F6F]">
              Register for {league.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              <h3 className="font-bold">Registration Successful!</h3>
              <p>Thank you for registering. You'll receive a confirmation email shortly.</p>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              Registration failed. Please try again or contact support.
            </div>
          )}

          {/* Registration Form */}
          {submitStatus !== 'success' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-[#6F6F6F] mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                      Full Name *
                    </label>
                    <Input
                      name="playerName"
                      value={formData.playerName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                      Email *
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                      Phone Number *
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                      Preferred Position
                    </label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 rounded-lg border border-[#D4D4D4] focus:border-[#B20000] focus:ring-[#B20000] focus:outline-none"
                    >
                      <option value="">Select position</option>
                      {league.sport === 'Volleyball' && (
                        <>
                          <option value="setter">Setter</option>
                          <option value="outside">Outside Hitter</option>
                          <option value="middle">Middle Blocker</option>
                          <option value="opposite">Opposite</option>
                          <option value="libero">Libero</option>
                          <option value="any">Any Position</option>
                        </>
                      )}
                      {league.sport === 'Badminton' && (
                        <>
                          <option value="singles">Singles</option>
                          <option value="doubles">Doubles</option>
                          <option value="both">Both</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-semibold text-[#6F6F6F] mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                      Emergency Contact Name *
                    </label>
                    <Input
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      placeholder="Emergency contact name"
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                      Emergency Contact Phone *
                    </label>
                    <Input
                      name="emergencyPhone"
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={handleInputChange}
                      placeholder="Emergency contact phone"
                      required
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                  Experience Level *
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="Briefly describe your experience with this sport..."
                  required
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-[#D4D4D4] focus:border-[#B20000] focus:ring-[#B20000] focus:outline-none resize-none"
                />
              </div>

              {/* Team Information (for team sports) */}
              {league.sport === 'Volleyball' && (
                <div>
                  <h3 className="text-lg font-semibold text-[#6F6F6F] mb-4">Team Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                        Team Name (if registering as a team)
                      </label>
                      <Input
                        name="teamName"
                        value={formData.teamName}
                        onChange={handleInputChange}
                        placeholder="Enter team name (optional)"
                        className="w-full"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isTeamCaptain"
                        checked={formData.isTeamCaptain}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300 text-[#B20000] focus:ring-[#B20000]"
                      />
                      <label className="ml-2 text-sm text-[#6F6F6F]">
                        I am the team captain
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  required
                  className="h-4 w-4 rounded border-gray-300 text-[#B20000] focus:ring-[#B20000] mt-1"
                />
                <label className="ml-2 text-sm text-[#6F6F6F]">
                  I agree to the{" "}
                  <a href="/terms" className="text-[#B20000] underline">
                    terms and conditions
                  </a>{" "}
                  and{" "}
                  <a href="/standards-of-play" className="text-[#B20000] underline">
                    standards of play
                  </a>
                  *
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#B20000] hover:bg-[#8A0000] text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : `Register for $${league.price}`}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}