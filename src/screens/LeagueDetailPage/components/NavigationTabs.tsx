interface NavigationTabsProps {
  activeView: 'info' | 'schedule' | 'standings';
  setActiveView: (view: 'info' | 'schedule' | 'standings') => void;
  sport: string;
}

export function NavigationTabs({ activeView, setActiveView, sport }: NavigationTabsProps) {
  return (
    <div className="flex border-b border-gray-200 mb-8">
      <div className="flex flex-grow">
        <div 
          onClick={() => setActiveView('info')}
          className={`px-6 py-3 text-center cursor-pointer relative transition-all ${
            activeView === 'info' 
              ? 'text-[#B20000] font-medium' 
              : 'text-[#6F6F6F] hover:text-[#B20000]'
          }`}
        >
          <span>Details</span>
          {activeView === 'info' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B20000]"></div>
          )}
        </div>
        
        {/* Only show Schedule & Standings tabs for Volleyball */}
        {sport === 'Volleyball' && (
          <>
            <div 
              onClick={() => setActiveView('schedule')}
              className={`px-6 py-3 text-center cursor-pointer relative transition-all ${
                activeView === 'schedule' 
                  ? 'text-[#B20000] font-medium' 
                  : 'text-[#6F6F6F] hover:text-[#B20000]'
              }`}
            >
              <span>Schedule</span>
              {activeView === 'schedule' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B20000]"></div>
              )}
            </div>
            
            <div 
              onClick={() => setActiveView('standings')}
              className={`px-6 py-3 text-center cursor-pointer relative transition-all ${
                activeView === 'standings' 
                  ? 'text-[#B20000] font-medium' 
                  : 'text-[#6F6F6F] hover:text-[#B20000]'
              }`}
            >
              <span>Standings</span>
              {activeView === 'standings' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B20000]"></div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

