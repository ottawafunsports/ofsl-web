import React from 'react';

interface TabNavigationProps {
  activeTab: 'details' | 'schedule' | 'standings';
  setActiveTab: (tab: 'details' | 'schedule' | 'standings') => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  const getTabClasses = (tab: string) => {
    return `px-6 py-3 font-medium text-lg border-b-2 transition-colors ${
      activeTab === tab
        ? 'border-[#B20000] text-[#B20000]'
        : 'border-transparent text-[#6F6F6F] hover:text-[#B20000]'
    }`;
  };

  return (
    <div className="flex border-b border-gray-200 mb-8">
      <button
        onClick={() => setActiveTab('details')}
        className={getTabClasses('details')}
      >
        League Details
      </button>
      <button
        onClick={() => setActiveTab('schedule')}
        className={getTabClasses('schedule')}
      >
        Schedule
      </button>
      <button
        onClick={() => setActiveTab('standings')}
        className={getTabClasses('standings')}
      >
        Standings
      </button>
    </div>
  );
};