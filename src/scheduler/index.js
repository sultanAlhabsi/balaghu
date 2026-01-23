import cron from 'node-cron';
import config from '../config/index.js';
import tweetService from '../services/tweet.service.js';
import xService from '../services/x.service.js';
import logger from '../utils/logger.js';

/**
 * Fixed tweet for Thursday (before Friday)
 */
const THURSDAY_TWEET = `قال الرسولﷺ: "أكثروا من الصلاة عليّ ليلة الجمعة ويوم الجمعة فإن صلاتكم معروضة عليّ" 🌻☁️

﴿ إِنَّ ٱللَّهَ وَمَلَـٰۤئكَتَهُۥ یُصَلُّونَ عَلَى ٱلنَّبِیِّۚ یَـٰۤأَیُّهَا ٱلَّذِینَ ءَامَنُوا۟ صَلُّوا۟ عَلَیۡهِ وَسَلِّمُوا۟ تَسۡلِیمًا ﴾

#سورة_الأحزاب`;

/**
 * Scheduler
 * Handles scheduling the daily Ayah posting
 */
class Scheduler {
  constructor() {
    this.dailyJob = null;
    this.thursdayJob = null;
    this.isRunning = false;
  }

  /**
   * Start the scheduler
   */
  start() {
    const { cronSchedule, timezone } = config.scheduler;

    logger.info('📅 Starting scheduler', {
      dailySchedule: cronSchedule,
      thursdaySchedule: '0 19 * * 4',
      timezone: timezone,
    });

    // Validate cron expression
    if (!cron.validate(cronSchedule)) {
      throw new Error(`Invalid cron expression: ${cronSchedule}`);
    }

    // Daily Ayah job (9 AM and 9 PM)
    this.dailyJob = cron.schedule(
      cronSchedule,
      async () => {
        await this.executeDailyJob();
      },
      {
        scheduled: true,
        timezone: timezone,
      }
    );

    // Thursday job (7 PM every Thursday - day 4)
    this.thursdayJob = cron.schedule(
      '0 19 * * 4',
      async () => {
        await this.executeThursdayJob();
      },
      {
        scheduled: true,
        timezone: timezone,
      }
    );

    this.isRunning = true;

    logger.info('✅ Scheduler started successfully');
    logger.info(`⏰ Daily Ayah: ${cronSchedule} (${timezone})`);
    logger.info(`⏰ Thursday Salawat: Every Thursday at 7:00 PM (${timezone})`);
  }

  /**
   * Execute the daily Ayah job
   */
  async executeDailyJob() {
    logger.info('⏰ Daily Ayah job triggered');

    try {
      const result = await tweetService.postDailyAyah();

      if (result.success) {
        logger.info('✅ Daily Ayah job completed successfully');
      } else {
        logger.error('❌ Daily Ayah job failed', { error: result.error });
      }
    } catch (error) {
      logger.error('❌ Unexpected error in daily job', {
        error: error.message,
      });
    }
  }

  /**
   * Execute the Thursday Salawat job
   */
  async executeThursdayJob() {
    logger.info('⏰ Thursday Salawat job triggered');

    try {
      // Initialize X client if needed
      xService.initialize();

      // Post the fixed Thursday tweet
      const result = await xService.postTweet(THURSDAY_TWEET);

      logger.info('✅ Thursday Salawat posted successfully', {
        tweetId: result.id,
      });
    } catch (error) {
      logger.error('❌ Failed to post Thursday Salawat', {
        error: error.message,
      });
    }
  }

  /**
   * Stop the scheduler
   */
  stop() {
    if (this.dailyJob) {
      this.dailyJob.stop();
    }
    if (this.thursdayJob) {
      this.thursdayJob.stop();
    }
    this.isRunning = false;
    logger.info('🛑 Scheduler stopped');
  }

  /**
   * Get the next scheduled run time
   * @returns {string} Human-readable next run time
   */
  getNextRunTime() {
    const { cronSchedule, timezone } = config.scheduler;
    
    // Parse cron schedule
    const [minute, hour] = cronSchedule.split(' ');
    
    const now = new Date();
    const next = new Date();
    
    // Handle multiple hours (e.g., "9,21")
    const hours = hour.split(',').map(h => parseInt(h));
    const currentHour = now.getHours();
    
    // Find next hour
    let nextHour = hours.find(h => h > currentHour) || hours[0];
    next.setHours(nextHour, parseInt(minute), 0, 0);
    
    // If the time has passed today, schedule for tomorrow
    if (next <= now) {
      next.setDate(next.getDate() + 1);
      next.setHours(hours[0], parseInt(minute), 0, 0);
    }
    
    return next.toLocaleString('ar-SA', { 
      timeZone: timezone,
      dateStyle: 'full',
      timeStyle: 'short'
    });
  }

  /**
   * Run the daily job immediately (for testing)
   */
  async runNow() {
    logger.info('🚀 Running daily job immediately...');
    return await this.executeDailyJob();
  }

  /**
   * Run the Thursday job immediately (for testing)
   */
  async runThursdayNow() {
    logger.info('🚀 Running Thursday job immediately...');
    return await this.executeThursdayJob();
  }
}

// Export singleton instance
export default new Scheduler();
