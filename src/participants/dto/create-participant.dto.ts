import { z } from 'zod';

export const CreateParticipantSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email().max(255),
  institusi: z.string().min(2).max(255),
  jurusan: z.string().min(2).max(255),
  semester: z.number().min(1),
  event_id: z.number().min(1),
});

export type CreateParticipantDto = z.infer<typeof CreateParticipantSchema>;
