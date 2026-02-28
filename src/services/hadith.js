import fs from 'fs/promises';
import path from 'path';
import logger from '../utils/logger.js';

const HADITHS_FILE = path.join(process.cwd(), 'src', 'data', 'myData.json');
const POSTED_HADITHS_FILE = path.join(process.cwd(), 'posted-hadiths.json');

let hadiths = [];
let postedHadiths = new Set();
let isLoaded = false;

// Load hadiths and posted history
async function loadData() {
  if (isLoaded) return;

  try {
    // Load all hadiths
    const hadithsData = await fs.readFile(HADITHS_FILE, 'utf-8');
    hadiths = JSON.parse(hadithsData);

    // Load posted history
    try {
      const postedData = await fs.readFile(POSTED_HADITHS_FILE, 'utf-8');
      const list = JSON.parse(postedData);
      postedHadiths = new Set(list);
    } catch (err) {
      if (err.code === 'ENOENT') {
        logger.info('No posted hadiths file found, starting fresh');
        postedHadiths = new Set();
      } else {
        throw err;
      }
    }

    logger.info('Loaded hadiths data', { 
      total: hadiths.length, 
      posted: postedHadiths.size 
    });
    
    isLoaded = true;
  } catch (err) {
    logger.error('Failed to load hadiths data', { error: err.message });
    throw err;
  }
}

// Save posted history
async function savePostedHadiths() {
  try {
    const list = Array.from(postedHadiths);
    await fs.writeFile(POSTED_HADITHS_FILE, JSON.stringify(list, null, 2), 'utf-8');
    logger.info('Saved posted hadiths to file', { count: list.length });
  } catch (err) {
    logger.error('Failed to save posted hadiths', { error: err.message });
  }
}

// Get a random unposted hadith
async function getRandomHadith() {
  await loadData();

  // If all hadiths are posted, reset the history
  if (postedHadiths.size >= hadiths.length) {
    logger.info('All hadiths have been posted. Resetting history...');
    postedHadiths.clear();
    await savePostedHadiths();
  }

  // Filter out posted hadiths and ensure length is within Twitter limits (280 chars)
  const availableHadiths = hadiths.filter(h => {
    if (postedHadiths.has(h.id)) return false;
    const tweetLength = formatHadithTweet(h).length;
    return tweetLength <= 280;
  });
  
  if (availableHadiths.length === 0) {
    throw new Error('No available hadiths found that fit the length limit.');
  }

  // Pick a random one
  const randomIndex = Math.floor(Math.random() * availableHadiths.length);
  const selectedHadith = availableHadiths[randomIndex];

  // Mark as posted
  postedHadiths.add(selectedHadith.id);
  await savePostedHadiths();

  return selectedHadith;
}

// Format the tweet text
function formatHadithTweet(hadith) {
  return `"${hadith.hadith}"

المصدر : #${hadith.source}`;
}

export { getRandomHadith, formatHadithTweet };
