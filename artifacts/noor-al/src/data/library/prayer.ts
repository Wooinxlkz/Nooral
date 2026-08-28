import type { LibraryCategory } from "./types";

export const prayer: LibraryCategory = {
  id: "prayer",
  title: "How to Pray (Salah)",
  arabicTitle: "كَيْفِيَّة الصَّلَاة",
  description: "Complete step-by-step guide to performing the five daily prayers",
  icon: "HandMetal",
  color: "teal",
  articles: [
    {
      id: "how-to-pray",
      title: "Complete Guide to Salah",
      arabicTitle: "دَلِيل الصَّلَاة الكَامِل",
      description: "Every position, dua, and ruling for performing salah correctly",
      readTime: 15,
      tags: ["salah", "prayer", "essential", "guide"],
      sections: [
        {
          type: "text",
          content:
            "The Prophet ﷺ said: 'Pray as you have seen me praying.' (Bukhari). Salah is the second pillar of Islam and the first thing we will be asked about on the Day of Judgment. It is performed 5 times daily at fixed times.",
          ar: "قال النبي ﷺ: «صلُّوا كما رأيتموني أصلي». (البخاري). الصلاة ركن الإسلام الثاني، وأول ما يُحاسَب عنه العبد يوم القيامة. تُؤدَّى خمس مرات في اليوم في أوقات محددة.",
        },
        {
          type: "heading", level: 2, text: "Daily Prayer Times & Rakat",
        },
        {
          type: "table",
          headers: ["Prayer", "Arabic", "Time", "Rakat (Fard)", "Sunnah"],
          rows: [
            ["Fajr", "الفَجْر", "Dawn to sunrise", "2", "2 before (strong sunnah)"],
            ["Dhuhr", "الظُّهْر", "Midday to Asr", "4", "4 before + 2 after"],
            ["Asr", "العَصْر", "Afternoon to Maghrib", "4", "4 before (optional)"],
            ["Maghrib", "المَغْرِب", "Sunset to Isha", "3", "2 after"],
            ["Isha", "العِشَاء", "Night to Fajr", "4", "2 after + Witr"],
          ],
        },
        {
          type: "heading", level: 2, text: "Preparation Before Prayer",
        },
        {
          type: "list",
          items: [
            "Ensure you have wudoo (ablution)",
            "Wear clean, covering clothing",
            "Find a clean place to pray",
            "Face the Qiblah (direction of the Ka'bah in Makkah)",
            "Make the intention (niyyah) in your heart — no need to say it aloud",
          ],
          itemsAr: [
            "التأكد من توافر الوضوء",
            "ارتداء ملابس نظيفة وساترة للعورة",
            "إيجاد مكان نظيف للصلاة",
            "استقبال القبلة (اتجاه الكعبة المشرفة في مكة المكرمة)",
            "استحضار النية في القلب — لا حاجة للنطق بها",
          ],
        },
        {
          type: "heading", level: 2, text: "Step-by-Step: How to Pray",
        },
        {
          type: "steps",
          items: [
            {
              number: 1,
              title: "Takbirat al-Ihram — Opening Takbir",
              description:
                "Stand upright facing the Qiblah. Raise both hands to shoulder/ear level with palms forward. Say Allahu Akbar. This begins the prayer — you are now in a state of salah and all talk is forbidden.",
              dua: { arabic: "اللَّهُ أَكْبَرُ", transliteration: "Allahu Akbar", translation: "Allah is the Greatest" },
            },
            {
              number: 2,
              title: "Qiyam — Standing",
              description:
                "Place right hand over left hand on the chest. Read the opening dua (Du'a al-Istiftah), then seek refuge from Shaytan, then recite Al-Fatiha, then a surah or some verses of the Quran.",
              dua: {
                arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ",
                transliteration: "Subhanakal-lahumma wa bihamdika wa tabarakasmuka wa ta'ala jadduka wa la ilaha ghayruk",
                translation: "How perfect You are, O Allah, and I praise You. Blessed is Your name, and exalted is Your majesty. There is no deity worthy of worship except You.",
              },
            },
            {
              number: 3,
              title: "Ruku — Bowing",
              description:
                "After the Quran recitation, say Allahu Akbar and bow with back parallel to the ground, hands on knees. Keep the head level with the back. Remain still in this position.",
              dua: { arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ", transliteration: "Subhana Rabbiyal-Adheem", translation: "How perfect is my Lord, the Great." },
            },
            {
              number: 4,
              title: "I'tidal — Rising from Ruku",
              description: "Rise from ruku saying 'Sami Allahu liman hamidah' while raising hands. Stand fully upright then say the praise.",
              dua: {
                arabic: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ، رَبَّنَا وَلَكَ الْحَمْدُ",
                transliteration: "Sami Allahu liman hamidah. Rabbana wa lakal-hamd",
                translation: "Allah hears whoever praises Him. Our Lord, all praise is for You.",
              },
            },
            {
              number: 5,
              title: "Sujud — Prostration",
              description:
                "Say Allahu Akbar and go down to prostrate. Seven body parts must touch the ground: forehead + nose, both palms, both knees, toes of both feet. Fingers pointing toward Qiblah.",
              dua: { arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى", transliteration: "Subhana Rabbiyal-A'la", translation: "How perfect is my Lord, the Most High." },
            },
            {
              number: 6,
              title: "Jalsa — Sitting between Prostrations",
              description: "Rise from sujud saying Allahu Akbar. Sit on the left foot with right foot upright. Say the dua between prostrations.",
              dua: {
                arabic: "رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي",
                transliteration: "Rabb-ighfirli, Rabb-ighfirli",
                translation: "My Lord, forgive me. My Lord, forgive me.",
              },
            },
            {
              number: 7,
              title: "Second Sujud",
              description: "Say Allahu Akbar and prostrate again exactly as the first. Say 'Subhana Rabbiyal-A'la' minimum three times.",
            },
            {
              number: 8,
              title: "Tashahhud — Final Sitting",
              description:
                "In the final rakat, after the second sujud, sit for tashahhud. Sit on the left foot with right foot upright. Point the index finger throughout the tashahhud.",
              dua: {
                arabic:
                  "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّداً عَبْدُهُ وَرَسُولُهُ",
                transliteration:
                  "At-tahiyyatu lillahi was-salawatu wat-tayyibatu. As-salamu alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh. As-salamu alayna wa ala ibadillahis-saliheen. Ash-hadu an la ilaha ill-Allah wa ash-hadu anna Muhammadan abduhu wa rasuluh",
                translation:
                  "All greetings, prayers, and pure words belong to Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous slaves of Allah. I bear witness that there is no deity worthy of worship except Allah, and I bear witness that Muhammad is His slave and Messenger.",
              },
            },
            {
              number: 9,
              title: "Salawat Ibrahim (Salah upon the Prophet ﷺ)",
              description: "After the tashahhud, recite the Abrahamic prayer:",
              dua: {
                arabic:
                  "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
                transliteration:
                  "Allahumma salli ala Muhammadin wa ala ali Muhammad, kama sallayta ala Ibrahima wa ala ali Ibrahim, innaka Hamidun Majeed",
                translation:
                  "O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and upon the family of Ibrahim. Indeed, You are Praiseworthy and Glorious.",
              },
            },
            {
              number: 10,
              title: "Tasleem — Ending the Prayer",
              description:
                "Turn your head to the right and say the tasleem. Then turn to the left and repeat.",
              dua: {
                arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
                transliteration: "As-salamu alaykum wa rahmatullah",
                translation: "Peace be upon you and the mercy of Allah.",
              },
            },
          ],
        },
        {
          type: "heading", level: 2, text: "Common Mistakes in Salah",
        },
        {
          type: "list",
          items: [
            "Not being still (tuma'ninah) in each position — rushing through the movements",
            "Not placing the nose on the ground during sujud — both forehead AND nose must touch",
            "Spreading the elbows outward in sujud like a dog — elbows should be raised",
            "Looking around during prayer",
            "Not facing the exact Qiblah direction",
            "Making sounds during recitation (humming, singing style) that are not part of Quran",
            "Eating, drinking, or talking during prayer — these nullify it",
            "Not completing recitation of Al-Fatiha in each rakat",
          ],
          itemsAr: [
            "عدم الطمأنينة في كل ركن — التسرع في الحركات",
            "عدم وضع الأنف على الأرض في السجود — يجب أن يلمس الجبهة والأنف معاً",
            "نشر المرفقين في السجود كما يفعل الكلب — يجب رفع المرفقين",
            "الالتفات يميناً وشمالاً أثناء الصلاة",
            "عدم استقبال القبلة بدقة",
            "إصدار أصوات غير قرآنية أثناء القراءة كالتلحين المبتدع",
            "الأكل أو الشرب أو الكلام أثناء الصلاة — هذه مبطلات",
            "عدم قراءة الفاتحة كاملةً في كل ركعة",
          ],
        },
        {
          type: "heading", level: 2, text: "What Invalidates Salah",
        },
        {
          type: "list",
          items: [
            "Intentional speech not part of the prayer",
            "Eating or drinking",
            "Excessive movement (three or more consecutive non-prayer movements)",
            "Losing wudoo",
            "Intentionally exposing the awrah",
            "Laughing out loud",
            "Turning the chest away from Qiblah without need",
          ],
          itemsAr: [
            "الكلام المتعمَّد الذي ليس من الصلاة",
            "الأكل أو الشرب",
            "الحركة الكثيرة (ثلاث حركات متتالية أو أكثر ليست من أفعال الصلاة)",
            "نقض الوضوء",
            "كشف العورة عمداً",
            "القهقهة",
            "صرف الصدر عن القبلة بدون حاجة",
          ],
        },
      ],
    },
    {
      id: "friday-prayer",
      title: "Jumu'ah — Friday Prayer",
      arabicTitle: "صَلَاة الجُمُعَة",
      description: "The congregational Friday prayer — rulings and virtues",
      readTime: 6,
      quranRefs: [{ surah: 62, ayah: 9 }],
      tags: ["jumu'ah", "friday", "congregational"],
      sections: [
        {
          type: "quranRef",
          refs: [{ surah: 62, ayah: 9, note: "O you who believe, when the call to prayer is made on the Day of Jumu'ah, hasten to the remembrance of Allah" }],
        },
        {
          type: "text",
          content:
            "Jumu'ah (Friday) prayer is obligatory on every adult male Muslim. It replaces Dhuhr prayer on Fridays. The prayer consists of two rakat preceded by the khutbah (sermon).",
          ar: "صلاة الجمعة واجبة على كل ذكر مسلم بالغ. وهي تحلُّ محل صلاة الظهر يوم الجمعة. وتتكون من ركعتين تسبقهما خطبة الجمعة.",
        },
        {
          type: "list",
          title: "Virtues of Friday",
          titleAr: "فضائل يوم الجمعة",
          items: [
            "The best day of the week — a weekly Eid for Muslims",
            "Allah created Adam on Friday and the Day of Judgment will occur on a Friday (Muslim)",
            "There is an hour on Friday in which dua is accepted (Bukhari & Muslim)",
            "Abundant salawat upon the Prophet ﷺ is recommended",
            "Reading Surah al-Kahf is highly recommended (an-Nasai)",
          ],
          itemsAr: [
            "أفضل أيام الأسبوع — عيد أسبوعي للمسلمين",
            "خلق الله آدم يوم الجمعة، وفيه تقوم الساعة (مسلم)",
            "فيه ساعة لا يوافقها عبد مسلم يسأل الله شيئاً إلا أعطاه (البخاري ومسلم)",
            "يُستحب الإكثار من الصلاة على النبي ﷺ",
            "يُستحب قراءة سورة الكهف (النسائي)",
          ],
        },
        {
          type: "list",
          title: "Sunnah of Friday",
          titleAr: "سنن يوم الجمعة",
          items: [
            "Perform ghusl (most scholars consider it highly recommended)",
            "Wear the best/cleanest clothes",
            "Apply perfume (for men)",
            "Come early to the mosque",
            "Read Surah al-Kahf",
            "Send abundant salawat upon the Prophet ﷺ",
            "Make abundant dua throughout the day",
          ],
          itemsAr: [
            "الغسل (يراه جمهور العلماء سنةً مؤكَّدة)",
            "ارتداء أحسن الثياب وأنظفها",
            "التطيب (للرجال)",
            "التبكير إلى المسجد",
            "قراءة سورة الكهف",
            "الإكثار من الصلاة على النبي ﷺ",
            "الإكثار من الدعاء طوال اليوم",
          ],
        },
      ],
    },
  ],
};
