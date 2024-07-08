import { Injectable } from '@nestjs/common';
import { createGameID, createUserID } from 'src/IDs';
import { CreateGameFields, JoinGameFields } from './types';

@Injectable()
export class GamesService {
    async createGame (fields: CreateGameFields) {
        const gameID = createGameID();
        const userID = createUserID();
        return { ...fields,
            gameID,
            userID
        }
    };

    async joinGame(fields: JoinGameFields){
        const userID = createUserID();
        return { ...fields,
            userID
        }
    }
}
