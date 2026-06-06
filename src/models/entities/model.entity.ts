import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { Brand } from '../../brands/entities/brand.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('models')
export class Model {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100, unique: true })
  name!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'created_by', type: 'uniqueidentifier', nullable: true })
  createdBy!: string | null;

  @Column({ name: 'brand_id', type: 'uniqueidentifier', nullable: true })
  brandId?: string | null;

  @ManyToOne(() => Brand, (brand) => brand.models, { nullable: true })
  @JoinColumn({ name: 'brand_id' })
  brand?: Brand | null;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.model)
  vehicles?: Vehicle[];
}
