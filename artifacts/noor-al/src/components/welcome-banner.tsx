import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { Lang } from "@/lib/i18n";
import { RTL_LANGS } from "@/lib/i18n";
import { createPortal } from "react-dom";

const SEEN_KEY = "nooral-welcome-seen-v2";

const STRINGS: Record<Lang, {
  greeting: string;
  subtitle: string;
  hadithLabel: string;
  narrator: string;
  dismiss: string;
}> = {
  en: {
    greeting: "Assalamu Alaikum 👋",
    subtitle: "Welcome to NoorAl",
    hadithLabel: "Hadith of the Moment",
    narrator: "Narrated by",
    dismiss: "Begin",
  },
  ar: {
    greeting: "السلام عليكم 👋",
    subtitle: "مرحباً بك في نور آل",
    hadithLabel: "حديث اللحظة",
    narrator: "رواه",
    dismiss: "ابدأ",
  },
  fr: {
    greeting: "Assalamu Alaikum 👋",
    subtitle: "Bienvenue sur NoorAl",
    hadithLabel: "Hadith du moment",
    narrator: "Rapporté par",
    dismiss: "Commencer",
  },
  ur: {
    greeting: "السلام علیکم 👋",
    subtitle: "نور آل میں خوش آمدید",
    hadithLabel: "لمحے کی حدیث",
    narrator: "روایت",
    dismiss: "شروع کریں",
  },
  bn: {
    greeting: "আসসালামু আলাইকুম 👋",
    subtitle: "NoorAl-এ স্বাগতম",
    hadithLabel: "মুহূর্তের হাদিস",
    narrator: "বর্ণিত",
    dismiss: "শুরু করুন",
  },
  tr: {
    greeting: "Selamün Aleyküm 👋",
    subtitle: "NoorAl'a Hoş Geldiniz",
    hadithLabel: "Anın Hadisi",
    narrator: "Rivayet eden",
    dismiss: "Başla",
  },
  id: {
    greeting: "Assalamualaikum 👋",
    subtitle: "Selamat Datang di NoorAl",
    hadithLabel: "Hadits Saat Ini",
    narrator: "Diriwayatkan oleh",
    dismiss: "Mulai",
  },
  es: {
    greeting: "Assalamu Alaikum 👋",
    subtitle: "Bienvenido a NoorAl",
    hadithLabel: "Hadiz del momento",
    narrator: "Narrado por",
    dismiss: "Comenzar",
  },
  de: {
    greeting: "Assalamu Alaikum 👋",
    subtitle: "Willkommen bei NoorAl",
    hadithLabel: "Hadith des Moments",
    narrator: "Überliefert von",
    dismiss: "Beginnen",
  },
  ru: {
    greeting: "Ассаламу Алейкум 👋",
    subtitle: "Добро пожаловать в NoorAl",
    hadithLabel: "Хадис момента",
    narrator: "Передано от",
    dismiss: "Начать",
  },
  ms: {
    greeting: "Assalamualaikum 👋",
    subtitle: "Selamat Datang ke NoorAl",
    hadithLabel: "Hadis Ketika Ini",
    narrator: "Diriwayatkan oleh",
    dismiss: "Mula",
  },
  fa: {
    greeting: "السلام علیکم 👋",
    subtitle: "به نور آل خوش آمدید",
    hadithLabel: "حدیث لحظه",
    narrator: "روایت از",
    dismiss: "شروع",
  },
};

type HadithTranslations = Partial<Record<Lang, string>>;

interface HadithEntry {
  textAr: string;
  translations: HadithTranslations;
  source: string;
  narrator: string;
}

const SPEAK_GOOD_TRANSLATIONS: HadithTranslations = {
  en: "Speak good or remain silent.",
  fr: "Que celui qui croit en Allah et au Jour dernier dise du bien ou se taise.",
  ur: "جو اللہ اور یومِ آخرت پر ایمان رکھتا ہے وہ اچھی بات کہے یا خاموش رہے۔",
  bn: "যে আল্লাহ ও শেষ দিবসে বিশ্বাস করে, সে যেন ভালো কথা বলে অথবা চুপ থাকে।",
  tr: "Allah'a ve ahiret gününe iman eden kimse ya hayır söylesin ya da sussun.",
  id: "Barangsiapa beriman kepada Allah dan hari akhir, hendaklah ia berkata baik atau diam.",
  es: "Quien crea en Allah y en el Último Día, que hable bien o guarde silencio.",
  de: "Wer an Allah und den Jüngsten Tag glaubt, der spreche Gutes oder schweige.",
  ru: "Кто верует в Аллаха и Судный день, пусть говорит благое или молчит.",
  ms: "Sesiapa yang beriman kepada Allah dan hari akhirat, hendaklah dia berkata baik atau diam.",
  fa: "هر کس به خدا و روز قیامت ایمان دارد، باید سخن نیک بگوید یا سکوت کند.",
};

const AHADITH: HadithEntry[] = [
  {
    textAr: "إِنَّ مِنْ خِيَارِكُمْ أَحَاسِنَكُمْ أَخْلَاقًا",
    translations: {
      en: "The best among you are those who have the best manners and character.",
      fr: "Les meilleurs d'entre vous sont ceux qui ont les meilleures manières et le meilleur caractère.",
      ur: "تم میں سب سے بہتر وہ ہے جو اخلاق میں سب سے اچھا ہو۔",
      bn: "তোমাদের মধ্যে সর্বোত্তম ব্যক্তি সে, যার চরিত্র ও আচরণ সবচেয়ে উত্তম।",
      tr: "Sizin en hayırlınız, ahlakı en güzel olanınızdır.",
      id: "Sebaik-baik kalian adalah yang paling baik akhlak dan budi pekertinya.",
      es: "Los mejores entre vosotros son los que tienen mejores modales y carácter.",
      de: "Die Besten unter euch sind die mit dem besten Charakter und den besten Manieren.",
      ru: "Лучшие из вас — те, у кого самый лучший нрав и характер.",
      ms: "Sebaik-baik kamu ialah yang paling baik akhlak dan peribadinya.",
      fa: "بهترین شما کسانی هستند که اخلاق و رفتار نیکوتری دارند.",
    },
    source: "Sahih al-Bukhari 3559",
    narrator: "Abdullah ibn Amr (رضي الله عنه)",
  },
  {
    textAr: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    translations: {
      en: "None of you truly believes until he loves for his brother what he loves for himself.",
      fr: "Aucun de vous n'est vraiment croyant tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
      ur: "تم میں سے کوئی اس وقت تک مومن نہیں ہو سکتا جب تک وہ اپنے بھائی کے لیے وہی پسند نہ کرے جو اپنے لیے پسند کرتا ہے۔",
      bn: "তোমাদের কেউ ততক্ষণ পর্যন্ত প্রকৃত মুমিন হতে পারবে না, যতক্ষণ না সে তার ভাইয়ের জন্য তা-ই পছন্দ করে, যা নিজের জন্য পছন্দ করে।",
      tr: "Hiçbiriniz, kendisi için istediğini kardeşi için de istemedikçe gerçek anlamda iman etmiş olmaz.",
      id: "Tidaklah beriman salah seorang di antara kalian sehingga ia mencintai saudaranya sebagaimana ia mencintai dirinya sendiri.",
      es: "Ninguno de vosotros es verdadero creyente hasta que ame para su hermano lo que ama para sí mismo.",
      de: "Keiner von euch glaubt wahrhaftig, bis er für seinen Bruder das liebt, was er für sich selbst liebt.",
      ru: "Никто из вас не уверует по-настоящему, пока не станет желать своему брату того же, чего желает себе.",
      ms: "Tidak beriman seseorang daripada kamu sehingga dia mengasihi saudaranya sebagaimana dia mengasihi dirinya sendiri.",
      fa: "هیچ‌یک از شما مؤمن واقعی نیست تا وقتی که برای برادرش همان چیزی را دوست بدارد که برای خودش دوست دارد.",
    },
    source: "Sahih al-Bukhari 13",
    narrator: "Anas ibn Malik (رضي الله عنه)",
  },
  {
    textAr: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    translations: SPEAK_GOOD_TRANSLATIONS,
    source: "Sahih al-Bukhari 6018",
    narrator: "Abu Hurairah (رضي الله عنه)",
  },
  {
    textAr: "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ",
    translations: {
      en: "The strong man is not the one who overcomes people by his strength, but the one who controls himself while in anger.",
      fr: "Le fort n'est pas celui qui terrasse les autres par sa force, mais celui qui se maîtrise lorsqu'il est en colère.",
      ur: "طاقتور وہ نہیں جو دوسروں کو پچھاڑ دے بلکہ طاقتور وہ ہے جو غصے کے وقت اپنے آپ پر قابو رکھے۔",
      bn: "শক্তিশালী সে নয় যে কুস্তিতে অন্যকে পরাজিত করে, বরং শক্তিশালী সে, যে রাগের সময় নিজেকে নিয়ন্ত্রণ করতে পারে।",
      tr: "Güçlü kimse, insanları güreşte yenen değil, öfkelendiğinde nefsine hâkim olandır.",
      id: "Orang yang kuat bukanlah yang menang bergulat, tetapi yang mampu mengendalikan dirinya saat marah.",
      es: "El fuerte no es quien vence a otros con su fuerza, sino quien se controla cuando está enojado.",
      de: "Der Starke ist nicht der, der andere mit Kraft besiegt, sondern der, der sich im Zorn beherrscht.",
      ru: "Сильный — не тот, кто побеждает других силой, а тот, кто владеет собой в гневе.",
      ms: "Orang yang kuat bukanlah yang menewaskan orang lain melalui pergelutan, tetapi yang dapat mengawal dirinya ketika marah.",
      fa: "قوی کسی نیست که دیگران را با زور شکست دهد، بلکه قوی کسی است که هنگام خشم بر خود مسلط باشد.",
    },
    source: "Sahih al-Bukhari 6114",
    narrator: "Abu Hurairah (رضي الله عنه)",
  },
  {
    textAr: "يَسِّرُوا وَلَا تُعَسِّرُوا، وَبَشِّرُوا وَلَا تُنَفِّرُوا",
    translations: {
      en: "Make things easy and do not make them difficult. Cheer people up and do not drive them away.",
      fr: "Facilitez et ne compliquez pas, réjouissez les gens et ne les repoussez pas.",
      ur: "آسانی پیدا کرو، مشکل پیدا نہ کرو، خوشخبری دو اور نفرت نہ دلاؤ۔",
      bn: "সহজ করো, কঠিন করো না; সুসংবাদ দাও, বিতৃষ্ণ করো না।",
      tr: "Kolaylaştırın, zorlaştırmayın; müjdeleyin, nefret ettirmeyin.",
      id: "Permudahlah dan jangan mempersulit, gembirakanlah dan jangan membuat orang lari.",
      es: "Facilitad y no dificultéis, alegrad a la gente y no la alejéis.",
      de: "Erleichtert und erschwert nicht, erfreut die Menschen und vertreibt sie nicht.",
      ru: "Облегчайте, а не усложняйте; радуйте людей, а не отталкивайте их.",
      ms: "Permudahkanlah dan jangan menyusahkan, gembirakanlah dan jangan menjauhkan.",
      fa: "آسان بگیرید و سخت نگیرید، مژده دهید و نفرت ایجاد نکنید.",
    },
    source: "Sahih al-Bukhari 69",
    narrator: "Anas ibn Malik (رضي الله عنه)",
  },
  {
    textAr: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    translations: {
      en: "A Muslim is one from whose tongue and hands the Muslims are safe.",
      fr: "Le musulman est celui dont la langue et la main ne nuisent pas aux autres musulmans.",
      ur: "مسلمان وہ ہے جس کی زبان اور ہاتھ سے دوسرے مسلمان محفوظ رہیں۔",
      bn: "মুসলিম সে-ই, যার জিহ্বা ও হাত থেকে অন্য মুসলিমরা নিরাপদ থাকে।",
      tr: "Müslüman, dilinden ve elinden diğer müslümanların güvende olduğu kimsedir.",
      id: "Seorang muslim adalah orang yang membuat muslim lainnya selamat dari lisan dan tangannya.",
      es: "El musulmán es aquel de cuya lengua y manos los demás musulmanes están a salvo.",
      de: "Ein Muslim ist derjenige, vor dessen Zunge und Hand die anderen Muslime sicher sind.",
      ru: "Мусульманин — тот, от языка и рук которого другие мусульмане в безопасности.",
      ms: "Muslim ialah orang yang lidah dan tangannya tidak mendatangkan bahaya kepada muslim yang lain.",
      fa: "مسلمان کسی است که مسلمانان دیگر از زبان و دست او در امان باشند.",
    },
    source: "Sahih al-Bukhari 10",
    narrator: "Abdullah ibn Amr (رضي الله عنه)",
  },
  {
    textAr: "لَا تُسْرِفْ وَلَوْ كُنْتَ عَلَى نَهَرٍ جَارٍ",
    translations: {
      en: "Do not waste water even if you are at a running stream.",
      fr: "Ne gaspille pas l'eau, même si tu te trouves au bord d'une rivière courante.",
      ur: "پانی ضائع نہ کرو خواہ تم بہتی ہوئی ندی کے کنارے ہی کیوں نہ ہو۔",
      bn: "পানি অপচয় করো না, যদিও তুমি প্রবহমান নদীর ধারে থাকো।",
      tr: "Akan bir nehrin kenarında olsan bile suyu israf etme.",
      id: "Janganlah boros dalam menggunakan air, meskipun engkau berada di tepi sungai yang mengalir.",
      es: "No desperdicies el agua, aunque estés junto a un río que fluye.",
      de: "Verschwende kein Wasser, selbst wenn du an einem fließenden Fluss bist.",
      ru: "Не расточай воду, даже если находишься у текущей реки.",
      ms: "Janganlah membazir air walaupun kamu berada di tepi sungai yang mengalir.",
      fa: "آب را هدر نده، حتی اگر کنار رودخانه‌ای جاری باشی.",
    },
    source: "Sunan Ibn Majah 425",
    narrator: "Abdullah ibn Amr (رضي الله عنه)",
  },
  {
    textAr: "أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ",
    translations: {
      en: "The most beloved deeds to Allah are those done regularly, even if they are small.",
      fr: "Les actions les plus aimées d'Allah sont celles qui sont faites régulièrement, même si elles sont petites.",
      ur: "اللہ کو سب سے پیارے وہ اعمال ہیں جو ہمیشگی سے کیے جائیں خواہ وہ تھوڑے ہی کیوں نہ ہوں۔",
      bn: "আল্লাহর কাছে সবচেয়ে প্রিয় আমল সেটাই, যা নিয়মিত করা হয়, যদিও তা অল্প হয়।",
      tr: "Allah'a en sevimli ameller, az da olsa devamlı yapılanlardır.",
      id: "Amalan yang paling dicintai Allah adalah yang dilakukan secara terus-menerus, meskipun sedikit.",
      es: "Las obras más amadas por Allah son las que se hacen con constancia, aunque sean pequeñas.",
      de: "Die von Allah am meisten geliebten Taten sind die, die regelmäßig verrichtet werden, auch wenn sie klein sind.",
      ru: "Самые любимые Аллахом дела — те, что совершаются постоянно, даже если они малы.",
      ms: "Amalan yang paling disukai Allah ialah yang dilakukan secara berterusan walaupun sedikit.",
      fa: "محبوب‌ترین اعمال نزد خداوند، اعمالی است که با تداوم انجام شود، هرچند کم باشد.",
    },
    source: "Sahih al-Bukhari 6465",
    narrator: "Aisha (رضي الله عنها)",
  },
  {
    textAr: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ",
    translations: {
      en: "Smiling at your brother is an act of charity.",
      fr: "Sourire à ton frère est un acte de charité.",
      ur: "اپنے بھائی کے چہرے پر مسکرانا صدقہ ہے۔",
      bn: "তোমার ভাইয়ের দিকে হাসিমুখে তাকানো একটি সদকা।",
      tr: "Kardeşine gülümsemen bir sadakadır.",
      id: "Senyummu kepada saudaramu adalah sedekah.",
      es: "Sonreír a tu hermano es un acto de caridad.",
      de: "Deinem Bruder zuzulächeln ist ein Akt der Wohltätigkeit.",
      ru: "Улыбка брату — это милостыня.",
      ms: "Senyumanmu kepada saudaramu adalah sedekah.",
      fa: "لبخند زدن به برادرت صدقه است.",
    },
    source: "Jami' at-Tirmidhi 1956",
    narrator: "Abu Dharr (رضي الله عنه)",
  },
  {
    textAr: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    translations: SPEAK_GOOD_TRANSLATIONS,
    source: "Sahih al-Bukhari 6475",
    narrator: "Abu Hurairah (رضي الله عنه)",
  },
  {
    textAr: "اغْتَنِمْ خَمْسًا قَبْلَ خَمْسٍ: شَبَابَكَ قَبْلَ هَرَمِكَ، وَصِحَّتَكَ قَبْلَ سَقَمِكَ، وَغِنَاكَ قَبْلَ فَقْرِكَ، وَفَرَاغَكَ قَبْلَ شُغْلِكَ، وَحَيَاتَكَ قَبْلَ مَوْتِكَ",
    translations: {
      en: "Take advantage of five before five: your youth before your old age, your health before your sickness, your wealth before your poverty, your free time before your busyness, and your life before your death.",
      fr: "Profite de cinq choses avant cinq autres : ta jeunesse avant ta vieillesse, ta santé avant ta maladie, ta richesse avant ta pauvreté, ton temps libre avant ton occupation, et ta vie avant ta mort.",
      ur: "پانچ چیزوں کو پانچ سے پہلے غنیمت جانو: جوانی کو بڑھاپے سے پہلے، صحت کو بیماری سے پہلے، مال داری کو فقیری سے پہلے، فراغت کو مشغولیت سے پہلے، اور زندگی کو موت سے پہلے۔",
      bn: "পাঁচটি জিনিসকে পাঁচটির আগে গণিমত মনে করো: বার্ধক্যের আগে যৌবনকে, অসুস্থতার আগে সুস্থতাকে, দারিদ্র্যের আগে সচ্ছলতাকে, ব্যস্ততার আগে অবসরকে এবং মৃত্যুর আগে জীবনকে।",
      tr: "Beş şeyden önce beş şeyi ganimet bil: İhtiyarlığından önce gençliğini, hastalığından önce sağlığını, fakirliğinden önce zenginliğini, meşguliyetinden önce boş vaktini ve ölümünden önce hayatını.",
      id: "Manfaatkanlah lima perkara sebelum datang lima perkara: masa mudamu sebelum tua, sehatmu sebelum sakit, kayamu sebelum miskin, waktu luangmu sebelum sibuk, dan hidupmu sebelum matimu.",
      es: "Aprovecha cinco cosas antes de cinco: tu juventud antes de tu vejez, tu salud antes de tu enfermedad, tu riqueza antes de tu pobreza, tu tiempo libre antes de tus ocupaciones, y tu vida antes de tu muerte.",
      de: "Nutze fünf Dinge vor fünf anderen: deine Jugend vor deinem Alter, deine Gesundheit vor deiner Krankheit, deinen Reichtum vor deiner Armut, deine Freizeit vor deiner Beschäftigung und dein Leben vor deinem Tod.",
      ru: "Цени пять вещей до наступления пяти других: молодость до старости, здоровье до болезни, богатство до бедности, свободное время до занятости и жизнь до смерти.",
      ms: "Ambillah peluang lima perkara sebelum lima perkara: mudamu sebelum tua, sihatmu sebelum sakit, kayamu sebelum miskin, lapangmu sebelum sibuk, dan hidupmu sebelum mati.",
      fa: "پنج چیز را پیش از پنج چیز غنیمت بشمار: جوانی‌ات را پیش از پیری، سلامتی‌ات را پیش از بیماری، ثروتت را پیش از فقر، فراغتت را پیش از مشغولیت، و زندگی‌ات را پیش از مرگ.",
    },
    source: "Shu'ab al-Iman 9575",
    narrator: "Ibn Abbas (رضي الله عنهما)",
  },
  {
    textAr: "مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا نَفَّسَ اللَّهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ الْقِيَامَةِ",
    translations: {
      en: "Whoever removes a worldly hardship from a believer, Allah will remove one of his hardships on the Day of Resurrection.",
      fr: "Quiconque soulage un croyant d'une difficulté de ce monde, Allah le soulagera d'une difficulté le Jour de la Résurrection.",
      ur: "جو کسی مومن سے دنیا کی کوئی مشکل دور کرے، اللہ قیامت کے دن اس کی مشکلات میں سے ایک مشکل دور کرے گا۔",
      bn: "যে ব্যক্তি কোনো মুমিনের দুনিয়াবি কষ্ট দূর করে, আল্লাহ কিয়ামতের দিন তার কষ্টগুলোর একটি দূর করে দেবেন।",
      tr: "Kim bir mü'minin dünya sıkıntılarından birini giderirse, Allah da kıyamet günü onun sıkıntılarından birini giderir.",
      id: "Barangsiapa menghilangkan satu kesusahan dunia seorang mukmin, Allah akan menghilangkan salah satu kesusahannya pada hari Kiamat.",
      es: "Quien alivie a un creyente de una dificultad de este mundo, Allah le aliviará una de sus dificultades el Día de la Resurrección.",
      de: "Wer einem Gläubigen eine weltliche Not erleichtert, dem wird Allah am Tag der Auferstehung eine seiner Nöte erleichtern.",
      ru: "Кто избавит верующего от мирской беды, того Аллах избавит от одной из бед в Судный день.",
      ms: "Sesiapa yang menghilangkan satu kesusahan dunia daripada seorang mukmin, Allah akan menghilangkan satu daripada kesusahannya pada hari Kiamat.",
      fa: "هر کس گرفتاری دنیوی مؤمنی را برطرف کند، خداوند در روز قیامت یکی از گرفتاری‌های او را برطرف می‌کند.",
    },
    source: "Sahih Muslim 2699",
    narrator: "Abu Hurairah (رضي الله عنه)",
  },
  {
    textAr: "مَا يُصِيبُ الْمُسْلِمَ مِنْ نَصَبٍ وَلَا وَصَبٍ وَلَا هَمٍّ وَلَا حُزْنٍ وَلَا أَذًى وَلَا غَمٍّ حَتَّى الشَّوْكَةِ يُشَاكُهَا إِلَّا كَفَّرَ اللَّهُ بِهَا مِنْ خَطَايَاهُ",
    translations: {
      en: "No fatigue, illness, anxiety, sorrow, harm, or sadness afflicts a Muslim — even a prick of a thorn — but Allah expiates some of his sins for that.",
      fr: "Aucune fatigue, maladie, souci, tristesse, tort ou chagrin n'atteint un musulman, pas même une épine qui le pique, sans qu'Allah n'efface par cela une partie de ses péchés.",
      ur: "مسلمان کو جو بھی تکلیف، بیماری، غم، پریشانی، اذیت یا رنج پہنچے حتیٰ کہ کانٹا بھی چبھے تو اللہ اس کے بدلے اس کے گناہ معاف کر دیتا ہے۔",
      bn: "কোনো মুসলিমকে যে কষ্ট, রোগ, দুশ্চিন্তা, দুঃখ, ক্ষতি বা বেদনা স্পর্শ করে—এমনকি একটি কাঁটার খোঁচাও—আল্লাহ তার বিনিময়ে তার কিছু গুনাহ মোচন করে দেন।",
      tr: "Müslümana bir yorgunluk, hastalık, tasa, keder, eziyet ve üzüntü isabet etmez, hatta bir diken batması bile olsa, Allah bunun karşılığında onun günahlarından bir kısmını bağışlar.",
      id: "Tidaklah seorang muslim ditimpa keletihan, penyakit, kecemasan, kesedihan, gangguan, ataupun kesusahan, bahkan duri yang menusuknya, melainkan Allah akan menghapus sebagian dosanya dengan itu.",
      es: "Ningún cansancio, enfermedad, ansiedad, tristeza, daño o pena afecta a un musulmán, ni siquiera el pinchazo de una espina, sin que Allah expíe por ello alguno de sus pecados.",
      de: "Keine Erschöpfung, Krankheit, Sorge, Trauer, Leid oder Kummer trifft einen Muslim – nicht einmal der Stich eines Dorns –, ohne dass Allah dadurch einen Teil seiner Sünden tilgt.",
      ru: "Какая бы усталость, болезнь, тревога, печаль, вред или горе ни постигли мусульманина, даже укол шипом, — Аллах непременно искупит этим часть его грехов.",
      ms: "Tidak menimpa seorang muslim itu keletihan, penyakit, kerisauan, kesedihan, gangguan atau kesusahan, sehinggakan tercucuk duri sekalipun, melainkan Allah menghapuskan dengannya sebahagian dosanya.",
      fa: "هیچ خستگی، بیماری، اندوه، غم، آزار یا ناراحتی به مسلمانی نمی‌رسد، حتی خاری که به او فرو رود، مگر اینکه خداوند به سبب آن بخشی از گناهانش را می‌بخشد.",
    },
    source: "Sahih al-Bukhari 5641",
    narrator: "Abu Said & Abu Hurairah (رضي الله عنهما)",
  },
  {
    textAr: "إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ، وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ",
    translations: {
      en: "Verily, Allah does not look at your appearance or wealth, but He looks at your hearts and your deeds.",
      fr: "Allah ne regarde pas votre apparence ni vos richesses, mais Il regarde vos cœurs et vos actions.",
      ur: "بے شک اللہ تمہاری شکل و صورت اور مال کو نہیں دیکھتا بلکہ تمہارے دلوں اور اعمال کو دیکھتا ہے۔",
      bn: "নিশ্চয়ই আল্লাহ তোমাদের আকৃতি ও সম্পদের দিকে তাকান না, বরং তিনি তোমাদের অন্তর ও আমলের দিকে তাকান।",
      tr: "Şüphesiz Allah sizin suretlerinize ve mallarınıza bakmaz, ancak kalplerinize ve amellerinize bakar.",
      id: "Sesungguhnya Allah tidak melihat rupa dan hartamu, tetapi Dia melihat hati dan amalmu.",
      es: "En verdad, Allah no mira vuestra apariencia ni vuestras riquezas, sino que mira vuestros corazones y vuestras obras.",
      de: "Wahrlich, Allah schaut nicht auf euer Aussehen oder euren Reichtum, sondern Er schaut auf eure Herzen und eure Taten.",
      ru: "Поистине, Аллах не смотрит на ваш облик и богатство, а смотрит на ваши сердца и деяния.",
      ms: "Sesungguhnya Allah tidak melihat kepada rupa dan harta kamu, tetapi Dia melihat kepada hati dan amalan kamu.",
      fa: "همانا خداوند به ظاهر و اموال شما نمی‌نگرد، بلکه به دل‌ها و اعمال شما می‌نگرد.",
    },
    source: "Sahih Muslim 2564",
    narrator: "Abu Hurairah (رضي الله عنه)",
  },
  {
    textAr: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
    translations: {
      en: "The seeking of knowledge is obligatory upon every Muslim.",
      fr: "La recherche du savoir est une obligation pour tout musulman.",
      ur: "علم حاصل کرنا ہر مسلمان پر فرض ہے۔",
      bn: "জ্ঞান অর্জন করা প্রত্যেক মুসলিমের জন্য ফরজ।",
      tr: "İlim öğrenmek her müslümana farzdır.",
      id: "Menuntut ilmu adalah kewajiban bagi setiap muslim.",
      es: "La búsqueda del conocimiento es una obligación para todo musulmán.",
      de: "Das Streben nach Wissen ist jedem Muslim zur Pflicht gemacht.",
      ru: "Стремление к знанию является обязанностью каждого мусульманина.",
      ms: "Menuntut ilmu adalah wajib ke atas setiap orang Islam.",
      fa: "کسب علم بر هر مسلمانی واجب است.",
    },
    source: "Sunan Ibn Majah 224",
    narrator: "Anas ibn Malik (رضي الله عنه)",
  },
];

const DELAY_MS = 800;

function pickHadith(): typeof AHADITH[number] {
  return AHADITH[Math.floor(Math.random() * AHADITH.length)];
}

export function WelcomeBanner() {
  const language = useAppStore((s) => s.language) as Lang;
  const [visible, setVisible] = useState(false);
  const hadithRef = useRef(pickHadith());

  const t = STRINGS[language] ?? STRINGS.en;
  const isRtl = RTL_LANGS.has(language);

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) return;
    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    sessionStorage.setItem(SEEN_KEY, "1");
    setVisible(false);
  }

  const hadith = hadithRef.current;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="welcome-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
            onClick={dismiss}
          />

          {/* Centering shell — flex does the work, no transform conflict */}
          <div
            key="welcome-shell"
            className="fixed inset-0 z-[81] flex items-center justify-center p-4 pointer-events-none"
          >
          {/* Card */}
          <motion.div
            key="welcome-card"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: "spring", stiffness: 420, damping: 36, mass: 0.85 }}
            className="w-full max-w-[440px] pointer-events-auto"
            dir={isRtl ? "rtl" : "ltr"}
          >
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{
                background: "linear-gradient(160deg, #122f24 0%, #0b1f19 100%)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)",
              }}
            >
              {/* Decorative top glow */}
              <div
                className="pointer-events-none absolute -top-16 left-1/2 h-32 w-64 -translate-x-1/2 rounded-full"
                style={{ background: "radial-gradient(ellipse, rgba(76,175,125,0.18) 0%, transparent 70%)" }}
              />

              <div className="relative p-6">
                {/* Header */}
                <div className="mb-5 flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={dismiss}
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/10 hover:text-white/60"
                    aria-label="Dismiss"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  <div className="flex flex-1 flex-col items-center gap-1 text-center">
                    <p className="text-base font-semibold text-white leading-snug">{t.greeting}</p>
                    <p className="text-[11px] font-medium" style={{ color: "#4caf7d" }}>{t.subtitle}</p>
                  </div>

                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: "linear-gradient(135deg, #1e5e3e 0%, #163d2a 100%)",
                      boxShadow: "0 0 0 1px rgba(76,175,125,0.25)",
                    }}
                  >
                    <span
                      className="font-arabic text-lg font-bold text-white leading-none"
                      style={{ textShadow: "0 0 10px rgba(76,175,125,0.6)" }}
                    >
                      ن
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="mb-5 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />

                {/* Hadith card */}
                <div
                  className="mb-5 rounded-xl p-4"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                  }}
                >
                  {/* Label */}
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-px flex-1" style={{ background: "rgba(76,175,125,0.25)" }} />
                    <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#4caf7d" }}>
                      {t.hadithLabel}
                    </span>
                    <div className="h-px flex-1" style={{ background: "rgba(76,175,125,0.25)" }} />
                  </div>

                  {/* Hadith text — Arabic always on top */}
                  <p
                    dir="rtl"
                    lang="ar"
                    className="font-arabic mb-2 text-[16px] leading-relaxed text-white text-center"
                  >
                    {hadith.textAr}
                  </p>

                  {/* Translation in the selected language (skipped when Arabic is the chosen language) */}
                  {language !== "ar" && (
                    <p
                      dir={isRtl ? "rtl" : "ltr"}
                      className="mb-3 text-[13px] leading-relaxed text-white/70 text-center italic"
                    >
                      "{hadith.translations[language] ?? hadith.translations.en}"
                    </p>
                  )}

                  {/* Source + narrator */}
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[11px] font-medium" style={{ color: "#4caf7d" }}>
                      {hadith.source}
                    </span>
                    <span className="text-[10.5px] text-white/35">
                      {hadith.narrator}
                    </span>
                  </div>
                </div>

                {/* Dismiss button */}
                <button
                  type="button"
                  onClick={dismiss}
                  className="w-full rounded-xl py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #2e7d52 0%, #1e5e3e 100%)",
                    boxShadow: "0 2px 16px rgba(46,125,82,0.35)",
                  }}
                >
                  {t.dismiss}
                </button>
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
