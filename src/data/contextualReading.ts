/**
 * Contextual reading engine — turns the drawn cards, their spread positions and
 * the querent's chosen question context into reflective (never predictive) prose.
 * All content is derived from existing card data; nothing is fetched or invented
 * at runtime.
 */

import type { TarotCard } from "@/data/tarotCards";
import { themeCardWeights } from "@/data/tarotCards";
import { cardInterpretations } from "@/data/cardInterpretations";

export type IntentTheme = "love" | "career" | "change" | "self" | "shadow" | "clarity";

export const intentLabels: Record<IntentTheme, string> = {
  love: "matters of the heart",
  career: "your work and vocation",
  change: "the transition you are moving through",
  self: "your sense of self",
  shadow: "what has been kept in shadow",
  clarity: "the clarity you are seeking",
};

/** Keyword scan used to map a free-typed intent onto the closest built-in theme. */
const intentKeywords: Record<IntentTheme, string[]> = {
  love: ["love", "partner", "relationship", "romance", "heart", "marriage", "dating", "ex", "friend", "family", "connection"],
  career: ["career", "job", "work", "business", "money", "finance", "study", "school", "project", "boss", "promotion"],
  change: ["change", "move", "moving", "decision", "choice", "transition", "leave", "start", "end", "new", "future"],
  self: ["self", "me", "who am i", "identity", "confidence", "worth", "purpose", "healing", "body", "growth"],
  shadow: ["fear", "shadow", "anger", "grief", "shame", "block", "stuck", "addiction", "pattern", "trauma", "avoid"],
  clarity: ["clarity", "understand", "confused", "truth", "why", "should", "know", "answer", "meaning", "clear"],
};

export function resolveIntentTheme(
  intent: string | null,
  customIntent?: string | null,
): IntentTheme | null {
  if (intent && intent in themeCardWeights) return intent as IntentTheme;

  const text = (customIntent || "").toLowerCase().trim();
  if (!text) return null;

  let best: { theme: IntentTheme; score: number } | null = null;
  (Object.keys(intentKeywords) as IntentTheme[]).forEach((theme) => {
    const score = intentKeywords[theme].filter((kw) => text.includes(kw)).length;
    if (score > 0 && (!best || score > best.score)) best = { theme, score };
  });

  return best ? best.theme : null;
}

/** Human-readable phrase for the question context, used inside summaries. */
export function describeIntent(
  intent: string | null,
  customIntent?: string | null,
): string {
  const custom = (customIntent || "").trim();
  if (custom) return `“${custom}”`;
  const theme = resolveIntentTheme(intent, customIntent);
  return theme ? intentLabels[theme] : "the question you carried into this observation";
}

/* ------------------------------------------------------------------ */
/* Position lens                                                       */
/* ------------------------------------------------------------------ */

const positionLenses: Record<string, string> = {
  Past: "Held in the past, these signs describe an influence that has already done its work — what remains is the imprint, not the event.",
  Present: "Standing in the present, these signs describe the texture of now: what is actually alive in you rather than what you intend.",
  Future: "Cast forward, these signs describe a tendency, not a verdict — the direction things lean if nothing is consciously changed.",
  Situation: "At the heart of the matter, these signs name the true subject of the question, which is rarely the one first asked.",
  Challenge: "Crossing you, these signs describe the friction — the thing that resists, and therefore the thing that teaches.",
  Foundation: "Beneath the surface, these signs describe the older material the situation is built upon.",
  "Recent Past": "Just behind you, these signs describe an influence still fading, its colour still on your hands.",
  Potential: "As potential, these signs describe what could crystallise if attention is given rather than withheld.",
  Crown: "Crowning the reading, these signs describe the highest expression available here — an aim, not a promise.",
  "Near Future": "Approaching, these signs describe the next texture likely to arrive at the edge of the situation.",
  Self: "In the seat of self, these signs describe how you currently see yourself inside this question.",
  Environment: "In the surrounding field, these signs describe the influences you did not author but must account for.",
  "Hopes & Fears": "In this position, these signs describe the longing and the dread that share the same root.",
  Outcome: "At the far edge, these signs describe where the current pattern tends — a horizon that moves as you move.",
};

export function getPositionalSymbolism(card: TarotCard, positionLabel?: string): string {
  const base = card.symbolism;
  if (!positionLabel) return base;
  const lens = positionLenses[positionLabel];
  return lens ? `${base} ${lens}` : base;
}

/* ------------------------------------------------------------------ */
/* Intent lens per card                                                */
/* ------------------------------------------------------------------ */

const intentOpeners: Record<IntentTheme, { resonant: string; oblique: string }> = {
  love: {
    resonant: "Within matters of the heart, this card speaks directly",
    oblique: "This card does not centre on love, yet it touches the heart obliquely",
  },
  career: {
    resonant: "In the field of work and vocation, this card speaks directly",
    oblique: "This card sits outside ordinary ambition, yet it bears on the work",
  },
  change: {
    resonant: "Amid transition, this card speaks directly",
    oblique: "This card holds still while things move around it",
  },
  self: {
    resonant: "In the question of who you are, this card speaks directly",
    oblique: "This card looks outward, yet what it shows returns to you",
  },
  shadow: {
    resonant: "In shadow work, this card speaks directly",
    oblique: "This card carries light into the question, which is its own kind of confrontation",
  },
  clarity: {
    resonant: "In the search for clarity, this card speaks directly",
    oblique: "This card resists tidy explanation, and that resistance is information",
  },
};

/** One sentence relating a single card to the chosen question context. */
export function getIntentLens(
  card: TarotCard,
  intent: string | null,
  customIntent?: string | null,
): string | null {
  const theme = resolveIntentTheme(intent, customIntent);
  if (!theme) {
    const custom = (customIntent || "").trim();
    if (!custom) return null;
    return `Held against “${custom}”, this card offers ${card.keywords.slice(0, 2).join(" and ")} as the lens — read it as a question, not an answer.`;
  }

  const resonant = card.themes.includes(theme) || (themeCardWeights[theme] || []).includes(card.id);
  const opener = intentOpeners[theme][resonant ? "resonant" : "oblique"];
  const keys = card.keywords.slice(0, 2).join(" and ");
  return `${opener}: ${keys} colour how ${intentLabels[theme]} is being met right now.`;
}

/* ------------------------------------------------------------------ */
/* Whole-reading interpretive summary                                  */
/* ------------------------------------------------------------------ */

const elementTone: Record<string, string> = {
  fire: "urgency and appetite",
  water: "feeling and undertow",
  air: "thought, language and distance",
  earth: "body, resources and slow time",
  spirit: "meaning that outruns explanation",
};

export interface ContextualSummaryInput {
  cards: TarotCard[];
  positions?: string[];
  intent: string | null;
  customIntent?: string | null;
  spreadType?: string;
}

export interface ContextualSummary {
  heading: string;
  paragraphs: string[];
  prompt?: string;
  affirmation?: string;
}

export function getContextualSummary({
  cards,
  positions,
  intent,
  customIntent,
}: ContextualSummaryInput): ContextualSummary | null {
  if (!cards.length) return null;

  const theme = resolveIntentTheme(intent, customIntent);
  const contextPhrase = describeIntent(intent, customIntent);

  // Dominant element
  const counts: Record<string, number> = {};
  cards.forEach((c) => {
    counts[c.element] = (counts[c.element] || 0) + 1;
  });
  const [dominantElement] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

  // Anchor card: the one most resonant with the chosen theme, else the first drawn.
  const anchor =
    (theme &&
      cards.find(
        (c) => c.themes.includes(theme) || (themeCardWeights[theme] || []).includes(c.id),
      )) ||
    cards[0];
  const anchorIndex = cards.indexOf(anchor);
  const anchorPosition = positions?.[anchorIndex];

  const paragraphs: string[] = [];

  paragraphs.push(
    `You brought ${contextPhrase} to the veil, and the draw answers in ${elementTone[dominantElement] || "mixed currents"}. ` +
      `${anchor.name}${anchorPosition ? ` in ${anchorPosition}` : ""} carries the weight of the reading: ${anchor.keywords
        .slice(0, 3)
        .join(", ")}.`,
  );

  if (cards.length > 1) {
    const first = cards[0];
    const last = cards[cards.length - 1];
    const firstPos = positions?.[0];
    const lastPos = positions?.[positions.length - 1];
    paragraphs.push(
      `Read as a movement, the spread travels from ${first.name}${firstPos ? ` (${firstPos})` : ""} to ${last.name}${
        lastPos ? ` (${lastPos})` : ""
      } — from ${first.keywords[0]} toward ${last.keywords[0]}. The distance between those two words is the actual work this question is asking of you.`,
    );
  } else {
    paragraphs.push(
      `Its echoes are not rival futures but the same question turned in the light — what you would meet if you approached ${contextPhrase} from another angle.`,
    );
  }

  const themeLine = theme
    ? `Nothing here forecasts an outcome. Held against ${intentLabels[theme]}, the cards describe the shape of your current relationship to it — which is the one thing you can still change.`
    : `Nothing here forecasts an outcome. The cards describe a shape you can recognise; the meaning is made in the recognising.`;
  paragraphs.push(themeLine);

  const interpretation = cardInterpretations[anchor.id];
  const prompt = interpretation?.reflectionPrompts?.[0];
  const affirmation = interpretation?.affirmation;

  return {
    heading: cards.length > 1 ? "Interpretive Summary" : "What This Means for Your Question",
    paragraphs,
    prompt,
    affirmation,
  };
}
