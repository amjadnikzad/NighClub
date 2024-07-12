import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from './redis.module';
import { JwtModule } from '@nestjs/jwt';

export const jwtModule = JwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (ConfigService:ConfigService) => ({
    secret: ConfigService.get<string>('JWT_SECRET'),
    signOptions: {
      expiresIn: ConfigService.get<string>('GAME_DURATION')
    },
  }),
  inject:[ConfigService],
  
})
export const redisModule = RedisModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const logger = new Logger('RedisModule');

    return {
      connectionOptions: {
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      },
      onClientReady: (client) => {
        logger.log('Redis Client Is Ready');

        client.on('error', (err) => {
          logger.error('Redis Client Error: ', err);
        });

        client.on('connect', () => {
          logger.log(
            `Connected to redis on ${client.options.host}:${client.options.port}`,
          );
        });
      },
    };
  },
  inject: [ConfigService]
});
