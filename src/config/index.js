import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Application configuration
 */
const config = {
  // X (Twitter) API credentials
  x: {
    apiKey: process.env.X_API_KEY,
    apiSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET,
  },

  // Scheduler configuration
  scheduler: {
    // Default: 9:00 AM and 9:00 PM every day
    cronSchedule: process.env.CRON_SCHEDULE || '0 9,21 * * *',
    timezone: process.env.TIMEZONE || 'Asia/Muscat',
  },

  // Quran API
  quranApi: {
    baseUrl: 'https://api.alquran.cloud/v1',
    randomAyahEndpoint: '/ayah/random',
  },

  // Application settings
  app: {
    enablePosting: process.env.ENABLE_POSTING !== 'false',
    logLevel: process.env.LOG_LEVEL || 'info',
  },
};

/**
 * Validate required configuration
 */
export function validateConfig() {
  const requiredVars = [
    { key: 'X_API_KEY', value: config.x.apiKey },
    { key: 'X_API_SECRET', value: config.x.apiSecret },
    { key: 'X_ACCESS_TOKEN', value: config.x.accessToken },
    { key: 'X_ACCESS_TOKEN_SECRET', value: config.x.accessTokenSecret },
  ];

  const missing = requiredVars.filter((v) => !v.value);

  if (missing.length > 0) {
    const missingKeys = missing.map((v) => v.key).join(', ');
    throw new Error(`Missing required environment variables: ${missingKeys}`);
  }

  return true;
}

export default config;
