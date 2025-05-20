import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/shared/dto/create-user.dto';
import { UsersEntity } from 'src/shared/entities/users.entity';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}
  @Post('/sigin')
  async createUser(@Body() userData: CreateUserDto): Promise<UsersEntity> {
    this.logger.verbose(`Creating user: ${JSON.stringify(userData)}`);
    return await this.usersService.creatUser(userData);
  }

  @Get()
  async getAllUsers(): Promise<UsersEntity[]> {
    return await this.usersService.getAllUsers();
  }
}
