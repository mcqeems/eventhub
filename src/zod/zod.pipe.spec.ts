import { BadRequestException } from '@nestjs/common';
import { ZodPipe } from './zod.pipe';
import { z } from 'zod';

describe('ZodPipe', () => {
  const schema = z.object({ name: z.string().min(2) });
  let pipe: ZodPipe;

  beforeEach(() => {
    pipe = new ZodPipe(schema);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should return parsed value on success', () => {
    const validData = { name: 'John' };
    expect(pipe.transform(validData, { type: 'body' } as any)).toEqual(validData);
  });

  it('should throw BadRequestException with formatted errors on failure', () => {
    const invalidData = { name: 'A' }; // length < 2
    try {
      pipe.transform(invalidData, { type: 'body' } as any);
      expect(true).toBe(false); // should not reach here
    } catch (e: any) {
      expect(e).toBeInstanceOf(BadRequestException);
      const response = e.getResponse() as any;
      expect(response).toMatchObject({
        statusCode: 400,
        message: 'Validation failed',
        errors: expect.any(Array),
      });
      expect(response.errors[0].field).toBe('name');
      expect(response.errors[0].message).toBeDefined();
    }
  });
});
