import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: Partial<UsersService>;

  beforeEach(async () => {
    usersService = {
      findOneById: jest.fn().mockResolvedValue({ id: 1, username: 'test' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersService },
      ],
    })
    .overrideGuard(AuthGuard)
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should call findOneById with req.user.sub', async () => {
    const mockReq = { user: { sub: 1 } };
    const result = await controller.getProfile(mockReq);
    expect(usersService.findOneById).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1, username: 'test' });
  });
});
