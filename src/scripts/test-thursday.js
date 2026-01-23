// test thursday tweet
import { checkConfig } from '../config/index.js';
import { verifyCredentials } from '../services/twitter.js';
import { postThursdayTweet } from '../scheduler/index.js';

async function test() {
  console.log('Testing Thursday tweet...\n');
  
  try {
    checkConfig();
    await verifyCredentials();
    await postThursdayTweet();
    
    console.log('Done!');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
