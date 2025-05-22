import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "./ui/navigation-menu";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getLinkClasses = (path: string) => {
    return `relative text-white font-medium py-2 transition-colors hover:text-white
      before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-0.5 
      before:bg-white before:transition-transform before:duration-300
      ${isActive(path) ? 'before:scale-x-100' : 'before:scale-x-0 hover:before:scale-x-100'}`;
  };

  const getMobileLinkClasses = (path: string) => {
    return `text-white text-lg py-2 px-4 transition-colors duration-200
      ${isActive(path) ? 'bg-white/20' : 'hover:bg-white/10'} rounded-lg`;
  };

  return (
    <div className="w-full h-[97px] [background:linear-gradient(180deg,rgba(178,0,0,1)_0%,rgba(120,18,18,1)_100%)]">
      <div className="max-w-[1920px] mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="relative h-[46px] w-[230px]">
          <img
            className="w-[217px] h-[46px]"
            alt="OFSL Logo"
            src="/group-1.png"
          />
        </Link>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:block mx-auto">
          <NavigationMenuList className="flex gap-8">
            <NavigationMenuItem>
              <Link 
                to="/volleyball" 
                className={getLinkClasses("/volleyball")}
              >
                Volleyball
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link 
                to="/badminton"
                className={getLinkClasses("/badminton")}
              >
                Badminton
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link 
                to="/pickleball"
                className={getLinkClasses("/pickleball")}
              >
                Pickleball
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link 
                to="/leagues" 
                className={getLinkClasses("/leagues")}
              >
                Leagues
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Login button */}
        <Link 
          to="/login" 
          className={`hidden lg:block relative text-white font-medium py-2 px-6 transition-all duration-200
            before:content-[''] before:absolute before:inset-0 before:bg-white/10 before:rounded-lg
            hover:before:bg-white/20`}
        >
          Login
        </Link>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[135px] bg-[#B20000] z-50">
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-4">
                <Link 
                  to="/volleyball" 
                  className={getMobileLinkClasses("/volleyball")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Volleyball
                </Link>
                <Link 
                  to="/badminton" 
                  className={getMobileLinkClasses("/badminton")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Badminton
                </Link>
                <Link 
                  to="/pickleball" 
                  className={getMobileLinkClasses("/pickleball")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pickleball
                </Link>
                <Link 
                  to="/leagues" 
                  className={getMobileLinkClasses("/leagues")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Leagues
                </Link>
                <Link 
                  to="/login" 
                  className={getMobileLinkClasses("/login")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}