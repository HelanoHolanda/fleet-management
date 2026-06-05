import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 50, unique: true })
  nickname!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy!: string | null;
}
