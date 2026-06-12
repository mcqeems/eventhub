import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { AuthGuard } from 'src/auth/auth.guard';

describe('EventsController', () => {
  let controller: EventsController;
  let eventsService: Partial<EventsService>;

  beforeEach(async () => {
    eventsService = {
      create: jest.fn().mockResolvedValue({ status: 201, message: 'OK', data: {} }),
      findAll: jest.fn().mockResolvedValue({ status: 200, message: 'OK', data: [] }),
      findOne: jest.fn().mockResolvedValue({ status: 200, message: 'OK', data: {} }),
      update: jest.fn().mockResolvedValue({ status: 200, message: 'OK', data: {} }),
      remove: jest.fn().mockResolvedValue({ status: 200, message: 'OK' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [{ provide: EventsService, useValue: eventsService }],
    })
    .overrideGuard(AuthGuard)
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<EventsController>(EventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call eventsService endpoints', async () => {
    await controller.findAll();
    expect(eventsService.findAll).toHaveBeenCalled();
    
    await controller.findOne('1');
    expect(eventsService.findOne).toHaveBeenCalledWith(1);

    await controller.remove('1');
    expect(eventsService.remove).toHaveBeenCalledWith(1);
    
    await controller.create({} as any);
    expect(eventsService.create).toHaveBeenCalledWith({});
    
    await controller.update('1', {} as any);
    expect(eventsService.update).toHaveBeenCalledWith(1, {});
  });
});
