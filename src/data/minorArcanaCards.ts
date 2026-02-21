export type MinorSuit = 'pentacles' | 'cups' | 'wands' | 'swords';

export interface MinorArcanaCard {
  id: string;
  suit: MinorSuit;
  rank: string;
  name: string;
}

const suits: MinorSuit[] = ['pentacles', 'cups', 'wands', 'swords'];
const ranks = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'page', 'knight', 'queen', 'king'];
const courtRanks = ['page', 'knight', 'queen', 'king'];

function buildSuit(suit: MinorSuit): MinorArcanaCard[] {
  const suitName = suit.charAt(0).toUpperCase() + suit.slice(1);
  return ranks.map((rank) => {
    const isCourt = courtRanks.includes(rank);
    const label = rank === 'ace' ? 'Ace' : isCourt ? rank.charAt(0).toUpperCase() + rank.slice(1) : rank;
    const name = isCourt ? `${label} of ${suitName}` : `${label} of ${suitName}`;
    return { id: `${suit}-${rank}`, suit, rank, name };
  });
}

export const minorArcana: MinorArcanaCard[] = suits.flatMap(buildSuit);

export const suitLabels: Record<MinorSuit, string> = {
  pentacles: '✡ Pentacles',
  cups: '🏆 Cups',
  wands: '🪄 Wands',
  swords: '⚔️ Swords',
};
