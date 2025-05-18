import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { RolesEntity } from './roles.entity';

@Entity('PermissionsGet')
export class PermissionsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  permission: string;

  @Column({ default: '' })
  description: string;

  @ManyToMany(() => RolesEntity, (role) => role.permissions)
  role: RolesEntity[];
}
