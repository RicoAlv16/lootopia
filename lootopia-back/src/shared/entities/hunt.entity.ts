import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UsersEntity } from './users.entity';
import { HuntParticipation } from './hunt-participation.entity';

@Entity('hunts')
export class Hunt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  duration: number;

  @Column()
  worldType: string;

  @Column()
  mode: string;

  @Column()
  maxParticipants: number;

  @Column({ default: 0 })
  participationFee: number;

  @Column({ default: true })
  chatEnabled: boolean;

  @Column({ default: false })
  interactiveMap: boolean;

  @Column('json')
  mapConfig: {
    name: string;
    skin: string;
    zone: string;
    scale: number;
  };

  @Column('json')
  steps: Array<{
    riddle: string;
    validationType: string;
    answer: string;
    hasMap: boolean;
  }>;

  @Column('json')
  landmarks: Array<{
    name: string;
    latitude: number;
    longitude: number;
    description: string;
  }>;

  @Column('json')
  rewards: {
    first: number;
    second: number;
    third: number;
  };

  @Column({ default: 5 })
  searchDelay: number;

  @Column({ default: 0 })
  searchCost: number;

  @Column({ default: 'draft' })
  status: 'active' | 'draft' | 'private' | 'completed';

  @Column({ default: 0 })
  participants: number;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'userId' })
  user: UsersEntity;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => HuntParticipation, (participation) => participation.hunt)
  participations: HuntParticipation[];
}
