import { checkConfig } from '../config/index.js';
import { postDailyHadith } from '../scheduler/index.js';

async function test() {
  console.log('Testing Hadith tweet post...\n');
  
  try {
    checkConfig();
    
    const result = await postDailyHadith();
    console.log('\nResult:', result);
    
    if (!result.success || result.id === 'dry-run') {
      console.error('Hadith was not posted. id:', result.id);
      process.exit(1);
    }
    
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

test();
