import { getRandomHadith, formatHadithTweet } from '../services/hadith.js';

async function test() {
  console.log('Testing Hadith fetch and format...\n');
  
  try {
    const hadith = await getRandomHadith();
    const tweet = formatHadithTweet(hadith);
    
    console.log('--- TWEET PREVIEW ---');
    console.log(tweet);
    console.log('---------------------\n');
    
    console.log(`Length: ${tweet.length} characters (Max 280)`);
    console.log(`Hadith ID: ${hadith.id}`);
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
