import { z } from 'zod';

export const signInSchema = z
  .object({
    username: z
      .string('The username should be a string.')
      .min(4, 'The username should at least 4 characters.')
      .max(255, 'The maximum character for username is 255 characters.'),
    password: z
      .string('The username should be a string.')
      .min(4, 'The username should at least 4 characters.')
      .max(255, 'The maximum character for username is 255 characters.'),
  })
  .required();

export type SignInDto = z.infer<typeof signInSchema>;
