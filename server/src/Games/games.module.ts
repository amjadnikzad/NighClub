import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GamesController } from "./games.controller";
import { GamesService } from "./games.service";
import { jwtModule, redisModule } from "src/modules.config";
import { GamesRepository } from "./games.repository";
import { GamesGateway } from "./games.gateway";

@Module({
  imports: [ConfigModule,redisModule,jwtModule],
  controllers: [GamesController],
  providers: [GamesService,GamesRepository,GamesGateway],
  exports: []
})
export class GamesModule {

}
