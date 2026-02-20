import React from "react";
import { getMoonData, type MoonData } from "@/data/moonEngine";

interface MoonPhaseWidgetProps {
  className?: string;
}

const MoonPhaseWidget: React.FC<MoonPhaseWidgetProps> = ({ className = "" }) => {
  const moon = React.useMemo(() => getMoonData(), []);

  return (
    <div
      className={`
        w-full max-w-md mx-auto rounded-xl
        bg-card/50 border border-border/50
        backdrop-blur-sm overflow-hidden
        ${className}
      `}
    >
      {/* Header with moon icon and phase */}
      <div className="p-4 pb-3 flex items-center gap-4">
        {/* Moon visualization */}
        <div className="relative flex-shrink-0">
          <span className="text-4xl" role="img" aria-label={moon.phase}>
            {moon.icon}
          </span>
          {moon.isVoidOfCourse && (
            <span className="absolute -top-1 -right-1 text-xs text-primary/70" title="Void of Course">
              ⚠
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-display text-sm text-primary tracking-wider">
            {moon.phase}
          </p>
          <p className="font-body text-xs text-muted-foreground mt-0.5">
            {moon.zodiacSymbol} Moon in {moon.zodiacSign} · Day {moon.lunarDay}
          </p>
        </div>

        {/* Illumination badge */}
        <div className="text-center flex-shrink-0">
          <p className="font-display text-lg text-primary/90">{moon.illumination}%</p>
          <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">
            illuminated
          </p>
        </div>
      </div>

      {/* Illumination bar */}
      <div className="mx-4 h-1 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary transition-all duration-500"
          style={{ width: `${moon.illumination}%` }}
        />
      </div>

      {/* Poetic description */}
      <p className="px-4 pt-3 pb-2 font-body text-xs text-foreground/70 italic leading-relaxed">
        "{moon.poeticDescription}"
      </p>

      {/* Next phase countdown */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <p className="font-body text-[11px] text-muted-foreground">
          Next: <span className="text-primary/70">{moon.nextPhase.name}</span> in{" "}
          {moon.nextPhase.daysUntil <= 1
            ? "less than a day"
            : `~${Math.round(moon.nextPhase.daysUntil)} days`}
        </p>
        {moon.isVoidOfCourse && (
          <span className="font-body text-[10px] text-primary/60 italic">
            Void of Course — pause before acting
          </span>
        )}
      </div>
    </div>
  );
};

export default MoonPhaseWidget;
