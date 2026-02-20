import React, { useState } from "react";
import type { TarotCard } from "@/data/tarotCards";
import {
  spreadPositions,
  getRelationalMeaning,
  getSpreadSynthesis,
} from "@/data/spreadMeanings";
import CardFront from "./CardFront";
import PlanetaryResonance from "./PlanetaryResonance";
import CosmicWeatherPanel from "./CosmicWeatherPanel";
import ShareableReading from "./ShareableReading";

interface SpreadReadingDisplayProps {
  cards: TarotCard[];
  onNewReading: () => void;
}

const SpreadReadingDisplay: React.FC<SpreadReadingDisplayProps> = ({
  cards,
  onNewReading,
}) => {
  const [expandedCard, setExpandedCard] = useState<number>(1); // Start with Present
  const positions = spreadPositions["past-present-future"];
  const synthesis = getSpreadSynthesis(cards);

  // Relational meanings between adjacent cards
  const relations = [
    getRelationalMeaning(cards[0], "Past", cards[1], "Present"),
    getRelationalMeaning(cards[1], "Present", cards[2], "Future"),
  ];

  // Full arc relation
  const arcRelation = getRelationalMeaning(cards[0], "Past", cards[2], "Future");

  return (
    <div className="flex flex-col items-center gap-6 md:gap-8 w-full max-w-3xl mx-auto px-4">
      {/* Three-card layout */}
      <div className="flex items-start justify-center gap-3 md:gap-6 w-full">
        {cards.map((card, i) => (
          <div
            key={card.id}
            className="flex flex-col items-center gap-2 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            {/* Position label */}
            <div className="text-center mb-1">
              <span className="text-gold/50 text-lg">{positions[i].icon}</span>
              <p className="font-display text-xs md:text-sm text-gold/80 tracking-wider">
                {positions[i].label}
              </p>
            </div>

            {/* Card */}
            <div
              className={`cursor-pointer transition-all duration-300 ${
                expandedCard === i
                  ? "scale-105 ring-2 ring-gold/40 rounded-lg"
                  : "opacity-70 hover:opacity-90 hover:scale-102"
              }`}
              onClick={() => setExpandedCard(i)}
            >
              <CardFront
                card={card}
                isRevealed={true}
                size="echo"
              />
            </div>

            {/* Card name */}
            <p
              className={`font-display text-xs tracking-wider transition-colors ${
                expandedCard === i ? "text-gold" : "text-gold/50"
              }`}
            >
              {card.name}
            </p>
          </div>
        ))}
      </div>

      {/* Relational arrows between cards */}
      <div
        className="w-full max-w-md animate-fade-in-up"
        style={{ animationDelay: "0.6s" }}
      >
        {/* Past → Present relation */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-display text-xs text-gold/40 shrink-0">Past → Present</span>
          <div className="flex-1 h-px bg-gradient-to-r from-gold/30 to-gold/10" />
        </div>
        <p className="font-body text-sm text-foreground/70 italic leading-relaxed mb-5">
          {relations[0]}
        </p>

        {/* Present → Future relation */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-display text-xs text-gold/40 shrink-0">Present → Future</span>
          <div className="flex-1 h-px bg-gradient-to-r from-gold/30 to-gold/10" />
        </div>
        <p className="font-body text-sm text-foreground/70 italic leading-relaxed mb-5">
          {relations[1]}
        </p>

        {/* Full arc */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-display text-xs text-gold/40 shrink-0">The Full Arc</span>
          <div className="flex-1 h-px bg-gradient-to-r from-gold/30 via-gold/20 to-gold/30" />
        </div>
        <p className="font-body text-sm text-foreground/70 italic leading-relaxed">
          {arcRelation}
        </p>
      </div>

      {/* Expanded card interpretation */}
      {expandedCard !== null && (
        <div
          className="w-full max-w-md p-5 rounded-lg border border-gold/20 bg-card/40 backdrop-blur-sm animate-fade-in-up"
          style={{ animationDelay: "0.8s" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-gold/50">{positions[expandedCard].icon}</span>
            <h4 className="font-display text-base text-gold">
              {cards[expandedCard].name}
            </h4>
            <span className="font-display text-xs text-gold/40 tracking-wider ml-auto">
              {positions[expandedCard].sublabel}
            </span>
          </div>

          <p className="font-body text-base text-foreground/90 leading-relaxed mb-3">
            {cards[expandedCard].meaning}
          </p>

          <p className="font-body text-xs text-gold/50 italic">
            {cards[expandedCard].symbolism}
          </p>

          <div className="mt-4">
            <PlanetaryResonance card={cards[expandedCard]} />
          </div>
        </div>
      )}

      {/* Elemental Synthesis */}
      <div
        className="w-full max-w-md p-4 rounded-lg bg-card/30 border border-gold/15 text-center animate-fade-in-up"
        style={{ animationDelay: "1s" }}
      >
        <h4 className="font-display text-sm text-gold/70 tracking-widest uppercase mb-2">
          Elemental Synthesis
        </h4>
        <p className="font-body text-sm text-foreground/80 italic leading-relaxed">
          {synthesis}
        </p>
      </div>

      {/* Cosmic Weather */}
      <CosmicWeatherPanel className="mt-2" />

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
        <ShareableReading primaryCard={cards[1]} echoCards={[cards[0], cards[2]]} />
        <button
          onClick={onNewReading}
          className="
            px-6 md:px-8 py-2.5 md:py-3 rounded-full
            font-display text-sm md:text-base tracking-wider
            border border-gold/40 text-gold/80
            bg-transparent hover:bg-gold/10 hover:border-gold hover:text-gold
            transition-all duration-300
            animate-fade-in-up
          "
          style={{ animationDelay: "1.2s" }}
        >
          ✧ New Observation ✧
        </button>
      </div>
    </div>
  );
};

export default SpreadReadingDisplay;
