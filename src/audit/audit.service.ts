import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';
import { VehicleEvent } from 'src/messaging/publishers/vehicles.publiser';

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLogDocument>,
  ) {}

  async log(event: VehicleEvent): Promise<void> {
    await this.auditLogModel.create({
      event: event.event,
      entityId: event.vehicleId,
      userId: event.userId,
      data: event.data,
      timestamp: event.timestamp,
    });
  }
}
