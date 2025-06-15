import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { UserPlus, X } from "lucide-react";

interface RegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  leagueName: string;
  sport: string;
  onSubmit: (formData: any) => void;
}

export function RegistrationForm({ isOpen, onClose, leagueName, sport, onSubmit }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    teamName: '',
    captainName: '',
    captainEmail: '',
    captainPhone: '',
    players: [''],
    additionalInfo: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...formData.players];
    newPlayers[index] = value;
    setFormData(prev => ({
      ...prev,
      players: newPlayers
    }));
  };

  const addPlayer = () => {
    setFormData(prev => ({
      ...prev,
      players: [...prev.players, '']
    }));
  };

  const removePlayer = (index: number) => {
    if (formData.players.length > 1) {
      const newPlayers = formData.players.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        players: newPlayers
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#6F6F6F] flex items-center">
              <UserPlus className="h-6 w-6 mr-2 text-[#B20000]" />
              Register for {leagueName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {sport === "Volleyball" && (
              <div>
                <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                  Team Name *
                </label>
                <Input
                  value={formData.teamName}
                  onChange={(e) => handleInputChange('teamName', e.target.value)}
                  placeholder="Enter your team name"
                  className="w-full"
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                  {sport === "Volleyball" ? "Captain Name" : "Your Name"} *
                </label>
                <Input
                  value={formData.captainName}
                  onChange={(e) => handleInputChange('captainName', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={formData.captainEmail}
                  onChange={(e) => handleInputChange('captainEmail', e.target.value)}
                  placeholder="Enter your email"
                  className="w-full"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                Phone Number *
              </label>
              <Input
                type="tel"
                value={formData.captainPhone}
                onChange={(e) => handleInputChange('captainPhone', e.target.value)}
                placeholder="Enter your phone number"
                className="w-full"
                required
              />
            </div>

            {sport === "Volleyball" && (
              <div>
                <label className="block text-sm font-medium text-[#6F6F6F] mb-2">
                  Team Players
                </label>
                {formData.players.map((player, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      value={player}
                      onChange={(e) => handlePlayerChange(index, e.target.value)}
                      placeholder={`Player ${index + 1} name`}
                      className="flex-1"
                    />
                    {formData.players.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePlayer(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addPlayer}
                  variant="outline"
                  className="mt-2"
                >
                  Add Player
                </Button>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#6F6F6F] mb-1">
                Additional Information
              </label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                placeholder="Any additional information or special requests..."
                className="w-full px-3 py-2 border rounded-md text-sm"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="bg-[#B20000] hover:bg-[#8A0000] text-white flex-1"
              >
                Submit Registration
              </Button>
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}