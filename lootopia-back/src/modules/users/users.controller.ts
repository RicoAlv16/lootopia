import { Body, Controller, Logger, Post } from '@nestjs/common';
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

  @Post('/user-by-email')
  async getUserByMail(@Body() email: string): Promise<UsersEntity> {
    this.logger.verbose(`Getting user by email: ${JSON.stringify(email)}`);
    return await this.usersService.getUserByMail(email);
  }

  @Post('/user-by-token')
  async getUserByToken(@Body() tokenData: { token: string }): Promise<boolean> {
    this.logger.verbose(`Getting user by token: ${JSON.stringify(tokenData)}`);
    return await this.usersService.verifyEmail(tokenData.token);
  }
}
