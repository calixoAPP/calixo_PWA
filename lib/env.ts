import { z } from 'zod';

/**
 * Environment variables validation schema
 * Validates all required env vars at build time
 */
const envSchema = z.object({
  // Supabase (auth)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  // Backend API (calixo_backend)
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),

  // App store links (mobile-only features)
  NEXT_PUBLIC_IOS_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_ANDROID_APP_URL: z.string().url().optional(),

  // App
  APP_ENV: z.enum(['PRE', 'PRO', 'CAJA']).default('PRE'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

type Env = z.infer<typeof envSchema>;

/**
 * Validated environment variables
 * Throws error at build time if any required var is missing
 */
export function getEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((e) => e.path.join('.')).join(', ');
      throw new Error(
        `Missing or invalid environment variables: ${missingVars}\n` +
        'Please check your .env.local file and ensure all required variables are set.'
      );
    }
    throw error;
  }
}

// Export validated env (only in server-side code)
export const env = typeof window === 'undefined' ? getEnv() : ({} as Env);
