import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantsController } from './participants.controller';
import { ParticipantsService } from './participants.service';
import { AuthGuard } from 'src/auth/auth.guard';

describe('ParticipantsController', () => {
  let controller: ParticipantsController;
  let participantsService: Partial<ParticipantsService>;

  beforeEach(async () => {
    participantsService = {
      create: jest.fn().mockResolvedValue({ status: 201, message: 'OK', data: {} }),
      findAll: jest.fn().mockResolvedValue({ status: 200, message: 'OK', data: [] }),
      findOne: jest.fn().mockResolvedValue({ status: 200, message: 'OK', data: {} }),
      update: jest.fn().mockResolvedValue({ status: 200, message: 'OK', data: {} }),
      remove: jest.fn().mockResolvedValue({ status: 200, message: 'OK' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParticipantsController],
      providers: [{ provide: ParticipantsService, useValue: participantsService }],
    })
    .overrideGuard(AuthGuard)
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<ParticipantsController>(ParticipantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call participantsService endpoints', async () => {
    await controller.findAll();
    expect(participantsService.findAll).toHaveBeenCalled();
    
    await controller.findOne('1');
    expect(participantsService.findOne).toHaveBeenCalledWith(1);

    await controller.remove('1');
    expect(participantsService.remove).toHaveBeenCalledWith(1);
    
    await controller.create({} as any);
    expect(participantsService.create).toHaveBeenCalledWith({});
    
    await controller.update('1', {} as any);
    expect(participantsService.update).toHaveBeenCalledWith(1, {});
  });
});
