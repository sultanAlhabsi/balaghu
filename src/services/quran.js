import { config } from '../config/index.js';
import logger from '../utils/logger.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// arabic numbers for the ayah
const arabicNums = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

// file to store posted ayahs permanently
const POSTED_FILE = path.join(__dirname, '..', '..', 'posted-ayahs.json');

// track posted ayahs permanently
let postedAyahs = new Map(); // Map of globalNumber -> ayah details
let isLoaded = false;

// load posted ayahs from file
async function loadPostedAyahs() {
  if (isLoaded) return;
  
  try {
    const data = await fs.readFile(POSTED_FILE, 'utf-8');
    const list = JSON.parse(data);
    
    // support both old format (array of numbers) and new format (array of objects)
    if (Array.isArray(list) && list.length > 0) {
      if (typeof list[0] === 'number') {
        // old format: convert to new format
        postedAyahs = new Map(list.map(num => [num, { globalNumber: num }]));
      } else {
        // new format
        postedAyahs = new Map(list.map(item => [item.globalNumber, item]));
      }
    }
    
    logger.info('Loaded posted ayahs from file', { count: postedAyahs.size });
  } catch (err) {
    if (err.code === 'ENOENT') {
      logger.info('No posted ayahs file found, starting fresh');
      postedAyahs = new Map();
    } else {
      logger.error('Failed to load posted ayahs', { error: err.message });
      postedAyahs = new Map();
    }
  }
  
  isLoaded = true;
}

// save posted ayahs to file
async function savePostedAyahs() {
  try {
    const list = Array.from(postedAyahs.values());
    await fs.writeFile(POSTED_FILE, JSON.stringify(list, null, 2), 'utf-8');
    logger.info('Saved posted ayahs to file', { count: list.length });
  } catch (err) {
    logger.error('Failed to save posted ayahs', { error: err.message });
  }
}

function toArabicNumber(num) {
  return num.toString().split('').map(d => arabicNums[d]).join('');
}

// remove tashkeel from text
function removeTashkeel(text) {
  return text.replace(/[\u064B-\u065F\u0670]/g, '');
}

// get surah name without the "سورة" prefix
function cleanSurahName(name) {
  return name.replace(/^سُورَةُ\s*/, '').replace(/^سورة\s*/, '').trim();
}


async function fetchAyah(excludeList = new Set()) {
  // generate random ayah reference instead of relying on API's random
  // total 6236 ayahs in Quran
  let randomAyahNumber;
  let attempts = 0;
  const MAX_ATTEMPTS = 50;
  
  do {
    randomAyahNumber = Math.floor(Math.random() * 6236) + 1;
    attempts++;
  } while (excludeList.has(randomAyahNumber) && attempts < MAX_ATTEMPTS);
  
  const url = `https://api.alquran.cloud/v1/ayah/${randomAyahNumber}`;
  
  const res = await fetch(url);
  
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  
  const json = await res.json();
  
  if (json.code !== 200) {
    throw new Error('API returned error');
  }
  
  const data = json.data;
  
  return {
    text: data.text,
    surahName: data.surah.name,
    ayahNumber: data.numberInSurah,
    globalAyahNumber: data.number,
  };
}


async function getRandomAyah() {
  // load posted ayahs from file on first call
  await loadPostedAyahs();
  
  const MAX_ATTEMPTS = 30;
  const MAX_TWEET_LENGTH = 280;
  const TOTAL_AYAHS = 6236;
  
  // check if we've posted too many ayahs
  if (postedAyahs.size >= TOTAL_AYAHS - 100) {
    logger.warn('Running low on unique ayahs!', { 
      posted: postedAyahs.size, 
      total: TOTAL_AYAHS 
    });
  }
  
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const ayah = await fetchAyah(postedAyahs);
      const tweet = formatTweet(ayah);
      
      logger.info('Fetched ayah', {
        attempt,
        surah: ayah.surahName,
        ayahNumber: ayah.ayahNumber,
        globalNumber: ayah.globalAyahNumber,
        textLength: ayah.text.length,
        tweetLength: tweet.length,
        totalPosted: postedAyahs.size
      });
      
      if (tweet.length <= MAX_TWEET_LENGTH) {
        // mark this ayah as posted permanently with full details
        postedAyahs.set(ayah.globalAyahNumber, {
          globalNumber: ayah.globalAyahNumber,
          surahName: ayah.surahName,
          ayahNumber: ayah.ayahNumber,
          text: ayah.text.trim().replace(/\n/g, ' ')
        });
        await savePostedAyahs();
        
        logger.info('Found suitable ayah', { 
          length: tweet.length, 
          attempt,
          surah: ayah.surahName,
          markedAsPosted: ayah.globalAyahNumber,
          totalPosted: postedAyahs.size
        });
        return ayah;
      }
      
      logger.warn('Ayah too long, fetching another', { 
        length: tweet.length, 
        attempt 
      });
      
      // اذا كانت الآية طويلة جداً، نضيفها لقائمة المستبعدات حتى لا نحاول جلبها مرة أخرى في المحاولات القادمة
      postedAyahs.set(ayah.globalAyahNumber, {
        globalNumber: ayah.globalAyahNumber,
        surahName: ayah.surahName,
        ayahNumber: ayah.ayahNumber,
        text: ayah.text.trim().replace(/\n/g, ' '),
        reason: 'too_long'
      });
      await savePostedAyahs();
      
    } catch (err) {
      logger.error('Failed to fetch ayah', { error: err.message, attempt });
      if (attempt === MAX_ATTEMPTS) {
        throw err;
      }
    }
  }
  
  throw new Error('Could not find suitable ayah after ' + MAX_ATTEMPTS + ' attempts');
}


function formatTweet(ayah) {
  // clean up the text
  const text = ayah.text.trim().replace(/\n/g, ' ');
  const ayahNum = toArabicNumber(ayah.ayahNumber);
  const surahName = cleanSurahName(ayah.surahName);
  const hashtag = removeTashkeel(surahName).replace(/\s+/g, '_');
  
  return `يقول النبي ﷺ : «بلغوا عني ولو آية»

﴿ ${text} ۝${ayahNum}﴾

#بلغوا_عنّي_ولو_آية
#سورة_${hashtag}`;
}

export { getRandomAyah, formatTweet };
