import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { MapPin, Calendar, Clock, DollarSign, Users } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { TeamRegistrationModal } from "./TeamRegistrationModal";
import { PaymentButton } from "../../../components/PaymentButton";
import { products } from "../../../stripe-config";
import { supabase } from "../../../lib/supabase";
import { useEffect } from "react";

// Function to get spots badge color
const getSpotsBadgeColor = (spots: number) => {
  if (spots === 0) return "bg-red-100 text-red-800";
  if (spots <= 3) return "bg-orange-100 text-orange-800";
  return "bg-green-100 text-green-800";
};

// Function to get spots text
const getSpotsText = (spots: number) => {
  if (spots === 0) return "Full";
  if (spots === 1) return "1 spot left";
  return `${spots} spots left`;
};

interface LeagueInfoProps {
  league: any;
  sport: string;
  onSpotsUpdate?: (spots: number) => void;
}

export function LeagueInfo({ league, sport, onSpotsUpdate }: LeagueInfoProps) {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [actualSpotsRemaining, setActualSpotsRemaining] = useState(league.spotsRemaining || 0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadActualTeamCount();
  }, [league.id]);

  const loadActualTeamCount = async () => {
    try {
      const { data: teams, error } = await supabase
        .from('teams')
        .select('id')
        .eq('league_id', league.id)
        .eq('active', true);

      if (error) throw error;

      const teamCount = teams?.length || 0;
      const maxTeams = league.max_teams || 20;
      const spotsRemaining = Math.max(0, maxTeams - teamCount);
      
      setActualSpotsRemaining(spotsRemaining);
      
      // Notify parent component of the update
      if (onSpotsUpdate) {
        onSpotsUpdate(spotsRemaining);
      }
    } catch (error) {
      console.error('Error loading team count:', error);
    }
  };

  const handleRegisterClick = () => {
    if (!user) {
      // Store the current page URL for redirect after login
      const currentPath = window.location.pathname;
      localStorage.setItem('redirectAfterLogin', currentPath);
      navigate('/login');
      return;
    }
    
    // User is logged in, show registration modal
    setShowRegistrationModal(true);
  };

  // Find matching product for this league
  const matchingProduct = products.find(product => 
    product.name.toLowerCase().includes(league.name.toLowerCase()) ||
    league.name.toLowerCase().includes(product.name.toLowerCase())
  );

  return (
    <>
      <div className="bg-gray-100 rounded-lg p-6 mb-6">
        {/* League Details */}
        <div className="space-y-4 mb-6">
          {/* Day & Time */}
          <div className="flex items-start">
            <Clock className="h-4 w-4 text-[#B20000] mr-2 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-[#6F6F6F]">{league.day}</p>
              {league.playTimes.map((time: string, index: number) => (
                <p key={index} className="text-sm text-[#6F6F6F]">
                  {time}
                </p>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start">
            <MapPin className="h-4 w-4 text-[#B20000] mr-2 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-[#6F6F6F]">{league.location}</p>
              {league.specificLocation && (
                <p className="text-sm text-[#6F6F6F]">
                  {league.specificLocation}
                </p>
              )}
            </div>
          </div>

          {/* Season Dates */}
          <div className="flex items-start">
            <Calendar className="h-4 w-4 text-[#B20000] mr-2 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-[#6F6F6F]">Season Dates</p>
              <p className="text-sm text-[#6F6F6F]">{league.dates}</p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-start">
            <DollarSign className="h-4 w-4 text-[#B20000] mr-2 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-[#6F6F6F]">Price</p>
              <p className="text-sm text-[#6F6F6F]">
                ${league.price}{" "}
                {sport === "Volleyball" ? "per team" : "per player"}
              </p>
            </div>
          </div>

          {/* Spots Remaining */}
          <div className="flex items-start">
            <Users className="h-4 w-4 text-[#B20000] mr-2 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-[#6F6F6F]">Availability</p>
              <span
                className={`text-xs font-medium py-1 px-3 rounded-full ${getSpotsBadgeColor(actualSpotsRemaining)}`}
              >
                {getSpotsText(actualSpotsRemaining)}
              </span>
            </div>
          </div>
        </div>

        {/* Register Button or Payment Button */}
        {matchingProduct ? (
          <PaymentButton
            priceId={matchingProduct.priceId}
            productName={matchingProduct.name}
            mode={matchingProduct.mode}
            className="border-[#B20000] text-[#B20000] hover:bg-[#B20000] hover:text-white rounded-[10px] w-full py-3"
            variant="outline" 
          >
            {actualSpotsRemaining === 0 ? "Join Waitlist" : "Register & Pay Now"}
          </PaymentButton>
        ) : (
          <Button
            onClick={handleRegisterClick}
            variant="outline"
            className="border-[#B20000] text-[#B20000] hover:bg-[#B20000] hover:text-white rounded-[10px] w-full py-3"
            disabled={actualSpotsRemaining === 0}
          >
            {actualSpotsRemaining === 0 ? "Join Waitlist" : "Register Now"}
          </Button>
        )}
      </div>

      {/* Registration Modal */}
      <TeamRegistrationModal
        showModal={showRegistrationModal}
        closeModal={() => {
          setShowRegistrationModal(false);
          // Reload team count after registration
          loadActualTeamCount();
        }}
        leagueId={league.id}
        leagueName={league.name}
        league={league}
      />
    </>
  );
}