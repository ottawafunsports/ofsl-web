import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "../../components/ui/navigation-menu";

export const LeaguesPage = (): JSX.Element => {
  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1920px] relative">
        {/* Announcement bar */}
        <div className="w-full h-[38px] bg-black flex items-center justify-center">
          <div className="font-normal text-white text-base text-center leading-6">
            <span className="tracking-[0.08px]">
              Summer 2025 leagues registration is now open!&nbsp;&nbsp;
            </span>
            <Link to="/leagues" className="tracking-[var(--m3-body-large-letter-spacing)] leading-[var(--m3-body-large-line-height)] underline font-m3-body-large font-[number:var(--m3-body-large-font-weight)] text-[length:var(--m3-body-large-font-size)]">
              Register now
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="w-full h-[97px] [background:linear-gradient(180deg,rgba(178,0,0,1)_0%,rgba(120,18,18,1)_100%)]">
          <div className="container mx-auto px-4 flex items-center justify-between h-full">
            {/* Logo */}
            <Link to="/" className="relative h-[46px] w-[230px]">
              <img
                className="w-[217px] h-[46px]"
                alt="OFSL Logo"
                src="/group-1.png"
              />
            </Link>

            {/* Navigation */}
            <NavigationMenu className="mx-auto">
              <NavigationMenuList className="flex gap-8">
                <NavigationMenuItem>
                  <Link to="/volleyball" className="font-m3-title-large font-[number:var(--m3-title-large-font-weight)] text-white text-[length:var(--m3-title-large-font-size)] tracking-[var(--m3-title-large-letter-spacing)] leading-[var(--m3-title-large-line-height)] whitespace-nowrap [font-style:var(--m3-title-large-font-style)]">
                    Volleyball
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className="font-m3-title-large font-[number:var(--m3-title-large-font-weight)] text-white text-[length:var(--m3-title-large-font-size)] tracking-[var(--m3-title-large-letter-spacing)] leading-[var(--m3-title-large-line-height)] whitespace-nowrap [font-style:var(--m3-title-large-font-style)]">
                    Badminton
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className="font-m3-title-large font-[number:var(--m3-title-large-font-weight)] text-white text-[length:var(--m3-title-large-font-size)] tracking-[var(--m3-title-large-letter-spacing)] leading-[var(--m3-title-large-line-height)] whitespace-nowrap [font-style:var(--m3-title-large-font-style)]">
                    Pickleball
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/leagues" className="font-m3-title-large font-[number:var(--m3-title-large-font-weight)] text-white text-[length:var(--m3-title-large-font-size)] tracking-[var(--m3-title-large-letter-spacing)] leading-[var(--m3-title-large-line-height)] whitespace-nowrap [font-style:var(--m3-title-large-font-style)]">
                    Leagues
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Login button */}
            <Button
              variant="outline"
              className="bg-[#0000002e] text-white border-white rounded-[10px] px-[25px] py-2.5"
            >
              <span className="font-m3-title-large font-[number:var(--m3-title-large-font-weight)] text-[length:var(--m3-title-large-font-size)] tracking-[var(--m3-title-large-letter-spacing)] leading-[var(--m3-title-large-line-height)] whitespace-nowrap [font-style:var(--m3-title-large-font-style)]">
                Login
              </span>
            </Button>
          </div>
        </div>

        {/* Content will be added based on the Figma design */}
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-4">Leagues Page</h1>
          <p>Content coming soon based on the Figma design...</p>
        </div>
      </div>
    </div>
  );
};