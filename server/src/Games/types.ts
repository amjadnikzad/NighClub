//********************************************************************************
//Game mode types should be iplemented!! currently im just using simple deco type for prototyping!!
//********************************************************************************

import { Socket } from 'socket.io';

export enum GameTypes {
  'HEARTS' = 'H',
}

export enum HeartsGameModes {
  '4v4' = '4',
}

type GameType = {
  GameType: 'Hearts' | 'Spade';
  GameMode: 'Single' | 'Duo';
  PlayerNumber: 3 | 4 | 5 | 6;
};
//Service Types
export type CreateGameFields = {
  gameMode: HeartsGameModes;
  name: string;
};

export type JoinGameFields = {
  gameID: string;
  name: string;
};

//Repository Types
export type CreateGameData = {
  userID: string;
  gameID: string;
  gameMode: string;
};

export type AddPlayerData = {
  userID: string;
  gameID: string;
  name: string;
};

//Game Types
export type OrderIndexType = 1 | 2 | 3 | 4;
type Player = {
  PlayerID: string;
  name: string;
  orderIndex: OrderIndexType;
};
/**
 * WFPTJ Stands Waiting For Players To Join It Could Be Both When The Game Is Initiated Or When A player Leaves The Game.
 *
 * ON_PROGRESS Is All Players Are Active(Not Stale).
 *
 * Finshed Represents When Game Has Completed And There is A Winner.
 *
 * STALE Refers To A Situation When All Players Are Available But No One Is Making A Move
 */
type GameSates = 'WFPTJ' | 'ON_PROGRESS' | 'fINISHED' | 'STALE';

export type Deck = Card[];

type ScoreTuple = [OrderIndexType, number];

interface Round {
  scores: ScoreTuple[];
  turnNumber: number;
  playersCards: Array<Card>[];
  handsPlayed: Array<Card>[];
  playOrder: OrderIndexType[];
  currentHand: {
    play: Array<Card>;
    whoIsTurn: number;
  };
}
export interface Game {
  gameID: string;
  adminID: string;
  players: Player[];
  deck: Deck;
  state: GameSates;
  scores: number[];
  gameMode: string;
  roundsPlayed: Array<number[]>;
  currentRound: Round;
  leavedPlayers: Player[];
}

export interface HeartsRound extends Round {
  gameStage: 'SWAP' | 'PLAY';
  swapStack: Card[][];
}

export interface HeartsGame extends Game {
  currentRound: HeartsRound;
}

//Gaurd types

export type AuthPayload = {
  userID: string;
  name: string;
  gameID: string;
};

export type SocketWithAuth = AuthPayload & Socket;

// Shared types

export enum Suit {
  Spades = 'Spades',
  Hearts = 'Hearts',
  Diamonds = 'Diamonds',
  Clubs = 'Clubs',
}

export enum Rank {
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Ten = '10',
  Jack = 'Jack',
  Queen = 'Queen',
  King = 'King',
  Ace = 'Ace',
}

export type Card = {
  rank: Rank;
  suit: Suit;
};
