import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Redis } from 'ioredis';
import { IORedisKey } from 'src/redis.module';
import { AddPlayerData, CreateGameData, Deck, Game } from './types';
import { createDeck, distributeDeck } from './utils';

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
    const initilizedGame: Game = {
      gameID,
      adminID: userID,
      gameMode,
      players: [],
      deck,
      state: 'WFPTJ',
      roundsPlayed: [],
      scores: [0, 0, 0, 0],
      currentRound: {
        scores: [0, 0, 0, 0],
        turnNumber: 1,
        handsPlayed: [],
        playersCards: [...[...hands]],
        playOrder: [0, 1, 2, 3],
        currentHand: {
          play: [],
          whoIsTurn: 0,
        },
      },
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
        this.logger.error(`Failled to retrive a game state with this ${gameID} game id`);
      throw e;
    }
  }


  async addPlayer({ gameID, name, userID }: AddPlayerData): Promise<Game> {
    this.logger.log(
      `Attempting to Add Player with UserID/name: ${userID}/${name} to gameID: ${gameID}`,
    );

    const key = `games:${gameID}`;
    const playersPath = '$.players';

    try {
      await this.redisClient.send_command(
        'JSON.ARRAPPEND',
        key,
        playersPath,
        JSON.stringify({ userID, name }),
      );

      const gameJSON = await this.redisClient.send_command(
        'JSON.GET',
        key,
        '.',
      );

      const game = JSON.parse(gameJSON) as Game;
      this.logger.debug(
        `Current Players for this Game:${gameID}:`,
        game.players,
      );

      return game;
    } catch (e) {
      this.logger.error(
        `Failed to add player with playerID/name:${userID}/${name} to game: ${gameID}`,
      );
      throw e;
    }
  }
}
