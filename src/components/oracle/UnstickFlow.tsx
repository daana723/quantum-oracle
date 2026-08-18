import React, { useCallback, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Plus, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { randomInt } from "@/lib/quantumEntropy";
import QuantumEntropyBadge from "./QuantumEntropyBadge";
import { getLastEntropySource, type EntropySource } from "@/lib/quantumEntropy";

/**
 * Unstick — a gentle, step-by-step flow for decision paralysis.
 * Reduce the options, name the loop, then pick exactly one next action.
 * Nothing here predicts anything; it just shrinks the decision until it moves.
 */

const LOOPS = [
  { id: "perfect", label: "Waiting to be sure", note: "Certainty isn't coming. A reversible step is enough." },
  { id: "compare", label: "Endless comparing", note: "Past a point, more comparing adds cost, not clarity." },
  { id: "fear", label: "Fear of the wrong choice", note: "Most choices are edits, not verdicts." },
  { id: "please", label: "Guessing what others want", note: "Whose voice is arguing right now? Name them." },
  { id: "flood", label: "Too many tabs open at once", note: "Overload, not laziness. Cut the list, not yourself." },
  { id: "freeze", label: "Blank / shut down", note: "A stalled brain needs a smaller ask, not more pressure." },
];

const STEP_TITLES = [
  "What are you stuck on?",
  "Cut it down",
  "Name the loop",
  "One next action",
];

const UnstickFlow: React.FC = () => {
  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [loop, setLoop] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [action, setAction] = useState("");
  const [committed, setCommitted] = useState(false);
  const [source, setSource] = useState<EntropySource>("local");

  const loopNote = useMemo(() => LOOPS.find((l) => l.id === loop)?.note ?? null, [loop]);

  const addOption = useCallback(() => {
    const v = draft.trim();
    if (!v) return;
    setOptions((o) => (o.length >= 6 ? o : [...o, v]));
    setDraft("");
  }, [draft]);

  const removeOption = useCallback((i: number) => {
    setOptions((o) => o.filter((_, idx) => idx !== i));
    setPicked(null);
  }, []);

  const quantumCut = useCallback(async () => {
    if (options.length < 3) return;
    const keep = [...options];
    while (keep.length > 2) {
      const i = await randomInt(keep.length);
      keep.splice(i, 1);
    }
    setSource(getLastEntropySource());
    setOptions(keep);
    setPicked(null);
  }, [options]);

  const quantumPick = useCallback(async () => {
    if (options.length === 0) return;
    const i = await randomInt(options.length);
    setSource(getLastEntropySource());
    setPicked(options[i]);
  }, [options]);

  const reset = useCallback(() => {
    setStep(0);
    setTopic("");
    setOptions([]);
    setDraft("");
    setLoop(null);
    setPicked(null);
    setAction("");
    setCommitted(false);
  }, []);

  const canAdvance =
    step === 0 ? topic.trim().length > 0 : step === 1 ? options.length > 0 : step === 2 ? !!loop : true;

  if (committed) {
    return (
      <div className="w-full max-w-md flex flex-col items-center gap-5 animate-fade-in-up text-center">
        <Check className="h-7 w-7 text-gold/70" />
        <h3 className="font-display text-2xl text-gold-gradient tracking-wide">One thing, that's all</h3>
        <div className="w-full rounded-lg border border-gold/25 bg-gold/5 p-5 space-y-2">
          <p className="font-body text-sm text-muted-foreground italic">Your next action</p>
          <p className="font-body text-base text-foreground/90">{action || picked}</p>
        </div>
        <p className="font-body text-xs text-muted-foreground/80 italic max-w-xs">
          Do it badly if needed. Finishing the loop matters more than the quality of this one step.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-display text-sm tracking-wider border border-gold/50 text-gold hover:bg-gold/10 transition-all"
        >
          <RotateCcw className="h-4 w-4" /> Start again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-5">
      <div className="text-center space-y-2">
        <h2 className="font-display text-xl md:text-2xl text-gold/90">Unstick</h2>
        <p className="font-body text-sm text-muted-foreground italic max-w-sm">
          Four small steps for a brain that has stalled. No pressure, no timer, no wrong answers.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEP_TITLES.map((t, i) => (
          <span
            key={t}
            className={`h-1.5 rounded-full transition-all ${
              i === step ? "w-8 bg-gold/70" : i < step ? "w-4 bg-gold/40" : "w-4 bg-gold/15"
            }`}
          />
        ))}
      </div>

      <h3 className="font-display text-lg text-gold/80 text-center">{STEP_TITLES[step]}</h3>

      {step === 0 && (
        <div className="w-full space-y-3">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. which course to sign up for"
            className="w-full text-center font-body bg-transparent border-gold/30 placeholder:text-gold/40 placeholder:italic focus:border-gold"
          />
          <p className="font-body text-xs text-muted-foreground/80 italic text-center">
            Just a few words. Naming it out loud already lowers the load.
          </p>
        </div>
      )}

      {step === 1 && (
        <div className="w-full space-y-3">
          <div className="flex gap-2">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addOption()}
              placeholder="Add an option…"
              className="flex-1 font-body bg-transparent border-gold/30 placeholder:text-gold/40 placeholder:italic focus:border-gold"
            />
            <button
              onClick={addOption}
              aria-label="Add option"
              className="px-3 rounded-md border border-gold/40 text-gold hover:bg-gold/10 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <ul className="space-y-2">
            {options.map((o, i) => (
              <li
                key={`${o}-${i}`}
                className="flex items-center justify-between gap-3 rounded-md border border-gold/20 bg-gold/5 px-3 py-2"
              >
                <span className="font-body text-sm text-foreground/85">{o}</span>
                <button onClick={() => removeOption(i)} aria-label={`Remove ${o}`} className="text-gold/50 hover:text-gold">
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>

          {options.length > 2 && (
            <button
              onClick={quantumCut}
              className="w-full px-4 py-2 rounded-full font-display text-sm tracking-wide border border-gold/40 text-gold/85 hover:bg-gold/10 transition-all"
            >
              Cut down to two at random
            </button>
          )}
          <p className="font-body text-xs text-muted-foreground/80 italic text-center">
            Fewer options, less overwhelm. Anything cut can come back later — this isn't final.
          </p>
        </div>
      )}

      {step === 2 && (
        <div className="w-full space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {LOOPS.map((l) => (
              <button
                key={l.id}
                onClick={() => setLoop(l.id)}
                className={`text-left rounded-md border px-3 py-2 font-body text-sm transition-colors ${
                  loop === l.id
                    ? "border-gold/60 bg-gold/10 text-gold"
                    : "border-gold/20 text-foreground/80 hover:border-gold/40"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          {loopNote && (
            <div className="rounded-lg border border-gold/20 bg-gold/5 p-3 text-center">
              <p className="font-body text-sm text-foreground/85">{loopNote}</p>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="w-full space-y-3">
          {options.length > 0 && (
            <>
              <div className="space-y-2">
                {options.map((o, i) => (
                  <button
                    key={`${o}-${i}`}
                    onClick={() => setPicked(o)}
                    className={`w-full text-left rounded-md border px-3 py-2 font-body text-sm transition-colors ${
                      picked === o
                        ? "border-gold/60 bg-gold/10 text-gold"
                        : "border-gold/20 text-foreground/80 hover:border-gold/40"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
              <button
                onClick={quantumPick}
                className="w-full px-4 py-2 rounded-full font-display text-sm tracking-wide border border-gold/40 text-gold/85 hover:bg-gold/10 transition-all"
              >
                Let the quantum coin choose
              </button>
              <QuantumEntropyBadge source={source} state="idle" />
            </>
          )}

          <Input
            value={action}
            onChange={(e) => setAction(e.target.value)}
            placeholder={picked ? `First tiny step toward “${picked}”…` : "One small next action…"}
            className="w-full font-body bg-transparent border-gold/30 placeholder:text-gold/40 placeholder:italic focus:border-gold"
          />
          <p className="font-body text-xs text-muted-foreground/80 italic text-center">
            Make it two minutes long. Open the tab, write the first line, send the one message.
          </p>
          <button
            onClick={() => setCommitted(true)}
            disabled={!action.trim() && !picked}
            className="w-full px-6 py-2.5 rounded-full font-display text-sm tracking-wider border border-gold/50 text-gold hover:bg-gold/10 transition-all disabled:opacity-40"
          >
            That's my one thing
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between w-full pt-1">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-display text-sm text-gold/70 hover:text-gold disabled:opacity-30 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        {step < 3 && (
          <button
            onClick={() => setStep((s) => Math.min(3, s + 1))}
            disabled={!canAdvance}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full font-display text-sm tracking-wide border border-gold/50 text-gold hover:bg-gold/10 disabled:opacity-40 transition-all"
          >
            Next <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      <button onClick={reset} className="font-body text-xs text-muted-foreground/70 hover:text-gold/70 underline underline-offset-4">
        Start over
      </button>
    </div>
  );
};

export default UnstickFlow;
