import React from "react";
import type { SpreadType } from "@/data/spreadMeanings";

interface SpreadSelectorProps {
  selected: SpreadType;
  onSelect: (spread: SpreadType) => void;
}

const spreads: { id: SpreadType; label: string; icon: string; description: string; cardCount: number }[] = [
  {
    id: "single",
    label: "Single Card",
    icon: "◈",
    description: "One reflection, deeply explored",
    cardCount: 1,
  },
  {
    id: "past-present-future",
    label: "Past · Present · Future",
    icon: "◁ ◈ ▷",
    description: "Three cards across time's arc",
    cardCount: 3,
  },
  {
    id: "cross",
    label: "Five-Card Cross",
    icon: "✦",
    description: "Situation, challenge, and potential",
    cardCount: 5,
  },
  {
    id: "celtic-cross",
    label: "Celtic Cross",
    icon: "♛",
    description: "The full ten-card reading",
    cardCount: 10,
  },
];

const SpreadSelector: React.FC<SpreadSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="w-full max-w-lg space-y-3">
      <p className="font-display text-xs text-gold/50 tracking-widest uppercase text-center">
        Choose Your Spread
      </p>
      <div className="grid grid-cols-2 gap-2 md:flex md:justify-center md:gap-3">
        {spreads.map((spread) => (
          <button
            key={spread.id}
            onClick={() => onSelect(spread.id)}
            className={`
              flex flex-col items-center gap-1 px-3 py-2.5 rounded-lg
              border transition-all duration-300
              font-display text-sm
              ${
                selected === spread.id
                  ? "border-gold bg-gold/10 text-gold glow-gold"
                  : "border-gold/30 text-gold/60 hover:border-gold/50 hover:text-gold/80 hover:bg-gold/5"
              }
            `}
          >
            <span className="text-base tracking-widest">{spread.icon}</span>
            <span className="text-xs tracking-wider leading-tight">{spread.label}</span>
            <span className="text-[10px] text-gold/40">{spread.cardCount} {spread.cardCount === 1 ? "card" : "cards"}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SpreadSelector;
