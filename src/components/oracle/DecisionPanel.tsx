import React, { useState, useCallback } from "react";
import { Scale, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import CardFront from "./CardFront";
import QuantumEntropyBadge from "./QuantumEntropyBadge";
import { drawDecision, type DecisionResult } from "@/data/decisionEngine";

const DecisionPanel: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [drawing, setDrawing] = useState(false);

  const handleDraw = useCallback(async () => {
    setDrawing(true);
    try {
      const r = await drawDecision(question);
      setResult(r);
    } finally {
      setDrawing(false);
    }
  }, [question]);

  const handleReset = useCallback(() => {
    setResult(null);
  }, []);

  if (result) {
    return (
      <div className="w-full max-w-md flex flex-col items-center gap-5 animate-fade-in-up">
        <CardFront card={result.card} isRevealed={true} size="small" />
        <div className="text-center space-y-3">
          <h3 className="font-display text-2xl text-gold-gradient tracking-wide">
            {result.headline}
          </h3>
          <p className="font-body text-sm md:text-base text-foreground/85 leading-relaxed">
            {result.body}
          </p>
          <p className="font-body text-sm text-gold/70 italic">
            {result.card.name}
            {result.reversed ? " (reversed)" : ""} — {result.card.keywords.slice(0, 3).join(", ")}
          </p>
        </div>

        <div className="w-full rounded-lg border border-gold/20 bg-gold/5 p-4 text-center">
          <p className="font-body text-sm text-foreground/80">{result.reflection}</p>
        </div>

        <QuantumEntropyBadge source={result.source} state="live" />

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-display text-sm tracking-wider border border-gold/50 text-gold hover:bg-gold/10 transition-all"
        >
          <RotateCcw className="h-4 w-4" /> Ask something else
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-5">
      <div className="text-center space-y-2">
        <Scale className="h-6 w-6 text-gold/60 mx-auto" />
        <h2 className="font-display text-xl md:text-2xl text-gold/90">
          Break the Deadlock
        </h2>
        <p className="font-body text-sm text-muted-foreground italic max-w-sm">
          For when the deciding itself is the hard part. One quantum coin-flip, one
          card, one prompt — then notice how the answer lands in your body.
        </p>
      </div>

      <Input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Should I…?"
        className="w-full text-center font-body text-base bg-transparent border-gold/30 placeholder:text-gold/40 placeholder:italic focus:border-gold"
      />

      <button
        onClick={handleDraw}
        disabled={drawing}
        className="px-8 py-3 rounded-full font-display text-base tracking-wider border border-gold/50 text-gold hover:bg-gold/10 hover:border-gold transition-all disabled:opacity-50"
      >
        {drawing ? "Collapsing the wave…" : "Flip the Quantum Coin"}
      </button>

      <p className="font-body text-xs text-muted-foreground/70 italic text-center max-w-xs">
        This is a tie-breaker, not an instruction. Relief or resistance to the answer
        is the actual signal.
      </p>
    </div>
  );
};

export default DecisionPanel;
