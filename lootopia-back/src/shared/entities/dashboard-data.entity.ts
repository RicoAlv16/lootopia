import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity('DashboardData')
export class DashboardDataEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Stats rapides
  @Column({ default: 0 })
  completedHunts: number;

  @Column({ default: 100 })
  huntsGoal: number;

  @Column({ default: 0 })
  artifactsCount: number;

  @Column({ default: 150 })
  totalArtifacts: number;

  @Column({ default: 'Débutant' })
  ranking: string;

  @Column({ default: 0 })
  crowns: number;

  // Données JSON pour les structures complexes
  @Column({ type: 'json', nullable: true })
  recentActivities: any[];

  @Column({ type: 'json', nullable: true })
  progressionData: any;

  @Column({ type: 'json', nullable: true })
  artifactsList: any[];

  @Column({ type: 'json', nullable: true })
  activeHunts: any[];

  @Column({ type: 'json', nullable: true })
  badges: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UsersEntity)
  user: UsersEntity;
}
