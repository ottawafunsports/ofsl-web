import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { HeroBanner } from "../../components/HeroBanner";

const leagueTypes = [
  {
    title: "Volleyball",
    description: "Indoor and beach volleyball leagues for all skill levels",
    image: "/indoor-coed.png",
    link: "/volleyball",
  },
  {
    title: "Badminton",
    description: "Recreational and competitive badminton leagues",
    image: "/coed-badminton.png",
    link: "/badminton",
  },
  {
    title: "Pickleball",
    description:
      "Fast-paced pickleball leagues for beginners to advanced players",
    image: "/pickleball.png",
    link: "/pickleball",
  },
];

const upcomingSeasons = [
  {
    name: "Summer 2025 Indoor Volleyball",
    dates: "May 1 - August 30, 2025",
    status: "Registration Open",
    spots: "Limited spots available",
  },
  {
    name: "Summer 2025 Beach Volleyball",
    dates: "June 1 - August 31, 2025",
    status: "Registration Opening Soon",
    spots: "Waitlist available",
  },
  {
    name: "Summer 2025 Badminton",
    dates: "May 15 - August 15, 2025",
    status: "Registration Open",
    spots: "Spots available",
  },
];

export const LeaguesPage = (): JSX.Element => {
  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full relative">
        <HeroBanner
          image="/mask-group.png"
          imageAlt="Sports players"
          height="500px"
        >
          <div className="max-w-[1280px] mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl text-white mb-6 font-heading">
                Our Leagues
              </h1>
              <p className="text-xl text-white mb-8">
                Join Ottawa's most active sports community. Whether you're
                looking for competitive play or recreational fun, we have
                leagues for all skill levels.
              </p>
              <Button className="bg-white text-[#b20000] hover:bg-gray-100 rounded-[10px]">
                View Schedule & Standings
              </Button>
            </div>
          </div>
        </HeroBanner>

        {/* League Types */}
        <div className="max-w-[1280px] mx-auto px-4 py-16 md:py-24">
          <h2 className="text-3xl font-bold mb-16 text-center">
            Choose Your Sport
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {leagueTypes.map((league, index) => (
              <Link key={index} to={league.link}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow rounded-lg">
                  <img
                    src={league.image}
                    alt={league.title}
                    className="w-full h-[430px] object-cover rounded-t-lg"
                  />
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-4">{league.title}</h3>
                    <p className="text-gray-600">{league.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Seasons */}
        <div className="bg-gray-50 py-16 md:py-24">
          <div className="max-w-[1280px] mx-auto px-4">
            <h2 className="text-3xl font-bold mb-16 text-center">
              Upcoming Seasons
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {upcomingSeasons.map((season, index) => (
                <Card key={index} className="bg-white rounded-lg">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-4">{season.name}</h3>
                    <p className="text-gray-600 mb-4">{season.dates}</p>
                    <div className="flex items-center justify-between mt-6">
                      <span
                        className={`text-sm font-semibold ${
                          season.status === "Registration Open"
                            ? "text-green-600"
                            : "text-orange-600"
                        }`}
                      >
                        {season.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {season.spots}
                      </span>
                    </div>
                    <Button className="w-full mt-6 bg-[#b20000] hover:bg-[#8a0000] text-white rounded-[10px]">
                      Register Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* League Features */}
        <div className="max-w-[1280px] mx-auto px-4 py-16 md:py-24">
          <h2 className="text-3xl font-bold mb-16 text-center">
            What's Included
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#b20000] rounded-lg flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Organized Competition</h3>
              <p className="text-gray-600">
                Professional referees and structured leagues
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#b20000] rounded-lg flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Stats Tracking</h3>
              <p className="text-gray-600">Individual and team statistics</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#b20000] rounded-lg flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🏅</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Season Awards</h3>
              <p className="text-gray-600">Recognition for top performers</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#b20000] rounded-lg flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Community Events</h3>
              <p className="text-gray-600">Social gatherings and tournaments</p>
            </div>
          </div>
        </div>

        {/* Registration CTA */}
        <div className="bg-[#b20000] text-white py-16 md:py-24">
          <div className="max-w-[1280px] mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Join?</h2>
            <p className="text-xl mb-12">
              Don't miss out on the upcoming season. Register today!
            </p>
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-[#b20000] rounded-[10px]"
            >
              Register Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};