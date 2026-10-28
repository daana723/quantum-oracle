import React from "react";
import { KeyRound } from "lucide-react";

interface KofiButtonProps {
  className?: string;
}

/** Demo mode: no payment link yet — shows the open demo unlock code instead. */
export const DEMO_UNLOCK_CODE = "VEIL-LIFETIME";

const KofiButton: React.FC<KofiButtonProps> = ({ className = "" }) => (
  <div
    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/50 border border-gold/30 font-display text-sm tracking-wider text-gold/80 ${className}`}
  >
    <KeyRound className="w-4 h-4 text-gold/70" />
    <span>Demo mode · code <span className="text-gold">{DEMO_UNLOCK_CODE}</span></span>
  </div>
);

export default KofiButton;
