import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('loot_table')
export class LootTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: 'Commun' })
  rarity: 'Commun' | 'Rare' | 'Épique' | 'Légendaire';
}
