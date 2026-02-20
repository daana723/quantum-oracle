// Advanced Moon Phase Engine — fully client-side, no API keys
// Provides precise lunar calculations, zodiac position, illumination, and next-phase countdown

export interface MoonData {
  phase: string;
  icon: string;
  illumination: number; // 0-100%
  age: number; // days into cycle
  zodiacSign: string;
  zodiacSymbol: string;
  nextPhase: { name: string; daysUntil: number };
  isVoidOfCourse: boolean;
  lunarDay: number;
  risingOrSetting: "waxing" | "waning";
  poeticDescription: string;
}

const LUNAR_CYCLE = 29.53059; // synodic month in days
const KNOWN_NEW_MOON = new Date(2000, 0, 6, 18, 14).getTime(); // Jan 6, 2000

// Zodiac signs the moon transits (~2.5 days each)
const ZODIAC_SIGNS = [
  { name: "Aries", symbol: "♈", element: "fire" },
  { name: "Taurus", symbol: "♉", element: "earth" },
  { name: "Gemini", symbol: "♊", element: "air" },
  { name: "Cancer", symbol: "♋", element: "water" },
  { name: "Leo", symbol: "♌", element: "fire" },
  { name: "Virgo", symbol: "♍", element: "earth" },
  { name: "Libra", symbol: "♎", element: "air" },
  { name: "Scorpio", symbol: "♏", element: "water" },
  { name: "Sagittarius", symbol: "♐", element: "fire" },
  { name: "Capricorn", symbol: "♑", element: "earth" },
  { name: "Aquarius", symbol: "♒", element: "air" },
  { name: "Pisces", symbol: "♓", element: "water" },
] as const;

// Approximate moon longitude calculation (simplified, no API needed)
function getMoonLongitude(date: Date): number {
  // Julian date calculation
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate() + date.getHours() / 24;

  // Simplified lunar longitude using mean anomaly
  const T = ((julianDate(y, m, d) - 2451545.0) / 36525); // centuries from J2000
  
  // Mean longitude of the Moon
  const L = (218.3165 + 481267.8813 * T) % 360;
  // Mean anomaly of the Moon
  const M = (134.9634 + 477198.8676 * T) % 360;
  // Mean anomaly of the Sun
  const Ms = (357.5291 + 35999.0503 * T) % 360;
  // Moon's argument of latitude
  const F = (93.2720 + 483202.0175 * T) % 360;

  const Mrad = M * Math.PI / 180;
  const Msrad = Ms * Math.PI / 180;
  const Frad = F * Math.PI / 180;

  // Main perturbation terms
  let longitude = L
    + 6.289 * Math.sin(Mrad)
    - 1.274 * Math.sin(2 * (L * Math.PI / 180) - Mrad)
    + 0.658 * Math.sin(2 * (L * Math.PI / 180))
    - 0.214 * Math.sin(2 * Mrad)
    - 0.186 * Math.sin(Msrad);

  longitude = ((longitude % 360) + 360) % 360;
  return longitude;
}

function julianDate(y: number, m: number, d: number): number {
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}

function getMoonAge(date: Date): number {
  const daysSince = (date.getTime() - KNOWN_NEW_MOON) / (1000 * 60 * 60 * 24);
  return ((daysSince % LUNAR_CYCLE) + LUNAR_CYCLE) % LUNAR_CYCLE;
}

function getPhaseFromAge(age: number): { phase: string; icon: string } {
  const phases: { max: number; phase: string; icon: string }[] = [
    { max: 1.85, phase: "New Moon", icon: "🌑" },
    { max: 5.54, phase: "Waxing Crescent", icon: "🌒" },
    { max: 9.23, phase: "First Quarter", icon: "🌓" },
    { max: 12.92, phase: "Waxing Gibbous", icon: "🌔" },
    { max: 16.61, phase: "Full Moon", icon: "🌕" },
    { max: 20.30, phase: "Waning Gibbous", icon: "🌖" },
    { max: 23.99, phase: "Last Quarter", icon: "🌗" },
    { max: 27.68, phase: "Waning Crescent", icon: "🌘" },
    { max: LUNAR_CYCLE, phase: "New Moon", icon: "🌑" },
  ];
  return phases.find(p => age < p.max) || phases[0];
}

function getIllumination(age: number): number {
  // Illumination follows a cosine curve
  return Math.round((1 - Math.cos(2 * Math.PI * age / LUNAR_CYCLE)) / 2 * 100);
}

function getNextPhase(age: number): { name: string; daysUntil: number } {
  const phaseStarts = [
    { at: 0, name: "New Moon" },
    { at: 7.38, name: "First Quarter" },
    { at: 14.77, name: "Full Moon" },
    { at: 22.15, name: "Last Quarter" },
    { at: LUNAR_CYCLE, name: "New Moon" },
  ];

  for (const p of phaseStarts) {
    if (age < p.at) {
      return { name: p.name, daysUntil: Math.round((p.at - age) * 10) / 10 };
    }
  }
  return { name: "New Moon", daysUntil: Math.round((LUNAR_CYCLE - age) * 10) / 10 };
}

function getZodiacSign(longitude: number) {
  const index = Math.floor(longitude / 30) % 12;
  return ZODIAC_SIGNS[index];
}

// Poetic descriptions that tie the moon phase to quantum/metaphysical context
function getPoeticDescription(phase: string, zodiac: string, illumination: number): string {
  const phasePoetry: Record<string, string[]> = {
    "New Moon": [
      "In the quantum void between endings and beginnings, potentiality coalesces unseen",
      "The dark mirror reflects nothing—yet contains everything in superposition",
    ],
    "Waxing Crescent": [
      "A sliver of intention emerges from the void, collapsing probability into purpose",
      "The first photons of manifestation illuminate the edge of what becomes",
    ],
    "First Quarter": [
      "Half-light, half-shadow—the wave function stands at the threshold of decision",
      "Momentum crystallizes; the observer effect turns intention into motion",
    ],
    "Waxing Gibbous": [
      "Nearly full, the pattern approaches completion—fine adjustments ripple outward",
      "Quantum coherence builds as scattered possibilities align toward illumination",
    ],
    "Full Moon": [
      "Total illumination—all hidden variables become visible to the conscious observer",
      "The wave function collapses into brilliant clarity; what was uncertain becomes known",
    ],
    "Waning Gibbous": [
      "Wisdom distilled from fullness—the observer integrates what was revealed",
      "Light begins its return to source, carrying understanding through the ether",
    ],
    "Last Quarter": [
      "Half the light remains—enough to release what no longer resonates with your frequency",
      "The quantum field reshuffles, making space for new configurations of meaning",
    ],
    "Waning Crescent": [
      "Almost void, the balsamic moon whispers of surrender and coming renewal",
      "Consciousness retreats inward, preparing the dark soil for seeds yet unimagined",
    ],
  };

  const options = phasePoetry[phase] || phasePoetry["New Moon"];
  // Use illumination as a stable selector
  return options[illumination % options.length];
}

export function getMoonData(date: Date = new Date()): MoonData {
  const age = getMoonAge(date);
  const { phase, icon } = getPhaseFromAge(age);
  const illumination = getIllumination(age);
  const longitude = getMoonLongitude(date);
  const zodiac = getZodiacSign(longitude);
  const nextPhase = getNextPhase(age);
  const risingOrSetting = age < LUNAR_CYCLE / 2 ? "waxing" : "waning";

  // Simplified void-of-course: last ~6 hours before sign change
  const degreeInSign = longitude % 30;
  const isVoidOfCourse = degreeInSign > 28;

  return {
    phase,
    icon,
    illumination,
    age: Math.round(age * 10) / 10,
    zodiacSign: zodiac.name,
    zodiacSymbol: zodiac.symbol,
    nextPhase,
    isVoidOfCourse,
    lunarDay: Math.ceil(age),
    risingOrSetting,
    poeticDescription: getPoeticDescription(phase, zodiac.name, illumination),
  };
}

// Get zodiac element for integration with card readings
export function getMoonElement(date: Date = new Date()): string {
  const longitude = getMoonLongitude(date);
  const zodiac = getZodiacSign(longitude);
  return zodiac.element;
}

export { ZODIAC_SIGNS };
