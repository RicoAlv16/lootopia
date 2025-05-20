import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileEntity } from 'src/shared/entities/profile.entity';

@Controller('profile')
export class ProfileController {
  private logger = new Logger(ProfileController.name);
  constructor(private readonly profileService: ProfileService) {}

  @Post('/profile-code')
  async getProfileByCodeOPT(
    @Body() data: { codeOPT: string },
  ): Promise<ProfileEntity> {
    this.logger.verbose(`getProfileByCodeOPT: ${data.codeOPT}`);
    return this.profileService.findProfileByCodeOPT(data.codeOPT);
  }
}
