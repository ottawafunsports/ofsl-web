import React from "react";
import { Button } from "../../components/ui/button";
import { HeroBanner } from "../../components/HeroBanner";
import { Separator } from "../../components/ui/separator";

export const AboutUsPage = (): JSX.Element => {
  return (
    <div className="bg-white w-full">
      {/* Hero Banner */}
      <HeroBanner
        image="/group-2.png"
        imageAlt="About OFSL"
        height="500px"
      >
        <div className="text-center text-white">
          <h1 className="text-5xl mb-4 font-heading">About Us</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Ottawa Fun Sports League - Building community through sports since 2010
          </p>
        </div>
      </HeroBanner>

      {/* Main content */}
      <div className="max-w-[1280px] mx-auto px-4 py-16 md:py-24">
        {/* Our mission section */}
        <div className="mb-20 md:mb-28">
          <h2 className="text-3xl font-bold text-[#6F6F6F] mb-8 text-center">Our Mission</h2>
          <p className="text-lg text-[#6F6F6F] max-w-3xl mx-auto text-center">
            The Ottawa Fun Sports League (OFSL) aims to provide opportunities to be active and 
            promote a healthy lifestyle for youths and adults, while having fun at the same time. 
            We are dedicated to creating a welcoming environment where people of all skill levels 
            can enjoy sports, make connections, and build community.
          </p>
        </div>

        {/* Our story section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 md:mb-28">
          <div>
            <img
              src="/group-2.png"
              alt="OFSL Community"
              className="w-full h-[350px] object-cover rounded-lg"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-[#6F6F6F] mb-6">Our Story</h2>
            <p className="text-lg text-[#6F6F6F] mb-6">
              Founded in 2010 by a group of sports enthusiasts who wanted to create more accessible 
              recreational opportunities in Ottawa, OFSL began with just two volleyball courts and 
              48 players.
            </p>
            <p className="text-lg text-[#6F6F6F]">
              Today, we've grown to serve over 2,000 participants across multiple sports including 
              volleyball, badminton, pickleball, and basketball. Our focus has always been on creating 
              a balance of competitive play and inclusive fun that welcomes players of all backgrounds.
            </p>
          </div>
        </div>

        {/* OFSL by the Numbers section - Added from Figma */}
        <div className="mb-20 md:mb-28">
          <h2 className="text-3xl font-bold text-[#6F6F6F] mb-12 text-center">OFSL by the Numbers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-[#B20000] text-5xl font-bold mb-4">2,000+</div>
              <p className="text-[#6F6F6F] text-lg">Active players</p>
            </div>
            <div>
              <div className="text-[#B20000] text-5xl font-bold mb-4">15+</div>
              <p className="text-[#6F6F6F] text-lg">Years of operation</p>
            </div>
            <div>
              <div className="text-[#B20000] text-5xl font-bold mb-4">4</div>
              <p className="text-[#6F6F6F] text-lg">Sports offered</p>
            </div>
            <div>
              <div className="text-[#B20000] text-5xl font-bold mb-4">$50K+</div>
              <p className="text-[#6F6F6F] text-lg">Raised for charities</p>
            </div>
          </div>
          <p className="text-lg text-[#6F6F6F] max-w-3xl mx-auto text-center mt-12">
            We're proud of how far we've come since our founding, and we're excited to continue growing 
            and serving the Ottawa community for many years to come.
          </p>
        </div>

        <Separator className="mb-20 md:mb-28" />

        {/* Our values section */}
        <div className="mb-20 md:mb-28">
          <h2 className="text-3xl font-bold text-[#6F6F6F] mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="w-16 h-16 bg-[#b20000] rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-[#6F6F6F] mb-4">Community</h3>
              <p className="text-[#6F6F6F]">
                Building connections through shared passion for sports
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="w-16 h-16 bg-[#b20000] rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-[#6F6F6F] mb-4">Inclusivity</h3>
              <p className="text-[#6F6F6F]">
                Creating spaces where everyone feels welcome and valued
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="w-16 h-16 bg-[#b20000] rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">💪</span>
              </div>
              <h3 className="text-xl font-bold text-[#6F6F6F] mb-4">Health</h3>
              <p className="text-[#6F6F6F]">
                Promoting active lifestyles and physical wellbeing
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="w-16 h-16 bg-[#b20000] rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold text-[#6F6F6F] mb-4">Fun</h3>
              <p className="text-[#6F6F6F]">
                Ensuring enjoyment is at the heart of everything we do
              </p>
            </div>
          </div>
        </div>

        {/* Our team section */}
        <div className="mb-20 md:mb-28">
          <h2 className="text-3xl font-bold text-[#6F6F6F] mb-12 text-center">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
                alt="James Battiston"
                className="w-40 h-40 object-cover rounded-lg mx-auto mb-6"
              />
              <h3 className="text-xl font-bold text-[#6F6F6F] mb-2">James Battiston</h3>
              <p className="text-[#b20000] mb-4">Founder & Program Director</p>
              <p className="text-[#6F6F6F]">
                Former member of the Canadian Beach National Team
              </p>
            </div>
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
                alt="Sarah Johnson"
                className="w-40 h-40 object-cover rounded-lg mx-auto mb-6"
              />
              <h3 className="text-xl font-bold text-[#6F6F6F] mb-2">Sarah Johnson</h3>
              <p className="text-[#b20000] mb-4">Operations Manager</p>
              <p className="text-[#6F6F6F]">
                Organizes league operations and tournament scheduling
              </p>
            </div>
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg"
                alt="Michael Chen"
                className="w-40 h-40 object-cover rounded-lg mx-auto mb-6"
              />
              <h3 className="text-xl font-bold text-[#6F6F6F] mb-2">Michael Chen</h3>
              <p className="text-[#b20000] mb-4">Community Relations</p>
              <p className="text-[#6F6F6F]">
                Manages partnerships and community outreach
              </p>
            </div>
          </div>
        </div>

        {/* Community impact */}
        <div className="mb-20 md:mb-28">
          <h2 className="text-3xl font-bold text-[#6F6F6F] mb-8 text-center">Community Impact</h2>
          <p className="text-lg text-[#6F6F6F] max-w-3xl mx-auto text-center mb-12">
            We are proud to raise funds for several local charities across the Ottawa region, 
            including The Boys and Girls Club of Ottawa, The Breast Cancer Association, 
            Diabetes Canada, and more.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-3xl mx-auto">
            <img
              src="/diabetes-canada-logo-svg-1.png"
              alt="Diabetes Canada"
              className="w-full h-auto object-contain rounded-lg"
            />
            <div className="flex items-center justify-center">
              <span className="text-[#6F6F6F] text-lg font-bold">Boys & Girls Club</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-[#6F6F6F] text-lg font-bold">Breast Cancer Association</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-[#6F6F6F] text-lg font-bold">Local Food Banks</span>
            </div>
          </div>
        </div>

        {/* Join us CTA */}
        <div className="bg-[#b20000] text-white py-16 px-8 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Whether you're looking to play, volunteer, or partner with us, 
            we'd love to welcome you to the OFSL family.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-[#b20000] rounded-[10px]"
            >
              Register for a League
            </Button>
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-[#b20000] rounded-[10px]"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};