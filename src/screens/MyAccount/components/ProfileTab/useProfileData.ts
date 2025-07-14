import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Profile, Sport, Skill, SportSkill } from './types';
import { INITIAL_PROFILE, INITIAL_NOTIFICATIONS } from './constants';

export function useProfileData(userProfile: any) {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [sports, setSports] = useState<Sport[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loadingSportsSkills, setLoadingSportsSkills] = useState(false);

  // Load sports and skills data
  useEffect(() => {
    const loadSportsAndSkills = async () => {
      try {
        setLoadingSportsSkills(true);
        
        // Load sports and skills in parallel
        const [sportsResponse, skillsResponse] = await Promise.all([
          supabase.from('sports').select('id, name').eq('active', true).order('name'),
          supabase.from('skills').select('id, name, description').order('order_index')
        ]);
        
        if (sportsResponse.error) throw sportsResponse.error;
        if (skillsResponse.error) throw skillsResponse.error;
        
        setSports(sportsResponse.data || []);
        setSkills(skillsResponse.data || []);
        
        // If we have user_sports_skills, enrich them with names
        if (userProfile?.user_sports_skills && userProfile.user_sports_skills.length > 0) {
          const enrichedSportsSkills = userProfile.user_sports_skills.map((item: SportSkill) => {
            const sport = sportsResponse.data?.find(s => s.id === item.sport_id);
            const skill = skillsResponse.data?.find(s => s.id === item.skill_id);
            
            return {
              ...item,
              sport_name: sport?.name,
              skill_name: skill?.name
            };
          });
          
          setProfile(prev => ({
            ...prev,
            user_sports_skills: enrichedSportsSkills
          }));
        }
      } catch (error) {
        console.error('Error loading sports and skills:', error);
      } finally {
        setLoadingSportsSkills(false);
      }
    };
    
    loadSportsAndSkills();
  }, [userProfile?.user_sports_skills]);

  // Update profile when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setProfile({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        email: userProfile.email || '',
        preferred_position: userProfile.preferred_position || '',
        user_sports_skills: userProfile.user_sports_skills || []
      });
    }
  }, [userProfile]);

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return {
    profile,
    notifications,
    sports,
    skills,
    loadingSportsSkills,
    setProfile,
    handleNotificationToggle
  };
}