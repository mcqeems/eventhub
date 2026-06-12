import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Partial<AuthService>;

  beforeEach(async () => {
    authService = {
      signIn: jest
        .fn()
        .mockResolvedValue({
          status: 200,
          message: 'OK',
          data: { accessToken: 'token' },
        }),
      signUp: jest
        .fn()
        .mockResolvedValue({ status: 200, message: 'OK', data: {} }),
      signOut: jest
        .fn()
        .mockResolvedValue({ status: 200, message: 'User successfully signed out.' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    })
    .overrideGuard(AuthGuard)
    .useValue({ canActivate: (ctx: ExecutionContext) => true })
    .compile();

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

  it('should call authService.signOut', async () => {
    const mockRes = {} as Response;
    const result = await controller.signOut(mockRes);
    expect(authService.signOut).toHaveBeenCalledWith(mockRes);
    expect(result.status).toBe(200);
  });
});
