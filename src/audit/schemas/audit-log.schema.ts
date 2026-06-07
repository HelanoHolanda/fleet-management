import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ collection: 'audit_logs', timestamps: true })
export class AuditLog {
  @Prop({ required: true })
  event!: string;

  @Prop({ required: true })
  entityId!: string;

  @Prop({ required: true })
  userId!: string;

  @Prop({ type: Object })
  data?: unknown;

  @Prop({ required: true })
  timestamp!: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
