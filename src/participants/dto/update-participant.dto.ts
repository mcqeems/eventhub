import { z } from 'zod';

export const UpdateParticipantSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email().max(255),
  institusi: z.string().min(2).max(255),
  jurusan: z.string().min(2).max(255),
  semester: z.number().min(1),
  event_id: z.number().min(1),
}).partial();

export type UpdateParticipantDto = z.infer<typeof UpdateParticipantSchema>;
