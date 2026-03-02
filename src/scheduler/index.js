import { getRandomAyah, formatTweet } from '../services/quran.js';
import { getRandomHadith, formatHadithTweet } from '../services/hadith.js';
import { postTweet } from '../services/twitter.js';
import logger from '../utils/logger.js';

// thursday tweet - fixed
const THURSDAY_MSG = `قال الرسولﷺ: "أكثروا من الصلاة عليّ ليلة الجمعة ويوم الجمعة فإن صلاتكم معروضة عليّ" 🌻☁️

﴿ إِنَّ ٱللَّهَ وَمَلَـٰۤئكَتَهُۥ یُصَلُّونَ عَلَى ٱلنَّبِیِّۚ یَـٰۤأَیُّهَا ٱلَّذِینَ ءَامَنُوا۟ صَلُّوا۟ عَلَیۡهِ وَسَلِّمُوا۟ تَسۡلِیمًا ﴾

#سورة_الأحزاب`;

// post random ayah
async function postDailyAyah() {
  logger.info('Starting daily ayah post...');
  
  const ayah = await getRandomAyah();
  const tweet = formatTweet(ayah);
  
  logger.info('Tweet content ready', { length: tweet.length, preview: tweet.substring(0, 60) });

  const result = await postTweet(tweet);
  
  if (result.id === 'dry-run') {
    logger.warn('⚠️  DRY RUN - Tweet was NOT actually posted to X!');
  } else {
    logger.info('✅ Tweet posted to X account!', { tweetId: result.id, url: `https://x.com/i/web/status/${result.id}` });
  }
  
  return { success: true, id: result.id };
}


// post random hadith
async function postDailyHadith() {
  logger.info('Starting daily hadith post...');
  
  const hadith = await getRandomHadith();
  const tweet = formatHadithTweet(hadith);
  
  logger.info('Tweet content ready', { length: tweet.length, preview: tweet.substring(0, 60) });

  const result = await postTweet(tweet);
  
  if (result.id === 'dry-run') {
    logger.warn('⚠️  DRY RUN - Tweet was NOT actually posted to X!');
  } else {
    logger.info('✅ Tweet posted to X account!', { tweetId: result.id, url: `https://x.com/i/web/status/${result.id}` });
  }
  
  return { success: true, id: result.id };
}

// post thursday salawat
async function postThursdayTweet() {
  logger.info('Posting Thursday salawat...');
  
  const result = await postTweet(THURSDAY_MSG);
  logger.info('Thursday tweet posted', { id: result.id });
}

export { postDailyAyah, postThursdayTweet, postDailyHadith };
