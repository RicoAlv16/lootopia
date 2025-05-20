import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginPostDto } from 'src/shared/dto/login-post.dto';
import { LoginRespDto } from 'src/shared/dto/login-resp.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Post('/Verify-credentials')
  async VerifyCredentials(@Body() verifData: LoginPostDto): Promise<boolean> {
    this.logger.verbose(
      `credentials verification and OPT code sending: ${JSON.stringify(verifData)}`,
    );
    return this.authService.VerifyCredentials(verifData);
  }

  @Post('/login')
  async login(@Body() data: { codeOPT: string }): Promise<LoginRespDto> {
    this.logger.verbose(
      `Login and OPT code verifying: ${JSON.stringify(data.codeOPT)}`,
    );
    return this.authService.login(data.codeOPT);
  }
}
