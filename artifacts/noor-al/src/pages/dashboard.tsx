import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useSEO } from "@/lib/seo";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { BookOpen, Flame, Target, Brain, FileText, Loader2, CalendarClock, TrendingUp, Bookmark, Quote, CalendarDays, Share2, Check, Activity } from "lucide-react";
import { SignInPrompt } from "@/components/sign-in-prompt";
import { useGetDashboard, useGetVerseOfDay, useGetReadingHeatmap } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";

function VerseOfTheDay() {
  const { data: verse, isLoading } = useGetVerseOfDay({ query: { staleTime: 24 * 60 * 60 * 1000 } as any });
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!verse) return;
    const text = `${verse.arabic}\n\n"${verse.translation}"\n\n— ${verse.surahName} (${verse.surah}:${verse.ayah})`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Verse of the Day — NoorAl", text });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading || !verse) {
    return (
      <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-amber-600/10 dark:from-amber-950/30 dark:to-amber-900/20">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="h-4 bg-amber-200/30 rounded animate-pulse w-1/3" />
            <div className="h-8 bg-amber-200/30 rounded animate-pulse" />
            <div className="h-4 bg-amber-200/30 rounded animate-pulse w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-amber-600/10 dark:from-amber-950/30 dark:to-amber-900/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Quote className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            {t("dashboard.verseOfDay")}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-[11px] border-amber-500/30 text-amber-700 dark:text-amber-400"
            >
              {verse.surahName} · {verse.surah}:{verse.ayah}
            </Badge>
            <button
              onClick={handleShare}
              aria-label="Share verse"
              className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors text-amber-600 dark:text-amber-400"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-arabic text-right text-foreground leading-loose mb-4 text-2xl" dir="rtl">
          {verse.arabic}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed italic">
          &ldquo;{verse.translation}&rdquo;
        </p>
        <Link
          href={`/reader?surah=${verse.surah}&ayah=${verse.ayah}`}
          className="inline-flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 font-medium mt-3 hover:underline"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Read in context
        </Link>
      </CardContent>
    </Card>
  );
}

/* ── Reading Activity Heatmap ─────────────────────────────────── */
const CELL = 13;
const GAP  = 2;
const WEEKS = 52;

function ReadingHeatmap({ isSignedIn }: { isSignedIn: boolean }) {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: heatmapData } = useGetReadingHeatmap({ year }, { query: { enabled: !!isSignedIn } as any });

  if (!heatmapData || heatmapData.length === 0) return null;

  // count map: "YYYY-MM-DD" → ayah count
  const countMap: Record<string, number> = {};
  for (const d of heatmapData) countMap[d.date] = d.count;
  const max = Math.max(1, ...heatmapData.map(d => d.count));

  // Build grid: 52 columns (weeks) × 7 rows (Sun–Sat), ending with today's week
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Rewind to the Sunday of the current week, then go 51 more weeks back
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - today.getDay() - 51 * 7);

  type Cell = { dateStr: string; count: number; isToday: boolean; isFuture: boolean };
  const weeks: Cell[][] = [];
  const monthLabels: { weekIdx: number; label: string }[] = [];
  let lastMonth = -1;

  for (let w = 0; w < WEEKS; w++) {
    const week: Cell[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + w * 7 + d);
      const dateStr = date.toISOString().slice(0, 10);
      week.push({
        dateStr,
        count: countMap[dateStr] ?? 0,
        isToday: date.getTime() === today.getTime(),
        isFuture: date > today,
      });
    }
    // Month label on the Sunday cell of each new month
    if (!week[0].isFuture) {
      const weekDate = new Date(week[0].dateStr);
      const m = weekDate.getMonth();
      if (m !== lastMonth) {
        monthLabels.push({ weekIdx: w, label: weekDate.toLocaleString("default", { month: "short" }) });
        lastMonth = m;
      }
    }
    weeks.push(week);
  }

  const cellStyle = (cell: Cell): React.CSSProperties => {
    if (cell.isFuture) return { backgroundColor: "transparent" };
    if (cell.count === 0) return { backgroundColor: "hsl(var(--muted))" };
    const opacity = (0.2 + (cell.count / max) * 0.8).toFixed(2);
    return { backgroundColor: `hsl(var(--primary) / ${opacity})` };
  };

  const totalWidth = WEEKS * (CELL + GAP) + 24;

  return (
    <Card className="mb-8">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          {t("dashboard.readingActivity")}
        </CardTitle>
        <CardDescription>{t("dashboard.activityLegend")} · {year}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-1">
          <div style={{ width: totalWidth }}>
            {/* Month labels */}
            <div className="relative h-5 mb-1" style={{ marginInlineStart: 22 }}>
              {monthLabels.map(({ weekIdx, label }) => (
                <span
                  key={weekIdx}
                  className="absolute text-[11px] text-muted-foreground select-none"
                  style={{ left: weekIdx * (CELL + GAP) }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Day labels + week columns */}
            <div className="flex" style={{ gap: GAP }}>
              {/* Day-of-week labels: blank, Mon, blank, Wed, blank, Fri, blank */}
              <div
                className="flex flex-col text-[10px] text-muted-foreground select-none"
                style={{ gap: GAP, width: 18, paddingTop: 1, flexShrink: 0 }}
              >
                {["", "M", "", "W", "", "F", ""].map((lbl, i) => (
                  <div key={i} style={{ height: CELL, lineHeight: `${CELL}px` }}>{lbl}</div>
                ))}
              </div>

              {/* Week columns */}
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: GAP, flexShrink: 0 }}>
                  {week.map((cell, di) => (
                    <div
                      key={di}
                      title={cell.isFuture ? "" : `${cell.dateStr}: ${cell.count} ayah${cell.count !== 1 ? "s" : ""}`}
                      style={{
                        width: CELL,
                        height: CELL,
                        borderRadius: 3,
                        flexShrink: 0,
                        outline: cell.isToday ? "2px solid hsl(var(--primary))" : "none",
                        outlineOffset: 1,
                        ...cellStyle(cell),
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{t("dashboard.less")}</span>
          {[0.2, 0.4, 0.6, 0.8, 1.0].map(o => (
            <div
              key={o}
              style={{ width: CELL, height: CELL, borderRadius: 3, backgroundColor: `hsl(var(--primary) / ${o})`, flexShrink: 0 }}
            />
          ))}
          <span>{t("dashboard.more")}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  useSEO("Dashboard", "Your Quran reading dashboard. Track daily streaks, reading goals, memorization progress, and recent activity.");
  const { isSignedIn, isLoaded } = useAuth();
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: dashboard, isLoading } = useGetDashboard({ query: { enabled: !!isSignedIn } as any });

  if (isLoaded && !isSignedIn) {
    return <SignInPrompt title="Sign in to view your dashboard" description="Track your daily streak, reading goals, memorization progress, and more." />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const estimatedDays = (dashboard as any)?.estimatedDaysToFinish;
  const avgDailyAyahs = (dashboard as any)?.avgDailyAyahs ?? 0;
  const goalAmt = dashboard?.goalProgress?.amountRead ?? 0;
  const goalTarget = (dashboard as any)?.goalTarget ?? 20;
  const goalPct = Math.min(100, goalTarget > 0 ? Math.round((goalAmt / goalTarget) * 100) : 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">{t("dashboard.title")}</h1>

      {/* ── Verse of the Day ── */}
      <div className="mb-8">
        <VerseOfTheDay />
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <BookOpen className="w-4 h-4 mr-2 text-primary" />
              {t("dashboard.lastRead")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard?.lastRead ? (
              <>
                <div className="text-2xl font-bold">{dashboard.lastRead.surahNameEn || `Surah ${dashboard.lastRead.surahId}`}</div>
                <p className="text-xs text-muted-foreground mt-1">Ayah {dashboard.lastRead.ayahNumber}</p>
                <Link href={`/reader?surah=${dashboard.lastRead.surahId}&ayah=${dashboard.lastRead.ayahNumber}`} className="text-xs text-primary font-medium mt-2 inline-block">
                  {t("dashboard.resume")}
                </Link>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">{t("dashboard.notStarted")}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Flame className="w-4 h-4 mr-2 text-orange-500" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.streak?.currentStreak || 0} Days</div>
            <p className="text-xs text-muted-foreground mt-1">Personal best: {dashboard?.streak?.longestStreak || 0} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Target className="w-4 h-4 mr-2 text-blue-500" />
              Daily Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1">
              <div className="text-2xl font-bold">{goalAmt}</div>
              <div className="text-sm text-muted-foreground mb-0.5">/ {goalTarget}</div>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5 mt-2">
              <div
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  goalPct >= 100 ? "bg-green-500" : "bg-blue-500"
                )}
                style={{ width: `${goalPct}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{goalPct}% today</p>
            <Link href="/reading-goal">
              <Button variant="link" className="px-0 h-auto text-xs mt-1 text-primary">View history →</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Brain className="w-4 h-4 mr-2 text-purple-500" />
              Hard Ayahs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.hardAyahsDueToday || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Due for review today</p>
            {(dashboard?.hardAyahsDueToday ?? 0) > 0 && (
              <Link href="/memorization" className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-2 inline-block">
                Review now →
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Activity Heatmap ── */}
      <ReadingHeatmap isSignedIn={!!isSignedIn} />

      {/* ── Reading Time Estimator ── */}
      <div className="mb-8">
        <Card className="border-teal-500/20 bg-teal-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-teal-600" />
              Reading Time Estimator
            </CardTitle>
            <CardDescription>Based on your last 30 days of activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8 flex-wrap">
              <div>
                <p className="text-3xl font-bold text-teal-700 dark:text-teal-400">
                  {estimatedDays != null ? estimatedDays.toLocaleString() : "—"}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {estimatedDays != null ? "days to complete the Quran" : "Set a daily goal to get an estimate"}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                <span>
                  {avgDailyAyahs > 0
                    ? `Average ${avgDailyAyahs} ayahs/day · ${6236 - (dashboard?.memorizationOverview?.totalMemorized ?? 0)} remaining`
                    : "No activity recorded in the last 30 days"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.recentNotes")}</CardTitle>
              <CardDescription>{t("dashboard.latestReflections")}</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboard?.recentNotes && dashboard.recentNotes.length > 0 ? (
                <div className="space-y-4">
                  {dashboard.recentNotes.map(note => (
                    <div key={note.id} className="p-4 rounded-xl bg-muted/50 border border-border">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{note.surahNameEn || `Surah ${note.surahId}`} • Ayah {note.ayahNumber}</span>
                        <span className="text-xs text-muted-foreground">{new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-foreground/80 line-clamp-2">{note.content}</p>
                    </div>
                  ))}
                  <Link href="/notes" className="text-sm text-primary font-medium inline-block mt-2">{t("dashboard.viewAllNotes")}</Link>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  <p>{t("dashboard.noNotes")}</p>
                  <Link href="/reader" className="text-sm text-primary font-medium mt-2 inline-block">{t("dashboard.startReading")}</Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.memorization")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t("dashboard.totalProgress")}</span>
                    <span className="font-medium">{dashboard?.memorizationOverview?.percentage.toFixed(1) || 0}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${dashboard?.memorizationOverview?.percentage || 0}%` }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-right">
                    {dashboard?.memorizationOverview?.totalMemorized || 0} / {dashboard?.memorizationOverview?.totalAyahs || 6236} Ayahs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-primary" />
                {t("dashboard.quickLinks")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/bookmarks" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5">
                <Bookmark className="w-4 h-4" />
                {t("dashboard.viewAllBookmarks")}
              </Link>
              <Link href="/memorization" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5">
                <Brain className="w-4 h-4" />
                {t("dashboard.memorizationTracker")}
              </Link>
              <Link href="/notes" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5">
                <FileText className="w-4 h-4" />
                {t("dashboard.myNotes")}
              </Link>
              <div className="h-px bg-border/60 my-1" />
              <Link href="/plans" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5">
                <CalendarDays className="w-4 h-4 text-teal-600" />
                {t("dashboard.readingPlans")}
              </Link>
              <Link href="/analytics" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5">
                <TrendingUp className="w-4 h-4 text-primary" />
                {t("dashboard.analytics")}
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
