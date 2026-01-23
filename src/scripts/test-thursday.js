/**
 * Test script to post the Thursday Salawat tweet
 * Run with: npm run test:thursday
 */

import { validateConfig } from '../config/index.js';
import scheduler from '../scheduler/index.js';
import xService from '../services/x.service.js';
import logger from '../utils/logger.js';

async function testThursday() {
  logger.info('🧪 Testing Thursday Salawat Tweet...');
  logger.info('═'.repeat(50));

  try {
    // Validate config first
    validateConfig();

    // Initialize X service
    xService.initialize();
    await xService.verifyCredentials();

    // Run Thursday job
    await scheduler.runThursdayNow();

    logger.info('═'.repeat(50));
    logger.info('✅ Test completed!');

  } catch (error) {
    logger.error('❌ Test failed', { error: error.message });
    process.exit(1);
  }
}

testThursday();
