import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { HeroBanner } from "../../components/HeroBanner";

// Data for leagues
const leagueCards = [
  {
    title: "Indoor Coed/ Mens/ Womens Volleyball",
    image: "/indoor-coed.png",
    alt: "Indoor coed",
    link: "/volleyball",
  },
  {
    title: "Indoor Elite Womens Volleyball",
    image: "/elite-womens.png",
    alt: "Elite womens",
    link: "/volleyball",
  },
  {
    title: "Coed Badminton",
    image: "/coed-badminton.png",
    alt: "Coed badminton",
    link: "/badminton",
  },
  {
    title: "Pickleball",
    image: "/pickleball.png",
    alt: "Pickleball",
    link: "/pickleball",
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
    <div className="bg-white w-full">
      <HeroBanner image="/mask-group.png" imageAlt="Volleyball players">
        <div className="text-center text-white max-w-[860px] px-4">
          <h1 className="text-4xl font-bold mb-6">Welcome to OFSL!</h1>
          <p className="text-xl">
            Ottawa's premier adult volleyball and badminton league—where
            sportsmanship meets healthy competition from intermediate to
            competitive levels.
          </p>
          {/* Hero buttons */}
          <div className="flex gap-4 mt-12 justify-center">
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
      </HeroBanner>

      {/* Rest of the content remains the same */}
      {/* ... */}
    </div>
  );
};