import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Redis } from 'ioredis';
import { IORedisKey } from 'src/redis.module';
import {
  AddPlayerData,
  Card,
  CreateGameData,
  Deck,
  Game,
  GamePublicData,
  GetInitialGameData,
  HeartsGame,
  PlayerSpecificData,
  RemovePlayerData,
  SetGameStateData,
} from './types';
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
        handsPlayed: [],
        playersCards: [...[...hands]],
        playOrder: [1, 2, 3, 4],
        trick:[],
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
      const currentGame = await this.redisClient.send_command(
        'JSON.GET',
        key,
        '.',
      );
      this.logger.verbose(currentGame);

      return JSON.parse(currentGame);
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

  async setGameState({
    gameID,
    state,
  }: SetGameStateData): Promise<Game['state']> {
    this.logger.log(`Attempting to set game state with the ID of: ${gameID}`);
    const JSONString = `'"${state}"'`;
    const key = `games:${gameID}`;
    try {
      const currentState = await this.redisClient.send_command(
        'JSON.SET',
        key,
        '$.state',
        JSON.stringify(state),
      );

      return currentState;
    } catch (e) {
      this.logger.error(
        `Failled to set a game state with this ${gameID} game id`,
      );
      throw e;
    }
  }

  async getPlayerSpecificData({ gameID, userID }: GetInitialGameData) {
    this.logger.log(
      `Attempting to get Initial Data of Game with the ID of: ${gameID}`,
    );
    const orderIndex = await this.getPlayerPlayOrder(gameID,userID);
    const playerHand = await this.getPlayerCards(gameID,+orderIndex);
    const PlayerSpecificData: PlayerSpecificData = {
      playerHand,
      }
    return PlayerSpecificData;
  }

  async getGamePubiclDate(gameID: string) {
    const game = await this.getGame(gameID);
    const {
      state,
      scores: gameScores,
      players,
      roundsPlayed,
      currentRound,
    } = game;
    const {
      trick,
      handsPlayed,
      playOrder,
      scores: roundScores,
    } = currentRound;
    const sanitizedHandsPlayed = handsPlayed.map((hand,i,hands)=>{if(i + 1 < hands.length){return[]} else return hand});
    const gamePublicData = <GamePublicData>{
      players,
      scores: gameScores,
      state,
      roundsPlayed,
      currentRound: {
        trick,
        handsPlayed:sanitizedHandsPlayed,
        playOrder,
        scores: roundScores,
      },
    };
    return gamePublicData;
  }

  async addPlayer({
    gameID,
    name,
    userID,
  }: AddPlayerData): Promise<Game['players']> {
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
        JSON.stringify({ playerID: userID, name, orderIndex }),
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
    const playerindex = players.findIndex(
      (player) => player.playerID === userID,
    );
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

  async getPlayerPlayOrder(gameID:string,userID:string){
    const key = `games:${gameID}`;
    const playersPath = '.players';

    try {
      const playersJSON = await this.redisClient.send_command(
        'JSON.GET',
        key,
        playersPath,
      );
      const players = await JSON.parse(playersJSON) as Game['players'];
     this.logger.log(playersJSON);
      const playOrderIndex = players.find(player=>player.playerID === userID).orderIndex;
      return playOrderIndex;
    } catch (e) {
      throw e;
    }
  }

  async getPlayerCards(gameID:string,gameOrderIndex:number){
    this.logger.log(
      `Attempting to remove card of player with order index of ${gameOrderIndex} from gameID: ${gameID}`,
    );
    const key = `games:${gameID}`;
    const playOrderIndex = gameOrderIndex;
    const playerIndex = playOrderIndex-1;
    const playersCardsPath = `.currentRound.playersCards[${playerIndex}]`;
    const playerCards = await this.redisClient.send_command(
      'JSON.GET',
      key,
      playersCardsPath,
    );
    this.logger.log(
      JSON.parse(playerCards)
    );
    return JSON.parse(playerCards) as Deck;
  }
  async removePlayerCard(card:Card,userID:string,gameID:string):Promise<void>{

    this.logger.log(
      `Attempting to remove card: ${card.rank}:${card.suit} of UserID: ${userID} from gameID: ${gameID}`,
    );
    const key = `games:${gameID}`;
    const playOrderIndex = await this.getPlayerPlayOrder(gameID,userID);
    const playerIndex = playOrderIndex-1;
    const playerCards = await this.getPlayerCards(gameID,playOrderIndex);
    const cardToBeDeletedIndex = playerCards.findIndex((cardTBD)=>{return cardTBD.rank === card.rank && cardTBD.suit === card.suit});
    const playersPath = `.currentRound.playersCards[${playerIndex}]`;
    try {
      await this.redisClient.send_command(
        'JSON.ARRPOP',
        key,
        playersPath,
        cardToBeDeletedIndex,
      );
    } catch (e) {
      this.logger.error(
        `Failed to remove player card with playerID:${userID}} to game: ${gameID}`,
      );
      throw e;
    }

  }
  async addCardToTrick(card: Card, gameID: string) {
    this.logger.log(
      `Attempting to add card: ${card.suit},${card.rank} to game: ${gameID}`,
    );
    const key = `games:${gameID}`;
    const trickPath = '.currentRound.trick';

    try {
      await this.redisClient.send_command(
        'JSON.ARRAPPEND',
        key,
        trickPath,
        JSON.stringify(card),
      );
      const updatedTrick = await this.redisClient.send_command(
        'JSON.GET',
        key,
       trickPath
      );
      return JSON.parse(updatedTrick) as Deck;
    } catch (e) {
      this.logger.error(`Failed to Add card with card to game: ${gameID}`);
      throw e;
    }
  }

  async cleanTrick(gameID: string) {
    this.logger.log(`Attempting to clean deck of game: ${gameID}`);
    const key = `games:${gameID}`;
    const trickPath = '$.currentRound.trick';

    try {
      await this.redisClient.send_command(
        'JSON.SET',
        key,
        trickPath,
        '[]',
      );
    } catch (e) {
      this.logger.error(`Attempting to clean deck of game: ${gameID} failed`);
      throw e;
    }
  }

  async cleanHandsPlayed(gameID: string) {
    this.logger.log(`Attempting to clean handsPlayed of game: ${gameID}`);
    const key = `games:${gameID}`;
    const handsPlayedPath = '$.currentRound.handsPlayed';

    try {
      await this.redisClient.send_command(
        'JSON.SET',
        key,
        handsPlayedPath,
        '[]',
      );
    } catch (e) {
      this.logger.error(`Attempting to clean handsPlayed of game: ${gameID} failed`);
      throw e;
    }
  }

  async setRoundScores (gameID,scores:number[]){
    this.logger.log(`Attempting to set round's score of game: ${gameID}`);
    const key = `games:${gameID}`;
    const roundScorePath = '$.currentRound.scores';

    try {
      await this.redisClient.send_command(
        'JSON.SET',
        key,
        roundScorePath,
        JSON.stringify(scores),
      );
      // const roundsScores = await this.redisClient.send_command(
      //   'JSON.GET',
      //   key,
      //   roundScorePath,
      // );
      // return roundsScores;
    } catch (e) {
      this.logger.error(`Attempting to set round's scores of game: ${gameID} failed`);
      throw e;
    }
  }

  async addTrickToPlayedHands (trick:Deck,gameID:string) {

    const key = `games:${gameID}`;
    const handsPlayedPath = '$.currentRound.handsPlayed';

    try {
      await this.redisClient.send_command(
        'JSON.ARRAPPEND',
        key,
        handsPlayedPath,
        JSON.stringify(trick),
      );
       const handsPlayed  = await this.redisClient.send_command(
        'JSON.GET',
        key,
        handsPlayedPath,
      );
      return JSON.parse(handsPlayed) as Game['currentRound']['handsPlayed']; 
    } catch (e) {
      this.logger.error(`Attempting to clean deck of game: ${gameID} failed`);
      throw e;
    }
  }

  async addRoundsScoreToPlayedRounds(gameID:string){

    const key = `games:${gameID}`;
    const roundsPlayedPath = '$.roundsPlayed';
    const roundsScorePath = '$.currentRound.scores';
    try {
      const roundsScore = await this.redisClient.send_command(
        'JSON.GET',
        key,
        roundsScorePath,
      );
      await this.redisClient.send_command(
        'JSON.ARRAPPEND',
        key,
        roundsPlayedPath,
        roundsScore,
      );
      const roundsPlayed = await this.redisClient.send_command(
        'JSON.GET',
        key,
        roundsPlayedPath,
      );
      return JSON.parse(roundsPlayed) as Game['roundsPlayed'];
  }catch (e) {
    this.logger.error(`Attempting to clean deck of game: ${gameID} failed`);
    throw e;
  }}
}
