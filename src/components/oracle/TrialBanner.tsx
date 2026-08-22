import React from "react";
import { Hourglass, Sparkles } from "lucide-react";
import UnlockDialog from "@/components/oracle/UnlockDialog";

interface TrialBannerProps {
  unlocked: boolean;
  daysLeft: number;
  readingsLeft: number;
  onUnlock: (code: string) => boolean;
}

const TrialBanner: React.FC<TrialBannerProps> = ({
  unlocked,
  daysLeft,
  readingsLeft,
  onUnlock,
}) => {
  if (unlocked) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-card/40 font-body text-xs text-gold/80">
        <Sparkles className="h-3.5 w-3.5" />
        Full access unlocked — thank you for keeping the candle lit
      </div>
    );
  }

  const expired = daysLeft <= 0 || readingsLeft <= 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/25 bg-card/40 font-body text-xs text-gold/70">
        <Hourglass className="h-3.5 w-3.5" />
        {expired
          ? "Trial complete — unlock to keep drawing"
          : `Trial: ${readingsLeft} reading${readingsLeft === 1 ? "" : "s"} left · ${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining`}
      </div>
      <UnlockDialog onUnlock={onUnlock} highlight={expired} />
    </div>
  );
};

export default TrialBanner;
