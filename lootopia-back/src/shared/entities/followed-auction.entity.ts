import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UsersEntity } from './users.entity';
import { Auction } from './auction.entity';

@Entity('followed_auction')
export class FollowedAuction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersEntity, user => user.followedAuctions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_user' })
  user: UsersEntity;

  @ManyToOne(() => Auction, auction => auction.followers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_auction' })
  auction: Auction;
}