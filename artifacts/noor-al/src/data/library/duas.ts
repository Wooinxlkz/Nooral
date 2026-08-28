import type { LibraryCategory, Dua } from "./types";

const morningAdhkar: Dua[] = [
  {
    id: "morning-1",
    title: "Morning Dhikr — Opening",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration:
      "Asbahna wa asbahal-mulku lillah, wal-hamdu lillah, la ilaha ill-Allah wahdahu la shareeka lah, lahul-mulku wa lahul-hamd, wa huwa ala kulli shay'in qadeer",
    translation:
      "We have reached the morning and the kingdom belongs to Allah. All praise is for Allah. There is no deity worthy of worship except Allah, alone without partner; to Him belongs the dominion, to Him belongs all praise, and He is over all things capable.",
    source: "Muslim",
    occasion: "Morning",
  },
  {
    id: "morning-2",
    title: "Morning Protection",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
    transliteration:
      "Allahumma bika asbaḥna, wa bika amsayna, wa bika nahya, wa bika namootu, wa ilayk an-nushoor",
    translation:
      "O Allah, by Your leave we have reached the morning and by Your leave we reach the evening, and by You we live and by You we die, and to You is the resurrection.",
    source: "Tirmidhi",
    occasion: "Morning",
  },
];

const eveningAdhkar: Dua[] = [
  {
    id: "evening-1",
    title: "Evening Dhikr — Opening",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration:
      "Amsayna wa amsal-mulku lillah, wal-hamdu lillah, la ilaha ill-Allah wahdahu la shareeka lah, lahul-mulku wa lahul-hamd, wa huwa ala kulli shay'in qadeer",
    translation:
      "We have reached the evening and the kingdom belongs to Allah. All praise is for Allah. There is no deity worthy of worship except Allah, alone without partner; to Him belongs the dominion, to Him belongs all praise, and He is over all things capable.",
    source: "Muslim",
    occasion: "Evening",
  },
  {
    id: "evening-2",
    title: "Evening Protection",
    arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ",
    transliteration:
      "Allahumma bika amsayna wa bika asbaḥna wa bika nahya wa bika namootu wa ilayk al-maseer",
    translation:
      "O Allah, by Your leave we have reached the evening and by Your leave we have reached the morning, and by You we live and by You we die, and to You is our return.",
    source: "Tirmidhi",
    occasion: "Evening",
  },
];

const sleepDuas: Dua[] = [
  {
    id: "sleep-1",
    title: "Before Sleeping — Bismika",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amootu wa ahya",
    translation: "In Your name, O Allah, I die and I live.",
    source: "Bukhari",
    occasion: "Just before sleeping",
  },
  {
    id: "sleep-2",
    title: "Before Sleeping — Ayat al-Kursi",
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
    transliteration: "Allahu la ilaha illa huwal-Hayyul-Qayyoom...",
    translation: "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence...",
    source: "Bukhari — a guardian is appointed over you and Shaytan does not come near you until morning",
    count: 1,
    occasion: "Before sleeping",
  },
  {
    id: "sleep-3",
    title: "Recite Al-Ikhlas, Al-Falaq, An-Nas",
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    transliteration: "Qul huwa Allahu ahad...",
    translation: "Say: He is Allah, [who is] One...",
    source: "Bukhari — blow into hands after each recitation and wipe over body 3 times",
    count: 3,
    occasion: "Before sleeping",
  },
  {
    id: "sleep-4",
    title: "Tasbeeh Before Sleeping",
    arabic: "سُبْحَانَ اللَّهِ، الْحَمْدُ لِلَّهِ، اللَّهُ أَكْبَرُ",
    transliteration: "Subhanallah (33×), Alhamdulillah (33×), Allahu Akbar (34×)",
    translation: "Glory be to Allah. All praise is for Allah. Allah is the Greatest.",
    source: "Bukhari & Muslim — better than a servant (helper) for Fatimah رضي الله عنها",
    occasion: "Before sleeping",
  },
];

const afterSalahDuas: Dua[] = [
  {
    id: "after-salah-1",
    title: "Astaghfirullah",
    arabic: "أَسْتَغْفِرُ اللَّهَ",
    transliteration: "Astaghfirullah",
    translation: "I seek forgiveness from Allah.",
    source: "Muslim",
    count: 3,
    occasion: "Immediately after finishing salah with tasleem",
  },
  {
    id: "after-salah-2",
    title: "Allahumma Antas-Salam",
    arabic: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
    transliteration:
      "Allahumma antas-salamu wa minkas-salam, tabarakta ya dhal-jalali wal-ikram",
    translation:
      "O Allah, You are Peace and from You is peace. Blessed are You, O Possessor of Majesty and Honor.",
    source: "Muslim",
    count: 1,
    occasion: "After tasleem",
  },
  {
    id: "after-salah-3",
    title: "Subhanallah, Alhamdulillah, Allahu Akbar",
    arabic: "سُبْحَانَ اللَّهِ، الْحَمْدُ لِلَّهِ، اللَّهُ أَكْبَرُ",
    transliteration: "Subhanallah (33), Alhamdulillah (33), Allahu Akbar (33)",
    translation: "Glory be to Allah. Praise be to Allah. Allah is the Greatest.",
    source: "Muslim — whoever says this after every prayer will have sins forgiven like sea foam",
    count: 99,
    occasion: "After salah",
  },
  {
    id: "after-salah-4",
    title: "La ilaha ill-Allah (completing the 100)",
    arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration:
      "La ilaha ill-Allahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamd, wa huwa ala kulli shay'in qadeer",
    translation:
      "There is no deity worthy of worship except Allah alone, without partner. His is the dominion, His is the praise, and He is over all things capable.",
    source: "Muslim",
    count: 1,
    occasion: "After the 99 (100th count)",
  },
];

const names99: Dua[] = [
  { id: "name-1", title: "Ar-Rahman", arabic: "ٱلرَّحْمَـٰنُ", transliteration: "Ar-Rahman", translation: "The Most Gracious — encompasses all of creation with mercy", source: "Quran 1:1" },
  { id: "name-2", title: "Ar-Raheem", arabic: "ٱلرَّحِيمُ", transliteration: "Ar-Raheem", translation: "The Most Merciful — special mercy for the believers", source: "Quran 1:1" },
  { id: "name-3", title: "Al-Malik", arabic: "ٱلْمَلِكُ", transliteration: "Al-Malik", translation: "The King — the absolute sovereign over all creation", source: "Quran 59:23" },
  { id: "name-4", title: "Al-Quddus", arabic: "ٱلْقُدُّوسُ", transliteration: "Al-Quddus", translation: "The Most Holy — free from all imperfections and defects", source: "Quran 59:23" },
  { id: "name-5", title: "As-Salam", arabic: "ٱلسَّلَامُ", transliteration: "As-Salam", translation: "The Source of Peace — He who grants peace and is free from all faults", source: "Quran 59:23" },
  { id: "name-6", title: "Al-Mu'min", arabic: "ٱلْمُؤْمِنُ", transliteration: "Al-Mu'min", translation: "The Guardian of Faith — He who gives security and belief", source: "Quran 59:23" },
  { id: "name-7", title: "Al-Muhaymin", arabic: "ٱلْمُهَيْمِنُ", transliteration: "Al-Muhaymin", translation: "The Overseer — He who watches over and protects all things", source: "Quran 59:23" },
  { id: "name-8", title: "Al-Aziz", arabic: "ٱلْعَزِيزُ", transliteration: "Al-Aziz", translation: "The Almighty — the Irresistible, the Incomparably Great", source: "Quran 59:23" },
  { id: "name-9", title: "Al-Jabbar", arabic: "ٱلْجَبَّارُ", transliteration: "Al-Jabbar", translation: "The Compeller — He who compels and restores what is broken", source: "Quran 59:23" },
  { id: "name-10", title: "Al-Mutakabbir", arabic: "ٱلْمُتَكَبِّرُ", transliteration: "Al-Mutakabbir", translation: "The Supreme — possessing all greatness, above all creation", source: "Quran 59:23" },
  { id: "name-11", title: "Al-Khaliq", arabic: "ٱلْخَالِقُ", transliteration: "Al-Khaliq", translation: "The Creator — who creates from nothing", source: "Quran 59:24" },
  { id: "name-12", title: "Al-Bari'", arabic: "ٱلْبَارِئُ", transliteration: "Al-Bari'", translation: "The Originator — who creates with distinction and separation", source: "Quran 59:24" },
  { id: "name-13", title: "Al-Musawwir", arabic: "ٱلْمُصَوِّرُ", transliteration: "Al-Musawwir", translation: "The Fashioner — who gives everything its distinctive form", source: "Quran 59:24" },
  { id: "name-14", title: "Al-Ghaffar", arabic: "ٱلْغَفَّارُ", transliteration: "Al-Ghaffar", translation: "The All-Forgiving — who repeatedly forgives sins", source: "Quran 20:82" },
  { id: "name-15", title: "Al-Qahhar", arabic: "ٱلْقَهَّارُ", transliteration: "Al-Qahhar", translation: "The Subduer — who has power over all things", source: "Quran 13:16" },
  { id: "name-16", title: "Al-Wahhab", arabic: "ٱلْوَهَّابُ", transliteration: "Al-Wahhab", translation: "The Bestower — who gives freely without measure", source: "Quran 3:8" },
  { id: "name-17", title: "Ar-Razzaq", arabic: "ٱلرَّزَّاقُ", transliteration: "Ar-Razzaq", translation: "The Provider — who provides for all of creation", source: "Quran 51:58" },
  { id: "name-18", title: "Al-Fattah", arabic: "ٱلْفَتَّاحُ", transliteration: "Al-Fattah", translation: "The Opener — who opens what is closed and makes things easy", source: "Quran 34:26" },
  { id: "name-19", title: "Al-'Alim", arabic: "ٱلْعَلِيمُ", transliteration: "Al-'Alim", translation: "The All-Knowing — whose knowledge encompasses everything", source: "Quran 2:29" },
  { id: "name-20", title: "Al-Qabid", arabic: "ٱلْقَابِضُ", transliteration: "Al-Qabid", translation: "The Constrictor — who withholds and restricts as He wills", source: "Quran 2:245" },
];

export const duas: LibraryCategory = {
  id: "duas",
  title: "Duas & Adhkar",
  arabicTitle: "الأَدْعِيَة وَالأَذْكَار",
  description: "Daily remembrances, supplications, and the 99 Names of Allah",
  icon: "BookHeart",
  color: "purple",
  articles: [
    {
      id: "morning-adhkar",
      title: "Morning Adhkar",
      arabicTitle: "أَذْكَار الصَّبَاح",
      description: "Supplications and remembrances for the morning",
      readTime: 5,
      tags: ["dhikr", "morning", "daily"],
      sections: [
        {
          type: "text",
          content:
            "The Prophet ﷺ taught us specific adhkar (remembrances) for the morning. These are to be said after Fajr prayer until sunrise. They protect us, grant reward, and connect us to Allah throughout the day.",
          ar: "علَّمنا النبي ﷺ أذكاراً خاصة للصباح. تُقال بعد صلاة الفجر حتى طلوع الشمس. وهي تحفظنا، وتُكسبنا الأجر، وتربطنا بالله طوال اليوم.",
        },
        { type: "duas-list", duas: morningAdhkar },
      ],
    },
    {
      id: "evening-adhkar",
      title: "Evening Adhkar",
      arabicTitle: "أَذْكَار المَسَاء",
      description: "Supplications and remembrances for the evening",
      readTime: 5,
      tags: ["dhikr", "evening", "daily"],
      sections: [
        {
          type: "text",
          content:
            "Evening adhkar are said after Asr prayer until Maghrib. They are a shield against harm and a means of drawing near to Allah as the day ends.",
          ar: "أذكار المساء تُقال بعد صلاة العصر حتى أذان المغرب. وهي درعٌ واقية من الأذى، ووسيلةٌ للتقرب من الله مع انتهاء اليوم.",
        },
        { type: "duas-list", duas: eveningAdhkar },
      ],
    },
    {
      id: "after-salah",
      title: "After Each Salah",
      arabicTitle: "أَذْكَار بَعْدَ الصَّلَاة",
      description: "Remembrances to say after every obligatory prayer",
      readTime: 4,
      tags: ["dhikr", "prayer", "salah"],
      sections: [
        { type: "duas-list", duas: afterSalahDuas },
      ],
    },
    {
      id: "before-sleep",
      title: "Before Sleeping & Waking Up",
      arabicTitle: "أَذْكَار النَّوْم",
      description: "Duas before sleep and upon waking",
      readTime: 4,
      tags: ["dhikr", "sleep"],
      sections: [
        { type: "duas-list", duas: sleepDuas },
      ],
    },
    {
      id: "everyday-duas",
      title: "Everyday Duas",
      arabicTitle: "أَدْعِيَة يَوْمِيَّة",
      description: "Essential duas for daily life situations",
      readTime: 6,
      tags: ["dua", "daily"],
      sections: [
        {
          type: "duas-list",
          title: "Before Eating",
          duas: [
            {
              id: "eat-1",
              title: "Before Eating",
              arabic: "بِسْمِ اللَّهِ",
              transliteration: "Bismillah",
              translation: "In the name of Allah.",
              source: "Muslim — if you forget, say: Bismillahi awwalahu wa akhirahu",
            },
          ],
        },
        {
          type: "duas-list",
          title: "After Eating",
          duas: [
            {
              id: "eat-2",
              title: "After Eating",
              arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا، وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
              transliteration:
                "Alhamdu lillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah",
              translation:
                "Praise be to Allah who fed me this and provided it for me without any strength or power on my part.",
              source: "Tirmidhi — whoever says this will be forgiven his past sins",
            },
          ],
        },
        {
          type: "duas-list",
          title: "Entering the Home",
          duas: [
            {
              id: "home-enter",
              title: "Entering the Home",
              arabic: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
              transliteration:
                "Bismillahi walajna, wa bismillahi kharajna, wa ala Allahi rabbina tawakkalna",
              translation:
                "In the name of Allah we enter, in the name of Allah we leave, and upon Allah our Lord we rely.",
              source: "Abu Dawud",
            },
          ],
        },
        {
          type: "duas-list",
          title: "Dua for Anxiety and Worry",
          duas: [
            {
              id: "anxiety-1",
              title: "Dua for Relief from Distress",
              arabic: "اللَّهُمَّ إِنِّي عَبْدُكَ، ابْنُ عَبْدِكَ، ابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ، أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ، سَمَّيْتَ بِهِ نَفْسَكَ، أَوْ عَلَّمْتَهُ أَحَداً مِنْ خَلْقِكَ، أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ، أَوِ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِنْدَكَ، أَنْ تَجْعَلَ الْقُرْآنَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي، وَجَلَاءَ حُزْنِي، وَذَهَابَ هَمِّي",
              transliteration:
                "Allahumma inni abduk, ibnu abdik, ibnu amatik, nasiyati bi-yadik, madin fiyya hukmuk, adlun fiyya qada'uk, as'aluka bi-kulli ismin huwa lak, sammayta bihi nafsak, aw allamtahu ahadan min khalqik, aw anzaltahu fi kitabik, aw ista'tharta bihi fi ilmil-ghaybi indak, an taj'al al-Qur'ana rabi'a qalbi, wa nura sadri, wa jala'a huzni, wa dhahaba hammi",
              translation:
                "O Allah, I am Your slave, son of Your slave, son of Your female slave. My forelock is in Your hand. Your command over me is forever executed and Your decree over me is just. I ask You by every name belonging to You which You have named Yourself, or revealed in Your Book, or You taught any of Your creation, or You have preserved in the knowledge of the Unseen with You, that You make the Quran the life of my heart and the light of my chest, and a departure for my sorrow and a release for my anxiety.",
              source: "Ahmad — authenticated; Allah will take away his grief and replace it with joy",
            },
          ],
        },
        {
          type: "duas-list",
          title: "Travel Duas",
          duas: [
            {
              id: "travel-1",
              title: "Upon Setting Out",
              arabic: "اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
              transliteration:
                "Allahu Akbar (3x). Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrineen, wa inna ila Rabbina la-munqaliboon",
              translation:
                "Allah is the Greatest (3x). How perfect He is, the One Who has placed this (transport) at our service, and we ourselves would not have been capable of that, and to our Lord is our final destiny.",
              source: "Muslim — Quran 43:13-14",
            },
          ],
        },
      ],
    },
    {
      id: "99-names",
      title: "99 Names of Allah",
      arabicTitle: "أَسْمَاء اللَّهِ الحُسْنَى",
      description: "Al-Asma ul-Husna — the Most Beautiful Names with meanings",
      readTime: 15,
      tags: ["asma", "names", "Allah"],
      sections: [
        {
          type: "text",
          content:
            "The Prophet ﷺ said: 'Allah has ninety-nine names. Whoever preserves them will enter Paradise.' (Bukhari & Muslim). 'Preserving' means memorizing them, understanding their meanings, acting according to them, and calling upon Allah by them.",
          ar: "قال النبي ﷺ: «إن لله تسعةً وتسعين اسماً، مائةً إلا واحداً، من أحصاها دخل الجنة». (البخاري ومسلم). و«الإحصاء» يعني: حفظها، وفهم معانيها، والتخلق بمقتضاها، والتوسل بها إلى الله.",
        },
        { type: "duas-list", title: "The Beautiful Names", duas: names99 },
        {
          type: "callout",
          content:
            "The full 99 names include: Ar-Rahman, Ar-Raheem, Al-Malik, Al-Quddus, As-Salam, Al-Mu'min, Al-Muhaymin, Al-Aziz, Al-Jabbar, Al-Mutakabbir, Al-Khaliq, Al-Bari', Al-Musawwir, Al-Ghaffar, Al-Qahhar, Al-Wahhab, Ar-Razzaq, Al-Fattah, Al-'Alim, Al-Qabid, Al-Basit, Al-Khafid, Ar-Rafi', Al-Mu'izz, Al-Mudhill, As-Sami', Al-Basir, Al-Hakam, Al-'Adl, Al-Latif, Al-Khabir, Al-Halim, Al-'Azim, Al-Ghafur, Ash-Shakur, Al-'Ali, Al-Kabir, Al-Hafiz, Al-Muqit, Al-Hasib, Al-Jalil, Al-Karim, Ar-Raqib, Al-Mujib, Al-Wasi', Al-Hakim, Al-Wadud, Al-Majid, Al-Ba'ith, Ash-Shahid, Al-Haqq, Al-Wakil, Al-Qawi, Al-Matin, Al-Wali, Al-Hamid, Al-Muhsi, Al-Mubdi', Al-Mu'id, Al-Muhyi, Al-Mumit, Al-Hayy, Al-Qayyum, Al-Wajid, Al-Majid, Al-Wahid, Al-Ahad, As-Samad, Al-Qadir, Al-Muqtadir, Al-Muqaddim, Al-Mu'akhkhir, Al-Awwal, Al-Akhir, Az-Zahir, Al-Batin, Al-Wali, Al-Muta'ali, Al-Barr, At-Tawwab, Al-Muntaqim, Al-'Afuww, Ar-Ra'uf, Malikul-Mulk, Dhul-Jalali-wal-Ikram, Al-Muqsit, Al-Jami', Al-Ghani, Al-Mughni, Al-Mani', Ad-Darr, An-Nafi', An-Nur, Al-Hadi, Al-Badi', Al-Baqi, Al-Warith, Ar-Rashid, As-Sabur.",
          ar: "الأسماء التسعة والتسعون الكاملة هي: الرحمن، الرحيم، الملك، القدوس، السلام، المؤمن، المهيمن، العزيز، الجبار، المتكبر، الخالق، البارئ، المصور، الغفار، القهار، الوهاب، الرزاق، الفتاح، العليم، القابض، الباسط، الخافض، الرافع، المعز، المذل، السميع، البصير، الحكم، العدل، اللطيف، الخبير، الحليم، العظيم، الغفور، الشكور، العلي، الكبير، الحفيظ، المقيت، الحسيب، الجليل، الكريم، الرقيب، المجيب، الواسع، الحكيم، الودود، المجيد، الباعث، الشهيد، الحق، الوكيل، القوي، المتين، الولي، الحميد، المحصي، المبدئ، المعيد، المحيي، المميت، الحي، القيوم، الواجد، الماجد، الواحد، الأحد، الصمد، القادر، المقتدر، المقدم، المؤخر، الأول، الآخر، الظاهر، الباطن، الوالي، المتعالي، البر، التواب، المنتقم، العفو، الرؤوف، مالك الملك، ذو الجلال والإكرام، المقسط، الجامع، الغني، المغني، المانع، الضار، النافع، النور، الهادي، البديع، الباقي، الوارث، الرشيد، الصبور.",
        },
      ],
    },
  ],
};
