import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export const VolleyballPage = (): JSX.Element => {
  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1920px] relative">
        {/* Hero Section */}
        <div className="relative h-[500px]">
          <img
            src="/indoor-coed.png"
            alt="Volleyball players"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-5xl font-bold mb-4">Volleyball Leagues</h1>
              <p className="text-xl max-w-2xl mx-auto">
                Join Ottawa's premier volleyball leagues for all skill levels.
                Whether you're looking for competitive play or recreational fun,
                we have a division for you.
              </p>
            </div>
          </div>
        </div>

        {/* League Types Section */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Volleyball Programs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="overflow-hidden">
              <img
                src="/indoor-coed.png"
                alt="Coed League"
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Coed League</h3>
                <p className="text-gray-600 mb-4">
                  Mixed gender teams competing in a friendly yet competitive
                  environment.
                </p>
                <Button className="w-full bg-[#b20000] hover:bg-[#8a0000]">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <img
                src="/elite-womens.png"
                alt="Women's Elite"
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Women's Elite</h3>
                <p className="text-gray-600 mb-4">
                  High-level competition for experienced female players.
                </p>
                <Button className="w-full bg-[#b20000] hover:bg-[#8a0000]">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <img
                src="/indoor-coed.png"
                alt="Men's League"
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Men's League</h3>
                <p className="text-gray-600 mb-4">
                  Competitive divisions for male players of all skill levels.
                </p>
                <Button className="w-full bg-[#b20000] hover:bg-[#8a0000]">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Registration CTA */}
        <div className="bg-[#b20000] text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
            <p className="text-xl mb-8">
              Registration for Summer 2025 season is now open!
            </p>
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-[#b20000]"
            >
              Register Now
            </Button>
          </div>
        </div>

        {/* League Information */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">League Details</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="font-bold mr-2">Season Length:</span>
                  12 weeks + playoffs
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">Game Times:</span>
                  Weekday evenings between 6:30 PM and 10:30 PM
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">Location:</span>
                  Various gymnasiums across Ottawa
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">Team Size:</span>
                  6-12 players per team
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">What's Included</h3>
              <ul className="space-y-4">
                <li>Professional referees</li>
                <li>Online schedule and standings</li>
                <li>End of season playoffs</li>
                <li>Player statistics</li>
                <li>Team and individual awards</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

