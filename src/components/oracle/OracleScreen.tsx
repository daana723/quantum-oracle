import React, { useState, useCallback } from "react";
import { History, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import CardBack from "@/components/oracle/CardBack";
import CardFront from "@/components/oracle/CardFront";
import IntentSelector from "@/components/oracle/IntentSelector";
import ReadingDisplay from "@/components/oracle/ReadingDisplay";
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

type OracleState = "intent" | "hidden" | "collapsing" | "revealed";

const OracleScreen: React.FC = () => {
  const [state, setState] = useState<OracleState>("intent");
  const [selectedTheme, setSelectedTheme] = useState<ThemeType | null>(null);
  const [customIntent, setCustomIntent] = useState("");
  const [primaryCard, setPrimaryCard] = useState<TarotCard | null>(null);
  const [echoCards, setEchoCards] = useState<TarotCard[]>([]);

  const { readings, saveReading, deleteReading, clearAllReadings } = useReadingHistory();

  const handleProceedToCard = useCallback(() => {
    setState("hidden");
  }, []);

  const handleCardClick = useCallback(() => {
    if (state !== "hidden") return;

    setState("collapsing");

    // Perform the quantum collapse after animation starts
    setTimeout(() => {
      const intent = selectedTheme || (customIntent ? null : null);
      const primary = selectCardWithIntent(intent);
      const echoes = selectEchoCards(primary, intent, 2);

      setPrimaryCard(primary);
      setEchoCards(echoes);

      // Save to history
      saveReading(selectedTheme, customIntent || null, primary, echoes);

      // Transition to revealed state
      setTimeout(() => {
        setState("revealed");
      }, 800);
    }, 700);
  }, [state, selectedTheme, customIntent, saveReading]);

  const handleNewReading = useCallback(() => {
    setState("intent");
    setSelectedTheme(null);
    setCustomIntent("");
    setPrimaryCard(null);
    setEchoCards([]);
  }, []);

  return (
    <div className="min-h-screen bg-cosmic bg-nebula-overlay flex flex-col">
      {/* Header */}
      <header className="relative z-10 px-4 py-4 md:py-6 flex items-center justify-between">
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

        <h1 className="font-display text-lg md:text-xl text-gold-gradient tracking-widest">
          Victorian Quantum Veil
        </h1>

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
              <p>
                This is not fortune-telling. It is a mirror for reflection.
              </p>
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
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
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

        {/* Hidden card phase */}
        {(state === "hidden" || state === "collapsing") && (
          <div className="flex flex-col items-center gap-6 md:gap-8 animate-fade-in-up">
            {(selectedTheme || customIntent) && (
              <p className="font-body text-sm text-gold/60 italic">
                {customIntent || selectedTheme}
              </p>
            )}

            <CardBack onClick={handleCardClick} isAnimating={state === "collapsing"} />

            <p className="font-body text-center text-sm md:text-base text-muted-foreground italic max-w-xs">
              {state === "collapsing"
                ? "The wave collapses…"
                : "Focus your intention… then touch to observe"}
            </p>
          </div>
        )}

        {/* Revealed phase */}
        {state === "revealed" && primaryCard && (
          <ReadingDisplay
            primaryCard={primaryCard}
            echoCards={echoCards}
            onNewReading={handleNewReading}
          />
        )}
      </main>

      {/* Ambient particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold/20 rounded-full animate-float-particles"
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
