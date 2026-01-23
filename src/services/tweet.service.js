import quranService from './quran.service.js';
import xService from './x.service.js';
import logger from '../utils/logger.js';

/**
 * Tweet Service
 * Orchestrates fetching Ayah and posting to X
 */
class TweetService {
  /**
   * Fetch a random Ayah and post it to X
   * @returns {Promise<Object>} Result of the operation
   */
  async postDailyAyah() {
    logger.info('🕌 Starting daily Ayah posting process...');

    try {
      // Step 1: Fetch random Ayah
      logger.info('📖 Fetching random Ayah...');
      const ayahData = await quranService.getRandomAyah();

      // Step 2: Format the tweet
      const tweetText = quranService.formatTweet(ayahData);

      // Validate tweet length (X limit is 280 characters)
      if (tweetText.length > 280) {
        logger.warn('Tweet exceeds 280 characters, may be truncated', {
          length: tweetText.length,
        });
      }

      // Step 3: Post to X
      logger.info('🐦 Posting to X...');
      const result = await xService.postTweet(tweetText);

      // Log success
      logger.logTweetSuccess(ayahData, result.id);

      return {
        success: true,
        tweetId: result.id,
        ayahData,
        tweetText,
      };
    } catch (error) {
      logger.logTweetFailure(error);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Initialize the service and verify credentials
   */
  async initialize() {
    logger.info('🔧 Initializing Tweet Service...');

    try {
      // Initialize X client
      xService.initialize();

      // Verify credentials
      const user = await xService.verifyCredentials();

      logger.info(`✅ Service initialized for @${user.username}`);

      return user;
    } catch (error) {
      logger.error('Failed to initialize Tweet Service', {
        error: error.message,
      });
      throw error;
    }
  }
}

// Export singleton instance
export default new TweetService();
