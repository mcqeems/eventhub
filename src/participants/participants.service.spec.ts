import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantsService } from './participants.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';

describe('ParticipantsService', () => {
  let service: ParticipantsService;
  let prismaService: Partial<PrismaService>;

  beforeEach(async () => {
    prismaService = {
      participants: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      } as any,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParticipantsService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    service = module.get<ParticipantsService>(ParticipantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw NotFoundException on P2003 error', async () => {
      const prismaError = new Error('Foreign key') as any;
      prismaError.code = 'P2003';
      (prismaService.participants.create as jest.Mock).mockRejectedValue(prismaError);

      await expect(service.create({ event_id: 1 } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException on P2025 error', async () => {
      const prismaError = new Error('Not found') as any;
      prismaError.code = 'P2025';
      (prismaService.participants.update as jest.Mock).mockRejectedValue(prismaError);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException on P2003 error', async () => {
      const prismaError = new Error('Foreign key') as any;
      prismaError.code = 'P2003';
      (prismaService.participants.update as jest.Mock).mockRejectedValue(prismaError);

      await expect(service.update(1, { event_id: 2 } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException on P2025 error', async () => {
      const prismaError = new Error('Not found') as any;
      prismaError.code = 'P2025';
      (prismaService.participants.delete as jest.Mock).mockRejectedValue(prismaError);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
