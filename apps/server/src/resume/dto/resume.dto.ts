import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const createResumeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  visibility: z.enum(['public', 'private']).default('private'),
});

export class CreateResumeDto extends createZodDto(createResumeSchema) {}