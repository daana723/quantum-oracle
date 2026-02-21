import React, { useState, useCallback, useRef, useEffect } from "react";
import { X } from "lucide-react";

interface GuidedMeditationProps {
  onComplete: () => void;
  onSkip: () => void;
}

const PHASES = [
  { label: "Breathe In", duration: 4000, instruction: "Draw breath slowly through your nose…" },
  { label: "Hold", duration: 4000, instruction: "Let the stillness settle within…" },
  { label: "Breathe Out", duration: 6000, instruction: "Release gently through your lips…" },
  { label: "Rest", duration: 2000, instruction: "A moment of emptiness before the next wave…" },
];

const TOTAL_CYCLES = 3;

const GuidedMeditation: React.FC<GuidedMeditationProps> = ({ onComplete, onSkip }) => {
  const [cycle, setCycle] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [started, setStarted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const phase = PHASES[phaseIndex];

  // Ambient tone using Web Audio API
  const playTone = useCallback((frequency: number, duration: number) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.5);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration / 1000);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration / 1000);
    } catch {
      // Web Audio not available — silently continue
    }
  }, []);

  const advancePhase = useCallback(() => {
    setPhaseIndex((prev) => {
      const next = prev + 1;
      if (next >= PHASES.length) {
        setCycle((c) => {
          const nextCycle = c + 1;
          if (nextCycle >= TOTAL_CYCLES) {
            onComplete();
            return c;
          }
          return nextCycle;
        });
        return 0;
      }
      return next;
    });
    setProgress(0);
  }, [onComplete]);

  const startMeditation = useCallback(() => {
    setStarted(true);
    playTone(174, 3000); // grounding frequency
  }, [playTone]);

  // Phase timer
  useEffect(() => {
    if (!started) return;

    const dur = PHASES[phaseIndex].duration;
    const step = 50;
    let elapsed = 0;

    // Play subtle tone on inhale
    if (phaseIndex === 0) {
      playTone(396, dur);
    } else if (phaseIndex === 2) {
      playTone(285, dur);
    }

    intervalRef.current = window.setInterval(() => {
      elapsed += step;
      setProgress(Math.min(elapsed / dur, 1));
    }, step);

    timeoutRef.current = window.setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      advancePhase();
    }, dur);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [started, phaseIndex, cycle, advancePhase, playTone]);

  // Cleanup audio context
  useEffect(() => {
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const ringSize = 200;
  const strokeWidth = 4;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  if (!started) {
    return (
      <div className="flex flex-col items-center gap-8 animate-fade-in-up text-center">
        <div className="w-24 h-24 rounded-full border border-gold/30 flex items-center justify-center animate-gentle-pulse">
          <span className="text-3xl">🕯️</span>
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-xl text-gold/90 tracking-wider">Center Yourself</h2>
          <p className="font-body text-sm text-foreground/60 italic max-w-xs">
            A brief breathing exercise to quiet the mind before the veil parts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={startMeditation}
            className="px-8 py-3 rounded-full font-display text-base tracking-wider border border-gold/50 text-gold bg-transparent hover:bg-gold/10 transition-all duration-300"
          >
            Begin
          </button>
          <button
            onClick={onSkip}
            className="px-6 py-3 rounded-full font-body text-sm text-muted-foreground hover:text-foreground/80 transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in-up text-center relative">
      <button
        onClick={onSkip}
        className="absolute top-0 right-0 text-muted-foreground hover:text-foreground/80 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Breathing ring */}
      <div className="relative" style={{ width: ringSize, height: ringSize }}>
        <svg width={ringSize} height={ringSize} className="transform -rotate-90">
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            fill="none"
            stroke="hsl(45 80% 55% / 0.15)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            fill="none"
            stroke="hsl(45 80% 55% / 0.7)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-all duration-100"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-lg text-gold/90 tracking-wider">{phase.label}</span>
          <span className="font-body text-xs text-muted-foreground mt-1">
            {cycle + 1}/{TOTAL_CYCLES}
          </span>
        </div>
      </div>

      <p className="font-body text-sm text-foreground/60 italic max-w-xs">
        {phase.instruction}
      </p>
    </div>
  );
};

export default GuidedMeditation;
