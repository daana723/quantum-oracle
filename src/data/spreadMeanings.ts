import type { TarotCard } from "@/data/tarotCards";

export type SpreadType = "single" | "past-present-future" | "cross" | "celtic-cross";

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
  cross: [
    { label: "Situation", sublabel: "The heart of the matter", icon: "◈" },
    { label: "Challenge", sublabel: "What crosses you", icon: "✦" },
    { label: "Foundation", sublabel: "What lies beneath", icon: "▽" },
    { label: "Recent Past", sublabel: "What is passing away", icon: "◁" },
    { label: "Potential", sublabel: "What could manifest", icon: "△" },
  ],
  "celtic-cross": [
    { label: "Present", sublabel: "Where you stand now", icon: "◈" },
    { label: "Challenge", sublabel: "What crosses you", icon: "✦" },
    { label: "Foundation", sublabel: "Root of the matter", icon: "▽" },
    { label: "Recent Past", sublabel: "What is fading", icon: "◁" },
    { label: "Crown", sublabel: "Best possible outcome", icon: "♛" },
    { label: "Near Future", sublabel: "What approaches", icon: "▷" },
    { label: "Self", sublabel: "How you see yourself", icon: "◉" },
    { label: "Environment", sublabel: "External influences", icon: "❋" },
    { label: "Hopes & Fears", sublabel: "Inner desires and anxieties", icon: "☽" },
    { label: "Outcome", sublabel: "Where this leads", icon: "★" },
  ],
};

export function getCardCount(spreadType: SpreadType): number {
  if (spreadType === "single") return 1;
  return spreadPositions[spreadType]?.length ?? 1;
}

/** Generate a relational meaning between two cards in adjacent positions */
export function getRelationalMeaning(
  fromCard: TarotCard,
  fromPosition: string,
  toCard: TarotCard,
  toPosition: string
): string {
  const elementRelation = getElementInteraction(fromCard.element, toCard.element);
  const sharedThemes = fromCard.themes.filter((t) => toCard.themes.includes(t));
  const thematicThread = sharedThemes.length > 0
    ? getThematicBridge(sharedThemes[0], fromPosition, toPosition)
    : getContrastBridge(fromCard, toCard, fromPosition, toPosition);

  return `${elementRelation} ${thematicThread}`;
}

/** Get key relational pairs for a spread type */
export function getSpreadRelations(spreadType: SpreadType): [number, number][] {
  switch (spreadType) {
    case "past-present-future":
      return [[0, 1], [1, 2]];
    case "cross":
      return [[0, 1], [2, 0], [3, 0], [0, 4]];
    case "celtic-cross":
      return [[0, 1], [2, 0], [3, 5], [6, 7], [8, 9]];
    default:
      return [];
  }
}

/** Get the "full arc" pair for a spread */
export function getSpreadArc(spreadType: SpreadType): [number, number] | null {
  switch (spreadType) {
    case "past-present-future":
      return [0, 2];
    case "cross":
      return [2, 4]; // Foundation → Potential
    case "celtic-cross":
      return [0, 9]; // Present → Outcome
    default:
      return null;
  }
}

function getElementInteraction(from: string, to: string): string {
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
      "Situation-Challenge": "Love is both the question and its complication—two sides of the same longing.",
      "Foundation-Situation": "Deep affection underlies the current moment, even if hidden.",
      "Recent Past-Situation": "A recent tenderness still colors how you approach this moment.",
      "Situation-Potential": "What you choose to love now shapes what love becomes.",
      "Present-Outcome": "The heart's present stirring echoes forward into final resolution.",
      "Self-Environment": "How you love yourself radiates into every relationship around you.",
      "Hopes & Fears-Outcome": "Your deepest longing and greatest fear of love converge at the threshold.",
    },
    career: {
      "Past-Present": "Professional foundations laid before now bear visible fruit—or reveal cracks.",
      "Present-Future": "Current ambitions chart the course; commitment today shapes tomorrow's harvest.",
      "Past-Future": "The arc of purpose bends from apprenticeship toward mastery.",
      "Situation-Challenge": "Ambition meets its test—what you build faces what would unmake it.",
      "Foundation-Situation": "Skills long developed now prove their worth at the surface.",
      "Situation-Potential": "The work you do today constructs the platform for tomorrow's leap.",
      "Present-Outcome": "Professional dedication now determines the shape of final achievement.",
    },
    change: {
      "Past-Present": "A transformation begun continues to unfold—you are still becoming.",
      "Present-Future": "The threshold you stand upon leads somewhere you cannot yet fully see.",
      "Past-Future": "Change bookends this spread—what was released makes space for what arrives.",
      "Situation-Challenge": "Transformation itself is the challenge—the chrysalis stage is uncomfortable.",
      "Foundation-Situation": "Deep shifts beneath the surface have pushed this moment into being.",
      "Situation-Potential": "The change you resist or embrace now determines what crystallizes ahead.",
      "Present-Outcome": "The metamorphosis underway now reaches its final form in the outcome.",
    },
    self: {
      "Past-Present": "Who you were informs who you are—but need not define who you become.",
      "Present-Future": "Self-knowledge gained now becomes the compass for what follows.",
      "Past-Future": "The self evolves through its own story, each chapter deepening the narrative.",
      "Situation-Challenge": "The core of your identity faces its own reflection—and must choose.",
      "Self-Environment": "Inner truth meets outer reality—alignment or friction reveals the gap.",
      "Hopes & Fears-Outcome": "What you hope to become and fear you cannot merge in the final position.",
      "Present-Outcome": "The self you cultivate now is the self that arrives at journey's end.",
    },
    shadow: {
      "Past-Present": "What was hidden then surfaces now, not as threat but as invitation.",
      "Present-Future": "The shadow acknowledged today loses its power to sabotage tomorrow.",
      "Past-Future": "From denial to integration—the shadow's journey mirrors your own growth.",
      "Situation-Challenge": "The shadow is the challenge—what you refuse to see is what obstructs.",
      "Foundation-Situation": "Buried material rises, demanding acknowledgment at the surface.",
      "Hopes & Fears-Outcome": "The shadow you fear may hold the key the outcome requires.",
    },
    clarity: {
      "Past-Present": "Understanding crystallizes as past confusion meets present awareness.",
      "Present-Future": "The clarity you hold now illuminates the path that opens ahead.",
      "Past-Future": "From fog to light—the mind's journey toward its own truth.",
      "Situation-Challenge": "Seeing clearly is itself the challenge—truth can be blinding.",
      "Foundation-Situation": "Deep understanding supports the current moment of recognition.",
      "Crown-Near Future": "The highest clarity descends into approaching reality.",
      "Present-Outcome": "Present insight builds the bridge to final understanding.",
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
    "Situation-Challenge": `${fromCard.name} defines the moment; ${toCard.name} complicates it—creative tension emerges.`,
    "Foundation-Situation": `${fromCard.name} deep below supports ${toCard.name} at the surface—roots and branches of the same tree.`,
    "Recent Past-Situation": `${fromCard.name}'s fading influence yields to ${toCard.name}'s present reality.`,
    "Situation-Potential": `From ${fromCard.name}'s current truth, ${toCard.name}'s possibility emerges on the horizon.`,
    "Foundation-Potential": `The arc from ${fromCard.name} to ${toCard.name} traces growth from root to crown.`,
    "Present-Outcome": `${fromCard.name}'s present energy transforms through the reading into ${toCard.name}'s final resolution.`,
    "Self-Environment": `${fromCard.name} within meets ${toCard.name} without—inner and outer worlds in dialogue.`,
    "Hopes & Fears-Outcome": `The tension between ${fromCard.name}'s longing and ${toCard.name}'s reality resolves in the final card.`,
    "Recent Past-Near Future": `${fromCard.name} recedes as ${toCard.name} approaches—the tide turns.`,
  };

  const posKey = `${fromPos}-${toPos}`;
  return contrasts[posKey] || `${fromCard.name} and ${toCard.name} speak to each other across positions, creating meaning in their dialogue.`;
}

/** Generate a synthesis reading for the whole spread */
export function getSpreadSynthesis(cards: TarotCard[]): string {
  if (cards.length < 3) return "";

  const elements = cards.map((c) => c.element);
  const uniqueElements = [...new Set(elements)];

  // Count elements
  const elementCounts: Record<string, number> = {};
  elements.forEach((el) => {
    elementCounts[el] = (elementCounts[el] || 0) + 1;
  });
  const dominant = Object.entries(elementCounts).sort((a, b) => b[1] - a[1])[0];

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
  } else if (cards.length >= 5 && dominant[1] >= 3) {
    const dominantDescriptions: Record<string, string> = {
      fire: `Fire dominates with ${dominant[1]} cards—will and passion drive this reading, tempered by`,
      water: `Water flows through ${dominant[1]} positions—emotion and intuition lead, balanced by`,
      air: `Air circulates in ${dominant[1]} cards—thought and communication prevail, grounded by`,
      earth: `Earth anchors ${dominant[1]} positions—practicality and endurance set the tone, stirred by`,
      spirit: `Spirit illuminates ${dominant[1]} cards—transcendence calls strongly, manifested through`,
    };
    const others = uniqueElements.filter((e) => e !== dominant[0]).join(" and ");
    elementNarrative = `${dominantDescriptions[dominant[0]] || "A dominant force shapes this reading, balanced by"} ${others} energies.`;
  } else if (uniqueElements.length === elements.length) {
    elementNarrative = `${uniqueElements.length} elements converge—complexity and richness define this moment. Multiple dimensions of your life are in dialogue.`;
  } else {
    elementNarrative = "A blend of elemental forces creates dynamic tension—growth often lives in the friction between different energies.";
  }

  return elementNarrative;
}
