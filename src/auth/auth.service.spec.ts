import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from './hashing/hashing.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;
  let hashingService: Partial<HashingService>;

  beforeEach(async () => {
    process.env.SECRET_KEY = 'test-secret';
    usersService = {
      findOne: jest.fn(),
      createOne: jest.fn(),
    };
    jwtService = {
      signAsync: jest.fn(),
    };
    hashingService = {
      comparePassword: jest.fn(),
      hashPassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: HashingService, useValue: hashingService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('signIn', () => {
    it('should throw NotFoundException if user is not found', async () => {
      (usersService.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.signIn({ username: 'john', password: 'pw' }, {} as Response)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      (usersService.findOne as jest.Mock).mockResolvedValue({ id: 1, username: 'john', password: 'hash' });
      (hashingService.comparePassword as jest.Mock).mockResolvedValue(false);
      await expect(service.signIn({ username: 'john', password: 'pw' }, {} as Response)).rejects.toThrow(UnauthorizedException);
    });

    it('should set cookie and return token on success', async () => {
      (usersService.findOne as jest.Mock).mockResolvedValue({ id: 1, username: 'john', password: 'hash' });
      (hashingService.comparePassword as jest.Mock).mockResolvedValue(true);
      (jwtService.signAsync as jest.Mock).mockResolvedValue('jwt-token');
      
      const mockRes = { cookie: jest.fn() } as unknown as Response;
      const result = await service.signIn({ username: 'john', password: 'pw' }, mockRes);
      
      expect(mockRes.cookie).toHaveBeenCalledWith('access_token', 'jwt-token', expect.any(Object));
      expect(result.data.accessToken).toBe('jwt-token');
    });
  });

  describe('signUp', () => {
    it('should throw UnauthorizedException if secret key is wrong', async () => {
      await expect(service.signUp({ username: 'john', password: 'pw', secretKey: 'wrong' })).rejects.toThrow(UnauthorizedException);
    });

    it('should create user and return successfully', async () => {
      (hashingService.hashPassword as jest.Mock).mockResolvedValue('hash');
      (usersService.createOne as jest.Mock).mockResolvedValue({ id: 1, username: 'john' });
      
      const result = await service.signUp({ username: 'john', password: 'pw', secretKey: 'test-secret' });
      
      expect(usersService.createOne).toHaveBeenCalledWith('john', 'hash');
      expect(result.data.user.username).toBe('john');
    });
  });
});
