import { z } from 'nestjs-zod/z';

export const messageSchema = z.object({
  message: z.string(),
});

export type MessageDto = z.infer<typeof messageSchema>;
