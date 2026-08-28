import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, X } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface DhikrItem {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  count?: string;
  source?: string;
  virtue?: string;
}

interface DhikrCategory {
  id: string;
  label: string;
  labelAr: string;
  emoji: string;
  items: DhikrItem[];
}

const CATEGORIES: DhikrCategory[] = [
  // ── After Salah ──────────────────────────────────────────────────────────────
  {
    id: "after-salah",
    label: "After Salah",
    labelAr: "بَعْدَ الصَّلَاة",
    emoji: "🕌",
    items: [
      {
        id: "astaghfirullah-salah",
        arabic: "أَسْتَغْفِرُ اللَّهَ",
        transliteration: "Astaghfirullāh",
        translation: "I seek forgiveness from Allah.",
        count: "3×",
        source: "Muslim 591",
        virtue: "Said three times after each salah; then: 'Allāhumma antas-Salāmu…'",
      },
      {
        id: "allahumma-antas-salam",
        arabic: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ ذَا الْجَلَالِ وَالْإِكْرَامِ",
        transliteration: "Allāhumma antas-Salāmu wa minkas-salām, tabārakta dhā-l-jalāli wal-ikrām",
        translation: "O Allah, You are Peace and from You comes peace. Blessed are You, O Possessor of majesty and honor.",
        count: "1×",
        source: "Muslim 591",
      },
      {
        id: "tasbih-34",
        arabic: "سُبْحَانَ اللَّهِ ×٣٣ • الْحَمْدُ لِلَّهِ ×٣٣ • اللَّهُ أَكْبَرُ ×٣٤",
        transliteration: "SubhānAllāh ×33 • Alhamdulillāh ×33 • Allāhu Akbar ×34",
        translation: "Glory be to Allah (33) • All praise is for Allah (33) • Allah is the Greatest (34)",
        count: "33+33+34",
        source: "Muslim 597",
        virtue: "These 99 glorifications after every salah, and completing 100 with Lā ilāha illAllāh — all sins forgiven even if they were like sea-foam.",
      },
      {
        id: "subhanallah-wabihamdihi-adheem",
        arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
        transliteration: "SubhānAllāhi wa bihamdih, SubhānAllāhil-'Adhīm",
        translation: "Glory and praise be to Allah. Glory be to Allah the Magnificent.",
        source: "Bukhari 6682, Muslim 2694",
        virtue: "Two phrases light on the tongue, heavy on the Scale, beloved to the Most Merciful.",
      },
      {
        id: "ayat-kursi-salah",
        arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        transliteration: "Allāhu lā ilāha illā huwal-Hayyul-Qayyūm…",
        translation: "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence… (Al-Baqarah 2:255)",
        count: "1×",
        source: "Nasai 9928 — authenticated by al-Albani",
        virtue: "Whoever recites Āyat al-Kursī after every obligatory prayer, nothing prevents him from entering Paradise except death.",
      },
      {
        id: "muawwidhat-salah",
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ • قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ • قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        transliteration: "Sūrah al-Ikhlāṣ • Sūrah al-Falaq • Sūrah an-Nās",
        translation: "Recite Surah al-Ikhlas, al-Falaq, and an-Nas (the Three Quls) after each prayer.",
        count: "1× (3× after Fajr & Maghrib)",
        source: "Abu Dawud 5082, authenticated by al-Albani",
        virtue: "They are sufficient for you against everything. (Recited 3× after Fajr and Maghrib for protection throughout the day and night.)",
      },
      {
        id: "la-ilaha-illallah-wahdah",
        arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        transliteration: "Lā ilāha illAllāhu wahdahu lā sharīka lah, lahul-mulku wa lahul-hamdu wa huwa 'alā kulli shay'in qadīr",
        translation: "There is no god but Allah, alone without partner. To Him belongs the dominion, to Him belongs all praise, and He has power over all things.",
        count: "1× (10× after Fajr & Maghrib)",
        source: "Tirmidhi 3534 — hasan sahih",
        virtue: "Saying it 10× after Fajr: rewarded as if freeing 4 slaves, 10 good deeds recorded, 10 sins erased, raised 10 ranks, protected from Shaytan all day.",
      },
    ],
  },

  // ── Morning Adhkar ────────────────────────────────────────────────────────────
  {
    id: "morning",
    label: "Morning",
    labelAr: "أَذْكَارُ الصَّبَاح",
    emoji: "🌅",
    items: [
      {
        id: "asbahna",
        arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَٰذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ",
        transliteration: "Aṣbaḥnā wa aṣbaḥal-mulku lillāh, walhamdu lillāh, lā ilāha illAllāhu waḥdahu lā sharīka lah…",
        translation: "We have entered morning, and the dominion belongs to Allah. All praise is for Allah. There is no god but Allah, alone without partner… O Lord, I ask You for the good of this day and the good of what follows it.",
        count: "1×",
        source: "Abu Dawud 5084, Muslim 2723",
      },
      {
        id: "allahumma-bika-asbahna",
        arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
        transliteration: "Allāhumma bika aṣbaḥnā, wa bika amsaynā, wa bika naḥyā, wa bika namūtu, wa ilaikan-nushūr",
        translation: "O Allah, by You we enter the morning, by You we enter the evening, by You we live, by You we die, and to You is the resurrection.",
        count: "1×",
        source: "Abu Dawud 5068, Tirmidhi 3391",
      },
      {
        id: "sayyid-istighfar-morning",
        arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
        transliteration: "Allāhumma anta rabbī lā ilāha illā ant, khalaqtanī wa anā 'abduk, wa anā 'alā 'ahdika wa wa'dika mastata't, a'ūdhu bika min sharri mā ṣana't, abū'u laka bini'matika 'alayya, wa abū'u bidhanbī faghfir lī, fa'innahu lā yaghfirudh-dhunūba illā ant",
        translation: "O Allah, You are my Lord. There is no god but You. You created me and I am Your servant. I am upon Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your blessing upon me, and I acknowledge my sins, so forgive me — for none forgives sins except You.",
        count: "1×",
        source: "Bukhari 6306",
        virtue: "Sayyid al-Istighfar — the master of seeking forgiveness. Whoever says it in the morning with certainty and dies that day before evening enters Paradise.",
      },
      {
        id: "aafiya-morning",
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
        transliteration: "Allāhumma innī as'alukal-'afwa wal-'āfiyata fid-dunyā wal-ākhirah",
        translation: "O Allah, I ask You for pardon and well-being in this life and the next.",
        count: "1×",
        source: "Abu Dawud 5074, Ibn Majah 3871 — authenticated",
      },
      {
        id: "protection-morning",
        arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        transliteration: "A'ūdhu bikalimātillāhit-tāmmāti min sharri mā khalaq",
        translation: "I seek refuge in the complete words of Allah from the evil of what He has created.",
        count: "3×",
        source: "Muslim 2709",
        virtue: "Whoever says this 3× in the evening will not be harmed by any venom that night.",
      },
      {
        id: "subhanallah-100-morning",
        arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        transliteration: "SubhānAllāhi wa biḥamdih",
        translation: "Glory and praise be to Allah.",
        count: "100×",
        source: "Muslim 2692",
        virtue: "Whoever says it 100× in the morning and 100× in the evening — sins erased even if they were like sea-foam.",
      },
    ],
  },

  // ── Evening Adhkar ────────────────────────────────────────────────────────────
  {
    id: "evening",
    label: "Evening",
    labelAr: "أَذْكَارُ الْمَسَاء",
    emoji: "🌙",
    items: [
      {
        id: "amsayna",
        arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        transliteration: "Amsaynā wa amsal-mulku lillāh, walhamdu lillāh, lā ilāha illAllāhu waḥdahu lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa huwa 'alā kulli shay'in qadīr",
        translation: "We have entered evening, and the dominion belongs to Allah. All praise is for Allah. There is no god but Allah, alone without partner. To Him belongs dominion and praise, and He has power over all things.",
        count: "1×",
        source: "Abu Dawud 5084, Muslim 2723",
      },
      {
        id: "allahumma-bika-amsayna",
        arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ",
        transliteration: "Allāhumma bika amsaynā, wa bika aṣbaḥnā, wa bika naḥyā, wa bika namūtu, wa ilaykal-maṣīr",
        translation: "O Allah, by You we enter the evening, by You we enter the morning, by You we live, by You we die, and to You is the final return.",
        count: "1×",
        source: "Abu Dawud 5068, Tirmidhi 3391",
      },
      {
        id: "hasbiyallah-7",
        arabic: "حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
        transliteration: "Ḥasbiyallāhu lā ilāha illā huw, 'alayhi tawakkaltu wa huwa rabbul-'arshil-'aẓīm",
        translation: "Sufficient for me is Allah. There is no god but Him. Upon Him I rely, and He is the Lord of the Magnificent Throne.",
        count: "7×",
        source: "Abu Dawud 5081 — authenticated by al-Albani",
        virtue: "Allah will suffice him in his concerns of this world and the next, whether he says it sincerely or not.",
      },
      {
        id: "sayyid-istighfar-evening",
        arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
        transliteration: "Allāhumma anta rabbī lā ilāha illā ant…",
        translation: "O Allah, You are my Lord. There is no god but You. You created me and I am Your servant…",
        count: "1×",
        source: "Bukhari 6306",
        virtue: "Sayyid al-Istighfar. Whoever says it in the evening with certainty and dies that night before morning enters Paradise.",
      },
      {
        id: "bismillah-alladhi",
        arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        transliteration: "Bismillāhil-ladhī lā yaḍurru ma'asmihi shay'un fil-arḍi wa lā fis-samā'i wa huwas-Samī'ul-'Alīm",
        translation: "In the name of Allah with Whose name nothing on earth or in the heavens can cause harm, and He is the All-Hearing, the All-Knowing.",
        count: "3×",
        source: "Abu Dawud 5088, Tirmidhi 3388 — authenticated by al-Albani",
        virtue: "Whoever says it 3× in the morning and 3× in the evening will not be harmed by any unexpected calamity.",
      },
    ],
  },

  // ── Tasbih ────────────────────────────────────────────────────────────────────
  {
    id: "tasbih",
    label: "Tasbih",
    labelAr: "تَسْبِيح وَتَهْلِيل",
    emoji: "✨",
    items: [
      {
        id: "subhanallah",
        arabic: "سُبْحَانَ اللَّهِ",
        transliteration: "SubhānAllāh",
        translation: "Glory be to Allah.",
        virtue: "One of the most beloved words to Allah. A palm tree planted in Paradise for whoever says it. (Tirmidhi 3464)",
        source: "Multiple — Bukhari, Muslim",
      },
      {
        id: "alhamdulillah",
        arabic: "الْحَمْدُ لِلَّهِ",
        transliteration: "Alḥamdulillāh",
        translation: "All praise is for Allah.",
        virtue: "Fills the Scale (mizan). The best dua is Alhamdulillah. (Muslim 223, Tirmidhi 3383)",
        source: "Muslim 223",
      },
      {
        id: "allahuakbar",
        arabic: "اللَّهُ أَكْبَرُ",
        transliteration: "Allāhu Akbar",
        translation: "Allah is the Greatest.",
        virtue: "Fills what is between the heaven and the earth.",
        source: "Muslim 223",
      },
      {
        id: "la-ilaha-illallah",
        arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ",
        transliteration: "Lā ilāha illAllāh",
        translation: "There is no god but Allah.",
        virtue: "The best dhikr. 'The best thing I and the prophets before me have said is Lā ilāha illAllāhu waḥdahu lā sharīka lah.' (Tirmidhi 3585 — hasan)",
        source: "Tirmidhi 3585",
      },
      {
        id: "subhanallah-wabihamdihi-100",
        arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        transliteration: "SubhānAllāhi wa biḥamdih",
        translation: "Glory and praise be to Allah.",
        count: "100×",
        source: "Bukhari 6405, Muslim 2692",
        virtue: "Whoever says it 100× a day: sins erased even if they were like the foam of the sea.",
      },
      {
        id: "subhanallahil-adheem",
        arabic: "سُبْحَانَ اللَّهِ الْعَظِيمِ",
        transliteration: "SubhānAllāhil-'Aẓīm",
        translation: "Glory be to Allah the Magnificent.",
        source: "Bukhari 6682",
        virtue: "Two phrases beloved to the Most Merciful — light on the tongue but heavy on the Scale.",
      },
      {
        id: "la-hawla",
        arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
        transliteration: "Lā ḥawla wa lā quwwata illā billāh",
        translation: "There is no power or might except with Allah.",
        source: "Bukhari 6409, Muslim 2704",
        virtue: "It is a treasure from the treasures of Paradise. (Bukhari 4205). Cure for 99 ailments, the least of which is worry.",
      },
      {
        id: "hasbunallah",
        arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
        transliteration: "Ḥasbunallāhu wa ni'mal-wakīl",
        translation: "Sufficient for us is Allah, and He is the best Disposer of affairs.",
        source: "Quran 3:173 — words of Ibrahim ﷺ in the fire, and the believers when told their enemies gathered against them",
        virtue: "Ibrahim ﷺ said this when thrown into the fire. The Prophet ﷺ said Ibrahim and Muhammad both said this in their greatest trials.",
      },
      {
        id: "tahleel-complete",
        arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        transliteration: "Lā ilāha illAllāhu waḥdahu lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa huwa 'alā kulli shay'in qadīr",
        translation: "There is no god but Allah, alone without partner. His is the dominion and His is the praise, and He has power over all things.",
        count: "100×",
        source: "Bukhari 3293, Muslim 2691",
        virtue: "Whoever says it 100× in a day: rewarded as if freeing 10 slaves, 100 good deeds recorded, 100 sins erased. Protection from Shaytan for the day.",
      },
    ],
  },

  // ── Istighfar ─────────────────────────────────────────────────────────────────
  {
    id: "istighfar",
    label: "Istighfar",
    labelAr: "الاسْتِغْفَار",
    emoji: "🤲",
    items: [
      {
        id: "sayyid-istighfar",
        arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
        transliteration: "Allāhumma anta rabbī lā ilāha illā ant, khalaqtanī wa anā 'abduk, wa anā 'alā 'ahdika wa wa'dika mastata't, a'ūdhu bika min sharri mā ṣana't, abū'u laka bini'matika 'alayya, wa abū'u bidhanbī faghfir lī, fa'innahu lā yaghfirudh-dhunūba illā ant",
        translation: "O Allah, You are my Lord. There is no god but You. You created me and I am Your servant. I am upon Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your blessing upon me and I acknowledge my sins, so forgive me — for none forgives sins except You.",
        source: "Bukhari 6306",
        virtue: "Sayyid al-Istighfar — master of all prayers for forgiveness. If said in the morning or evening with certainty, and you die before the other time arrives, you enter Paradise.",
      },
      {
        id: "astaghfirullah-100",
        arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
        transliteration: "Astaghfirullāha wa atūbu ilayh",
        translation: "I seek forgiveness from Allah and repent to Him.",
        count: "100×",
        source: "Bukhari 6307",
        virtue: "The Prophet ﷺ said: 'By Allah, I seek forgiveness from Allah and repent to Him more than 70 times a day.'",
      },
      {
        id: "astaghfirullah-adheem",
        arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
        transliteration: "Astaghfirullāhal-'Aẓīmal-ladhī lā ilāha illā huwal-Ḥayyul-Qayyūmu wa atūbu ilayh",
        translation: "I seek forgiveness from Allah the Magnificent, besides Whom there is no god, the Ever-Living, the Sustainer of existence, and I repent to Him.",
        source: "Abu Dawud 1517, Tirmidhi 3577 — authenticated",
        virtue: "Allah will forgive him even if he fled from battle. (Tirmidhi 3577)",
      },
      {
        id: "tawbah-dhulm",
        arabic: "رَبِّ إِنِّي ظَلَمْتُ نَفْسِي فَاغْفِرْ لِي",
        transliteration: "Rabbi innī ẓalamtu nafsī faghfir lī",
        translation: "My Lord, I have wronged myself, so forgive me.",
        source: "Quran 28:16 — dua of Musa ﷺ after striking the man",
        virtue: "The dua Musa ﷺ made after his mistake — and Allah forgave him. A model of immediate sincere repentance.",
      },
      {
        id: "yunus-dua",
        arabic: "لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
        transliteration: "Lā ilāha illā anta subḥānaka innī kuntu minaẓ-ẓālimīn",
        translation: "There is no god but You; Glory be to You. Indeed, I have been of the wrongdoers.",
        source: "Quran 21:87 — dua of Yunus ﷺ inside the whale",
        virtue: "Dua al-Karbah. No Muslim who is in distress calls with this except that Allah responds. (Tirmidhi 3505, authenticated by al-Albani)",
      },
    ],
  },

  // ── Salawat ───────────────────────────────────────────────────────────────────
  {
    id: "salawat",
    label: "Salawat",
    labelAr: "الصَّلَوَاتُ عَلَى النَّبِيِّ ﷺ",
    emoji: "💚",
    items: [
      {
        id: "salawat-ibrahimiyyah",
        arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
        transliteration: "Allāhumma ṣalli 'alā Muḥammadin wa 'alā āli Muḥammad, kamā ṣallayta 'alā Ibrāhīma wa 'alā āli Ibrāhīm, innaka Ḥamīdun Majīd. Allāhumma bārik 'alā Muḥammadin wa 'alā āli Muḥammad, kamā bārakta 'alā Ibrāhīma wa 'alā āli Ibrāhīm, innaka Ḥamīdun Majīd",
        translation: "O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and upon the family of Ibrahim. Indeed, You are Praiseworthy and Glorious. O Allah, bless Muhammad and the family of Muhammad as You blessed Ibrahim and the family of Ibrahim. Indeed, You are Praiseworthy and Glorious.",
        source: "Bukhari 3370, Muslim 406",
        virtue: "The Salawat al-Ibrahimiyyah — the most complete form of salah upon the Prophet ﷺ, taught by him directly when asked by the companions.",
      },
      {
        id: "salawat-simple",
        arabic: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
        transliteration: "Allāhumma ṣalli wa sallim 'alā nabiyyinā Muḥammad",
        translation: "O Allah, send prayers and peace upon our Prophet Muhammad.",
        source: "Established form — widely transmitted",
        virtue: "The Prophet ﷺ said: 'Whoever sends one salah upon me, Allah sends ten upon him, erases ten sins, and raises him ten degrees.' (Muslim 384)",
      },
      {
        id: "salawat-friday",
        arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ النَّبِيِّ الْأُمِّيِّ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ",
        transliteration: "Allāhumma ṣalli 'alā Muḥammadin-nabiyyil-ummiyyi wa 'alā ālihi wa ṣaḥbihi wa sallim",
        translation: "O Allah, send blessings and peace upon Muhammad, the unlettered Prophet, and upon his family and companions.",
        source: "Widely used form based on prophetic instruction",
        virtue: "Send abundant salawat on Fridays — it is the most virtuous day. The Prophet ﷺ said: 'Friday is the best of your days, so send much salawat upon me on it.' (Abu Dawud 1047 — authenticated)",
      },
      {
        id: "salawat-10-jumu'ah",
        arabic: "صَلُّوا عَلَيَّ كَثِيرًا فِي يَوْمِ الْجُمُعَةِ",
        transliteration: "Ṣallū 'alayya kathīran fī yawmil-jumu'ah",
        translation: "Send abundant prayers upon me on Friday.",
        count: "80×",
        source: "Abu Dawud 1047, Ibn Majah 1636 — authenticated by al-Albani",
        virtue: "Whoever sends 80 salawat on the Prophet ﷺ on Friday — his sins of 80 years are forgiven. (al-Bayhaqi — some scholars authenticate it)",
      },
    ],
  },

  // ── Before Sleep ──────────────────────────────────────────────────────────────
  {
    id: "sleep",
    label: "Before Sleep",
    labelAr: "قَبْلَ النَّوْم",
    emoji: "🌛",
    items: [
      {
        id: "bismika-amutu",
        arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        transliteration: "Bismika Allāhumma amūtu wa aḥyā",
        translation: "In Your name, O Allah, I die and I live.",
        count: "1×",
        source: "Bukhari 6312",
        virtue: "Said when lying down to sleep. Waking is treated as being brought back to life.",
      },
      {
        id: "tasbeeh-fatimah-sleep",
        arabic: "سُبْحَانَ اللَّهِ ×٣٣ • الْحَمْدُ لِلَّهِ ×٣٣ • اللَّهُ أَكْبَرُ ×٣٤",
        transliteration: "SubhānAllāh ×33 • Alhamdulillāh ×33 • Allāhu Akbar ×34",
        translation: "Glory be to Allah (33) • All praise is for Allah (33) • Allah is the Greatest (34)",
        count: "33+33+34",
        source: "Bukhari 6318, Muslim 2727",
        virtue: "Tasbeeh of Fatimah at bedtime. Better for you than a servant. You will not tire, and it is better than the world and everything in it.",
      },
      {
        id: "ayat-kursi-sleep",
        arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ…",
        transliteration: "Allāhu lā ilāha illā huwal-Ḥayyul-Qayyūm… (2:255)",
        translation: "Recite Āyat al-Kursī before sleeping.",
        count: "1×",
        source: "Bukhari 2311",
        virtue: "Whoever recites it when he goes to bed, Allah appoints a guardian for him and no Shaytan approaches him until morning.",
      },
      {
        id: "muawwidhat-sleep",
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ • قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ • قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        transliteration: "Sūrah al-Ikhlāṣ • Sūrah al-Falaq • Sūrah an-Nās",
        translation: "Recite the Three Quls, blowing into your hands and wiping over your body — three times.",
        count: "3×",
        source: "Bukhari 5017",
        virtue: "Aisha (RA) reported: The Prophet ﷺ would recite these three, blow into his cupped hands and pass them over his face and the rest of his body — doing this three times every night.",
      },
      {
        id: "dua-sleep-protection",
        arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
        transliteration: "Allāhumma qinī 'adhābaka yawma tab'athu 'ibādak",
        translation: "O Allah, protect me from Your punishment on the Day You resurrect Your servants.",
        count: "3×",
        source: "Abu Dawud 5045, Tirmidhi 3398",
      },
      {
        id: "barak-allah-sleep",
        arabic: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ",
        transliteration: "Bismika rabbī waḍa'tu janbī, wa bika arfa'uh, fa'in amsakta nafsī farḥamhā, wa in arsaltahā faḥfaẓhā bimā taḥfaẓu bihi 'ibādakaṣ-ṣāliḥīn",
        translation: "In Your name, my Lord, I lay my side, and by You I raise it. If You take my soul, then have mercy on it; if You release it, guard it with what You guard Your righteous servants.",
        count: "1×",
        source: "Bukhari 6320, Muslim 2714",
      },
    ],
  },

  // ── Eating & Drinking ────────────────────────────────────────────────────────
  {
    id: "eating",
    label: "Eating",
    labelAr: "أَذْكَارُ الطَّعَام",
    emoji: "🍽️",
    items: [
      {
        id: "bismillah-eating",
        arabic: "بِسْمِ اللَّهِ",
        transliteration: "Bismillāh",
        translation: "In the name of Allah.",
        count: "1× (before eating)",
        source: "Abu Dawud 3767, Tirmidhi 1858",
        virtue: "If one forgets to say it at the start, say: 'Bismillāhi awwalahu wa ākhirah' (In the name of Allah at its beginning and its end). The Shaytan cannot eat with you.",
      },
      {
        id: "bismillah-forgot",
        arabic: "بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ",
        transliteration: "Bismillāhi awwalahu wa ākhirah",
        translation: "In the name of Allah at its beginning and its end.",
        count: "1× (if forgotten at start)",
        source: "Abu Dawud 3767 — authenticated by al-Albani",
        virtue: "Said when one forgets Bismillah at the beginning; it covers the meal as if it was said from the start.",
      },
      {
        id: "alhamdulillah-eating",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَٰذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
        transliteration: "Alḥamdulillāhil-ladhī aṭ'amanī hādhā wa razaqanīhi min ghayri ḥawlin minnī wa lā quwwah",
        translation: "All praise is for Allah Who has given me this food and provided it for me without any might or power on my part.",
        count: "1× (after eating)",
        source: "Abu Dawud 4023, Tirmidhi 3458 — authenticated",
        virtue: "His past sins are forgiven.",
      },
      {
        id: "dua-host",
        arabic: "اللَّهُمَّ أَطْعِمْ مَنْ أَطْعَمَنِي وَاسْقِ مَنْ سَقَانِي",
        transliteration: "Allāhumma aṭ'im man aṭ'amanī wasqi man saqānī",
        translation: "O Allah, feed the one who fed me and give drink to the one who gave me drink.",
        count: "1× (dua for host)",
        source: "Muslim 2055",
      },
      {
        id: "dua-breaking-fast",
        arabic: "اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ",
        transliteration: "Allāhumma laka ṣumtu wa 'alā rizqika afṭart",
        translation: "O Allah, for You I have fasted and upon Your provision I break my fast.",
        count: "1× (Iftar)",
        source: "Abu Dawud 2358 — authenticated by al-Albani",
      },
      {
        id: "dhahaba-thama",
        arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ",
        transliteration: "Dhahaba-ẓ-ẓama'u wabtallatil-'urūqu wa thabatal-ajru in shā'Allāh",
        translation: "The thirst has gone, the veins are moistened, and the reward is confirmed, if Allah wills.",
        count: "1× (after Iftar)",
        source: "Abu Dawud 2357, authenticated by Ibn al-Qayyim",
      },
    ],
  },

  // ── Entering & Leaving Home ───────────────────────────────────────────────────
  {
    id: "home",
    label: "Home",
    labelAr: "دُعَاءُ الْبَيْت",
    emoji: "🏠",
    items: [
      {
        id: "entering-home",
        arabic: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
        transliteration: "Bismillāhi walajnā, wa bismillāhi kharajnā, wa 'alAllāhi rabbinā tawakkalnā",
        translation: "In the name of Allah we enter, in the name of Allah we leave, and upon Allah our Lord we rely.",
        count: "1× (entering home)",
        source: "Abu Dawud 5096 — authenticated by al-Albani",
        virtue: "Then greet your family. The Shaytan says to his companions: 'There is no lodging for you here tonight.'",
      },
      {
        id: "leaving-home",
        arabic: "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
        transliteration: "Bismillāh, tawakkaltu 'alAllāh, wa lā ḥawla wa lā quwwata illā billāh",
        translation: "In the name of Allah, I place my trust in Allah, and there is no power or might except with Allah.",
        count: "1× (leaving home)",
        source: "Abu Dawud 5095, Tirmidhi 3426 — authenticated",
        virtue: "It will be said to him: 'You are guided, defended, and protected.' The Shaytan leaves him.",
      },
    ],
  },

  // ── Mosque ────────────────────────────────────────────────────────────────────
  {
    id: "mosque",
    label: "Mosque",
    labelAr: "دُعَاءُ الْمَسْجِد",
    emoji: "🕌",
    items: [
      {
        id: "entering-mosque",
        arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
        transliteration: "Allāhumma aftaḥ lī abwāba raḥmatik",
        translation: "O Allah, open for me the doors of Your mercy.",
        count: "1× (entering mosque — with right foot first)",
        source: "Muslim 713",
      },
      {
        id: "leaving-mosque",
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
        transliteration: "Allāhumma innī as'aluka min faḍlik",
        translation: "O Allah, I ask You of Your bounty.",
        count: "1× (leaving mosque — with left foot first)",
        source: "Muslim 713",
      },
      {
        id: "entering-mosque-full",
        arabic: "أَعُوذُ بِاللَّهِ الْعَظِيمِ وَبِوَجْهِهِ الْكَرِيمِ وَسُلْطَانِهِ الْقَدِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
        transliteration: "A'ūdhu billāhil-'Aẓīmi wa biwajhihil-karīmi wa sulṭānihil-qadīmi minash-shayṭānir-rajīm",
        translation: "I seek refuge in Allah the Magnificent, in His noble Face, and in His eternal power, from the accursed Shaytan.",
        count: "1× (upon entering the mosque)",
        source: "Abu Dawud 466 — authenticated by al-Albani",
        virtue: "The Shaytan says: 'This person is protected from me for the rest of the day.'",
      },
    ],
  },

  // ── After Wudu ───────────────────────────────────────────────────────────────
  {
    id: "wudu",
    label: "After Wudu",
    labelAr: "دُعَاءُ بَعْدَ الْوُضُوء",
    emoji: "💧",
    items: [
      {
        id: "shahadah-wudu",
        arabic: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
        transliteration: "Ashhadu an lā ilāha illAllāhu waḥdahu lā sharīka lah, wa ashhadu anna Muḥammadan 'abduhu wa rasūluh",
        translation: "I bear witness that there is no god but Allah, alone without partner, and I bear witness that Muhammad is His servant and messenger.",
        count: "1× (after wudu)",
        source: "Muslim 234",
        virtue: "The eight gates of Paradise are opened for him; he may enter through whichever he wishes.",
      },
      {
        id: "allahumma-ijalni-wudu",
        arabic: "اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ",
        transliteration: "Allāhumma ij'alnī minat-tawwābīna waj'alnī minal-mutaṭahhirīn",
        translation: "O Allah, make me among those who repent and make me among those who purify themselves.",
        count: "1× (after wudu)",
        source: "Tirmidhi 55 — authenticated by al-Albani",
      },
      {
        id: "subhanaka-wudu",
        arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ",
        transliteration: "Subḥānaka Allāhumma wa biḥamdik, ashhadu an lā ilāha illā ant, astaghfiruka wa atūbu ilayk",
        translation: "Glory and praise be to You, O Allah. I bear witness that there is no god but You. I seek Your forgiveness and repent to You.",
        count: "1× (sealing wudu)",
        source: "Nasa'i in 'Amal al-Yawm wal-Layla — authenticated",
        virtue: "Said as a seal (kaffara) for any errors made during the wudu.",
      },
    ],
  },

  // ── Travel ────────────────────────────────────────────────────────────────────
  {
    id: "travel",
    label: "Travel",
    labelAr: "أَذْكَارُ السَّفَر",
    emoji: "✈️",
    items: [
      {
        id: "dua-travel-vehicle",
        arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
        transliteration: "Subḥānal-ladhī sakhkhara lanā hādhā wa mā kunnā lahu muqrinīn, wa innā ilā rabbinā lamunqalibūn",
        translation: "Glory be to Him Who has subjected this to us, and we would not have been capable of it by ourselves. And indeed, to our Lord we are returning.",
        count: "1× (upon riding a vehicle)",
        source: "Abu Dawud 2602, Tirmidhi 3446 — authenticated",
      },
      {
        id: "allahumma-hawwin-safar",
        arabic: "اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَٰذَا وَاطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ وَالْخَلِيفَةُ فِي الْأَهْلِ",
        transliteration: "Allāhumma hawwin 'alaynā safaranā hādhā waṭwi 'annā bu'dah, Allāhumma antas-ṣāḥibu fis-safar wal-khalīfatu fil-ahl",
        translation: "O Allah, make this journey easy for us and shorten its distance for us. O Allah, You are the Companion in travel and the Successor (guardian) over the family.",
        count: "1× (at start of journey)",
        source: "Muslim 1342",
      },
      {
        id: "returning-home-dua",
        arabic: "آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ",
        transliteration: "Āyibūna tā'ibūna 'ābidūna lirabbinā ḥāmidūn",
        translation: "We return, repent, worship, and praise our Lord.",
        count: "1× (returning from travel)",
        source: "Muslim 1345",
      },
      {
        id: "dua-town-entry",
        arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيهَا",
        transliteration: "Allāhumma bārik lanā fīhā",
        translation: "O Allah, bless us in it.",
        count: "1× (entering a town)",
        source: "Abu Dawud 2600 — authenticated by al-Albani",
      },
    ],
  },

  // ── Distress & Anxiety ───────────────────────────────────────────────────────
  {
    id: "distress",
    label: "Distress",
    labelAr: "دُعَاءُ الْكَرْب",
    emoji: "🤍",
    items: [
      {
        id: "la-ilaha-illa-anta-distress",
        arabic: "لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
        transliteration: "Lā ilāha illā anta subḥānaka innī kuntu minaẓ-ẓālimīn",
        translation: "There is no god but You; Glory be to You. Indeed, I have been of the wrongdoers.",
        source: "Quran 21:87 — Dua of Yunus ﷺ",
        virtue: "Dua al-Karbah. No Muslim in distress supplicates with it except that Allah responds. (Tirmidhi 3505, authenticated by al-Albani)",
      },
      {
        id: "hasbiyallah-distress",
        arabic: "حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
        transliteration: "Ḥasbiyallāhu lā ilāha illā huw, 'alayhi tawakkaltu wa huwa rabbul-'arshil-'aẓīm",
        translation: "Sufficient for me is Allah. There is no god but Him. Upon Him I rely, and He is the Lord of the Magnificent Throne.",
        count: "7×",
        source: "Abu Dawud 5081 — authenticated",
        virtue: "Allah will suffice him in his concerns of this world and the next.",
      },
      {
        id: "allahumma-rahmataka-arju",
        arabic: "اللَّهُمَّ رَحْمَتَكَ أَرْجُو فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ، وَأَصْلِحْ لِي شَأْنِي كُلَّهُ، لَا إِلَٰهَ إِلَّا أَنْتَ",
        transliteration: "Allāhumma raḥmataka arjū falā takilnī ilā nafsī ṭarfata 'ayn, wa aṣliḥ lī sha'nī kullahu, lā ilāha illā ant",
        translation: "O Allah, I hope for Your mercy, so do not leave me to myself for even the blink of an eye, and set right for me all my affairs. There is no god but You.",
        source: "Abu Dawud 5090 — authenticated by al-Albani",
      },
      {
        id: "allahu-allahu-rabbi",
        arabic: "اللَّهُ اللَّهُ رَبِّي لَا أُشْرِكُ بِهِ شَيْئًا",
        transliteration: "Allāhu Allāhu rabbī lā ushriku bihi shay'ā",
        translation: "Allah, Allah is my Lord. I do not associate anything with Him.",
        source: "Abu Dawud 1525 — authenticated",
        virtue: "Said by the Prophet ﷺ in times of distress.",
      },
      {
        id: "innali-llahi",
        arabic: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا",
        transliteration: "Innā lillāhi wa innā ilayhi rāji'ūn, Allāhumma'jurnī fī muṣībatī wa akhlif lī khayran minhā",
        translation: "Indeed we belong to Allah and to Him we shall return. O Allah, reward me in my affliction and replace it for me with something better.",
        count: "1× (upon calamity or loss)",
        source: "Muslim 918",
        virtue: "Umm Salamah said she said this when her husband died, and Allah gave her the Messenger of Allah ﷺ in his place.",
      },
    ],
  },

  // ── Daily Occasions ───────────────────────────────────────────────────────────
  {
    id: "occasions",
    label: "Daily Life",
    labelAr: "أَذْكَارٌ يَوْمِيَّة",
    emoji: "🌿",
    items: [
      {
        id: "sneezing",
        arabic: "الْحَمْدُ لِلَّهِ",
        transliteration: "Alḥamdulillāh",
        translation: "All praise is for Allah.",
        count: "1× (when sneezing)",
        source: "Bukhari 6224",
        virtue: "The one who sneezes says 'Alhamdulillah'; the one who hears replies 'Yarhamukallah' (May Allah have mercy on you); then the sneezer replies 'Yahdīkumullāhu wa yuṣliḥu bālakum' (May Allah guide you and set your affairs right).",
      },
      {
        id: "mirror-dua",
        arabic: "اللَّهُمَّ أَنْتَ حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي",
        transliteration: "Allāhumma anta ḥassanta khalqī faḥassin khuluqī",
        translation: "O Allah, You have made my physical form beautiful, so make my character beautiful too.",
        count: "1× (looking in a mirror)",
        source: "Ahmad 3662 — authenticated by Ibn Hibban and al-Albani",
      },
      {
        id: "new-clothes",
        arabic: "اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ كَسَوْتَنِيهِ، أَسْأَلُكَ مِنْ خَيْرِهِ وَخَيْرِ مَا صُنِعَ لَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّهِ وَشَرِّ مَا صُنِعَ لَهُ",
        transliteration: "Allāhumma lakal-ḥamdu anta kasawtanīh, as'aluka min khayrihi wa khayri mā ṣuni'a lah, wa a'ūdhu bika min sharrihi wa sharri mā ṣuni'a lah",
        translation: "O Allah, to You is all praise. You have clothed me with it. I ask You for its good and the good of what it was made for, and I seek refuge in You from its evil and the evil of what it was made for.",
        count: "1× (wearing new clothes)",
        source: "Abu Dawud 4020, Tirmidhi 1767 — authenticated",
      },
      {
        id: "anger-dua",
        arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
        transliteration: "A'ūdhu billāhi minash-shayṭānir-rajīm",
        translation: "I seek refuge in Allah from the accursed Shaytan.",
        count: "1× (when feeling anger)",
        source: "Bukhari 6115, Muslim 2610",
        virtue: "The Prophet ﷺ said: 'I know a word — if he says it, his anger will go away: A'ūdhu billāhi minash-shayṭānir-rajīm.'",
      },
      {
        id: "entering-bathroom",
        arabic: "بِسْمِ اللَّهِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
        transliteration: "Bismillāh, Allāhumma innī a'ūdhu bika minal-khubuthi wal-khabā'ith",
        translation: "In the name of Allah. O Allah, I seek refuge in You from the male and female evil ones (jinn).",
        count: "1× (before entering bathroom)",
        source: "Bukhari 142, Muslim 375",
      },
      {
        id: "leaving-bathroom",
        arabic: "غُفْرَانَكَ",
        transliteration: "Ghufrānak",
        translation: "I ask for Your forgiveness.",
        count: "1× (leaving bathroom)",
        source: "Abu Dawud 30, Tirmidhi 7 — authenticated",
        virtue: "The Prophet ﷺ said 'Ghufrānak' when leaving the bathroom.",
      },
      {
        id: "when-it-rains",
        arabic: "اللَّهُمَّ صَيِّبًا نَافِعًا",
        transliteration: "Allāhumma ṣayyiban nāfi'ā",
        translation: "O Allah, may it be a beneficial rain.",
        count: "1× (when it rains)",
        source: "Bukhari 1032",
      },
      {
        id: "after-rain",
        arabic: "مُطِرْنَا بِفَضْلِ اللَّهِ وَرَحْمَتِهِ",
        transliteration: "Muṭirnā bifaḍlillāhi wa raḥmatih",
        translation: "We have been given rain by the grace and mercy of Allah.",
        count: "1× (after rain)",
        source: "Bukhari 846, Muslim 71",
      },
    ],
  },

  // ── Dua for Parents & Family ─────────────────────────────────────────────────
  {
    id: "parents",
    label: "Parents",
    labelAr: "الدُّعَاءُ لِلْوَالِدَيْن",
    emoji: "🤍",
    items: [
      {
        id: "dua-parents-quran",
        arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
        transliteration: "Rabbir-ḥamhumā kamā rabbayānī ṣaghīrā",
        translation: "My Lord, have mercy upon them as they raised me when I was small.",
        source: "Quran 17:24",
        virtue: "The Quranic dua commanded by Allah for children to make for their parents.",
      },
      {
        id: "dua-parents-forgiveness",
        arabic: "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
        transliteration: "Rabbanā-ghfir lī wa liwālidayya wa lil-mu'minīna yawma yaqūmul-ḥisāb",
        translation: "Our Lord, forgive me and my parents and the believers on the Day the account is established.",
        source: "Quran 14:41 — dua of Ibrahim ﷺ",
      },
      {
        id: "dua-enter-paradise-parents",
        arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي، رَبَّنَا وَتَقَبَّلْ دُعَاءِ",
        transliteration: "Rabbij-'alnī muqīmaṣ-ṣalāti wa min dhurriyyatī, rabbanā wa taqabbal du'ā'",
        translation: "My Lord, make me an establisher of prayer, and from my descendants. Our Lord, accept my supplication.",
        source: "Quran 14:40 — dua of Ibrahim ﷺ",
        virtue: "A dua for oneself, one's children, and descendants to remain steadfast in prayer.",
      },
      {
        id: "dua-for-deceased-parents",
        arabic: "اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ",
        transliteration: "Allāhumma-ghfir lahu warḥamhu wa 'āfihi wa'fu 'anh",
        translation: "O Allah, forgive him, have mercy on him, grant him well-being, and pardon him.",
        count: "1× (for deceased parent/person)",
        source: "Muslim 963",
      },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function TasbihModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("after-salah");
  const [query, setQuery] = useState("");

  const category = CATEGORIES.find(c => c.id === activeCategory)!;

  const filtered = query.trim()
    ? CATEGORIES.flatMap(c => c.items).filter(
        i =>
          i.arabic.includes(query) ||
          i.transliteration.toLowerCase().includes(query.toLowerCase()) ||
          i.translation.toLowerCase().includes(query.toLowerCase())
      )
    : category.items;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden gap-0 flex flex-col max-h-[90vh]">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="px-5 pt-5 pb-3 border-b shrink-0">
          <DialogHeader className="mb-3">
            <DialogTitle className="flex items-center gap-2 text-base font-semibold">
              <span>📿</span> {t("tasbih.dialogTitle")}
            </DialogTitle>
          </DialogHeader>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t("tasbih.searchPlaceholder")}
              className="w-full pl-8 pr-8 py-2 text-sm bg-muted/50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ── Category pills ──────────────────────────────── */}
        {!query && (
          <div className="flex gap-1.5 px-4 py-2.5 overflow-x-auto shrink-0 border-b scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* ── Category title ─────────────────────────────── */}
        {!query && (
          <div className="px-5 pt-3 pb-1 shrink-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {category.emoji} {category.label}
            </p>
            <p className="text-sm font-arabic text-muted-foreground mt-0.5" dir="rtl">
              {category.labelAr}
            </p>
          </div>
        )}

        {/* ── Items ──────────────────────────────────────── */}
        <div className="overflow-y-auto flex-1 px-4 pb-5 pt-2 space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {t("tasbih.noResults", { q: query })}
            </div>
          )}

          {filtered.map(item => (
            <div
              key={item.id}
              className="rounded-xl border bg-card p-4 space-y-3 hover:border-primary/30 transition-colors"
            >
              {/* Arabic */}
              <p
                className="text-xl leading-loose font-arabic text-foreground text-right"
                dir="rtl"
              >
                {item.arabic}
              </p>

              {/* Transliteration */}
              <p className="text-xs italic text-muted-foreground leading-relaxed">
                {item.transliteration}
              </p>

              {/* Translation */}
              <p className="text-sm text-foreground/90 leading-relaxed">
                {item.translation}
              </p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {item.count && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                    {item.count}
                  </span>
                )}
                {item.source && (
                  <span className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                    {item.source}
                  </span>
                )}
              </div>

              {/* Virtue / note */}
              {item.virtue && (
                <div className="flex gap-2 bg-amber-500/8 border border-amber-500/20 rounded-lg px-3 py-2">
                  <span className="text-amber-500 text-xs mt-0.5 shrink-0">✦</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.virtue}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
