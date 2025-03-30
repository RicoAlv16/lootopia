import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Auction } from './auction.entity';
import { UsersEntity } from './users.entity';

@Entity()
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Auction, auction => auction.bids)
  auction: Auction;

  @ManyToOne(() => UsersEntity)
  bidder: UsersEntity;

  @Column()
  amount: number;

  @Column()
  timestamp: Date;
}
