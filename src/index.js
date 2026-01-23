import config, { validateConfig } from './config/index.js';
import scheduler from './scheduler/index.js';
import tweetService from './services/tweet.service.js';
import logger from './utils/logger.js';

/**
 * Main application entry point
 */
async function main() {
  logger.info('🚀 Starting Quran Daily Tweet Service...');
  logger.info('═'.repeat(50));

  try {
    // Step 1: Validate configuration
    logger.info('🔍 Validating configuration...');
    validateConfig();
    logger.info('✅ Configuration validated');

    // Step 2: Initialize services
    logger.info('🔧 Initializing services...');
    await tweetService.initialize();

    // Step 3: Start scheduler
    logger.info('📅 Setting up scheduler...');
    scheduler.start();

    logger.info('═'.repeat(50));
    logger.info('✅ Service is running and ready!');
    logger.info(`📆 Posts scheduled at: ${config.scheduler.cronSchedule} (${config.scheduler.timezone})`);
    logger.info('═'.repeat(50));

    // Handle graceful shutdown
    setupGracefulShutdown();

  } catch (error) {
    logger.error('❌ Failed to start service', { error: error.message });
    process.exit(1);
  }
}

/**
 * Setup graceful shutdown handlers
 */
function setupGracefulShutdown() {
  const shutdown = (signal) => {
    logger.info(`\n📴 Received ${signal}. Shutting down gracefully...`);
    scheduler.stop();
    logger.info('👋 Goodbye!');
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

// Run the application
main();
