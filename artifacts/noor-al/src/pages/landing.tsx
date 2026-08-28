import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useAuthModal } from "@/lib/auth-modal-store";
import { motion } from "framer-motion";
import {
  BookOpen, Brain, Clock, Book, Library, Bookmark,
  Radio, Search, FileText, Star, ChevronDown, ArrowRight,
  Mic, CalendarDays, FolderHeart, ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";
import Header from "@/components/layout/header";

const features = [
  {
    icon: BookOpen,
    title: "Quran Reader",
    description: "Read with authentic Uthmanic script, translations, word-by-word highlight, and inline tafsir.",
    color: "text-emerald-500 dark:text-emerald-400",
    bg: "bg-emerald-500/8 dark:bg-emerald-400/10",
  },
  {
    icon: Brain,
    title: "Memorization Tracker",
    description: "Track your hifz progress with smart spaced repetition and daily review queues.",
    color: "text-blue-500 dark:text-blue-400",
    bg: "bg-blue-500/8 dark:bg-blue-400/10",
  },
  {
    icon: Clock,
    title: "Prayer Times",
    description: "Accurate salah times based on your real-time geolocation, every single day.",
    color: "text-amber-500 dark:text-amber-400",
    bg: "bg-amber-500/8 dark:bg-amber-400/10",
  },
  {
    icon: Book,
    title: "Ahadith",
    description: "Browse Sahih Bukhari, Sahih Muslim, and more collections from major scholars.",
    color: "text-rose-500 dark:text-rose-400",
    bg: "bg-rose-500/8 dark:bg-rose-400/10",
  },
  {
    icon: Library,
    title: "Islamic Library",
    description: "Articles, duas, prophet timelines, and deep Islamic knowledge beautifully presented.",
    color: "text-violet-500 dark:text-violet-400",
    bg: "bg-violet-500/8 dark:bg-violet-400/10",
  },
  {
    icon: Bookmark,
    title: "Bookmarks",
    description: "Save your favourite verses and return to them instantly from any device.",
    color: "text-sky-500 dark:text-sky-400",
    bg: "bg-sky-500/8 dark:bg-sky-400/10",
  },
  {
    icon: Radio,
    title: "Quran Radio",
    description: "Live streams of beautiful Quran recitation from top radio stations worldwide.",
    color: "text-orange-500 dark:text-orange-400",
    bg: "bg-orange-500/8 dark:bg-orange-400/10",
  },
  {
    icon: FileText,
    title: "Notes & Reflections",
    description: "Write personal reflections on verses and revisit them whenever you need.",
    color: "text-teal-500 dark:text-teal-400",
    bg: "bg-teal-500/8 dark:bg-teal-400/10",
  },
  {
    icon: Search,
    title: "Full-Text Search",
    description: "Find any verse by meaning or keyword across the entire Quran instantly.",
    color: "text-pink-500 dark:text-pink-400",
    bg: "bg-pink-500/8 dark:bg-pink-400/10",
  },
  {
    icon: Mic,
    title: "Reciters",
    description: "Choose from world-renowned reciters with per-ayah audio and verse tracking.",
    color: "text-indigo-500 dark:text-indigo-400",
    bg: "bg-indigo-500/8 dark:bg-indigo-400/10",
  },
  {
    icon: CalendarDays,
    title: "Islamic Calendar",
    description: "Follow the Hijri calendar with important Islamic events and occasions marked.",
    color: "text-lime-600 dark:text-lime-400",
    bg: "bg-lime-500/8 dark:bg-lime-400/10",
  },
  {
    icon: FolderHeart,
    title: "Collections",
    description: "Organise your favourite verses into named collections for easy revisiting.",
    color: "text-fuchsia-500 dark:text-fuchsia-400",
    bg: "bg-fuchsia-500/8 dark:bg-fuchsia-400/10",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const { isSignedIn } = useAuth();
  const openModal = useAuthModal((s) => s.openModal);

  function handleGetStarted() {
    if (isSignedIn) {
      setLocation("/reader");
    } else {
      openModal("sign-up");
    }
  }

  function handleRead() {
    setLocation("/reader");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 pt-16 pb-28 overflow-hidden">
        {/* Video background */}
        <video
          aria-hidden
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="pointer-events-none absolute inset-0 w-full h-full object-cover"
          style={{ transform: "translateZ(0)" }}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260604_125109_19424216-4e2a-4560-b9f2-f1b5f6eb2c2e.mp4"
        />
        {/* Dark overlay so text stays readable */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/55" />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center gap-5 max-w-4xl mx-auto"
        >
          {/* Bismillah */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.9 }}
            className="font-arabic text-2xl text-primary/70 tracking-wide"
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </motion.p>

          {/* Giant Arabic نور with glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" }}
            className="relative select-none"
          >
            <span className="text-[110px] md:text-[140px] font-bold font-arabic text-primary leading-none">
              نور
            </span>
            <span
              aria-hidden
              className="absolute inset-0 text-[110px] md:text-[140px] font-bold font-arabic text-primary leading-none blur-3xl opacity-25"
            >
              نور
            </span>
          </motion.div>

          {/* Title + tagline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="flex flex-col items-center gap-2"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">NoorAl</h1>
            <p className="text-lg md:text-xl text-white/75 font-medium">
              Your Complete Quran Companion
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.7 }}
            className="text-base text-white/65 max-w-xl leading-relaxed"
          >
            Read, memorize, reflect, and connect with the words of Allah.
            Built with love for Muslims everywhere.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 mt-2"
          >
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="rounded-2xl px-8 h-12 text-base font-semibold gap-2 shadow-lg"
            >
              Get Started — It's Free
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleRead}
              className="rounded-2xl px-8 h-12 text-base font-semibold gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Start Reading
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/40"
        >
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          >
            <ChevronDown className="h-6 w-6" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════ VERSE HIGHLIGHT ══════════════ */}
      <section className="py-16 px-4 bg-primary/5 dark:bg-primary/10 border-y border-border/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="font-arabic text-3xl md:text-4xl text-primary leading-loose mb-5">
            ﴿ إِنَّ هَـٰذَا ٱلْقُرْءَانَ يَهْدِى لِلَّتِى هِىَ أَقْوَمُ ﴾
          </p>
          <p className="text-muted-foreground text-base md:text-lg italic leading-relaxed">
            "Indeed, this Quran guides to that which is most suitable"
          </p>
          <p className="text-primary/60 text-sm mt-3 font-semibold tracking-wide">
            — Surah Al-Isra, 17:9
          </p>
        </motion.div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-3">
              Everything you need
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              A complete Islamic companion
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto leading-relaxed">
              From reading to memorization, prayer times to ahadith — all in one
              beautifully crafted place.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className="group p-6 rounded-2xl border border-border/50 bg-card/60 hover:bg-card hover:border-primary/25 hover:shadow-md transition-all duration-200 cursor-default"
              >
                <div className={`inline-flex items-center justify-center h-10 w-10 rounded-xl mb-4 ${feature.bg}`}>
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════ STATS ROW ══════════════ */}
      <section className="py-12 px-4 border-y border-border/30 bg-card/30">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { value: "114", label: "Surahs" },
            { value: "6,236", label: "Verses" },
            { value: "50+", label: "Reciters" },
            { value: "∞", label: "Blessings" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-3xl md:text-4xl font-bold text-primary font-arabic">{stat.value}</span>
              <span className="text-sm text-muted-foreground font-medium">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ══════════════ FINAL CTA ══════════════ */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-2xl mx-auto text-center rounded-3xl border border-primary/20 overflow-hidden p-12"
        >
          {/* Video background */}
          <video
            aria-hidden
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="pointer-events-none absolute inset-0 w-full h-full object-cover"
            style={{ transform: "translateZ(0)" }}
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4"
          />
          {/* Overlay */}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/60" />

          <div className="relative z-10 flex flex-col items-center gap-5">
            <p className="font-arabic text-4xl text-primary">الحمد لله</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Begin your journey today
            </h2>
            <p className="text-white/70 leading-relaxed max-w-sm">
              Join thousands of Muslims using NoorAl to strengthen their
              connection with the Quran — completely free.
            </p>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="rounded-2xl px-10 h-12 text-base font-semibold gap-2 shadow-lg mt-2"
            >
              <Star className="h-4 w-4" />
              Get Started — It's Free
            </Button>
            <p className="text-xs text-muted-foreground/60">
              No credit card required · Works on all devices
            </p>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
