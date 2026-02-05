export interface TarotCard {
  id: number;
  name: string;
  keywords: string[];
  meaning: string;
  reversedMeaning: string;
  symbolism: string;
  themes: string[];
  planetaryRuler: string;
  element: 'fire' | 'water' | 'air' | 'earth' | 'spirit';
  zodiacAssociation?: string;
}

export const majorArcana: TarotCard[] = [
  {
    id: 0,
    name: "The Fool",
    keywords: ["beginnings", "innocence", "spontaneity", "free spirit"],
    meaning: "A threshold beckons, veiled in morning mist. The path you sense is unmarked, yet something within recognizes it as your own. Trust precedes certainty here—the first step creates the bridge.",
    reversedMeaning: "Hesitation guards the gate. Perhaps the timing feels uncertain, or the unknown looms too large. Consider: is caution wisdom, or fear wearing wisdom's mask?",
    symbolism: "The precipice, the white rose, the small companion—each speaks of innocence that is not naiveté, but rather the courage to begin without knowing the end.",
    themes: ["change", "self", "clarity"],
    planetaryRuler: "Uranus",
    element: "air",
  },
  {
    id: 1,
    name: "The Magician",
    keywords: ["manifestation", "resourcefulness", "power", "inspired action"],
    meaning: "All elements align upon your table. The question is not whether you possess the tools, but whether you recognize them as yours. Channel above to below—your will shapes reality's clay.",
    reversedMeaning: "Power scattered or misdirected. The tools remain, but perhaps the vision has clouded. Realign intention with action; the magic awaits your focused return.",
    symbolism: "One hand raised to heaven, one pointing to earth—the eternal conduit between possibility and manifestation, thought and form.",
    themes: ["career", "self", "clarity"],
    planetaryRuler: "Mercury",
    element: "air",
  },
  {
    id: 2,
    name: "The High Priestess",
    keywords: ["intuition", "sacred knowledge", "divine feminine", "mystery"],
    meaning: "Behind the veil, truths shimmer that logic cannot grasp. Your inner knowing whispers; the question is whether you create silence enough to hear. Not all wisdom announces itself.",
    reversedMeaning: "The inner voice speaks, but interference clouds reception. External noise, perhaps, or the fear of what silence might reveal. Return to the temple within.",
    symbolism: "She sits between pillars of duality, holding scrolls of hidden law. The moon at her feet speaks of cycles and the wisdom that dwells in darkness.",
    themes: ["love", "self", "shadow"],
    planetaryRuler: "Moon",
    element: "water",
  },
  {
    id: 3,
    name: "The Empress",
    keywords: ["abundance", "nature", "nurturing", "sensuality"],
    meaning: "The garden flourishes where attention flows. Creation energy surrounds you—whether birthing projects, relationships, or aspects of self long neglected. Receive as freely as you give.",
    reversedMeaning: "The well needs replenishing. Have you been pouring forth without receiving? The mother who forgets herself cannot long sustain. Tend your own garden first.",
    symbolism: "Wheat fields and flowing waters, the pregnant pause before harvest. She embodies creation not as effort, but as natural unfolding.",
    themes: ["love", "self", "clarity"],
    planetaryRuler: "Venus",
    element: "earth",
  },
  {
    id: 4,
    name: "The Emperor",
    keywords: ["authority", "structure", "control", "fatherhood"],
    meaning: "Order emerges from chaos through will applied consistently. The foundation you build now determines what can be constructed upon it. Lead—beginning with yourself.",
    reversedMeaning: "Structure become prison, authority become tyranny—even over oneself. Examine: does your discipline serve growth, or has it become the obstacle it was meant to prevent?",
    symbolism: "The throne of stone, the ram's heads, the orb and scepter—symbols of dominion earned through mastery, not force.",
    themes: ["career", "self", "clarity"],
    planetaryRuler: "Mars",
    element: "fire",
    zodiacAssociation: "Aries",
  },
  {
    id: 5,
    name: "The Hierophant",
    keywords: ["tradition", "conformity", "morality", "ethics"],
    meaning: "Ancient wisdom offers paths well-worn by countless feet before yours. There is value in tradition, in teachings passed through generations. Yet discern: which traditions serve, and which merely bind?",
    reversedMeaning: "The old ways chafe against emerging truth. Perhaps you're called to find meaning beyond established structures, to become your own spiritual authority.",
    symbolism: "Keys crossed, acolytes kneeling, the triple crown—gateways to understanding that require both humility and questioning.",
    themes: ["self", "clarity", "shadow"],
    planetaryRuler: "Venus",
    element: "earth",
    zodiacAssociation: "Taurus",
  },
  {
    id: 6,
    name: "The Lovers",
    keywords: ["love", "harmony", "relationships", "values alignment"],
    meaning: "Two paths diverge, each beautiful, each demanding something different of you. This is not merely about another person, but about the values you choose to embody. Unity begins within.",
    reversedMeaning: "Disharmony surfaces—with others, or within yourself. Conflicting desires pull in opposite directions. Before choosing between, examine what each truly represents.",
    symbolism: "The angel blessing the union, the tree of knowledge, the mountain of aspiration—choice as sacred act, relationship as mirror.",
    themes: ["love", "self", "clarity"],
    planetaryRuler: "Mercury",
    element: "air",
    zodiacAssociation: "Gemini",
  },
  {
    id: 7,
    name: "The Chariot",
    keywords: ["control", "willpower", "success", "determination"],
    meaning: "Opposing forces can destroy—or propel. The sphinxes pull in different directions until unified by purpose. You have the reins; the question is whether you'll use them.",
    reversedMeaning: "The vehicle stalls or veers. Control slips when inner conflicts remain unresolved. Before demanding movement, ensure your own contradictions are harnessed.",
    symbolism: "Stars crown the charioteer; black and white sphinxes submit to will. Victory through integration, movement through mastery.",
    themes: ["career", "self", "change"],
    planetaryRuler: "Moon",
    element: "water",
    zodiacAssociation: "Cancer",
  },
  {
    id: 8,
    name: "Strength",
    keywords: ["courage", "patience", "compassion", "soft power"],
    meaning: "The lion does not yield to force, but to presence. True strength whispers rather than roars. What wild element within you awaits not conquest, but gentle recognition?",
    reversedMeaning: "Either force is applied where gentleness serves, or gentleness where force is needed. Strength misaligned. Recalibrate your approach to the challenge at hand.",
    symbolism: "The infinity crown, the open hands on the lion's jaws—power that comes from befriending rather than battling the beast.",
    themes: ["self", "shadow", "love"],
    planetaryRuler: "Sun",
    element: "fire",
    zodiacAssociation: "Leo",
  },
  {
    id: 9,
    name: "The Hermit",
    keywords: ["soul-searching", "introspection", "solitude", "inner guidance"],
    meaning: "The lamp illuminates only the next step, never the entire path. In chosen solitude, answers arise that crowds would drown. What do you discover when you stop seeking outside yourself?",
    reversedMeaning: "Isolation has become hiding rather than seeking. The hermitage serves contemplation, not escape. When is solitude wisdom, and when is it fear of connection?",
    symbolism: "The mountain peak, the lantern held aloft, the staff of wisdom—the journey inward as the essential pilgrimage.",
    themes: ["self", "shadow", "clarity"],
    planetaryRuler: "Mercury",
    element: "earth",
    zodiacAssociation: "Virgo",
  },
  {
    id: 10,
    name: "Wheel of Fortune",
    keywords: ["change", "cycles", "fate", "turning points"],
    meaning: "The wheel turns regardless of wish or will. Yet within each revolution lie seeds of the next. What rises shall descend; what falls shall rise. The question is where you place yourself on the wheel.",
    reversedMeaning: "Resistance to necessary change, or feeling caught in cycles that seem endless. Yet even reversed, the wheel moves. What pattern seeks breaking?",
    symbolism: "Sphinx atop, creatures ascending and descending, the eternal rotation—fortune as flow, change as the only constant.",
    themes: ["change", "career", "clarity"],
    planetaryRuler: "Jupiter",
    element: "fire",
  },
  {
    id: 11,
    name: "Justice",
    keywords: ["fairness", "truth", "cause and effect", "law"],
    meaning: "The scales balance not by force, but by truth's weight. Every action casts consequence forward in time. Clarity now regarding what you've set in motion, and what must be set right.",
    reversedMeaning: "Imbalance persists—within, without, or both. Justice delayed or denied. Yet the scales exist even when we prefer not to see them. What truth awaits acknowledgment?",
    symbolism: "The blindfold absent—this justice sees clearly. Sword raised, scales held level—discernment precedes action.",
    themes: ["clarity", "career", "shadow"],
    planetaryRuler: "Venus",
    element: "air",
    zodiacAssociation: "Libra",
  },
  {
    id: 12,
    name: "The Hanged Man",
    keywords: ["pause", "surrender", "new perspective", "sacrifice"],
    meaning: "Suspension offers what struggle cannot. The world inverts, and suddenly what seemed obstacle becomes passage. What might you see if you stopped fighting and simply... observed?",
    reversedMeaning: "Resistance to necessary surrender, or stalling without purpose. The pause has purpose; aimless waiting does not. Which are you experiencing?",
    symbolism: "The serene face, the halo of enlightenment, the bound foot—willing limitation as gateway to liberation.",
    themes: ["self", "change", "shadow"],
    planetaryRuler: "Neptune",
    element: "water",
  },
  {
    id: 13,
    name: "Death",
    keywords: ["endings", "change", "transformation", "transition"],
    meaning: "The old form must release for the new to emerge. This is not loss, but metamorphosis—the caterpillar's ending, the butterfly's beginning. What chapter closes to allow the next?",
    reversedMeaning: "Resistance to necessary ending prolongs what cannot be sustained. The transformation awaits your consent. What are you holding onto that has already left?",
    symbolism: "The pale horse, the fallen king, the rising sun—death not as termination, but as the essential turning in every cycle of growth.",
    themes: ["change", "shadow", "self"],
    planetaryRuler: "Pluto",
    element: "water",
    zodiacAssociation: "Scorpio",
  },
  {
    id: 14,
    name: "Temperance",
    keywords: ["balance", "moderation", "patience", "purpose"],
    meaning: "Between extremes lies the path of power. The angel pours between vessels without spilling—this is the art of synthesis, of holding opposites until they merge into something new.",
    reversedMeaning: "Excess in one direction or another disrupts the flow. The mixture requires precise proportions. Where has balance been neglected?",
    symbolism: "One foot in water, one on land; the sun of the path ahead; the iris of divine messaging—integration as spiritual practice.",
    themes: ["self", "love", "clarity"],
    planetaryRuler: "Jupiter",
    element: "fire",
    zodiacAssociation: "Sagittarius",
  },
  {
    id: 15,
    name: "The Devil",
    keywords: ["shadow self", "attachment", "addiction", "restriction"],
    meaning: "The chains rest loosely—look closely. Bondage here is chosen, perhaps unconsciously. What shadows do you feed that feed on you in return? Naming the pattern begins its dissolution.",
    reversedMeaning: "Liberation from old bindings, or deeper descent into their grip. The shadow confronted can become ally. Which movement is yours?",
    symbolism: "The inverted pentagram, the loose chains, the flame tails—materiality mistaken for reality, freedom forgotten but never lost.",
    themes: ["shadow", "love", "self"],
    planetaryRuler: "Saturn",
    element: "earth",
    zodiacAssociation: "Capricorn",
  },
  {
    id: 16,
    name: "The Tower",
    keywords: ["sudden change", "upheaval", "revelation", "awakening"],
    meaning: "Lightning strikes what was built on false foundation. The collapse is not punishment but liberation—structures that no longer serve must fall. What truth has been avoided that now demands acknowledgment?",
    reversedMeaning: "Destruction averted or prolonged. Perhaps the tower trembles but stands—for now. Sometimes we dismantle by choice what lightning would otherwise shatter.",
    symbolism: "The crown blown off, figures falling, flames from windows—not destruction but revelation, not ending but explosive beginning.",
    themes: ["change", "shadow", "clarity"],
    planetaryRuler: "Mars",
    element: "fire",
  },
  {
    id: 17,
    name: "The Star",
    keywords: ["hope", "faith", "renewal", "serenity"],
    meaning: "After storm, the stars emerge. Water pours forth to nourish both land and pool—giving that replenishes itself. Hope here is not wish, but quiet certainty that the cycle continues.",
    reversedMeaning: "Faith wavers; the stars seem distant. Yet they shine regardless of clouds. Perhaps the question is not whether hope is warranted, but whether you can access it.",
    symbolism: "The naked figure, the eight-pointed stars, the ibis of thought—vulnerability as strength, openness as wisdom.",
    themes: ["love", "self", "clarity"],
    planetaryRuler: "Uranus",
    element: "air",
    zodiacAssociation: "Aquarius",
  },
  {
    id: 18,
    name: "The Moon",
    keywords: ["illusion", "fear", "anxiety", "subconscious"],
    meaning: "Not all is as it appears in lunar light. The path winds between twin towers into unknown darkness. What fears prowl at the edges of consciousness? What do they guard—or guard against?",
    reversedMeaning: "Illusions dispersing, or fears confronted. The moon's deceptions lose power when named. What emerges as the mist clears?",
    symbolism: "The howling dogs, the emerging crayfish, the winding path—the journey through uncertainty, the subconscious rising.",
    themes: ["shadow", "self", "love"],
    planetaryRuler: "Neptune",
    element: "water",
    zodiacAssociation: "Pisces",
  },
  {
    id: 19,
    name: "The Sun",
    keywords: ["positivity", "success", "vitality", "joy"],
    meaning: "The child rides forth, arms open, facing radiance directly. Here is joy not as reward but as natural state reclaimed. What have you overcomplicated that simplicity could solve?",
    reversedMeaning: "The sun shines, but perhaps you stand in self-created shadow. Joy exists; the question is access. What blocks the light that's already present?",
    symbolism: "The white horse of purity, the sunflowers turning, the banner of triumph—innocence recovered, not naivety but wisdom's return to wonder.",
    themes: ["love", "self", "clarity"],
    planetaryRuler: "Sun",
    element: "fire",
  },
  {
    id: 20,
    name: "Judgement",
    keywords: ["reflection", "reckoning", "awakening", "renewal"],
    meaning: "The trumpet sounds—not in condemnation, but in calling. The dead rise not for punishment but for the opportunity to answer honestly. What calls you to rise? What must you finally see clearly?",
    reversedMeaning: "The call goes unheeded, or self-judgement replaces divine perspective. Condemnation is not the purpose here. What resurrection awaits your acceptance?",
    symbolism: "The angel's horn, the rising figures, the mountains of finality—not ending but accounting, not death but awakening.",
    themes: ["self", "shadow", "change"],
    planetaryRuler: "Pluto",
    element: "fire",
  },
  {
    id: 21,
    name: "The World",
    keywords: ["completion", "integration", "accomplishment", "travel"],
    meaning: "The dancer floats within the wreath of completion. A cycle ends; a greater one begins. You have arrived—not at ending, but at the threshold of new beginning that only completion enables.",
    reversedMeaning: "Completion delayed, or the fear of what finishing might mean. Perhaps loose ends remain. Or perhaps you hesitate at the threshold of the next great cycle.",
    symbolism: "The four fixed signs, the wands of mastery, the wreath of victory—integration of all elements, the self as cosmos.",
    themes: ["clarity", "self", "change"],
    planetaryRuler: "Saturn",
    element: "earth",
  },
];

// Theme to card mapping for weighted selection
export const themeCardWeights: Record<string, number[]> = {
  love: [2, 3, 6, 8, 14, 15, 17, 18, 19], // High Priestess, Empress, Lovers, Strength, Temperance, Devil, Star, Moon, Sun
  career: [1, 4, 7, 10, 11], // Magician, Emperor, Chariot, Wheel, Justice
  change: [0, 7, 10, 12, 13, 16, 21], // Fool, Chariot, Wheel, Hanged Man, Death, Tower, World
  self: [0, 1, 2, 3, 8, 9, 12, 14, 17, 19, 20, 21], // Fool, Magician, High Priestess, Empress, Strength, Hermit, Hanged Man, Temperance, Star, Sun, Judgement, World
  shadow: [5, 8, 9, 12, 13, 15, 16, 18, 20], // Hierophant, Strength, Hermit, Hanged Man, Death, Devil, Tower, Moon, Judgement
  clarity: [0, 1, 3, 4, 6, 9, 10, 11, 14, 17, 19, 21], // Fool, Magician, Empress, Emperor, Lovers, Hermit, Wheel, Justice, Temperance, Star, Sun, World
};

export type ThemeType = keyof typeof themeCardWeights;

export function selectCardWithIntent(
  intent: ThemeType | string | null,
  excludeIds: number[] = []
): TarotCard {
  const availableCards = majorArcana.filter((card) => !excludeIds.includes(card.id));
  
  if (!intent || !themeCardWeights[intent as ThemeType]) {
    // Pure random selection
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    return availableCards[randomIndex];
  }

  // Weighted selection based on theme
  const themeCards = themeCardWeights[intent as ThemeType];
  const weights = availableCards.map((card) => {
    if (themeCards.includes(card.id)) {
      return 3; // 3x more likely for theme-related cards
    }
    return 1;
  });

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < availableCards.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return availableCards[i];
    }
  }

  return availableCards[availableCards.length - 1];
}

export function selectEchoCards(
  primaryCard: TarotCard,
  intent: ThemeType | string | null,
  count: number = 2
): TarotCard[] {
  const echoes: TarotCard[] = [];
  const excludeIds = [primaryCard.id];

  for (let i = 0; i < count; i++) {
    const echo = selectCardWithIntent(intent, excludeIds);
    echoes.push(echo);
    excludeIds.push(echo.id);
  }

  return echoes;
}
