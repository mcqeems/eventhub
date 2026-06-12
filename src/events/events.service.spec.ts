import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';

describe('EventsService', () => {
  let service: EventsService;
  let prismaService: Partial<PrismaService>;

  beforeEach(async () => {
    prismaService = {
      events: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      } as any,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('update', () => {
    it('should throw NotFoundException on P2025 error', async () => {
      const prismaError = new Error('Not found') as any;
      prismaError.code = 'P2025';
      (prismaService.events.update as jest.Mock).mockRejectedValue(prismaError);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException on P2025 error', async () => {
      const prismaError = new Error('Not found') as any;
      prismaError.code = 'P2025';
      (prismaService.events.delete as jest.Mock).mockRejectedValue(prismaError);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on P2003 error', async () => {
      const prismaError = new Error('Foreign key') as any;
      prismaError.code = 'P2003';
      (prismaService.events.delete as jest.Mock).mockRejectedValue(prismaError);

      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
    });
  });
});
