import type { LibraryCategory } from "./types";

export const pillars: LibraryCategory = {
  id: "pillars",
  title: "Pillars of Islam & Iman",
  arabicTitle: "أَرْكَان الإِسْلَام وَالإِيمَان",
  description: "The five pillars of Islam and the six pillars of faith explained",
  icon: "Columns",
  color: "green",
  articles: [
    {
      id: "pillars-of-islam",
      title: "The Five Pillars of Islam",
      arabicTitle: "أَرْكَان الإِسْلَام الخَمْسَة",
      description: "The fundamental practices that every Muslim must perform",
      readTime: 10,
      quranRefs: [{ surah: 2, ayah: 177 }],
      tags: ["pillars", "islam", "essential"],
      sections: [
        {
          type: "text",
          content:
            "The Prophet ﷺ said: 'Islam is built upon five [pillars]: testifying that there is no god but Allah and that Muhammad is the Messenger of Allah, establishing prayer, giving zakat, making pilgrimage to the House, and fasting in Ramadan.' (Bukhari & Muslim)",
          ar: "قال النبي ﷺ: «بُني الإسلام على خمس: شهادة أن لا إله إلا الله وأن محمداً رسول الله، وإقام الصلاة، وإيتاء الزكاة، والحج، وصوم رمضان». (البخاري ومسلم)",
        },
        {
          type: "heading", level: 2, text: "1. Shahada — The Declaration of Faith",
        },
        {
          type: "dua",
          arabic: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّداً رَسُولُ اللَّهِ",
          transliteration: "Ash-hadu an la ilaha ill-Allah wa ash-hadu anna Muhammadan rasulullah",
          translation: "I bear witness that there is no deity worthy of worship except Allah, and I bear witness that Muhammad is the Messenger of Allah.",
          source: "Bukhari & Muslim",
        },
        {
          type: "text",
          content:
            "The Shahada has two parts: negation (la ilaha — there is no god) and affirmation (ill-Allah — except Allah). It must be said with conviction, knowledge of its meaning, sincerity, love, acceptance, compliance, and negation of shirk. The second part testifies that Muhammad ﷺ is the final messenger, which means following his Sunnah.",
          ar: "تتألف الشهادة من شطرين: نفي (لا إله — لا معبود بحق) وإثبات (إلا الله — إلا هو وحده). ويُشترط لقبولها: اليقين، والعلم بمعناها، والإخلاص، والمحبة، والقبول، والانقياد، ونفي الشرك. والشطر الثاني يُقرِّر أن محمداً ﷺ آخر الرسل، مما يستلزم اتباع سنته.",
        },
        {
          type: "heading", level: 2, text: "2. Salah — Prayer",
        },
        {
          type: "text",
          content:
            "Five daily prayers are obligatory on every Muslim who has reached puberty. They are: Fajr (dawn — 2 rakat), Dhuhr (midday — 4 rakat), Asr (afternoon — 4 rakat), Maghrib (sunset — 3 rakat), Isha (night — 4 rakat). The Prophet ﷺ said: 'The first thing the slave will be accountable for on the Day of Resurrection is prayer.' (Ahmad)",
          ar: "الصلوات الخمس واجبة على كل مسلم بالغ. وهي: الفجر (٢ ركعة)، والظهر (٤ ركعات)، والعصر (٤ ركعات)، والمغرب (٣ ركعات)، والعشاء (٤ ركعات). قال النبي ﷺ: «أول ما يُحاسَب العبد يوم القيامة عن الصلاة». (أحمد)",
        },
        {
          type: "list",
          title: "Conditions for Valid Salah",
          items: [
            "Purity — having wudoo or ghusl as required",
            "Entering the time of prayer",
            "Facing the Qiblah (Ka'bah in Makkah)",
            "Covering the awrah (private parts)",
            "Intention (niyyah) in the heart",
          ],
          itemsAr: [
            "الطهارة — امتلاك الوضوء أو الغسل حسب الحال",
            "دخول وقت الصلاة",
            "استقبال القبلة (الكعبة المشرفة في مكة)",
            "ستر العورة",
            "النية في القلب",
          ],
        },
        {
          type: "heading", level: 2, text: "3. Zakat — Obligatory Charity",
        },
        {
          type: "text",
          content:
            "Zakat is an annual obligation on Muslims who possess wealth above the nisab (minimum threshold) for a full lunar year. The standard rate is 2.5% of savings, trade goods, and gold/silver. Zakat purifies wealth and redistributes it to those in need. It is mentioned alongside salah over 80 times in the Quran.",
          ar: "الزكاة فريضة سنوية على كل مسلم يملك نصاباً من المال بلغ عليه الحول. ومقدارها المعتاد ٢٫٥٪ من المدخرات والبضائع والذهب والفضة. تُطهِّر الزكاة المال وتُعيد توزيعه على المحتاجين. وقد اقترنت بالصلاة في القرآن الكريم أكثر من ثمانين مرة.",
        },
        {
          type: "list",
          title: "8 Categories of Zakat Recipients (Quran 9:60)",
          items: [
            "The poor (al-fuqara) — those with little or nothing",
            "The needy (al-masakin) — those who have something but not enough",
            "Zakat collectors — those employed to collect and distribute it",
            "Those whose hearts are to be reconciled — new Muslims or potential allies",
            "Those in bondage — to help free slaves",
            "Those in debt — who cannot repay",
            "In the way of Allah — for legitimate Islamic causes",
            "The traveler — stranded without means",
          ],
          itemsAr: [
            "الفقراء — الذين لا يملكون شيئاً أو يملكون القليل",
            "المساكين — الذين يملكون شيئاً لكنه لا يكفيهم",
            "العاملون عليها — المكلَّفون بجمع الزكاة وتوزيعها",
            "المؤلَّفة قلوبهم — المسلمون الجدد أو من يُرجى استمالتهم",
            "في الرقاب — لمساعدة الأرقاء على تحرير أنفسهم",
            "الغارمون — الذين لا يستطيعون سداد ديونهم",
            "في سبيل الله — للأوجه الإسلامية المشروعة",
            "ابن السبيل — المسافر المنقطع عن ماله",
          ],
        },
        {
          type: "heading", level: 2, text: "4. Sawm — Fasting in Ramadan",
        },
        {
          type: "text",
          content:
            "Fasting the entire month of Ramadan (the 9th month of the Islamic calendar) is obligatory for every adult Muslim who is sane and capable. Fasting means abstaining from food, drink, and marital relations from Fajr (dawn) until Maghrib (sunset). The Prophet ﷺ said: 'Whoever fasts Ramadan with faith and hoping for reward from Allah will have his previous sins forgiven.' (Bukhari & Muslim)",
          ar: "صيام شهر رمضان كاملاً (الشهر التاسع من التقويم الهجري) فريضة على كل مسلم بالغ عاقل قادر. ويعني الصيام الإمساك عن الطعام والشراب والجماع من الفجر إلى المغرب. قال النبي ﷺ: «من صام رمضان إيماناً واحتساباً غُفر له ما تقدَّم من ذنبه». (البخاري ومسلم)",
        },
        {
          type: "list",
          title: "Who is Exempt from Fasting",
          items: [
            "Children (before puberty)",
            "The elderly who cannot fast without harm",
            "The seriously ill — must make up days if they recover",
            "Travelers — may break fast and make up days later",
            "Pregnant or breastfeeding women — may make up or pay fidyah",
            "Those with chronic illness — may pay fidyah instead",
          ],
          itemsAr: [
            "الأطفال (قبل البلوغ)",
            "المسنُّون العاجزون عن الصيام دون ضرر",
            "المرضى الشديدو المرض — عليهم القضاء إن شفوا",
            "المسافرون — يجوز لهم الفطر والقضاء لاحقاً",
            "الحوامل والمرضعات — عليهن القضاء أو الفدية",
            "أصحاب الأمراض المزمنة — يجوز لهم دفع الفدية بدلاً من الصيام",
          ],
        },
        {
          type: "heading", level: 2, text: "5. Hajj — Pilgrimage to Makkah",
        },
        {
          type: "text",
          content:
            "Hajj is obligatory once in a lifetime for every Muslim who is physically and financially able. It takes place in the Islamic month of Dhul Hijjah. Allah says: 'And [due] to Allah from the people is a pilgrimage to the House — for whoever is able to find thereto a way.' (3:97)",
          ar: "الحج فريضة مرة في العمر على كل مسلم مستطيع جسدياً ومالياً. ويُؤدَّى في شهر ذي الحجة. قال الله تعالى: ﴿وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلًا﴾ (آل عمران: ٩٧).",
        },
        {
          type: "list",
          title: "Key Rituals of Hajj",
          items: [
            "Ihram — entering a state of consecration and wearing white seamless garments",
            "Tawaf — circling the Ka'bah seven times counter-clockwise",
            "Sa'i — walking seven times between the hills of Safa and Marwa",
            "Wuquf at Arafah — standing in prayer and supplication on 9th Dhul Hijjah (the pillar of Hajj)",
            "Muzdalifah — spending the night and collecting pebbles",
            "Rami — stoning the three pillars at Mina (representing the rejection of Shaytan)",
            "Qurbani — sacrificing an animal",
            "Halq or Taqsir — shaving or cutting the hair",
          ],
          itemsAr: [
            "الإحرام — الدخول في النسك بارتداء ثوبَي الإحرام الأبيضين",
            "الطواف — الدوران حول الكعبة المشرفة سبع مرات عكس اتجاه عقارب الساعة",
            "السعي — المشي سبع مرات بين الصفا والمروة",
            "الوقوف بعرفة — الوقوف في صعيد عرفات دعاءً وتضرعاً في التاسع من ذي الحجة (ركن الحج الأعظم)",
            "المزدلفة — المبيت وجمع الحصى",
            "الرمي — رمي الجمرات الثلاث بمنى (رمزاً لرفض الشيطان)",
            "الأضحية — ذبح هدي",
            "الحلق أو التقصير — حلق الشعر أو تقصيره",
          ],
        },
      ],
    },
    {
      id: "pillars-of-iman",
      title: "The Six Pillars of Iman",
      arabicTitle: "أَرْكَان الإِيمَان السِّتَّة",
      description: "The six articles of faith that every Muslim must believe in",
      readTime: 12,
      tags: ["iman", "faith", "belief", "essential"],
      sections: [
        {
          type: "text",
          content:
            "The Angel Jibreel asked the Prophet ﷺ about iman. He replied: 'Iman is to believe in Allah, His angels, His books, His messengers, the Last Day, and to believe in divine decree — both its good and its evil.' (Muslim). These six are the foundations of Islamic belief.",
          ar: "سأل جبريلُ النبيَّ ﷺ عن الإيمان. فأجاب: «الإيمان: أن تؤمن بالله، وملائكته، وكتبه، ورسله، واليوم الآخر، وتؤمن بالقدر خيره وشره». (مسلم). وهذه الستة هي أسس العقيدة الإسلامية.",
        },
        {
          type: "heading", level: 2, text: "1. Belief in Allah",
        },
        {
          type: "text",
          content:
            "Belief in Allah encompasses four aspects: (1) His existence — He exists and is the Creator; (2) His Lordship (rububiyyah) — He alone is the Creator, Sustainer, and Owner of all; (3) His right to be worshipped (uluhiyyah) — worship must be directed to Him alone; (4) His Names and Attributes — He possesses perfect names and attributes as described in the Quran and Sunnah, without resemblance to creation.",
          ar: "الإيمان بالله يشمل أربعة جوانب: (١) الإيمان بوجوده — فهو موجود وهو الخالق؛ (٢) الإيمان بربوبيته — فهو وحده الخالق الرازق المالك لكل شيء؛ (٣) الإيمان بألوهيته — فالعبادة تُصرف إليه وحده؛ (٤) الإيمان بأسمائه وصفاته — فله الأسماء الحسنى والصفات الكاملة كما جاء في القرآن والسنة، من غير تشبيه بالمخلوقين.",
        },
        {
          type: "heading", level: 2, text: "2. Belief in the Angels",
        },
        {
          type: "text",
          content:
            "Angels are created from light. They obey Allah completely and never disobey Him. They do not eat, drink, or sleep. Some of the named angels: Jibreel (brings revelation), Mika'il (rain and provision), Israfil (blow the trumpet on the Last Day), Azrael (takes souls in death), Malik (guardian of Hellfire), Ridwan (guardian of Paradise), Kiraman Katibin (two angels recording each person's deeds).",
          ar: "الملائكة مخلوقون من نور. يطيعون الله تعالى طاعةً تامةً لا يعصونه أبداً. لا يأكلون ولا يشربون ولا ينامون. ومن الملائكة المُسمَّين: جبريل (الوحي)، وميكائيل (المطر والرزق)، وإسرافيل (النفخ في الصور يوم القيامة)، وعزرائيل (قبض الأرواح)، ومالك (خازن النار)، ورضوان (خازن الجنة)، والكرام الكاتبون (ملكان يُسجِّلان أعمال كل إنسان).",
        },
        {
          type: "heading", level: 2, text: "3. Belief in the Books",
        },
        {
          type: "list",
          items: [
            "The Suhuf (Scrolls) — given to Ibrahim and Musa",
            "The Tawrah (Torah) — given to Musa",
            "The Zabur (Psalms) — given to Dawud",
            "The Injeel (Gospel) — given to Isa",
            "The Quran — given to Muhammad ﷺ — the final, preserved, and abrogating book",
          ],
          itemsAr: [
            "الصحف — أُنزلت على إبراهيم وموسى عليهما السلام",
            "التوراة — أُنزلت على موسى عليه السلام",
            "الزبور — أُنزل على داوود عليه السلام",
            "الإنجيل — أُنزل على عيسى عليه السلام",
            "القرآن الكريم — أُنزل على محمد ﷺ — الكتاب الخاتم المحفوظ الناسخ لما قبله",
          ],
        },
        {
          type: "text",
          content:
            "Muslims believe all books were originally from Allah but the previous scriptures were altered by human hands. The Quran is the only book preserved in its original form, as Allah Himself guaranteed its protection (15:9).",
          ar: "يؤمن المسلمون بأن جميع الكتب أُنزلت أصلاً من عند الله، لكن الكتب السابقة حُرِّفت بأيدي البشر. والقرآن الكريم هو الكتاب الوحيد المحفوظ في صورته الأصلية؛ لأن الله تعالى تكفَّل بحفظه بنفسه: ﴿إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ﴾ (الحجر: ٩).",
        },
        {
          type: "heading", level: 2, text: "4. Belief in the Messengers",
        },
        {
          type: "text",
          content:
            "Allah sent messengers to every nation to guide them. The Quran mentions 25 by name. All prophets were human, male, truthful, trustworthy, and delivered the message completely. They shared the same core message: worship Allah alone. Muhammad ﷺ is the last and final prophet — no prophet will come after him.",
          ar: "بعث الله رسلاً إلى كل أمة لهدايتها. ذكر القرآن الكريم خمسةً وعشرين منهم بالاسم. وكان الأنبياء جميعاً بشراً ذكوراً، صادقين أُمناء، بلَّغوا الرسالة كاملةً. وجمعتهم رسالة واحدة: عبادة الله وحده. ومحمد ﷺ آخر الأنبياء والمرسلين، ولن يأتي نبي بعده.",
        },
        {
          type: "heading", level: 2, text: "5. Belief in the Last Day",
        },
        {
          type: "list",
          title: "Events of the Last Day",
          items: [
            "The blowing of the Trumpet by Israfil — all die, then all are resurrected",
            "The Gathering (Hashr) — all humanity assembled on the Plain of Mahshar",
            "The Reckoning (Hisab) — each person's deeds presented and judged",
            "The Scales (Mizan) — deeds weighed",
            "The Bridge (Sirat) — all must cross over Hellfire",
            "Intercession (Shafa'ah) — the Prophet ﷺ intercedes for his Ummah",
            "Entry into Jannah or Jahannam",
          ],
          itemsAr: [
            "النفخ في الصور بيد إسرافيل — يموت الجميع ثم يُبعثون",
            "الحشر — يُجمع الناس جميعاً في صعيد واحد في عرصات المحشر",
            "الحساب — تُعرَض أعمال كل إنسان وتُحاسَب",
            "الميزان — توزَن الأعمال",
            "الصراط — يجب على الجميع العبور فوق جهنم",
            "الشفاعة — يشفع النبي ﷺ لأمته",
            "الدخول إلى الجنة أو النار",
          ],
        },
        {
          type: "heading", level: 2, text: "6. Belief in Divine Decree (Qadar)",
        },
        {
          type: "text",
          content:
            "Everything that happens is by the will, knowledge, and decree of Allah. Belief in qadar has four levels: (1) Knowledge — Allah knew everything that would happen eternally; (2) Writing — everything is recorded in the Preserved Tablet (Al-Lawh al-Mahfuz); (3) Will — nothing happens except by Allah's will; (4) Creation — Allah created all things and their capacities. Belief in qadar does not negate human responsibility — we are required to take means and make efforts.",
          ar: "كل ما يجري في الكون هو بإرادة الله وعلمه وقضائه وقدره. والإيمان بالقدر له أربع مراتب: (١) العلم — علِم الله كل ما سيقع منذ الأزل؛ (٢) الكتابة — كل شيء مُسجَّل في اللوح المحفوظ؛ (٣) المشيئة — لا يقع شيء إلا بإرادة الله؛ (٤) الخلق — الله خالق كل شيء وقدَرَه. والإيمان بالقدر لا ينفي المسؤولية الإنسانية — بل نحن مأمورون بالأخذ بالأسباب وبذل الجهد.",
        },
      ],
    },
  ],
};
