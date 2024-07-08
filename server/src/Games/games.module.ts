import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GamessController } from "./games.controller";

@Module({
  imports: [ConfigModule],
  controllers: [GamessController],
  providers: [],
  exports: []
})
export class GamesModule {

}
