import { Logger } from "@nestjs/common";
import { OnGatewayInit, WebSocketGateway } from "@nestjs/websockets";
import { GamesService } from "./games.service";



@WebSocketGateway({
    namespace:'games'
})
export class GamesGateway implements OnGatewayInit {
    private readonly logger = new Logger(GamesGateway.name);
    constructor(private readonly gamesService:GamesService){};

    afterInit(server: any): void {
        this.logger.log('WebSocket Gateway Intialized')
        
    }
}