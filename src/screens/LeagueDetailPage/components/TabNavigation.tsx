import React from 'react';

interface TabNavigationProps {
  activeTab: 'details' | 'schedule' | 'standings';
  onTabChange: (tab: 'details' | 'schedule' | 'standings') => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'details' as const, label: 'Details' },
    { id: 'schedule' as const, label: 'Schedule' },
    { id: 'standings' as const, label: 'Standings' },
  ];

  return (
    <div className="border-b border-gray-200 mb-8">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-lg transition-colors ${
              activeTab === tab.id
                ? 'border-[#B20000] text-[#B20000]'
                : 'border-transparent text-[#6F6F6F] hover:text-[#B20000] hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}