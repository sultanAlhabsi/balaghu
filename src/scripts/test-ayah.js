// test fetching ayah
import { getRandomAyah, formatTweet } from '../services/quran.js';

async function test() {
  console.log('Testing ayah fetch...\n');
  
  try {
    const ayah = await getRandomAyah();
    console.log('Ayah data:', ayah);
    
    const tweet = formatTweet(ayah);
    console.log('\nFormatted tweet:');
    console.log(tweet);
    console.log(`\nLength: ${tweet.length}/280`);
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
