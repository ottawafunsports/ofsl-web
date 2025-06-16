import { useState } from "react";
import { LeagueData } from "../../hooks/useLeagueData";
import { LeagueInfo } from "./LeagueInfo";
import { LeagueSchedule } from "./LeagueSchedule";
import { LeagueStandings } from "./LeagueStandings";

interface LeagueTabsProps {
  league: LeagueData;
}

export function LeagueTabs({ league }: LeagueTabsProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'schedule' | 'standings'>('details');

  const tabs = [
    { id: 'details' as const, label: 'Details' },
    { id: 'schedule' as const, label: 'Schedule' },
    { id: 'standings' as const, label: 'Standings' }
  ];

  const getTabClasses = (tabId: string) => {
    const baseClasses = "px-6 py-3 font-medium text-sm rounded-t-lg transition-colors duration-200 border-b-2";
    const activeClasses = "text-[#B20000] border-[#B20000] bg-white";
    const inactiveClasses = "text-[#6F6F6F] border-transparent hover:text-[#B20000] hover:border-[#B20000] bg-gray-50";
    
    return `${baseClasses} ${activeTab === tabId ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={getTabClasses(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'details' && (
          <div className="animate-fadeIn">
            <LeagueInfo league={league} />
          </div>
        )}
        
        {activeTab === 'schedule' && (
          <div className="animate-fadeIn">
            <LeagueSchedule league={league} />
          </div>
        )}
        
        {activeTab === 'standings' && (
          <div className="animate-fadeIn">
            <LeagueStandings league={league} />
          </div>
        )}
      </div>
    </div>
  );
}