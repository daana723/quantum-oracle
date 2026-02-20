import React from "react";
import { getCurrentCosmicWeather, elementInfo } from "@/data/cosmicWeather";
import MoonPhaseWidget from "@/components/oracle/MoonPhaseWidget";

interface CosmicWeatherPanelProps {
  className?: string;
}

const CosmicWeatherPanel: React.FC<CosmicWeatherPanelProps> = ({ className = "" }) => {
  const weather = getCurrentCosmicWeather();

  return (
    <div
      className={`
        w-full max-w-md mx-auto space-y-4 animate-fade-in-up
        ${className}
      `}
      style={{ animationDelay: "1s" }}
    >
      {/* Enhanced Moon Phase Widget */}
      <MoonPhaseWidget />

      {/* Cosmic Weather details */}
      <div className="p-4 md:p-5 rounded-xl bg-card/40 border border-border/40 backdrop-blur-sm">
        <h4 className="font-display text-xs text-primary/70 tracking-widest uppercase text-center mb-3">
          ✧ Elemental Currents ✧
        </h4>

        {/* Dominant Element */}
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-2xl ${elementInfo[weather.dominantElement].color}`}>
            {elementInfo[weather.dominantElement].symbol}
          </span>
          <div className="flex-1">
            <p className="font-display text-sm text-primary capitalize">
              {weather.dominantElement} Dominant
            </p>
            <p className="font-body text-xs text-foreground/70 italic">
              {weather.elementDescription}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent my-3" />

        {/* Cosmic Climate */}
        <p className="font-body text-sm text-foreground/80 text-center italic leading-relaxed">
          "{weather.cosmicClimate}"
        </p>

        {/* Timing Suggestion */}
        <p className="mt-2 font-body text-xs text-muted-foreground text-center">
          {weather.timingSuggestion}
        </p>
      </div>
    </div>
  );
};

export default CosmicWeatherPanel;