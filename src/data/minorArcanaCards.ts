export type MinorSuit = 'pentacles' | 'cups' | 'wands' | 'swords';

export interface MinorArcanaCard {
  id: string;
  suit: MinorSuit;
  rank: string;
  name: string;
  isGroup?: boolean; // true for the 4-10 representative card
}

const suits: MinorSuit[] = ['pentacles', 'cups', 'wands', 'swords'];
const individualRanks = ['ace', '2', '3'];
const courtRanks = ['page', 'knight', 'queen', 'king'];

function buildSuit(suit: MinorSuit): MinorArcanaCard[] {
  const suitName = suit.charAt(0).toUpperCase() + suit.slice(1);
  const cards: MinorArcanaCard[] = [];

  // Ace, 2, 3
  for (const rank of individualRanks) {
    const label = rank === 'ace' ? 'Ace' : rank;
    cards.push({
      id: `${suit}-${rank}`,
      suit,
      rank,
      name: `${label} of ${suitName}`,
    });
  }

  // 4-10 group representative
  cards.push({
    id: `${suit}-4to10`,
    suit,
    rank: '4-10',
    name: `${suitName} IV–X`,
    isGroup: true,
  });

  // Court cards
  for (const rank of courtRanks) {
    const label = rank.charAt(0).toUpperCase() + rank.slice(1);
    cards.push({
      id: `${suit}-${rank}`,
      suit,
      rank,
      name: `${label} of ${suitName}`,
    });
  }

  return cards;
}

export const minorArcana: MinorArcanaCard[] = suits.flatMap(buildSuit);

export const suitLabels: Record<MinorSuit, string> = {
  pentacles: '✡ Pentacles',
  cups: '🏆 Cups',
  wands: '🪄 Wands',
  swords: '⚔️ Swords',
};
