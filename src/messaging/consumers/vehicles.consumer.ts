import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import type { VehicleEvent } from '../publishers/vehicles.publiser';

@Injectable()
export class VehicleConsumer {
  private readonly logger = new Logger(VehicleConsumer.name);

  @RabbitSubscribe({
    exchange: 'fleet_exchange',
    routingKey: 'vehicle.*',
    queue: 'fleet_events',
  })
  handle(event: VehicleEvent): void {
    this.logger.log(
      `Evento recebido: ${event.event} - veículo: ${event.vehicleId}`,
    );
  }
}
