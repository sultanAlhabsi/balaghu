const arabicNums = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

function toArabicNumber(number) {
  return number.toString().replace(/\d/g, (digit) => arabicNums[Number(digit)]);
}

const ayahPool = [
  {
    id: 'fatir-35-2',
    surah: 'فاطر',
    number: 2,
    text: 'مَّا یَفۡتَحِ ٱللَّهُ لِلنَّاسِ مِن رَّحۡمَةࣲ فَلَا مُمۡسِكَ لَهَاۖ وَمَا یُمۡسِكۡ فَلَا مُرۡسِلَ لَهُۥ مِنۢ بَعۡدِهِۦۚ وَهُوَ ٱلۡعَزِیزُ ٱلۡحَكِیمُ',
  },
  {
    id: 'al-baqarah-2-152',
    surah: 'البقرة',
    number: 152,
    text: 'فَٱذۡكُرُونِیۤ أَذۡكُرۡكُمۡ وَٱشۡكُرُوا۟ لِی وَلَا تَكۡفُرُونِ',
  },
  {
    id: 'ad-duha-93-5',
    surah: 'الضحى',
    number: 5,
    text: 'وَلَسَوۡفَ یُعۡطِیكَ رَبُّكَ فَتَرۡضَىٰۤ',
  },
  {
    id: 'ash-sharh-94-5',
    surah: 'الشرح',
    number: 5,
    text: 'فَإِنَّ مَعَ ٱلۡعُسۡرِ یُسۡرًا',
  },
  {
    id: 'ali-imran-3-139',
    surah: 'آل عمران',
    number: 139,
    text: 'وَلَا تَهِنُوا۟ وَلَا تَحۡزَنُوا۟ وَأَنتُمُ ٱلۡأَعۡلَوۡنَ إِن كُنتُم مُّؤۡمِنِینَ',
  },
  {
    id: 'al-ankabut-29-69',
    surah: 'العنكبوت',
    number: 69,
    text: 'وَٱلَّذِینَ جَـٰهَدُوا۟ فِینَا لَنَهۡدِیَنَّهُمۡ سُبُلَنَاۚ وَإِنَّ ٱللَّهَ لَمَعَ ٱلۡمُحۡسِنِینَ',
  },
  {
    id: 'at-talaq-65-3',
    surah: 'الطلاق',
    number: 3,
    text: 'وَیَرۡزُقۡهُ مِنۡ حَیۡثُ لَا یَحۡتَسِبُۚ وَمَن یَتَوَكَّلۡ عَلَى ٱللَّهِ فَهُوَ حَسۡبُهُۥۤۚ إِنَّ ٱللَّهَ بَـٰلِغُ أَمۡرِهِۦۚ قَدۡ جَعَلَ ٱللَّهُ لِكُلِّ شَیۡءࣲ قَدۡرࣰا',
  },
  {
    id: 'az-zumar-39-53',
    surah: 'الزمر',
    number: 53,
    text: '۞ قُلۡ یَـٰعِبَادِیَ ٱلَّذِینَ أَسۡرَفُوا۟ عَلَىٰۤ أَنفُسِهِمۡ لَا تَقۡنَطُوا۟ مِن رَّحۡمَةِ ٱللَّهِۚ إِنَّ ٱللَّهَ یَغۡفِرُ ٱلذُّنُوبَ جَمِیعًاۚ إِنَّهُۥ هُوَ ٱلۡغَفُورُ ٱلرَّحِیمُ',
  },
  {
    id: 'taha-20-46',
    surah: 'طه',
    number: 46,
    text: 'قَالَ لَا تَخَافَاۤۖ إِنَّنِی مَعَكُمَاۤ أَسۡمَعُ وَأَرَىٰ',
  },
  {
    id: 'ar-rad-13-28',
    surah: 'الرعد',
    number: 28,
    text: 'ٱلَّذِینَ ءَامَنُوا۟ وَتَطۡمَىِٕنُّ قُلُوبُهُم بِذِكۡرِ ٱللَّهِۗ أَلَا بِذِكۡرِ ٱللَّهِ تَطۡمَىِٕنُّ ٱلۡقُلُوبُ',
  },
  {
    id: 'ibrahim-14-7',
    surah: 'إبراهيم',
    number: 7,
    text: 'وَإِذۡ تَأَذَّنَ رَبُّكُمۡ لَىِٕن شَكَرۡتُمۡ لَأَزِیدَنَّكُمۡۖ وَلَىِٕن كَفَرۡتُمۡ إِنَّ عَذَابِی لَشَدِیدࣱ',
  },
  {
    id: 'ar-rahman-55-13',
    surah: 'الرحمن',
    number: 13,
    text: 'فَبِأَیِّ ءَالَاۤءِ رَبِّكُمَا تُكَذِّبَانِ',
  },
];

function enrichAyah(ayah) {
  const number = toArabicNumber(ayah.number);
  const surahHashtag = ayah.surah.replace(/\s+/g, '_');
  const tweetText = `يقول النبي ﷺ : «بلغوا عني ولو آية»

﴿ ${ayah.text} ۝${number}﴾

#بلغوا_عنّي_ولو_آية
#سورة_${surahHashtag}`;

  return {
    ...ayah,
    number,
    reference: `آية ${number}`,
    tweetText,
    tweetLength: tweetText.length,
  };
}

export const ayahs = ayahPool.map(enrichAyah).filter((ayah) => ayah.tweetLength <= 280);

function shuffle(list) {
  const copy = [...list];

  for (let index = copy.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

export function selectRandomAyahs(count = 3, previousIds = []) {
  const previous = new Set(previousIds);
  const freshPool = ayahs.filter((ayah) => !previous.has(ayah.id));
  const source = freshPool.length >= count ? freshPool : ayahs;

  return shuffle(source).slice(0, count);
}
