import { CardWithIndex } from "@/types";

enum Locations {
  Deck = "Deck",
  Hand = "Hand",
  Stack = "Stack",
}
type StackCard = { card: CardWithIndex; stack: number };

type PlayerCardsState = {
  cardsInHand: CardWithIndex[];
  cardTobePlayed: CardWithIndex | null;
  playedCards: StackCard[];
};



//location
const whichStackShouldBe = (
  stackCards: StackCard[],
  cardIndex: number
): [number, number] => {
  switch (stackCards.find((v) => v.card.cardIndex === cardIndex)?.stack) {
    case 1:
      return [600, 920];
    case 2:
      return [150, 60];
    case 3:
      return [1300, 100];
    case 4:
      return [2100, 900];
    default:
      return [0, 0];
  }
};

export const wherCardShouldBe = (
  cards: PlayerCardsState,
  cardIndex: number,
  i: number,
  playerID: number = 1,
  cordinates: [number, number]
): [[number, number], Locations] => {
  const cardsOrintaion = playerID % 2 === 0 ? [0.5, 25] : [25, 0.5];
  const handLocationResolver = (playerID: number): [number, number] => {
    switch (playerID) {
      case 1:
        return [600, 680];
      case 2:
        return [0, 250];
      case 3:
        return [750, 0];
      case 4:
        return [1920, 250];
      default:
        return [0, 0];
    }
  };
  const handLocation = handLocationResolver(playerID);
  const cardOnDeck = cards.cardTobePlayed;
  const cardsOnStack = cards.playedCards;
  if (cardOnDeck?.cardIndex === cardIndex) {
    return [cordinates, Locations.Deck];
  } else if (cardsOnStack.some((obj) => obj?.card.cardIndex === cardIndex)) {
    return [whichStackShouldBe(cardsOnStack, cardIndex), Locations.Stack];
  } else {
    return [
      [
        handLocation[0] + i * cardsOrintaion[0],
        handLocation[1] + i * cardsOrintaion[1],
      ],
      Locations.Hand,
    ];
  }
};


//Rotation
export const whatIsTheRotation = (
  cards: PlayerCardsState,
  cardIndex: number,
  i: number,
  playerID: number = 1
): number => {
  const cardOnDeck = cards.cardTobePlayed;
  const cardsOnStack = cards.playedCards;
  const baseAngle = (playerID - 1) * 90;
  const stackID = cardsOnStack.find(
    (card) => card.card.cardIndex === cardIndex
  )?.stack;
  if (cardOnDeck?.cardIndex === cardIndex) {
    return baseAngle + 12.5;
  } else if (stackID) {
    return 2 + playerID * 1.5 + (stackID - 1) * 90;
  } else {
    return (
      -38.625 + ((i + 1) * 45) / cards.cardsInHand.length + baseAngle
    );
  }
};


//scale
const locationScaleMap: { [key in Locations]: number } = {
    [Locations.Hand]: 1.0,   
    [Locations.Deck]: 0.75,
    [Locations.Stack]: 0.65,
};

export const getScaleForLocation = (location:Locations,ownedByplayer:boolean):number => {
    if(!ownedByplayer && location === 'Hand'){
        return 0.78
    } else return locationScaleMap[location];
    
}