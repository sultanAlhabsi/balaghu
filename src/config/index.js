import dotenv from 'dotenv';
dotenv.config();

// config stuff
const config = {
  x: {
    apiKey: process.env.X_API_KEY,
    apiSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET,
  },
  cron: process.env.CRON_SCHEDULE || '0 9,21 * * *',
  timezone: process.env.TIMEZONE || 'Asia/Muscat',
  quranApiUrl: 'https://api.alquran.cloud/v1/ayah/random',
  enablePosting: process.env.ENABLE_POSTING !== 'false',
};

// check if we have all the required env vars
function checkConfig() {
  const required = ['X_API_KEY', 'X_API_SECRET', 'X_ACCESS_TOKEN', 'X_ACCESS_TOKEN_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing env vars: ${missing.join(', ')}`);
  }
}

export { config, checkConfig };
