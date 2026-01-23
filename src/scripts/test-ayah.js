/**
 * Test script to fetch and display a random Ayah
 * Run with: npm run test:ayah
 */

import quranService from '../services/quran.service.js';
import logger from '../utils/logger.js';

async function testAyah() {
  logger.info('🧪 Testing Quran API...');
  logger.info('═'.repeat(50));

  try {
    // Fetch random Ayah
    const ayahData = await quranService.getRandomAyah();

    // Format as tweet
    const tweetText = quranService.formatTweet(ayahData);

    logger.info('═'.repeat(50));
    logger.info('📖 Ayah Data:');
    console.log(JSON.stringify(ayahData, null, 2));

    logger.info('═'.repeat(50));
    logger.info('📱 Formatted Tweet:');
    console.log('\n' + tweetText + '\n');

    logger.info('═'.repeat(50));
    logger.info(`📏 Tweet Length: ${tweetText.length}/280 characters`);

    if (tweetText.length > 280) {
      logger.warn('⚠️ Tweet exceeds 280 character limit!');
    } else {
      logger.info('✅ Tweet is within character limit');
    }

  } catch (error) {
    logger.error('❌ Test failed', { error: error.message });
    process.exit(1);
  }
}

testAyah();
