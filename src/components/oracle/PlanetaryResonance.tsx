 import React from "react";
 import { getPlanetaryResonance, elementInfo } from "@/data/cosmicWeather";
 import type { TarotCard } from "@/data/tarotCards";
 
 interface PlanetaryResonanceProps {
   card: TarotCard;
   className?: string;
 }
 
 const PlanetaryResonance: React.FC<PlanetaryResonanceProps> = ({ card, className = "" }) => {
   const resonance = getPlanetaryResonance(card.planetaryRuler, card.element);
   const elementData = elementInfo[card.element];
 
   return (
     <div 
       className={`
         flex flex-col items-center gap-2 text-center
         animate-fade-in-up
         ${className}
       `}
       style={{ animationDelay: "0.5s" }}
     >
       {/* Planetary and Elemental badges */}
       <div className="flex items-center gap-3">
         {/* Planetary Ruler */}
         <span className="px-3 py-1 rounded-full bg-gold/10 border border-gold/30 font-display text-xs text-gold tracking-wider">
           {card.planetaryRuler}
         </span>
         
         {/* Element */}
         <span className={`px-3 py-1 rounded-full bg-card/50 border border-gold/20 font-display text-xs tracking-wider flex items-center gap-1.5 ${elementData.color}`}>
           <span className="text-sm">{elementData.symbol}</span>
           <span className="capitalize">{card.element}</span>
         </span>
 
         {/* Zodiac if present */}
         {card.zodiacAssociation && (
           <span className="px-3 py-1 rounded-full bg-secondary/20 border border-secondary/40 font-display text-xs text-foreground/70 tracking-wider">
             {card.zodiacAssociation}
           </span>
         )}
       </div>
 
       {/* Resonance description */}
       <p className="font-body text-xs md:text-sm text-foreground/70 italic max-w-sm leading-relaxed">
         {resonance}
       </p>
     </div>
   );
 };
 
 export default PlanetaryResonance;