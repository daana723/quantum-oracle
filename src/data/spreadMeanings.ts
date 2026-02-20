import type { TarotCard } from "@/data/tarotCards";

export type SpreadType = "single" | "past-present-future";

export interface SpreadPosition {
  label: string;
  sublabel: string;
  icon: string;
}

export const spreadPositions: Record<string, SpreadPosition[]> = {
  "past-present-future": [
    { label: "Past", sublabel: "What shaped this moment", icon: "◁" },
    { label: "Present", sublabel: "Where you stand now", icon: "◈" },
    { label: "Future", sublabel: "What emerges ahead", icon: "▷" },
  ],
};

/** Generate a relational meaning between two cards in adjacent positions */
export function getRelationalMeaning(
  fromCard: TarotCard,
  fromPosition: string,
  toCard: TarotCard,
  toPosition: string
): string {
  // Element interaction
  const elementRelation = getElementInteraction(fromCard.element, toCard.element);

  // Thematic thread
  const sharedThemes = fromCard.themes.filter((t) => toCard.themes.includes(t));
  const thematicThread = sharedThemes.length > 0
    ? getThematicBridge(sharedThemes[0], fromPosition, toPosition)
    : getContrastBridge(fromCard, toCard, fromPosition, toPosition);

  return `${elementRelation} ${thematicThread}`;
}

function getElementInteraction(
  from: string,
  to: string
): string {
  const key = `${from}-${to}`;
  const interactions: Record<string, string> = {
    "fire-fire": "Flames feed flames—intensity compounds.",
    "fire-water": "Steam rises where fire meets water—transformation through tension.",
    "fire-air": "Wind fans the flame—thought ignites action.",
    "fire-earth": "Fire tempers earth into something enduring.",
    "water-fire": "Emotion tests will—what survives the quenching?",
    "water-water": "Currents merge into deeper waters.",
    "water-air": "Mist forms where feeling meets thought—clarity awaits patience.",
    "water-earth": "Water nourishes earth—emotion roots into form.",
    "air-fire": "Ideas spark into passionate pursuit.",
    "air-water": "The mind attempts to hold what flows—understanding requires feeling.",
    "air-air": "Thoughts multiply and cross-pollinate.",
    "air-earth": "Theory seeks grounding—abstraction meets reality.",
    "earth-fire": "The ground trembles with new energy breaking through.",
    "earth-water": "Fertile ground—what is planted here will grow.",
    "earth-air": "Structure gives shape to scattered ideas.",
    "earth-earth": "Foundation upon foundation—stability deepens.",
    "spirit-fire": "The sacred ignites purpose.",
    "spirit-water": "Transcendence flows through intuition.",
    "spirit-air": "Higher mind illuminates ordinary thought.",
    "spirit-earth": "The divine manifests in matter.",
    "fire-spirit": "Will reaches toward the infinite.",
    "water-spirit": "Emotion dissolves into the boundless.",
    "air-spirit": "Thought transcends into knowing.",
    "earth-spirit": "The material world reveals its sacred nature.",
    "spirit-spirit": "Pure potential meeting pure potential—all things are possible.",
  };

  return interactions[key] || "Energies interweave in unexpected patterns.";
}

function getThematicBridge(
  sharedTheme: string,
  fromPos: string,
  toPos: string
): string {
  const bridges: Record<string, Record<string, string>> = {
    love: {
      "Past-Present": "A pattern of the heart repeats, asking to be recognized before it can evolve.",
      "Present-Future": "What you nurture in connection now seeds the intimacy that awaits.",
      "Past-Future": "The heart's journey arcs from wound to wisdom, from lesson to liberation.",
    },
    career: {
      "Past-Present": "Professional foundations laid before now bear visible fruit—or reveal cracks.",
      "Present-Future": "Current ambitions chart the course; commitment today shapes tomorrow's harvest.",
      "Past-Future": "The arc of purpose bends from apprenticeship toward mastery.",
    },
    change: {
      "Past-Present": "A transformation begun continues to unfold—you are still becoming.",
      "Present-Future": "The threshold you stand upon leads somewhere you cannot yet fully see.",
      "Past-Future": "Change bookends this spread—what was released makes space for what arrives.",
    },
    self: {
      "Past-Present": "Who you were informs who you are—but need not define who you become.",
      "Present-Future": "Self-knowledge gained now becomes the compass for what follows.",
      "Past-Future": "The self evolves through its own story, each chapter deepening the narrative.",
    },
    shadow: {
      "Past-Present": "What was hidden then surfaces now, not as threat but as invitation.",
      "Present-Future": "The shadow acknowledged today loses its power to sabotage tomorrow.",
      "Past-Future": "From denial to integration—the shadow's journey mirrors your own growth.",
    },
    clarity: {
      "Past-Present": "Understanding crystallizes as past confusion meets present awareness.",
      "Present-Future": "The clarity you hold now illuminates the path that opens ahead.",
      "Past-Future": "From fog to light—the mind's journey toward its own truth.",
    },
  };

  const posKey = `${fromPos}-${toPos}`;
  return bridges[sharedTheme]?.[posKey] || "A thread of meaning connects these positions, waiting to be traced.";
}

function getContrastBridge(
  fromCard: TarotCard,
  toCard: TarotCard,
  fromPos: string,
  toPos: string
): string {
  const contrasts: Record<string, string> = {
    "Past-Present": `Where ${fromCard.name} once held sway, ${toCard.name} now speaks—a shift in the inner landscape.`,
    "Present-Future": `${fromCard.name}'s current teaching gives way to ${toCard.name}'s emerging wisdom.`,
    "Past-Future": `The journey from ${fromCard.name} to ${toCard.name} traces the full arc of this transformation.`,
  };

  const posKey = `${fromPos}-${toPos}`;
  return contrasts[posKey] || "These cards speak to each other across positions, creating meaning in their dialogue.";
}

/** Generate a synthesis reading for the whole spread */
export function getSpreadSynthesis(cards: TarotCard[]): string {
  if (cards.length !== 3) return "";

  const elements = cards.map((c) => c.element);
  const uniqueElements = [...new Set(elements)];

  let elementNarrative: string;
  if (uniqueElements.length === 1) {
    const el = uniqueElements[0];
    const mono: Record<string, string> = {
      fire: "Pure fire courses through this reading—a time of intense action, passion, and creative force. Channel this energy deliberately.",
      water: "Water dominates this spread—emotions, intuition, and the unconscious flow strongly. Trust what you feel over what you think.",
      air: "Air fills every position—the mind is exceptionally active. Ideas abound, but ensure they find grounding.",
      earth: "Earth grounds every card—this is a time for practical matters, patience, and building what lasts.",
      spirit: "Spirit pervades this reading—you are called to transcend ordinary concerns and touch something larger.",
    };
    elementNarrative = mono[el] || "A unified elemental force shapes this reading.";
  } else if (uniqueElements.length === 3) {
    elementNarrative = "Three elements converge—complexity and richness define this moment. Multiple dimensions of your life are in dialogue.";
  } else {
    elementNarrative = "A blend of elemental forces creates dynamic tension—growth often lives in the friction between different energies.";
  }

  return elementNarrative;
}
