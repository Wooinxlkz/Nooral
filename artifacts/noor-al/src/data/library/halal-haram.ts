import type { LibraryCategory } from "./types";

export const halalHaram: LibraryCategory = {
  id: "halal-haram",
  title: "Halal & Haram",
  arabicTitle: "الحَلَال وَالحَرَام",
  description: "Clear rulings on what is permissible and prohibited in Islam",
  icon: "Scale",
  color: "red",
  articles: [
    {
      id: "food-drink",
      title: "Food & Drink",
      arabicTitle: "الطَّعَام وَالشَّرَاب",
      description: "What is halal, haram, and doubtful regarding food and drink",
      readTime: 10,
      quranRefs: [{ surah: 2, ayah: 168 }, { surah: 5, ayah: 3 }],
      tags: ["food", "halal", "haram", "essential"],
      sections: [
        {
          type: "quranRef",
          refs: [
            { surah: 2, ayah: 168, note: "O people, eat from what is lawful and good on the earth" },
            { surah: 5, ayah: 3, note: "Specific prohibited foods listed" },
          ],
        },
        {
          type: "text",
          content:
            "The default ruling in Islam is that all foods and drinks are halal (permissible) unless specifically prohibited. The Quran says: 'He has only forbidden to you dead animals, blood, the flesh of swine, and that which has been dedicated to other than Allah.' (2:173). Scholars follow scholarly consensus — not personal opinion.",
          ar: "الأصل في الأطعمة والأشربة الإباحة ما لم يرد دليل صريح على التحريم. يقول الله تعالى: ﴿إِنَّمَا حَرَّمَ عَلَيْكُمُ الْمَيْتَةَ وَالدَّمَ وَلَحْمَ الْخِنزِيرِ وَمَا أُهِلَّ بِهِ لِغَيْرِ اللَّهِ﴾ (البقرة: ١٧٣). ويرجع العلماء في تقرير الأحكام إلى الإجماع العلمي، لا إلى الآراء الشخصية.",
        },
        {
          type: "heading", level: 2, text: "Clearly Haram Foods",
        },
        {
          type: "list",
          items: [
            "Pork and all products derived from pigs (gelatin, lard, etc.)",
            "Dead animals (maytah) — those not slaughtered properly",
            "Blood — flowing blood is haram, dried blood mixed in food is also haram",
            "Animals slaughtered in the name of other than Allah",
            "Animals that have been strangled, beaten, killed by a fall, gored, or partly eaten by wild animals — unless slaughtered before death",
            "Donkeys (domestic) — based on authentic hadith (Bukhari & Muslim)",
            "Predatory animals with fangs (lions, tigers, wolves, etc.) — hadith (Muslim)",
            "Birds with talons (eagles, hawks, falcons) — hadith (Muslim)",
            "All intoxicants — alcohol in any amount (Quran 5:90)",
          ],
          itemsAr: [
            "لحم الخنزير وجميع مشتقاته (الجيلاتين والشحم ونحوها)",
            "الميتة — وهي كل حيوان لم يُذبح ذبحاً شرعياً",
            "الدم — الدم السائل حرام، وكذلك الدم الجاف المخلوط بالطعام",
            "ما ذُبح على غير اسم الله أو لغير الله",
            "المنخنقة والموقوذة والمتردية والنطيحة وما أكل السبع — إلا ما أُدرك ذكاته قبل موته",
            "الحمار الأهلي — بنص الأحاديث الصحيحة (البخاري ومسلم)",
            "كل ذي ناب من السباع (الأسد والنمر والذئب وما شابهها) — حديث (مسلم)",
            "كل ذي مخلب من الطيور (النسر والصقر والبازي وما شابهها) — حديث (مسلم)",
            "جميع المسكرات — الخمر بأي قدر كان (القرآن ٥: ٩٠)",
          ],
        },
        {
          type: "heading", level: 2, text: "Conditions for Halal Meat",
        },
        {
          type: "list",
          items: [
            "The animal must be from a permissible species",
            "It must be slaughtered by a Muslim, Christian, or Jew (People of the Book)",
            "The name of Allah must be mentioned at the time of slaughter",
            "The throat, windpipe, and two jugular veins must be cut in one swift motion",
            "The animal must be alive at the time of slaughter",
            "Blood must be allowed to drain",
          ],
          itemsAr: [
            "أن يكون الحيوان من النوع المباح",
            "أن يكون الذابح مسلماً أو مسيحياً أو يهودياً (من أهل الكتاب)",
            "أن يُذكر اسم الله عند الذبح",
            "أن تُقطع الحلقوم والمريء والوريدان (الودجان) بحركة سريعة قاطعة",
            "أن يكون الحيوان حياً وقت الذبح",
            "أن يُترك الدم حتى ينزف",
          ],
        },
        {
          type: "heading", level: 2, text: "Alcohol and Intoxicants",
        },
        {
          type: "text",
          content:
            "Allah says: 'O you who have believed, indeed, intoxicants, gambling, [sacrificing on] stone alters [to other than Allah], and divining arrows are but defilement from the work of Satan, so avoid it that you may be successful.' (5:90). This prohibition is absolute — no amount of alcohol is permitted. Scholars unanimously agree: anything that intoxicates in large quantities is haram even in small quantities.",
          ar: "قال الله تعالى: ﴿يَا أَيُّهَا الَّذِينَ آمَنُوا إِنَّمَا الْخَمْرُ وَالْمَيْسِرُ وَالْأَنصَابُ وَالْأَزْلَامُ رِجْسٌ مِّنْ عَمَلِ الشَّيْطَانِ فَاجْتَنِبُوهُ لَعَلَّكُمْ تُفْلِحُونَ﴾ (المائدة: ٩٠). وهذا التحريم مطلق لا يُستثنى منه شيء. وقد أجمع العلماء على أن: كل ما أسكر كثيره فقليله حرام.",
        },
        {
          type: "callout",
          content:
            "On doubtful matters: The Prophet ﷺ said: 'The halal is clear and the haram is clear, and between them are doubtful matters which many people do not know. Whoever avoids doubtful matters is innocent with regard to his religion and his honor, and whoever falls into doubtful matters will fall into haram.' (Bukhari & Muslim)",
          ar: "في المسائل المشتبهة: قال النبي ﷺ: «الحلال بيِّن، والحرام بيِّن، وبينهما أمور مشتبهات لا يعلمها كثير من الناس. فمن اتقى الشبهات استبرأ لدينه وعرضه، ومن وقع في الشبهات وقع في الحرام». (البخاري ومسلم)",
        },
      ],
    },
    {
      id: "finance",
      title: "Business & Finance",
      arabicTitle: "التِّجَارَة وَالمَالِيَّة",
      description: "Islamic principles for halal income, riba, and business transactions",
      readTime: 8,
      quranRefs: [{ surah: 2, ayah: 275 }],
      tags: ["finance", "riba", "business", "halal"],
      sections: [
        {
          type: "quranRef",
          refs: [
            { surah: 2, ayah: 275, note: "Allah has permitted trade and forbidden riba (interest)" },
            { surah: 2, ayah: 278, note: "O believers, fear Allah and give up what remains of riba" },
          ],
        },
        {
          type: "heading", level: 2, text: "Riba (Interest) — Absolutely Prohibited",
        },
        {
          type: "text",
          content:
            "Riba means any guaranteed increase in a loan or exchange transaction that benefits one party. It is one of the most severely prohibited things in Islam. Allah declares war against those who persist in riba (2:279). This includes: bank interest (both paying and receiving), credit card interest, and usurious loans.",
          ar: "الربا هو كل زيادة مضمونة في عقد قرض أو صرف تعود بالنفع على طرف واحد. وهو من أشد المحرمات في الإسلام. يقول الله تعالى: ﴿فَإِن لَّمْ تَفْعَلُوا فَأْذَنُوا بِحَرْبٍ مِّنَ اللَّهِ وَرَسُولِهِ﴾ (البقرة: ٢٧٩). ويشمل ذلك: فوائد البنوك أخذاً وإعطاءً، وفوائد بطاقات الائتمان، والقروض الربوية.",
        },
        {
          type: "heading", level: 2, text: "Haram Business Practices",
        },
        {
          type: "list",
          items: [
            "Riba — all forms of interest-based transactions",
            "Gharar — excessive uncertainty or deception in contracts (many conventional insurance products fall here)",
            "Maysir — gambling and games of chance (Quran 5:90)",
            "Fraud and deception — misrepresenting goods or services",
            "Selling forbidden items — alcohol, pork, drugs, weapons to those who will misuse them",
            "Monopoly — hoarding essential goods to raise prices",
            "Bribery — giving or receiving bribes",
            "Income from haram industries — working in production/promotion of haram",
          ],
          itemsAr: [
            "الربا — جميع صور التعاملات القائمة على الفائدة",
            "الغرر — الجهالة الفاحشة أو الخداع في العقود (تدخل كثير من عقود التأمين التجاري في هذا)",
            "الميسر — القمار والمراهنات (القرآن ٥: ٩٠)",
            "الغش والتدليس — تزوير صفات السلع أو الخدمات",
            "بيع المحرمات — كالخمر ولحم الخنزير والمخدرات والأسلحة لمن سيسيء استخدامها",
            "الاحتكار — تخزين السلع الضرورية لرفع أسعارها",
            "الرشوة — أخذاً وإعطاءً",
            "الدخل الحرام — العمل في إنتاج المحرمات أو الترويج لها",
          ],
        },
        {
          type: "heading", level: 2, text: "Halal Alternatives",
        },
        {
          type: "list",
          items: [
            "Murabaha — cost-plus financing (bank buys and resells at disclosed profit margin)",
            "Ijarah — Islamic leasing arrangement",
            "Musharakah — profit-and-loss sharing partnership",
            "Takaful — Islamic cooperative insurance",
            "Sukuk — Islamic bonds based on assets not interest",
          ],
          itemsAr: [
            "المرابحة — تمويل بهامش ربح معلوم (يشتري البنك ويعيد البيع بربح مُفصَح عنه)",
            "الإجارة — عقد الإيجار الإسلامي",
            "المشاركة — شراكة في الأرباح والخسائر",
            "التكافل — التأمين التعاوني الإسلامي",
            "الصكوك — أوراق مالية إسلامية مرتبطة بأصول حقيقية لا بفوائد",
          ],
        },
        {
          type: "callout",
          content:
            "Scholars agree: income earned from clearly haram sources must be given away in charity (not kept, not used personally). A Muslim in difficulty should seek halal alternatives before resorting to haram.",
          ar: "أجمع العلماء على أن: الدخل المكتسب من مصادر محرمة صريحة يجب التصدق به (لا يُحتفظ به ولا يُنتفع به شخصياً). وعلى المسلم المضطر أن يسعى في إيجاد البديل الحلال قبل اللجوء إلى الحرام.",
        },
      ],
    },
    {
      id: "relationships",
      title: "Relationships & Social Conduct",
      arabicTitle: "العَلَاقَات وَالسُّلُوك الاجْتِمَاعِي",
      description: "Islamic guidelines on interactions between men and women, family, and community",
      readTime: 8,
      tags: ["relationships", "social", "gender", "family"],
      sections: [
        {
          type: "heading", level: 2, text: "Lowering the Gaze",
        },
        {
          type: "quranRef",
          refs: [{ surah: 24, ayah: 30, note: "Tell the believing men to lower their gaze and guard their private parts" }, { surah: 24, ayah: 31, note: "Tell the believing women to lower their gaze" }],
        },
        {
          type: "text",
          content:
            "Both men and women are commanded to lower their gaze from looking at the opposite sex with desire. The Prophet ﷺ called the gaze 'a poisoned arrow from the arrows of Iblis.' (Ahmad). Incidental glance is forgiven; intentional, prolonged looking is haram.",
          ar: "أُمر الرجال والنساء جميعاً بغض أبصارهم عن النظر بشهوة إلى الجنس الآخر. ووصف النبي ﷺ النظرة بأنها «سهم مسموم من سهام إبليس» (أحمد). أما النظرة العفوية غير المقصودة فمعفوٌّ عنها، والنظرة المتعمدة المطوَّلة حرام.",
        },
        {
          type: "heading", level: 2, text: "Khalwah — Seclusion",
        },
        {
          type: "text",
          content:
            "The Prophet ﷺ said: 'No man should be alone with a woman, and no woman should travel except with a mahram.' (Bukhari & Muslim). Khalwah (a man and a non-mahram woman being alone together in a private space) is haram — it creates opportunity for sin and is a means of Shaytan's influence.",
          ar: "قال النبي ﷺ: «لا يخلوَنَّ رجل بامرأة، ولا تسافرَنَّ امرأة إلا مع ذي محرم» (البخاري ومسلم). والخلوة — وهي انفراد الرجل بامرأة أجنبية عنه في مكان خاص — حرامٌ، إذ تفتح باب الفتنة وتُعطي إبليس فرصةً للتأثير.",
        },
        {
          type: "heading", level: 2, text: "Zina (Fornication/Adultery)",
        },
        {
          type: "text",
          content:
            "Zina is among the gravest sins in Islam. Allah says: 'And do not approach unlawful sexual intercourse. Indeed, it is ever an immorality and is evil as a way.' (17:32). All steps leading to zina are also prohibited — dating, intimate conversations, touching, being alone.",
          ar: "الزنا من أشد الكبائر في الإسلام. يقول الله تعالى: ﴿وَلَا تَقْرَبُوا الزِّنَا إِنَّهُ كَانَ فَاحِشَةً وَسَاءَ سَبِيلًا﴾ (الإسراء: ٣٢). وكل ما يُفضي إلى الزنا محرَّمٌ أيضاً — كالمواعدة، والحديث الحميم، واللمس، والخلوة.",
        },
        {
          type: "heading", level: 2, text: "Marriage in Islam",
        },
        {
          type: "list",
          items: [
            "Marriage is the only permissible avenue for sexual relations",
            "The wali (guardian) of the woman must give consent",
            "The woman must give her consent",
            "A mahr (dowry/gift) must be given by the groom to the bride",
            "Two witnesses must be present",
            "Marriage must be publicized — secret marriages are not valid",
          ],
          itemsAr: [
            "الزواج هو السبيل الوحيد المشروع للعلاقة الجنسية",
            "يجب أن يأذن وليُّ المرأة بالزواج",
            "يجب أن تُعطي المرأة موافقتها",
            "يجب على الزوج أن يُقدِّم مهراً للزوجة",
            "يجب حضور شاهدين عدلين",
            "يجب الإعلان عن الزواج — فالزواج السري غير صحيح",
          ],
        },
      ],
    },
  ],
};
