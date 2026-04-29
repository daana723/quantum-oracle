import React from "react";
import { getCurrentPlanetaryHour, getDayRuler, getRetrogradeStatuses } from "@/data/planetaryHoursEngine";
import { getCurrentSeasonalEnergy } from "@/data/elementalSeasonEngine";
import { elementInfo } from "@/data/cosmicWeather";

interface QuantumAstrologyWidgetProps {
  className?: string;
}

const QuantumAstrologyWidget: React.FC<QuantumAstrologyWidgetProps> = ({ className = "" }) => {
  const currentHour = getCurrentPlanetaryHour();
  const dayRuler = getDayRuler();
  const retrogrades = getRetrogradeStatuses();
  const season = getCurrentSeasonalEnergy();
  const activeRetrogrades = retrogrades.filter((r) => r.isRetrograde);

  return (
    <div
      className={`w-full max-w-md mx-auto space-y-3 animate-fade-in-up ${className}`}
      style={{ animationDelay: "1.2s" }}
    >
      <div className="p-4 md:p-5 rounded-xl bg-card/40 border border-border/40 backdrop-blur-sm">
        <h4 className="font-display text-xs text-primary/70 tracking-widest uppercase text-center mb-3">
          ✧ Quantum Astrology ✧
        </h4>

        {/* Planetary Hour */}
        {currentHour && (
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{currentHour.symbol}</span>
            <div className="flex-1">
              <p className="font-display text-sm text-primary">
                Hour of {currentHour.planet}
              </p>
              <p className="font-body text-xs text-foreground/70 italic">
                {currentHour.description}
              </p>
            </div>
          </div>
        )}

        {/* Day Ruler */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-lg">{dayRuler.symbol}</span>
          <p className="font-body text-xs text-muted-foreground">
            {dayRuler.description}
          </p>
        </div>

        {/* Seasonal Energy */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-lg">{season.zodiacSymbol}</span>
          <div className="flex-1">
            <p className="font-display text-xs text-foreground/80 capitalize">
              {season.zodiacSeason} Season
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 bg-muted/40 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary/50 transition-all"
                  style={{ width: `${season.energyLevel}%` }}
                />
              </div>
              <span className={`text-xs ${elementInfo[season.element].color}`}>
                {elementInfo[season.element].symbol}
              </span>
            </div>
          </div>
        </div>

        {/* Retrogrades */}
        {activeRetrogrades.length > 0 && (
          <>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent my-3" />
            {activeRetrogrades.map((r) => (
              <div key={r.planet} className="flex items-center gap-2 mb-2">
                <span className="text-sm">{r.symbol}</span>
                <p className="font-body text-xs text-destructive/80 italic">
                  {r.planet} ℞
                </p>
              </div>
            ))}
          </>
        )}

        {/* Honest disclaimer */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent my-3" />
        <p className="font-body text-[10px] text-muted-foreground/70 italic text-center leading-relaxed">
          ✦ Astrological cues are calculated from approximate astronomical models, not live ephemeris data. Offered for intuitive reflection, not predictive guidance. ✦
        </p>
      </div>
    </div>
  );
};

export default QuantumAstrologyWidget;
