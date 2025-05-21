import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "../../components/ui/navigation-menu";

const leagueTypes = [
  {
    title: "Volleyball",
    description: "Indoor and beach volleyball leagues for all skill levels",
    image: "/indoor-coed.png",
    link: "/volleyball"
  },
  {
    title: "Badminton",
    description: "Recreational and competitive badminton leagues",
    image: "/coed-badminton.png",
    link: "/badminton"
  },
  {
    title: "Pickleball",
    description: "Fast-paced pickleball leagues for beginners to advanced players",
    image: "/pickleball.png",
    link: "/pickleball"
  }
];

const upcomingSeasons = [
  {
    name: "Summer 2025 Indoor Volleyball",
    dates: "May 1 - August 30, 2025",
    status: "Registration Open",
    spots: "Limited spots available"
  },
  {
    name: "Summer 2025 Beach Volleyball",
    dates: "June 1 - August 31, 2025",
    status: "Registration Opening Soon",
    spots: "Waitlist available"
  },
  {
    name: "Summer 2025 Badminton",
    dates: "May 15 - August 15, 2025",
    status: "Registration Open",
    spots: "Spots available"
  }
];

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

        {/* Hero Section */}
        <div className="relative h-[400px] bg-[#b20000]">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold text-white mb-6">Our Leagues</h1>
              <p className="text-xl text-white mb-8">
                Join Ottawa's most active sports community. Whether you're looking for competitive play or recreational fun, 
                we have leagues for all skill levels.
              </p>
              <Button className="bg-white text-[#b20000] hover:bg-gray-100">
                View Schedule & Standings
              </Button>
            </div>
          </div>
        </div>

        {/* League Types */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-12 text-center">Choose Your Sport</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leagueTypes.map((league, index) => (
              <Link key={index} to={league.link}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <img src={league.image} alt={league.title} className="w-full h-48 object-cover" />
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{league.title}</h3>
                    <p className="text-gray-600">{league.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Seasons */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Upcoming Seasons</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingSeasons.map((season, index) => (
                <Card key={index} className="bg-white">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{season.name}</h3>
                    <p className="text-gray-600 mb-2">{season.dates}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className={`text-sm font-semibold ${
                        season.status === "Registration Open" ? "text-green-600" : "text-orange-600"
                      }`}>
                        {season.status}
                      </span>
                      <span className="text-sm text-gray-500">{season.spots}</span>
                    </div>
                    <Button className="w-full mt-4 bg-[#b20000] hover:bg-[#8a0000] text-white">
                      Register Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* League Features */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-12 text-center">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#b20000] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Organized Competition</h3>
              <p className="text-gray-600">Professional referees and structured leagues</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#b20000] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Stats Tracking</h3>
              <p className="text-gray-600">Individual and team statistics</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#b20000] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🏅</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Season Awards</h3>
              <p className="text-gray-600">Recognition for top performers</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#b20000] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Community Events</h3>
              <p className="text-gray-600">Social gatherings and tournaments</p>
            </div>
          </div>
        </div>

        {/* Registration CTA */}
        <div className="bg-[#b20000] text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
            <p className="text-xl mb-8">Don't miss out on the upcoming season. Register today!</p>
            <Button 
              variant="outline" 
              className="text-white border-white hover:bg-white hover:text-[#b20000]"
            >
              Register Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};