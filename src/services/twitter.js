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
  
  try {
    const res = await client.v2.tweet(text);
    logger.info('Tweet posted!', { id: res.data.id });
    return { id: res.data.id, text: res.data.text };
  } catch (err) {
    logger.error('Failed to post tweet', { error: err.message });
    throw err;
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

export { postTweet, verifyCredentials, initClient };
