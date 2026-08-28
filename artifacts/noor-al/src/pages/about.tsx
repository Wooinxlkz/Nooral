import { motion, type Variants } from "framer-motion";
import { Link } from "wouter";
import {
  Heart, Globe, Shield, Sparkles, Code2, Star,
  BookOpen, Brain, Clock, Bookmark, ArrowRight,
  Github, ExternalLink, Moon,
} from "lucide-react";
import { InfoPageLayout } from "@/components/layout/info-layout";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/lib/auth-modal-store";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.6, ease: "easeOut" },
  }),
};

const values = [
  {
    icon: Heart,
    title: "Sadaqa Jariya",
    description:
      "NoorAl was built with one intention — to be an ongoing charity (sadaqa jariya). Every ayah read, every surah memorized, every Muslim guided here — I hope it is written in the scales of everyone who ever encouraged me.",
    color: "text-rose-500 dark:text-rose-400",
    bg: "bg-rose-500/8 dark:bg-rose-400/10",
  },
  {
    icon: Shield,
    title: "Always free",
    description:
      "This is not a business. NoorAl is free and will remain free — no paywalls, no ads, no selling your data. The Quran belongs to every Muslim equally, and so does every tool built to help you connect with it.",
    color: "text-emerald-500 dark:text-emerald-400",
    bg: "bg-emerald-500/8 dark:bg-emerald-400/10",
  },
  {
    icon: Globe,
    title: "For every Muslim",
    description:
      "From a new Muslim reading their first surah, to a hafidh reviewing their hifz — NoorAl is for all of you. Every language, every background, every level. You belong here.",
    color: "text-blue-500 dark:text-blue-400",
    bg: "bg-blue-500/8 dark:bg-blue-400/10",
  },
  {
    icon: Sparkles,
    title: "Authentic sources",
    description:
      "Quran text from verified Uthmanic manuscripts. Translations from respected scholars. Ahadith from the authenticated six collections. No shortcuts, no fabrications — the truth only.",
    color: "text-amber-500 dark:text-amber-400",
    bg: "bg-amber-500/8 dark:bg-amber-400/10",
  },
  {
    icon: Code2,
    title: "Open source soon",
    description:
      "The plan has always been to open-source NoorAl — so the Ummah can own it, improve it, and carry it forward long after me. Every Muslim developer who contributes becomes part of this sadaqa.",
    color: "text-violet-500 dark:text-violet-400",
    bg: "bg-violet-500/8 dark:bg-violet-400/10",
  },
  {
    icon: Moon,
    title: "A bridge, not a destination",
    description:
      "NoorAl is a bridge. It's not the Quran — the Quran is. But if this bridge helps even one person cross into a closer relationship with Allah's words, then every late night was worth it.",
    color: "text-sky-500 dark:text-sky-400",
    bg: "bg-sky-500/8 dark:bg-sky-400/10",
  },
];

const features = [
  { icon: BookOpen, label: "Quran Reader" },
  { icon: Brain, label: "Memorization Tracker" },
  { icon: Clock, label: "Prayer Times" },
  { icon: Bookmark, label: "Bookmarks & Notes" },
  { icon: Globe, label: "Islamic Library" },
  { icon: Star, label: "Ahadith Browser" },
];

export default function AboutPage() {
  const openModal = useAuthModal((s) => s.openModal);

  return (
    <InfoPageLayout>

      {/* ══════════════════════════ HERO ══════════════════════════ */}
      <section
        className="relative overflow-hidden border-b border-border/40 flex items-center justify-center"
        style={{ minHeight: "calc(100vh - 64px)" }}
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
          style={{ transform: "translateZ(0)", willChange: "transform" }}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4"
        />
        {/* Dark overlay */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/55" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-28 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-6"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 border border-white/20 bg-white/10 px-3 py-1.5 rounded-full">
              About NoorAl
            </span>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              A light built for the
              <br />
              <span className="text-primary">whole Ummah</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
              NoorAl is a free Quran platform built by one Muslim, with one intention —
              to make it easier for every heart to find its way to Allah's words.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              <Button size="lg" className="rounded-2xl gap-2" onClick={() => openModal("sign-up")}>
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-2xl gap-2 border-white/30 text-white hover:bg-white/10" asChild>
                <Link href="/documentation">Read the Docs</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════ LETTER FROM KARIM ══════════════════════════ */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-10"
        >
          {/* Label */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border/50" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary shrink-0">
              A letter from the builder
            </span>
            <div className="h-px flex-1 bg-border/50" />
          </div>

          {/* Letter card */}
          <div className="relative rounded-3xl border border-border/50 bg-card/60 px-8 py-10 md:px-12 md:py-12 shadow-sm">
            {/* Decorative quote mark */}
            <div className="absolute -top-4 left-8 text-6xl text-primary/20 font-serif leading-none select-none">"</div>

            <div className="space-y-5 text-muted-foreground leading-[1.85] text-[15px]">
              <p>
                My name is <strong className="text-foreground">Karim</strong>. I'm not a company.
                I'm not a team. I'm one person who likes to sit alone and build things.
              </p>
              <p>
                I built NoorAl entirely by myself — every page, every feature, every late night —
                with the intention that it would be my <strong className="text-foreground">sadaqa jariya</strong>,
                an ongoing charity that continues to give even after I'm gone. I built it free,
                and I pray it stays free. I hope it never stops. I hope it never gets cut off.
              </p>
              <p>
                I always wished I lived in the time of the Sahabah — the period of
                Umar ibn al-Khattab, Abu Bakr al-Siddiq, and those blessed generations who gave
                everything they had for this deen. I know I'm nothing close to them.
                I'm not a perfect human. But this is my small offering.
                The best I could do with what I have.
              </p>
              <p>
                Soon, NoorAl will be <strong className="text-foreground">open source</strong> — so
                the Ummah can own it, so Muslim developers can add to it, so it outlives me.
                That has always been the plan.
              </p>
              <p>
                I built this for my <strong className="text-foreground">parents</strong> — who raised
                me to always look up and do my best. For my <strong className="text-foreground">twin sisters</strong>,
                whom I love more than words. For my <strong className="text-foreground">grandparents
                and uncles</strong> who are no longer here — I carry you with me in everything I do.
                For every person who ever believed in me.
              </p>
              <p>
                My hope is simple: that NoorAl is a
                <strong className="text-foreground"> noor</strong> — a light — for every Muslim
                who opens it. That someone somewhere finds guidance here. That a new Muslim reads
                their first surah through this. That a brother or sister feels a little closer
                to Allah because of something I built.
              </p>
              <p>
                I'm not a bridge to anything worldly. I just hope this is a bridge between
                hearts and the Quran. That's all.
              </p>
              <p>
                Much love. And <strong className="text-foreground">Free Palestine</strong>. 🍉
              </p>
            </div>

            {/* Signature */}
            <div className="mt-8 pt-6 border-t border-border/40 flex items-center gap-4">
              <div className="h-11 w-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-lg font-arabic">ك</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Karim</p>
                <p className="text-xs text-muted-foreground">Builder of NoorAl · Nulltrace</p>
              </div>
              <div className="ml-auto">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-3.5 w-3.5" />
                  Open source soon
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════ QURANIC VERSE ══════════════════════════ */}
      <section className="py-16 px-6 bg-primary/5 dark:bg-primary/10 border-y border-border/30">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="font-arabic text-3xl md:text-4xl text-primary leading-loose mb-4">
            ﴿ وَنُنَزِّلُ مِنَ ٱلْقُرْءَانِ مَا هُوَ شِفَآءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ ﴾
          </p>
          <p className="text-muted-foreground italic text-base md:text-lg">
            "And We send down of the Quran that which is healing and mercy for the believers"
          </p>
          <p className="text-primary/60 text-sm mt-2 font-semibold">— Surah Al-Isra, 17:82</p>
        </motion.div>
      </section>

      {/* ══════════════════════════ DEDICATION ══════════════════════════ */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Dedicated to</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            The people who made this possible
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            NoorAl exists because of the people who raised me, loved me, and left me with
            enough warmth to want to give back.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              emoji: "🤲",
              title: "My parents",
              desc: "Who raised me to always look up, always do my best, and never stop trying — even when it's hard. Everything I build carries your duas.",
              color: "border-rose-500/20 bg-rose-500/5",
              labelColor: "text-rose-500",
            },
            {
              emoji: "💕",
              title: "My twin sisters",
              desc: "I love you more than I know how to say. I hope when you use this, you feel how much of it was built thinking of you.",
              color: "border-pink-500/20 bg-pink-500/5",
              labelColor: "text-pink-500",
            },
            {
              emoji: "🌙",
              title: "My grandparents & uncles",
              desc: "You are no longer here, but you are in every good thing I do. I carry you with me. May Allah grant you the highest Jannah.",
              color: "border-amber-500/20 bg-amber-500/5",
              labelColor: "text-amber-500",
            },
            {
              emoji: "🌍",
              title: "Every Muslim, everywhere",
              desc: "Brothers and sisters I've never met. New Muslims finding their footing. Hafidhs reviewing their hifz. You are all why this exists.",
              color: "border-emerald-500/20 bg-emerald-500/5",
              labelColor: "text-emerald-500",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`p-6 rounded-2xl border ${item.color} flex gap-4`}
            >
              <div className="text-3xl shrink-0">{item.emoji}</div>
              <div>
                <h3 className={`font-bold text-base mb-1.5 ${item.labelColor}`}>{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Palestine card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-4 p-6 rounded-2xl border border-border/50 bg-card/40 flex items-center gap-4"
        >
          <span className="text-3xl shrink-0">🍉</span>
          <div>
            <h3 className="font-bold text-base mb-1 text-foreground">For our brothers and sisters in Palestine</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              NoorAl stands in solidarity. Every dua made through this platform, every ayah of
              Quran recited — may Allah grant Palestine and all oppressed Muslims relief, victory,
              and justice. <strong className="text-foreground">Free Palestine.</strong>
            </p>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════ ONE MAN ══════════════════════════ */}
      <section className="py-16 px-6 border-y border-border/30 bg-muted/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
              One person
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5 leading-snug">
              Not a team. Just Karim.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              NoorAl is a solo project. No investors, no employees, no office. Just one person
              who likes to sit alone and build things — one feature at a time, one late night at a time.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              I always imagined what it would feel like to live in the time of the great Sahabah — to
              have given everything for the deen the way Umar ibn al-Khattab, Abu Bakr al-Siddiq,
              and those blessed generations did. That era has passed. But I'm still here, and this
              is what I can offer with what I have.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              I'm not a perfect human. But I gave this everything I had. And I pray Allah
              accepts it.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {features.map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-200"
              >
                <Icon className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground">{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════ VALUES ══════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
            Principles
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            What NoorAl stands for
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-border/50 bg-card/60 hover:bg-card hover:border-primary/25 transition-all duration-200"
            >
              <div className={`inline-flex items-center justify-center h-10 w-10 rounded-xl mb-4 ${v.bg}`}>
                <v.icon className={`h-5 w-5 ${v.color}`} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════ SECOND VERSE ══════════════════════════ */}
      <section className="py-14 px-6 bg-primary/5 dark:bg-primary/10 border-t border-border/30">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="font-arabic text-3xl md:text-4xl text-primary leading-loose mb-4">
            ﴿ إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ ﴾
          </p>
          <p className="text-muted-foreground italic text-base md:text-lg">
            "Verily, actions are (judged) by intentions"
          </p>
          <p className="text-primary/60 text-sm mt-2 font-semibold">— Sahih al-Bukhari, Hadith 1</p>
          <p className="text-muted-foreground/70 text-sm mt-5 max-w-xl mx-auto">
            The niyyah behind NoorAl has always been the same: to help Muslims connect with the Quran.
            Whatever good comes from it, I ask Allah to accept it and share its reward with
            everyone who helped me become who I am.
          </p>
        </motion.div>
      </section>

      {/* ══════════════════════════ CTA ══════════════════════════ */}
      <section className="border-t border-border/40 py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-xl mx-auto text-center"
        >
          <p className="font-arabic text-4xl text-primary mb-5">بارك الله فيكم</p>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            May Allah bless you and everyone you love
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            NoorAl is free, it's yours, and it was built with love. Use it.
            Share it. And make dua for everyone who raised me. 🤍
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button size="lg" className="rounded-2xl px-10 gap-2" onClick={() => openModal("sign-up")}>
              <Star className="h-4 w-4" />
              Get Started — It's Free
            </Button>
            <Button size="lg" variant="outline" className="rounded-2xl gap-2" asChild>
              <Link href="/contribute">Contribute</Link>
            </Button>
          </div>
        </motion.div>
      </section>

    </InfoPageLayout>
  );
}
