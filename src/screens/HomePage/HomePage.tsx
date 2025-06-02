import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { HeroBanner } from "../../components/HeroBanner";

// Data for leagues
const leagueCards = [
  {
    title: "Indoor Womens Elite Volleyball",
    image: "/womens-elite-card.jpg",
    alt: "Elite womens volleyball",
    link: "/volleyball-elite",
  },
  {
    title: "Indoor Coed Volleyball",
    image: "/571North-CR3_0335-Indoor-VB-Header-Featured.jpg",
    alt: "Indoor coed volleyball",
    link: "/volleyball",
  },
  {
    title: "Indoor Advanced Badminton",
    image: "/badminton-card.png",
    alt: "Advanced badminton",
    link: "/badminton",
  },
  {
    title: "Indoor Pickleball Coming Soon!",
    image: "/pickleball-card.jpg",
    alt: "Pickleball",
    link: "/pickleball",
  },
  {
    title: "Indoor Competitive Badminton",
    image: "/badminton-card.png",
    alt: "Competitive badminton",
    link: "/badminton-competitive",
  },
  {
    title: "Indoor Womens Volleyball",
    image: "/womens-elite-card.jpg",
    alt: "Womens volleyball",
    link: "/womens-volleyball",
  },
  {
    title: "Indoor Mens Volleyball",
    image: "/indoor-coed.jpg",
    alt: "Mens volleyball",
    link: "/mens-volleyball",
  },
];

export const HomePage = (): JSX.Element => {
  // Refs and state for draggable scrolling
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [dragDistance, setDragDistance] = useState(0);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Mouse event handlers for draggable scrolling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    
    setIsDragging(true);
    setHasDragged(false);
    setDragDistance(0);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
    
    // Prevent text selection during drag
    e.preventDefault();
  };

  const handleMouseLeave = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
    
    // If we've dragged more than a threshold, prevent the next click from navigating
    if (dragDistance > 5) {
      setHasDragged(true);
      
      // Reset hasDragged after a short delay to allow future navigation
      setTimeout(() => {
        setHasDragged(false);
      }, 300);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX); // Removed multiplier for 1:1 cursor movement
    
    // Update drag distance for detection
    setDragDistance(Math.abs(walk));
    
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    
    setIsDragging(true);
    setHasDragged(false);
    setDragDistance(0);
    setStartX(e.touches[0].clientX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    
    const x = e.touches[0].clientX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX); // Removed multiplier for 1:1 touch movement
    
    // Update drag distance for detection
    setDragDistance(Math.abs(walk));
    
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // If we've dragged more than a threshold, prevent the next click from navigating
    if (dragDistance > 5) {
      setHasDragged(true);
      
      // Reset hasDragged after a short delay to allow future navigation
      setTimeout(() => {
        setHasDragged(false);
      }, 300);
    }
  };

  // Set up global mouse up handler
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        if (scrollContainerRef.current) {
          scrollContainerRef.current.style.cursor = 'grab';
        }
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="bg-white w-full">
      <HeroBanner image="/mask-group.png" imageAlt="Volleyball players">
        <div className="text-center text-white max-w-[860px] px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4 md:mb-6 font-heading font-bold">Welcome to OFSL!</h1>
          <p className="text-base md:text-lg lg:text-xl">
            Ottawa's premier adult volleyball and badminton league—where
            sportsmanship meets healthy competition from intermediate to
            competitive levels.
          </p>
          {/* Hero buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-6 md:mt-12 justify-center">
            <Link to="/volleyball" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-[#0d0d0d42] text-white border border-white rounded-[10px] px-[15px] md:px-[25px] py-2.5"
              >
                <span className="text-base md:text-lg text-white">
                  Womens Elite
                </span>
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-[#0d0d0d42] text-white border border-white rounded-[10px] px-[15px] md:px-[25px] py-2.5"
            >
              <span className="text-base md:text-lg text-white">
                Schedule &amp; Standings
              </span>
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-[#0d0d0d42] text-white border border-white rounded-[10px] px-[15px] md:px-[25px] py-2.5"
            >
              <span className="text-base md:text-lg text-white">
                Tournaments
              </span>
            </Button>
          </div>
        </div>
      </HeroBanner>

      {/* Rest of the content with container width */}
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Diabetes Canada partnership */}
        <div className="flex justify-center py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center max-w-[800px] gap-6">
            <img
              className="w-[120px] md:w-[153px] h-auto md:h-[53px] object-contain"
              alt="Diabetes Canada logo"
              src="/diabetes-canada-logo-svg-1.png"
            />
            <div className="text-base md:text-lg text-center">
              <span className="text-[#6f6f6f] leading-6 md:leading-7">
                Proudly partnering with Diabetes Canada to promote healthier
                lifestyles through sport and community wellness.
              </span>
              <a href="#" className="text-base md:text-lg text-[#b20000] underline ml-2 font-bold">
                Learn more
              </a>
            </div>
          </div>
        </div>

        {/* Holiday break notification */}
        <Card className="bg-[#ffeae5] rounded-lg mb-16 md:mb-24 shadow-none border-none">
          <CardContent className="flex flex-col md:flex-row items-center p-6 md:p-8 gap-6">
            <img
              className="w-[50px] h-[50px] md:w-[71px] md:h-[71px] rounded-lg"
              alt="Notification"
              src="/notification-important-24dp-000000-fill0-wght200-grad0-opsz24-1.svg"
            />
            <div className="md:ml-6 text-center md:text-left">
              <h3 className="font-bold text-[#6f6f6f] text-xl md:text-2xl lg:text-[32px] leading-8 md:leading-10 mb-2">
                Holiday break
              </h3>
              <p className="text-[#6f6f6f] text-base md:text-lg leading-6 md:leading-7">
                There will be NO activities during the Easter weekend from April
                19th to April 21st, 2025 inclusively. Captains please inform
                your team.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* League description */}
        <div className="text-center mb-16 md:mb-24">
          <p className="max-w-[1080px] mx-auto font-normal text-[#6f6f6f] text-base md:text-lg leading-6 md:leading-7">
            Our leagues provide a well-organized structure and experience for those who take their play seriously—but still want to have a good time. Geared toward intermediate to competitive play, it's a great way to stay active, maintain your fitness, and connect with others who share your passion for the games.
          </p>
        </div>
      </div>

      {/* League cards with overflow handling */}
      <div className="w-full overflow-hidden mb-8 md:mb-12">
        <div className="max-w-[1280px] mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#6F6F6F] mb-8">Popular Leagues</h2>
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-8 -mx-[400px] pl-[400px] pr-[450px] scrollbar-hide"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ 
              cursor: 'grab', 
              width: 'calc(100% + 850px)',
              scrollBehavior: 'auto', // Disable smooth scrolling for immediate stop
              paddingTop: '10px' // Add padding at top to prevent cutoff during zoom
            }}
          >
            {leagueCards.map((card, index) => (
              <Link 
                key={index} 
                to={card.link} 
                className={`block transition-transform duration-300 hover:scale-105 hover:shadow-lg rounded-lg flex-shrink-0 ${
                  index < 4 ? 'w-[calc((100%-72px)/4)]' : 'w-[280px]'
                }`}
                style={{ transformOrigin: 'center center' }}
                onClick={(e) => {
                  // Prevent navigation if we're dragging or just finished dragging
                  if (isDragging || hasDragged) {
                    e.preventDefault();
                  }
                }}
              >
                <Card className="border-none overflow-hidden h-full rounded-lg">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        className="w-full h-[400px] object-cover rounded-t-lg"
                        alt={card.alt}
                        src={card.image}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 h-[90px] flex items-center justify-center px-4">
                        <h3 className="text-white font-bold text-lg text-center">
                          {card.title}
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {/* Add empty spacer div for additional padding */}
            <div className="w-[50px] flex-shrink-0"></div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4">
        {/* Tournaments section */}
        <Card className="bg-[#b20000] rounded-lg mb-16 md:mb-24">
          <CardContent className="flex flex-col md:flex-row items-center p-6 md:p-8 gap-6">
            <img
              className="w-[60px] h-[60px] md:w-[86px] md:h-[86px] rounded-lg"
              alt="Tournament icon"
              src="/rebase-24dp-000000-fill0-wght300-grad0-opsz24-1.svg"
            />
            <div className="md:ml-6 flex-1 text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Tournaments</h2>
              <p className="text-white text-base md:text-lg leading-6 md:leading-7">
                Led by James Battiston, former member of the Canadian Beach National Team.
              </p>
            </div>
            <Button className="bg-white hover:bg-[#0d0d0d42] text-[#b20000] hover:text-white rounded-[10px] border border-white px-[15px] md:px-[25px] py-2.5 w-full md:w-auto">
              <span className="text-base md:text-lg text-[#b20000] hover:text-white">
                Learn more
              </span>
            </Button>
          </CardContent>
        </Card>

        {/* Skills and About section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-16 md:mb-24">
          {/* Skills and drills */}
          <div className="flex flex-col">
            <img
              className="w-full h-[250px] sm:h-[300px] md:h-[438px] object-cover mb-6 md:mb-8 rounded-lg"
              alt="Skills and drills"
              src="/group-2-1.png"
            />
            <div>
              <h2 className="font-bold text-[#6f6f6f] text-xl md:text-2xl lg:text-[32px] leading-7 mb-4 md:mb-6">
                Skills and drills
              </h2>
              <p className="text-[#6f6f6f] text-base md:text-lg leading-6 md:leading-7 mb-6 md:mb-8">
                Just getting into volleyball or been around for a while but
                looking to revisit some fundamentals, refine your skills or take
                them to the next level? Join us for OFSL's new Skills and
                Drills Program led by James Battiston, former professional
                volleyball player and member of the Canadian Beach National
                Team.
              </p>
              <a 
                href="#" 
                className="text-base md:text-lg text-[#b20000] underline font-bold"
              >
                Sign me up
              </a>
            </div>
          </div>

          {/* About us */}
          <div className="flex flex-col">
            <img
              className="w-full h-[250px] sm:h-[300px] md:h-[438px] object-cover mb-6 md:mb-8 rounded-lg"
              alt="About us"
              src="/group-2.png"
            />
            <div>
              <h2 className="font-bold text-[#6f6f6f] text-xl md:text-2xl lg:text-[32px] leading-7 mb-4 md:mb-6">
                About us
              </h2>
              <p className="text-[#6f6f6f] text-base md:text-lg leading-6 md:leading-7 mb-6 md:mb-8">
                The <strong>Ottawa Fun Sports league's(OFSL)</strong> aims
                to provide opportunities to be active and to promote a healthy
                lifestyle for youths and adults, while having fun at the same
                time.
                <br />
                <br />
                We host a number of tournaments and social events throughout the
                year for individuals and teams.
              </p>
              <Link to="/about-us" className="text-base md:text-lg text-[#b20000] underline font-bold">
                More about us
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ready to Play CTA - Full width section */}
      <div className="w-full py-12 md:py-16" style={{ background: 'linear-gradient(90deg, rgba(178,0,0,1) 0%, rgba(120,18,18,1) 100%)' }}>
        <div className="max-w-[1280px] mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to play?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of athletes in our community.
          </p>
          <Link to="/leagues">
            <Button
              className="bg-white hover:bg-[#0d0d0d42] text-[#b20000] hover:text-white rounded-[10px] border border-white px-[15px] md:px-[25px] py-2.5"
            >
              <span className="text-base md:text-lg text-[#b20000] hover:text-white">
                Register now
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};