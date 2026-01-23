import { TwitterApi } from 'twitter-api-v2';
import config from '../config/index.js';
import logger from '../utils/logger.js';

/**
 * X (Twitter) API Service
 * Handles posting tweets using the official X API v2
 */
class XService {
  constructor() {
    this.client = null;
  }

  /**
   * Initialize the X API client
   */
  initialize() {
    if (this.client) {
      return this.client;
    }

    logger.debug('Initializing X API client');

    this.client = new TwitterApi({
      appKey: config.x.apiKey,
      appSecret: config.x.apiSecret,
      accessToken: config.x.accessToken,
      accessSecret: config.x.accessTokenSecret,
    });

    // Get read-write client
    this.rwClient = this.client.readWrite;

    logger.info('X API client initialized successfully');

    return this.client;
  }

  /**
   * Post a tweet to X
   * @param {string} text - The tweet text
   * @returns {Promise<Object>} Tweet response data
   */
  async postTweet(text) {
    if (!this.client) {
      this.initialize();
    }

    // Check if posting is enabled
    if (!config.app.enablePosting) {
      logger.warn('Posting is disabled. Tweet would have been:', { text });
      return { id: 'dry-run', text };
    }

    logger.debug('Posting tweet to X', { textLength: text.length });

    try {
      const response = await this.rwClient.v2.tweet(text);

      logger.info('Tweet posted successfully', {
        tweetId: response.data.id,
      });

      return {
        id: response.data.id,
        text: response.data.text,
      };
    } catch (error) {
      logger.error('Failed to post tweet', {
        error: error.message,
        code: error.code,
        data: error.data,
      });
      throw error;
    }
  }

  /**
   * Verify API credentials
   * @returns {Promise<Object>} User data
   */
  async verifyCredentials() {
    if (!this.client) {
      this.initialize();
    }

    logger.debug('Verifying X API credentials');

    try {
      const response = await this.rwClient.v2.me();

      logger.info('Credentials verified successfully', {
        username: response.data.username,
        name: response.data.name,
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to verify credentials', {
        error: error.message,
      });
      throw error;
    }
  }
}

// Export singleton instance
export default new XService();
