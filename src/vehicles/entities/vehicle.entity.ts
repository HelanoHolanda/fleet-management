import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Model } from '../../models/entities/model.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'license_plate', length: 10, unique: true })
  licensePlate!: string;

  @Column({ length: 17, unique: true })
  chassis!: string;

  @Column({ length: 11, unique: true })
  renavam!: string;

  @Column({ type: 'int' })
  year!: number;

  @Column({ name: 'model_id', type: 'uniqueidentifier' })
  modelId!: string;

  @ManyToOne(() => Model)
  @JoinColumn({ name: 'model_id' })
  model!: Model;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'created_by', type: 'uniqueidentifier', nullable: true })
  createdBy!: string | null;
}
