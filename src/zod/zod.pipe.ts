import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodType, ZodError } from 'zod'; // <-- Make sure to import ZodError

export class ZodPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      // 1. Check if the error is specifically a Zod validation error
      if (error instanceof ZodError) {
        // 2. Map over the Zod errors to create a clean, flat array
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.join('.'), // Converts ['user', 'username'] to 'user.username'
          message: err.message, // Grabs your custom message
        }));

        // 3. Throw the exception with your newly formatted object
        throw new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: formattedErrors,
        });
      }

      // Fallback for any non-Zod related errors
      throw new BadRequestException('Validation failed');
    }
  }
}
