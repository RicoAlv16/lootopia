import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UsersEntity } from './users.entity';
import { Artefact } from './artefact.entity';
import { Bid } from './bid.entity';
import { FollowedAuction } from './followed-auction.entity';

@Entity()
export class Auction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Artefact, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  artefact: Artefact;

  @ManyToOne(() => UsersEntity)
  @JoinColumn()
  seller: UsersEntity;

  @Column()
  startingPrice: number;

  @Column({ default: 0 })
  currentBid: number;

  @ManyToOne(() => UsersEntity, { nullable: true })
  @JoinColumn()
  currentBidder: UsersEntity;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({ default: 'active' })
  status: 'active' | 'completed' | 'cancelled';

  @OneToMany(() => Bid, bid => bid.auction)
  bids: Bid[];

  @OneToMany(() => FollowedAuction, follow => follow.auction)
  followers: FollowedAuction[];
}