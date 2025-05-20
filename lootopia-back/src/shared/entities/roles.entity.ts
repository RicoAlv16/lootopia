import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UsersEntity } from './users.entity';
import { PermissionsEntity } from './permissions.entity';

@Entity('Roles')
export class RolesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  role: string;

  @Column({ default: '' })
  description: string;

  @ManyToMany(() => UsersEntity, (user) => user.roles)
  @JoinTable()
  user: UsersEntity[];

  @ManyToMany(() => PermissionsEntity, (permission) => permission.role)
  @JoinTable()
  permissions: PermissionsEntity[];
}
