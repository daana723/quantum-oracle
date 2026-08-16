import React from "react";
import type { TarotCard } from "@/data/tarotCards";
import { getContextualSummary } from "@/data/contextualReading";

interface ContextualSummaryPanelProps {
  cards: TarotCard[];
  positions?: string[];
  intent?: string | null;
  customIntent?: string | null;
  className?: string;
  style?: React.CSSProperties;
}

const ContextualSummaryPanel: React.FC<ContextualSummaryPanelProps> = ({
  cards,
  positions,
  intent = null,
  customIntent = null,
  className = "",
  style,
}) => {
  const summary = getContextualSummary({ cards, positions, intent, customIntent });
  if (!summary) return null;

  return (
    <section
      className={`w-full max-w-md p-5 rounded-lg border border-gold/25 bg-card/40 backdrop-blur-sm ${className}`}
      style={style}
    >
      <h3 className="font-display text-sm text-gold/80 tracking-widest uppercase text-center mb-3">
        ✧ {summary.heading} ✧
      </h3>

      <div className="space-y-3">
        {summary.paragraphs.map((p, i) => (
          <p key={i} className="font-body text-sm text-foreground/85 leading-relaxed">
            {p}
          </p>
        ))}
      </div>

      {summary.prompt && (
        <>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent my-4" />
          <p className="font-body text-sm text-foreground/80 italic flex gap-2">
            <span className="text-gold/40 shrink-0">✦</span>
            {summary.prompt}
          </p>
        </>
      )}

      {summary.affirmation && (
        <p className="mt-3 text-center font-body text-xs text-gold/60 italic">
          “{summary.affirmation}”
        </p>
      )}
    </section>
  );
};

export default ContextualSummaryPanel;
