import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GamesService } from './games.service';
import { Namespace, Socket } from 'socket.io';

@WebSocketGateway({
  namespace:'games',
})
export class GamesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(GamesGateway.name);
  constructor(private readonly gamesService: GamesService) {}
 @WebSocketServer() io:Namespace;

  afterInit(server: any): void {
    this.logger.log('WebSocket Gateway Intialized');
  }

  handleConnection(client: Socket) {
    const sockets = this.io.sockets;

    this.logger.log(`A client WIth ID: ${client.id} has connected`);
    this.logger.debug(`There Are ${sockets.size} clients connected`);
  }

  handleDisconnect(client: Socket) {
    const sockets = this.io.sockets;

    this.logger.log(`A client WIth ID: ${client.id} has Disconnected`);
    this.logger.debug(`There Are ${sockets.size} clients connected`);
  }
}
