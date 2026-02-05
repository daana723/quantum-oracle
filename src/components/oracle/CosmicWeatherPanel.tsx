 import React from "react";
 import { getCurrentCosmicWeather, elementInfo, type CosmicWeather } from "@/data/cosmicWeather";
 
 interface CosmicWeatherPanelProps {
   className?: string;
 }
 
 const CosmicWeatherPanel: React.FC<CosmicWeatherPanelProps> = ({ className = "" }) => {
   const weather = getCurrentCosmicWeather();
 
   return (
     <div 
       className={`
         w-full max-w-md mx-auto p-4 md:p-6 rounded-lg 
         bg-card/40 border border-gold/20
         animate-fade-in-up backdrop-blur-sm
         ${className}
       `}
       style={{ animationDelay: "1s" }}
     >
       {/* Header */}
       <h4 className="font-display text-sm md:text-base text-gold/80 tracking-widest uppercase text-center mb-4">
         ✧ Cosmic Weather ✧
       </h4>
 
       {/* Moon Phase */}
       <div className="flex items-center gap-3 mb-3">
         <span className="text-2xl" role="img" aria-label={weather.moonPhase}>
           {weather.moonPhaseIcon}
         </span>
         <div className="flex-1">
           <p className="font-display text-sm text-gold">{weather.moonPhase}</p>
           <p className="font-body text-xs text-foreground/70 italic">
             {weather.moonPhaseDescription}
           </p>
         </div>
       </div>
 
       {/* Dominant Element */}
       <div className="flex items-center gap-3 mb-3">
         <span className={`text-2xl ${elementInfo[weather.dominantElement].color}`}>
           {elementInfo[weather.dominantElement].symbol}
         </span>
         <div className="flex-1">
           <p className="font-display text-sm text-gold capitalize">
             {weather.dominantElement} Dominant
           </p>
           <p className="font-body text-xs text-foreground/70 italic">
             {weather.elementDescription}
           </p>
         </div>
       </div>
 
       {/* Divider */}
       <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent my-4" />
 
       {/* Cosmic Climate */}
       <p className="font-body text-sm text-foreground/80 text-center italic leading-relaxed">
         "{weather.cosmicClimate}"
       </p>
 
       {/* Timing Suggestion */}
       <p className="mt-3 font-body text-xs text-gold/50 text-center">
         {weather.timingSuggestion}
       </p>
     </div>
   );
 };
 
 export default CosmicWeatherPanel;