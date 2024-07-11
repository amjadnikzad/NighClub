import {Card} from "../../../shared/index";

//******************************************************************************** 
//Game mode types should be iplemented!! currently im just using simple deco type for prototyping!!
//******************************************************************************** 


export enum GameTypes {
    'HEARTS' = "H"
}

export enum HeartsGameModes  {
    '4v4' = '4'
}

type GameType = {
    GameType: 'Hearts'|'Spade',
    GameMode: 'Single' | 'Duo',
    PlayerNumber: 3|4|5|6
}
//Service Types
export type CreateGameFields = {
    gameMode: HeartsGameModes,
    name: string
};

export type JoinGameFields = {
    gameID: string,
    name: string
}

//Repository Types
export type CreateGameData = {
    userID:string,
    gameID:string,
    gameMode: string
}

export type AddPlayerData = {
    userID:string,
    gameID:string,
    name:string,
};



//Game Types
type Player = {
    PlayerID: string,
    name: string
}
/**
 * WFPTJ Stands Waiting For Players To Join It Could Be Both When The Game Is Initiated Or When A player Leaves The Game.
 * 
 * ON_PROGRESS Is All Players Are Active(Not Stale).
 * 
 * Finshed Represents When Game Has Completed And There is A Winner.
 * 
 * STALE Refers To A Situation When All Players Are Available But No One Is Making A Move
 */
type GameSates = 'WFPTJ'|'ON_PROGRESS'|'fINISHED'|'STALE';

export type Deck = Card[];

type Round = {
    scores: number[],
    turnNumber:number,
    playersCards:Array<Card>[] ,
    handsPlayed:Array<Card>[],
    playOrder:number[],
    currentHand: {
        play:Array<Card>,
        whoIsTurn:number
    }
};
export interface Game {
    gameID: string,
    adminID:string,
    players: Player[],
    deck: Deck,
    state: GameSates,
    scores:number[],
    gameMode: string,
    roundsPlayed: Array<number[]>,
    currentRound: Round
};

