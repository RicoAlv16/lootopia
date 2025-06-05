import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginPostDto } from 'src/shared/dto/login-post.dto';
import { LoginRespDto } from 'src/shared/dto/login-resp.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      VerifyCredentials: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('VerifyCredentials', () => {
    it('should call authService.VerifyCredentials with correct parameters', async () => {
      // Arrange
      const loginData: LoginPostDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      authService.VerifyCredentials.mockResolvedValue(true);

      // Act
      const result = await controller.VerifyCredentials(loginData);

      // Assert
      expect(authService.VerifyCredentials).toHaveBeenCalledWith(loginData);
      expect(authService.VerifyCredentials).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it('should return false when credentials are invalid', async () => {
      // Arrange
      const loginData: LoginPostDto = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      };
      authService.VerifyCredentials.mockResolvedValue(false);

      // Act
      const result = await controller.VerifyCredentials(loginData);

      // Assert
      expect(result).toBe(false);
    });

    it('should propagate errors from authService', async () => {
      // Arrange
      const loginData: LoginPostDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const error = new Error('Service error');
      authService.VerifyCredentials.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.VerifyCredentials(loginData)).rejects.toThrow(
        'Service error',
      );
    });
  });

  describe('login', () => {
    it('should call authService.login with correct OTP code', async () => {
      // Arrange
      const otpData = { codeOPT: '123456' };
      const expectedResponse: LoginRespDto = {
        id: 1,
        access_token: 'jwt-token',
        nickname: 'testuser',
        email: 'test@example.com',
        roles: ['user'],
      };
      authService.login.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.login(otpData);

      // Assert
      expect(authService.login).toHaveBeenCalledWith('123456');
      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResponse);
    });

    it('should propagate errors from authService during login', async () => {
      // Arrange
      const otpData = { codeOPT: '123456' };
      const error = new Error('Invalid OTP');
      authService.login.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.login(otpData)).rejects.toThrow('Invalid OTP');
    });
  });
});
