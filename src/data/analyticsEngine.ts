import type { Reading } from "@/hooks/useReadingHistory";

export interface CardFrequency {
  name: string;
  count: number;
}

export interface ElementDistribution {
  element: string;
  count: number;
  fill: string;
}

export interface ThemeFrequency {
  theme: string;
  count: number;
}

export interface WeeklyActivity {
  week: string;
  readings: number;
}

const ELEMENT_COLORS: Record<string, string> = {
  fire: "hsl(15, 80%, 55%)",
  water: "hsl(210, 60%, 50%)",
  air: "hsl(45, 80%, 55%)",
  earth: "hsl(140, 40%, 40%)",
  spirit: "hsl(280, 50%, 55%)",
};

export function getCardFrequencies(readings: Reading[]): CardFrequency[] {
  const counts: Record<string, number> = {};

  for (const r of readings) {
    const allCards = [r.primaryCard, ...r.echoCards];
    for (const card of allCards) {
      counts[card.name] = (counts[card.name] || 0) + 1;
    }
  }

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export function getElementDistribution(readings: Reading[]): ElementDistribution[] {
  const counts: Record<string, number> = {};

  for (const r of readings) {
    const allCards = [r.primaryCard, ...r.echoCards];
    for (const card of allCards) {
      counts[card.element] = (counts[card.element] || 0) + 1;
    }
  }

  return Object.entries(counts)
    .map(([element, count]) => ({
      element: element.charAt(0).toUpperCase() + element.slice(1),
      count,
      fill: ELEMENT_COLORS[element] || "hsl(0, 0%, 50%)",
    }))
    .sort((a, b) => b.count - a.count);
}

export function getThemeFrequencies(readings: Reading[]): ThemeFrequency[] {
  const counts: Record<string, number> = {};

  for (const r of readings) {
    const allCards = [r.primaryCard, ...r.echoCards];
    for (const card of allCards) {
      for (const theme of card.themes) {
        counts[theme] = (counts[theme] || 0) + 1;
      }
    }
  }

  return Object.entries(counts)
    .map(([theme, count]) => ({ theme: theme.charAt(0).toUpperCase() + theme.slice(1), count }))
    .sort((a, b) => b.count - a.count);
}

export function getWeeklyActivity(readings: Reading[]): WeeklyActivity[] {
  const now = Date.now();
  const weeks: WeeklyActivity[] = [];

  for (let i = 7; i >= 0; i--) {
    const weekStart = now - i * 7 * 24 * 60 * 60 * 1000;
    const weekEnd = now - (i - 1) * 7 * 24 * 60 * 60 * 1000;
    const count = readings.filter(
      (r) => r.timestamp >= weekStart && r.timestamp < weekEnd
    ).length;

    const d = new Date(weekStart);
    weeks.push({
      week: `${d.getMonth() + 1}/${d.getDate()}`,
      readings: count,
    });
  }

  return weeks;
}

export function getIntentDistribution(readings: Reading[]) {
  const counts: Record<string, number> = {};

  for (const r of readings) {
    const label = r.customIntent || r.intent || "No intent";
    counts[label] = (counts[label] || 0) + 1;
  }

  return Object.entries(counts)
    .map(([intent, count]) => ({
      intent: intent.charAt(0).toUpperCase() + intent.slice(1),
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}
