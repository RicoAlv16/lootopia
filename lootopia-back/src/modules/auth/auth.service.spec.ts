import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { ProfileService } from '../profile/profile.service';
import { SmsService } from '../sms/sms.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProfileEntity } from 'src/shared/entities/profile.entity';
import { Repository } from 'typeorm';
import { HttpException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginPostDto } from 'src/shared/dto/login-post.dto';
import { UsersEntity } from 'src/shared/entities/users.entity';

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: jest.Mocked<JwtService>;
  let mailService: jest.Mocked<MailService>;
  let profileService: jest.Mocked<ProfileService>;
  let smsService: jest.Mocked<SmsService>;
  let profileRepository: jest.Mocked<Repository<ProfileEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            getUserByMail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendOPTCode: jest.fn(),
          },
        },
        {
          provide: ProfileService,
          useValue: {
            findprofileByUser: jest.fn(),
          },
        },
        {
          provide: SmsService,
          useValue: {
            sendVerificationSMS: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ProfileEntity),
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    mailService = module.get(MailService);
    profileService = module.get(ProfileService);
    smsService = module.get(SmsService);
    profileRepository = module.get(getRepositoryToken(ProfileEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('VerifyCredentials', () => {
    const mockLoginData: LoginPostDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    // Mock complet de UsersEntity
    const mockUser: Partial<UsersEntity> = {
      id: 1,
      nickname: 'testuser',
      email: 'test@example.com',
      password: 'hashedPassword',
      isVerified: true,
      roles: [],
      profile: [],
      huntParticipations: [],
    };

    // Mock complet de ProfileEntity
    const mockProfile: Partial<ProfileEntity> = {
      id: 1,
      compte: 'particulier',
      telephone: '+33123456789',
      bio: '',
      photo: '',
      acceptMFA: true,
      compteOff: false,
      token: '',
      expiresAt: null,
      codeOPT: '',
      expiredOPT: null,
      user: mockUser as UsersEntity,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return true when credentials are valid and user is verified', async () => {
      // Arrange
      usersService.getUserByMail.mockResolvedValue(mockUser as UsersEntity);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      profileService.findprofileByUser.mockResolvedValue(
        mockProfile as ProfileEntity,
      );
      profileRepository.save.mockResolvedValue(mockProfile as ProfileEntity);
      mailService.sendOPTCode.mockResolvedValue(undefined); // sendOPTCode retourne void
      smsService.sendVerificationSMS.mockResolvedValue(undefined);

      // Act
      const result = await service.VerifyCredentials(mockLoginData);

      // Assert
      expect(result).toBe(true);
      expect(usersService.getUserByMail).toHaveBeenCalledWith(
        mockLoginData.email,
      );
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        mockLoginData.password,
        mockUser.password,
      );
      expect(profileService.findprofileByUser).toHaveBeenCalledWith(
        mockUser.email,
      );
    });

    it('should throw HttpException when user is not verified', async () => {
      // Arrange
      const unverifiedUser: Partial<UsersEntity> = {
        ...mockUser,
        isVerified: false,
      };
      usersService.getUserByMail.mockResolvedValue(
        unverifiedUser as UsersEntity,
      );

      // Act & Assert
      await expect(service.VerifyCredentials(mockLoginData)).rejects.toThrow(
        new HttpException(
          "Veuillez vérifier votre compte avant d'accéder à la plateforme",
          403,
        ),
      );
      expect(usersService.getUserByMail).toHaveBeenCalledWith(
        mockLoginData.email,
      );
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      // Arrange
      usersService.getUserByMail.mockResolvedValue(mockUser as UsersEntity);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      // Act & Assert
      await expect(service.VerifyCredentials(mockLoginData)).rejects.toThrow(
        new UnauthorizedException('Identifiants incorrectes'),
      );
      expect(usersService.getUserByMail).toHaveBeenCalledWith(
        mockLoginData.email,
      );
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        mockLoginData.password,
        mockUser.password,
      );
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      // Arrange
      usersService.getUserByMail.mockResolvedValue(null);

      // Act & Assert
      await expect(service.VerifyCredentials(mockLoginData)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.getUserByMail).toHaveBeenCalledWith(
        mockLoginData.email,
      );
    });

    it('should throw UnauthorizedException when sendOTPCode fails', async () => {
      // Arrange
      usersService.getUserByMail.mockResolvedValue(mockUser as UsersEntity);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      profileService.findprofileByUser.mockRejectedValue(
        new Error('Profile not found'),
      );

      // Act & Assert
      await expect(service.VerifyCredentials(mockLoginData)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.getUserByMail).toHaveBeenCalledWith(
        mockLoginData.email,
      );
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        mockLoginData.password,
        mockUser.password,
      );
    });

    it('should handle errors from getUserByMail', async () => {
      // Arrange
      usersService.getUserByMail.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.VerifyCredentials(mockLoginData)).rejects.toThrow(
        new UnauthorizedException('Database error'),
      );
      expect(usersService.getUserByMail).toHaveBeenCalledWith(
        mockLoginData.email,
      );
    });
  });
});
