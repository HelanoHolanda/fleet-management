import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

export interface VehicleEvent {
  event: 'vehicle.created' | 'vehicle.updated' | 'vehicle.deleted';
  vehicleId: string;
  userId: string;
  timestamp: Date;
  data?: unknown;
}

@Injectable()
export class VehiclePublisher {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publish(event: VehicleEvent): Promise<void> {
    await this.amqpConnection.publish('fleet_exchange', event.event, event);
  }
}
