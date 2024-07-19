import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Server } from 'socket.io';
import { SocketWithAuth } from './Games/types';
import { GamesService } from './Games/games.service';

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const clientPort = parseInt(this.configService.get<string>('CLIENT_PORT'));

    const cors = {
      origin: [
        `http://localhost:${clientPort}`,
        new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
      ],
    };

    this.logger.log('Configuring SocketIO server with custom CORS options', {
      cors,
    });

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
    };

    const jwtService = this.app.get(JwtService);
    const gamesService = this.app.get(GamesService);
    const server: Server = super.createIOServer(port, optionsWithCORS);
    server
      .of('games')
      .use(createTokenMiddleware(jwtService, this.logger, gamesService));

    return server;
  }
}

const createTokenMiddleware =
  (jwtService: JwtService, logger: Logger, gamesService: GamesService) =>
  async (socket: SocketWithAuth, next) => {
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];
    logger.debug(`Validating Auth token before connection: ${token}`);

    try {
      const payload = jwtService.verify(token);
      const gameState = await gamesService.getGameState(payload.gameID);
      if (gameState !== 'WFPTJ') throw new Error(`this game is  ${gameState}`);
      socket.userID = payload.sub;
      socket.gameID = payload.gameID;
      socket.name = payload.name;
      next();
    } catch(e) {
      next(new Error(e.message ?? 'ACCESS DENIED'));
    }
  };
