import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GamesService } from './games.service';
import { Namespace, Socket } from 'socket.io';
import { SocketWithAuth } from './types';
import { WsBadRequestException } from 'src/Exception/ws-exceptions';
import { WsCathAllFilter } from 'src/Exception/ws-catch-all-filter';

@UsePipes(new ValidationPipe())
@UseFilters(new WsCathAllFilter())
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

  handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets;

    this.logger.debug(`socket connected with userID: ${client.userID}, name: ${client.name}, gameID:${client.gameID}`)
    this.logger.debug(`There Are ${sockets.size} clients connected`);
  }

  handleDisconnect(client: SocketWithAuth) {
    const sockets = this.io.sockets;

    this.logger.debug(`socket disconnected with userID: ${client.userID}, name: ${client.name}, gameID:${client.gameID}`)
    this.logger.debug(`There Are ${sockets.size} clients connected`);
  }

  @SubscribeMessage('test')
  async test() {
    throw new WsBadRequestException('Your Reques Is Unautorized');
  }
}
