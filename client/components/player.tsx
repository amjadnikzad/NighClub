'use client'
import { useEffect, useReducer } from "react"

import {  CardWithIndex, Rank, Suit } from "@/types"
import CardTemplate from "./card";
import { useGameStore } from "./state/store";
import { whatIsTheRotation, wherCardShouldBe } from "./utils/card";



type StackCard = { card: CardWithIndex, stack: number };

type PlayerCardsState = {
    cardsInHand: CardWithIndex[],
    cardTobePlayed: CardWithIndex | null,
    playedCards: StackCard[]
}

type Action = { type: 'AddCardToDeck', payload: CardWithIndex } | { type: 'AddCardToStack', payload: number };



function reducer(state: PlayerCardsState, action: Action) {


    switch (action.type) {
        case "AddCardToDeck":
            const cardTobePlayed = action.payload;
            const cardsInHand = state.cardsInHand.filter((card) => card.cardIndex !== cardTobePlayed.cardIndex);
            return { ...state, cardTobePlayed, cardsInHand };
        case "AddCardToStack":
            const cardsToBeAddedToStack = state.cardTobePlayed;
            if (!cardsToBeAddedToStack) return state;
            const playedCards = [...state.playedCards.slice(), { card: cardsToBeAddedToStack, stack: action.payload }];
            return { ...state, cardTobePlayed: null, playedCards };
        default:
            return state;

    }
};


const cardSet = [{ suit: Suit.Clubs, rank: Rank.Ace }, { suit: Suit.Clubs, rank: Rank.Two }, { suit: Suit.Clubs, rank: Rank.Three }, { suit: Suit.Clubs, rank: Rank.Four }, { suit: Suit.Clubs, rank: Rank.Five }, { suit: Suit.Clubs, rank: Rank.Six }, { suit: Suit.Clubs, rank: Rank.Seven }, { suit: Suit.Clubs, rank: Rank.Eight }, { suit: Suit.Clubs, rank: Rank.Nine }, { suit: Suit.Clubs, rank: Rank.Ten }, { suit: Suit.Clubs, rank: Rank.Jack }, { suit: Suit.Clubs, rank: Rank.Queen }, { suit: Suit.Clubs, rank: Rank.King }];
const cardSetWithIndex = cardSet.map((card, i) => ({ card: card, cardIndex: (i * 4) + 1 })) as CardWithIndex[];
const initailState = { cardsInHand: cardSetWithIndex, cardTobePlayed: null, playedCards: [] as StackCard[] };

type PlayeTypes = {
    resolveTo: number | null,
    cordinates: [number, number]

}

export default function Player(props: PlayeTypes) {
    const [cardsState, dispatch] = useReducer(reducer, initailState);

    const isItPlayerTurn = useGameStore((state) => (state.playerTurn));
    const setTurn = useGameStore((state) => (state.setTurn));
    const drawCard = useGameStore((state) => (state.addCardToDeck));
    const clearDeck = useGameStore((state) => state.clearDeck);
    const setResolve = useGameStore((state) => state.setResolve);


    useEffect(
        () => {
            if (props.resolveTo) {
                setTimeout(() => {
                    dispatch({ type: 'AddCardToStack', payload: props.resolveTo as number });
                    setResolve(null);
                    clearDeck();
                }, 1500)

            }
        }, [props.resolveTo]
    )
    const cardHandleClick = (card: CardWithIndex) => {
        if (isItPlayerTurn) {
            dispatch({ type: 'AddCardToDeck', payload: card })
            drawCard({ ...card });
            setTurn("O1");
        };
    };
    
    const shouldFlip = (cards: PlayerCardsState, cardIndex: number, i: number) => {
        const cardsOnStack = cards.playedCards;
        if (cardsOnStack.some(obj => obj?.card.cardIndex === cardIndex)) { return true } else return false;

    };
    const disterbuteCards = (cards: PlayerCardsState) => (cardSetWithIndex.map((card, i) => <CardTemplate cardIndex={(i * 4) + 1} key={(i * 4) + 1} rotation={whatIsTheRotation(cards,card.cardIndex,i)} card={card} ownedByPlayer loactaion={wherCardShouldBe(cards, card.cardIndex, i,1,props.cordinates)} flipped={shouldFlip(cards,card.cardIndex,i)} clickHandler={cardHandleClick} />))
    return (
        <>
            {disterbuteCards(cardsState)}
        </>
    )
}

