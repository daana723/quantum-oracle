import React from "react";
import type { SpreadType } from "@/data/spreadMeanings";

interface SpreadSelectorProps {
  selected: SpreadType;
  onSelect: (spread: SpreadType) => void;
}

const spreads: { id: SpreadType; label: string; icon: string; description: string }[] = [
  {
    id: "single",
    label: "Single Card",
    icon: "◈",
    description: "One reflection, deeply explored",
  },
  {
    id: "past-present-future",
    label: "Past · Present · Future",
    icon: "◁ ◈ ▷",
    description: "Three cards across time's arc",
  },
];

const SpreadSelector: React.FC<SpreadSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="w-full max-w-md space-y-3">
      <p className="font-display text-xs text-gold/50 tracking-widest uppercase text-center">
        Choose Your Spread
      </p>
      <div className="flex justify-center gap-3">
        {spreads.map((spread) => (
          <button
            key={spread.id}
            onClick={() => onSelect(spread.id)}
            className={`
              flex flex-col items-center gap-1.5 px-4 py-3 rounded-lg
              border transition-all duration-300 min-w-[140px]
              font-display text-sm
              ${
                selected === spread.id
                  ? "border-gold bg-gold/10 text-gold glow-gold"
                  : "border-gold/30 text-gold/60 hover:border-gold/50 hover:text-gold/80 hover:bg-gold/5"
              }
            `}
          >
            <span className="text-base tracking-widest">{spread.icon}</span>
            <span className="text-xs tracking-wider">{spread.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SpreadSelector;
