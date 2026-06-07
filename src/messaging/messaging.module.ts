import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { VehiclePublisher } from './publishers/vehicles.publiser';

@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        exchanges: [
          {
            name: 'fleet_exchange',
            type: 'topic',
          },
        ],
        uri:
          config.get<string>('RABBITMQ_URL') ??
          'amqp://guest:guest@localhost:5672',
        connectionInitOptions: { wait: false },
      }),
    }),
  ],
  providers: [VehiclePublisher],
  exports: [VehiclePublisher],
})
export class MessagingModule {}
