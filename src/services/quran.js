import { config } from '../config/index.js';
import logger from '../utils/logger.js';

// arabic numbers for the ayah
const arabicNums = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

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


async function getRandomAyah() {
  try {
    const res = await fetch(config.quranApiUrl);
    
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
      surahNumber: data.surah.number,
      ayahNumber: data.numberInSurah,
    };
  } catch (err) {
    logger.error('Failed to fetch ayah', { error: err.message });
    throw err;
  }
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
