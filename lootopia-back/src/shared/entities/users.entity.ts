import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { RolesEntity } from './roles.entity';
import { ProfileEntity } from './profile.entity';
import { FollowedAuction } from './followed-auction.entity';
import { HuntParticipation } from './hunt-participation.entity';

@Entity('Users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  nickname: string;

  @Column({ default: '' })
  email: string;

  @Column({ default: '' })
  password: string;

  @Column({ default: false })
  isVerified: boolean;

  @ManyToMany(() => RolesEntity, (role) => role.user)
  roles: RolesEntity[];

  @OneToMany(() => ProfileEntity, (profile) => profile.user)
  profile: ProfileEntity[];

  @OneToMany(() => FollowedAuction, follow => follow.user)
  followedAuctions: FollowedAuction[];

  @OneToMany(() => HuntParticipation, (participation) => participation.user)
  huntParticipations: HuntParticipation[];
}
