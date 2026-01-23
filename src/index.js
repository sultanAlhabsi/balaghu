import { config, checkConfig } from './config/index.js';
import { startScheduler, stopScheduler } from './scheduler/index.js';
import { verifyCredentials } from './services/twitter.js';
import logger from './utils/logger.js';

async function main() {
  logger.info('Starting Quran Daily Tweet bot...');
  
  try {
    // check env vars
    checkConfig();
    logger.info('Config OK');
    
    // verify twitter credentials
    const user = await verifyCredentials();
    logger.info(`Logged in as @${user.username}`);
    
    // start scheduler
    startScheduler();
    
    logger.info('Bot is running!');
    logger.info(`Schedule: ${config.cron} (${config.timezone})`);
    
  } catch (err) {
    logger.error('Failed to start', { error: err.message });
    process.exit(1);
  }
}

// handle ctrl+c
process.on('SIGINT', () => {
  logger.info('Shutting down...');
  stopScheduler();
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Shutting down...');
  stopScheduler();
  process.exit(0);
});

main();
