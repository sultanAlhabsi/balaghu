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
  
  const result = await postTweet(tweet);
  logger.info('Daily ayah posted', { id: result.id, surah: ayah.surahName });
  return { success: true, id: result.id };
}


// post random hadith
async function postDailyHadith() {
  logger.info('Starting daily hadith post...');
  
  const hadith = await getRandomHadith();
  const tweet = formatHadithTweet(hadith);
  
  const result = await postTweet(tweet);
  logger.info('Daily hadith posted', { id: result.id, hadithId: hadith.id });
  return { success: true, id: result.id };
}

// post thursday salawat
async function postThursdayTweet() {
  logger.info('Posting Thursday salawat...');
  
  const result = await postTweet(THURSDAY_MSG);
  logger.info('Thursday tweet posted', { id: result.id });
}

export { postDailyAyah, postThursdayTweet, postDailyHadith };
