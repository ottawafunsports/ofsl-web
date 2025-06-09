import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's no hash, scroll to top
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    // Wait for the DOM to be fully rendered
    setTimeout(() => {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      
      if (element) {
        // Get the height of the fixed header
        // 108px is the approximate height of the header + announcement bar
        const headerOffset = 108;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }, 0);
  }, [pathname, hash]);

  return null;
}