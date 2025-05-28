import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

import { UsersEntity } from './shared/entities/users.entity';
import { Auction } from './shared/entities/auction.entity';
import { Bid } from './shared/entities/bid.entity';
import { Artefact } from './shared/entities/artefact.entity';
import { RolesEntity } from './shared/entities/roles.entity';
import { PermissionsEntity } from './shared/entities/permissions.entity';
import { ProfileEntity } from './shared/entities/profile.entity';
import { LootTable } from './shared/entities/loot-table.entity';
import { FollowedAuction } from './shared/entities/followed-auction.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: false,
  logging: true,
  entities: [
    UsersEntity,
    Auction,
    Bid,
    Artefact,
    RolesEntity,
    PermissionsEntity,
    ProfileEntity,
    LootTable,
    FollowedAuction,

  ],
  migrations: ['src/migrations/*.ts'],
});
