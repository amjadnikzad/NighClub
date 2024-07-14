import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { SocketWithAuth } from 'src/Games/types';
import { WsBadRequestException, WsUnknowntException } from './ws-exceptions';

@Catch()
export class WsCathAllFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const socket: SocketWithAuth = host.switchToWs().getClient();

    if (exception instanceof BadRequestException) {
      const exceptionData = exception.getResponse();
      const exceptionMessage = exceptionData['message'] ?? exceptionData ?? exception.name;
      const wsException = new WsBadRequestException(exceptionMessage);
      socket.emit('exception', wsException.getError());
      return;
    }

    const wsException = new WsUnknowntException(exception.message);
    socket.emit('exception', wsException.getError());
  }
}
