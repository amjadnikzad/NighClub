import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createGameID, createUserID } from 'src/IDs';
import { AddPlayerFields, CreateGameFields, JoinGameFields, PlayCardFields, RemovePlayerFields } from './types';
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

  async getGamePublicData(gameID:string) {
    const gamePublicData = await this.gamesRepository.getGamePubiclDate(gameID);
    return gamePublicData;
  }

  async addPlayer(addPlayer:AddPlayerFields) {
    const {gameID,userID} = addPlayer;
    const players = await this.gamesRepository.addPlayer(addPlayer);
    if(players.length === 4) await this.gamesRepository.setGameState({gameID,state:"ON_PROGRESS"});
    return await this.gamesRepository.getPlayerSpecificData({gameID,userID});
  }
  
  async removePlayer(removePlayer:RemovePlayerFields){
    const game = await this.gamesRepository.removePlayer(removePlayer);
    const gameID = removePlayer.gameID;
    await this.gamesRepository.setGameState({gameID,state:'WFPTJ'});
    return  game.players;
  }

  async playCard(playCard:PlayCardFields) {
    const {card,gameID,userID} = playCard;
    const trick = await this.gamesRepository.addCardToTrick(card,gameID);
    if(trick.length === 4){
      await this.gamesRepository.addTrickToPlayedHands(trick,gameID);
      await this.gamesRepository.cleanTrick(gameID);
    }
  }
}
