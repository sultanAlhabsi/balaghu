/**
 * Test script to post a tweet immediately
 * Run with: npm run test:tweet
 */

import { validateConfig } from '../config/index.js';
import tweetService from '../services/tweet.service.js';
import logger from '../utils/logger.js';

async function testTweet() {
  logger.info('🧪 Testing Tweet Posting...');
  logger.info('═'.repeat(50));

  try {
    // Validate config first
    validateConfig();

    // Initialize service
    await tweetService.initialize();

    // Post daily Ayah
    const result = await tweetService.postDailyAyah();

    logger.info('═'.repeat(50));

    if (result.success) {
      logger.info('✅ Test completed successfully!');
      logger.info(`Tweet ID: ${result.tweetId}`);
      console.log('\n📱 Posted Tweet:');
      console.log(result.tweetText);
    } else {
      logger.error('❌ Test failed', { error: result.error });
      process.exit(1);
    }

  } catch (error) {
    logger.error('❌ Test failed', { error: error.message });
    process.exit(1);
  }
}

testTweet();
