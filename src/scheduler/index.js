import cron from 'node-cron';
import { config } from '../config/index.js';
import { getRandomAyah, formatTweet } from '../services/quran.js';
import { getRandomHadith, formatHadithTweet } from '../services/hadith.js';
import { postTweet } from '../services/twitter.js';
import logger from '../utils/logger.js';

// thursday tweet - fixed
const THURSDAY_MSG = `قال الرسولﷺ: "أكثروا من الصلاة عليّ ليلة الجمعة ويوم الجمعة فإن صلاتكم معروضة عليّ" 🌻☁️

﴿ إِنَّ ٱللَّهَ وَمَلَـٰۤئكَتَهُۥ یُصَلُّونَ عَلَى ٱلنَّبِیِّۚ یَـٰۤأَیُّهَا ٱلَّذِینَ ءَامَنُوا۟ صَلُّوا۟ عَلَیۡهِ وَسَلِّمُوا۟ تَسۡلِیمًا ﴾

#سورة_الأحزاب`;

let dailyJob = null;
let thursdayJob = null;
let hadithJob = null;


// post random ayah
async function postDailyAyah() {
  logger.info('Starting daily ayah post...');
  
  try {
    const ayah = await getRandomAyah();
    const tweet = formatTweet(ayah);
    
    const result = await postTweet(tweet);
    logger.info('Daily ayah posted', { id: result.id, surah: ayah.surahName });
    return { success: true, id: result.id };
    
  } catch (err) {
    logger.error('Daily ayah failed', { error: err.message });
    return { success: false, error: err.message };
  }
}


// post random hadith
async function postDailyHadith() {
  logger.info('Starting daily hadith post...');
  
  try {
    const hadith = await getRandomHadith();
    const tweet = formatHadithTweet(hadith);
    
    const result = await postTweet(tweet);
    logger.info('Daily hadith posted', { id: result.id, hadithId: hadith.id });
    return { success: true, id: result.id };
    
  } catch (err) {
    logger.error('Daily hadith failed', { error: err.message });
    return { success: false, error: err.message };
  }
}

// post thursday salawat
async function postThursdayTweet() {
  logger.info('Posting Thursday salawat...');
  
  try {
    const result = await postTweet(THURSDAY_MSG);
    logger.info('Thursday tweet posted', { id: result.id });
  } catch (err) {
    logger.error('Thursday tweet failed', { error: err.message });
  }
}


function startScheduler() {
  const { cron: schedule, timezone } = config;
  
  logger.info('Starting scheduler...', { schedule, timezone });
  
  // validate cron
  if (!cron.validate(schedule)) {
    throw new Error('Invalid cron: ' + schedule);
  }
  
  // daily job
  dailyJob = cron.schedule(schedule, async () => {
    logger.info('Cron triggered - daily ayah');
    await postDailyAyah();
  }, { timezone });

  // hadith job - 1pm
  hadithJob = cron.schedule('0 13 * * *', async () => {
    logger.info('Cron triggered - daily hadith');
    await postDailyHadith();
  }, { timezone });
  
  // thursday job - 7pm
  thursdayJob = cron.schedule('0 19 * * 4', async () => {
    logger.info('Cron triggered - thursday salawat');
    await postThursdayTweet();
  }, { timezone });
  
  logger.info('Scheduler started');
  logger.info(`Daily Ayah: ${schedule}`);
  logger.info('Daily Hadith: 0 13 * * * (1pm)');
  logger.info('Thursday: 0 19 * * 4 (7pm)');
}


function stopScheduler() {
  if (dailyJob) dailyJob.stop();
  if (thursdayJob) thursdayJob.stop();
  if (hadithJob) hadithJob.stop();
  logger.info('Scheduler stopped');
}

export { startScheduler, stopScheduler, postDailyAyah, postThursdayTweet, postDailyHadith };
