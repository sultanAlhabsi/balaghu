// show statistics about posted ayahs
import fs from 'fs/promises';

async function showStats() {
  try {
    const data = await fs.readFile('posted-ayahs.json', 'utf-8');
    const list = JSON.parse(data);
    
    const TOTAL_AYAHS = 6236;
    const posted = list.length;
    const remaining = TOTAL_AYAHS - posted;
    const percentage = ((posted / TOTAL_AYAHS) * 100).toFixed(2);
    
    console.log('📊 إحصائيات الآيات المنشورة\n');
    console.log(`✅ الآيات المنشورة: ${posted} آية`);
    console.log(`⏳ الآيات المتبقية: ${remaining} آية`);
    console.log(`📈 النسبة المئوية: ${percentage}%`);
    console.log(`📖 إجمالي آيات القرآن: ${TOTAL_AYAHS} آية\n`);
    
    if (posted > 0) {
      console.log('📝 آخر 5 آيات منشورة:\n');
      const last5 = list.slice(-5);
      last5.forEach((ayah, index) => {
        if (typeof ayah === 'number') {
          console.log(`  ${index + 1}. رقم عالمي: ${ayah}`);
        } else {
          const text = ayah.text ? ayah.text.substring(0, 50) + (ayah.text.length > 50 ? '...' : '') : 'N/A';
          console.log(`  ${index + 1}. ${ayah.surahName || 'N/A'} - آية ${ayah.ayahNumber || 'N/A'} (عالمي: ${ayah.globalNumber})`);
          console.log(`     ${text}\n`);
        }
      });
    }
    
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('❌ لا يوجد ملف posted-ayahs.json');
      console.log('💡 لم يتم نشر أي آية بعد');
    } else {
      console.error('Error:', err.message);
    }
  }
}

showStats();
