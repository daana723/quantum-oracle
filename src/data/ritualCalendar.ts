// Ritual Calendar Engine
// Solstices, equinoxes, retrogrades, and suggested spreads

export interface RitualEvent {
  name: string;
  date: Date;
  type: "solstice" | "equinox" | "retrograde-start" | "retrograde-end" | "sabbat" | "eclipse";
  description: string;
  suggestedSpread: string;
  theme: string;
  element: "fire" | "water" | "air" | "earth";
  icon: string;
}

// Generate events for a given year
export function getRitualEvents(year: number): RitualEvent[] {
  const events: RitualEvent[] = [
    // Solstices & Equinoxes (approximate astronomical dates)
    {
      name: "Imbolc",
      date: new Date(year, 1, 1), // Feb 1
      type: "sabbat",
      description: "First stirring of spring — seeds of intention awaken beneath the frost.",
      suggestedSpread: "Three-card Past/Present/Future",
      theme: "New beginnings, purification, emerging light",
      element: "fire",
      icon: "🕯️",
    },
    {
      name: "Spring Equinox (Ostara)",
      date: new Date(year, 2, 20), // Mar 20
      type: "equinox",
      description: "Day and night balance — a threshold between darkness and light. Plant what you wish to harvest.",
      suggestedSpread: "Celtic Cross",
      theme: "Balance, fertility, new growth",
      element: "earth",
      icon: "🌱",
    },
    {
      name: "Beltane",
      date: new Date(year, 4, 1), // May 1
      type: "sabbat",
      description: "The fire of passion and creativity blazes — honor desire and vitality.",
      suggestedSpread: "Three-card Mind/Body/Spirit",
      theme: "Passion, creativity, union",
      element: "fire",
      icon: "🔥",
    },
    {
      name: "Summer Solstice (Litha)",
      date: new Date(year, 5, 21), // Jun 21
      type: "solstice",
      description: "The longest day — light reaches its zenith. Celebrate abundance before the wheel turns.",
      suggestedSpread: "Celtic Cross",
      theme: "Peak power, gratitude, abundance",
      element: "fire",
      icon: "☀️",
    },
    {
      name: "Lammas (Lughnasadh)",
      date: new Date(year, 7, 1), // Aug 1
      type: "sabbat",
      description: "First harvest — reap what was sown. Offer gratitude for abundance received.",
      suggestedSpread: "Three-card Past/Present/Future",
      theme: "Harvest, sacrifice, gratitude",
      element: "earth",
      icon: "🌾",
    },
    {
      name: "Autumn Equinox (Mabon)",
      date: new Date(year, 8, 22), // Sep 22
      type: "equinox",
      description: "The second balance — darkness begins to exceed light. Release and give thanks.",
      suggestedSpread: "Celtic Cross",
      theme: "Balance, gratitude, release",
      element: "water",
      icon: "🍂",
    },
    {
      name: "Samhain",
      date: new Date(year, 9, 31), // Oct 31
      type: "sabbat",
      description: "The veil between worlds thins — ancestors speak, shadows reveal their wisdom.",
      suggestedSpread: "Celtic Cross",
      theme: "Ancestors, shadow work, transformation",
      element: "water",
      icon: "🌙",
    },
    {
      name: "Winter Solstice (Yule)",
      date: new Date(year, 11, 21), // Dec 21
      type: "solstice",
      description: "The longest night — in deepest darkness, the light is reborn. Rest, reflect, renew.",
      suggestedSpread: "Three-card Past/Present/Future",
      theme: "Rebirth, rest, inner light",
      element: "earth",
      icon: "❄️",
    },

    // Mercury Retrogrades (approximate 2025–2026 dates, repeating pattern)
    {
      name: "Mercury Retrograde begins",
      date: new Date(year, 2, 14), // ~Mar 14
      type: "retrograde-start",
      description: "Communication tangles, technology falters. Slow down, review, revise. The Magician's tools need recalibrating.",
      suggestedSpread: "Single card reflection",
      theme: "Review, patience, miscommunication",
      element: "air",
      icon: "☿️",
    },
    {
      name: "Mercury Retrograde ends",
      date: new Date(year, 3, 7), // ~Apr 7
      type: "retrograde-end",
      description: "Mercury stations direct — clarity returns. Finalize delayed decisions.",
      suggestedSpread: "Three-card Past/Present/Future",
      theme: "Clarity, forward motion, resolution",
      element: "air",
      icon: "☿️",
    },
    {
      name: "Mercury Retrograde begins",
      date: new Date(year, 6, 17), // ~Jul 17
      type: "retrograde-start",
      description: "Summer's retrograde — travel plans shift, old friends resurface. Reflect before responding.",
      suggestedSpread: "Single card reflection",
      theme: "Patience, revision, reconnection",
      element: "air",
      icon: "☿️",
    },
    {
      name: "Mercury Retrograde ends",
      date: new Date(year, 7, 11), // ~Aug 11
      type: "retrograde-end",
      description: "Forward motion resumes — launch what was delayed with renewed clarity.",
      suggestedSpread: "Three-card Mind/Body/Spirit",
      theme: "Clarity, action, completion",
      element: "air",
      icon: "☿️",
    },
    {
      name: "Mercury Retrograde begins",
      date: new Date(year, 10, 9), // ~Nov 9
      type: "retrograde-start",
      description: "Year-end retrograde — unfinished business demands attention before the wheel closes.",
      suggestedSpread: "Celtic Cross",
      theme: "Completion, reflection, release",
      element: "water",
      icon: "☿️",
    },
    {
      name: "Mercury Retrograde ends",
      date: new Date(year, 10, 29), // ~Nov 29
      type: "retrograde-end",
      description: "The final clearing — tie loose threads and prepare for the solstice renewal.",
      suggestedSpread: "Three-card Past/Present/Future",
      theme: "Resolution, preparation, clarity",
      element: "water",
      icon: "☿️",
    },
  ];

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function getUpcomingEvents(count: number = 3): RitualEvent[] {
  const now = new Date();
  const year = now.getFullYear();
  const events = [...getRitualEvents(year), ...getRitualEvents(year + 1)];
  return events.filter((e) => e.date >= now).slice(0, count);
}

export function getEventTypeColor(type: RitualEvent["type"]): string {
  switch (type) {
    case "solstice": return "text-amber-400 border-amber-400/30 bg-amber-400/10";
    case "equinox": return "text-emerald-400 border-emerald-400/30 bg-emerald-400/10";
    case "retrograde-start": return "text-rose-400 border-rose-400/30 bg-rose-400/10";
    case "retrograde-end": return "text-cyan-400 border-cyan-400/30 bg-cyan-400/10";
    case "sabbat": return "text-purple-400 border-purple-400/30 bg-purple-400/10";
    case "eclipse": return "text-gold border-gold/30 bg-gold/10";
    default: return "text-foreground/60";
  }
}
