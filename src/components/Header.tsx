import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "./ui/navigation-menu";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              <Link to="/volleyball" className="text-white hover:text-gray-200 transition-colors">
                Volleyball
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="text-white hover:text-gray-200 transition-colors">
                Badminton
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="text-white hover:text-gray-200 transition-colors">
                Pickleball
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/leagues" className="text-white hover:text-gray-200 transition-colors">
                Leagues
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Login button */}
        <Link to="/login" className="hidden lg:block">
          <Button
            variant="outline"
            className="bg-white hover:bg-gray-50 text-primary border-white rounded-lg px-6 py-2 transition-all duration-200"
          >
            Login
          </Button>
        </Link>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[135px] bg-[#B20000] z-50">
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-4">
                <Link 
                  to="/volleyball" 
                  className="text-white text-lg py-2 hover:bg-white/10 rounded-lg px-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Volleyball
                </Link>
                <Link 
                  to="/badminton" 
                  className="text-white text-lg py-2 hover:bg-white/10 rounded-lg px-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Badminton
                </Link>
                <Link 
                  to="/pickleball" 
                  className="text-white text-lg py-2 hover:bg-white/10 rounded-lg px-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pickleball
                </Link>
                <Link 
                  to="/leagues" 
                  className="text-white text-lg py-2 hover:bg-white/10 rounded-lg px-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Leagues
                </Link>
                <Link 
                  to="/login" 
                  className="text-white text-lg py-2 hover:bg-white/10 rounded-lg px-4"
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