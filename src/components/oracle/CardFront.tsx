import React from "react";
import type { TarotCard } from "@/data/tarotCards";
import { cardImages } from "@/assets/cards";

interface CardFrontProps {
  card: TarotCard;
  isRevealed: boolean;
  size?: "full" | "echo";
  onEchoClick?: () => void;
}

const CardFront: React.FC<CardFrontProps> = ({ 
  card, 
  isRevealed, 
  size = "full",
  onEchoClick 
}) => {
  const isEcho = size === "echo";
  const cardImage = cardImages[card.id];

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
      <div 
        className={`
          absolute inset-0 rounded-lg overflow-hidden
          ${isEcho ? "" : "glow-gold"}
        `}
      >
        {cardImage ? (
          <img 
            src={cardImage} 
            alt={card.name}
            className="w-full h-full object-cover"
          />
        ) : (
          /* Fallback: Roman numeral design */
          <div className="w-full h-full flex items-center justify-center bg-card">
            <span className={`font-display text-gold/80 ${isEcho ? "text-xl" : "text-4xl"}`}>
              {toRomanNumeral(card.id)}
            </span>
          </div>
        )}
        
        {/* Subtle overlay for echo cards */}
        {isEcho && (
          <div className="absolute inset-0 bg-background/20" />
        )}
      </div>
    </div>
  );
};

function toRomanNumeral(num: number): string {
  if (num === 0) return "0";
  const romanNumerals: [number, string][] = [
    [21, "XXI"], [20, "XX"], [19, "XIX"], [18, "XVIII"], [17, "XVII"],
    [16, "XVI"], [15, "XV"], [14, "XIV"], [13, "XIII"], [12, "XII"],
    [11, "XI"], [10, "X"], [9, "IX"], [8, "VIII"], [7, "VII"],
    [6, "VI"], [5, "V"], [4, "IV"], [3, "III"], [2, "II"], [1, "I"],
  ];
  for (const [value, numeral] of romanNumerals) {
    if (num >= value) return numeral;
  }
  return String(num);
}

export default CardFront;
