// Planetary Hours Engine — fully client-side, no API keys
// Calculates planetary hour rulership and retrograde approximations

export interface PlanetaryHour {
  planet: string;
  symbol: string;
  element: 'fire' | 'water' | 'air' | 'earth';
  startTime: Date;
  endTime: Date;
  isCurrentHour: boolean;
  description: string;
}

export interface RetrogradeStatus {
  planet: string;
  symbol: string;
  isRetrograde: boolean;
  description: string;
  effect: string;
}

// Chaldean order of planets (traditional planetary hours sequence)
const CHALDEAN_ORDER = [
  { planet: "Saturn", symbol: "♄", element: "earth" as const },
  { planet: "Jupiter", symbol: "♃", element: "fire" as const },
  { planet: "Mars", symbol: "♂", element: "fire" as const },
  { planet: "Sun", symbol: "☉", element: "fire" as const },
  { planet: "Venus", symbol: "♀", element: "earth" as const },
  { planet: "Mercury", symbol: "☿", element: "air" as const },
  { planet: "Moon", symbol: "☽", element: "water" as const },
];

// Day rulers (Sunday=0 through Saturday=6)
const DAY_RULERS = [3, 6, 2, 5, 1, 4, 0]; // Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn

// Approximate sunrise/sunset (simplified, latitude ~40°N)
function getApproxSunTimes(date: Date): { sunrise: Date; sunset: Date } {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );
  // Simple sinusoidal approximation for day length
  const dayLengthHours = 12 + 3 * Math.sin(((dayOfYear - 80) / 365) * 2 * Math.PI);
  const noon = new Date(date);
  noon.setHours(12, 0, 0, 0);

  const sunrise = new Date(noon.getTime() - (dayLengthHours / 2) * 3600000);
  const sunset = new Date(noon.getTime() + (dayLengthHours / 2) * 3600000);

  return { sunrise, sunset };
}

export function getPlanetaryHours(date: Date = new Date()): PlanetaryHour[] {
  const { sunrise, sunset } = getApproxSunTimes(date);
  const dayOfWeek = date.getDay();
  const rulerIndex = DAY_RULERS[dayOfWeek];

  // Day hours: sunrise to sunset divided into 12
  const dayDuration = sunset.getTime() - sunrise.getTime();
  const dayHourLength = dayDuration / 12;

  // Night hours: sunset to next sunrise divided into 12
  const nextSunrise = new Date(sunrise.getTime() + 86400000);
  const nightDuration = nextSunrise.getTime() - sunset.getTime();
  const nightHourLength = nightDuration / 12;

  const hours: PlanetaryHour[] = [];

  for (let i = 0; i < 24; i++) {
    const planetIndex = (rulerIndex + i) % 7;
    const planet = CHALDEAN_ORDER[planetIndex];
    const isDay = i < 12;

    const startTime = isDay
      ? new Date(sunrise.getTime() + i * dayHourLength)
      : new Date(sunset.getTime() + (i - 12) * nightHourLength);

    const endTime = isDay
      ? new Date(sunrise.getTime() + (i + 1) * dayHourLength)
      : new Date(sunset.getTime() + (i - 11) * nightHourLength);

    const isCurrentHour = date >= startTime && date < endTime;

    hours.push({
      ...planet,
      startTime,
      endTime,
      isCurrentHour,
      description: getPlanetaryHourDescription(planet.planet, isDay),
    });
  }

  return hours;
}

export function getCurrentPlanetaryHour(date: Date = new Date()): PlanetaryHour | null {
  const hours = getPlanetaryHours(date);
  return hours.find((h) => h.isCurrentHour) || null;
}

function getPlanetaryHourDescription(planet: string, isDay: boolean): string {
  const descriptions: Record<string, [string, string]> = {
    Sun: [
      "Solar radiance amplifies vitality, leadership, and creative expression",
      "Inner illumination—self-knowledge deepens in the sun's hidden hours",
    ],
    Moon: [
      "Lunar receptivity heightens intuition and emotional awareness",
      "The Moon's nocturnal reign deepens dreams and psychic sensitivity",
    ],
    Mars: [
      "Martial energy drives action—favorable for bold decisions and physical endeavors",
      "Hidden fire stirs—unconscious drives surface for examination",
    ],
    Mercury: [
      "Mercurial quicksilver accelerates thought, communication, and exchange",
      "The midnight messenger carries insights between conscious and unconscious",
    ],
    Jupiter: [
      "Jovian expansion blesses growth, learning, and generous endeavors",
      "Wisdom whispers through the dark—expanded understanding awaits stillness",
    ],
    Venus: [
      "Venusian grace enhances beauty, love, and harmonious connections",
      "The evening star illuminates desire and the aesthetics of the soul",
    ],
    Saturn: [
      "Saturnian discipline favors structure, boundaries, and long-term building",
      "The taskmaster of night demands honest reckoning with limitations",
    ],
  };
  const pair = descriptions[planet] || ["Planetary energies flow", "Planetary energies flow"];
  return isDay ? pair[0] : pair[1];
}

// ─── Retrograde Approximations ──────────────────────────────────────

// Simplified retrograde periods based on average synodic cycles
// These are approximations using mean orbital periods

interface RetroWindow {
  startDayOfYear: number;
  endDayOfYear: number;
}

function getRetrogradeWindows2025(planet: string): RetroWindow[] {
  // Approximate retrograde windows (can be extended for other years)
  const windows: Record<string, RetroWindow[]> = {
    Mercury: [
      { startDayOfYear: 74, endDayOfYear: 95 },   // ~Mar 15 – Apr 5
      { startDayOfYear: 198, endDayOfYear: 220 },  // ~Jul 17 – Aug 8
      { startDayOfYear: 310, endDayOfYear: 334 },  // ~Nov 6 – Nov 30
    ],
    Venus: [
      { startDayOfYear: 60, endDayOfYear: 102 },   // ~Mar 1 – Apr 12
    ],
    Mars: [
      { startDayOfYear: 1, endDayOfYear: 54 },     // ~Jan 1 – Feb 23
    ],
  };
  return windows[planet] || [];
}

// Generalized retrograde check using synodic cycle approximation
function isInRetrograde(planet: string, date: Date): boolean {
  const year = date.getFullYear();
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(year, 0, 0).getTime()) / 86400000
  );

  // For 2025 we have hardcoded windows; for other years, use cycle-based approximation
  if (year === 2025) {
    const windows = getRetrogradeWindows2025(planet);
    return windows.some((w) => dayOfYear >= w.startDayOfYear && dayOfYear <= w.endDayOfYear);
  }

  // Approximate using synodic periods
  const synodicPeriods: Record<string, { cycle: number; retroDays: number; epoch: number }> = {
    Mercury: { cycle: 115.88, retroDays: 21, epoch: 74 + 365 * 25 }, // days from 2000
    Venus: { cycle: 583.9, retroDays: 42, epoch: 60 + 365 * 25 },
    Mars: { cycle: 779.9, retroDays: 72, epoch: 1 + 365 * 25 },
  };

  const params = synodicPeriods[planet];
  if (!params) return false;

  const daysSince2000 = (date.getTime() - new Date(2000, 0, 1).getTime()) / 86400000;
  const positionInCycle = ((daysSince2000 - params.epoch) % params.cycle + params.cycle) % params.cycle;
  return positionInCycle < params.retroDays;
}

export function getRetrogradeStatuses(date: Date = new Date()): RetrogradeStatus[] {
  const planets = [
    { planet: "Mercury", symbol: "☿" },
    { planet: "Venus", symbol: "♀" },
    { planet: "Mars", symbol: "♂" },
  ];

  return planets.map(({ planet, symbol }) => {
    const retro = isInRetrograde(planet, date);
    return {
      planet,
      symbol,
      isRetrograde: retro,
      description: retro
        ? getRetrogradeDescription(planet)
        : `${planet} direct — its energies flow unimpeded`,
      effect: retro
        ? getRetrogradeEffect(planet)
        : "",
    };
  });
}

function getRetrogradeDescription(planet: string): string {
  const descs: Record<string, string> = {
    Mercury: "Mercury Retrograde ℞ — Communication, technology, and travel may require extra mindfulness",
    Venus: "Venus Retrograde ℞ — Values, relationships, and aesthetics undergo reassessment",
    Mars: "Mars Retrograde ℞ — Action and ambition turn inward; reflect before charging forward",
  };
  return descs[planet] || `${planet} is retrograde`;
}

function getRetrogradeEffect(planet: string): string {
  const effects: Record<string, string> = {
    Mercury: "Review, revise, reconnect. Readings involving communication, clarity, and The Magician carry extra weight.",
    Venus: "Revisit what you value. The Empress and Lovers readings gain depth during this transit.",
    Mars: "Redirect energy inward. The Chariot and Emperor readings may reveal where force meets futility.",
  };
  return effects[planet] || "";
}

export function getDayRuler(date: Date = new Date()): { planet: string; symbol: string; description: string } {
  const dayOfWeek = date.getDay();
  const rulerIndex = DAY_RULERS[dayOfWeek];
  const planet = CHALDEAN_ORDER[rulerIndex];

  const dayDescriptions: Record<string, string> = {
    Sun: "Sunday — Day of the Sun: vitality, joy, self-expression",
    Moon: "Monday — Day of the Moon: intuition, emotions, inner tides",
    Mars: "Tuesday — Day of Mars: courage, action, determination",
    Mercury: "Wednesday — Day of Mercury: communication, learning, wit",
    Jupiter: "Thursday — Day of Jupiter: expansion, wisdom, abundance",
    Venus: "Friday — Day of Venus: love, beauty, harmony",
    Saturn: "Saturday — Day of Saturn: discipline, mastery, reflection",
  };

  return {
    planet: planet.planet,
    symbol: planet.symbol,
    description: dayDescriptions[planet.planet] || "",
  };
}
