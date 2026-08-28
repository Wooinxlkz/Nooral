import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useSEO } from "@/lib/seo";
import { useTranslation } from "react-i18next";
import { JUZ_MAP } from "@/lib/quran-api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  BookOpen, CheckCircle2, Circle, PlayCircle, RotateCcw,
  Star, Zap, Moon, Flame, ChevronDown, ChevronUp,
} from "lucide-react";

/* ── Plan data ───────────────────────────────────────────────── */

interface DayEntry {
  day: number;
  surahId: number;
  surahName: string;
  ayahStart: number;
  ayahEnd?: number;
  label: string;
}

interface Plan {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  totalDays: number;
  days: DayEntry[];
}

const JUZZ_AMMA_SURAHS: { id: number; name: string; ayahs: number }[] = [
  { id: 78,  name: "An-Naba",       ayahs: 40 },
  { id: 79,  name: "An-Nazi'at",    ayahs: 46 },
  { id: 80,  name: "Abasa",         ayahs: 42 },
  { id: 81,  name: "At-Takwir",     ayahs: 29 },
  { id: 82,  name: "Al-Infitar",    ayahs: 19 },
  { id: 83,  name: "Al-Mutaffifin", ayahs: 36 },
  { id: 84,  name: "Al-Inshiqaq",   ayahs: 25 },
  { id: 85,  name: "Al-Buruj",      ayahs: 22 },
  { id: 86,  name: "At-Tariq",      ayahs: 17 },
  { id: 87,  name: "Al-Ala",        ayahs: 19 },
  { id: 88,  name: "Al-Ghashiyah",  ayahs: 26 },
  { id: 89,  name: "Al-Fajr",       ayahs: 30 },
  { id: 90,  name: "Al-Balad",      ayahs: 20 },
  { id: 91,  name: "Ash-Shams",     ayahs: 15 },
  { id: 92,  name: "Al-Layl",       ayahs: 21 },
  { id: 93,  name: "Ad-Duha",       ayahs: 11 },
  { id: 94,  name: "Ash-Sharh",     ayahs: 8 },
  { id: 95,  name: "At-Tin",        ayahs: 8 },
  { id: 96,  name: "Al-Alaq",       ayahs: 19 },
  { id: 97,  name: "Al-Qadr",       ayahs: 5 },
  { id: 98,  name: "Al-Bayyinah",   ayahs: 8 },
  { id: 99,  name: "Az-Zalzalah",   ayahs: 8 },
  { id: 100, name: "Al-Adiyat",     ayahs: 11 },
  { id: 101, name: "Al-Qariah",     ayahs: 11 },
  { id: 102, name: "At-Takathur",   ayahs: 8 },
  { id: 103, name: "Al-Asr",        ayahs: 3 },
  { id: 104, name: "Al-Humazah",    ayahs: 9 },
  { id: 105, name: "Al-Fil",        ayahs: 5 },
  { id: 106, name: "Quraysh",       ayahs: 4 },
  { id: 107, name: "Al-Maun",       ayahs: 7 },
  { id: 108, name: "Al-Kawthar",    ayahs: 3 },
  { id: 109, name: "Al-Kafirun",    ayahs: 6 },
  { id: 110, name: "An-Nasr",       ayahs: 3 },
  { id: 111, name: "Al-Masad",      ayahs: 5 },
  { id: 112, name: "Al-Ikhlas",     ayahs: 4 },
  { id: 113, name: "Al-Falaq",      ayahs: 5 },
  { id: 114, name: "An-Nas",        ayahs: 6 },
];

const SEVEN_DAY_SURAHS: DayEntry[] = [
  { day: 1, surahId: 1,   surahName: "Al-Fatiha",  ayahStart: 1, label: "The Opening — foundation of every prayer" },
  { day: 2, surahId: 2,   surahName: "Al-Baqarah", ayahStart: 1, ayahEnd: 82,  label: "Al-Baqarah part 1 (1–82)" },
  { day: 3, surahId: 2,   surahName: "Al-Baqarah", ayahStart: 83, ayahEnd: 177, label: "Al-Baqarah part 2 (83–177)" },
  { day: 4, surahId: 18,  surahName: "Al-Kahf",    ayahStart: 1, label: "Al-Kahf — Friday Surah, protection from Dajjal" },
  { day: 5, surahId: 36,  surahName: "Ya-Sin",     ayahStart: 1, label: "Ya-Sin — heart of the Quran" },
  { day: 6, surahId: 55,  surahName: "Ar-Rahman",  ayahStart: 1, label: "Ar-Rahman — Allah's blessings" },
  { day: 7, surahId: 67,  surahName: "Al-Mulk",    ayahStart: 1, label: "Al-Mulk — protection in the grave" },
];

function buildJuzzAmmaDays(): DayEntry[] {
  const days: DayEntry[] = [];
  const perDay = Math.ceil(JUZZ_AMMA_SURAHS.length / 14);
  for (let i = 0; i < 14; i++) {
    const slice = JUZZ_AMMA_SURAHS.slice(i * perDay, (i + 1) * perDay);
    if (slice.length === 0) break;
    const first = slice[0];
    const last = slice[slice.length - 1];
    days.push({
      day: i + 1,
      surahId: first.id,
      surahName: first.name,
      ayahStart: 1,
      label: slice.length === 1
        ? first.name
        : `${first.name} – ${last.name} (${slice.length} surahs)`,
    });
  }
  return days;
}

const KHATM_DAYS: DayEntry[] = JUZ_MAP.map((j) => ({
  day: j.juz,
  surahId: j.surah,
  surahName: j.name,
  ayahStart: j.ayah,
  label: `Juz ${j.juz} — ${j.name}`,
}));

const PLANS: Plan[] = [
  {
    id: "khatm-30",
    title: "Complete Quran — 30 Days",
    description: "Read one Juz per day to complete the entire Quran in a month.",
    icon: Star,
    iconColor: "text-amber-500",
    totalDays: 30,
    days: KHATM_DAYS,
  },
  {
    id: "juz-amma-14",
    title: "Juz Amma — 14 Days",
    description: "Master the 37 short surahs of Juz 30 in two focused weeks.",
    icon: Zap,
    iconColor: "text-blue-500",
    totalDays: 14,
    days: buildJuzzAmmaDays(),
  },
  {
    id: "core-7",
    title: "7-Day Core Surahs",
    description: "Seven essential surahs every Muslim should know deeply.",
    icon: Flame,
    iconColor: "text-rose-500",
    totalDays: 7,
    days: SEVEN_DAY_SURAHS,
  },
  {
    id: "ramadan-30",
    title: "Ramadan Khatm",
    description: "A Ramadan-optimised schedule: 1 Juz per night for 30 nights.",
    icon: Moon,
    iconColor: "text-indigo-500",
    totalDays: 30,
    days: KHATM_DAYS.map((d) => ({ ...d, label: `Night ${d.day} · ${d.label}` })),
  },
];

/* ── Local-storage helpers ───────────────────────────────────── */

interface PlanProgress {
  startDate: string;
  completedDays: number[];
}

function loadProgress(planId: string): PlanProgress | null {
  try {
    const raw = localStorage.getItem(`nooral-plan-${planId}`);
    return raw ? (JSON.parse(raw) as PlanProgress) : null;
  } catch {
    return null;
  }
}

function saveProgress(planId: string, p: PlanProgress) {
  localStorage.setItem(`nooral-plan-${planId}`, JSON.stringify(p));
}

function resetProgress(planId: string) {
  localStorage.removeItem(`nooral-plan-${planId}`);
}

/* ── Plan card component ─────────────────────────────────────── */

function PlanCard({ plan }: { plan: Plan }) {
  const [progress, setProgress] = useState<PlanProgress | null>(() => loadProgress(plan.id));
  const [expanded, setExpanded] = useState(false);

  const completedDays = progress?.completedDays ?? [];
  const pct = Math.round((completedDays.length / plan.totalDays) * 100);

  function start() {
    const p: PlanProgress = { startDate: new Date().toISOString().split("T")[0], completedDays: [] };
    saveProgress(plan.id, p);
    setProgress(p);
    setExpanded(true);
  }

  function toggleDay(day: number) {
    const current = progress ?? { startDate: new Date().toISOString().split("T")[0], completedDays: [] };
    const updated: PlanProgress = {
      ...current,
      completedDays: current.completedDays.includes(day)
        ? current.completedDays.filter((d) => d !== day)
        : [...current.completedDays, day],
    };
    saveProgress(plan.id, updated);
    setProgress(updated);
  }

  function reset() {
    resetProgress(plan.id);
    setProgress(null);
  }

  const Icon = plan.icon;
  const nextDay = plan.days.find((d) => !completedDays.includes(d.day));

  return (
    <Card
      className={cn(
        "transition-all duration-200",
        progress && pct === 100
          ? "border-green-500/40 bg-green-500/5"
          : progress
            ? "border-primary/20 bg-primary/[0.03]"
            : "hover:border-border"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
            <Icon className={cn("w-5 h-5", plan.iconColor)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base">{plan.title}</CardTitle>
              {progress && pct === 100 && (
                <Badge className="bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30 shrink-0">
                  Complete ✓
                </Badge>
              )}
            </div>
            <CardDescription className="mt-0.5">{plan.description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        {progress && (
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>{completedDays.length} / {plan.totalDays} days</span>
              <span>{pct}%</span>
            </div>
            <Progress value={pct} className="h-1.5" />
          </div>
        )}

        {/* Next day quick link */}
        {progress && nextDay && pct < 100 && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/60">
            <PlayCircle className="w-4 h-4 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Up next · Day {nextDay.day}</p>
              <p className="text-sm font-medium truncate">{nextDay.label}</p>
            </div>
            <Link
              href={`/reader?surah=${nextDay.surahId}&ayah=${nextDay.ayahStart}`}
              className="text-xs text-primary font-medium hover:underline shrink-0"
            >
              Read →
            </Link>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          {!progress ? (
            <Button size="sm" className="flex-1 gap-2" onClick={start}>
              <PlayCircle className="w-4 h-4" />
              Start Plan
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {expanded ? "Hide" : "Show"} schedule
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="gap-2 text-muted-foreground hover:text-destructive"
                onClick={reset}
                title="Reset progress"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </>
          )}
        </div>

        {/* Day list */}
        {expanded && (
          <div className="space-y-1 max-h-80 overflow-y-auto pr-1 mt-1">
            {plan.days.map((entry) => {
              const done = completedDays.includes(entry.day);
              return (
                <div
                  key={entry.day}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                    done ? "bg-green-500/8 dark:bg-green-500/10" : "hover:bg-muted/50"
                  )}
                >
                  <button
                    onClick={() => toggleDay(entry.day)}
                    className="shrink-0 transition-colors"
                  >
                    {done
                      ? <CheckCircle2 className="w-4.5 h-4.5 text-green-500" style={{ width: 18, height: 18 }} />
                      : <Circle className="w-4.5 h-4.5 text-muted-foreground/40 hover:text-primary" style={{ width: 18, height: 18 }} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm truncate", done && "line-through text-muted-foreground")}>
                      {entry.label}
                    </p>
                  </div>
                  <Link
                    href={`/reader?surah=${entry.surahId}&ayah=${entry.ayahStart}`}
                    className={cn(
                      "shrink-0 text-xs font-medium hover:underline",
                      done ? "text-muted-foreground" : "text-primary"
                    )}
                    onClick={() => !done && toggleDay(entry.day)}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ── Page ────────────────────────────────────────────────────── */

export default function PlansPage() {
  useSEO(
    "Reading Plans",
    "Structured Quran reading plans — complete the Quran in 30 days, master Juz Amma, or follow the 7-day core surahs plan."
  );
  const { t } = useTranslation();

  // Total across all plans
  const [totalCompleted, setTotalCompleted] = useState(0);
  useEffect(() => {
    let n = 0;
    PLANS.forEach((p) => {
      const prog = loadProgress(p.id);
      if (prog) n += prog.completedDays.length;
    });
    setTotalCompleted(n);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reading Plans</h1>
        <p className="text-muted-foreground">
          Choose a structured plan to build a consistent reading habit. Your progress is saved automatically.
        </p>
        {totalCompleted > 0 && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Star className="w-3.5 h-3.5" />
            {totalCompleted} sessions completed across all plans
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      <div className="mt-10 p-5 rounded-2xl bg-muted/40 border border-border/60">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-1">How plans work</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Select a plan and click <strong>Start Plan</strong>. Each day shows which surah and starting ayah to read.
              Click the <BookOpen className="w-3 h-3 inline" /> icon to open that position directly in the reader.
              Check off days as you complete them — your progress is saved in your browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
