import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity('artefacts')
export class Artefact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string; // URL de l’image de l’artefact

  @Column({ default: false })
  isInAuction: boolean; // Pour savoir si déjà listé

  @ManyToOne(() => UsersEntity, user => user.id, { nullable: false, onDelete: 'CASCADE' })
  owner: UsersEntity;
}