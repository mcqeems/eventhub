import { Test, TestingModule } from '@nestjs/testing';
import { HashingService } from './hashing.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('HashingService', () => {
  let service: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashingService],
    }).compile();

    service = module.get<HashingService>(HashingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash password', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_pw');
    const result = await service.hashPassword('password');
    expect(result).toBe('hashed_pw');
    expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
  });

  it('should compare password', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const result = await service.comparePassword('password', 'hashed_pw');
    expect(result).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashed_pw');
  });
});
