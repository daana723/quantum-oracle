import React, { useState } from "react";
import { KeyRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import KofiButton from "@/components/oracle/KofiButton";

interface UnlockDialogProps {
  onUnlock: (code: string) => boolean;
  highlight?: boolean;
}

const UnlockDialog: React.FC<UnlockDialogProps> = ({ onUnlock, highlight }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = () => {
    if (onUnlock(code)) {
      setDone(true);
      setError(null);
    } else {
      setError("That code isn't recognised. Check for typos or use the support link.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={`font-display text-xs tracking-wider underline underline-offset-4 transition-colors ${
            highlight ? "text-gold hover:text-gold/80" : "text-gold/50 hover:text-gold"
          }`}
        >
          Unlock full access
        </button>
      </DialogTrigger>
      <DialogContent className="bg-card border-gold/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-gold text-lg flex items-center gap-2">
            <KeyRound className="h-4 w-4" /> Unlock the Veil
          </DialogTitle>
        </DialogHeader>
        {done ? (
          <p className="font-body text-foreground/80">
            Unlocked. Every spread, mode and export is open to you now.
          </p>
        ) : (
          <div className="space-y-4 font-body text-foreground/80">
            <p className="text-sm">
              The trial covers your first readings. Full access opens multi-card
              spreads, PDF reports and unlimited draws — with Unstick and the
              yes/no coin-flip always free.
            </p>
            <div className="space-y-2">
              <Input
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="Enter unlock code"
                className="bg-background/60 border-gold/30"
              />
              {error && <p className="text-xs text-rose-300/80">{error}</p>}
              <Button
                onClick={submit}
                className="w-full bg-gold/15 text-gold border border-gold/40 hover:bg-gold/25"
              >
                Redeem code
              </Button>
            </div>
            <div className="pt-2 flex justify-center">
              <KofiButton />
            </div>
            <p className="text-xs text-muted-foreground italic text-center">
              Support the project and I'll send you an unlock code.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UnlockDialog;
