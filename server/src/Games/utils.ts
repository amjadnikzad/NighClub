import { Deck, Card, Rank, Suit, OrderIndexType } from './types';

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

export const heartsGameHandler = (game, payload) => {};

const heartsRoundResolver = () => {};

const heartsHandResolver = ({act}) => {


};

const getCardValue = (card: Card): number => {
  const rank = card.rank;

  switch (rank) {
    case 'Ace':
      return 14;
    case 'King':
      return 13;
    case 'Queen':
      return 12;
    case 'Jack':
      return 11;
    default:
      return +rank;
  }
};

/**
 * Will resolves a deck based on first card on deck as background.
 * 
 * @param {Deck} deck - it takes a deck in any size.
 * @returns {number} it returns the index of a card in main deck, based on this index the player who should collect hands will be denoted.
 * 
 */
const resolveDeck = (deck: Deck): number => {
  const backgroundCard = deck[0].suit;
  const cardsToBeValuated = <number[]> deck.reduce((acc, card, index) => {
    if (card.suit === backgroundCard) {
      acc.push(index);
    }
    return acc;
  }, []);

  if (cardsToBeValuated.length === 1) return 0;

  const winnerIndex = cardsToBeValuated.reduce((acc, indexValue) => {
    const currentCardValue = getCardValue(deck[indexValue]);
    if (currentCardValue > acc.accScore) {
      acc.index = indexValue;
      acc.accScore = currentCardValue;
    }
    return acc;
  }, {index:0,accScore:0});
  return winnerIndex.index;
};

/**
 * Will Calculate Deck score based on Hearts rules.
 * 
 * 
 * each card with hearts Suit will resloves in 1 score and the Queen of Spade 17 scores.
 * 
 * 
 * @param {Deck} deck - it takes a deck in any size.
 * @returns {number} it returns the value of Deck as a number.
 * 
 */
const getHeartsDeckScore = (deck:Deck): number => {
  const deckScore = deck.reduce((acc,card)=>{
    switch(card.suit) {
      case 'Hearts':
        acc += 1;
        break;
      case 'Spades':
        if(card.rank === 'Queen') acc += 17;
        break;
      default:
        break;
    }
    return acc;
    
  },0);
  return deckScore;
}

//game validation logic
const doesItHaveTheCard = (cards:Card[][],playerIndex:OrderIndexType,requestedCard:Card): boolean => {
  const playerCards =  cards[playerIndex-1];
  return playerCards.some(card => card.rank === requestedCard.rank && card.suit === requestedCard.suit);
};

const isItPlayersTurn = (playerOrderIndex:OrderIndexType,whoIsTurn:number):boolean => {

}