// Elemental Season Engine — fully client-side
// Maps solstices, equinoxes, and zodiac seasons to dynamic energy shifts

export interface SeasonalEnergy {
  season: string;
  zodiacSeason: string;
  zodiacSymbol: string;
  element: 'fire' | 'water' | 'air' | 'earth';
  phase: 'cardinal' | 'fixed' | 'mutable';
  energyLevel: number; // 0-100
  description: string;
  readingSuggestion: string;
  cardWeightModifiers: Record<number, number>; // cardId -> weight multiplier
}

// Zodiac season boundaries (approximate day-of-year)
const ZODIAC_SEASONS = [
  { sign: "Capricorn", symbol: "♑", element: "earth" as const, phase: "cardinal" as const, startDay: 1, endDay: 19 },
  { sign: "Aquarius", symbol: "♒", element: "air" as const, phase: "fixed" as const, startDay: 20, endDay: 49 },
  { sign: "Pisces", symbol: "♓", element: "water" as const, phase: "mutable" as const, startDay: 50, endDay: 79 },
  { sign: "Aries", symbol: "♈", element: "fire" as const, phase: "cardinal" as const, startDay: 80, endDay: 110 },
  { sign: "Taurus", symbol: "♉", element: "earth" as const, phase: "fixed" as const, startDay: 111, endDay: 141 },
  { sign: "Gemini", symbol: "♊", element: "air" as const, phase: "mutable" as const, startDay: 142, endDay: 172 },
  { sign: "Cancer", symbol: "♋", element: "water" as const, phase: "cardinal" as const, startDay: 173, endDay: 203 },
  { sign: "Leo", symbol: "♌", element: "fire" as const, phase: "fixed" as const, startDay: 204, endDay: 234 },
  { sign: "Virgo", symbol: "♍", element: "earth" as const, phase: "mutable" as const, startDay: 235, endDay: 265 },
  { sign: "Libra", symbol: "♎", element: "air" as const, phase: "cardinal" as const, startDay: 266, endDay: 296 },
  { sign: "Scorpio", symbol: "♏", element: "water" as const, phase: "fixed" as const, startDay: 297, endDay: 326 },
  { sign: "Sagittarius", symbol: "♐", element: "fire" as const, phase: "mutable" as const, startDay: 327, endDay: 356 },
  { sign: "Capricorn", symbol: "♑", element: "earth" as const, phase: "cardinal" as const, startDay: 357, endDay: 366 },
];

// Card weight modifiers by zodiac season (which cards are amplified)
const SEASON_CARD_WEIGHTS: Record<string, Record<number, number>> = {
  Aries: { 4: 2, 16: 1.5, 0: 1.5 },       // Emperor, Tower, Fool
  Taurus: { 5: 2, 3: 1.5 },                 // Hierophant, Empress
  Gemini: { 6: 2, 1: 1.5 },                 // Lovers, Magician
  Cancer: { 7: 2, 2: 1.5, 18: 1.5 },        // Chariot, High Priestess, Moon
  Leo: { 8: 2, 19: 1.5 },                   // Strength, Sun
  Virgo: { 9: 2, 11: 1.3 },                 // Hermit, Justice
  Libra: { 11: 2, 6: 1.5 },                 // Justice, Lovers
  Scorpio: { 13: 2, 15: 1.5, 20: 1.3 },     // Death, Devil, Judgement
  Sagittarius: { 14: 2, 10: 1.5 },          // Temperance, Wheel
  Capricorn: { 15: 2, 21: 1.5 },            // Devil, World
  Aquarius: { 17: 2, 0: 1.5 },              // Star, Fool
  Pisces: { 18: 2, 12: 1.5, 2: 1.3 },       // Moon, Hanged Man, High Priestess
};

function getCalendarSeason(dayOfYear: number): string {
  if (dayOfYear >= 80 && dayOfYear < 173) return "Spring";
  if (dayOfYear >= 173 && dayOfYear < 266) return "Summer";
  if (dayOfYear >= 266 && dayOfYear < 357) return "Autumn";
  return "Winter";
}

function getEnergyLevel(phase: string, dayOfYear: number): number {
  // Cardinal = high initiation energy, Fixed = steady sustaining, Mutable = transitional
  const baseEnergy = phase === "cardinal" ? 85 : phase === "fixed" ? 65 : 50;
  // Add slight variation based on day
  const variation = Math.sin((dayOfYear / 365) * Math.PI * 2) * 15;
  return Math.round(Math.min(100, Math.max(10, baseEnergy + variation)));
}

function getSeasonDescription(sign: string, season: string, phase: string): string {
  const descriptions: Record<string, string> = {
    Aries: "Spring ignites—cardinal fire blazes with the energy of new beginnings. Initiative and courage amplify all readings.",
    Taurus: "Fixed earth deepens spring's roots—patience, sensuality, and material concerns gain weight in the cards.",
    Gemini: "Mutable air scatters spring's seeds—curiosity, duality, and rapid mental shifts color interpretations.",
    Cancer: "Summer arrives through cardinal water—emotional depths open, nurturing and protection themes intensify.",
    Leo: "Fixed fire radiates summer's peak—creative self-expression, pride, and heart-centered power illuminate readings.",
    Virgo: "Mutable earth refines the harvest—analysis, service, and sacred discrimination sharpen card meanings.",
    Libra: "Autumn begins in cardinal air—balance, relationship dynamics, and aesthetic judgment shape the reading field.",
    Scorpio: "Fixed water plunges into autumn's depths—transformation, shadow work, and regenerative power deepen all cards.",
    Sagittarius: "Mutable fire carries autumn into expansion—philosophical seeking, adventure, and higher meaning prevail.",
    Capricorn: "Winter crystallizes in cardinal earth—ambition, structure, and earned mastery anchor every reading.",
    Aquarius: "Fixed air electrifies midwinter—innovation, collective consciousness, and sudden insight break through.",
    Pisces: "Mutable water dissolves winter's edges—mystical attunement, compassion, and transcendence infuse the cards.",
  };
  return descriptions[sign] || `${sign} season influences your readings with ${phase} energy.`;
}

function getReadingSuggestion(element: string, phase: string): string {
  const suggestions: Record<string, Record<string, string>> = {
    fire: {
      cardinal: "Draw cards about initiation and action—ask 'What should I begin?'",
      fixed: "Ask about sustaining passion and creative direction—'Where does my fire burn brightest?'",
      mutable: "Explore transformation and release—'What fire needs tending, and what needs releasing?'",
    },
    earth: {
      cardinal: "Focus on foundations and ambitions—'What am I building?'",
      fixed: "Ask about values and stability—'What truly sustains me?'",
      mutable: "Explore refinement and service—'How can I be of greater use?'",
    },
    air: {
      cardinal: "Draw for relationships and balance—'Where do I seek harmony?'",
      fixed: "Ask about vision and innovation—'What pattern am I ready to break?'",
      mutable: "Explore communication and learning—'What do I need to understand?'",
    },
    water: {
      cardinal: "Focus on emotional beginnings—'What feelings are surfacing?'",
      fixed: "Ask about transformation and depth—'What must I release to transform?'",
      mutable: "Explore intuition and surrender—'What does my deepest self know?'",
    },
  };
  return suggestions[element]?.[phase] || "Draw with openness to whatever the season reveals.";
}

export function getCurrentSeasonalEnergy(date: Date = new Date()): SeasonalEnergy {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );

  const zodiacSeason = ZODIAC_SEASONS.find(
    (z) => dayOfYear >= z.startDay && dayOfYear <= z.endDay
  ) || ZODIAC_SEASONS[0];

  const calendarSeason = getCalendarSeason(dayOfYear);
  const energyLevel = getEnergyLevel(zodiacSeason.phase, dayOfYear);

  return {
    season: calendarSeason,
    zodiacSeason: zodiacSeason.sign,
    zodiacSymbol: zodiacSeason.symbol,
    element: zodiacSeason.element,
    phase: zodiacSeason.phase,
    energyLevel,
    description: getSeasonDescription(zodiacSeason.sign, calendarSeason, zodiacSeason.phase),
    readingSuggestion: getReadingSuggestion(zodiacSeason.element, zodiacSeason.phase),
    cardWeightModifiers: SEASON_CARD_WEIGHTS[zodiacSeason.sign] || {},
  };
}

export function getElementalForecast(date: Date = new Date()): {
  current: SeasonalEnergy;
  next: { sign: string; symbol: string; element: string; daysUntil: number };
} {
  const current = getCurrentSeasonalEnergy(date);
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );

  // Find next season
  const nextSeason = ZODIAC_SEASONS.find((z) => z.startDay > dayOfYear) || ZODIAC_SEASONS[0];
  const daysUntil = nextSeason.startDay > dayOfYear
    ? nextSeason.startDay - dayOfYear
    : 365 - dayOfYear + nextSeason.startDay;

  return {
    current,
    next: {
      sign: nextSeason.sign,
      symbol: nextSeason.symbol,
      element: nextSeason.element,
      daysUntil,
    },
  };
}
