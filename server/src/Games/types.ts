
export enum GameTypes {
    'HEARTS' = "H"
}

export enum HeartsGameModes  {
    '4v4' = '4'
}

export type CreateGameFields = {
    gameType: GameTypes,
    gameMode: HeartsGameModes,
    name: string
};

export type JoinGameFields = {
    gameID: string,
    name: string
}