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
    Logger.log('New Game Created');
    const result = await this.gamesService.createGame(createGamesDto)
  }

  @Post('/join')
  async join(@Body() joinGameDto: JoinGameDto) {
    Logger.log('Join request submitted');
    const result = await this.gamesService.joinGame(joinGameDto)
  }
  
}
