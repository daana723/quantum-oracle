import React, { useState } from "react";
import type { TarotCard } from "@/data/tarotCards";
import {
  spreadPositions,
  getRelationalMeaning,
  getSpreadSynthesis,
  getSpreadRelations,
  getSpreadArc,
  type SpreadType,
} from "@/data/spreadMeanings";
import CardFront from "./CardFront";
import PlanetaryResonance from "./PlanetaryResonance";
import CosmicWeatherPanel from "./CosmicWeatherPanel";
import ShareableReading from "./ShareableReading";

interface SpreadReadingDisplayProps {
  cards: TarotCard[];
  spreadType: SpreadType;
  onNewReading: () => void;
}

const SpreadReadingDisplay: React.FC<SpreadReadingDisplayProps> = ({
  cards,
  spreadType,
  onNewReading,
}) => {
  const [expandedCard, setExpandedCard] = useState<number>(spreadType === "past-present-future" ? 1 : 0);
  const positions = spreadPositions[spreadType] || [];
  const synthesis = getSpreadSynthesis(cards);
  const relations = getSpreadRelations(spreadType);
  const arc = getSpreadArc(spreadType);

  const renderCardGrid = () => {
    if (spreadType === "past-present-future") {
      return renderLinearLayout();
    }
    if (spreadType === "cross") {
      return renderCrossLayout();
    }
    if (spreadType === "celtic-cross") {
      return renderCelticCrossLayout();
    }
    return renderLinearLayout();
  };

  const renderCardSlot = (index: number, extraClass = "") => {
    const card = cards[index];
    const pos = positions[index];
    if (!card || !pos) return null;
    return (
      <div
        key={card.id}
        className={`flex flex-col items-center gap-1.5 animate-fade-in-up ${extraClass}`}
        style={{ animationDelay: `${index * 0.15}s` }}
      >
        <div className="text-center mb-0.5">
          <span className="text-gold/50 text-sm">{pos.icon}</span>
          <p className="font-display text-[10px] md:text-xs text-gold/80 tracking-wider">
            {pos.label}
          </p>
        </div>
        <div
          className={`cursor-pointer transition-all duration-300 ${
            expandedCard === index
              ? "scale-105 ring-2 ring-gold/40 rounded-lg"
              : "opacity-70 hover:opacity-90 hover:scale-102"
          }`}
          onClick={() => setExpandedCard(index)}
        >
          <CardFront card={card} isRevealed={true} size="echo" />
        </div>
        <p
          className={`font-display text-[10px] md:text-xs tracking-wider transition-colors text-center ${
            expandedCard === index ? "text-gold" : "text-gold/50"
          }`}
        >
          {card.name}
        </p>
      </div>
    );
  };

  const renderLinearLayout = () => (
    <div className="flex items-start justify-center gap-3 md:gap-6 w-full">
      {cards.map((_, i) => renderCardSlot(i))}
    </div>
  );

  const renderCrossLayout = () => (
    <div className="relative w-full max-w-sm mx-auto" style={{ minHeight: "340px" }}>
      {/* Top: Potential (4) */}
      <div className="flex justify-center mb-2">
        {renderCardSlot(4)}
      </div>
      {/* Middle row: Recent Past (3), Situation (0) + Challenge (1), (empty) */}
      <div className="flex items-center justify-center gap-2 md:gap-4 mb-2">
        {renderCardSlot(3)}
        <div className="relative">
          {renderCardSlot(0)}
          {/* Challenge overlaid slightly */}
          <div className="absolute -right-3 -top-2 rotate-12 opacity-90 scale-90">
            {renderCardSlot(1, "!animate-none")}
          </div>
        </div>
      </div>
      {/* Bottom: Foundation (2) */}
      <div className="flex justify-center mt-2">
        {renderCardSlot(2)}
      </div>
    </div>
  );

  const renderCelticCrossLayout = () => (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 w-full">
      {/* Left: Cross portion (cards 0-5) */}
      <div className="relative" style={{ minWidth: "280px", minHeight: "320px" }}>
        {/* Crown (4) - top */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0">
          {renderCardSlot(4)}
        </div>
        {/* Recent Past (3) - left */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          {renderCardSlot(3)}
        </div>
        {/* Center: Present (0) + Challenge (1) crossed */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            {renderCardSlot(0)}
            <div className="absolute -right-2 -top-1 rotate-12 opacity-90 scale-[0.85]">
              {renderCardSlot(1, "!animate-none")}
            </div>
          </div>
        </div>
        {/* Near Future (5) - right */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          {renderCardSlot(5)}
        </div>
        {/* Foundation (2) - bottom */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0">
          {renderCardSlot(2)}
        </div>
      </div>

      {/* Right: Staff (cards 6-9), bottom to top */}
      <div className="flex md:flex-col-reverse items-center gap-2 md:gap-3">
        {[6, 7, 8, 9].map((i) => renderCardSlot(i))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-6 md:gap-8 w-full max-w-4xl mx-auto px-4">
      {/* Card layout */}
      {renderCardGrid()}

      {/* Relational meanings */}
      <div
        className="w-full max-w-md animate-fade-in-up"
        style={{ animationDelay: `${cards.length * 0.15 + 0.3}s` }}
      >
        {relations.map(([from, to], idx) => {
          const fromPos = positions[from]?.label || "";
          const toPos = positions[to]?.label || "";
          return (
            <div key={`${from}-${to}`} className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-display text-xs text-gold/40 shrink-0">
                  {fromPos} → {toPos}
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-gold/30 to-gold/10" />
              </div>
              <p className="font-body text-sm text-foreground/70 italic leading-relaxed">
                {getRelationalMeaning(cards[from], fromPos, cards[to], toPos)}
              </p>
            </div>
          );
        })}

        {/* Full arc */}
        {arc && (
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-display text-xs text-gold/40 shrink-0">The Full Arc</span>
              <div className="flex-1 h-px bg-gradient-to-r from-gold/30 via-gold/20 to-gold/30" />
            </div>
            <p className="font-body text-sm text-foreground/70 italic leading-relaxed">
              {getRelationalMeaning(cards[arc[0]], positions[arc[0]]?.label || "", cards[arc[1]], positions[arc[1]]?.label || "")}
            </p>
          </div>
        )}
      </div>

      {/* Per-card symbolism, every position */}
      <div
        className="w-full max-w-md space-y-3 animate-fade-in-up"
        style={{ animationDelay: `${cards.length * 0.15 + 0.5}s` }}
      >
        <h4 className="font-display text-sm text-gold/70 tracking-widest uppercase text-center">
          Card by Card
        </h4>
        {cards.map((card, i) => (
          <CardSymbolismPanel
            key={`${card.id}-${i}`}
            card={card}
            positionLabel={positions[i]?.label}
            positionSublabel={positions[i]?.sublabel}
            positionIcon={positions[i]?.icon}
            intent={intent}
            customIntent={customIntent}
            collapsible
            defaultOpen={expandedCard === i}
          />
        ))}
      </div>


      {/* Elemental Synthesis */}
      <div
        className="w-full max-w-md p-4 rounded-lg bg-card/30 border border-gold/15 text-center animate-fade-in-up"
        style={{ animationDelay: `${cards.length * 0.15 + 0.7}s` }}
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
        <ShareableReading primaryCard={cards[0]} echoCards={cards.slice(1)} />
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
          style={{ animationDelay: `${cards.length * 0.15 + 0.9}s` }}
        >
          ✧ New Observation ✧
        </button>
      </div>
    </div>
  );
};

export default SpreadReadingDisplay;
