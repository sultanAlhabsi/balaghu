import config from '../config/index.js';

/**
 * Log levels
 */
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * Get current log level from config
 */
function getCurrentLogLevel() {
  return LOG_LEVELS[config.app.logLevel] || LOG_LEVELS.info;
}

/**
 * Format timestamp for logs
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Format log message
 */
function formatMessage(level, message, data) {
  const timestamp = getTimestamp();
  const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${dataStr}`;
}

/**
 * Logger utility
 */
const logger = {
  debug(message, data) {
    if (getCurrentLogLevel() <= LOG_LEVELS.debug) {
      console.log(formatMessage('debug', message, data));
    }
  },

  info(message, data) {
    if (getCurrentLogLevel() <= LOG_LEVELS.info) {
      console.log(formatMessage('info', message, data));
    }
  },

  warn(message, data) {
    if (getCurrentLogLevel() <= LOG_LEVELS.warn) {
      console.warn(formatMessage('warn', message, data));
    }
  },

  error(message, data) {
    if (getCurrentLogLevel() <= LOG_LEVELS.error) {
      console.error(formatMessage('error', message, data));
    }
  },

  /**
   * Log successful tweet
   */
  logTweetSuccess(ayahData, tweetId) {
    this.info('✅ Tweet posted successfully', {
      tweetId,
      surah: ayahData.surahName,
      ayah: ayahData.ayahNumber,
    });
  },

  /**
   * Log tweet failure
   */
  logTweetFailure(error) {
    this.error('❌ Failed to post tweet', {
      error: error.message,
      code: error.code,
    });
  },
};

export default logger;
