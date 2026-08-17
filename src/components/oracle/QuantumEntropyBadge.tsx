import React from "react";
import { Atom } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { EntropySource } from "@/lib/quantumEntropy";

interface QuantumEntropyBadgeProps {
  source: EntropySource;
  /** "idle" before a draw, "live" once a card has been drawn from the pool. */
  state?: "idle" | "live";
  className?: string;
}

const QuantumEntropyBadge: React.FC<QuantumEntropyBadgeProps> = ({
  source,
  state = "idle",
  className = "",
}) => {
  const isQuantum = source === "quantum";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="About the randomness source"
          className={`
            inline-flex items-center gap-2 rounded-full
            border px-3 py-1.5 font-body text-xs tracking-wide
            transition-colors duration-300
            ${isQuantum
              ? "border-gold/50 text-gold/90 bg-gold/5 hover:bg-gold/10"
              : "border-border text-muted-foreground hover:text-foreground/80"}
            ${className}
          `}
        >
          <Atom
            className={`h-3.5 w-3.5 ${isQuantum ? "animate-gentle-pulse" : ""}`}
          />
          <span>
            {isQuantum
              ? state === "live"
                ? "Drawn from ANU quantum vacuum noise"
                : "ANU quantum entropy ready"
              : state === "live"
                ? "Drawn from local device entropy"
                : "Local entropy (quantum pool warming)"}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-card border-gold/30" align="center">
        <div className="space-y-3 font-body text-sm text-foreground/80">
          <p className="font-display text-gold text-base">Where the shuffle comes from</p>
          <p>
            Cards are selected using random numbers measured from quantum vacuum
            fluctuations at the Australian National University — genuine physical
            randomness, not a software pseudo-random sequence.
          </p>
          <p>
            Bytes are fetched in advance and held in memory, so a draw never waits
            on the network. If the pool runs dry offline, your device's own
            cryptographic randomness is used instead and the label says so.
          </p>
          <p className="text-gold/60 italic text-xs">
            True randomness makes the draw unbiased — it does not make it predictive.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default QuantumEntropyBadge;
