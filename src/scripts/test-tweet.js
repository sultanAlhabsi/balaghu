// test posting a tweet
import { checkConfig } from '../config/index.js';
import { postDailyAyah } from '../scheduler/index.js';

async function test() {
  console.log('Testing tweet post...\n');
  
  try {
    checkConfig();
    
    const result = await postDailyAyah();
    console.log('\nResult:', result);
    
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

test();
