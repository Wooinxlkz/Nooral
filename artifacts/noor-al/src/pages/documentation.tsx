import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, Brain, Clock, Book, Library, Bookmark,
  Radio, Search, FileText, Mic, Hash, Settings,
  ChevronRight, Zap, CheckCircle2, AlertCircle, Info,
  Star, Repeat2, Target, Volume2, Globe, Palette,
  MousePointerClick, KeyRound, ShieldCheck, RefreshCw,
} from "lucide-react";
import { InfoPageLayout } from "@/components/layout/info-layout";
import { cn } from "@/lib/utils";

type DocSection = {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  content: React.ReactNode;
};

/* ─────────────────────── Shared helper components ─────────────────────── */

function DocHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-bold text-foreground text-base mt-8 mb-3 flex items-center gap-2">
      {children}
    </h3>
  );
}

function DocSubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-semibold text-foreground text-sm mt-5 mb-2">{children}</h4>
  );
}

function DocStep({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary font-bold text-xs mt-0.5">
        {n}
      </div>
      <div>
        <p className="font-semibold text-foreground mb-1">{title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

function DocNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-primary/20 bg-primary/5 rounded-xl px-4 py-3 text-sm text-muted-foreground leading-relaxed flex gap-2.5">
      <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}

function DocTip({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl px-4 py-3 text-sm text-muted-foreground leading-relaxed flex gap-2.5">
      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
      <span><strong className="text-emerald-600 dark:text-emerald-400">Tip: </strong>{children}</span>
    </div>
  );
}

function DocWarning({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-amber-500/20 bg-amber-500/5 rounded-xl px-4 py-3 text-sm text-muted-foreground leading-relaxed flex gap-2.5">
      <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
      <span><strong className="text-amber-600 dark:text-amber-400">Important: </strong>{children}</span>
    </div>
  );
}

function DocExample({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/60 overflow-hidden my-3">
      <div className="bg-muted/60 px-4 py-2 text-xs font-semibold text-muted-foreground tracking-wide uppercase border-b border-border/40">
        {label}
      </div>
      <div className="px-4 py-3 text-sm text-muted-foreground leading-relaxed bg-background">
        {children}
      </div>
    </div>
  );
}

function DocTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="rounded-xl border border-border/60 overflow-hidden my-3">
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([key, val], i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-muted/30" : "bg-background"}>
              <td className="px-4 py-2.5 font-medium text-foreground w-1/3 border-r border-border/40">{key}</td>
              <td className="px-4 py-2.5 text-muted-foreground">{val}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocBadge({ children, color = "primary" }: { children: React.ReactNode; color?: "primary" | "emerald" | "amber" | "rose" }) {
  const colors = {
    primary: "bg-primary/10 text-primary border-primary/20",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };
  return (
    <span className={cn("inline-flex items-center border rounded-md px-2 py-0.5 text-xs font-medium", colors[color])}>
      {children}
    </span>
  );
}

/* ─────────────────────── Section Content ─────────────────────── */

const sections: DocSection[] = [
  /* ═══════════════════════════ GETTING STARTED ═══════════════════════════ */
  {
    id: "getting-started",
    title: "Getting started",
    icon: Zap,
    color: "text-amber-500",
    content: (
      <div className="space-y-5">
        <p>
          Welcome to <strong>NoorAl</strong> — your complete Quran companion. Whether you're here
          to read, memorize, or reflect, this guide walks you through everything in under five
          minutes. No prior experience needed.
        </p>

        <DocHeading><KeyRound className="h-4 w-4 text-amber-500" /> Creating your account</DocHeading>
        <div className="space-y-4">
          <DocStep n={1} title="Open the sign-in page">
            Click <strong>Sign In</strong> in the top-right corner of any page, or click
            <strong> Get Started</strong> on the landing page. Both take you to the same place.
          </DocStep>
          <DocStep n={2} title="Choose your sign-up method">
            NoorAl supports <strong>Email + Password</strong>, <strong>Sign in with Google</strong>,
            and <strong>Sign in with GitHub</strong>. Google is the fastest — no password to remember.
          </DocStep>
          <DocStep n={3} title="Verify your email">
            If you signed up with email, check your inbox for a 6-digit code and enter it on the
            verification screen. Google/GitHub accounts skip this step entirely.
          </DocStep>
          <DocStep n={4} title="You're in">
            After sign-in you'll land on the <strong>Reader</strong>. Your account is ready — no
            extra setup required.
          </DocStep>
        </div>

        <DocNote>
          You can browse the Quran Reader, Search, and Prayer Times without signing in. An account
          is required for Bookmarks, Notes, Memorization tracking, and syncing your reading progress.
        </DocNote>

        <DocHeading><Target className="h-4 w-4 text-amber-500" /> First things to configure</DocHeading>
        <p>After signing in, do these three things to personalise your experience:</p>

        <DocTable rows={[
          ["Translation", "Go to Settings → Translation and pick your language and scholar. Default is Saheeh International (English)."],
          ["Reciter", "Go to Settings → Audio. Mishary Rashid Alafasy is the default. 50+ reciters available."],
          ["Theme", "Click the theme toggle (☀️ / 🌙 / 📜) in the header. Light, Dark, and Sepia modes are available."],
          ["Font size", "Settings → Display → Arabic Font Size. Choose from Small, Medium, Large, or X-Large."],
        ]} />

        <DocTip>
          Start with <strong>Surah Al-Fatiha</strong> (Surah 1) to test audio, translation, and bookmarks
          before diving into longer surahs. It's short, familiar, and lets you verify everything is working.
        </DocTip>

        <DocHeading><RefreshCw className="h-4 w-4 text-amber-500" /> Syncing across devices</DocHeading>
        <p className="text-sm">
          Notes, bookmarks, memorization progress, and your reading streak are stored in the cloud
          and sync automatically across all devices where you're signed in. Theme preferences and font
          size are stored locally in your browser (localStorage) and must be set per-device.
        </p>
      </div>
    ),
  },

  /* ═══════════════════════════ QURAN READER ═══════════════════════════ */
  {
    id: "reader",
    title: "Quran Reader",
    icon: BookOpen,
    color: "text-emerald-500",
    content: (
      <div className="space-y-5">
        <p>
          The Reader is the heart of NoorAl. It renders the Quran in authentic <strong>Uthmanic
          script</strong> (Hafs 'an 'Asim) with per-ayah translations, inline actions, and an audio
          player — all in a clean, distraction-free layout.
        </p>

        <DocHeading><MousePointerClick className="h-4 w-4 text-emerald-500" /> Navigating surahs</DocHeading>
        <p className="text-sm">
          At the top of the Reader is the <strong>Surah Selector</strong> — a searchable dropdown
          listing all 114 surahs with their Arabic name, English name, number of ayahs, and
          revelation type (Meccan or Medinan). Click it and start typing to jump to any surah
          instantly.
        </p>

        <DocExample label="Example — jumping to Surah Yusuf">
          Click the surah selector → type "Yusuf" or "12" → press Enter or click the result.
          The Reader jumps to Surah 12:1 and saves your position automatically.
        </DocExample>

        <p className="text-sm">
          Your <strong>last-read position</strong> (surah + ayah) is remembered automatically.
          When you return to the Reader it scrolls you back to where you left off, so you never
          lose your place.
        </p>

        <DocHeading><Star className="h-4 w-4 text-emerald-500" /> Ayah actions</DocHeading>
        <p className="text-sm">
          Hover over any ayah (or tap on mobile) to reveal the <strong>ayah action bar</strong>.
          It appears inline, below the Arabic text. Each icon triggers a different action:
        </p>

        <DocTable rows={[
          ["🔖 Bookmark", "Saves the ayah to your Bookmarks list. A filled icon means it's already saved. Tap again to remove."],
          ["📝 Note", "Opens a text editor where you can write a personal reflection, tafsir summary, or anything you like."],
          ["🚩 Hard ayah", "Flags the ayah for spaced-repetition review in your Memorization queue."],
          ["📖 Tafsir", "Opens the Tafsir panel on the right — classical commentary from Ibn Kathir, Al-Jalalayn, and more."],
          ["▶ Play", "Plays audio for just that ayah using your selected reciter, then stops (not autoplay)."],
        ]} />

        <DocHeading><Volume2 className="h-4 w-4 text-emerald-500" /> Audio playback</DocHeading>
        <p className="text-sm">
          The audio bar at the bottom of the page controls Quran recitation. You can play a single
          ayah from the action bar, or use the audio controls to play continuously from any ayah
          through to the end of the surah.
        </p>

        <DocTable rows={[
          ["Play / Pause", "The central button. Plays from the current ayah or resumes if paused."],
          ["Previous / Next", "Jumps one ayah backward or forward. Holds down for faster seeking."],
          ["Reciter selector", "The name shown in the audio bar — tap to switch reciter without leaving the page."],
          ["Speed", "0.75×, 1×, 1.25×, 1.5× playback speed. Slower speeds help with memorization."],
        ]} />

        <DocTip>
          Reciters tagged with <DocBadge color="emerald">Word-by-word</DocBadge> support
          follow-along highlighting — the exact word being recited lights up in the Arabic text.
          Mishary Alafasy and a dozen others support this.
        </DocTip>

        <DocHeading><Palette className="h-4 w-4 text-emerald-500" /> Display options</DocHeading>
        <DocTable rows={[
          ["Arabic font size", "Settings → Display. Affects the Quran Arabic script only, not UI text."],
          ["Theme", "Light (warm teal), Dark (deep teal + gold), Sepia (parchment). All render Quran clearly."],
          ["Translation toggle", "The translation language is set in Settings → Translation. You can hide it entirely by selecting 'No translation'."],
          ["Transliteration", "Settings → Display → Show transliteration. Adds Latin-script phonetics below each ayah for learners."],
        ]} />
      </div>
    ),
  },

  /* ═══════════════════════════ MEMORIZATION ═══════════════════════════ */
  {
    id: "memorization",
    title: "Memorization",
    icon: Brain,
    color: "text-blue-500",
    content: (
      <div className="space-y-5">
        <p>
          NoorAl's memorization system combines a <strong>per-surah progress tracker</strong> with a
          <strong> spaced-repetition review queue</strong> for hard ayahs. The science behind it is
          the same used by the world's top language learners and hafidhs — review at the right moment,
          not constantly.
        </p>

        <DocHeading><Target className="h-4 w-4 text-blue-500" /> How spaced repetition works</DocHeading>
        <p className="text-sm">
          Every ayah you flag as <strong>Hard</strong> gets a review interval. Each time you review
          it correctly, the interval doubles. Each time you struggle, it resets to 1 day. This
          ensures you spend most of your time on the ayahs that need it — not the ones you already know.
        </p>

        <DocTable rows={[
          ["First review", "1 day after flagging"],
          ["Correct → interval ×2", "1 → 2 → 4 → 8 → 14 days (capped at 14)"],
          ["Needs review → reset", "Interval resets to 1 day regardless of previous streak"],
          ["Mastered", "Ayah is removed from the active queue after sustained correct reviews"],
        ]} />

        <DocExample label="Example — memorizing Al-Baqarah 2:255 (Ayatul Kursi)">
          Day 0: Flag as Hard → appears in queue Day 1.<br />
          Day 1: Review, mark Correct → next review Day 3.<br />
          Day 3: Review, mark Correct → next review Day 7.<br />
          Day 7: Review, mark Needs Review → resets to Day 8.<br />
          Day 8: Review, mark Correct → next review Day 10. And so on.
        </DocExample>

        <DocHeading><Repeat2 className="h-4 w-4 text-blue-500" /> Starting memorization for a surah</DocHeading>
        <div className="space-y-4">
          <DocStep n={1} title="Open the Memorize page">
            Click <strong>Memorize</strong> in the top navigation. You'll see all 114 surahs with
            your current memorization percentage for each.
          </DocStep>
          <DocStep n={2} title="Select a surah">
            Click any surah to open the memorization view. Short surahs like Al-Ikhlas (4 ayahs)
            or Al-Falaq (5 ayahs) are great starting points.
          </DocStep>
          <DocStep n={3} title="Mark each ayah">
            For each ayah, recite it aloud without looking, then mark it:
            <br />• <strong>Memorized</strong> — you recalled it fluently
            <br />• <strong>In Progress</strong> — you needed a peek
            <br />• <strong>Not started</strong> — haven't attempted yet
          </DocStep>
          <DocStep n={4} title="Flag hard ayahs">
            Any ayah you find difficult, tap the flag icon. It enters your spaced-repetition
            review queue and will appear on the next due day.
          </DocStep>
        </div>

        <DocHeading>Daily review queue</DocHeading>
        <p className="text-sm">
          Your <strong>Dashboard</strong> shows how many ayahs are due for review today. Click
          "Review Now" to work through them one by one. Each card shows the surah reference and
          the ayah — you recite it, then flip to confirm.
        </p>

        <DocTip>
          Memorization progress is stored in the cloud. Open NoorAl on your phone before Fajr,
          complete your review queue in 5–10 minutes, then carry on with the rest of your day.
          Consistency beats volume.
        </DocTip>

        <DocWarning>
          Memorization data syncs only when you're signed in. If you use the app without signing in,
          progress will be lost when you clear your browser storage.
        </DocWarning>
      </div>
    ),
  },

  /* ═══════════════════════════ PRAYER TIMES ═══════════════════════════ */
  {
    id: "prayer-times",
    title: "Prayer Times",
    icon: Clock,
    color: "text-amber-500",
    content: (
      <div className="space-y-5">
        <p>
          NoorAl calculates accurate prayer times based on your <strong>real-time geolocation</strong>
          using the <strong>aladhan.com</strong> API. No manual city selection — just allow location
          access and get accurate times for wherever you are in the world.
        </p>

        <DocHeading><Globe className="h-4 w-4 text-amber-500" /> Enabling prayer times</DocHeading>
        <div className="space-y-4">
          <DocStep n={1} title="Click Prayer in the header">
            The button is in the top navigation bar. On mobile, you'll find it in the hamburger menu.
          </DocStep>
          <DocStep n={2} title="Allow location access">
            Your browser will ask: "Allow NoorAl to access your location?" — click <strong>Allow</strong>.
            This triggers a single geolocation lookup. Your coordinates are sent anonymously to
            aladhan.com and are never stored on our servers.
          </DocStep>
          <DocStep n={3} title="View your times">
            Times for all five prayers appear: <strong>Fajr, Dhuhr, Asr, Maghrib, Isha</strong>.
            The next upcoming prayer is highlighted. Sunrise is also shown for Fajr context.
          </DocStep>
        </div>

        <DocHeading>Prayer times displayed</DocHeading>
        <DocTable rows={[
          ["Fajr", "Dawn prayer — from true dawn until just before sunrise"],
          ["Sunrise", "Reference time shown alongside Fajr (not a prayer itself)"],
          ["Dhuhr", "Midday prayer — from solar noon until Asr begins"],
          ["Asr", "Afternoon prayer — varies by calculation method"],
          ["Maghrib", "Sunset prayer — begins at actual sunset"],
          ["Isha", "Night prayer — begins when twilight ends"],
        ]} />

        <DocHeading>Calculation methods</DocHeading>
        <p className="text-sm">
          Different scholarly bodies use slightly different angles to determine prayer times.
          NoorAl supports all major methods:
        </p>
        <DocTable rows={[
          ["Muslim World League (MWL)", "Default. Used widely across Europe, Far East, Africa."],
          ["Egyptian General Authority", "Used in Middle East and Africa."],
          ["University of Islamic Sciences, Karachi", "Used in Pakistan, Afghanistan, Bangladesh, India."],
          ["Umm al-Qura (Makkah)", "Used in Saudi Arabia."],
          ["Islamic Society of North America (ISNA)", "Used in North America."],
          ["Dubai", "Used in UAE."],
        ]} />

        <p className="text-sm">Configure your preferred method in <strong>Settings → Prayer Times</strong>.</p>

        <DocHeading>Asr juristic school</DocHeading>
        <p className="text-sm">
          Asr time differs between the Shafi'i/Maliki/Hanbali schools and the Hanafi school.
          NoorAl defaults to the <strong>Standard (Shafi'i)</strong> position but you can switch
          to <strong>Hanafi</strong> in Settings → Prayer Times.
        </p>

        <DocNote>
          Prayer times are recalculated each time you open the Prayer panel. If you've travelled
          since your last visit, just re-open the panel — it fetches fresh coordinates automatically.
        </DocNote>

        <DocTip>
          If your browser blocks location access, you can manually enter coordinates in
          Settings → Prayer Times. Use Google Maps to find the latitude/longitude of your city.
        </DocTip>
      </div>
    ),
  },

  /* ═══════════════════════════ AHADITH ═══════════════════════════ */
  {
    id: "ahadith",
    title: "Ahadith",
    icon: Book,
    color: "text-rose-500",
    content: (
      <div className="space-y-5">
        <p>
          Browse and study authenticated hadith from the six major Sunni collections (<strong>Kutub
          al-Sittah</strong>) via the <strong>ahadith.co</strong> API. All hadiths include the
          original Arabic, English translation, and scholarly grade.
        </p>

        <DocHeading>Available collections</DocHeading>
        <DocTable rows={[
          ["Sahih al-Bukhari", "7,563 hadiths — the most authentic collection. Compiled by Imam al-Bukhari (d. 870 CE)."],
          ["Sahih Muslim", "7,500 hadiths — second most authentic. Compiled by Imam Muslim (d. 875 CE)."],
          ["Sunan Abu Dawud", "5,274 hadiths — focused on jurisprudence. Compiled by Abu Dawud (d. 889 CE)."],
          ["Jami' al-Tirmidhi", "3,956 hadiths — includes scholarly opinions. Compiled by al-Tirmidhi (d. 892 CE)."],
          ["Sunan al-Nasai", "5,761 hadiths — critically evaluated chain of narrators. Compiled by al-Nasai (d. 915 CE)."],
          ["Sunan Ibn Majah", "4,341 hadiths — includes some weak narrations (graded). Compiled by Ibn Majah (d. 887 CE)."],
        ]} />

        <DocHeading>Reading a hadith</DocHeading>
        <div className="space-y-4">
          <DocStep n={1} title="Choose a collection">
            Go to <strong>Ahadith</strong> in the navigation. You'll see the six collections with
            a brief description and hadith count.
          </DocStep>
          <DocStep n={2} title="Browse chapters">
            Each collection is divided into <strong>chapters (Kitabs)</strong> by topic — Prayer,
            Fasting, Zakat, Marriage, Business, etc. Click a chapter to see its hadiths.
          </DocStep>
          <DocStep n={3} title="Read the hadith">
            Each entry shows:
            <br />• <strong>Reference</strong> — e.g. Bukhari 1:1
            <br />• <strong>Arabic text</strong> (right-to-left, large font)
            <br />• <strong>English translation</strong>
            <br />• <strong>Narrator chain</strong> — who reported it from whom
            <br />• <strong>Grade badge</strong> — Sahih, Hasan, Da'if, etc.
          </DocStep>
        </div>

        <DocHeading>Hadith grades explained</DocHeading>
        <DocTable rows={[
          ["Sahih (Authentic)", "Meets all criteria: unbroken chain, reliable narrators, no shadh or illah."],
          ["Hasan (Good)", "Slightly lower than Sahih but still reliable and acted upon."],
          ["Da'if (Weak)", "Deficiency in chain or narrator reliability. Shown with a warning — be cautious."],
          ["Mawdu' (Fabricated)", "Not authentic. NoorAl shows these with a red alert badge."],
        ]} />

        <DocExample label="Example — reading about intention (Niyyah)">
          Go to <strong>Sahih al-Bukhari → Book of Revelation</strong> → Hadith 1.<br />
          "Indeed, actions are judged by intentions, and every person will get the reward
          according to what he has intended..." — Narrated by 'Umar ibn al-Khattab (RA).
          Grade: <DocBadge color="emerald">Sahih</DocBadge>
        </DocExample>

        <DocTip>
          Use the <strong>Search</strong> feature (Ctrl+K) and filter by "Hadith" to find specific
          hadiths by keyword across all collections at once. Faster than browsing chapter by chapter.
        </DocTip>
      </div>
    ),
  },

  /* ═══════════════════════════ LIBRARY ═══════════════════════════ */
  {
    id: "library",
    title: "Islamic Library",
    icon: Library,
    color: "text-violet-500",
    content: (
      <div className="space-y-5">
        <p>
          The <strong>Islamic Library</strong> is a curated, structured knowledge base covering
          the fundamentals of Islam — articles, duas, seerah, and guides — all written with
          scholarly accuracy and accessible English.
        </p>

        <DocHeading>Content categories</DocHeading>
        <DocTable rows={[
          ["Pillars of Islam", "Shahadah, Salah, Zakat, Sawm, Hajj — detailed guides with evidence from Quran and Sunnah."],
          ["Pillars of Iman", "Belief in Allah, Angels, Books, Prophets, Last Day, and Divine Decree."],
          ["Prophet's Biography (Seerah)", "Chronological life of Prophet Muhammad ﷺ — birth to farewell."],
          ["Prophets & Messengers", "Stories of all 25 prophets mentioned in the Quran, with key lessons."],
          ["Daily Duas & Supplications", "Morning, evening, before/after meals, travel, entering home, etc."],
          ["Islamic History", "The Rightly Guided Caliphs, Golden Age of Islam, and key events."],
          ["Halal & Haram", "Food, finance, speech, entertainment — what's permitted and what isn't."],
          ["Islamic Ethics", "Character, dealings, family rights, honesty, and the Islamic moral code."],
        ]} />

        <DocHeading>Reading articles</DocHeading>
        <div className="space-y-4">
          <DocStep n={1} title="Open the Library">
            Click <strong>Library</strong> in the navigation sidebar.
          </DocStep>
          <DocStep n={2} title="Choose a category">
            Browse categories or use the search bar within the Library to find a topic.
          </DocStep>
          <DocStep n={3} title="Read and reflect">
            Each article includes the Arabic daleel (evidence), its reference, and a plain
            English explanation. Quranic ayahs are rendered in Uthmanic script with their surah reference.
          </DocStep>
        </div>

        <DocHeading>Progress tracking</DocHeading>
        <p className="text-sm">
          Articles you've opened are marked as <strong>Read</strong> with a checkmark. Your overall
          Library progress (e.g. "14 / 60 articles read") appears on your Dashboard. This helps
          you build a complete foundation of Islamic knowledge systematically.
        </p>

        <DocExample label="Example — learning about Salah">
          Library → Pillars of Islam → Salah → "The Obligatory Prayer".<br />
          You'll find: how many rak'ahs per prayer, the Fard acts vs. Sunnah acts, common mistakes,
          and a step-by-step guide with Arabic for each recitation.
        </DocExample>

        <DocTip>
          The Library's Duas section is a great companion to the Tasbih feature. Find the dua
          you want to memorize, then use Tasbih to count your repetitions.
        </DocTip>
      </div>
    ),
  },

  /* ═══════════════════════════ BOOKMARKS & NOTES ═══════════════════════════ */
  {
    id: "bookmarks",
    title: "Bookmarks & Notes",
    icon: Bookmark,
    color: "text-sky-500",
    content: (
      <div className="space-y-5">
        <p>
          Save and annotate any ayah in the Quran. Bookmarks let you pin ayahs for later reference.
          Notes let you record reflections, tafsir summaries, or anything personal. Both are stored
          securely in the cloud and sync across your devices.
        </p>

        <DocHeading>Bookmarks</DocHeading>
        <div className="space-y-4">
          <DocStep n={1} title="Bookmark an ayah">
            Hover over any ayah in the Reader → click the <strong>bookmark icon 🔖</strong>.
            The icon fills to confirm it's saved.
          </DocStep>
          <DocStep n={2} title="View your bookmarks">
            Go to <strong>/bookmarks</strong> or click Bookmarks in the sidebar. All saved ayahs
            are listed with their surah name, ayah number, and the first few words.
          </DocStep>
          <DocStep n={3} title="Jump back to an ayah">
            Click any bookmark to open the Reader at exactly that ayah. Your scroll position
            is restored precisely.
          </DocStep>
          <DocStep n={4} title="Remove a bookmark">
            Click the filled bookmark icon on any ayah (Reader or Bookmarks page) to remove it.
          </DocStep>
        </div>

        <DocHeading>Notes</DocHeading>
        <div className="space-y-4">
          <DocStep n={1} title="Add a note">
            Hover over any ayah → click the <strong>note icon 📝</strong>. A text editor slides in.
          </DocStep>
          <DocStep n={2} title="Write your reflection">
            Type your reflection, tafsir summary, or reminder. The editor auto-saves as you type —
            no Save button needed.
          </DocStep>
          <DocStep n={3} title="View all notes">
            Go to <strong>/notes</strong>. Notes are listed by date modified, newest first.
            Each note shows the ayah reference it's attached to.
          </DocStep>
          <DocStep n={4} title="Search your notes">
            Use the search bar on the Notes page to find a specific word or phrase across all
            your notes at once.
          </DocStep>
        </div>

        <DocExample label="Good use of Notes — studying Surah Al-Kahf">
          While reading 18:46 ("Wealth and children are the adornment of worldly life…"):<br /><br />
          Note: "Reminder — dunya's beauty is temporary. Ibn Kathir links this to the man with
          two gardens in 18:32. The real wealth is deeds that endure."
        </DocExample>

        <DocHeading>Collections</DocHeading>
        <p className="text-sm">
          Group your favourite verses into named <strong>Collections</strong> — like playlists
          for the Quran. Create collections for Ruqyah ayahs, Ramadan verses, comfort during
          hardship, or any theme you choose.
        </p>

        <DocTable rows={[
          ["Create a collection", "Go to /collections → New Collection → name it"],
          ["Add an ayah", "From the Reader, click the bookmark icon → Add to Collection → pick one"],
          ["Share a collection", "Collections can be exported as a list of references to share with others"],
        ]} />

        <DocTip>
          Create a collection called <strong>"Ayahs I want to memorize"</strong> and flag each of
          those ayahs as Hard in the Reader. They'll feed directly into your spaced-repetition queue.
        </DocTip>
      </div>
    ),
  },

  /* ═══════════════════════════ SEARCH ═══════════════════════════ */
  {
    id: "search",
    title: "Search",
    icon: Search,
    color: "text-pink-500",
    content: (
      <div className="space-y-5">
        <p>
          Full-text search across the entire Quran in <strong>English</strong> or <strong>Arabic</strong>.
          Search by meaning, keyword, topic, or root word. Powered by the quran.com API — always
          up to date with the latest translations.
        </p>

        <DocHeading>Opening Search</DocHeading>
        <DocTable rows={[
          ["From nav", "Click the Search icon in the top navigation bar"],
          ["Keyboard shortcut", "Press Ctrl+K (Windows/Linux) or ⌘+K (Mac) from anywhere in the app"],
          ["From the Reader", "Click the magnifier icon that appears in the Reader toolbar"],
        ]} />

        <DocHeading>Searching effectively</DocHeading>
        <div className="space-y-4">
          <DocStep n={1} title="Enter your query">
            Type a word, phrase, or concept in the search box. Results appear as you type.
            There is no submit button — it's live search.
          </DocStep>
          <DocStep n={2} title="Filter by language">
            Toggle between <strong>English</strong> and <strong>Arabic</strong> search using the
            pill buttons at the top of the results panel. Arabic search matches root patterns,
            not just exact strings.
          </DocStep>
          <DocStep n={3} title="Browse results">
            Each result shows the <strong>surah name</strong>, <strong>ayah number</strong>,
            and the matching text with your keyword <strong>highlighted</strong> in the translation.
          </DocStep>
          <DocStep n={4} title="Navigate to an ayah">
            Click any result to jump directly to that ayah in the Reader. The Reader scrolls
            to the exact ayah and briefly highlights it.
          </DocStep>
        </div>

        <DocExample label="Example searches — topics and phrases">
          "patience" → returns all ayahs referencing sabr, tawakkul, gratitude in hardship<br />
          "لا إله إلا" → searches Arabic text for the first part of the Shahadah<br />
          "good word" → finds 2:263, 14:24 and other ayahs with this phrase in translation<br />
          "people of the cave" → finds Surah Al-Kahf references to the Ashab al-Kahf
        </DocExample>

        <DocTip>
          Search recognises common Islamic terms even in transliteration — try searching for
          "taqwa", "sabr", "rizq", or "jannah" and it maps them to their Quranic occurrences.
        </DocTip>

        <DocNote>
          Search is powered by quran.com's API and requires an internet connection. Results
          are based on the translation you've selected in your Settings. Switching to a different
          translation may return different results for the same query.
        </DocNote>
      </div>
    ),
  },

  /* ═══════════════════════════ QURAN RADIO ═══════════════════════════ */
  {
    id: "radio",
    title: "Quran Radio",
    icon: Radio,
    color: "text-orange-500",
    content: (
      <div className="space-y-5">
        <p>
          Listen to <strong>live Quran radio streams</strong> from around the world — Saudi Arabia,
          Egypt, UAE, Malaysia, and more. Streams play in the background so you can read, memorize,
          or study while listening.
        </p>

        <DocHeading>Accessing Radio</DocHeading>
        <div className="space-y-4">
          <DocStep n={1} title="Open Radio">
            Click <strong>Radio</strong> in the navigation. You'll see a grid of live stations
            with their country flag, station name, and current status.
          </DocStep>
          <DocStep n={2} title="Choose a station">
            Tap any station tile to start streaming. The audio bar at the bottom of the screen
            shows the station name and live playback controls.
          </DocStep>
          <DocStep n={3} title="Background play">
            Navigate away from the Radio page — the stream continues. You can read Quran, check
            your bookmarks, or browse the Library while the station plays.
          </DocStep>
          <DocStep n={4} title="Stop playback">
            Click the Pause button in the audio bar at the bottom, or click the active station
            again to toggle it off.
          </DocStep>
        </div>

        <DocHeading>Available stations</DocHeading>
        <DocTable rows={[
          ["إذاعة القرآن الكريم من مكة المكرمة", "Live from the Grand Mosque in Makkah — 24/7 recitation"],
          ["إذاعة القرآن الكريم (Cairo)", "Egypt's national Quran radio — diverse reciters throughout the day"],
          ["Holy Quran Radio UAE", "UAE Broadcasting Authority — clear audio, multiple reciters"],
          ["Quran Radio Malaysia", "IKIM.fm Quran channel — Malay context, Arabic recitation"],
          ["+ more", "New stations added regularly. Suggest a station via our Contribute page."],
        ]} />

        <DocWarning>
          Radio streams require a stable internet connection. If a station shows as offline, it
          may be temporarily down on the broadcaster's end — try again later or switch stations.
        </DocWarning>

        <DocTip>
          Play Makkah radio while you follow along in the Reader. When the Imam's ayah matches
          what you're reading, it's an amazing way to improve pronunciation and tajweed by ear.
        </DocTip>
      </div>
    ),
  },

  /* ═══════════════════════════ RECITERS ═══════════════════════════ */
  {
    id: "reciters",
    title: "Reciters",
    icon: Mic,
    color: "text-indigo-500",
    content: (
      <div className="space-y-5">
        <p>
          Choose from <strong>50+ world-renowned Quran reciters</strong> for playback in the Reader.
          Every reciter uses the Hafs 'an 'Asim narration. Audio is fetched from quran.com's CDN
          — high quality, per-ayah files, no buffering.
        </p>

        <DocHeading>Setting your default reciter</DocHeading>
        <div className="space-y-4">
          <DocStep n={1} title="Go to Settings → Audio">
            The reciter setting is at the top of the Audio section.
          </DocStep>
          <DocStep n={2} title="Browse the list">
            Reciters are listed alphabetically with their country and a preview button.
            Tap the ▶ icon to hear a short sample before committing.
          </DocStep>
          <DocStep n={3} title="Select and save">
            Click a reciter's name to set them as default. The Reader immediately switches to
            their audio for all subsequent playback.
          </DocStep>
        </div>

        <DocHeading>Word-by-word reciters</DocHeading>
        <p className="text-sm">
          Some reciters are recorded with <strong>segment timing data</strong> — meaning NoorAl
          knows exactly which word is being recited at every millisecond. These enable the
          <strong> follow-along word highlight</strong> feature in the Reader.
        </p>

        <DocTable rows={[
          ["Mishary Rashid Alafasy", "Most popular. Word-by-word support. Kuwait."],
          ["Abdul Basit Abd us-Samad", "Legendary Egyptian reciter. Mujawwad style."],
          ["Mahmoud Khalil Al-Husary", "Tarteel (slow) style — ideal for learning."],
          ["Yasser al-Dosari", "Clear and melodic. Word-by-word support."],
          ["Saud Al-Shuraim", "Former Imam of Masjid al-Haram. Powerful voice."],
          ["Maher Al-Muaiqly", "Current Imam of Masjid al-Haram, Makkah."],
        ]} />

        <DocExample label="Choosing a reciter for memorization">
          For <strong>hifz (memorization)</strong> use a tarteel-style reciter like Mahmoud
          Al-Husary or Abdurrahman Al-Sudais at 0.75× speed. Each word is distinctly pronounced,
          helping you encode the correct makhraj (articulation point).
        </DocExample>

        <DocTip>
          Switch reciters from the audio bar without going to Settings — tap the reciter name
          in the playback bar to open a quick-switch dropdown.
        </DocTip>

        <DocNote>
          Audio files are served by quran.com's CDN. Very rarely, a specific ayah from a
          specific reciter may not be available — NoorAl will silently skip to the next ayah.
        </DocNote>
      </div>
    ),
  },

  /* ═══════════════════════════ TASBIH & ADHKAR ═══════════════════════════ */
  {
    id: "tasbih",
    title: "Tasbih & Adhkar",
    icon: Hash,
    color: "text-teal-500",
    content: (
      <div className="space-y-5">
        <p>
          A <strong>digital tasbih counter</strong> with dhikr presets, custom targets, and a
          comprehensive adhkar library. Use it for post-prayer tasbeeh, morning/evening adhkar,
          or any personal dhikr practice.
        </p>

        <DocHeading>Using the Tasbih counter</DocHeading>
        <div className="space-y-4">
          <DocStep n={1} title="Open Tasbih">
            Click <strong>Tasbih</strong> in the header navigation. The counter opens as a modal
            overlay — the rest of the app remains accessible behind it.
          </DocStep>
          <DocStep n={2} title="Choose a dhikr preset">
            Select from the presets at the top: SubhanAllah, Alhamdulillah, Allahu Akbar, La ilaha
            illa Allah, and more. The Arabic text and transliteration are shown on the counter.
          </DocStep>
          <DocStep n={3} title="Set your target">
            Tap the target number to customise it — default is 33 (the Tasbeeh of Fatimah).
            You can set it to anything: 100, 500, 1000, etc.
          </DocStep>
          <DocStep n={4} title="Count">
            Tap anywhere on the large counter area — or press <kbd className="text-xs border border-border rounded px-1.5 py-0.5">Space</kbd> — to increment.
            When you reach your target, the counter vibrates (mobile) and resets automatically.
          </DocStep>
        </div>

        <DocHeading>Tasbeeh presets and their virtues</DocHeading>
        <DocTable rows={[
          ["سُبْحَانَ اللَّهِ (SubhanAllah)", "33× after each prayer — Hadith: fills the scales with reward"],
          ["الْحَمْدُ لِلَّهِ (Alhamdulillah)", "33× after each prayer — gratitude for all blessings"],
          ["اللَّهُ أَكْبَرُ (Allahu Akbar)", "34× after each prayer (Tasbeeh of Fatimah)"],
          ["لا إلَهَ إلَّا اللَّهُ (La ilaha illa Allah)", "100× daily — equivalent to freeing 10 slaves (Bukhari)"],
          ["أَسْتَغْفِرُ اللَّهَ (Astaghfirullah)", "For seeking forgiveness — 100× is Prophetic practice"],
          ["Custom dhikr", "Tap 'Custom' to enter any Arabic phrase and your own target count"],
        ]} />

        <DocHeading>Adhkar library</DocHeading>
        <p className="text-sm">
          Beyond the counter, the Adhkar section organises supplications by occasion — each with
          Arabic text, transliteration, translation, and the hadith source.
        </p>

        <DocTable rows={[
          ["Morning Adhkar (أذكار الصباح)", "Recited after Fajr — protection for the day"],
          ["Evening Adhkar (أذكار المساء)", "Recited after Asr — protection for the night"],
          ["After Prayer (أذكار بعد الصلاة)", "Post-salah tasbeeh and specific supplications"],
          ["Before Sleep", "Ayatul Kursi, last two ayahs of Al-Baqarah, Al-Mulk"],
          ["Before Eating", "Bismillah — and what to say when you forget"],
          ["When Entering Home", "Greeting the family + specific dua"],
          ["Travel Dua", "Safar dua, stopping at a place, returning home"],
          ["Dua for Distress", "Dua Yunus, the dua of the oppressed, Ya Hayyu Ya Qayyum"],
        ]} />

        <DocExample label="Morning adhkar routine — 15 minutes">
          After Fajr prayer: Open Adhkar → Morning → read through all 14 morning adhkar in order.
          Each one shows how many times it should be recited and the specific virtue mentioned
          in the hadith. Tap the tasbih icon next to any one to open the counter pre-loaded with it.
        </DocExample>
      </div>
    ),
  },

  /* ═══════════════════════════ SETTINGS ═══════════════════════════ */
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    color: "text-muted-foreground",
    content: (
      <div className="space-y-5">
        <p>
          Customise every aspect of your NoorAl experience from the <strong>Settings</strong> page.
          Access it via the gear icon in the header or by navigating directly to <strong>/settings</strong>.
        </p>

        <DocHeading><Palette className="h-4 w-4 text-muted-foreground" /> Display</DocHeading>
        <DocTable rows={[
          ["Theme", "Light (warm teal), Dark (deep teal + gold), Sepia (parchment brown). Also accessible from the header toggle."],
          ["Arabic font size", "Small (1.5rem), Medium (2rem), Large (2.5rem), X-Large (3rem). Affects Quran text only."],
          ["Show transliteration", "Toggle Latin-script phonetics below each ayah. Helpful for non-Arabic speakers learning tajweed."],
          ["Show verse numbers", "Toggle the inline ayah number badge (default: on)."],
          ["Tajweed colours", "Highlights tajweed rules in the Arabic text — ghunnah, mad, qalqalah, etc. in distinct colours."],
        ]} />

        <DocHeading><Globe className="h-4 w-4 text-muted-foreground" /> Translation</DocHeading>
        <DocTable rows={[
          ["Language", "20+ languages available: English, Urdu, French, Turkish, Malay, Indonesian, Bengali, and more."],
          ["Scholar / version", "Multiple English translations: Saheeh International, Pickthall, Yusuf Ali, Abdul Haleem, etc."],
          ["No translation", "Select 'None' to hide all translations — pure Arabic mode."],
        ]} />

        <DocHeading><Volume2 className="h-4 w-4 text-muted-foreground" /> Audio</DocHeading>
        <DocTable rows={[
          ["Default reciter", "Select from 50+ reciters. Applied globally across the Reader, memorization, and search."],
          ["Playback speed", "0.75×, 1×, 1.25×, 1.5×. Set your preferred default speed here."],
          ["Auto-advance", "When enabled, audio automatically plays the next ayah after each one completes."],
        ]} />

        <DocHeading><Clock className="h-4 w-4 text-muted-foreground" /> Prayer Times</DocHeading>
        <DocTable rows={[
          ["Calculation method", "Muslim World League (default), ISNA, Egyptian, Karachi, Umm al-Qura, Dubai."],
          ["Juristic school (Asr)", "Standard (Shafi'i) or Hanafi — changes Asr time by 20–45 minutes depending on latitude."],
          ["Manual coordinates", "Override geolocation with a specific latitude/longitude for a fixed city."],
        ]} />

        <DocHeading><ShieldCheck className="h-4 w-4 text-muted-foreground" /> Account</DocHeading>
        <DocTable rows={[
          ["Email", "View or update your email address via Clerk's secure profile page."],
          ["Password", "Change password. If you signed up with Google/GitHub, this option is hidden."],
          ["Delete account", "Permanently removes all your data — bookmarks, notes, memorization progress, streak. Irreversible."],
        ]} />

        <DocWarning>
          Display settings (theme, font size, transliteration) are stored in your browser's
          localStorage. Clearing browser data or switching browsers resets these to defaults.
          Sign-in based data (bookmarks, notes, progress) is always safely in the cloud.
        </DocWarning>

        <DocNote>
          Settings take effect immediately — no page reload or save button required. If a setting
          doesn't seem to apply, try a hard-refresh (Ctrl+Shift+R / ⌘+Shift+R).
        </DocNote>
      </div>
    ),
  },
];

/* ─────────────────────── Page component ─────────────────────── */

export default function DocumentationPage() {
  const [activeId, setActiveId] = useState("getting-started");

  const active = sections.find((s) => s.id === activeId) ?? sections[0];
  const activeIndex = sections.findIndex((s) => s.id === activeId);

  return (
    <InfoPageLayout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/6 via-transparent to-transparent"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center gap-4"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary border border-primary/30 bg-primary/5 px-3 py-1.5 rounded-full">
              Documentation
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              How NoorAl works
            </h1>
            <p className="text-muted-foreground text-base max-w-xl leading-relaxed">
              Everything you need to know about every feature — from your first
              ayah to completing your hifz.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Docs layout ── */}
      <div className="max-w-6xl mx-auto px-4 py-12 flex gap-8 items-start">

        {/* ── Sidebar ── */}
        <aside className="w-56 shrink-0 hidden md:block sticky top-24 self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4 px-2">
            Contents
          </p>
          <nav className="flex flex-col gap-0.5">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={cn(
                  "flex items-center gap-2 text-left text-sm px-2 py-2 rounded-lg transition-colors duration-150 w-full",
                  activeId === s.id
                    ? "text-primary font-medium bg-primary/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <s.icon className={cn("h-3.5 w-3.5 shrink-0", s.color)} />
                {s.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Mobile nav ── */}
        <div className="md:hidden w-full mb-6 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition-colors",
                  activeId === s.id
                    ? "border-primary/40 bg-primary/8 text-primary font-medium"
                    : "border-border/50 text-muted-foreground"
                )}
              >
                <s.icon className={cn("h-3 w-3", s.color)} />
                {s.title}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        <motion.article
          key={activeId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 min-w-0 md:pl-10 md:border-l border-border/40"
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
            <span>Docs</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">{active.title}</span>
          </div>

          {/* Title */}
          <div className="flex items-center gap-3 mb-8">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-primary/8">
              <active.icon className={cn("h-5 w-5", active.color)} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">{active.title}</h2>
          </div>

          <div className="text-sm text-muted-foreground leading-relaxed [&_strong]:text-foreground [&_p]:leading-relaxed">
            {active.content}
          </div>

          {/* Prev / Next */}
          <div className="mt-12 pt-6 border-t border-border/40 flex justify-between items-center">
            {activeIndex > 0 ? (
              <button
                onClick={() => setActiveId(sections[activeIndex - 1].id)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← {sections[activeIndex - 1].title}
              </button>
            ) : <span />}
            {activeIndex < sections.length - 1 ? (
              <button
                onClick={() => setActiveId(sections[activeIndex + 1].id)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {sections[activeIndex + 1].title} →
              </button>
            ) : <span />}
          </div>
        </motion.article>
      </div>
    </InfoPageLayout>
  );
}
