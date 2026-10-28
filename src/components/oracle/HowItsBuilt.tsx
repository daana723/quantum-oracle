import React from "react";
import { Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const points = [
  ["Private by design", "Runs entirely in your browser. Readings stay on your device — no accounts, no trackers."],
  ["Real quantum randomness", "Cards are drawn using vacuum-fluctuation data from ANU's quantum lab, with your device's secure randomness as backup."],
  ["Hand-built sky maths", "Sun, Moon and Rising, moon phases and planetary hours are calculated on your device — no outside astrology service."],
  ["Works offline", "Installable app; 34,000+ birth towns are bundled in small pieces so everything works without signal."],
  ["Made for stuck brains", "Built for neurodivergent decision paralysis: cut options, name the loop, pick one tiny step. Reflection, never prediction."],
] as const;

const HowItsBuilt: React.FC = () => (
  <Dialog>
    <DialogTrigger asChild>
      <button className="inline-flex items-center gap-1.5 font-display text-xs tracking-wider text-gold/60 hover:text-gold transition-colors">
        <Info className="h-3.5 w-3.5" /> How it's built
      </button>
    </DialogTrigger>
    <DialogContent className="bg-card border-gold/30 max-w-md max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="font-display text-gold text-lg">How the Veil is built</DialogTitle>
      </DialogHeader>
      <ul className="space-y-4">
        {points.map(([title, body]) => (
          <li key={title}>
            <p className="font-display text-sm text-gold/90">{title}</p>
            <p className="reading-prose text-foreground/80">{body}</p>
          </li>
        ))}
      </ul>
    </DialogContent>
  </Dialog>
);

export default HowItsBuilt;
