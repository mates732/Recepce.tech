export const envSchema = {
  VAPI_API_KEY: { type: 'string', required: true },
  VAPI_SERVER_SECRET: { type: 'string', required: true },
  PUBLIC_VAPI_PUBLIC_KEY: { type: 'string', required: false },
  STRIPE_SECRET_KEY: { type: 'string', required: true },
  STRIPE_WEBHOOK_SECRET: { type: 'string', required: true },
  DATABASE_URL: { type: 'string', required: true },
  ADMIN_PASSWORD: { type: 'string', required: true },
  ADMIN_SESSION_SECRET: { type: 'string', required: true },
  NEXT_PUBLIC_APP_URL: { type: 'string', required: true },
} as const;

export type EnvConfig = {
  [K in keyof typeof envSchema]: string;
};

export function validateEnv(): EnvConfig {
  const config = {} as Record<string, string>;
  const missing: string[] = [];

  for (const [key, { required }] of Object.entries(envSchema)) {
    const value = process.env[key];
    if (required && !value) {
      missing.push(key);
    }
    config[key] = value ?? '';
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return config as EnvConfig;
}

export const env = validateEnv();