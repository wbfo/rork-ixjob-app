import { z, ZodError } from 'zod';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.string().default('3001').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().optional(), // Make optional for development
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  OPENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  CORS_ORIGINS: z.string().default('http://localhost:19006,http://localhost:8081'),
  MAX_FILE_SIZE: z.string().default('10485760').transform(Number),
  UPLOAD_DIR: z.string().default('uploads'),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform(Number),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100').transform(Number),
});

function validateEnv() {
  try {
    const env = envSchema.parse(process.env);
    console.log('✅ Environment variables validated successfully');
    return env;
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      console.error('❌ Environment validation failed:');
      const issues = error.issues ?? [];
      issues.forEach((err: z.ZodIssue) => {
        const path = Array.isArray(err.path) ? err.path.join('.') : String(err.path ?? '');
        console.error(`  - ${path}: ${err.message}`);
      });
      console.error('\n💡 Please check your .env file and ensure all required variables are set.');
      console.error('📋 Copy .env.example to .env and fill in the values.');
    } else {
      console.error('❌ Unexpected error validating environment:', error);
    }
    process.exit(1);
  }
}

export const env = validateEnv();

// Helper to get CORS origins as array
export const getCorsOrigins = () => {
  return env.CORS_ORIGINS.split(',').map((origin: string) => origin.trim());
};

// Helper to check if AI services are configured
export const getAvailableAIServices = () => {
  const services = [];
  if (env.OPENAI_API_KEY) services.push('OpenAI');
  if (env.GEMINI_API_KEY) services.push('Gemini');
  return services;
};