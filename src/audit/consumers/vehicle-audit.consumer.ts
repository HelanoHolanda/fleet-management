import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { AuditService } from '../audit.service';
import type { VehicleEvent } from '../../messaging/publishers/vehicles.publiser';

@Injectable()
export class VehicleAuditConsumer {
  private readonly logger = new Logger(VehicleAuditConsumer.name);

  constructor(private readonly auditService: AuditService) {}

  @RabbitSubscribe({
    exchange: 'fleet_exchange',
    routingKey: 'vehicle.*',
    queue: 'fleet_audit_events',
  })
  async handle(event: VehicleEvent): Promise<void> {
    await this.auditService.log(event);
    this.logger.log(
      `Auditoria salva: ${event.event} - veículo: ${event.vehicleId} - usuário: ${event.userId}`,
    );
  }
}
