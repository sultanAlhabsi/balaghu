import { TwitterApi } from 'twitter-api-v2';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';

let client = null;

function initClient() {
  if (client) return client;
  
  client = new TwitterApi({
    appKey: config.x.apiKey,
    appSecret: config.x.apiSecret,
    accessToken: config.x.accessToken,
    accessSecret: config.x.accessTokenSecret,
  });
  
  logger.info('X API client initialized');
  return client;
}


async function postTweet(text) {
  initClient();
  
  // dry run mode
  if (!config.enablePosting) {
    logger.warn('Posting disabled, would have posted:', { text });
    return { id: 'dry-run', text };
  }
  
  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 60 * 1000; // 1 minute
  let attempt = 1;

  while (attempt <= MAX_RETRIES) {
    try {
      const res = await client.v2.tweet(text);
      logger.info('Tweet posted!', { id: res.data.id, attempt });
      return { id: res.data.id, text: res.data.text };
    } catch (err) {
      if (err.code === 503 || err.code === 500) {
        logger.warn(`Twitter API issue (Code ${err.code}), attempt ${attempt} of ${MAX_RETRIES} failed.`);
        
        if (attempt === MAX_RETRIES) {
          logger.error('Max retries reached. Failed to post tweet.', { error: err.message });
          throw err;
        }

        logger.info(`Waiting 1 minute before retrying...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        attempt++;
      } else {
        // Different kind of error, don't retry (like bad credentials or duplicated tweet)
        logger.error('Failed to post tweet with non-retryable error', { error: err.message, code: err.code });
        throw err;
      }
    }
  }
}


async function verifyCredentials() {
  initClient();
  
  try {
    const res = await client.v2.me();
    logger.info('Credentials OK', { user: res.data.username });
    return res.data;
  } catch (err) {
    logger.error('Credential check failed', { error: err.message });
    throw err;
  }
}

export { postTweet, verifyCredentials };
