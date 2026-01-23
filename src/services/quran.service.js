import config from '../config/index.js';
import logger from '../utils/logger.js';

/**
 * Quran API Service
 * Handles fetching random Ayahs from the Quran API
 */
class QuranService {
  constructor() {
    this.baseUrl = config.quranApi.baseUrl;
  }

  /**
   * Fetch a random Ayah from the Quran API
   * @returns {Promise<Object>} Ayah data
   */
  async getRandomAyah() {
    const url = `${this.baseUrl}${config.quranApi.randomAyahEndpoint}`;
    
    logger.debug('Fetching random Ayah from API', { url });

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.code !== 200 || data.status !== 'OK') {
        throw new Error(`API returned error: ${data.status}`);
      }

      const ayahData = this.parseAyahData(data.data);
      
      logger.info('Successfully fetched Ayah', {
        surah: ayahData.surahName,
        ayah: ayahData.ayahNumber,
      });

      return ayahData;
    } catch (error) {
      logger.error('Failed to fetch Ayah from API', { error: error.message });
      throw error;
    }
  }

  /**
   * Parse the API response and extract required data
   * @param {Object} data - Raw API response data
   * @returns {Object} Parsed Ayah data
   */
  parseAyahData(data) {
    return {
      // Arabic text of the Ayah
      text: data.text,
      // Surah name in Arabic
      surahName: data.surah.name,
      // Surah number
      surahNumber: data.surah.number,
      // Ayah number within the Surah
      ayahNumber: data.numberInSurah,
      // Global Ayah number
      globalNumber: data.number,
      // Juz number
      juz: data.juz,
      // Page number
      page: data.page,
    };
  }

  /**
   * Format the Ayah for posting on X
   * @param {Object} ayahData - Parsed Ayah data
   * @returns {string} Formatted tweet text
   */
  formatTweet(ayahData) {
    // Clean the Ayah text (remove extra whitespace/newlines)
    const cleanText = ayahData.text.trim().replace(/\n/g, ' ');
    
    // Convert ayah number to Arabic numerals
    const arabicAyahNumber = this.toArabicNumerals(ayahData.ayahNumber);
    
    // Extract clean surah name (remove "سُورَةُ" prefix if exists)
    const surahName = this.getCleanSurahName(ayahData.surahName);
    
    // Format surah name for hashtag (remove diacritics and replace spaces)
    const surahHashtag = this.removeDiacritics(surahName).replace(/\s+/g, '_');
    
    const tweetText = `يقول النبي ﷺ : «بلغوا عني ولو آية»

﴿ ${cleanText} ۝${arabicAyahNumber}﴾

#بلغوا_عنّي_ولو_آية
#سورة_${surahHashtag}`;

    logger.debug('Formatted tweet', { 
      length: tweetText.length,
      text: tweetText.substring(0, 50) + '...'
    });

    return tweetText;
  }

  /**
   * Convert number to Arabic numerals
   * @param {number} num - Number to convert
   * @returns {string} Arabic numeral string
   */
  toArabicNumerals(num) {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map(d => arabicNumerals[parseInt(d)]).join('');
  }

  /**
   * Remove Arabic diacritics (tashkeel)
   * @param {string} text - Text with diacritics
   * @returns {string} Text without diacritics
   */
  removeDiacritics(text) {
    // Remove Arabic diacritics: fatha, damma, kasra, sukun, shadda, tanwin, etc.
    return text.replace(/[\u064B-\u065F\u0670]/g, '');
  }

  /**
   * Get clean surah name without prefix
   * @param {string} surahName - Original surah name
   * @returns {string} Clean surah name
   */
  getCleanSurahName(surahName) {
    // Remove common prefixes like "سُورَةُ" or "سورة"
    return surahName
      .replace(/^سُورَةُ\s*/i, '')
      .replace(/^سورة\s*/i, '')
      .trim();
  }
}

// Export singleton instance
export default new QuranService();
