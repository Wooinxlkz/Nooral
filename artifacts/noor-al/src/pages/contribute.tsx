import { useState } from "react";
import { motion } from "framer-motion";
import {
  Github, Bug, Lightbulb, Globe2, Eye, Keyboard,
  Volume2, Smartphone, Heart, ArrowRight, MessageSquare,
  Accessibility, CheckCircle2,
} from "lucide-react";
import { InfoPageLayout } from "@/components/layout/info-layout";
import { Button } from "@/components/ui/button";
import { SupportDialog } from "@/components/support-dialog";

type SupportType = "bug" | "feature" | "translate" | "general";

const ways = [
  {
    icon: Bug,
    title: "Report a bug",
    description:
      "Found something broken? Tell us directly and we'll fix it fast.",
    action: "Report a bug",
    supportType: "bug" as SupportType,
    color: "text-rose-500 dark:text-rose-400",
    bg: "bg-rose-500/8 dark:bg-rose-400/10",
    hoverBorder: "hover:border-rose-500/30",
  },
  {
    icon: Lightbulb,
    title: "Suggest a feature",
    description:
      "Have an idea that would improve NoorAl for the Muslim community? We'd love to hear it.",
    action: "Request a feature",
    supportType: "feature" as SupportType,
    color: "text-amber-500 dark:text-amber-400",
    bg: "bg-amber-500/8 dark:bg-amber-400/10",
    hoverBorder: "hover:border-amber-500/30",
  },
  {
    icon: Globe2,
    title: "Help translate",
    description:
      "NoorAl aims to serve Muslims in every language. Help us translate the interface into yours.",
    action: "Contact us",
    supportType: "translate" as SupportType,
    color: "text-blue-500 dark:text-blue-400",
    bg: "bg-blue-500/8 dark:bg-blue-400/10",
    hoverBorder: "hover:border-blue-500/30",
  },
  {
    icon: MessageSquare,
    title: "Spread the word",
    description:
      "Share NoorAl with your family, friends, and local mosque. Every share helps us grow and reach more Muslims.",
    action: "Share NoorAl",
    supportType: null,
    href: "https://nooral.app",
    color: "text-emerald-500 dark:text-emerald-400",
    bg: "bg-emerald-500/8 dark:bg-emerald-400/10",
    hoverBorder: "hover:border-emerald-500/30",
  },
];

const a11yFeatures = [
  {
    icon: Eye,
    title: "High-contrast themes",
    description:
      "Light, Dark, and Sepia themes are all designed with sufficient contrast ratios. The dark theme meets WCAG AA for all text elements.",
  },
  {
    icon: Keyboard,
    title: "Keyboard navigation",
    description:
      "The full interface is navigable by keyboard. Focus rings are clearly visible. Keyboard shortcut: Ctrl+K to open search instantly.",
  },
  {
    icon: Volume2,
    title: "Screen reader support",
    description:
      "Semantic HTML, ARIA labels, and role attributes throughout. The Quran Reader uses aria-live for dynamic content announcements.",
  },
  {
    icon: Smartphone,
    title: "Responsive design",
    description:
      "NoorAl works on every screen — from a small phone to a 4K monitor. The layout adapts gracefully at every breakpoint.",
  },
  {
    icon: Globe2,
    title: "RTL & LTR support",
    description:
      "The UI switches automatically between left-to-right and right-to-left layouts based on your chosen interface language.",
  },
  {
    icon: Accessibility,
    title: "Dyslexia-friendly fonts",
    description:
      "The interface uses the Outfit typeface, optimised for readability. Arabic text uses the Amiri Quran font — widely recommended by Islamic scholars for clarity.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.5 },
  }),
};

export default function ContributePage() {
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportType, setSupportType] = useState<SupportType>("general");

  function openSupport(type: SupportType) {
    setSupportType(type);
    setSupportOpen(true);
  }

  return (
    <InfoPageLayout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-violet-500/6 via-transparent to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-500/5 blur-3xl rounded-full"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center gap-5"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400 border border-violet-500/30 bg-violet-500/5 px-3 py-1.5 rounded-full">
              <Heart className="h-3.5 w-3.5" />
              Contribute & Accessibility
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Help us build
              <br />
              <span className="text-primary">something meaningful</span>
            </h1>
            <p className="text-muted-foreground text-base max-w-xl leading-relaxed">
              NoorAl is built for the Ummah. Whether you report a bug, suggest a
              feature, or share the app — every contribution earns its reward.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="https://github.com/nooral-app/nooral" target="_blank" rel="noreferrer">
                <Button size="lg" variant="outline" className="rounded-2xl gap-2">
                  <Github className="h-4 w-4" />
                  View on GitHub
                </Button>
              </a>
              <Button
                size="lg"
                className="rounded-2xl gap-2"
                onClick={() => openSupport("general")}
              >
                <MessageSquare className="h-4 w-4" />
                Contact us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Ways to contribute ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
            Get involved
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Ways to contribute
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto leading-relaxed">
            No contribution is too small. Every bug report, suggestion, and share
            helps make NoorAl better for every Muslim.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ways.map((w, i) => (
            <motion.div
              key={w.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`flex flex-col p-6 rounded-2xl border border-border/50 bg-card/60 hover:bg-card transition-all duration-200 group ${w.hoverBorder}`}
            >
              <div className={`inline-flex items-center justify-center h-10 w-10 rounded-xl mb-4 ${w.bg}`}>
                <w.icon className={`h-5 w-5 ${w.color}`} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{w.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">
                {w.description}
              </p>

              {w.supportType ? (
                <button
                  onClick={() => openSupport(w.supportType as SupportType)}
                  className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${w.color} hover:underline`}
                >
                  {w.action}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <a
                  href={w.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${w.color} hover:underline`}
                >
                  {w.action}
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Verse ── */}
      <section className="py-14 px-6 bg-primary/5 dark:bg-primary/10 border-y border-border/30">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="font-arabic text-3xl md:text-4xl text-primary leading-loose mb-4">
            ﴿ وَتَعَاوَنُوا۟ عَلَى ٱلْبِرِّ وَٱلتَّقْوَىٰ ﴾
          </p>
          <p className="text-muted-foreground italic text-base md:text-lg">
            "Cooperate with one another in goodness and righteousness"
          </p>
          <p className="text-primary/60 text-sm mt-2 font-semibold">— Surah Al-Ma'idah, 5:2</p>
        </motion.div>
      </section>

      {/* ── Accessibility ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
            Accessibility
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            The Quran is for everyone
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto leading-relaxed">
            NoorAl is built with accessibility at its core. We believe every Muslim,
            regardless of ability, deserves beautiful access to the words of Allah.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {a11yFeatures.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-border/50 bg-card/60 hover:bg-card transition-all duration-200"
            >
              <div className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-primary/8 mb-4">
                <f.icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-sm">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>

        {/* WCAG commitment */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-10 p-6 rounded-2xl border border-primary/20 bg-primary/5 dark:bg-primary/10"
        >
          <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
            <div className="flex items-center gap-3 shrink-0">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <span className="font-semibold text-foreground">Our WCAG commitment</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              NoorAl targets <strong className="text-foreground">WCAG 2.1 Level AA</strong> compliance
              across the entire platform. If you encounter an accessibility barrier, please
              report it as a bug — we treat accessibility issues with the same urgency as
              functional bugs.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── Contact ── */}
      <section className="border-t border-border/40 py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto text-center"
        >
          <h2 className="text-2xl font-bold text-foreground mb-3">Have a question?</h2>
          <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
            Reach out any time — we read every message.
          </p>
          <Button
            size="lg"
            variant="outline"
            className="rounded-2xl gap-2"
            onClick={() => openSupport("general")}
          >
            <MessageSquare className="h-4 w-4" />
            Send us a message
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </section>

      {/* ── Support dialog (shared) ── */}
      <SupportDialog
        open={supportOpen}
        onOpenChange={setSupportOpen}
        defaultType={supportType}
      />
    </InfoPageLayout>
  );
}
