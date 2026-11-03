// Minor Arcana card images, keyed by card id (e.g. "swords-8").
// Two editions: the Original deck (files in this folder) and the Twilight
// edition (files in ./twilight). Twilight falls back to Original per card.

export type MinorEdition = "original" | "twilight";

const original: Record<string, string> = {};
const twilightOnly: Record<string, string> = {};

const originals = import.meta.glob('./*.jpg', { eager: true, import: 'default' }) as Record<string, string>;
for (const [path, url] of Object.entries(originals)) {
  original[path.replace('./', '').replace('.jpg', '')] = url;
}

const twilights = import.meta.glob('./twilight/*.jpg', { eager: true, import: 'default' }) as Record<string, string>;
for (const [path, url] of Object.entries(twilights)) {
  twilightOnly[path.replace('./twilight/', '').replace('.jpg', '')] = url;
}

export const minorCardImages: Record<string, string> = original;
export const twilightCardIds = new Set(Object.keys(twilightOnly));

export function getMinorCardImages(edition: MinorEdition): Record<string, string> {
  return edition === "twilight" ? { ...original, ...twilightOnly } : original;
}
