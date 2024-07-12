import { Deck,Card, Rank, Suit } from './types';

export const createDeck = (): Deck => {
  const deck: Deck = [];

  for (const suit of Object.values(Suit)) {
    for (const rank of Object.values(Rank)) {
      deck.push({ rank, suit });
    }
  }

  return deck;
};

export const shuffleDeck = (deck: Deck): Deck => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export const distributeDeck = (numPlayers: number, deck: Deck): Card[][] => {
  // Initialize an array of empty hands
  const hands: Card[][] = Array.from({ length: numPlayers }, () => []);

  // Distribute the cards in a round-robin fashion
  deck.forEach((card, index) => {
    hands[index % numPlayers].push(card);
  });

  return hands;
};