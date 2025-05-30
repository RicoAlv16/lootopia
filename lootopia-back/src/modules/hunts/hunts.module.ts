import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HuntsService } from './hunts.service';
import { HuntsController } from './hunts.controller';
import { Hunt } from '../../shared/entities/hunt.entity';
import { UsersEntity } from '../../shared/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hunt, UsersEntity])],
  controllers: [HuntsController],
  providers: [HuntsService],
  exports: [HuntsService],
})
export class HuntsModule {}
