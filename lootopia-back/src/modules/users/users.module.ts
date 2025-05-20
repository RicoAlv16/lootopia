import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersEntity } from 'src/shared/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { RolesModule } from '../roles/roles.module';
import { ProfileEntity } from 'src/shared/entities/profile.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity, ProfileEntity]),
    RolesModule, // Pour avoir accès au RolesService
    MailModule, // Pour avoir accès au MailService
  ],
  exports: [UsersService],
  providers: [UsersService, UserRepository],
  controllers: [UsersController],
})
export class UsersModule {}
