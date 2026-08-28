import type { LibraryCategory } from "./types";

export const history: LibraryCategory = {
  id: "history",
  title: "Islamic History",
  arabicTitle: "التَّارِيخ الإِسْلَامِي",
  description: "The major events of Islamic history from pre-Islamic Arabia to the modern world",
  icon: "Clock",
  color: "orange",
  articles: [
    {
      id: "major-timeline",
      title: "Major Events Timeline",
      arabicTitle: "أَبْرَز الأَحْدَاث التَّارِيخِيَّة",
      description: "A chronological overview of Islamic history's most significant events",
      readTime: 15,
      tags: ["history", "timeline", "overview"],
      sections: [
        {
          type: "text",
          content:
            "Islamic history spans over 1,400 years and encompasses the rise of a faith that shaped civilizations across three continents. Below is a chronological overview of the most significant events.",
          ar: "يمتد التاريخ الإسلامي على أكثر من ألف وأربعمائة عام، ويشمل نهوض دين شكَّل حضارات عبر ثلاث قارات. وفيما يلي نظرة زمنية شاملة على أبرز الأحداث.",
        },
        {
          type: "timeline",
          events: [
            {
              date: "Pre-570 CE",
              title: "Pre-Islamic Arabia (Jahiliyyah)",
              titleAr: "شِبه الجزيرة العربية قبل الإسلام (الجاهلية)",
              description:
                "The Arabian Peninsula is a land of tribal warfare, idol worship, and social injustice. The Ka'bah in Makkah is surrounded by 360 idols. Female infanticide is practiced. Slavery is common.",
              descriptionAr: "شِبه الجزيرة العربية ساحةُ حروبٍ قبلية وعبادة أصنام وظلم اجتماعي. كانت الكعبة تحيط بها ثلاثمائة وستون صنماً، وكانت وأد البنات سائداً، والرقّ منتشراً.",
              significance: "Understanding the context into which Islam was revealed highlights the transformative nature of the message.",
              significanceAr: "فهم السياق الذي نزل فيه الإسلام يُجلِّي الطابع التحويلي الشامل لهذه الرسالة.",
            },
            {
              date: "570 CE",
              title: "Birth of the Prophet Muhammad ﷺ",
              titleAr: "مولد النبي محمد ﷺ",
              description:
                "Born in Makkah in the Banu Hashim clan of the Quraysh tribe. Known as Al-Amin (the Trustworthy) from a young age.",
              descriptionAr: "وُلد في مكة المكرمة من بني هاشم من قريش. عُرف منذ صغره بـ«الأمين».",
            },
            {
              date: "610 CE",
              title: "First Revelation",
              titleAr: "نزول الوحي الأول",
              description:
                "At age 40, in the Cave of Hira on Jabal al-Nour, the first revelation descends: 'Read in the name of your Lord...' (96:1). The Islamic era begins.",
              descriptionAr: "في سن الأربعين، في غار حراء بجبل النور، نزلت أولى الآيات: ﴿اقْرَأْ بِاسْمِ رَبِّكَ﴾ (96:1). وكان ذلك بداية العهد الإسلامي.",
              quranRef: { surah: 96, ayah: 1 },
            },
            {
              date: "613 CE",
              title: "Public Preaching Begins",
              titleAr: "انطلاق الدعوة الجهرية",
              description:
                "The Prophet ﷺ commanded to preach openly. Quraysh leaders begin persecution of early Muslims.",
              descriptionAr: "أُمر النبي ﷺ بالجهر بالدعوة، فبدأ زعماء قريش باضطهاد المسلمين الأوائل.",
            },
            {
              date: "615 CE",
              title: "First Hijra to Abyssinia",
              titleAr: "الهجرة الأولى إلى الحبشة",
              description:
                "First emigration of Muslims to the Christian Kingdom of Abyssinia under King Negus, who grants them protection.",
              descriptionAr: "أولى هجرات المسلمين إلى المملكة المسيحية في الحبشة بقيادة الملك النجاشي الذي منحهم الأمان.",
            },
            {
              date: "619 CE",
              title: "Year of Grief (Aam al-Huzn)",
              titleAr: "عام الحزن",
              description:
                "Death of Khadijah (the Prophet's ﷺ wife and first supporter) and Abu Talib (his uncle and protector). The Prophet ﷺ faces increased hostility.",
              descriptionAr: "وفاة خديجة رضي الله عنها — زوج النبي ﷺ وأول مؤازريه — ووفاة عمه أبي طالب حاميه. وازداد الأذى الموجَّه إلى النبي ﷺ بعد رحيلهما.",
            },
            {
              date: "620 CE",
              title: "Isra and Mi'raj — The Night Journey",
              titleAr: "الإسراء والمعراج",
              description:
                "The miraculous night journey from Makkah to Jerusalem and ascension through the seven heavens. The five daily prayers prescribed.",
              descriptionAr: "الرحلة المعجزة من مكة المكرمة إلى المسجد الأقصى ثم العروج عبر السماوات السبع. وفيها فُرضت الصلوات الخمس.",
            },
            {
              date: "622 CE",
              title: "The Hijra — Migration to Madinah",
              titleAr: "الهجرة النبوية إلى المدينة",
              description:
                "The Prophet ﷺ and Muslims migrate from Makkah to Madinah (Yathrib). Year 1 of the Islamic calendar (AH — After Hijra). The Constitution of Madinah establishes a new social order.",
              descriptionAr: "هاجر النبي ﷺ والمسلمون من مكة إلى المدينة المنورة (يثرب). وأرَّخ المسلمون بهذا الحدث تقويمهم الهجري (سنة 1 هـ). وأرست وثيقة المدينة نظاماً اجتماعياً جديداً.",
              significance: "The Hijra is the turning point — the Muslim community transforms from a persecuted minority to a structured state.",
              significanceAr: "الهجرة هي نقطة التحوُّل — تحوَّل المجتمع المسلم من أقلية مضطهَدة إلى دولة منظَّمة راسخة.",
            },
            {
              date: "624 CE (2 AH)",
              title: "Battle of Badr",
              titleAr: "غزوة بدر الكبرى",
              description:
                "First major battle. 313 Muslims defeat an army of ~1000 Quraysh. A decisive victory that boosted morale and established Muslim military capability.",
              descriptionAr: "أولى المعارك الكبرى. انتصر ثلاثة عشر ومائة وثلاثمائة مسلم على جيش من نحو ألف قرشي. نصرٌ حاسم رفع المعنويات وأثبت القدرة العسكرية للمسلمين.",
              quranRef: { surah: 8, ayah: 1 },
            },
            {
              date: "625 CE (3 AH)",
              title: "Battle of Uhud",
              titleAr: "غزوة أُحُد",
              description:
                "Muslims initially advance but archers leave their posts, allowing a cavalry flanking attack. 70 Muslim martyrs including Hamza ibn Abd al-Muttalib. A lesson in obedience.",
              descriptionAr: "تقدَّم المسلمون في بادئ الأمر، ثم تركت فئة من الرماة مواقعهم مما أتاح لفرسان العدو التفافاً خاطفاً. استُشهد سبعون مسلماً، منهم حمزة بن عبد المطلب. درسٌ في أهمية الطاعة.",
              quranRef: { surah: 3, ayah: 121 },
            },
            {
              date: "627 CE (5 AH)",
              title: "Battle of Khandaq (The Trench)",
              titleAr: "غزوة الخندق (الأحزاب)",
              description:
                "The Quraysh allied with other tribes (~10,000 strong) march on Madinah. Salman al-Farsi suggests digging a defensive trench. The alliance fails after 27 days and withdraws.",
              descriptionAr: "تحالفت قريش مع قبائل أخرى (نحو عشرة آلاف مقاتل) وزحفت على المدينة. اقترح سلمان الفارسي حفر خندق دفاعي. انسحب الأحزاب بعد سبعة وعشرين يوماً دون أن يحققوا شيئاً.",
            },
            {
              date: "628 CE (6 AH)",
              title: "Treaty of Hudaybiyyah",
              titleAr: "صلح الحديبية",
              description:
                "A 10-year peace treaty with Quraysh. Though initially seen as unfavorable, Allah calls it 'a clear victory' (48:1). It enabled massive expansion of Islam.",
              descriptionAr: "معاهدة سلام لعشر سنوات مع قريش. رغم ما بدا فيها من إجحاف ظاهري، وصفه الله بـ﴿الفَتْحِ الْمُبِين﴾ (48:1). وقد أتاحت انتشاراً واسعاً للإسلام.",
              quranRef: { surah: 48, ayah: 1 },
            },
            {
              date: "630 CE (8 AH)",
              title: "Conquest of Makkah",
              titleAr: "فتح مكة المكرمة",
              description:
                "After Quraysh breaks the treaty, 10,000 Muslim soldiers march on Makkah. Near-bloodless conquest. The Prophet ﷺ grants general amnesty. Idols in the Ka'bah destroyed.",
              descriptionAr: "إثر نقض قريش للمعاهدة، زحف عشرة آلاف مسلم على مكة المكرمة. كان الفتح شبه دموي. ومنح النبي ﷺ عفواً عاماً. وأُزيلت الأصنام من الكعبة المشرفة.",
              significance: "The transformation of Makkah — from the city that rejected Islam to the spiritual center of the Muslim world.",
              significanceAr: "تحوُّل مكة المكرمة — من المدينة التي رفضت الإسلام إلى المركز الروحي للعالم الإسلامي.",
            },
            {
              date: "632 CE (10 AH)",
              title: "Farewell Hajj and Death of the Prophet ﷺ",
              titleAr: "حجة الوداع ووفاة النبي ﷺ",
              description:
                "The Prophet ﷺ performs his only Hajj with 100,000+ companions. Delivers the Farewell Sermon enshrining human rights and equality. Dies aged 63 in Madinah.",
              descriptionAr: "أدَّى النبي ﷺ حجته الوحيدة مع أكثر من مائة ألف صحابي. وألقى خطبة الوداع التي كرَّست حقوق الإنسان والمساواة. وتوفي ﷺ عن ثلاث وستين عاماً في المدينة المنورة.",
            },
            {
              date: "632–634 CE",
              title: "Abu Bakr — First Caliph",
              titleAr: "أبو بكر الصديق — الخليفة الأول",
              description:
                "First of the Rightly Guided Caliphs (Khulafa Rashidun). Unifies Arabia after apostasy wars (Ridda wars). Begins compilation of the Quran.",
              descriptionAr: "أول الخلفاء الراشدين. وحَّد شبه الجزيرة العربية إثر حروب الردة. وبدأ جمع القرآن الكريم.",
            },
            {
              date: "634–644 CE",
              title: "Umar ibn al-Khattab — Second Caliph",
              titleAr: "عمر بن الخطاب — الخليفة الثاني",
              description:
                "Greatest expansion of the Islamic state — Persia, Syria, Egypt, Iraq, and Palestine come under Muslim governance. Jerusalem opened peacefully. Al-Aqsa Mosque secured.",
              descriptionAr: "أعظم توسعات الدولة الإسلامية — دخلت فارس وسوريا ومصر والعراق وفلسطين تحت الحكم الإسلامي. وفُتحت القدس سلماً وصينت حرمة المسجد الأقصى.",
            },
            {
              date: "644–656 CE",
              title: "Uthman ibn Affan — Third Caliph",
              titleAr: "عثمان بن عفان — الخليفة الثالث",
              description:
                "Standardizes the written Mushaf (Quran) and distributes it across the empire. Navy established. Assassinated — beginning of internal strife.",
              descriptionAr: "وحَّد المصحف الشريف ووزَّعه في أنحاء المملكة. وأنشأ الأسطول البحري. واغتيل، فكان ذلك بداية الفتنة الداخلية.",
            },
            {
              date: "656–661 CE",
              title: "Ali ibn Abi Talib — Fourth Caliph",
              titleAr: "علي بن أبي طالب — الخليفة الرابع",
              description:
                "Period marked by civil strife (fitna). Battles of Jamal and Siffin. Ali assassinated in Kufa.",
              descriptionAr: "اتسمت فترة خلافته بالفتن الداخلية. وشهدت معركتَي الجمل وصفين. واغتيل رضي الله عنه في الكوفة.",
            },
            {
              date: "661–750 CE",
              title: "Umayyad Caliphate",
              titleAr: "الدولة الأموية",
              description:
                "Capital moved to Damascus. Expansion continues into Spain (711 CE — Tariq ibn Ziyad), Central Asia, and the Indian subcontinent. Dome of the Rock built (691 CE).",
              descriptionAr: "انتقلت العاصمة إلى دمشق. واستمر التوسع حتى بلغ الأندلس (711م — طارق بن زياد) ووسط آسيا وشبه القارة الهندية. وبُنيت قبة الصخرة (691م).",
            },
            {
              date: "750–1258 CE",
              title: "Abbasid Caliphate — The Islamic Golden Age",
              titleAr: "الدولة العباسية — العصر الذهبي الإسلامي",
              description:
                "Capital in Baghdad. A period of extraordinary intellectual flourishing — mathematics, astronomy, medicine, philosophy. Scholars like al-Khwarizmi (algebra), Ibn Sina (medicine), al-Biruni (geography).",
              descriptionAr: "بغداد عاصمةً. فترة ازدهار فكري استثنائي في الرياضيات والفلك والطب والفلسفة. علماء أمثال الخوارزمي (الجبر) وابن سينا (الطب) والبيروني (الجغرافيا).",
              significance: "Much of ancient Greek knowledge preserved and advanced by Muslim scholars, later transmitted to Renaissance Europe.",
              significanceAr: "حُفِظ كثير من التراث اليوناني القديم وطُوِّر على يد علماء المسلمين، ثم نُقِل لاحقاً إلى أوروبا في عصر النهضة.",
            },
            {
              date: "1095–1291 CE",
              title: "The Crusades",
              titleAr: "الحروب الصليبية",
              description:
                "European Christian armies launch Crusades to recapture Jerusalem. Salahuddin al-Ayyubi (Saladin) recaptures Jerusalem in 1187 CE with remarkable magnanimity.",
              descriptionAr: "شنَّت جيوش مسيحية أوروبية حروباً صليبية لاسترداد القدس. استعاد صلاح الدين الأيوبي القدس سنة 1187م بنبل وكرم نادرَين.",
            },
            {
              date: "1258 CE",
              title: "Fall of Baghdad — Mongol Invasion",
              titleAr: "سقوط بغداد — الغزو المغولي",
              description:
                "Hulagu Khan's Mongol forces sack Baghdad. The Abbasid Caliph killed. One of the most devastating events in Islamic history — libraries burned, scholars killed.",
              descriptionAr: "اجتاحت قوات هولاكو المغولية بغداد وقتلت الخليفة العباسي. وكان ذلك من أكثر الأحداث دمارية في التاريخ الإسلامي؛ إذ أُحرقت المكتبات وقُتل العلماء.",
            },
            {
              date: "1299–1923 CE",
              title: "The Ottoman Empire",
              titleAr: "الدولة العثمانية",
              description:
                "The longest-lasting Islamic empire. Constantinople conquered by Sultan Muhammad al-Fatih in 1453 CE. At peak, spanned three continents.",
              descriptionAr: "أطول الإمبراطوريات الإسلامية عمراً. فتح السلطان محمد الفاتح القسطنطينية سنة 1453م. وفي أوج مجدها، امتدت على ثلاث قارات.",
            },
            {
              date: "1924 CE",
              title: "End of the Caliphate",
              titleAr: "نهاية الخلافة الإسلامية",
              description:
                "The Ottoman Caliphate abolished by Mustafa Kemal Atatürk. End of a 1,300-year institution of Islamic governance.",
              descriptionAr: "أُلغيت الخلافة العثمانية على يد مصطفى كمال أتاتورك. نهاية مؤسسة الحكم الإسلامي التي استمرت ألفاً وثلاثمائة عام.",
            },
          ],
        },
      ],
    },
    {
      id: "rightly-guided-caliphs",
      title: "The Rightly Guided Caliphs",
      arabicTitle: "الخُلَفَاء الرَّاشِدُون",
      description: "The four companions who led the Muslim community after the Prophet ﷺ",
      readTime: 10,
      tags: ["sahabah", "caliphs", "khulafa", "history"],
      sections: [
        {
          type: "text",
          content:
            "The Prophet ﷺ said: 'Hold firmly to my Sunnah and the Sunnah of the rightly guided caliphs after me.' (Abu Dawud, authenticated). The Khulafa Rashidun are Abu Bakr, Umar, Uthman, and Ali — may Allah be pleased with all of them.",
          ar: "قال النبي ﷺ: «عليكم بسنتي وسنة الخلفاء الراشدين المهديين من بعدي». (أبو داود، صحيح). والخلفاء الراشدون هم: أبو بكر، وعمر، وعثمان، وعلي — رضي الله عنهم أجمعين.",
        },
        {
          type: "heading", level: 2, text: "Abu Bakr as-Siddiq (632–634 CE)",
        },
        {
          type: "text",
          content:
            "The first caliph and closest companion of the Prophet ﷺ. Called 'as-Siddiq' (the Truthful) for immediately believing in the Isra and Mi'raj. He stabilized the Muslim state after the Prophet's death by crushing the apostasy rebellions and began the compilation of the Quran into a single mushaf after many Quran memorizers were killed at the Battle of Yamama.",
          ar: "أول الخلفاء وأقرب الصحابة من رسول الله ﷺ. لُقِّب بـ«الصديق» لتصديقه الفوري بحادثة الإسراء والمعراج. رسَّخ دعائم الدولة الإسلامية بعد وفاة النبي ﷺ بسحق حركات الردة، وأمر بجمع القرآن الكريم في مصحف واحد إثر استشهاد كثير من الحفَّاظ في معركة اليمامة.",
        },
        {
          type: "heading", level: 2, text: "Umar ibn al-Khattab (634–644 CE)",
        },
        {
          type: "text",
          content:
            "Perhaps the greatest administrator in Islamic history. Under his rule, the Islamic state expanded into Persia (ending the Sassanid Empire), Syria, Egypt, and Iraq. He established the Islamic calendar (Hijri), the public treasury (bayt al-mal), and a welfare state where the poor and disabled were provided for. He personally walked the streets of Madinah at night to check on the welfare of its people. Assassinated by a Persian slave.",
          ar: "ربما كان أعظم مدير في التاريخ الإسلامي. في عهده اتسعت الدولة الإسلامية لتشمل فارس (وبذلك أُسقطت الإمبراطورية الساسانية) وسوريا ومصر والعراق. أرسى التقويم الهجري، وبيت المال، ودولة الرعاية التي كفلت للفقراء والعاجزين حقوقهم. وكان يتفقد بنفسه شوارع المدينة ليلاً للاطمئنان على أحوال الناس. اغتيل على يد عبد فارسي.",
        },
        {
          type: "heading", level: 2, text: "Uthman ibn Affan (644–656 CE)",
        },
        {
          type: "text",
          content:
            "Known for his extraordinary generosity and modesty. He was married to two daughters of the Prophet ﷺ sequentially, earning the title 'Dhun-Nurayn' (Possessor of Two Lights). His greatest achievement was standardizing the written Quran — he had official copies made from the master copy compiled under Abu Bakr and distributed to all major cities, ordering all other variants destroyed. This preserved the Quran for all time. Assassinated by rebels.",
          ar: "اشتُهر بكرمه الفائق وتواضعه الجم. تزوَّج ابنتين من بنات النبي ﷺ على التوالي، فلُقِّب بـ«ذي النورين». وكان أعظم إنجازاته توحيد رسم المصحف، إذ أمر بنسخ مصاحف رسمية من النسخة الأم التي جُمعت في عهد أبي بكر، ووزَّعها على الأمصار، وأمر بإحراق ما سواها. وبذلك صُوِن القرآن الكريم إلى الأبد. اغتيل على يد خوارج.",
        },
        {
          type: "heading", level: 2, text: "Ali ibn Abi Talib (656–661 CE)",
        },
        {
          type: "text",
          content:
            "The cousin and son-in-law of the Prophet ﷺ, husband of Fatimah, father of Hasan and Husayn. Renowned for his knowledge, courage, and piety. His caliphate was marked by the first major civil wars (fitna) in Islamic history. He was assassinated by Ibn Muljam while performing Fajr prayer in Kufa.",
          ar: "ابن عم رسول الله ﷺ وصهره، زوج فاطمة، وأبو الحسن والحسين. اشتُهر بعلمه الغزير وشجاعته الفائقة وورعه العميق. شهدت خلافته أولى الفتن الكبرى في التاريخ الإسلامي. اغتاله ابن ملجم أثناء أداء صلاة الفجر في الكوفة.",
        },
      ],
    },
  ],
};
