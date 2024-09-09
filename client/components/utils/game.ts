import { Card, CardWithIndex, Deck, Rank, Suit } from "@/types";
import { useWindowSize } from "@uidotdev/usehooks";
type StackCard = { card: CardWithIndex; stack: number };

type PlayerCardsState = {
  cardsInHand: CardWithIndex[];
  cardTobePlayed: CardWithIndex | null;
  playedCards: StackCard[];
};

export const getCardValue = (card: Card): number => {
  if (!card) return 0;
  const rank = card.rank;

  switch (rank) {
    case "Ace":
      return 14;
    case "King":
      return 13;
    case "Queen":
      return 12;
    case "Jack":
      return 11;
    default:
      return +rank;
  }
};

export const resolveDeck = (deck: Deck): number => {
  const backgroundCard = deck[0].card?.suit;
  const cardsToBeValuated = <number[]>deck.reduce(
    (acc: number[], card, index) => {
      if (card.card?.suit === backgroundCard) {
        acc.push(index);
      }
      return acc;
    },
    []
  );

  if (cardsToBeValuated.length === 1) return 0;

  const winnerIndex = cardsToBeValuated.reduce(
    (acc, indexValue) => {
      const currentCardValue = getCardValue(deck[indexValue].card as Card);
      if (currentCardValue > acc.accScore) {
        acc.index = indexValue;
        acc.accScore = currentCardValue;
      }
      return acc;
    },
    { index: 0, accScore: 0 }
  );
  return winnerIndex.index;
};
function getRandomNumberInRange(min: number, max: number): number {
  // Ensure the min is less than max
  if (min > max) {
    throw new Error("min must be less than or equal to max");
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}



export const locations = (): [number, number] => {
  const { width, height } = useWindowSize();
  if (width && height) {
    const middle = [width / 2, height / 2] as [number, number];
    console.log(middle);
    return middle;
  } else return [0, 0];
};

export const createDeck = (): Card[] => {
  const deck: Card[] = [];

  for (const suit of Object.values(Suit)) {
    if (suit === Suit.Spades) continue;
    for (const rank of Object.values(Rank)) {
      deck.push({ rank, suit });
    }
  }

  return deck;
};
