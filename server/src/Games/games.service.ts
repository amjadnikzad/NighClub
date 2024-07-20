import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createGameID, createUserID } from 'src/IDs';
import { CreateGameFields, JoinGameFields } from './types';
import { GamesRepository } from './games.repository';

@Injectable()
export class GamesService {
  private readonly logger = new Logger(GamesService.name);
  constructor(
    private readonly gamesRepository: GamesRepository,
    private readonly jwtService: JwtService,
  ) {}
  async createGame(fields: CreateGameFields) {
    const gameID = createGameID();
    const userID = createUserID();
    
    const cretatedGame = await this.gamesRepository.createGame({
      ...fields,
      gameID,
      userID,
    });

    this.logger.debug(`Creating token String for gameID: ${cretatedGame.gameID} and useID: ${userID}`);

    const signedString = this.jwtService.sign(
      {
        gameID: cretatedGame.gameID,
        name: fields.name
      },{
        subject:userID
      }
    );
    return {
      game: cretatedGame,
      accessToken: signedString
    };
  }

  async getGameToken(fields: JoinGameFields) {
    const userID = createUserID();
    this.logger.debug(
      `Fetching game with ID:${fields.gameID} for user with id:${userID}`,
    );
    const joinedGame = await this.gamesRepository.getGame(fields.gameID);
    const signedString = this.jwtService.sign(
      {
        gameID: joinedGame.gameID,
        name: fields.name
      },{
        subject:userID
      }
    );
    return {
      newPlayer: joinedGame.players,
      accessToken: signedString
    };
  }

  async getGameState(gameID:string) {
    const gameState = await this.gamesRepository.getGameState(gameID);
    return gameState;
  }
}
