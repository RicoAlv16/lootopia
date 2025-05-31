import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { UsersEntity } from './users.entity';
import { Hunt } from './hunt.entity';

@Entity('hunt_participations')
export class HuntParticipation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'userId' })
  user: UsersEntity;

  @Column()
  userId: number;

  @ManyToOne(() => Hunt)
  @JoinColumn({ name: 'huntId' })
  hunt: Hunt;

  @Column()
  huntId: string;

  @Column({ default: 'active' })
  status: 'active' | 'completed' | 'abandoned';

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ default: 0 })
  score: number;

  @CreateDateColumn()
  joinedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
