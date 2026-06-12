import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: Partial<PrismaService>;

  beforeEach(async () => {
    prismaService = {
      users: {
        findUnique: jest.fn(),
        create: jest.fn(),
      } as any,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should findOne by username', async () => {
    const user = { id: 1, username: 'test' };
    (prismaService.users.findUnique as jest.Mock).mockResolvedValue(user);
    
    const result = await service.findOne('test');
    expect(result).toEqual(user);
    expect(prismaService.users.findUnique).toHaveBeenCalledWith({ where: { username: 'test' } });
  });

  it('should return undefined if user not found', async () => {
    (prismaService.users.findUnique as jest.Mock).mockResolvedValue(null);
    const result = await service.findOne('test');
    expect(result).toBeUndefined();
  });

  it('should findOneById', async () => {
    const user = { id: 1, username: 'test' };
    (prismaService.users.findUnique as jest.Mock).mockResolvedValue(user);
    
    const result = await service.findOneById(1);
    expect(result).toEqual(user);
    expect(prismaService.users.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should createOne user', async () => {
    const user = { id: 1, username: 'test', password: 'pw' };
    (prismaService.users.create as jest.Mock).mockResolvedValue(user);
    
    const result = await service.createOne('test', 'pw');
    expect(result).toEqual(user);
    expect(prismaService.users.create).toHaveBeenCalledWith({ data: { username: 'test', password: 'pw' } });
  });
});
