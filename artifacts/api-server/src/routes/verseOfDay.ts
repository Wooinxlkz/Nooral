import { Router } from "express";
import { logger } from "../lib/logger";

const router = Router();

const VERSES = [
  { surah: 2, ayah: 255, surahName: "Al-Baqarah", surahNameAr: "البقرة", arabic: "اللَّهُ لَا إِلَـٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ", translation: "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep." },
  { surah: 94, ayah: 6, surahName: "Ash-Sharh", surahNameAr: "الشرح", arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", translation: "Indeed, with hardship will be ease." },
  { surah: 3, ayah: 173, surahName: "Al-Imran", surahNameAr: "آل عمران", arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", translation: "Sufficient for us is Allah, and He is the best Disposer of affairs." },
  { surah: 65, ayah: 3, surahName: "At-Talaq", surahNameAr: "الطلاق", arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ", translation: "And whoever relies upon Allah — then He is sufficient for him. Indeed, Allah will accomplish His purpose." },
  { surah: 2, ayah: 286, surahName: "Al-Baqarah", surahNameAr: "البقرة", arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", translation: "Allah does not burden a soul beyond that it can bear." },
  { surah: 13, ayah: 28, surahName: "Ar-Ra'd", surahNameAr: "الرعد", arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", translation: "Verily, in the remembrance of Allah do hearts find rest." },
  { surah: 39, ayah: 53, surahName: "Az-Zumar", surahNameAr: "الزمر", arabic: "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا", translation: "Do not despair of the mercy of Allah. Indeed, Allah forgives all sins." },
  { surah: 55, ayah: 13, surahName: "Ar-Rahman", surahNameAr: "الرحمن", arabic: "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ", translation: "So which of the favors of your Lord would you deny?" },
  { surah: 49, ayah: 13, surahName: "Al-Hujurat", surahNameAr: "الحجرات", arabic: "إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ", translation: "Indeed, the most noble of you in the sight of Allah is the most righteous of you." },
  { surah: 112, ayah: 1, surahName: "Al-Ikhlas", surahNameAr: "الإخلاص", arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", translation: "Say, He is Allah, the One." },
  { surah: 1, ayah: 1, surahName: "Al-Fatihah", surahNameAr: "الفاتحة", arabic: "بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ", translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
  { surah: 1, ayah: 5, surahName: "Al-Fatihah", surahNameAr: "الفاتحة", arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", translation: "It is You we worship and You we ask for help." },
  { surah: 2, ayah: 152, surahName: "Al-Baqarah", surahNameAr: "البقرة", arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ", translation: "So remember Me; I will remember you. And be grateful to Me and do not deny Me." },
  { surah: 2, ayah: 186, surahName: "Al-Baqarah", surahNameAr: "البقرة", arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ", translation: "And when My servants ask you about Me — indeed I am near." },
  { surah: 3, ayah: 139, surahName: "Al-Imran", surahNameAr: "آل عمران", arabic: "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ", translation: "Do not weaken and do not grieve, for you will be superior if you are true believers." },
  { surah: 4, ayah: 36, surahName: "An-Nisa", surahNameAr: "النساء", arabic: "وَاعْبُدُوا اللَّهَ وَلَا تُشْرِكُوا بِهِ شَيْئًا", translation: "Worship Allah and associate nothing with Him." },
  { surah: 17, ayah: 23, surahName: "Al-Isra", surahNameAr: "الإسراء", arabic: "وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا", translation: "Your Lord has decreed that you worship none but Him and that you be good to your parents." },
  { surah: 18, ayah: 10, surahName: "Al-Kahf", surahNameAr: "الكهف", arabic: "رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا", translation: "Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance." },
  { surah: 20, ayah: 14, surahName: "Ta-Ha", surahNameAr: "طه", arabic: "إِنَّنِي أَنَا اللَّهُ لَا إِلَـٰهَ إِلَّا أَنَا فَاعْبُدْنِي وَأَقِمِ الصَّلَاةَ لِذِكْرِي", translation: "Indeed, I am Allah. There is no deity except Me, so worship Me and establish prayer for My remembrance." },
  { surah: 23, ayah: 1, surahName: "Al-Mu'minun", surahNameAr: "المؤمنون", arabic: "قَدْ أَفْلَحَ الْمُؤْمِنُونَ", translation: "Certainly will the believers have succeeded." },
  { surah: 24, ayah: 35, surahName: "An-Nur", surahNameAr: "النور", arabic: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ", translation: "Allah is the Light of the heavens and the earth." },
  { surah: 25, ayah: 63, surahName: "Al-Furqan", surahNameAr: "الفرقان", arabic: "وَعِبَادُ الرَّحْمَـٰنِ الَّذِينَ يَمْشُونَ عَلَى الْأَرْضِ هَوْنًا", translation: "The servants of the Most Merciful are those who walk upon the earth humbly." },
  { surah: 29, ayah: 69, surahName: "Al-Ankabut", surahNameAr: "العنكبوت", arabic: "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا", translation: "And those who strive for Us — We will surely guide them to Our ways." },
  { surah: 30, ayah: 21, surahName: "Ar-Rum", surahNameAr: "الروم", arabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا", translation: "And of His signs is that He created for you from yourselves mates that you may find tranquility in them." },
  { surah: 31, ayah: 34, surahName: "Luqman", surahNameAr: "لقمان", arabic: "إِنَّ اللَّهَ عِندَهُ عِلْمُ السَّاعَةِ", translation: "Indeed, Allah has knowledge of the Hour." },
  { surah: 33, ayah: 41, surahName: "Al-Ahzab", surahNameAr: "الأحزاب", arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا", translation: "O you who have believed, remember Allah with much remembrance." },
  { surah: 35, ayah: 5, surahName: "Fatir", surahNameAr: "فاطر", arabic: "يَا أَيُّهَا النَّاسُ إِنَّ وَعْدَ اللَّهِ حَقٌّ ۖ فَلَا تَغُرَّنَّكُمُ الْحَيَاةُ الدُّنْيَا", translation: "O mankind, indeed the promise of Allah is truth, so let not the worldly life delude you." },
  { surah: 40, ayah: 60, surahName: "Ghafir", surahNameAr: "غافر", arabic: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ", translation: "And your Lord says, 'Call upon Me; I will respond to you.'" },
  { surah: 41, ayah: 30, surahName: "Fussilat", surahNameAr: "فصلت", arabic: "إِنَّ الَّذِينَ قَالُوا رَبُّنَا اللَّهُ ثُمَّ اسْتَقَامُوا تَتَنَزَّلُ عَلَيْهِمُ الْمَلَائِكَةُ", translation: "Indeed, those who say 'Our Lord is Allah' and then remain firm — the angels descend upon them." },
  { surah: 42, ayah: 11, surahName: "Ash-Shura", surahNameAr: "الشورى", arabic: "لَيْسَ كَمِثْلِهِ شَيْءٌ ۖ وَهُوَ السَّمِيعُ الْبَصِيرُ", translation: "There is nothing like unto Him, and He is the Hearing, the Seeing." },
  { surah: 47, ayah: 7, surahName: "Muhammad", surahNameAr: "محمد", arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِن تَنصُرُوا اللَّهَ يَنصُرْكُمْ", translation: "O you who have believed, if you support Allah, He will support you." },
  { surah: 49, ayah: 12, surahName: "Al-Hujurat", surahNameAr: "الحجرات", arabic: "إِنَّ بَعْضَ الظَّنِّ إِثْمٌ", translation: "Indeed, some assumption is sin." },
  { surah: 51, ayah: 56, surahName: "Adh-Dhariyat", surahNameAr: "الذاريات", arabic: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ", translation: "And I did not create the jinn and mankind except to worship Me." },
  { surah: 57, ayah: 3, surahName: "Al-Hadid", surahNameAr: "الحديد", arabic: "هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ ۖ وَهُوَ بِكُلِّ شَيْءٍ عَلِيمٌ", translation: "He is the First and the Last, the Ascendant and the Intimate, and He is, of all things, Knowing." },
  { surah: 58, ayah: 11, surahName: "Al-Mujadila", surahNameAr: "المجادلة", arabic: "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ", translation: "Allah will raise those who have believed among you and those who were given knowledge, by degrees." },
  { surah: 64, ayah: 11, surahName: "At-Taghabun", surahNameAr: "التغابن", arabic: "وَمَن يُؤْمِن بِاللَّهِ يَهْدِ قَلْبَهُ", translation: "And whoever believes in Allah — He will guide his heart." },
  { surah: 73, ayah: 20, surahName: "Al-Muzzammil", surahNameAr: "المزمل", arabic: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَأَقْرِضُوا اللَّهَ قَرْضًا حَسَنًا", translation: "And establish prayer and give zakah and loan Allah a goodly loan." },
  { surah: 93, ayah: 5, surahName: "Ad-Duha", surahNameAr: "الضحى", arabic: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ", translation: "And your Lord is going to give you, and you will be satisfied." },
  { surah: 94, ayah: 1, surahName: "Ash-Sharh", surahNameAr: "الشرح", arabic: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ", translation: "Did We not expand for you your breast?" },
  { surah: 96, ayah: 1, surahName: "Al-Alaq", surahNameAr: "العلق", arabic: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ", translation: "Read in the name of your Lord who created." },
  { surah: 103, ayah: 1, surahName: "Al-Asr", surahNameAr: "العصر", arabic: "وَالْعَصْرِ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ", translation: "By time, indeed, mankind is in loss." },
  { surah: 108, ayah: 1, surahName: "Al-Kawthar", surahNameAr: "الكوثر", arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", translation: "Indeed, We have granted you Al-Kawthar (abundance)." },
  { surah: 110, ayah: 1, surahName: "An-Nasr", surahNameAr: "النصر", arabic: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ", translation: "When the victory of Allah has come and the conquest." },
  { surah: 114, ayah: 1, surahName: "An-Nas", surahNameAr: "الناس", arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", translation: "Say, I seek refuge in the Lord of mankind." },
  { surah: 113, ayah: 1, surahName: "Al-Falaq", surahNameAr: "الفلق", arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", translation: "Say, I seek refuge in the Lord of daybreak." },
  { surah: 9, ayah: 129, surahName: "At-Tawbah", surahNameAr: "التوبة", arabic: "فَإِن تَوَلَّوْا فَقُلْ حَسْبِيَ اللَّهُ لَا إِلَـٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ", translation: "But if they turn away, say, 'Sufficient for me is Allah; there is no deity except Him. On Him I have relied.'" },
  { surah: 7, ayah: 56, surahName: "Al-A'raf", surahNameAr: "الأعراف", arabic: "إِنَّ رَحْمَتَ اللَّهِ قَرِيبٌ مِّنَ الْمُحْسِنِينَ", translation: "Indeed, the mercy of Allah is near to the doers of good." },
  { surah: 6, ayah: 162, surahName: "Al-An'am", surahNameAr: "الأنعام", arabic: "قُلْ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ", translation: "Say, indeed my prayer, my rites of sacrifice, my living and my dying are for Allah, Lord of the worlds." },
  { surah: 10, ayah: 62, surahName: "Yunus", surahNameAr: "يونس", arabic: "أَلَا إِنَّ أَوْلِيَاءَ اللَّهِ لَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ", translation: "Unquestionably, [for] the allies of Allah there will be no fear concerning them, nor will they grieve." },
  { surah: 14, ayah: 7, surahName: "Ibrahim", surahNameAr: "إبراهيم", arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ", translation: "If you are grateful, I will surely increase you in favor." },
  { surah: 16, ayah: 97, surahName: "An-Nahl", surahNameAr: "النحل", arabic: "مَنْ عَمِلَ صَالِحًا مِّن ذَكَرٍ أَوْ أُنثَىٰ وَهُوَ مُؤْمِنٌ فَلَنُحْيِيَنَّهُ حَيَاةً طَيِّبَةً", translation: "Whoever does righteousness, whether male or female, while being a believer — We will surely cause him to live a good life." },
  { surah: 21, ayah: 87, surahName: "Al-Anbiya", surahNameAr: "الأنبياء", arabic: "لَّا إِلَـٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ", translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers." },
  { surah: 22, ayah: 77, surahName: "Al-Hajj", surahNameAr: "الحج", arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا ارْكَعُوا وَاسْجُدُوا وَاعْبُدُوا رَبَّكُمْ", translation: "O you who have believed, bow and prostrate and worship your Lord." },
  { surah: 28, ayah: 24, surahName: "Al-Qasas", surahNameAr: "القصص", arabic: "رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ", translation: "My Lord, indeed I am, for whatever good You would send down to me, in need." },
];

router.get("/", (req, res) => {
  try {
    const dayIndex = Math.floor(Date.now() / 86400000) % VERSES.length;
    const v = VERSES[dayIndex];
    return res.json({
      surah: v.surah,
      ayah: v.ayah,
      surahName: v.surahName,
      surahNameAr: v.surahNameAr,
      arabic: v.arabic,
      translation: v.translation,
      verseKey: `${v.surah}:${v.ayah}`,
    });
  } catch (err) {
    logger.error({ err }, "Failed to get verse of day");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
