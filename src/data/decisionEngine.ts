/**
 * Decision mode — a low-friction "yes / no / not yet" draw for moments of
 * decision paralysis. This is a tie-breaker and a reflection prompt, never a
 * command: the verdict exists to surface your own reaction to it.
 */

import { selectCardWithIntent, type TarotCard } from "@/data/tarotCards";
import { takeBytes, getLastEntropySource, type EntropySource } from "@/lib/quantumEntropy";

export type Verdict = "yes" | "no" | "not-yet";

/** Inherent lean of each Major Arcana card, by id. */
const affirming = new Set([0, 1, 3, 6, 8, 10, 11, 14, 17, 19, 21]);
const resisting = new Set([5, 7, 12, 13, 15, 16, 18]);

export interface DecisionResult {
  card: TarotCard;
  verdict: Verdict;
  reversed: boolean;
  source: EntropySource;
  headline: string;
  body: string;
  reflection: string;
}

const headlines: Record<Verdict, string> = {
  yes: "Yes — lean in",
  no: "No — not this one",
  "not-yet": "Not yet — hold the question",
};

const bodies: Record<Verdict, string> = {
  yes: "The draw leans toward movement. If that reading lands as relief, that is your own answer arriving.",
  no: "The draw leans away from this option. If that reading stings, notice what part of you wanted the other answer.",
  "not-yet": "The draw refuses to settle. Usually that means a piece of information, or a feeling, is still missing.",
};

const reflections: Record<Verdict, string> = {
  yes: "What is the smallest version of this you could start today?",
  no: "If this is off the table, what quietly becomes possible instead?",
  "not-yet": "What one thing would you need to know to decide without this card?",
};

export async function drawDecision(question: string | null): Promise<DecisionResult> {
  const card = await selectCardWithIntent(null);
  const { bytes } = await takeBytes(1);
  const reversed = bytes[0] >= 128;

  let base: Verdict = affirming.has(card.id)
    ? "yes"
    : resisting.has(card.id)
      ? "no"
      : "not-yet";

  if (reversed && base === "yes") base = "no";
  else if (reversed && base === "no") base = "yes";

  const q = (question || "").trim();

  return {
    card,
    verdict: base,
    reversed,
    source: getLastEntropySource(),
    headline: headlines[base],
    body: q ? `On “${q}” — ${bodies[base]}` : bodies[base],
    reflection: reflections[base],
  };
}
