import { z } from 'zod';

export const configSchema = z.object({
  REDIS_URL: z.string().url().startsWith('redis://').optional(),
  REDIS_PASSWORD: z.string().default('mypassword'),

  PORT: z.coerce.number().default(3000),

  DATABASE_URL: z.string().url().startsWith('postgresql://'),

  POSTGRES_USER: z.string().default('postgres'),
  POSTGRES_PASSWORD: z.string().default('postgres'),
  POSTGRES_DB: z.string().default('mydb'),

  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
});

export type Config = z.infer<typeof configSchema>;
