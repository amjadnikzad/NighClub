import { useEffect, useState } from "react";
import { useGameStore } from "../state/store";
import { resolveDeck } from "../utils/game";
type ID = 1 | 2 | 3 | 4;
function rearrangeArrayFromTrue<T>(arr: T[], boolArr: boolean[]): T[] {
  const startIndex = boolArr.indexOf(true);

  if (startIndex === -1) {
    throw new Error("No true value found in boolean array");
  }

  return arr.slice(startIndex).concat(arr.slice(0, startIndex));
}

export default function useResolve() {
  const deck = useGameStore((state) => state.deck);
  const clearDeck = useGameStore((state) => state.clearDeck);
  const playerTurn = useGameStore((state) => state.playerTurn);
  const setResolve = useGameStore((state) => state.setResolve);
  const opponentTurn = useGameStore((state) => state.opponent1Turn);

  // const shouldReolve = useGameStore((state) => state.shouldReolve);
  // const [winnerIndex,setWinnerIndex] = useState<number | null>(null)
  const gameOrder = [playerTurn, opponentTurn];

  useEffect(() => {
    if (deck.length === 4) {
      console.log("called during resolve");
      const winnerBydeckIndex = resolveDeck(deck);
      const handOrder = rearrangeArrayFromTrue<number>([1, 2, 3, 4], gameOrder);
      const winnerByOrderIndex = handOrder[winnerBydeckIndex];
      // setWinnerIndex(winnerByOrderIndex);

      setResolve(winnerByOrderIndex as ID | null);
    } else setResolve(null);
  }, [deck.length]);
}
