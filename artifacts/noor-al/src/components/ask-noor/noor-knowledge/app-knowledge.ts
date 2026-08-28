import type { KnowledgeEntry } from "./types";

export const appKnowledge: KnowledgeEntry[] = [
  {
    id: "app-overview",
    title: "What is NoorAl?",
    category: "app",
    slashCommand: "/about",
    triggers: ["what is noor", "noorai", "about this app", "what can you do", "what is this", "tell me about the app", "features", "overview"],
    content: `NoorAl (نور — meaning "light") is a comprehensive Quran platform designed to be your complete Islamic companion. Here's everything it offers:

📖 **Quran Reader** — Read the full Quran in beautiful Uthmanic script with translations, word-by-word meanings, and inline tafsir. You can listen to recitation from top reciters while following along.

📊 **Dashboard** — Your personal Islamic hub: track your reading streak, daily goals, last position in the Quran, memorization progress, and recent notes — all in one place.

🧠 **Memorization (Hifz) Tracker** — Track which surahs and ayahs you've memorized. Flag hard ayahs for review. Uses spaced repetition so you review at exactly the right time.

🕌 **Prayer Times** — Real-time prayer times based on your GPS location, powered by aladhan.com. Never miss a salah.

📚 **Ahadith Browser** — Browse and search thousands of authentic hadith across major collections (Bukhari, Muslim, Tirmidhi, and more) via ahadith.co.

🔍 **Search** — Full-text search across the entire Quran. Find any verse by keyword, topic, or Arabic word instantly.

📝 **Notes** — Attach personal reflections and study notes to any verse. Your private Quran journal.

🔖 **Bookmarks & Collections** — Bookmark any ayah and organize them into named collections for easy access.

📿 **Tasbih (Dhikr Counter)** — A digital tasbih with preset dhikr options. Count your dhikr anywhere.

⚙️ **Settings** — Customize your experience: light/dark/sepia theme, Arabic font size, translation language, and choice of reciter.

🎙️ **Radio** — Listen to Quran radio streams continuously.

Everything is designed with beauty, speed, and sincerity — built for Muslims everywhere. بارك الله فيك`,
    tags: ["overview", "features", "intro"],
  },
  {
    id: "app-reader",
    title: "How to use the Quran Reader",
    category: "app",
    slashCommand: "/reader",
    triggers: ["reader", "how to read", "quran reading", "read quran", "uthmanic", "translation", "ayah", "verse", "tafsir panel", "audio playback", "recitation", "word click", "morphology"],
    content: `The **Quran Reader** is the heart of NoorAl. Here's how to use it:

**Getting Started:**
- Go to **Read** in the top navigation
- Choose any surah from the list or continue from where you left off
- Your last reading position is saved automatically

**Reading Features:**
- 📜 Full Uthmanic script (رسم عثماني) for authentic Arabic display
- 🌍 Toggle translation on/off — choose your preferred language in Settings
- 🔤 Click any Arabic word to see its root, grammar, and morphology
- 📝 Click the note icon next to any ayah to add your personal reflection
- 🔖 Click the bookmark icon to save an ayah to your bookmarks

**Audio & Recitation:**
- Press the play button on any ayah to hear that verse recited
- The audio player at the bottom lets you play/pause and navigate between ayahs
- Change your reciter anytime in Settings (many top reciters available)

**Tafsir Panel:**
- Tap the tafsir icon on any ayah for a detailed explanation
- Supports multiple tafsir sources

**Hard Ayah Flagging:**
- Mark any ayah as "hard" for memorization review
- These appear in your Memorization review queue with spaced repetition

**Font Size:**
- Adjust Arabic font size in Settings → Arabic Font Size
- Changes apply instantly across the entire reader`,
    tags: ["reader", "reading", "quran", "audio"],
  },
  {
    id: "app-memorization",
    title: "Memorization (Hifz) Tracker",
    category: "app",
    slashCommand: "/hifz",
    triggers: ["memorization", "hifz", "memorize", "hard ayah", "spaced repetition", "review queue", "progress", "surah progress", "memorize quran"],
    content: `The **Memorization Tracker** is built for serious students of the Quran who want to memorize (make hifz).

**How It Works:**
1. Navigate to **Memorize** in the top nav
2. See your per-surah progress — which surahs you've started, how much you've memorized
3. Mark ayahs as memorized as you go

**Hard Ayah System:**
- While reading, flag any verse as "hard" by tapping the flag icon
- Hard ayahs go into a **review queue**
- The system uses **spaced repetition** to schedule reviews at optimal intervals:
  - ✅ Correct recall: interval doubles (up to 14 days max)
  - ❌ Needs review: resets to 1-day interval
- Review at the right time = stronger long-term memory

**Tips for Effective Memorization:**
- 🌅 Memorize after Fajr — the mind is fresh
- 🔁 Repeat each ayah at least 20 times before moving on
- 👂 Listen to audio while reading — your ears reinforce your eyes
- 📊 Use the dashboard to monitor your streak and stay motivated
- 🧩 Memorize in small chunks: 2–3 ayahs per session is better than rushing`,
    tags: ["hifz", "memorization", "spaced repetition"],
  },
  {
    id: "app-dashboard",
    title: "Dashboard",
    category: "app",
    slashCommand: "/dashboard",
    triggers: ["dashboard", "streak", "reading goal", "goal", "progress overview", "stats", "last read", "reading streak"],
    content: `The **Dashboard** is your personal Islamic progress center. Access it by clicking **Dashboard** in the navigation.

**What you'll find:**
- 🔥 **Streak** — Consecutive days you've read the Quran. Don't break it!
- 📈 **Reading Goal** — Set a daily target (e.g. 1 page, 1 juz) and track it
- 📍 **Last Position** — Jump straight back to where you left off reading
- 🧠 **Memorization Overview** — Total ayahs memorized, surahs completed
- 📝 **Recent Notes** — Your latest reflections and study notes
- 🌙 **Verse of the Day** — A daily ayah for reflection

**Tips:**
- Check the dashboard every day to maintain your streak
- Set a realistic reading goal — consistency beats intensity
- Use the streak as motivation: even 5 minutes of reading counts`,
    tags: ["dashboard", "streak", "goals"],
  },
  {
    id: "app-prayer",
    title: "Prayer Times",
    category: "app",
    slashCommand: "/prayer",
    triggers: ["prayer times", "salah", "namaz", "fajr", "dhuhr", "asr", "maghrib", "isha", "prayer time", "how to see prayer", "prayer location"],
    content: `The **Prayer Times** feature gives you accurate salah times based on your location.

**How to access:** Click **Prayer** in the top navigation bar.

**How it works:**
- Uses your device's GPS location (you'll be asked for permission once)
- Fetches prayer times from aladhan.com — a trusted Islamic API
- Shows all 5 daily prayers: Fajr, Dhuhr, Asr, Maghrib, Isha
- Also shows Sunrise for reference

**The 5 Daily Prayers:**
1. 🌄 **Fajr** — Before sunrise (2 rakaat)
2. 🌤 **Dhuhr** — After midday (4 rakaat)
3. 🌇 **Asr** — Afternoon (4 rakaat)
4. 🌆 **Maghrib** — Just after sunset (3 rakaat)
5. 🌙 **Isha** — Night (4 rakaat)

**If prayer times look off:**
- Make sure you've allowed location permission in your browser
- Check your calculation method in Settings if available

The Prophet ﷺ said: *"The most beloved deeds to Allah are the most regular, even if they are few."* (Bukhari)`,
    tags: ["prayer", "salah", "times"],
  },
  {
    id: "app-notes",
    title: "Notes Feature",
    category: "app",
    slashCommand: "/notes",
    triggers: ["notes", "note", "reflection", "journal", "write note", "add note", "my notes", "study notes"],
    content: `**Notes** in NoorAl are your personal Quran journal — a space to record reflections, lessons, and thoughts as you read.

**How to add a note:**
- While reading in the Quran Reader, click the 📝 note icon next to any ayah
- Type your reflection in the panel that opens
- Notes are saved automatically and linked to that specific verse

**Accessing your notes:**
- Click **Notes** in the navigation (or visit /notes)
- See all your notes organized by surah and ayah
- Search through your notes by keyword

**What to write:**
- Personal reflections and feelings when reading a verse
- Lessons learned from tafsir
- Connections to your life or current situation
- Questions you want to research later
- Duas inspired by the verse

The Companions of the Prophet ﷺ used to reflect deeply on the Quran. Ibn Masʿud (رضي الله عنه) said: *"Do not scatter the Quran like the scattering of sand. Stop at its wonders."*`,
    tags: ["notes", "journal", "reflection"],
  },
  {
    id: "app-bookmarks",
    title: "Bookmarks & Collections",
    category: "app",
    slashCommand: "/bookmarks",
    triggers: ["bookmark", "bookmarks", "save verse", "saved", "collection", "collections", "favourite", "favorite"],
    content: `**Bookmarks** let you save any ayah for quick access later. **Collections** let you organize bookmarks into themed groups.

**How to bookmark an ayah:**
- In the Quran Reader, tap the 🔖 bookmark icon next to any verse
- It's saved instantly

**How to create Collections:**
- Go to the **Collections** page from the navigation
- Create a new collection (e.g. "My Favourite Duas", "Verses on Patience", "Juz Amma")
- Add bookmarked verses to any collection

**Ideas for collections:**
- 🤲 "Duas from the Quran" — verses that are supplications
- 💪 "Verses on Sabr (Patience)"
- 🕊️ "Verses on Peace and Tranquility"
- 🌟 "My Memorization List"
- ❤️ "Verses that moved me"

Access all bookmarks at **/bookmarks** and collections at **/collections**.`,
    tags: ["bookmarks", "collections", "save"],
  },
  {
    id: "app-tasbih",
    title: "Tasbih Counter (Dhikr)",
    category: "app",
    slashCommand: "/tasbih",
    triggers: ["tasbih", "dhikr", "counter", "tasbeeh", "subhanallah", "alhamdulillah", "allahu akbar", "count", "zikr"],
    content: `The **Tasbih** is NoorAl's digital dhikr counter — tap to count as you remember Allah.

**How to access:** Click the **Tasbih** button in the top navigation bar.

**Preset dhikr options:**
- سبحان الله — SubhanAllah (Glory be to Allah) — 33×
- الحمد لله — Alhamdulillah (Praise be to Allah) — 33×
- الله أكبر — Allahu Akbar (Allah is the Greatest) — 34×
- لا إله إلا الله — La ilaha illallah — as many times as possible
- أستغفر الله — Astaghfirullah (I seek Allah's forgiveness)

**After every prayer (Sunnah):**
The Prophet ﷺ said: *"Whoever says SubhanAllah 33 times, Alhamdulillah 33 times, and Allahu Akbar 34 times after every prayer — his sins will be forgiven even if they are like the foam of the sea."* (Muslim)

**The best dhikr:**
The Prophet ﷺ said: *"The best words are four: SubhanAllah, Alhamdulillah, La ilaha illallah, Allahu Akbar."* (Muslim)`,
    tags: ["tasbih", "dhikr", "remembrance"],
  },
  {
    id: "app-settings",
    title: "Settings & Customization",
    category: "app",
    slashCommand: "/settings",
    triggers: ["settings", "theme", "dark mode", "light mode", "sepia", "font size", "arabic font", "reciter", "translation", "customize", "preferences"],
    content: `**Settings** lets you personalize NoorAl to your preferences. Access via the ⚙️ Settings link or the icons in the top-right navigation.

**Theme:**
- ☀️ **Light** — Clean white interface
- 🌙 **Dark** — Easy on the eyes at night
- 📜 **Sepia** — Warm parchment tone, great for reading

**Arabic Font Size:**
- Adjust how large the Quran Arabic text appears
- Applies instantly in the reader
- Great for accessibility or for displaying on larger screens

**Translation:**
- Choose your preferred translation language
- Applied to every verse in the reader

**Reciter:**
- Choose from a selection of renowned Quran reciters
- Popular options include Sheikh Mishary Rashid Al-Afasy, Abdul Rahman Al-Sudais, and more

**Your preferences are saved automatically** using local storage — they persist between sessions.`,
    tags: ["settings", "theme", "font", "reciter"],
  },
  {
    id: "app-search",
    title: "Quran Search",
    category: "app",
    slashCommand: "/search",
    triggers: ["search", "find verse", "find ayah", "search quran", "look up", "keyword search"],
    content: `The **Search** feature lets you find any verse in the Quran by keyword, topic, or Arabic phrase.

**How to use:**
- Click **Search** in the top navigation
- Type any keyword in English or Arabic
- Results show matching verses with their surah and ayah reference
- Click any result to open it in the full reader

**Search tips:**
- Search by topic: "patience", "mercy", "paradise", "prayer"
- Search by Arabic root: type in Arabic script for best results
- Search by concept: "believers", "Day of Judgement", "Jannah"

**Powered by quran.com API** — so results are comprehensive and accurate across all 6,236 verses.`,
    tags: ["search", "find", "keyword"],
  },
  {
    id: "app-support",
    title: "Contact Support",
    category: "app",
    slashCommand: "/support",
    triggers: ["support", "contact us", "reach out", "get support"],
    content: "",
    tags: ["support", "contact"],
    action: "open-support",
  },
  {
    id: "app-help",
    title: "Help & Support",
    category: "app",
    slashCommand: "/help",
    triggers: ["help", "get help", "need help", "assistance"],
    content: "",
    tags: ["help", "support"],
    action: "open-support",
  },
  {
    id: "app-contact",
    title: "Contact Us",
    category: "app",
    slashCommand: "/contact",
    triggers: ["contact", "contact us", "reach out", "email us"],
    content: "",
    tags: ["contact", "support"],
    action: "open-support",
  },
  {
    id: "app-feedback",
    title: "Suggest a Feature",
    category: "app",
    slashCommand: "/feedback",
    triggers: ["feedback", "feature request", "suggest", "idea", "suggestion", "improve"],
    content: "",
    tags: ["feedback", "feature", "suggestion"],
    action: "open-support-feature",
  },
  {
    id: "app-bug",
    title: "Report a Bug",
    category: "app",
    slashCommand: "/bug",
    triggers: ["bug", "report bug", "broken", "error", "issue", "not working"],
    content: "",
    tags: ["bug", "report"],
    action: "open-support-bug",
  },
  {
    id: "app-ahadith",
    title: "Ahadith Browser",
    category: "app",
    slashCommand: "/ahadith",
    triggers: ["ahadith", "hadith", "browse hadith", "hadith collection", "bukhari", "muslim", "sunnah", "prophet saying"],
    content: `The **Ahadith Browser** gives you access to thousands of authentic narrations from the Prophet Muhammad ﷺ.

**How to access:** Click **Ahadith** in the navigation (or visit /ahadith).

**Collections available:**
- 📗 **Sahih Al-Bukhari** — The most authentic hadith collection
- 📘 **Sahih Muslim** — Second most authentic collection
- 📙 **Sunan Abu Dawud**
- 📕 **Jami At-Tirmidhi**
- 📔 **Sunan An-Nasa'i**
- 📒 **Sunan Ibn Majah**

**Powered by ahadith.co** — a reliable open hadith API.

**How to use:**
- Browse by collection
- Search by keyword within hadith text
- View the full chain of narrators (isnad)
- Each hadith shows its authenticity grade

**Remember:** The Prophet ﷺ said: *"Convey from me even if it is one verse."* (Bukhari)`,
    tags: ["ahadith", "hadith", "sunnah"],
  },
];
