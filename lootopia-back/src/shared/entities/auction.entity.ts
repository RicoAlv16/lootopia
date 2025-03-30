import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { UsersEntity } from './users.entity';
import { Artefact } from './artefact.entity';
import { Bid } from './bid.entity';

@Entity()
export class Auction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Artefact, { eager: true })
  artefact: Artefact;

  @ManyToOne(() => UsersEntity)
  seller: UsersEntity;

  @Column()
  startingPrice: number;

  @Column({ default: 0 })
  currentBid: number;

  @ManyToOne(() => UsersEntity, { nullable: true })
  currentBidder: UsersEntity;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({ default: 'active' })
  status: 'active' | 'completed' | 'cancelled';

  @OneToMany(() => Bid, bid => bid.auction)
  bids: Bid[];
}