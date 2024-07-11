import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GamesController } from "./games.controller";
import { GamesService } from "./games.service";
import { redisModule } from "src/modules.config";
import { GamesRepository } from "./games.repository";

@Module({
  imports: [ConfigModule,redisModule],
  controllers: [GamesController],
  providers: [GamesService,GamesRepository],
  exports: []
})
export class GamesModule {

}
