import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GamesController } from "./games.controller";
import { GamesService } from "./games.service";
import { redisModule } from "src/modules.config";

@Module({
  imports: [ConfigModule,redisModule],
  controllers: [GamesController],
  providers: [GamesService],
  exports: []
})
export class GamesModule {

}
