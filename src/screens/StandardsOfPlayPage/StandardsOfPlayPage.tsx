import React from "react";
import { HeroBanner } from "../../components/HeroBanner";

export const StandardsOfPlayPage = (): JSX.Element => {
  return (
    <div className="bg-white w-full">
      {/* Hero Banner */}
      <HeroBanner
        image="/571North-CR3_0335-Indoor-VB-Header-Featured.jpg"
        imageAlt="Volleyball court"
        height="250px"
      >
        <div className="text-center text-white">
          <h1 className="text-5xl mb-4 font-heading">Standards of Play</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Official rules and guidelines for OFSL leagues
          </p>
        </div>
      </HeroBanner>

      {/* Main content */}
      <div className="max-w-[1280px] mx-auto px-4 py-16">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#6F6F6F] mb-8">Volleyball Rules</h2>
          
          <div className="space-y-8">
            <section>
              <h3 className="text-2xl font-bold text-[#6F6F6F] mb-4">General Rules</h3>
              <p className="text-lg text-[#6F6F6F] mb-4">
                OFSL volleyball follows standard indoor volleyball rules with some league-specific modifications. 
                All players are expected to know and follow these rules to ensure fair and enjoyable play.
              </p>
              <ul className="list-disc pl-6 text-lg text-[#6F6F6F] space-y-2">
                <li>Games are played best 2 out of 3 sets. First two sets to 25 points (cap at 27), third set to 15 points (cap at 17).</li>
                <li>Teams must have a minimum of 4 players (for 6s leagues) to avoid forfeit.</li>
                <li>Rally scoring is used for all sets.</li>
                <li>Net height is set at 7'11⅝" (2.43m) for men's and coed leagues, and 7'4⅛" (2.24m) for women's leagues.</li>
                <li>Each team is allowed two 30-second timeouts per set.</li>
                <li>Teams switch sides after each set.</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-2xl font-bold text-[#6F6F6F] mb-4">Scoring and Rotation</h3>
              <p className="text-lg text-[#6F6F6F] mb-4">
                Rally scoring is used in all divisions. A point is awarded on every rally regardless of which team served.
              </p>
              <ul className="list-disc pl-6 text-lg text-[#6F6F6F] space-y-2">
                <li>The team winning the rally scores a point and gains the right to serve.</li>
                <li>Proper rotation order must be maintained throughout the game.</li>
                <li>Players must be in their correct positions at the moment of service.</li>
                <li>After service, players may move to any position on their side of the court.</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-2xl font-bold text-[#6F6F6F] mb-4">Violations</h3>
              <p className="text-lg text-[#6F6F6F] mb-4">
                The following actions constitute violations and result in a point for the opposing team:
              </p>
              <ul className="list-disc pl-6 text-lg text-[#6F6F6F] space-y-2">
                <li>Four hits: When a team hits the ball more than three times before sending it over the net.</li>
                <li>Illegal contact: Holding, throwing, or pushing the ball.</li>
                <li>Net touch: Any player touching the net during play.</li>
                <li>Centerline violation: Completely crossing the centerline under the net.</li>
                <li>Double hit: When a player hits the ball twice in succession or the ball touches various parts of the body in succession.</li>
                <li>Rotation fault: When players are not in correct rotation order during serve.</li>
                <li>Back-row attack: Back-row player attacks the ball above the height of the net while in front of the attack line.</li>
                <li>Service faults: Serving from outside the service zone or before the referee's whistle.</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-2xl font-bold text-[#6F6F6F] mb-4">Coed Specific Rules</h3>
              <ul className="list-disc pl-6 text-lg text-[#6F6F6F] space-y-2">
                <li>Teams must have at least 2 females on the court at all times for 6s leagues, and at least 1 female for 4s leagues.</li>
                <li>There is no requirement for male-to-female contact before sending the ball over the net.</li>
                <li>Males and females can play any position on the court.</li>
                <li>The 10-foot line rule applies to both genders when playing in the back row.</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-2xl font-bold text-[#6F6F6F] mb-4">Substitutions</h3>
              <ul className="list-disc pl-6 text-lg text-[#6F6F6F] space-y-2">
                <li>Teams are allowed unlimited substitutions per set.</li>
                <li>Substitutions must be made in a consistent pattern (a player must always substitute with the same player).</li>
                <li>Substitutions should be made at the sideline near the referee stand.</li>
                <li>All substitutions must be made during a dead ball.</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-2xl font-bold text-[#6F6F6F] mb-4">Sportsmanship</h3>
              <p className="text-lg text-[#6F6F6F] mb-4">
                OFSL promotes good sportsmanship in all leagues. Players are expected to:
              </p>
              <ul className="list-disc pl-6 text-lg text-[#6F6F6F] space-y-2">
                <li>Respect officials, opponents, teammates, and league staff.</li>
                <li>Play with integrity and call their own violations when appropriate.</li>
                <li>Avoid excessive celebration directed at opponents.</li>
                <li>Accept referee decisions with respect.</li>
                <li>Refrain from using abusive language or engaging in unsportsmanlike conduct.</li>
                <li>Shake hands with opponents before and after matches.</li>
              </ul>
              <p className="text-lg text-[#6F6F6F] mt-4">
                Violations of the sportsmanship code may result in penalties, including warnings, point penalties, game forfeitures, or league expulsion in severe cases.
              </p>
            </section>
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-[#6F6F6F] mb-8">Badminton Rules</h2>
          
          <div className="space-y-8">
            <section>
              <h3 className="text-2xl font-bold text-[#6F6F6F] mb-4">General Rules</h3>
              <p className="text-lg text-[#6F6F6F] mb-4">
                OFSL badminton follows the basic rules of badminton with some league-specific adjustments. 
                These rules are designed to promote fair play and enjoyable competition.
              </p>
              <ul className="list-disc pl-6 text-lg text-[#6F6F6F] space-y-2">
                <li>Matches are played best 2 out of 3 games to 21 points.</li>
                <li>Players must win by 2 points, with a cap at 30 points.</li>
                <li>Only the serving side can score points (traditional scoring).</li>
                <li>A coin toss or shuttle toss determines which player/team serves first.</li>
                <li>The serve must be made diagonally across the court.</li>
                <li>Players switch sides after each game and when one side reaches 11 points in the third game.</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-2xl font-bold text-[#6F6F6F] mb-4">Serving Rules</h3>
              <ul className="list-disc pl-6 text-lg text-[#6F6F6F] space-y-2">
                <li>The server and receiver must stand within their respective service courts without touching the boundary lines.</li>
                <li>The server must hit the shuttle below waist height.</li>
                <li>The racket head must be pointing in a downward direction at the moment of impact with the shuttle.</li>
                <li>The server's feet must remain stationary during the serve until the shuttle is hit.</li>
                <li>In doubles, after winning the right to serve, service passes to the player in the right service court.</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-2xl font-bold text-[#6F6F6F] mb-4">Faults</h3>
              <p className="text-lg text-[#6F6F6F] mb-4">
                A fault results in a point for the opposing side. Faults include:
              </p>
              <ul className="list-disc pl-6 text-lg text-[#6F6F6F] space-y-2">
                <li>Hitting the shuttle into the net or outside the boundaries of the court.</li>
                <li>Touching the net or posts with your body or racket during play.</li>
                <li>Reaching over the net to hit the shuttle (follow-through across the net is allowed).</li>
                <li>Carrying or catching the shuttle on the racket during a stroke.</li>
                <li>Hitting the shuttle twice in succession by the same player.</li>
                <li>A player being hit by the shuttle, regardless of whether they are standing inside or outside the court boundaries.</li>
                <li>Service faults (improper service motion, serving from or to the wrong court, etc.).</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-2xl font-bold text-[#6F6F6F] mb-4">Doubles Specific Rules</h3>
              <ul className="list-disc pl-6 text-lg text-[#6F6F6F] space-y-2">
                <li>At the beginning of the game and when the score is even, the server serves from the right service court.</li>
                <li>When the score is odd, the server serves from the left service court.</li>
                <li>If the serving side wins a rally, they score a point and the same server serves again from the alternate service court.</li>
                <li>If the receiving side wins a rally, they score a point and become the new serving side.</li>
                <li>Players do not change their respective service courts until they win a point when their side is serving.</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-2xl font-bold text-[#6F6F6F] mb-4">Equipment</h3>
              <ul className="list-disc pl-6 text-lg text-[#6F6F6F] space-y-2">
                <li>Players must provide their own rackets.</li>
                <li>OFSL provides shuttlecocks for league play (feather shuttles for advanced and competitive play, nylon for intermediate).</li>
                <li>Players should wear non-marking indoor court shoes.</li>
                <li>Proper athletic attire is required.</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-2xl font-bold text-[#6F6F6F] mb-4">Sportsmanship</h3>
              <p className="text-lg text-[#6F6F6F] mb-4">
                As with all OFSL activities, good sportsmanship is essential:
              </p>
              <ul className="list-disc pl-6 text-lg text-[#6F6F6F] space-y-2">
                <li>Players are expected to make line calls honestly and accurately.</li>
                <li>If uncertain about a line call, the point should be replayed.</li>
                <li>Players should acknowledge good plays by opponents.</li>
                <li>Respect decisions made by umpires or league officials when present.</li>
                <li>Avoid excessive celebrations or displays of frustration.</li>
                <li>Shake hands with opponents before and after matches.</li>
              </ul>
              <p className="text-lg text-[#6F6F6F] mt-4">
                Repeated unsportsmanlike conduct may result in match forfeiture or suspension from league play.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};