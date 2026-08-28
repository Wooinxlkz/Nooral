import type { LibraryCategory } from "./types";

export const purification: LibraryCategory = {
  id: "purification",
  title: "Purification (Taharah)",
  arabicTitle: "الطَّهَارَة",
  description: "Learn the essential acts of ritual purification in Islam",
  icon: "Droplets",
  color: "blue",
  articles: [
    {
      id: "wudoo",
      title: "Wudoo (Ablution)",
      arabicTitle: "الوُضُوء",
      description: "Step-by-step guide to performing wudoo correctly — obligatory and sunnah acts",
      readTime: 10,
      quranRefs: [{ surah: 5, ayah: 6 }],
      tags: ["purification", "prayer", "essential"],
      sections: [
        {
          type: "quranRef",
          refs: [{ surah: 5, ayah: 6, note: "The Quranic command for wudoo — the four obligatory acts are stated here" }],
        },
        {
          type: "text",
          content:
            "Wudoo is the ritual purification that must be performed before salah (prayer), touching the Mushaf (Quran), and tawaf (circumambulation of the Kaaba). Allah says (5:6): 'O you who have believed, when you rise to [perform] prayer, wash your faces and your forearms to the elbows and wipe over your heads and wash your feet to the ankles.'",
          ar: "الوضوء طهارة شرعية يجب القيام بها قبل الصلاة، ومس المصحف الشريف، والطواف. قال الله تعالى (المائدة: ٦): ﴿يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ وَامْسَحُوا بِرُءُوسِكُمْ وَأَرْجُلَكُمْ إِلَى الْكَعْبَيْنِ﴾.",
        },

        /* ── OBLIGATORY ACTS (FARD) ── */
        {
          type: "heading",
          level: 2,
          text: "The 6 Obligatory Acts (Fard) of Wudoo",
        },
        {
          type: "callout",
          icon: "Star",
          content:
            "These 6 acts are fard (obligatory). Wudoo is invalid if any one of them is missing.",
          ar: "هذه الستة فرائض. الوضوء باطل إذا أُخِلَّ بأي منها.",
        },
        {
          type: "list",
          items: [
            "1. Niyyah (Intention) — formed in the heart; wudoo is not valid without it. It is not required to be spoken aloud.",
            "2. Washing the face — from the hairline to the chin, from earlobe to earlobe, three times.",
            "3. Washing the arms to the elbows — right arm first, then left, including the elbows, three times.",
            "4. Wiping the head (mash) — passing wet hands over the entire head once.",
            "5. Washing the feet to the ankles — right foot first, then left, including the ankles, three times.",
            "6. Tartib (Order) and Muwalah (Continuity) — acts must be done in the correct order without long interruption.",
          ],
          itemsAr: [
            "١. النية — في القلب؛ لا يصح الوضوء بدونها. ولا يشترط التلفظ بها.",
            "٢. غسل الوجه — من منابت الشعر إلى الذقن، ومن الأذن إلى الأذن، ثلاث مرات.",
            "٣. غسل اليدين إلى المرفقين — اليمنى ثم اليسرى، بما في ذلك المرفقان، ثلاث مرات.",
            "٤. مسح الرأس (المسح) — تمرير اليدين المبلَّلتين على الرأس كاملاً مرة واحدة.",
            "٥. غسل القدمين إلى الكعبين — اليمنى ثم اليسرى، بما في ذلك الكعبان، ثلاث مرات.",
            "٦. الترتيب والموالاة — يجب أداء الأعضاء بالترتيب دون انقطاع طويل بينها.",
          ],
        },

        /* ── SUNNAH ACTS ── */
        {
          type: "heading",
          level: 2,
          text: "The Sunnah Acts of Wudoo",
        },
        {
          type: "callout",
          icon: "Star",
          content:
            "These acts are sunnah muakkadah — highly recommended and rewarded, but wudoo is valid without them.",
          ar: "هذه الأعمال سنن مؤكدة — مستحبة ومُثاب عليها، لكن الوضوء صحيح بدونها.",
        },
        {
          type: "list",
          items: [
            "Saying 'Bismillah' at the beginning",
            "Washing both hands up to the wrists three times at the start",
            "Rinsing the mouth (madmadah) three times",
            "Sniffing water into the nostrils (istinshaq) and blowing it out, three times",
            "Running fingers through the beard to wet the hair underneath (takhliil al-lihyah)",
            "Passing fingers between the toes (takhliil al-asabi')",
            "Wiping both ears — inner with index fingers, outer with thumbs — once",
            "Repeating each washing act three times (beyond the first obligatory time)",
            "Beginning from the right side",
            "Not wasting water — the Prophet ﷺ performed wudoo with about one mudd (~0.5 litre) of water",
          ],
          itemsAr: [
            "قول «بسم الله» في البداية",
            "غسل الكفين إلى الرسغين ثلاث مرات في البداية",
            "المضمضة ثلاث مرات",
            "الاستنشاق والاستنثار ثلاث مرات",
            "تخليل اللحية لإيصال الماء إلى أصول الشعر",
            "تخليل أصابع القدمين",
            "مسح الأذنين — الداخل بالسبابتين والخارج بالإبهامين — مرة واحدة",
            "تثليث الغسل في كل عضو (ثلاث مرات)",
            "البدء بالجانب الأيمن",
            "عدم الإسراف في الماء — كان النبي ﷺ يتوضأ بمُدٍّ (~٠٫٥ لتر)",
          ],
        },

        /* ── DUA BEFORE WUDOO ── */
        {
          type: "heading",
          level: 2,
          text: "Dua Before Wudoo",
        },
        {
          type: "dua",
          arabic: "بِسْمِ اللهِ",
          transliteration: "Bismillah",
          translation: "In the name of Allah.",
          source:
            "The Prophet ﷺ said: 'There is no wudoo for the one who does not mention the name of Allah over it.' (Abu Dawud, Ibn Majah — authenticated by al-Albani). Say 'Bismillah' at the start.",
        },

        /* ── STEP-BY-STEP ── */
        {
          type: "heading",
          level: 2,
          text: "Step-by-Step Guide (Complete Sunnah Method)",
        },
        {
          type: "steps",
          items: [
            {
              number: 1,
              title: "Make the intention and say Bismillah",
              titleAr: "استحضار النية وقول البسملة",
              description:
                "Form the intention in your heart that you are performing wudoo for the sake of Allah. Say 'Bismillah' before beginning. The intention need not be spoken aloud.",
              descriptionAr:
                "استحضر في قلبك نية أداء الوضوء لله. وقل «بسم الله» قبل البدء. لا يشترط التلفظ بالنية جهراً.",
              dua: {
                arabic: "بِسْمِ اللهِ",
                transliteration: "Bismillah",
                translation: "In the name of Allah.",
              },
            },
            {
              number: 2,
              title: "Wash both hands three times (Sunnah)",
              titleAr: "غسل الكفين ثلاثاً (سنة)",
              description:
                "Wash both hands up to and including the wrists three times. Ensure water passes between the fingers.",
              descriptionAr:
                "اغسل كلتا يديك إلى الرسغين ثلاث مرات. تأكد من مرور الماء بين الأصابع.",
            },
            {
              number: 3,
              title: "Rinse the mouth three times (Sunnah)",
              titleAr: "المضمضة ثلاثاً (سنة)",
              description:
                "Take water into the mouth, swirl it around thoroughly, then spit it out. Do this three times.",
              descriptionAr:
                "خذ الماء في فمك وأديره جيداً ثم مُجَّه. افعل ذلك ثلاث مرات.",
            },
            {
              number: 4,
              title: "Sniff water into nostrils three times (Sunnah)",
              titleAr: "الاستنشاق والاستنثار ثلاثاً (سنة)",
              description:
                "Sniff water gently into the nose using the right hand, then blow it out using the left hand. Do this three times.",
              descriptionAr:
                "استنشق الماء باليد اليمنى ثم استنثره باليسرى. افعل ذلك ثلاث مرات.",
            },
            {
              number: 5,
              title: "Wash the face three times (FARD)",
              titleAr: "غسل الوجه ثلاثاً (فرض)",
              description:
                "Wash the entire face from the hairline to the chin and from earlobe to earlobe, three times. Men with beards should pass wet fingers through the beard (takhliil).",
              descriptionAr:
                "اغسل الوجه كاملاً من منابت الشعر إلى الذقن ومن الأذن إلى الأذن ثلاث مرات. ومن كانت له لحية فليخلِّلها بأصابعه المبللة.",
            },
            {
              number: 6,
              title: "Wash arms to the elbows three times (FARD)",
              titleAr: "غسل الذراعين إلى المرفقين ثلاثاً (فرض)",
              description:
                "Wash the right arm from the fingertips to and including the elbow, three times. Then wash the left arm the same way. Ensure water reaches the elbows completely.",
              descriptionAr:
                "اغسل اليد اليمنى من أطراف الأصابع حتى المرفق وبما فيه ثلاث مرات. ثم اغسل اليسرى كذلك. تأكد من وصول الماء إلى المرفقين.",
            },
            {
              number: 7,
              title: "Wipe the head once (FARD)",
              titleAr: "مسح الرأس مرة واحدة (فرض)",
              description:
                "Wet both hands and wipe the entire head once — from the front to the back and then back to the front. Then wipe the inside of the ears with index fingers and outside with thumbs.",
              descriptionAr:
                "بلِّل كفيك وامسح الرأس كاملاً من الأمام إلى الخلف ثم من الخلف إلى الأمام. ثم امسح داخل الأذنين بالسبابتين وخارجهما بالإبهامين.",
            },
            {
              number: 8,
              title: "Wash the feet to the ankles three times (FARD)",
              titleAr: "غسل القدمين إلى الكعبين ثلاثاً (فرض)",
              description:
                "Wash the right foot including both ankles three times, ensuring water reaches between the toes. Then wash the left foot. Pass fingers between toes (takhliil al-asabi').",
              descriptionAr:
                "اغسل القدم اليمنى بما في ذلك الكعبان ثلاث مرات مع التأكد من وصول الماء بين الأصابع. ثم القدم اليسرى كذلك. مرِّر الأصابع بين أصابع القدمين.",
            },
          ],
        },

        /* ── DUA AFTER WUDOO ── */
        {
          type: "heading",
          level: 2,
          text: "Dua After Wudoo",
        },
        {
          type: "dua",
          arabic:
            "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّداً عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ",
          transliteration:
            "Ash-hadu an laa ilaaha ill-Allaah wahdahu laa shareeka lah, wa ash-hadu anna Muhammadan 'abduhu wa rasooluh. Allaahumma aj'alni min at-tawwaabeena waj'alni min al-mutatahhireen",
          translation:
            "I bear witness that there is no god but Allah alone with no partner, and I bear witness that Muhammad is His slave and Messenger. O Allah, make me among those who repent and make me among those who purify themselves.",
          source:
            "Tirmidhi (55), Ibn Majah (470) — authenticated by al-Albani. The Prophet ﷺ said whoever says this after wudoo, the eight gates of Paradise are opened for them.",
        },

        {
          type: "heading",
          level: 2,
          text: "Common Mistakes",
        },
        {
          type: "list",
          items: [
            "Not forming the intention (niyyah) in the heart before starting",
            "Not washing in the correct order (face → arms → head wipe → feet) — tartib is fard",
            "Missing spots — especially between fingers and toes, elbows, ankles, and under dense beards",
            "Not letting water reach under rings, watches, or nail polish — these must be removed",
            "Wiping the head with dry hands instead of wet hands",
            "Washing the head like ghusl instead of wiping (mash) it",
            "Saying the dua for wudoo DURING the act — it is said AFTER completing wudoo",
            "Excessive use of water — the Prophet ﷺ warned against wastefulness even at a flowing river",
          ],
          itemsAr: [
            "عدم استحضار النية في القلب قبل البدء",
            "عدم الترتيب الصحيح (الوجه ← اليدان ← المسح ← القدمان) — الترتيب فرض",
            "إهمال بعض المواضع — كما بين الأصابع والكعبين وتحت اللحية الكثيفة",
            "عدم إزالة ما يمنع وصول الماء كالخاتم والساعة والطلاء على الأظافر",
            "مسح الرأس بيدين جافتين بدلاً من مبللتين",
            "غسل الرأس كالغسل بدلاً من مسحه (المسح)",
            "قول دعاء الوضوء أثناء الوضوء — يُقال بعد الانتهاء منه",
            "الإسراف في الماء — نهى النبي ﷺ عن الإسراف حتى على نهر جارٍ",
          ],
        },
        {
          type: "heading",
          level: 2,
          text: "Things That Nullify Wudoo",
        },
        {
          type: "list",
          items: [
            "Passing urine, stool, or gas from the private parts",
            "Deep sleep where one loses consciousness (napping sitting upright does not break wudoo according to strongest opinion)",
            "Loss of consciousness (fainting, intoxication, severe illness)",
            "Touching the private parts directly without a barrier — according to the Shafi'i and Hanbali schools (based on Tirmidhi hadith). Hanafi school holds it does not nullify.",
            "Eating camel meat — according to the Hanbali school (based on Bukhari & Muslim hadith — this is the strongest opinion)",
            "Apostasy — leaving Islam (wudoo becomes void)",
          ],
          itemsAr: [
            "خروج البول أو الغائط أو الريح من السبيلين",
            "النوم العميق الذي يُزيل الإحساس (النوم جالساً لا ينقض الوضوء على الراجح)",
            "زوال العقل (الإغماء أو السكر أو الجنون)",
            "لمس الفرج مباشرة بدون حائل — عند الشافعية والحنابلة (بناءً على حديث الترمذي). والحنفية يرون أنه لا ينقض.",
            "أكل لحم الإبل — عند الحنابلة (بناءً على حديث البخاري ومسلم — وهو الأرجح)",
            "الردة — الخروج عن الإسلام (يبطل الوضوء)",
          ],
        },
      ],
    },

    {
      id: "ghusl",
      title: "Ghusl (Full Ritual Bath)",
      arabicTitle: "الغُسْل",
      description: "When ghusl is required and how to perform it correctly — obligatory and sunnah acts",
      readTime: 8,
      quranRefs: [{ surah: 4, ayah: 43 }, { surah: 5, ayah: 6 }],
      tags: ["purification", "essential"],
      sections: [
        {
          type: "heading",
          level: 2,
          text: "When Ghusl is Obligatory (Fard)",
        },
        {
          type: "list",
          items: [
            "After sexual intercourse — even if there is no ejaculation",
            "After ejaculation due to arousal — whether from a wet dream or while awake",
            "After menstruation (hayd) ends",
            "After post-natal bleeding (nifas) ends",
            "Upon accepting Islam — for a new Muslim (majority opinion: obligatory)",
            "Before Jumu'ah prayer — Hanbali school considers it obligatory. Majority consider it highly recommended (sunnah muakkadah).",
            "Upon death — ghusl of the deceased is fard kifayah (communal obligation)",
          ],
          itemsAr: [
            "بعد الجماع — حتى وإن لم يحدث إنزال",
            "بعد الإنزال بشهوة — سواء أكان في المنام (احتلام) أم في اليقظة",
            "بعد انقطاع الحيض",
            "بعد انقطاع النفاس",
            "عند الإسلام — لمن دخل في الإسلام (الجمهور: واجب)",
            "لصلاة الجمعة — الحنابلة يعدونه واجباً. والجمهور يرون أنه سنة مؤكدة.",
            "عند الوفاة — غسل الميت فرض كفاية",
          ],
        },

        /* ── THE 3 FARD ACTS ── */
        {
          type: "heading",
          level: 2,
          text: "The 3 Obligatory Acts (Fard) of Ghusl",
        },
        {
          type: "callout",
          icon: "Star",
          content:
            "The minimum valid ghusl requires only these 3 acts. All additional steps are sunnah.",
          ar: "الحد الأدنى الصحيح للغسل يشترط هذه الثلاثة فقط. وما عداها سنة.",
        },
        {
          type: "list",
          items: [
            "1. Niyyah (Intention) — form the intention in the heart that you are performing ghusl to remove major impurity (janabah, hayd, nifas etc.)",
            "2. Rinsing the mouth and nose — water must reach inside the mouth and nostrils. The Hanafi school specifies this explicitly. (Some scholars combine this with general body washing — the dominant Hanafi view requires it separately.)",
            "3. Washing the entire body — water must reach every part of the outer body including roots of hair, behind the ears, armpits, navel, and between the toes.",
          ],
          itemsAr: [
            "١. النية — استحضار نية رفع الحدث الأكبر (الجنابة أو الحيض أو النفاس) في القلب.",
            "٢. المضمضة والاستنشاق — يجب وصول الماء إلى داخل الفم والأنف. صرَّح بذلك الحنفية، وبعضهم يدرجه في غسل البدن عموماً.",
            "٣. تعميم الجسد بالماء — يجب وصول الماء إلى كل أجزاء الجسم الظاهرة بما فيها أصول الشعر وخلف الأذنين والإبطين والسرة وما بين الأصابع.",
          ],
        },

        /* ── SUNNAH FULL METHOD ── */
        {
          type: "heading",
          level: 2,
          text: "The Sunnah Method of Ghusl (Complete)",
        },
        {
          type: "text",
          content:
            "The Prophet ﷺ described ghusl from janabah: 'He would wash his hands three times, pour water on his right hand and wash his private parts, then perform wudoo as for prayer, then pour water on his head three times covering the roots, then pour water over the right side of his body, then the left.' (Bukhari 248, Muslim 316 — from Aisha and Maymunah RA).",
          ar: "وصفت السيدة عائشة والسيدة ميمونة رضي الله عنهما غُسل النبي ﷺ من الجنابة: «كان يغسل كفيه ثلاثاً، ثم يصب الماء بيمينه على يساره فيغسل فرجه، ثم يتوضأ وضوءه للصلاة، ثم يأخذ الماء فيدخل أصابعه في أصول الشعر، ثم يحثو على رأسه ثلاث حثيات، ثم يفيض الماء على جسده كله». (البخاري ٢٤٨، مسلم ٣١٦).",
        },
        {
          type: "steps",
          items: [
            {
              number: 1,
              title: "Make the intention — say Bismillah",
              titleAr: "استحضار النية — قول البسملة",
              description:
                "Form the intention in your heart to perform ghusl to purify from major impurity. Say 'Bismillah'.",
              descriptionAr:
                "استحضر في قلبك نية رفع الحدث الأكبر. وقل «بسم الله».",
            },
            {
              number: 2,
              title: "Wash both hands three times",
              titleAr: "غسل الكفين ثلاثاً",
              description: "Wash both hands up to the wrists three times.",
              descriptionAr: "اغسل كلتا اليدين إلى الرسغين ثلاث مرات.",
            },
            {
              number: 3,
              title: "Wash the private parts",
              titleAr: "غسل الفرج",
              description:
                "Wash the private parts and surrounding area thoroughly with the left hand, removing all impurity.",
              descriptionAr:
                "اغسل الفرج وما حوله جيداً باليد اليسرى مع إزالة كل نجاسة.",
            },
            {
              number: 4,
              title: "Perform complete wudoo",
              titleAr: "أداء الوضوء الكامل",
              description:
                "Perform full wudoo as for prayer — including mouth rinse, nose rinse, face, arms, head wipe, feet. Some scholars allow deferring the feet to the end of ghusl.",
              descriptionAr:
                "أدِّ وضوءاً كاملاً كما للصلاة — بما فيه المضمضة والاستنشاق وغسل الوجه والذراعين ومسح الرأس وغسل القدمين. ويجوز لدى بعض العلماء تأجيل غسل القدمين إلى نهاية الغسل.",
            },
            {
              number: 5,
              title: "Pour water over the head three times",
              titleAr: "صبُّ الماء على الرأس ثلاثاً",
              description:
                "Pour water over the head three times, ensuring water reaches the roots of the hair and the entire scalp.",
              descriptionAr:
                "اصبب الماء على الرأس ثلاث مرات مع التأكد من وصوله إلى أصول الشعر وفروة الرأس كاملها.",
            },
            {
              number: 6,
              title: "Wash the right side of the body",
              titleAr: "غسل الجانب الأيمن من الجسم",
              description:
                "Pour water over the right side of the body — ensuring it reaches the armpit, between the arm and body, and all skin surfaces.",
              descriptionAr:
                "اصبب الماء على الجانب الأيمن من الجسم — تأكد من وصوله إلى الإبط وما بين الذراع والجسم وسائر مناطق الجلد.",
            },
            {
              number: 7,
              title: "Wash the left side of the body",
              titleAr: "غسل الجانب الأيسر من الجسم",
              description:
                "Pour water over the left side of the body. Ensure water reaches all skin: navel, behind the knees, between the toes.",
              descriptionAr:
                "اصبب الماء على الجانب الأيسر من الجسم. تأكد من وصول الماء إلى الجميع: السرة، وخلف الركبتين، وما بين الأصابع.",
            },
            {
              number: 8,
              title: "Wash the feet (if deferred)",
              titleAr: "غسل القدمين (إن أُجِّلتا)",
              description: "If the feet were not washed during the wudoo step, wash them now to complete the ghusl.",
              descriptionAr: "إن لم تُغسَل القدمان في خطوة الوضوء فاغسلهما الآن لاستكمال الغسل.",
            },
          ],
        },
        {
          type: "heading",
          level: 2,
          text: "Special Rulings for Women",
        },
        {
          type: "list",
          items: [
            "Women with braided hair do not need to undo braids for ghusl from janabah — it is sufficient for water to reach the roots of the hair (Muslim 330 — Umm Salamah RA)",
            "Women must undo braids for ghusl from hayd or nifas according to the majority of scholars",
            "Women should also ensure water reaches all areas including under and around hair ties",
          ],
          itemsAr: [
            "المرأة ذات الضفائر لا يجب عليها نقضها في غسل الجنابة — يكفي وصول الماء إلى أصول الشعر (مسلم ٣٣٠ — أم سلمة رضي الله عنها)",
            "يجب على المرأة نقض ضفائرها في غسل الحيض والنفاس عند جمهور العلماء",
            "يجب على المرأة أن تتأكد من وصول الماء إلى جميع مناطق الجسم بما في ذلك ما تحت مطاط الشعر وحوله",
          ],
        },
        {
          type: "heading",
          level: 2,
          text: "Common Mistakes",
        },
        {
          type: "list",
          items: [
            "Not washing the hair roots — water must reach the scalp, not just the surface of the hair",
            "Missing spots like behind the ears, armpits, navel, and between toes",
            "Performing only the minimum (3 obligatory acts) without any of the sunnah acts — it is valid but missing great reward",
            "Not rinsing the mouth and nose — obligatory according to the Hanafi school",
          ],
          itemsAr: [
            "إهمال غسل أصول الشعر — يجب وصول الماء إلى فروة الرأس لا مجرد سطح الشعر",
            "إهمال مواضع كخلف الأذنين والإبطين والسرة وما بين الأصابع",
            "الاكتفاء بالحد الأدنى (الفرائض الثلاث) دون سنن الغسل — صحيح لكنه يفوّت أجراً عظيماً",
            "إهمال المضمضة والاستنشاق — وهما واجبتان عند الحنفية",
          ],
        },
      ],
    },

    {
      id: "ghusl-deceased",
      title: "Ghusl of the Deceased",
      arabicTitle: "غُسْل المَيِّت",
      description: "The Islamic ritual washing of the deceased — the Sunnah method",
      readTime: 7,
      tags: ["purification", "death", "janazah"],
      sections: [
        {
          type: "callout",
          icon: "Heart",
          content:
            "This is a communal obligation (fard kifayah) — if some members of the community perform it, the obligation is lifted from all. It is an act of great merit and a final service to a Muslim brother or sister.",
          ar: "هذا فرض كفاية — إذا قام به بعض أفراد المجتمع سقط عن الباقين. وهو عمل عظيم الأجر وآخر خدمة تُقدَّم للأخ أو الأخت المسلم.",
        },
        {
          type: "heading",
          level: 2,
          text: "Who Performs the Washing",
        },
        {
          type: "list",
          items: [
            "A Muslim man is washed by Muslim men — a woman may wash her deceased husband",
            "A Muslim woman is washed by Muslim women — a man may wash his deceased wife (based on the hadith: 'If your wife dies before you, you may wash her.' — Abu Dawud, authenticated by al-Albani)",
            "Young children: either men or women may wash them regardless of gender",
            "The washer must be trustworthy and knowledgeable of the rulings",
            "It is preferred to be done by the closest relatives of the deceased",
          ],
          itemsAr: [
            "الرجل المسلم يغسله الرجال المسلمون — ويجوز للزوجة أن تغسل زوجها المتوفى",
            "المرأة المسلمة يغسلها النساء المسلمات — ويجوز للزوج أن يغسل زوجته المتوفاة (بناءً على الحديث: «لو ماتت قبلي لغسَّلتها» — أبو داود، صحيح الألباني)",
            "الأطفال الصغار: يجوز للرجال والنساء تغسيلهم بصرف النظر عن الجنس",
            "يجب أن يكون الغاسل أميناً عارفاً بأحكام التغسيل",
            "يُستحب أن يقوم به أقرب أقارب المتوفى",
          ],
        },
        {
          type: "heading",
          level: 2,
          text: "Required Items",
        },
        {
          type: "list",
          items: [
            "Clean water — warm water is preferable",
            "Sidr (lote-tree leaves, سدر) — dissolved in water for the main washing. If unavailable, soap may substitute.",
            "Camphor (kafur, كافور) — added to the water in the final wash, sunnah",
            "Gloves for the washers",
            "Cloth to cover the awrah at all times",
          ],
          itemsAr: [
            "ماء نظيف — الماء الدافئ أفضل",
            "السدر — يُذاب في الماء للغسلة الأولى. وإن لم يتوفر يمكن الاستعاضة عنه بالصابون.",
            "الكافور — يُضاف إلى الماء في الغسلة الأخيرة، وهو سنة",
            "قفازات للقائمين بالتغسيل",
            "قماش لستر العورة في جميع الأوقات",
          ],
        },
        {
          type: "heading",
          level: 2,
          text: "The Sunnah Method of Washing",
        },
        {
          type: "text",
          content:
            "The Prophet ﷺ said about washing his daughter Zaynab: 'Wash her three times, or five, or seven times — or more if you see fit — with water and sidr, and put camphor in the last wash.' (Bukhari 1253, Muslim 939). The minimum is three washes; additional washes are in odd numbers.",
          ar: "قال النبي ﷺ عن تغسيل ابنته زينب: «اغسلنها ثلاثاً أو خمساً أو سبعاً أو أكثر من ذلك إن رأيتن ذلك، بماء وسدر، واجعلن في الآخرة كافوراً». (البخاري ١٢٥٣، مسلم ٩٣٩). والحد الأدنى ثلاث غسلات؛ وما زاد فيكون وتراً.",
        },
        {
          type: "steps",
          items: [
            {
              number: 1,
              title: "Lay on a raised surface, cover the awrah",
              titleAr: "وضع الميت على مرتفع وستر عورته",
              description:
                "Place the deceased on a washing board or table. Remove clothing gently. Cover the awrah at all times. Close the eyes and mouth if possible. Face Qiblah if possible.",
              descriptionAr:
                "ضع الميت على لوح التغسيل أو طاولة مرتفعة. انزع الملابس برفق. استر العورة في جميع الأوقات. أغمض العينين وأطبق الفم إن أمكن. وجِّه نحو القبلة إن أمكن.",
            },
            {
              number: 2,
              title: "Press the abdomen gently",
              titleAr: "الضغط على البطن برفق",
              description:
                "Gently press the abdomen to expel any remaining matter, then clean the private area thoroughly.",
              descriptionAr:
                "اضغط على البطن برفق لإخراج ما تبقى من مواد، ثم نظِّف المنطقة الخاصة جيداً.",
            },
            {
              number: 3,
              title: "Perform wudoo for the deceased",
              titleAr: "الوضوء للميت",
              description:
                "Perform wudoo without putting water in the mouth or nose — use a damp cloth to clean the mouth and nostrils instead.",
              descriptionAr:
                "أدِّ للميت وضوءاً دون إدخال الماء إلى الفم أو الأنف — استخدم قطعة قماش مبللة لتنظيف الفم والأنف.",
            },
            {
              number: 4,
              title: "First wash — with sidr water",
              titleAr: "الغسلة الأولى — بماء السدر",
              description:
                "Wash the entire body with water mixed with sidr (lote leaves). Start with the right side. Wash hair. This is the primary cleansing wash. Minimum total washes: 3.",
              descriptionAr:
                "اغسل الجسم كله بماء مذاب فيه السدر. ابدأ بالجانب الأيمن. اغسل الشعر. هذه الغسلة التنظيفية الأساسية. الحد الأدنى ثلاث غسلات.",
            },
            {
              number: 5,
              title: "Second wash — with plain water",
              titleAr: "الغسلة الثانية — بماء نقي",
              description:
                "Wash the entire body again with clean plain water — right side then left.",
              descriptionAr:
                "اغسل الجسم مرة أخرى بماء نظيف عادي — الجانب الأيمن ثم الأيسر.",
            },
            {
              number: 6,
              title: "Third wash — with camphor water (Sunnah)",
              titleAr: "الغسلة الثالثة — بماء الكافور (سنة)",
              description:
                "Wash a third time with water mixed with camphor (kafur). If additional washes are needed for cleanliness, do them in odd numbers: 5, 7. The final wash must include camphor.",
              descriptionAr:
                "اغسل للمرة الثالثة بماء مضاف إليه الكافور. وإن احتيج إلى غسلات إضافية فتكون وتراً: خمساً أو سبعاً. ويجب أن تكون الغسلة الأخيرة بالكافور.",
            },
            {
              number: 7,
              title: "Dry and prepare for shrouding",
              titleAr: "التجفيف والتهيؤ للتكفين",
              description:
                "Gently dry the body. Apply a small amount of camphor to the head, nose, hands, knees, and feet (places of sujud). The deceased is now ready to be shrouded (kafn) and prayed over.",
              descriptionAr:
                "جفِّف الجسم برفق. ضع قليلاً من الكافور على الجبهة والأنف واليدين والركبتين والقدمين (مواضع السجود). الميت جاهز الآن للتكفين والصلاة عليه.",
            },
          ],
        },
        {
          type: "heading",
          level: 2,
          text: "Important Rulings",
        },
        {
          type: "list",
          items: [
            "Martyrs (shuhadaa) who die in battle are NOT washed — they are buried in their blood-stained clothes (Bukhari 1343)",
            "A stillborn baby of 4 months or older (i.e. when the soul is breathed in) is washed, named, and prayed over",
            "The washer should maintain full confidentiality about anything they observe on the deceased",
            "It is recommended for the washer to perform ghusl afterward (some scholars say wudoo is sufficient)",
            "If water is unavailable, tayammum may be performed on the deceased instead",
          ],
          itemsAr: [
            "الشهداء الذين استُشهدوا في المعركة لا يُغسَّلون — يُدفنون بثيابهم ودمائهم (البخاري ١٣٤٣)",
            "السقط الذي بلغ أربعة أشهر فأكثر (أي بعد نفخ الروح) يُغسَّل ويُسمَّى ويُصلى عليه",
            "يجب على الغاسل حفظ سر الميت وعدم إفشاء ما يراه",
            "يُستحب للغاسل أن يغتسل بعد الانتهاء (وبعض العلماء يكتفون بالوضوء)",
            "إذا تعذَّر الماء جاز التيمم على الميت بدلاً عنه",
          ],
        },
      ],
    },

    {
      id: "tayammum",
      title: "Tayammum (Dry Purification)",
      arabicTitle: "التَّيَمُّم",
      description: "Purification using clean earth when water is unavailable or harmful",
      readTime: 5,
      quranRefs: [{ surah: 4, ayah: 43 }, { surah: 5, ayah: 6 }],
      tags: ["purification", "travel", "illness"],
      sections: [
        {
          type: "quranRef",
          refs: [
            { surah: 4, ayah: 43, note: "First Quranic mention of tayammum" },
            { surah: 5, ayah: 6, note: "Detailed Quranic ruling on tayammum" },
          ],
        },
        {
          type: "text",
          content:
            "Tayammum is the Islamic act of dry purification using clean earth or dust. It is performed instead of wudoo or ghusl when water is unavailable or when using water would cause harm. Allah says (5:6): 'If you are ill or on a journey or one of you comes from the place of relieving himself or you have contacted women and do not find water, then seek clean earth and wipe over your faces and your hands with it.'",
          ar: "التيمم طهارة شرعية بالصعيد الطاهر. يُؤدَّى بديلاً عن الوضوء أو الغسل عند انعدام الماء أو الضرر من استخدامه. قال الله تعالى (المائدة: ٦): ﴿وَإِن كُنتُم مَّرْضَى أَوْ عَلَى سَفَرٍ أَوْ جَاءَ أَحَدٌ مِّنكُم مِّنَ الْغَائِطِ أَوْ لَامَسْتُمُ النِّسَاءَ فَلَمْ تَجِدُوا مَاءً فَتَيَمَّمُوا صَعِيدًا طَيِّبًا فَامْسَحُوا بِوُجُوهِكُمْ وَأَيْدِيكُمْ﴾.",
        },

        {
          type: "heading",
          level: 2,
          text: "The 3 Conditions That Permit Tayammum",
        },
        {
          type: "list",
          items: [
            "1. Water is not available — you are traveling or in a location where water cannot be found within a reasonable distance",
            "2. Water is available but using it would harm your health — illness, injury, or extreme cold with no means to warm the water",
            "3. The available water is only enough for drinking and survival — human life takes priority; purification water cannot be spared",
          ],
          itemsAr: [
            "١. عدم وجود الماء — أنت في سفر أو في مكان لا تجد فيه ماءً في حدود المسافة المعقولة",
            "٢. وجود الماء لكن استخدامه يضر بصحتك — مرض أو جرح أو برد شديد دون وسيلة لتسخين الماء",
            "٣. الماء الموجود لا يكفي إلا للشرب والبقاء — حياة الإنسان أولى، ولا يجوز التضحية بماء الشرب للطهارة",
          ],
        },

        {
          type: "heading",
          level: 2,
          text: "The 2 Obligatory Acts (Fard) of Tayammum",
        },
        {
          type: "callout",
          icon: "Star",
          content:
            "Tayammum has 2 obligatory acts. Each act requires a separate strike of the earth.",
          ar: "للتيمم فرضان. كل فرض يستلزم ضربة مستقلة على الصعيد.",
        },
        {
          type: "list",
          items: [
            "1. Strike the clean earth once, then wipe the face (obligatory — from the Quran: 'wipe over your faces')",
            "2. Strike the clean earth a second time, then wipe the hands to the wrists (obligatory — from the Quran: 'and your hands')",
          ],
          itemsAr: [
            "١. ضربة على الصعيد الطاهر ثم مسح الوجه (فرض — من القرآن: ﴿فَامْسَحُوا بِوُجُوهِكُمْ﴾)",
            "٢. ضربة ثانية على الصعيد الطاهر ثم مسح اليدين إلى الرسغين (فرض — من القرآن: ﴿وَأَيْدِيكُمْ﴾)",
          ],
        },

        {
          type: "heading",
          level: 2,
          text: "What Can Be Used for Tayammum",
        },
        {
          type: "list",
          items: [
            "Pure earth, soil, sand, or dust — the most common and correct substance",
            "Stone, rock, gypsum, or clay — anything from the earth's surface",
            "If there is dust on a wall, car, or surface — that dust may be used",
            "NOT acceptable: food, metal, or wood that has no dust on it",
          ],
          itemsAr: [
            "التراب والرمال والغبار الطاهر — أشيع ما يُستخدم وأصحه",
            "الحجر والصخر والجبس والطين — كل ما هو من وجه الأرض",
            "غبار الجدران أو السيارات أو الأسطح — يجوز التيمم به",
            "لا يصح التيمم بـ: الطعام، أو المعادن، أو الخشب الذي لا غبار عليه",
          ],
        },

        {
          type: "heading",
          level: 2,
          text: "Steps of Tayammum",
        },
        {
          type: "steps",
          items: [
            {
              number: 1,
              title: "Make intention and say Bismillah",
              titleAr: "استحضار النية وقول البسملة",
              description:
                "Form the intention in your heart to perform tayammum as purification in place of wudoo or ghusl. Say 'Bismillah'.",
              descriptionAr:
                "استحضر في قلبك نية التيمم طهارةً بديلاً عن الوضوء أو الغسل. وقل «بسم الله».",
            },
            {
              number: 2,
              title: "First strike — for the face",
              titleAr: "الضربة الأولى — للوجه",
              description:
                "Lightly strike both hands on clean earth, sand, or any clean earthy surface. Blow off excess dust. Wipe the entire face once — from hairline to chin and ear to ear.",
              descriptionAr:
                "اضرب الكفين ضربةً خفيفة على تراب طاهر أو رمال أو أي سطح ترابي طاهر. انفخ الغبار الزائد. امسح الوجه كاملاً من منابت الشعر إلى الذقن ومن الأذن إلى الأذن.",
            },
            {
              number: 3,
              title: "Second strike — for the hands",
              titleAr: "الضربة الثانية — لليدين",
              description:
                "Strike both hands on the clean earth a second time. Wipe the right hand over the back of the left hand, then the left hand over the back of the right hand — up to the wrists only (not the elbows).",
              descriptionAr:
                "اضرب الكفين على الصعيد الطاهر ضربةً ثانية. امسح ظهر اليد اليسرى باليمنى ثم ظهر اليد اليمنى باليسرى — إلى الرسغين فقط (لا إلى المرفقين).",
            },
          ],
        },

        {
          type: "heading",
          level: 2,
          text: "What Invalidates Tayammum",
        },
        {
          type: "list",
          items: [
            "Everything that invalidates wudoo also invalidates tayammum (passing urine, stool, gas, deep sleep, loss of consciousness)",
            "Finding or gaining access to water — if tayammum was performed due to lack of water",
            "Removal of the reason that made tayammum permissible — e.g. illness healed and one can now use water",
          ],
          itemsAr: [
            "كل ما ينقض الوضوء ينقض التيمم أيضاً (البول والغائط والريح والنوم العميق وزوال العقل)",
            "وجود الماء أو القدرة على الوصول إليه — إذا كان التيمم بسبب انعدامه",
            "زوال العذر المُبيح للتيمم — كالشفاء من المرض والقدرة على استخدام الماء",
          ],
        },
        {
          type: "heading",
          level: 2,
          text: "Important Rulings",
        },
        {
          type: "list",
          items: [
            "One tayammum is sufficient for both fard and nafl prayers — you do not need to repeat tayammum for each prayer as long as the reason persists and it is not nullified",
            "Tayammum replaces both wudoo and ghusl — it purifies from both minor and major impurity",
            "If one performs tayammum and then finds water before the prayer, they must use the water and repeat the purification",
            "Tayammum may be performed on a sick person (even while lying) on behalf of them",
          ],
          itemsAr: [
            "يكفي تيمم واحد للفريضة والنافلة معاً — لا تجب إعادة التيمم لكل صلاة ما دام العذر قائماً ولم ينتقض التيمم",
            "التيمم يقوم مقام الوضوء والغسل — يرفع الحدثين الأصغر والأكبر",
            "من تيمَّم ثم وجد الماء قبل الصلاة وجب عليه استخدامه وإعادة الطهارة",
            "يجوز التيمم على المريض (حتى وهو مستلقٍ) بدلاً عنه",
          ],
        },
      ],
    },
  ],
};
