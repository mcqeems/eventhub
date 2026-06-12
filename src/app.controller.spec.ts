import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { Response } from 'express';

describe('AppController', () => {
  let appController: AppController;
  let usersService: Partial<UsersService>;
  let appService: Partial<AppService>;

  beforeEach(async () => {
    usersService = {
      findOne: jest.fn().mockResolvedValue({ id: 1, username: 'mustaqim' }),
    };
    appService = {
      getHello: jest.fn().mockReturnValue('index'),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: appService },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('main', () => {
    it('should render the index template with user data', async () => {
      const mockRes = {
        render: jest.fn(),
      } as unknown as Response;

      await appController.main(mockRes);

      expect(usersService.findOne).toHaveBeenCalledWith('mustaqim');
      expect(appService.getHello).toHaveBeenCalled();
      expect(mockRes.render).toHaveBeenCalledWith('index', {
        message: { id: 1, username: 'mustaqim' },
      });
    });
  });
});
