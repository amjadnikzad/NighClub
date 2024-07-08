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
import { CreateHeartsDto } from './dtos';


@Controller('games')
export class GamessController {
  

  @Post('/hearts')
  create(@Body() createHeartsDto: CreateHeartsDto) {
    Logger.log('New Game Created');
    return createHeartsDto
  }

  
}
