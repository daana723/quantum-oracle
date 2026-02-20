import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { History, Info, Sparkles, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import CardBack from "@/components/oracle/CardBack";
import IntentSelector from "@/components/oracle/IntentSelector";
import SpreadSelector from "@/components/oracle/SpreadSelector";
import ReadingDisplay from "@/components/oracle/ReadingDisplay";
import SpreadReadingDisplay from "@/components/oracle/SpreadReadingDisplay";
import HistoryDrawer from "@/components/oracle/HistoryDrawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useReadingHistory } from "@/hooks/useReadingHistory";
import {
  selectCardWithIntent,
  selectEchoCards,
  type ThemeType,
  type TarotCard,
} from "@/data/tarotCards";
import { getCurrentCosmicWeather } from "@/data/cosmicWeather";
import { type SpreadType, getCardCount } from "@/data/spreadMeanings";

type OracleState = "intent" | "cosmic-moment" | "hidden" | "collapsing" | "revealed";

const OracleScreen: React.FC = () => {
  const [state, setState] = useState<OracleState>("intent");
  const [selectedTheme, setSelectedTheme] = useState<ThemeType | null>(null);
  const [customIntent, setCustomIntent] = useState("");
  const [spreadType, setSpreadType] = useState<SpreadType>("single");
  const [primaryCard, setPrimaryCard] = useState<TarotCard | null>(null);
  const [echoCards, setEchoCards] = useState<TarotCard[]>([]);
  const [spreadCards, setSpreadCards] = useState<TarotCard[]>([]);

  const { readings, saveReading, deleteReading, clearAllReadings } = useReadingHistory();

  const [cosmicWeather] = useState(() => getCurrentCosmicWeather());

  const handleProceedToCard = useCallback(() => {
    setState("cosmic-moment");
    setTimeout(() => {
      setState("hidden");
    }, 2500);
  }, []);

  const handleCardClick = useCallback(() => {
    if (state !== "hidden") return;

    setState("collapsing");

    setTimeout(() => {
      const intent = selectedTheme || (customIntent ? null : null);
      const cardCount = getCardCount(spreadType);

      if (cardCount > 1) {
        // Draw N unique cards for the spread
        const drawn: TarotCard[] = [];
        for (let i = 0; i < cardCount; i++) {
          const card = selectCardWithIntent(intent, drawn.map((c) => c.id));
          drawn.push(card);
        }
        setSpreadCards(drawn);
        setPrimaryCard(drawn[0]);
        setEchoCards(drawn.slice(1));

        saveReading(selectedTheme, customIntent || null, drawn[0], drawn.slice(1), spreadType);
      } else {
        const primary = selectCardWithIntent(intent);
        const echoes = selectEchoCards(primary, intent, 2);
        setPrimaryCard(primary);
        setEchoCards(echoes);

        saveReading(selectedTheme, customIntent || null, primary, echoes, "single");
      }

      setTimeout(() => {
        setState("revealed");
      }, 800);
    }, 700);
  }, [state, selectedTheme, customIntent, spreadType, saveReading]);

  const handleNewReading = useCallback(() => {
    setState("intent");
    setSelectedTheme(null);
    setCustomIntent("");
    setPrimaryCard(null);
    setEchoCards([]);
    setSpreadCards([]);
  }, []);

  const getParticleColor = (index: number) => {
    const colors = [
      "bg-gold/20", "bg-gold/25", "bg-gold/20", "bg-gold/30",
      "bg-rose-400/20", "bg-rose-300/15", "bg-rose-500/20",
      "bg-amber-100/15",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-cosmic bg-nebula-overlay bg-vignette flex flex-col relative">
      {/* Twinkling stars layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-0.5 h-0.5 bg-gold/40 rounded-full animate-twinkle"
            style={{
              left: `${10 + (i * 17) % 80}%`,
              top: `${5 + (i * 23) % 90}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          />
        ))}
        {[...Array(10)].map((_, i) => (
          <div
            key={`star-rose-${i}`}
            className="absolute w-0.5 h-0.5 bg-rose-300/30 rounded-full animate-twinkle"
            style={{
              left: `${20 + (i * 29) % 60}%`,
              top: `${15 + (i * 31) % 70}%`,
              animationDelay: `${i * 0.6 + 1}s`,
              animationDuration: `${2.5 + (i % 2)}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-20 px-4 py-4 md:py-6 flex items-center justify-between">
        <HistoryDrawer
          readings={readings}
          onDeleteReading={deleteReading}
          onClearAll={clearAllReadings}
        >
          <Button
            variant="ghost"
            size="icon"
            className="text-gold/60 hover:text-gold hover:bg-gold/10"
          >
            <History className="h-5 w-5" />
          </Button>
        </HistoryDrawer>

        <div className="flex items-center gap-2">
          <Link
            to="/daily"
            className="text-gold/60 hover:text-gold transition-colors"
            title="Daily Oracle"
          >
            <Sun className="h-5 w-5" />
          </Link>
          <h1 className="font-display text-lg md:text-xl text-gold-gradient tracking-widest">
            Victorian Quantum Veil
          </h1>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gold/60 hover:text-gold hover:bg-gold/10"
            >
              <Info className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-gold/30 max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display text-gold text-lg">
                About This Oracle
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 font-body text-foreground/80">
              <p>This is not fortune-telling. It is a mirror for reflection.</p>
              <p>
                Like quantum particles existing in superposition until observed,
                possibilities coexist until consciousness collapses them into experience.
                The cards you receive are not predictions—they are symbolic lenses
                through which to examine your inner landscape.
              </p>
              <p>
                The "echoes" represent paths not taken, parallel possibilities
                that remain ghostly real. Notice which resonates. Notice what you feel.
              </p>
              <p className="text-gold/60 italic text-sm">
                There are no answers here—only clearer questions.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8 relative z-10">
        {/* Intent selection phase */}
        {state === "intent" && (
          <div className="flex flex-col items-center gap-8 md:gap-12 animate-fade-in-up">
            <div className="text-center space-y-2">
              <h2 className="font-display text-xl md:text-2xl text-gold/90">
                Set Your Intention
              </h2>
              <p className="font-body text-sm md:text-base text-muted-foreground italic">
                What draws your attention inward?
              </p>
            </div>

            <IntentSelector
              selectedTheme={selectedTheme}
              customIntent={customIntent}
              onThemeSelect={setSelectedTheme}
              onCustomIntentChange={setCustomIntent}
            />

            {/* Spread selector */}
            <SpreadSelector selected={spreadType} onSelect={setSpreadType} />

            <button
              onClick={handleProceedToCard}
              className="
                mt-4 px-8 py-3 rounded-full
                font-display text-base tracking-wider
                border border-gold/50 text-gold
                bg-transparent hover:bg-gold/10 hover:border-gold
                transition-all duration-300
              "
            >
              Approach the Veil
            </button>
          </div>
        )}

        {/* Cosmic Moment */}
        {state === "cosmic-moment" && (
          <div className="flex flex-col items-center gap-6 animate-fade-in-up text-center">
            <Sparkles className="w-8 h-8 text-gold/60 animate-gentle-pulse" />
            <div className="space-y-3">
              <p className="font-display text-lg md:text-xl text-gold/90">
                The veil opens during a {cosmicWeather.moonPhase}...
              </p>
              <p className="font-body text-sm md:text-base text-foreground/70 italic">
                {cosmicWeather.dominantElement.charAt(0).toUpperCase() + cosmicWeather.dominantElement.slice(1)} energies flow through this moment
              </p>
              {spreadType !== "single" && (
                <p className="font-body text-xs text-gold/50 italic mt-2">
                  {getCardCount(spreadType)} threads of fate await your observation…
                </p>
              )}
            </div>
          </div>
        )}

        {/* Hidden card phase */}
        {(state === "hidden" || state === "collapsing") && (
          <div className="flex flex-col items-center gap-6 md:gap-8 animate-fade-in-up">
            {(selectedTheme || customIntent) && (
              <p className="font-body text-sm text-gold/60 italic">
                {customIntent || selectedTheme}
              </p>
            )}

            {spreadType !== "single" ? (
              <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap max-w-md">
                {Array.from({ length: getCardCount(spreadType) }).map((_, i) => {
                  const isCenterCard = i === Math.floor(getCardCount(spreadType) / 2);
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div
                        onClick={isCenterCard ? handleCardClick : undefined}
                        className={isCenterCard ? "cursor-pointer" : "opacity-50"}
                      >
                        <CardBack
                          onClick={isCenterCard ? handleCardClick : () => {}}
                          isAnimating={state === "collapsing"}
                          size={isCenterCard ? "full" : "small"}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <CardBack onClick={handleCardClick} isAnimating={state === "collapsing"} />
            )}

            <p className="font-body text-center text-sm md:text-base text-muted-foreground italic max-w-xs">
              {state === "collapsing"
                ? "The wave collapses…"
                : spreadType !== "single"
                ? "Focus your intention… then touch the center card to observe"
                : "Focus your intention… then touch to observe"}
            </p>
          </div>
        )}

        {/* Revealed phase */}
        {state === "revealed" && primaryCard && (
          spreadType !== "single" && spreadCards.length > 0 ? (
            <SpreadReadingDisplay
              cards={spreadCards}
              spreadType={spreadType}
              onNewReading={handleNewReading}
            />
          ) : (
            <ReadingDisplay
              primaryCard={primaryCard}
              echoCards={echoCards}
              onNewReading={handleNewReading}
            />
          )
        )}
      </main>

      {/* Ambient particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float-particles ${getParticleColor(i)}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default OracleScreen;
