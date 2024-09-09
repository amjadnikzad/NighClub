'use client'
import { memo, useEffect, useReducer, useState } from "react"

import { Card, CardWithIndex, Rank, Suit } from "@/types"
import CardTemplate from "./card";
import { useCardsStore, useGameStore } from "./state/store";
import { locations} from "./utils/game";
import { whatIsTheRotation, wherCardShouldBe } from "./utils/card";
type StackCard = { card: CardWithIndex, stack: number };

type GameStore = {
    playerTurn: boolean;
    opponent1Turn: boolean;
    opponent2Turn: boolean;
    opponent3Turn: boolean;
    setTurn: (who: "P" | "O1" | "O2" | "O3") => void;
    clearDeck: () => void;
};
type PlayerCardsState = {
    cardsInHand: CardWithIndex[],
    cardTobePlayed: CardWithIndex | null,
    playedCards: StackCard[],
    playerCards: CardWithIndex[]
}

type Action = { type: 'AddCardToDeck', payload: CardWithIndex } | { type: 'AddCardToStack', payload: number };



function reducer(state: PlayerCardsState, action: Action) {


    switch (action.type) {
        case "AddCardToDeck":
            const cardTobePlayed = action.payload;
            const cardsInHand = state.cardsInHand.filter((card) => card.cardIndex !== cardTobePlayed.cardIndex);
            const playerCards = state.playerCards.map(v =>
                v.cardIndex === cardTobePlayed.cardIndex ? { ...v, card: cardTobePlayed.card } : v
            );
            return { ...state, cardTobePlayed, cardsInHand, playerCards };
        case "AddCardToStack":
            const cardsToBeAddedToStack = state.cardTobePlayed;
            if (!cardsToBeAddedToStack) return state;
            const playedCards = [...state.playedCards.slice(), { card: cardsToBeAddedToStack, stack: action.payload }];
            return { ...state, cardTobePlayed: null, playedCards };
        default:
            return state;

    }
};


type OpponentPropsType = {
    id: number;
    resolveTo: number | null
}

// const cardSet = [{ suit: Suit.Diamonds, rank: Rank.Ace }, { suit: Suit.Diamonds, rank: Rank.Two }, { suit: Suit.Diamonds, rank: Rank.Three }, { suit: Suit.Diamonds, rank: Rank.Four }, { suit: Suit.Diamonds, rank: Rank.Five }, { suit: Suit.Diamonds, rank: Rank.Six }, { suit: Suit.Diamonds, rank: Rank.Seven }, { suit: Suit.Diamonds, rank: Rank.Eight }, { suit: Suit.Diamonds, rank: Rank.Nine }, { suit: Suit.Diamonds, rank: Rank.Ten }, { suit: Suit.Diamonds, rank: Rank.Jack }, { suit: Suit.Diamonds, rank: Rank.Queen }, { suit: Suit.Diamonds, rank: Rank.King }];
const cardSet = [null, null, null, null, null, null, null, null, null, null, null, null, null];

function Opponent({ id, resolveTo }: OpponentPropsType) {

    const cardSetWithIndex = cardSet.map((card, i) => ({ card: card, cardIndex: (i * 4) + id })) as CardWithIndex[];
    const initailState = { cardsInHand: cardSetWithIndex, cardTobePlayed: null, playerCards: cardSetWithIndex, playedCards: [] as StackCard[] };
    const [cardsState, dispatch] = useReducer(reducer, initailState);
    const opponentTurn = `opponent${id - 1}Turn` as keyof GameStore;
    const isItOpponentTurn = useGameStore((state) => (state[opponentTurn]));
    const setTurn = useGameStore((state) => (state.setTurn));
    const drawCard = useGameStore((state) => (state.addCardToDeck));

    const getRandomCard = useCardsStore((state) => (state.getRandomCard));
    const whoIsNext = (): "P" | "O1" | "O2" | "O3" => {
        if (id !== 4) { return `O${id}` as "O1" | "O2" | "O3" } else return 'P';
    };
    const [index, setIndex] = useState(id);
    console.log(id, isItOpponentTurn, index);
    useEffect(
        () => {
            if (isItOpponentTurn) {
                console.log(`opponent with id of ${id} is calling`)
                const randomCard = getRandomCard();
                if (!randomCard) return;
                setTimeout(() => {
                    setTurn(whoIsNext());
                    dispatch({ type: "AddCardToDeck", payload: { card: randomCard, cardIndex: index } });
                    drawCard({ card: randomCard, cardIndex: index });
                    setIndex((perv) => perv + 4);
                }, 3000);

            };
        }, [isItOpponentTurn]
    );

    useEffect(
        () => {
            if (resolveTo) {
                setTimeout(() => {
                    dispatch({ type: 'AddCardToStack', payload: resolveTo });
                }, 1500)
            }
        }, [resolveTo]
    );
    const shouldFlip = (cards: PlayerCardsState, cardIndex: number, i: number) => {
        const cardOnDeck = cards.cardTobePlayed;
        const cardsOnStack = cards.playedCards;
        if (cardsOnStack.some(obj => obj?.card.cardIndex === cardIndex)) { return true } else if (cardOnDeck?.cardIndex === cardIndex) { return false } else return true;

    };
    const cordinates = locations();
    const disterbuteCards = (cards: PlayerCardsState) => (cards.playerCards.map((card, i) => <CardTemplate cardIndex={(i * 4) + 1} key={`${1}i`} rotation={whatIsTheRotation(cards, card.cardIndex, i, id)} card={card} ownedByPlayer={false} loactaion={wherCardShouldBe(cards, card.cardIndex, i, id, cordinates)} flipped={shouldFlip(cards, card.cardIndex, i)} clickHandler={() => { }} />))
    return (
        <>
            {disterbuteCards(cardsState)}
        </>
    )
}

export default memo(Opponent);