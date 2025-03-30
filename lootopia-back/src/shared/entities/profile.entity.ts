import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity('Profiles')
export class ProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  compte: string;

  @Column({ default: '' })
  telephone: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  photo: string;

  @Column({ default: false })
  acceptMFA: boolean;

  @Column({ default: false })
  compteOff: boolean;

  @Column({ default: '' })
  token: string;

  @Column({ type: 'timestamp', default: null })
  expiresAt: Date;

  @Column({ default: '' })
  codeOPT: string;

  @Column({ type: 'timestamp', default: null })
  expiredOPT: Date;

  @Column({ type: 'int', default: 0 })
  balance: number;

  @ManyToOne(() => UsersEntity)
  user: UsersEntity;
}
