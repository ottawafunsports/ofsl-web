import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { AnnouncementBar } from "./AnnouncementBar";
import { Footer } from "./Footer";

export function Layout() {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [isCompactHeader, setIsCompactHeader] = useState(false);
  const prevScrollY = useRef(0);
  const ticking = useRef(false);
  const lastStateChangeTime = useRef(0);

  useEffect(() => {
    // Thresholds with hysteresis to prevent flickering
    const COMPACT_THRESHOLD = 50; // When to switch to compact when scrolling down
    const EXPAND_THRESHOLD = 40; // When to switch to expanded when scrolling up
    const ANNOUNCEMENT_HIDE_THRESHOLD = 10;
    const ANNOUNCEMENT_SHOW_THRESHOLD = 0; // Changed to 0 to ensure it always shows at the top
    const STATE_CHANGE_DELAY = 100; // Minimum ms between state changes

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const now = Date.now();
          const scrollingDown = currentScrollY > prevScrollY.current;
          const timeSinceLastChange = now - lastStateChangeTime.current;
          
          // Only process state changes if we've waited long enough
          if (timeSinceLastChange > STATE_CHANGE_DELAY) {
            // Announcement bar logic with hysteresis
            if (scrollingDown && currentScrollY > ANNOUNCEMENT_HIDE_THRESHOLD && showAnnouncement) {
              setShowAnnouncement(false);
              lastStateChangeTime.current = now;
            } else if (currentScrollY <= ANNOUNCEMENT_SHOW_THRESHOLD && !showAnnouncement) {
              // Always show announcement when at the top, regardless of scroll direction
              setShowAnnouncement(true);
              lastStateChangeTime.current = now;
            }
            
            // Compact header logic with hysteresis
            if (scrollingDown && currentScrollY > COMPACT_THRESHOLD && !isCompactHeader) {
              setIsCompactHeader(true);
              lastStateChangeTime.current = now;
            } else if (!scrollingDown && currentScrollY < EXPAND_THRESHOLD && isCompactHeader) {
              setIsCompactHeader(false);
              lastStateChangeTime.current = now;
            }
          }
          
          prevScrollY.current = currentScrollY;
          ticking.current = false;
        });
        
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAnnouncement, isCompactHeader]);

  return (
    <div className="bg-white w-full">
      <div className="sticky top-0 z-50">
        <div 
          className="relative h-0 transform-gpu will-change-transform"
          style={{ 
            height: showAnnouncement ? '42px' : '0px',
            transition: 'height 500ms cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <div 
            className="absolute w-full"
            style={{ 
              opacity: showAnnouncement ? '1' : '0',
              transform: showAnnouncement ? 'translateY(0)' : 'translateY(-100%)',
              transition: 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), transform 500ms cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <AnnouncementBar />
          </div>
        </div>
        <Header isCompact={isCompactHeader} />
      </div>
      <Outlet />
      <Footer />
    </div>
  );
}