 // Cosmic Weather System - Quantum Astrology
 // Calculates moon phases and generates poetic cosmic context
 
 export interface CosmicWeather {
   moonPhase: string;
   moonPhaseDescription: string;
   moonPhaseIcon: string;
   dominantElement: 'fire' | 'water' | 'air' | 'earth';
   elementDescription: string;
   cosmicClimate: string;
   timingSuggestion: string;
 }
 
 // Moon phase calculation based on real lunar cycle
 function getMoonPhaseData(): { phase: string; icon: string; description: string } {
   const now = new Date();
   const year = now.getFullYear();
   const month = now.getMonth() + 1;
   const day = now.getDate();
 
   // Calculate days since known new moon (Jan 6, 2000)
   const knownNewMoon = new Date(2000, 0, 6, 18, 14);
   const daysSinceNewMoon = (now.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
   const lunarCycle = 29.53059;
   const moonAge = daysSinceNewMoon % lunarCycle;
 
   if (moonAge < 1.84566) {
     return { phase: "New Moon", icon: "🌑", description: "Seeds planted in darkness—intentions set now germinate unseen" };
   } else if (moonAge < 5.53699) {
     return { phase: "Waxing Crescent", icon: "🌒", description: "First light emerges—nurture what was begun with gentle attention" };
   } else if (moonAge < 9.22831) {
     return { phase: "First Quarter", icon: "🌓", description: "Momentum builds—decisions made now carry forward" };
   } else if (moonAge < 12.91963) {
     return { phase: "Waxing Gibbous", icon: "🌔", description: "Refinement before culmination—adjust and prepare for fullness" };
   } else if (moonAge < 16.61096) {
     return { phase: "Full Moon", icon: "🌕", description: "Illumination peaks—what was hidden becomes visible" };
   } else if (moonAge < 20.30228) {
     return { phase: "Waning Gibbous", icon: "🌖", description: "Gratitude and sharing—distribute what fullness brought" };
   } else if (moonAge < 23.99361) {
     return { phase: "Last Quarter", icon: "🌗", description: "Release what no longer serves—clear space for new beginnings" };
   } else if (moonAge < 27.68493) {
     return { phase: "Waning Crescent", icon: "🌘", description: "Rest and reflection—the dark before the new" };
   } else {
     return { phase: "New Moon", icon: "🌑", description: "Seeds planted in darkness—intentions set now germinate unseen" };
   }
 }
 
 // Determine dominant element based on date (shifts through the year)
 function getDominantElement(): { element: 'fire' | 'water' | 'air' | 'earth'; description: string } {
   const now = new Date();
   const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
   
   // Elements shift approximately every 7 days for variety
   const elementCycle = Math.floor(dayOfYear / 7) % 4;
   
   const elements: { element: 'fire' | 'water' | 'air' | 'earth'; description: string }[] = [
     { element: "fire", description: "Fiery currents surge—action, passion, and creative force heighten" },
     { element: "earth", description: "Earthen stability grounds—practical matters and physical foundations strengthen" },
     { element: "air", description: "Airy winds stir—thoughts clarify, communication flows, ideas take flight" },
     { element: "water", description: "Watery depths call—emotions deepen, intuition sharpens, dreams speak" },
   ];
   
   return elements[elementCycle];
 }
 
 // Generate poetic cosmic climate description
 function getCosmicClimate(): string {
   const climates = [
     "The celestial currents move gently today—a favorable atmosphere for inner work and quiet revelation",
     "Planetary tensions create creative friction—challenges may arise, but so do breakthroughs",
     "Mercury traces patterns of thought through the heavens—communication becomes a bridge or barrier",
     "Venus casts her harmonizing light—beauty, connection, and value clarify themselves",
     "Mars lends strength to will—action taken now carries momentum, choose direction wisely",
     "Jupiter expands horizons—possibility feels more accessible, faith easier to sustain",
     "Saturn demands authenticity—what is built now must be built true, or not at all",
     "The outer planets whisper of collective tides—you swim in currents larger than yourself",
   ];
   
   // Use date to select a consistent climate for the day
   const now = new Date();
   const dayHash = now.getFullYear() * 1000 + now.getMonth() * 32 + now.getDate();
   return climates[dayHash % climates.length];
 }
 
 // Generate timing suggestion
 function getTimingSuggestion(moonPhase: string): string {
   if (moonPhase.includes("New")) {
     return "The new moon invites intention-setting—return to this reading as the moon waxes";
   } else if (moonPhase.includes("Waxing")) {
     return "Growing light supports growth—nurture what this reading illuminates";
   } else if (moonPhase.includes("Full")) {
     return "Full illumination offers clarity—insights from this reading may crystallize now";
   } else {
     return "Waning light supports release—consider what this reading suggests letting go";
   }
 }
 
 // Main function to get current cosmic weather
 export function getCurrentCosmicWeather(): CosmicWeather {
   const moonData = getMoonPhaseData();
   const elementData = getDominantElement();
   
   return {
     moonPhase: moonData.phase,
     moonPhaseDescription: moonData.description,
     moonPhaseIcon: moonData.icon,
     dominantElement: elementData.element,
     elementDescription: elementData.description,
     cosmicClimate: getCosmicClimate(),
     timingSuggestion: getTimingSuggestion(moonData.phase),
   };
 }
 
 // Get planetary resonance description for a card
 export function getPlanetaryResonance(planetaryRuler: string, element: string): string {
   const planetDescriptions: Record<string, string> = {
     "Sun": "Solar radiance illuminates this card—vitality, consciousness, and core identity resonate",
     "Moon": "Lunar mystery veils this card—intuition, emotion, and inner tides flow through it",
     "Mercury": "Mercurial quicksilver animates this card—thought, communication, and connection spark",
     "Venus": "Venusian grace adorns this card—beauty, love, and values take form",
     "Mars": "Martial fire drives this card—will, courage, and decisive action pulse within",
     "Jupiter": "Jovian expansion fills this card—growth, wisdom, and abundance echo through it",
     "Saturn": "Saturnian weight anchors this card—structure, time, and earned mastery define it",
     "Uranus": "Uranian lightning electrifies this card—innovation, awakening, and sudden insight await",
     "Neptune": "Neptunian depths submerge this card—dreams, illusion, and transcendence dissolve boundaries",
     "Pluto": "Plutonian transformation powers this card—death, rebirth, and profound change stir beneath",
   };
   
   return planetDescriptions[planetaryRuler] || `${planetaryRuler} energy flows through this reflection`;
 }
 
 // Element display info
 export const elementInfo: Record<string, { symbol: string; color: string }> = {
   fire: { symbol: "🔥", color: "text-orange-400" },
   water: { symbol: "💧", color: "text-blue-400" },
   air: { symbol: "💨", color: "text-cyan-300" },
   earth: { symbol: "🌿", color: "text-emerald-400" },
   spirit: { symbol: "✨", color: "text-gold" },
 };