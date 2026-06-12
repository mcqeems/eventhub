import { z } from 'zod';

export const UpdateEventSchema = z
  .object({
    name: z.string().min(2).max(255),
    date: z.coerce.date(),
    location: z.string().min(1).max(255),
    max: z.number().optional(),
    min: z.number().min(1),
  })
  .partial();

export type UpdateEventDto = z.infer<typeof UpdateEventSchema>;
