import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { TarotCard } from "@/data/tarotCards";
import { cardInterpretations } from "@/data/cardInterpretations";
import { getPositionalSymbolism, getIntentLens } from "@/data/contextualReading";
import PlanetaryResonance from "./PlanetaryResonance";

interface CardSymbolismPanelProps {
  card: TarotCard;
  positionLabel?: string;
  positionSublabel?: string;
  positionIcon?: string;
  intent?: string | null;
  customIntent?: string | null;
  /** Render collapsed by default with a toggle header */
  collapsible?: boolean;
  defaultOpen?: boolean;
  /** Show the reversed / "what might have been" line (echo cards) */
  shadowVariant?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const CardSymbolismPanel: React.FC<CardSymbolismPanelProps> = ({
  card,
  positionLabel,
  positionSublabel,
  positionIcon,
  intent = null,
  customIntent = null,
  collapsible = false,
  defaultOpen = true,
  shadowVariant = false,
  className = "",
  style,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const interpretation = cardInterpretations[card.id];
  const symbolism = getPositionalSymbolism(card, positionLabel);
  const intentLens = getIntentLens(card, intent, customIntent);
  const isOpen = collapsible ? open : true;

  const header = (
    <div className="flex items-center gap-2 w-full text-left">
      {positionIcon && <span className="text-gold/50 shrink-0">{positionIcon}</span>}
      <h4 className="font-display text-base text-gold">
        {card.name}
        {positionLabel && (
          <span className="text-gold/50 text-sm"> · {positionLabel}</span>
        )}
      </h4>
      {positionSublabel && (
        <span className="font-display text-[10px] md:text-xs text-gold/40 tracking-wider ml-auto hidden sm:block">
          {positionSublabel}
        </span>
      )}
      {collapsible && (
        <ChevronDown
          className={`h-4 w-4 text-gold/50 shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          } ${positionSublabel ? "ml-2" : "ml-auto"}`}
        />
      )}
    </div>
  );

  return (
    <div
      className={`w-full rounded-lg border border-gold/20 bg-card/40 backdrop-blur-sm p-4 md:p-5 ${className}`}
      style={style}
    >
      {collapsible ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full"
          aria-expanded={isOpen}
        >
          {header}
        </button>
      ) : (
        header
      )}

      {isOpen && (
        <div className="mt-3 space-y-3">
          <p className="font-body text-sm md:text-base text-foreground/90 leading-relaxed">
            {shadowVariant ? card.reversedMeaning : card.meaning}
          </p>

          <div>
            <h5 className="font-display text-[11px] tracking-widest uppercase text-gold/60 mb-1">
              Symbolism &amp; Signs
            </h5>
            <p className="font-body text-sm text-foreground/75 italic leading-relaxed">
              {symbolism}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {card.keywords.map((kw) => (
              <span
                key={kw}
                className="px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20 font-body text-[11px] text-gold/70"
              >
                {kw}
              </span>
            ))}
          </div>

          {interpretation && (
            <div className="space-y-2 pt-1">
              <p className="font-body text-sm text-foreground/80 leading-relaxed">
                <span className="font-display text-gold/70">
                  {shadowVariant ? interpretation.shadowTitle : interpretation.uprightTitle}:{" "}
                </span>
                {shadowVariant
                  ? interpretation.shadowDescription
                  : interpretation.uprightDescription}
              </p>
            </div>
          )}

          {intentLens && (
            <p className="font-body text-sm text-gold/60 italic leading-relaxed border-l border-gold/20 pl-3">
              {intentLens}
            </p>
          )}

          <PlanetaryResonance card={card} className="pt-1" />
        </div>
      )}
    </div>
  );
};

export default CardSymbolismPanel;
