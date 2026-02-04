import React from "react";
import type { TarotCard } from "@/data/tarotCards";

interface CardFrontProps {
  card: TarotCard;
  isRevealed: boolean;
  size?: "full" | "echo";
  onEchoClick?: () => void;
}

// Generate a consistent color based on card ID
const getCardColors = (id: number) => {
  const colors = [
    { primary: "hsl(45, 80%, 55%)", secondary: "hsl(280, 40%, 35%)" }, // Gold/Amethyst
    { primary: "hsl(45, 80%, 55%)", secondary: "hsl(160, 45%, 30%)" }, // Gold/Emerald
    { primary: "hsl(45, 80%, 55%)", secondary: "hsl(220, 60%, 35%)" }, // Gold/Sapphire
    { primary: "hsl(45, 80%, 55%)", secondary: "hsl(350, 50%, 30%)" }, // Gold/Burgundy
  ];
  return colors[id % colors.length];
};

const CardFront: React.FC<CardFrontProps> = ({ 
  card, 
  isRevealed, 
  size = "full",
  onEchoClick 
}) => {
  const colors = getCardColors(card.id);
  const isEcho = size === "echo";

  const sizeClasses = isEcho
    ? "w-32 h-48 md:w-36 md:h-54 cursor-pointer hover:scale-105 transition-transform"
    : "w-64 h-96 md:w-72 md:h-[432px]";

  return (
    <div
      onClick={onEchoClick}
      className={`
        relative ${sizeClasses}
        ${isRevealed ? "animate-fade-in-up" : "opacity-0"}
        ${isEcho ? "opacity-60 hover:opacity-90" : ""}
      `}
      style={{ animationDelay: isEcho ? "0.3s" : "0s" }}
    >
      {/* Outer frame with glow */}
      <div 
        className={`
          absolute inset-0 rounded-lg border-2 border-gold overflow-hidden
          ${isEcho ? "" : "glow-gold"}
        `}
        style={{
          background: `linear-gradient(135deg, 
            hsl(240, 20%, 6%) 0%, 
            ${colors.secondary} 50%, 
            hsl(240, 20%, 6%) 100%
          )`,
        }}
      >
        {/* Inner decorative border */}
        <div className="absolute inset-1.5 md:inset-2 rounded-md border border-gold/50">
          {/* Art Nouveau frame pattern */}
          <svg
            viewBox="0 0 200 300"
            className="absolute inset-0 w-full h-full opacity-40"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`frameGrad-${card.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(45, 80%, 55%)" stopOpacity="0.8" />
                <stop offset="50%" stopColor="hsl(45, 90%, 70%)" stopOpacity="1" />
                <stop offset="100%" stopColor="hsl(45, 80%, 55%)" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Top arch */}
            <path
              d="M20 40 Q100 10 180 40"
              fill="none"
              stroke={`url(#frameGrad-${card.id})`}
              strokeWidth="1.5"
            />
            
            {/* Bottom arch */}
            <path
              d="M20 260 Q100 290 180 260"
              fill="none"
              stroke={`url(#frameGrad-${card.id})`}
              strokeWidth="1.5"
            />

            {/* Side vines */}
            <path
              d="M15 60 Q25 150 15 240"
              fill="none"
              stroke="hsl(45, 70%, 50%)"
              strokeWidth="1"
            />
            <path
              d="M185 60 Q175 150 185 240"
              fill="none"
              stroke="hsl(45, 70%, 50%)"
              strokeWidth="1"
            />

            {/* Decorative flowers */}
            <circle cx="100" cy="25" r="8" fill="hsl(45, 80%, 55%)" fillOpacity="0.3" />
            <circle cx="100" cy="275" r="8" fill="hsl(45, 80%, 55%)" fillOpacity="0.3" />
          </svg>

          {/* Card illustration area */}
          <div className="absolute inset-4 md:inset-6 flex flex-col items-center justify-center">
            {/* Symbolic illustration placeholder */}
            <div 
              className="w-full flex-1 rounded-md flex items-center justify-center mb-2 md:mb-4"
              style={{
                background: `radial-gradient(ellipse at center, 
                  ${colors.secondary}40 0%, 
                  transparent 70%
                )`,
              }}
            >
              {/* Roman numeral */}
              <div className="text-center">
                <span 
                  className={`
                    font-display text-gold/80
                    ${isEcho ? "text-xl md:text-2xl" : "text-4xl md:text-5xl"}
                  `}
                >
                  {toRomanNumeral(card.id)}
                </span>
              </div>
            </div>

            {/* Card name */}
            <div className="text-center px-1 md:px-2">
              <h3 
                className={`
                  font-display text-gold tracking-wider
                  ${isEcho ? "text-xs md:text-sm" : "text-lg md:text-xl"}
                `}
              >
                {card.name}
              </h3>
              {!isEcho && (
                <div className="mt-1 md:mt-2 flex justify-center gap-1">
                  {card.keywords.slice(0, 3).map((keyword, i) => (
                    <span
                      key={i}
                      className="text-[10px] md:text-xs text-gold/60 font-body italic"
                    >
                      {keyword}
                      {i < 2 && " · "}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Corner ornaments */}
          {!isEcho && ["top-1 left-1", "top-1 right-1 scale-x-[-1]", "bottom-1 left-1 scale-y-[-1]", "bottom-1 right-1 scale-[-1]"].map(
            (pos, i) => (
              <div key={i} className={`absolute ${pos} w-6 h-6 md:w-8 md:h-8`}>
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  <path
                    d="M4 4 Q16 4 16 16 Q4 16 4 4"
                    fill="none"
                    stroke="hsl(45, 80%, 55%)"
                    strokeWidth="1"
                    opacity="0.6"
                  />
                </svg>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

// Convert number to Roman numeral
function toRomanNumeral(num: number): string {
  if (num === 0) return "0";
  const romanNumerals: [number, string][] = [
    [21, "XXI"],
    [20, "XX"],
    [19, "XIX"],
    [18, "XVIII"],
    [17, "XVII"],
    [16, "XVI"],
    [15, "XV"],
    [14, "XIV"],
    [13, "XIII"],
    [12, "XII"],
    [11, "XI"],
    [10, "X"],
    [9, "IX"],
    [8, "VIII"],
    [7, "VII"],
    [6, "VI"],
    [5, "V"],
    [4, "IV"],
    [3, "III"],
    [2, "II"],
    [1, "I"],
  ];

  for (const [value, numeral] of romanNumerals) {
    if (num >= value) return numeral;
  }
  return String(num);
}

export default CardFront;
