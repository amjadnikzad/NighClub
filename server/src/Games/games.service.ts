import { Injectable, Logger } from '@nestjs/common';
import { createGameID, createUserID } from 'src/IDs';
import { CreateGameFields, JoinGameFields } from './types';
import { GamesRepository } from './games.repository';

@Injectable()
export class GamesService {
    private readonly logger = new Logger(GamesService.name);
    constructor (private readonly gamesRepository: GamesRepository){};
    async createGame (fields: CreateGameFields) {
        const gameID = createGameID();
        const userID = createUserID();
        try {
            this.logger.log('mission done');
           const cretatedGame = await this.gamesRepository.createGame({...fields,gameID,userID});
        return {
            game:cretatedGame,
        } 
        }catch(e) {
            this.logger.error(e);
        }
        
    };

    async joinGame(fields: JoinGameFields){
        const userID = createUserID();
        this.logger.debug(`Fetching game with ID:${fields.gameID} for user with id:${userID}`);
        const joinedGame = this.gamesRepository.getGame(fields.gameID);
        return { 
            newPlayer: joinedGame,
        }
    }
}
