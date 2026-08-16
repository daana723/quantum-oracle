import React, { useCallback } from "react";
import { FileText } from "lucide-react";
import type { TarotCard } from "@/data/tarotCards";
import CardFront from "./CardFront";
import PlanetaryResonance from "./PlanetaryResonance";
import CosmicWeatherPanel from "./CosmicWeatherPanel";
import QuantumAstrologyWidget from "./QuantumAstrologyWidget";
import ShareableReading from "./ShareableReading";
import KofiButton from "./KofiButton";
import CardSymbolismPanel from "./CardSymbolismPanel";
import ContextualSummaryPanel from "./ContextualSummaryPanel";

interface ReadingDisplayProps {
  primaryCard: TarotCard;
  echoCards: TarotCard[];
  onNewReading: () => void;
  intent?: string | null;
  customIntent?: string | null;
}

const ReadingDisplay: React.FC<ReadingDisplayProps> = ({
  primaryCard,
  echoCards,
  onNewReading,
  intent = null,
  customIntent = null,
}) => {
  const [expandedEcho, setExpandedEcho] = React.useState<number | null>(null);


  const handleDownloadPdf = useCallback(async () => {
    const { generateReadingPdf } = await import("@/lib/generateReadingPdf");
    await generateReadingPdf(primaryCard, echoCards);
  }, [primaryCard, echoCards]);

  return (
    <div className="flex flex-col items-center gap-6 md:gap-8 w-full max-w-2xl mx-auto px-4">
      {/* Primary card */}
      <div className="flex flex-col items-center gap-4 md:gap-6">
        <CardFront card={primaryCard} isRevealed={true} size="full" />

        {/* Planetary Resonance - appears after card */}
        <PlanetaryResonance card={primaryCard} className="mt-2" />

        {/* Primary interpretation */}
        <div className="text-center space-y-3 md:space-y-4 max-w-md animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <p className="text-base md:text-lg font-body leading-relaxed text-foreground/90">
            {primaryCard.meaning}
          </p>
        </div>
      </div>

      {/* Primary card symbolism */}
      <CardSymbolismPanel
        card={primaryCard}
        intent={intent}
        customIntent={customIntent}
        className="max-w-md animate-fade-in-up"
        style={{ animationDelay: "0.5s" }}
      />


      {/* Cosmic Weather Panel */}
      <CosmicWeatherPanel className="mt-2" />

      {/* Quantum Astrology Widget */}
      <QuantumAstrologyWidget className="mt-2" />

      {/* Divider */}
      <div 
        className="w-full max-w-xs flex items-center gap-4 animate-fade-in-up"
        style={{ animationDelay: "1.2s" }}
      >
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/30" />
        <span className="text-gold/50 text-lg">✧</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/30" />
      </div>

      {/* Superposition echoes */}
      <div 
        className="text-center space-y-4 md:space-y-6 animate-fade-in-up"
        style={{ animationDelay: "1.4s" }}
      >
        <h4 className="font-display text-sm md:text-base text-gold/70 tracking-widest uppercase">
          Echoes of Parallel Paths
        </h4>
        
        <div className="flex justify-center gap-4 md:gap-6">
          {echoCards.map((echo, index) => (
            <div
              key={echo.id}
              className="flex flex-col items-center gap-2"
              onClick={() => setExpandedEcho(expandedEcho === index ? null : index)}
            >
              <CardFront
                card={echo}
                isRevealed={true}
                size="echo"
                onEchoClick={() => setExpandedEcho(expandedEcho === index ? null : index)}
              />
              <span className="text-xs text-gold/50 font-body italic">
                {echo.keywords[0]}
              </span>
            </div>
          ))}
        </div>

        {/* Echo symbolism panels */}
        <div className="mt-4 space-y-3 max-w-md mx-auto text-left">
          {echoCards.map((echo, index) => (
            <CardSymbolismPanel
              key={echo.id}
              card={echo}
              intent={intent}
              customIntent={customIntent}
              collapsible
              defaultOpen={expandedEcho === index}
              shadowVariant
              positionSublabel="What might have been"
            />
          ))}
        </div>
      </div>

      {/* Interpretive summary for the chosen question context */}
      <ContextualSummaryPanel
        cards={[primaryCard, ...echoCards]}
        intent={intent}
        customIntent={customIntent}
        className="animate-fade-in-up"
        style={{ animationDelay: "1.6s" }}
      />



      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 md:mt-6 flex-wrap justify-center">
        <ShareableReading primaryCard={primaryCard} echoCards={echoCards} />
        <button
          onClick={handleDownloadPdf}
          className="
            px-6 md:px-8 py-2.5 md:py-3 rounded-full
            font-display text-sm md:text-base tracking-wider
            border border-gold/40 text-gold/80
            bg-transparent hover:bg-gold/10 hover:border-gold hover:text-gold
            transition-all duration-300 flex items-center gap-2
            animate-fade-in-up
          "
          style={{ animationDelay: "1.7s" }}
        >
          <FileText className="w-4 h-4" />
          PDF Report
        </button>
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
          style={{ animationDelay: "1.8s" }}
        >
          ✧ New Observation ✧
        </button>
      </div>

      {/* Ko-fi tip jar */}
      <div className="mt-4 animate-fade-in-up" style={{ animationDelay: "2s" }}>
        <KofiButton />
      </div>
    </div>
  );
};

export default ReadingDisplay;
