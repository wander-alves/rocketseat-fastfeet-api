import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3333),
  DATABASE_URL: z.url().startsWith('postgres://'),
  JWT_PRIV_KEY: z.string(),
  JWT_PUBL_KEY: z.string(),
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_BUCKET_NAME: z.string(),
});

type Env = z.infer<typeof envSchema>;

export { envSchema, type Env };
