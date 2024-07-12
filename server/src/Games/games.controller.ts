import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Logger
} from '@nestjs/common';
import { CreateGameDto,JoinGameDto } from './dtos';
import { GamesService } from './games.service';


@Controller('games')
export class GamesController {
  
  constructor (private gamesService: GamesService){}

  @Post('/create')
  async create(@Body() createGamesDto: CreateGameDto) {
   
    const result = await this.gamesService.createGame(createGamesDto);
    
    return result;
  }

  @Post('/join')
  async join(@Body() joinGameDto: JoinGameDto) {
    Logger.log('Join request submitted');
    const result = await this.gamesService.joinGame(joinGameDto);
    return result;
  }
  
}
