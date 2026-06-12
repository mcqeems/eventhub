import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Partial<AuthService>;

  beforeEach(async () => {
    authService = {
      signIn: jest.fn().mockResolvedValue({ status: 200, message: 'OK', data: { accessToken: 'token' } }),
      signUp: jest.fn().mockResolvedValue({ status: 200, message: 'OK', data: {} }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call authService.signIn', async () => {
    const mockRes = {} as Response;
    const mockDto = { username: 'john', password: 'pw' };
    const result = await controller.signIn(mockDto, mockRes);
    expect(authService.signIn).toHaveBeenCalledWith(mockDto, mockRes);
    expect(result.status).toBe(200);
  });

  it('should call authService.signUp', async () => {
    const mockDto = { username: 'john', password: 'pw', secretKey: 'key' };
    const result = await controller.signUp(mockDto);
    expect(authService.signUp).toHaveBeenCalledWith(mockDto);
    expect(result.status).toBe(200);
  });
});
