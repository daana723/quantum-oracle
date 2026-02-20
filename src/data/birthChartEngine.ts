// Birth Chart Calculator — fully client-side, no API keys
// Uses improved astronomical formulas for Sun and Moon longitude
// Rising sign remains an approximation without precise geographic coordinates

export interface BirthChartData {
  sunSign: ZodiacPosition;
  moonSign: ZodiacPosition;
  risingSign: ZodiacPosition;
  dominantElement: string;
  elementBalance: Record<string, number>;
  personalCards: number[]; // Major Arcana IDs that resonate
  description: string;
}

export interface ZodiacPosition {
  sign: string;
  symbol: string;
  element: 'fire' | 'water' | 'air' | 'earth';
  degree: number;
  description: string;
}

const ZODIAC = [
  { sign: "Aries", symbol: "♈", element: "fire" as const, startDeg: 0, ruler: "Mars" },
  { sign: "Taurus", symbol: "♉", element: "earth" as const, startDeg: 30, ruler: "Venus" },
  { sign: "Gemini", symbol: "♊", element: "air" as const, startDeg: 60, ruler: "Mercury" },
  { sign: "Cancer", symbol: "♋", element: "water" as const, startDeg: 90, ruler: "Moon" },
  { sign: "Leo", symbol: "♌", element: "fire" as const, startDeg: 120, ruler: "Sun" },
  { sign: "Virgo", symbol: "♍", element: "earth" as const, startDeg: 150, ruler: "Mercury" },
  { sign: "Libra", symbol: "♎", element: "air" as const, startDeg: 180, ruler: "Venus" },
  { sign: "Scorpio", symbol: "♏", element: "water" as const, startDeg: 210, ruler: "Pluto" },
  { sign: "Sagittarius", symbol: "♐", element: "fire" as const, startDeg: 240, ruler: "Jupiter" },
  { sign: "Capricorn", symbol: "♑", element: "earth" as const, startDeg: 270, ruler: "Saturn" },
  { sign: "Aquarius", symbol: "♒", element: "air" as const, startDeg: 300, ruler: "Uranus" },
  { sign: "Pisces", symbol: "♓", element: "water" as const, startDeg: 330, ruler: "Neptune" },
];

// Card associations by zodiac sign
const SIGN_CARDS: Record<string, number[]> = {
  Aries: [4, 16],      // Emperor, Tower
  Taurus: [5],          // Hierophant
  Gemini: [6],          // Lovers
  Cancer: [7],          // Chariot
  Leo: [8],             // Strength
  Virgo: [9],           // Hermit
  Libra: [11],          // Justice
  Scorpio: [13],        // Death
  Sagittarius: [14],    // Temperance
  Capricorn: [15],      // Devil
  Aquarius: [17],       // Star
  Pisces: [18],         // Moon
};

// --- Astronomical Math ---

function julianDate(y: number, m: number, d: number): number {
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}

/** Degrees to radians */
function rad(deg: number): number { return deg * Math.PI / 180; }

/** Normalize angle to 0-360 */
function norm360(deg: number): number { return ((deg % 360) + 360) % 360; }

/**
 * Compute ecliptic longitude of the Sun using VSOP87-derived truncation.
 * Accurate to ~0.01° for dates within ±200 years of J2000.
 */
function getSunLongitude(year: number, month: number, day: number, hour: number): number {
  const JD = julianDate(year, month, day + hour / 24);
  const T = (JD - 2451545.0) / 36525; // Julian centuries from J2000

  // Geometric mean longitude of Sun (degrees)
  const L0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  // Mean anomaly of Sun (degrees)
  const M = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mrad = rad(M);

  // Equation of center
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad)
          + (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad)
          + 0.000289 * Math.sin(3 * Mrad);

  // Sun's true longitude
  const sunTrueLong = L0 + C;

  // Apparent longitude (nutation + aberration correction)
  const omega = rad(125.04 - 1934.136 * T);
  const apparent = sunTrueLong - 0.00569 - 0.00478 * Math.sin(omega);

  return norm360(apparent);
}

/**
 * Compute ecliptic longitude of the Moon using simplified ELP/MPP02 terms.
 * Accurate to ~0.3° — sufficient for zodiac sign determination.
 */
function getMoonLongitude(year: number, month: number, day: number, hour: number): number {
  const JD = julianDate(year, month, day + hour / 24);
  const T = (JD - 2451545.0) / 36525;

  // Moon's mean longitude
  const Lp = norm360(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T);
  // Moon's mean elongation
  const D = norm360(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T);
  // Sun's mean anomaly
  const Ms = norm360(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T);
  // Moon's mean anomaly
  const Mm = norm360(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T);
  // Moon's argument of latitude
  const F = norm360(93.2720950 + 483202.0175233 * T - 0.0036539 * T * T);

  const Dr = rad(D), Mr = rad(Ms), Mmr = rad(Mm), Fr = rad(F);

  // Principal perturbation terms (longitude, in degrees)
  let longitude = Lp
    + 6.289 * Math.sin(Mmr)                        // Evection
    + 1.274 * Math.sin(2 * Dr - Mmr)               // Variation
    + 0.658 * Math.sin(2 * Dr)                     // Variation
    + 0.214 * Math.sin(2 * Mmr)                    // 
    - 0.186 * Math.sin(Mr)                         // Annual equation
    - 0.114 * Math.sin(2 * Fr)                     // Reduction to ecliptic
    + 0.059 * Math.sin(2 * Dr - 2 * Mmr)
    + 0.057 * Math.sin(2 * Dr - Mr - Mmr)
    + 0.053 * Math.sin(2 * Dr + Mmr)
    + 0.046 * Math.sin(2 * Dr - Mr)
    - 0.041 * Math.sin(Mr - Mmr)                   // Parallactic equation
    - 0.035 * Math.sin(Dr)                         // 
    - 0.030 * Math.sin(Mr + Mmr);

  return norm360(longitude);
}

/**
 * Rising sign approximation.
 * Without precise geographic coordinates this uses a simplified model:
 * At sunrise (~6am local), Ascendant ≈ Sun longitude.
 * Each hour rotates the Ascendant by ~15°.
 * Note: This is labeled as approximate in the UI.
 */
function getRisingLongitude(sunLong: number, birthHour: number): number {
  const hoursFromSunrise = birthHour - 6;
  return norm360(sunLong + hoursFromSunrise * 15);
}

// --- Sign Determination ---

function getSignFromLongitude(longitude: number): ZodiacPosition {
  const index = Math.floor(longitude / 30) % 12;
  const z = ZODIAC[index];
  const degree = Math.round((longitude % 30) * 10) / 10;

  return {
    sign: z.sign,
    symbol: z.symbol,
    element: z.element,
    degree,
    description: getSignDescription(z.sign),
  };
}

function getSignDescription(sign: string): string {
  const descriptions: Record<string, string> = {
    Aries: "The Initiator—pioneering spirit, courage, and raw creative fire",
    Taurus: "The Builder—sensual grounding, patience, and enduring value",
    Gemini: "The Communicator—dual-natured curiosity, wit, and intellectual agility",
    Cancer: "The Nurturer—emotional depth, protective intuition, and soul memory",
    Leo: "The Creator—radiant self-expression, generosity, and heart-centered power",
    Virgo: "The Analyst—sacred discernment, service, and refined perception",
    Libra: "The Harmonizer—relational grace, aesthetic sensibility, and balanced judgment",
    Scorpio: "The Transformer—penetrating insight, emotional intensity, and regenerative power",
    Sagittarius: "The Seeker—expansive vision, philosophical depth, and adventurous spirit",
    Capricorn: "The Master—disciplined ambition, structural wisdom, and earned authority",
    Aquarius: "The Visionary—innovative thinking, humanitarian ideals, and quantum awareness",
    Pisces: "The Mystic—boundless empathy, spiritual attunement, and transcendent imagination",
  };
  return descriptions[sign] || sign;
}

// --- Public API ---

/**
 * Parse a date string (YYYY-MM-DD) into local year/month/day
 * to avoid timezone-induced date shifts from Date constructor.
 */
function parseLocalDate(dateStr: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateStr.split("-").map(Number);
  return { year, month, day };
}

export function calculateBirthChart(
  birthDateStr: string,
  birthHour: number = 12
): BirthChartData {
  const { year, month, day } = parseLocalDate(birthDateStr);

  const sunLong = getSunLongitude(year, month, day, birthHour);
  const moonLong = getMoonLongitude(year, month, day, birthHour);
  const risingLong = getRisingLongitude(sunLong, birthHour);

  const sunSign = getSignFromLongitude(sunLong);
  const moonSign = getSignFromLongitude(moonLong);
  const risingSign = getSignFromLongitude(risingLong);

  // Element balance
  const elementBalance: Record<string, number> = { fire: 0, water: 0, air: 0, earth: 0 };
  elementBalance[sunSign.element] += 3;
  elementBalance[moonSign.element] += 2;
  elementBalance[risingSign.element] += 1;

  const dominantElement = Object.entries(elementBalance)
    .sort((a, b) => b[1] - a[1])[0][0];

  const personalCards = [
    ...(SIGN_CARDS[sunSign.sign] || []),
    ...(SIGN_CARDS[moonSign.sign] || []),
    ...(SIGN_CARDS[risingSign.sign] || []),
  ];
  const uniqueCards = [...new Set(personalCards)];

  const description = generateChartDescription(sunSign, moonSign, risingSign, dominantElement);

  return {
    sunSign,
    moonSign,
    risingSign,
    dominantElement,
    elementBalance,
    personalCards: uniqueCards,
    description,
  };
}

function generateChartDescription(
  sun: ZodiacPosition,
  moon: ZodiacPosition,
  rising: ZodiacPosition,
  dominantElement: string
): string {
  const elementDescriptions: Record<string, string> = {
    fire: "Your chart burns with elemental fire—action, vision, and creative force define your soul's architecture.",
    water: "Water flows through your chart—intuition, emotional depth, and psychic sensitivity are your native tongue.",
    air: "Air dominates your chart—the life of the mind, communication, and social connection are your natural domain.",
    earth: "Earth grounds your chart—practical wisdom, sensual presence, and patient building shape your path.",
  };

  if (sun.sign === moon.sign) {
    return `A powerful conjunction: both Sun and Moon in ${sun.sign} intensify your ${sun.element} nature. ${elementDescriptions[dominantElement]}`;
  }

  return `${sun.sign} Sun illuminates your conscious self while ${moon.sign} Moon colors your inner world. ${rising.sign} Rising shapes how the world first perceives you. ${elementDescriptions[dominantElement]}`;
}

// --- Persistence ---

const STORAGE_KEY = "vqv-birth-data";

export interface StoredBirthData {
  birthDate: string; // YYYY-MM-DD
  birthHour: number;
  chart: BirthChartData;
}

export function saveBirthData(birthDateStr: string, birthHour: number, chart: BirthChartData): void {
  const data: StoredBirthData = {
    birthDate: birthDateStr,
    birthHour,
    chart,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadBirthData(): StoredBirthData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function clearBirthData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
