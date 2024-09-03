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

  async handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets;

    const roomName = client.gameID;
    await client.join(roomName);
    const { gameID, userID,name } = client;
    const initialData = await this.gamesService.addPlayer(
      {gameID,
      userID,
      name}
    );
    const pubilcData = await this.gamesService.getGamePublicData(gameID);

    this.logger.debug(`socket connected with userID: ${client.userID}, name: ${client.name}, gameID:${client.gameID}`)
    this.logger.debug(`There Are ${sockets.size} clients connected`);

    this.io.to(client.id).emit('initial_data',initialData);
    this.io.to(roomName).emit('game_updated', pubilcData);
    if (initialData.players.length === 4) this.io.to(roomName).emit('gameState_updated', 'ON_PROGRESS');
  }

  handleDisconnect(client: SocketWithAuth) {
    const sockets = this.io.sockets;

    const roomName = client.gameID;
    const { gameID, userID, } = client;
    const players = this.gamesService.removePlayer({gameID,userID});
    this.logger.debug(`socket disconnected with userID: ${client.userID}, name: ${client.name}, gameID:${client.gameID}`)
    this.logger.debug(`There Are ${sockets.size} clients connected`);
    this.io.to(roomName).emit('gameState_updated', 'WFPTJ');
  }

  @SubscribeMessage('test')
  async test() {
    throw new WsBadRequestException('Your Request Is Unautorized');
  }
}
