import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "../../components/ui/navigation-menu";
import { Separator } from "../../components/ui/separator";

// Data for leagues
const leagueCards = [
  {
    title: "Indoor Coed/ Mens/ Womens Volleyball",
    image: "/indoor-coed.png",
    alt: "Indoor coed",
    link: "/volleyball"
  },
  {
    title: "Indoor Elite Womens Volleyball",
    image: "/elite-womens.png",
    alt: "Elite womens",
    link: "/volleyball"
  },
  {
    title: "Coed Badminton",
    image: "/coed-badminton.png",
    alt: "Coed badminton",
    link: "/badminton"
  },
  {
    title: "Pickleball",
    image: "/pickleball.png",
    alt: "Pickleball",
    link: "/pickleball"
  },
];

// Data for footer links
const footerLinks = {
  leagues: ["Volleyball", "Badminton", "Pickleball"],
  getInvolved: ["Newsletter", "Registration", "Partner with us"],
  usefulLinks: ["Leagues", "Schedule & Standings", "Locations"],
  siteInfo: ["About us", "Contact", "FAQs"],
};

export const HomePage = (): JSX.Element => {
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

        {/* Hero image */}
        <img
          className="w-full h-[604px] object-cover"
          alt="Volleyball players"
          src="/mask-group.png"
        />

        {/* Hero content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-[95px]">
          <div className="max-w-[860px] font-m3-title-large font-[number:var(--m3-title-large-font-weight)] text-white text-[length:var(--m3-title-large-font-size)] text-center tracking-[var(--m3-title-large-letter-spacing)] leading-[var(--m3-title-large-line-height)] [font-style:var(--m3-title-large-font-style)] mt-[150px]">
            <span className="font-[number:var(--m3-title-large-font-weight)] leading-[var(--m3-title-large-line-height)] font-m3-title-large [font-style:var(--m3-title-large-font-style)] tracking-[var(--m3-title-large-letter-spacing)] text-[length:var(--m3-title-large-font-size)]">
              Welcome to OFSL! <br />
            </span>
            <span className="text-[length:var(--m3-title-large-font-size)] leading-[var(--m3-title-large-line-height)] font-m3-title-large [font-style:var(--m3-title-large-font-style)] font-[number:var(--m3-title-large-font-weight)] tracking-[var(--m3-title-large-letter-spacing)]">
              Ottawa's premier adult volleyball and badminton league—where
              sportsmanship meets healthy competition from intermediate to
              competitive levels.
            </span>
          </div>

          {/* Hero buttons */}
          <div className="flex gap-4 mt-12">
            <Link to="/volleyball">
              <Button
                variant="outline"
                className="bg-[#0d0d0d42] text-white border-white rounded-[10px] px-[25px] py-2.5"
              >
                <span className="font-m3-title-large font-[number:var(--m3-title-large-font-weight)] text-white text-[length:var(--m3-title-large-font-size)] tracking-[var(--m3-title-large-letter-spacing)] leading-[var(--m3-title-large-line-height)] whitespace-nowrap [font-style:var(--m3-title-large-font-style)]">
                  Womens Elite
                </span>
              </Button>
            </Link>
            <Button
              variant="outline"
              className="bg-[#0d0d0d42] text-white border-white rounded-[10px] px-[25px] py-2.5"
            >
              <span className="font-m3-title-large font-[number:var(--m3-title-large-font-weight)] text-white text-[length:var(--m3-title-large-font-size)] tracking-[var(--m3-title-large-letter-spacing)] leading-[var(--m3-title-large-line-height)] whitespace-nowrap [font-style:var(--m3-title-large-font-style)]">
                Schedule &amp; Standings
              </span>
            </Button>
            <Button
              variant="outline"
              className="bg-[#0d0d0d42] text-white border-white rounded-[10px] px-[25px] py-2.5"
            >
              <span className="font-m3-title-large font-[number:var(--m3-title-large-font-weight)] text-white text-[length:var(--m3-title-large-font-size)] tracking-[var(--m3-title-large-letter-spacing)] leading-[var(--m3-title-large-line-height)] whitespace-nowrap [font-style:var(--m3-title-large-font-style)]">
                Tournaments
              </span>
            </Button>
          </div>
        </div>

        {/* Diabetes Canada partnership */}
        <div className="container mx-auto px-4 flex items-center justify-between py-12">
          <img
            className="w-[153px] h-[53px] object-cover"
            alt="Diabetes Canada logo"
            src="/diabetes-canada-logo-svg-1.png"
          />
          <div className="max-w-[657px] font-normal text-[22px]">
            <span className="text-[#6f6f6f] leading-[0.1px]">
              Proudly partnering with Diabetes Canada to promote healthier
              lifestyles through sport and community wellness.
            </span>
            <span className="text-[#b20000] leading-[var(--m3-title-large-line-height)] underline font-m3-title-large [font-style:var(--m3-title-large-font-style)] font-[number:var(--m3-title-large-font-weight)] tracking-[var(--m3-title-large-letter-spacing)] text-[length:var(--m3-title-large-font-size)] ml-2">
              Learn more
            </span>
          </div>
        </div>

        {/* Holiday break notification */}
        <Card className="container mx-auto bg-[#ffeae5] rounded-[23px] mb-12">
          <CardContent className="flex items-center p-6">
            <img
              className="w-[71px] h-[71px]"
              alt="Notification"
              src="/notification-important-24dp-000000-fill0-wght200-grad0-opsz24-1.svg"
            />
            <div className="ml-12">
              <h3 className="font-bold text-[#6f6f6f] text-[32px] leading-10">
                Holiday break
              </h3>
              <p className="text-[#6f6f6f] text-base leading-7 max-w-[510px]">
                There will be NO activities during the Easter weekend from April
                19th to April 21st, 2025 inclusively. Captains please inform
                your team.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* League description */}
        <div className="container mx-auto text-center mb-16">
          <p className="max-w-[1080px] mx-auto font-normal text-[#6f6f6f] text-base leading-7">
            Our leagues are organized to provide participants with a structured
            environment. We are dedicated to having fun at an
            Advanced-Intermediate to Intermediate skill level. We give members
            an opportunity to stay active and meet new people.
          </p>
        </div>

        {/* League cards */}
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {leagueCards.map((card, index) => (
            <Link key={index} to={card.link}>
              <Card className="border-none">
                <CardContent className="p-0">
                  <img
                    className="w-full h-[327px] object-cover"
                    alt={card.alt}
                    src={card.image}
                  />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Tournaments section */}
        <Card className="container mx-auto bg-[#b20000] rounded-[23px] mb-16">
          <CardContent className="flex items-center p-6">
            <img
              className="w-[86px] h-[86px]"
              alt="Tournament icon"
              src="/rebase-24dp-000000-fill0-wght300-grad0-opsz24-1.svg"
            />
            <div className="ml-12 flex-1">
              <div className="font-m3-title-large font-[number:var(--m3-title-large-font-weight)] text-white text-[length:var(--m3-title-large-font-size)] tracking-[var(--m3-title-large-letter-spacing)] leading-[var(--m3-title-large-line-height)] [font-style:var(--m3-title-large-font-style)]">
                <span className="font-[number:var(--m3-title-large-font-weight)] leading-[var(--m3-title-large-line-height)] font-m3-title-large [font-style:var(--m3-title-large-font-style)] tracking-[var(--m3-title-large-letter-spacing)] text-[length:var(--m3-title-large-font-size)]">
                  Tournaments <br />
                </span>
                <span className="text-[length:var(--m3-title-large-font-size)] leading-[var(--m3-title-large-line-height)] font-m3-title-large [font-style:var(--m3-title-large-font-style)] font-[number:var(--m3-title-large-font-weight)] tracking-[var(--m3-title-large-letter-spacing)]">
                  Led by James Battiston, former member of the Canadian Beach
                  National Team.
                </span>
              </div>
            </div>
            <Button className="bg-white text-black rounded-[10px] px-[25px] py-2.5">
              <span className="font-m3-title-large font-[number:var(--m3-title-large-font-weight)] text-black text-[length:var(--m3-title-large-font-size)] tracking-[var(--m3-title-large-letter-spacing)] leading-[var(--m3-title-large-line-height)] whitespace-nowrap [font-style:var(--m3-title-large-font-style)]">
                Learn more
              </span>
            </Button>
          </CardContent>
        </Card>

        {/* Skills and About section */}
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          {/* Skills and drills */}
          <div className="flex flex-col">
            <img
              className="w-full h-[438px] object-cover mb-6"
              alt="Skills and drills"
              src="/group-2-1.png"
            />
            <div>
              <h2 className="font-bold text-[#6f6f6f] text-[32px] leading-7 mb-4">
                Skills and drills
              </h2>
              <p className="text-[#6f6f6f] text-base leading-6 mb-6">
                Just getting into volleyball or been around for a while but
                looking to revisit some fundamentals, refine your skills or take
                them to the next level? Join us for OFSL's new Skills and
                Drills Program led by James Battiston, former professional
                volleyball player and member of the Canadian Beach National
                Team.
              </p>
              <Button
                variant="link"
                className="p-0 h-auto text-[#b20000] text-[22px] underline font-m3-title-large tracking-[var(--m3-title-large-letter-spacing)]"
              >
                Sign me up
              </Button>
            </div>
          </div>

          {/* About us */}
          <div className="flex flex-col">
            <img
              className="w-full h-[438px] object-cover mb-6"
              alt="About us"
              src="/group-2.png"
            />
            <div>
              <h2 className="font-bold text-[#6f6f6f] text-[32px] leading-7 mb-4">
                About us
              </h2>
              <p className="text-[#6f6f6f] text-base leading-[25px] mb-6">
                The <strong>Ottawa Fun Sports league's(OFSL)</strong> aims
                to provide opportunities to be active and to promote a healthy
                lifestyle for youths and adults, while having fun at the same
                time.
                <br />
                <br />
                We host a number of tournaments and social events throughout the
                year for individuals and teams.
              </p>
              <Button
                variant="link"
                className="p-0 h-auto text-[#b20000] text-xl underline font-bold"
              >
                More about us
              </Button>
            </div>
          </div>
        </div>

        {/* Charity section */}
        <div className="container mx-auto text-center mb-16">
          <p className="max-w-[1077px] mx-auto font-normal text-[#6f6f6f] text-base leading-7">
            We are proud to raise funds for several local charities across the
            Ottawa region, including The Boys and Girls Club of Ottawa, The
            Breast Cancer Association and more.
          </p>
        </div>

        {/* Footer */}
        <footer className="container mx-auto pt-16 pb-8">
          <Separator className="mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-16">
            <div>
              <img
                className="w-[182px] h-[38px] mb-8"
                alt="OFSL Logo"
                src="/group-1-1.png"
              />
              <h3 className="font-m3-title-large font-[number:var(--m3-title-large-font-weight)] text-black text-[length:var(--m3-title-large-font-size)] tracking-[var(--m3-title-large-letter-spacing)] leading-[var(--m3-title-large-line-height)] mb-4">
                Leagues
              </h3>
              <ul className="font-m3-body-large font-[number:var(--m3-body-large-font-weight)] text-black text-[length:var(--m3-body-large-font-size)] tracking-[var(--m3-body-large-letter-spacing)] leading-[var(--m3-body-large-line-height)] [font-style:var(--m3-body-large-font-style)]">
                {footerLinks.leagues.map((link, index) => (
                  <li key={index}>{link}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-m3-title-large font-[number:var(--m3-title-large-font-weight)] text-black text-[length:var(--m3-title-large-font-size)] tracking-[var(--m3-title-large-letter-spacing)] leading-[var(--m3-title-large-line-height)] mb-4">
                Get involved
              </h3>
              <ul className="font-m3-body-large font-[number:var(--m3-body-large-font-weight)] text-black text-[length:var(--m3-body-large-font-size)] tracking-[var(--m3-body-large-letter-spacing)] leading-[var(--m3-body-large-line-height)] [font-style:var(--m3-body-large-font-style)]">
                {footerLinks.getInvolved.map((link, index) => (
                  <li key={index}>{link}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-m3-title-large font-[number:var(--m3-title-large-font-weight)] text-black text-[length:var(--m3-title-large-font-size)] tracking-[var(--m3-title-large-letter-spacing)] leading-[var(--m3-title-large-line-height)] mb-4">
                Useful links
              </h3>
              <ul className="font-m3-body-large font-[number:var(--m3-body-large-font-weight)] text-black text-[length:var(--m3-body-large-font-size)] tracking-[var(--m3-body-large-letter-spacing)] leading-[var(--m3-body-large-line-height)] [font-style:var(--m3-body-large-font-style)]">
                {footerLinks.usefulLinks.map((link, index) => (
                  <li key={index}>{link}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-m3-title-large font-[number:var(--m3-title-large-font-weight)] text-black text-[length:var(--m3-title-large-font-size)] tracking-[var(--m3-title-large-letter-spacing)] leading-[var(--m3-title-large-line-height)] mb-4">
                Site info
              </h3>
              <ul className="font-m3-body-large font-[number:var(--m3-body-large-font-weight)] text-black text-[length:var(--m3-body-large-font-size)] tracking-[var(--m3-body-large-letter-spacing)] leading-[var(--m3-body-large-line-height)] [font-style:var(--m3-body-large-font-style)]">
                {footerLinks.siteInfo.map((link, index) => (
                  <li key={index}>{link}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-m3-title-large font-[number:var(--m3-title-large-font-weight)] text-black text-[length:var(--m3-title-large-font-size)] tracking-[var(--m3-title-large-letter-spacing)] leading-[var(--m3-title-large-line-height)] mb-4">
                Contact
              </h3>
              <div className="font-m3-body-large font-[number:var(--m3-body-large-font-weight)] text-black text-[length:var(--m3-body-large-font-size)] tracking-[var(--m3-body-large-letter-spacing)] leading-[var(--m3-body-large-line-height)] [font-style:var(--m3-body-large-font-style)] mb-4">
                Info@ottawafunsports.com
                <br />
                613-798-OFSL(6375)
              </div>
              <div className="flex gap-3">
                <img
                  className="w-[26px] h-[26px]"
                  alt="Social icons"
                  src="/social-icons.svg"
                />
                <img
                  className="w-[25px] h-[26px]"
                  alt="Social icons"
                  src="/social-icons-2.svg"
                />
                <img
                  className="w-[26px] h-[26px]"
                  alt="Social icons"
                  src="/social-icons-1.svg"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="font-m3-title-medium font-[number:var(--m3-title-medium-font-weight)] text-[#7a7a7a] text-[length:var(--m3-title-medium-font-size)] tracking-[var(--m3-title-medium-letter-spacing)] leading-[var(--m3-title-medium-line-height)] whitespace-nowrap [font-style:var(--m3-title-medium-font-style)]">
              © 2025 Ottawa Fun Sports League
            </div>
            <div className="font-m3-title-medium font-[number:var(--m3-title-medium-font-weight)] text-[#7a7a7a] text-[length:var(--m3-title-medium-font-size)] tracking-[var(--m3-title-medium-letter-spacing)] leading-[var(--m3-title-medium-line-height)] whitespace-nowrap [font-style:var(--m3-title-medium-font-style)]">
              Privacy Policy&nbsp;&nbsp;|&nbsp;&nbsp;Terms of Use
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};