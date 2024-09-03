import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Redis } from 'ioredis';
import { IORedisKey } from 'src/redis.module';
import { AddPlayerData, CreateGameData, Deck, Game, GamePublicData, GetInitialGameData, HeartsGame, PlayerSpecificData, RemovePlayerData, SetGameStateData } from './types';
import { createDeck, distributeDeck, playeOrederResolver } from './utils';

@Injectable()
export class GamesRepository {
  private readonly logger = new Logger(GamesRepository.name);

  constructor(@Inject(IORedisKey) private readonly redisClient: Redis) {}

  async createGame({
    gameID,
    userID,
    gameMode,
  }: CreateGameData): Promise<Game> {
    const deck: Deck = createDeck();
    const hands = distributeDeck(4, deck);
    const initilizedGame: HeartsGame = {
      gameID,
      adminID: userID,
      gameMode,
      players: [],
      deck,
      state: 'WFPTJ',
      roundsPlayed: [],
      scores: [0, 0, 0, 0],
      currentRound: {
        scores: [
          [1, 0],
          [2, 0],
          [3, 0],
          [4, 0],
        ],
        turnNumber: 1,
        handsPlayed: [],
        playersCards: [...[...hands]],
        playOrder: [1, 2, 3, 4],
        currentHand: {
          play: [],
          whoIsTurn: 0,
        },
        gameStage: 'PLAY',
        swapStack: [],
      },
      leavedPlayers: [],
    };

    this.logger.log(
      `Creating New Game With This Info ${JSON.stringify(
        initilizedGame,
        null,
        2,
      )}`,
    );

    const key = `games:${gameID}`;

    try {
      await this.redisClient
        .multi([
          [
            'send_command',
            'JSON.SET',
            key,
            '.',
            JSON.stringify(initilizedGame),
          ],
          ['expire', key, '100000'],
        ])
        .exec();
      return initilizedGame;
    } catch (e) {
      this.logger.error(
        `Failed to add poll ${JSON.stringify(initilizedGame)}\n${e}`,
      );
      throw new InternalServerErrorException();
    }
  }

  async getGame(gameID: string): Promise<Game> {
    this.logger.log(`Attemoting to get Game with this ${gameID}ID `);

    const key = `games:${gameID}`;

    try {
      const currentPoll = await this.redisClient.send_command(
        'JSON.GET',
        key,
        '.',
      );
      this.logger.verbose(currentPoll);

      return JSON.parse(currentPoll);
    } catch (e) {
      this.logger.error(`Failled to retrive a game with this ${gameID} id`);
      throw e;
    }
  }

  async getGameState(gameID: string): Promise<Game['state']> {
    this.logger.log(`Attempting to get game state with the ID of: ${gameID}`);

    const key = `games:${gameID}`;
    try {
      const currentState = await this.redisClient.send_command(
        'JSON.GET',
        key,
        '$.state',
      );
      this.logger.log(JSON.parse(currentState).toString());

      return JSON.parse(currentState).toString();
    } catch (e) {
      this.logger.error(
        `Failled to retrive a game state with this ${gameID} game id`,
      );
      throw e;
    }
  }
  async setGameState({gameID,state}:SetGameStateData): Promise<Game['state']> {
    this.logger.log(`Attempting to set game state with the ID of: ${gameID}`);
    const JSONString = `'"${state}"'`;
    const key = `games:${gameID}`;
    try {
      const currentState = await this.redisClient.send_command(
        'JSON.SET',
        key,
        '$.state',
        JSON.stringify(state)
      );
      

      return currentState;
    } catch (e) {
      this.logger.error(
        `Failled to set a game state with this ${gameID} game id`,
      );
      throw e;
    }
  }
  async getPlayerSpecificData({gameID,userID}:GetInitialGameData) {
    this.logger.log(`Attempting to get Initial Data of Game with the ID of: ${gameID}`);
    
    const game = await this.getGame(gameID);
    const currentRound = game.currentRound;
    const {currentHand,handsPlayed,playOrder,scores,turnNumber} = currentRound;
    const player = game.players.find(player=>player.playerID === userID);
    const orderIndex = player.orderIndex;
    const playerHand = game.currentRound.playersCards[orderIndex-1];
    const initialGameData:PlayerSpecificData = {scores:game.scores,players:game.players,roundsPlayed:game.roundsPlayed,state:game.state,currentRound:{currentHand,handsPlayed,playerHand,scores,turnNumber,playOrder}};
    return initialGameData;
  }
  async getGamePubiclDate(gameID:string) {
    const game = await this.getGame(gameID);
    const {state,scores:gameScores,players,roundsPlayed,currentRound} = game;
    const {currentHand,handsPlayed,playOrder,scores:roundScores,turnNumber} = currentRound;
    const gamePublicData = <GamePublicData> {players,scores:gameScores,state,roundsPlayed,currentRound:{currentHand,handsPlayed,playOrder,scores:roundScores,turnNumber}};
    return gamePublicData;
  }

  async addPlayer({ gameID, name, userID }: AddPlayerData): Promise<Game['players']> {
    this.logger.log(
      `Attempting to Add Player with UserID/name: ${userID}/${name} to gameID: ${gameID}`,
    );
    const key = `games:${gameID}`;
    const playersPath = '$.players';
    const game = await this.getGame(gameID);
    const players = game.players;
    const orderIndex = playeOrederResolver(players);
    try {
      await this.redisClient.send_command(
        'JSON.ARRAPPEND',
        key,
        playersPath,
        JSON.stringify({ playerID:userID, name,orderIndex}),
      );

      return (await this.getGame(gameID)).players;
    } catch (e) {
      this.logger.error(
        `Failed to add player with playerID/name:${userID}/${name} to game: ${gameID}`,
      );
      throw e;
    }
  }

  async removePlayer({ gameID, userID }: RemovePlayerData): Promise<Game> {
    this.logger.log(
      `Attempting to remove Player with UserID: ${userID} from gameID: ${gameID}`,
    );
    const key = `games:${gameID}`;
    const playersPath = '$.players';
    const game = await this.getGame(gameID);
    const players = game.players;
    const playerindex = players.findIndex(player=> player.playerID === userID);
    try {
      await this.redisClient.send_command(
        'JSON.ARRPOP',
        key,
        playersPath,
        playerindex,
      );

       const updatedGame = await this.getGame(gameID);
       return updatedGame;
    } catch (e) {
      this.logger.error(
        `Failed to remove player with playerID/name:${userID}/${name} to game: ${gameID}`,
      );
      throw e;
    }
  }
}
