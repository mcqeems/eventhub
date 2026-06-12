import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: Partial<JwtService>;

  beforeEach(() => {
    jwtService = {
      verifyAsync: jest.fn(),
    };
    guard = new AuthGuard(jwtService as JwtService);
  });

  const mockExecutionContext = (headers: any, cookies: any) => {
    const req = { headers, cookies };
    return {
      switchToHttp: () => ({
        getRequest: () => req,
      }),
    } as unknown as ExecutionContext;
  };

  it('should return true if token is valid from cookie', async () => {
    (jwtService.verifyAsync as jest.Mock).mockResolvedValue({ sub: 1 });
    const ctx = mockExecutionContext({}, { access_token: 'valid_token' });
    
    expect(await guard.canActivate(ctx)).toBe(true);
    expect(ctx.switchToHttp().getRequest()['user']).toEqual({ sub: 1 });
  });

  it('should return true if token is valid from header', async () => {
    (jwtService.verifyAsync as jest.Mock).mockResolvedValue({ sub: 1 });
    const ctx = mockExecutionContext({ authorization: 'Bearer valid_token' }, {});
    
    expect(await guard.canActivate(ctx)).toBe(true);
  });

  it('should throw UnauthorizedException if no token is provided', async () => {
    const ctx = mockExecutionContext({}, {});
    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if token verification fails', async () => {
    (jwtService.verifyAsync as jest.Mock).mockRejectedValue(new Error('Invalid token'));
    const ctx = mockExecutionContext({}, { access_token: 'invalid_token' });
    
    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
  });
});
