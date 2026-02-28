import { checkConfig } from '../config/index.js';
import { verifyCredentials } from '../services/twitter.js';
import { postDailyHadith } from '../scheduler/index.js';

async function test() {
  console.log('Testing Hadith tweet post...\n');
  
  try {
    checkConfig();
    await verifyCredentials();
    
    const result = await postDailyHadith();
    console.log('\nResult:', result);
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
