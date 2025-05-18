import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { RolesEntity } from './roles.entity';

@Entity('UsersGet')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  email: string;

  @Column({ default: '' })
  password: string;

  @ManyToMany(() => RolesEntity, (role) => role.user)
  roles: RolesEntity[];
}
