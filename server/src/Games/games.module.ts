import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GamesController } from "./games.controller";
import { GamesService } from "./games.service";

@Module({
  imports: [ConfigModule],
  controllers: [GamesController],
  providers: [GamesService],
  exports: []
})
export class GamesModule {

}
