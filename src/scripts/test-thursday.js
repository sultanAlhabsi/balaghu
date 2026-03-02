// test thursday tweet
import { checkConfig } from '../config/index.js';
import { postThursdayTweet } from '../scheduler/index.js';

async function test() {
  console.log('Testing Thursday tweet...\n');
  
  try {
    checkConfig();
    await postThursdayTweet();
    
    console.log('Done!');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

test();
