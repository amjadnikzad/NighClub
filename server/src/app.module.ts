import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GamesModule } from './Games/games.module';

@Module({
  imports: [ConfigModule.forRoot(),GamesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
