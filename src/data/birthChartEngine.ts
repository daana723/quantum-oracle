// Birth Chart Calculator — fully client-side, no API keys
// Computes Sun sign, Moon sign, and approximate Rising sign from birth data

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

function julianDate(y: number, m: number, d: number): number {
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}

function getSunLongitude(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate() + date.getHours() / 24;
  const T = (julianDate(y, m, d) - 2451545.0) / 36525;

  // Mean longitude
  const L0 = (280.46646 + 36000.76983 * T) % 360;
  // Mean anomaly
  const M = ((357.52911 + 35999.05029 * T) % 360) * Math.PI / 180;
  // Equation of center
  const C = (1.9146 - 0.004817 * T) * Math.sin(M) + 0.019993 * Math.sin(2 * M);

  return ((L0 + C) % 360 + 360) % 360;
}

function getMoonLongitudeForBirth(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate() + date.getHours() / 24;
  const T = (julianDate(y, m, d) - 2451545.0) / 36525;

  const L = (218.3165 + 481267.8813 * T) % 360;
  const M = (134.9634 + 477198.8676 * T) % 360;
  const Ms = (357.5291 + 35999.0503 * T) % 360;
  const Mrad = M * Math.PI / 180;
  const Msrad = Ms * Math.PI / 180;

  let longitude = L
    + 6.289 * Math.sin(Mrad)
    - 1.274 * Math.sin(2 * (L * Math.PI / 180) - Mrad)
    + 0.658 * Math.sin(2 * (L * Math.PI / 180))
    - 0.214 * Math.sin(2 * Mrad)
    - 0.186 * Math.sin(Msrad);

  return ((longitude % 360) + 360) % 360;
}

function getRisingSignLongitude(date: Date, birthHour: number): number {
  // Simplified: the Ascendant rotates ~1 degree every 4 minutes
  // At sunrise (6am approx), the Ascendant ≈ Sun longitude
  // Each hour after sunrise adds ~15 degrees
  const sunLong = getSunLongitude(date);
  const hoursFromSunrise = birthHour - 6;
  return ((sunLong + hoursFromSunrise * 15) % 360 + 360) % 360;
}

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

export function calculateBirthChart(
  birthDate: Date,
  birthHour: number = 12 // 0-23, default noon
): BirthChartData {
  const sunLong = getSunLongitude(birthDate);
  const moonLong = getMoonLongitudeForBirth(birthDate);
  const risingLong = getRisingSignLongitude(birthDate, birthHour);

  const sunSign = getSignFromLongitude(sunLong);
  const moonSign = getSignFromLongitude(moonLong);
  const risingSign = getSignFromLongitude(risingLong);

  // Element balance
  const elementBalance: Record<string, number> = { fire: 0, water: 0, air: 0, earth: 0 };
  elementBalance[sunSign.element] += 3;  // Sun weighted highest
  elementBalance[moonSign.element] += 2; // Moon next
  elementBalance[risingSign.element] += 1; // Rising last

  const dominantElement = Object.entries(elementBalance)
    .sort((a, b) => b[1] - a[1])[0][0];

  // Collect personal cards
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

// Persistence
const STORAGE_KEY = "vqv-birth-data";

export interface StoredBirthData {
  birthDate: string; // ISO
  birthHour: number;
  chart: BirthChartData;
}

export function saveBirthData(birthDate: Date, birthHour: number, chart: BirthChartData): void {
  const data: StoredBirthData = {
    birthDate: birthDate.toISOString(),
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
