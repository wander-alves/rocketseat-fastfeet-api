import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3333),
  JWT_PRIV_KEY: z.string(),
  JWT_PUBL_KEY: z.string(),
  DATABASE_URL: z.url().startsWith('postgres://'),
});

type Env = z.infer<typeof envSchema>;

export { envSchema, type Env };
