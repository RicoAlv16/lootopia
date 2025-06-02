import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UsersEntity } from './users.entity';
import { LootTable } from './loot-table.entity';

@Entity('artefacts')
export class Artefact {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => LootTable, { eager: true, nullable: false })
  loot: LootTable;

  @ManyToOne(() => UsersEntity, user => user.id, { nullable: false, onDelete: 'CASCADE' })
  owner: UsersEntity;

  @Column({ default: false })
  isInAuction: boolean;
}
