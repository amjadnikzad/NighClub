import { Card, CardWithIndex } from "@/types";
import { create } from "zustand";
import { createDeck } from "../utils/game";
type ID = 1 | 2 | 3 | 4;

type CardWithID = CardWithIndex;
type GameStore = {
  playerTurn: boolean;
  opponent1Turn: boolean;
  opponent2Turn: boolean;
  opponent3Turn: boolean;
  deck: CardWithID[];
  shouldReolve: ID | null;
  setTurn: (who: "P" | "O1" | "O2" | "O3") => void;
  addCardToDeck: (card: CardWithID) => void;
  clearDeck: () => void;
  setResolve: (id: ID | null) => void;
};

export const useGameStore = create<GameStore>((set) => ({
  deck: [],
  opponent1Turn: false,
  opponent2Turn: false,
  opponent3Turn: false,
  playerTurn: true,
  shouldReolve: null,
  setTurn: (who: "P" | "O1" | "O2" | "O3") => {
    switch (who) {
      case "P":
        set({
          opponent1Turn: false,
          opponent2Turn: false,
          opponent3Turn: false,
          playerTurn: true,
        });
        break;
      case "O1":
        set({
          opponent1Turn: true,
          opponent2Turn: false,
          opponent3Turn: false,
          playerTurn: false,
        });
        break;
      case "O2":
        set({
          opponent1Turn: false,
          opponent2Turn: true,
          opponent3Turn: false,
          playerTurn: false,
        });
        break;
      case "O3":
        set({
          opponent1Turn: false,
          opponent2Turn: false,
          opponent3Turn: true,
          playerTurn: false,
        });
        break;
    }
  },
  addCardToDeck: (card) => {
    set((state) => ({ deck: [...state.deck, card] }));
  },
  clearDeck: () => set({ deck: [] }),
  setResolve: (id) => {
    set(() => ({ shouldReolve: id }));
  },
}));



const cards = createDeck();
type cardStore = {
  cards: Card[];
  getRandomCard: () => Card | null;
};

export const useCardsStore = create<cardStore>((set, get) => ({
  cards: cards,
  getRandomCard: () => {
    const cards = get().cards;
    if (cards.length === 0) {
      console.log("No cards available to draw.");
      return null;
    }
    const randomIndex = Math.floor(Math.random() * cards.length);
    console.log('random Index Is:',randomIndex);
    console.log('cards Are:',cards);
    const updatedCards = cards.filter((v, i) => {
      return i !== randomIndex;
    });
    console.log('updated Cards Are:',updatedCards);
    set({
      cards: updatedCards,
    });
    return cards[randomIndex];
  },
}));
