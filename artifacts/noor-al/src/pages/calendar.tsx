import { useState, useMemo } from "react";
import { useSEO } from "@/lib/seo";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, BookOpen, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { JUZ_MAP } from "@/lib/quran-api";

type PlanType = "30day" | "1year";

/* ── Juz → surah/ayah start positions ─────────────────────────── */
const JUZ_STARTS = JUZ_MAP.map(j => ({ juz: j.juz, surah: j.surah, ayah: j.ayah, name: j.name }));

/* ── 30-day plan: 1 Juz per day ──────────────────────────────── */
function get30DayAssignment(dayOfYear: number): { label: string; surah: number; ayah: number } {
  const juzIndex = (dayOfYear - 1) % 30;
  const juz = JUZ_STARTS[juzIndex] ?? JUZ_STARTS[0];
  return { label: `Juz ${juz.juz}`, surah: juz.surah, ayah: juz.ayah };
}

/* ── 1-year plan: ~1.65 pages/day, 604 pages total ───────────── */
function get1YearAssignment(dayOfYear: number): { label: string; surah: number; ayah: number } {
  const pagesPerDay = 604 / 365;
  const pageStart = Math.floor((dayOfYear - 1) * pagesPerDay) + 1;
  const pageEnd = Math.min(604, Math.floor(dayOfYear * pagesPerDay));
  // Approximate: map page to juz (each juz ≈ 20 pages)
  const juzIndex = Math.min(29, Math.floor((pageStart - 1) / (604 / 30)));
  const juz = JUZ_STARTS[juzIndex] ?? JUZ_STARTS[0];
  return {
    label: `Pages ${pageStart}–${pageEnd}`,
    surah: juz.surah,
    ayah: juz.ayah,
  };
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay(); // 0=Sun
}

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function CalendarPage() {
  useSEO("Quranic Calendar", "Your daily Quran reading schedule. Follow a 30-day or 1-year completion plan with daily assignments.");
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const today = useMemo(() => new Date(), []);
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [plan, setPlan] = useState<PlanType>("30day");

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const cells = useMemo(() => {
    const result: { day: number | null; assignment: { label: string; surah: number; ayah: number } | null; isToday: boolean; isPast: boolean }[] = [];
    // leading empties
    for (let i = 0; i < firstDay; i++) result.push({ day: null, assignment: null, isToday: false, isPast: false });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(viewYear, viewMonth, d);
      const doy = getDayOfYear(date);
      const assignment = plan === "30day" ? get30DayAssignment(doy) : get1YearAssignment(doy);
      const isToday = d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      result.push({ day: d, assignment, isToday, isPast });
    }
    return result;
  }, [viewYear, viewMonth, plan, firstDay, daysInMonth, today]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const todayAssignment = plan === "30day" ? get30DayAssignment(getDayOfYear(today)) : get1YearAssignment(getDayOfYear(today));

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-primary" />
            {t("calendar.title")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("calendar.subtitle")}</p>
        </div>
        <Select value={plan} onValueChange={(v) => setPlan(v as PlanType)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30day">Complete in 30 Days</SelectItem>
            <SelectItem value="1year">Complete in 1 Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Today's assignment banner */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="py-4 px-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{t("calendar.todayReading")}</p>
              <p className="font-semibold text-foreground">{todayAssignment.label}</p>
            </div>
          </div>
          <Button
            onClick={() => navigate(`/reader?surah=${todayAssignment.surah}&ayah=${todayAssignment.ayah}`)}
            className="gap-2"
          >
            <BookOpen className="w-4 h-4" />
            {t("calendar.readNow")}
          </Button>
        </CardContent>
      </Card>

      {/* Calendar grid */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-2">
            {WEEKDAYS.map(d => (
              <div key={d} className="text-center text-[11px] font-semibold uppercase text-muted-foreground py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((cell, i) => (
              <div key={i}>
                {cell.day === null ? (
                  <div className="aspect-square" />
                ) : (
                  <button
                    onClick={() => cell.assignment && navigate(`/reader?surah=${cell.assignment.surah}&ayah=${cell.assignment.ayah}`)}
                    className={cn(
                      "w-full aspect-square rounded-lg p-1 flex flex-col items-center justify-start text-left transition-all hover:bg-primary/10 hover:scale-105",
                      cell.isToday && "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 ring-2 ring-primary ring-offset-1",
                      cell.isPast && !cell.isToday && "opacity-50",
                    )}
                  >
                    <span className={cn(
                      "text-xs font-bold leading-none mb-1",
                      cell.isToday ? "text-primary-foreground" : "text-foreground"
                    )}>
                      {cell.day}
                    </span>
                    <span className={cn(
                      "text-[8px] leading-tight text-center hidden sm:block",
                      cell.isToday ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      {cell.assignment?.label}
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Plan info */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { type: "30day" as PlanType, title: "30-Day Plan", desc: "Complete the entire Quran in one month. Read 1 Juz (roughly 20 pages) every day.", badge: "1 Juz/day" },
          { type: "1year" as PlanType, title: "1-Year Plan", desc: "Complete the Quran in a year at a gentle pace. About 1.65 pages per day.", badge: "~2 pages/day" },
        ].map(p => (
          <Card
            key={p.type}
            className={cn("cursor-pointer transition-all", plan === p.type && "border-primary/40 bg-primary/5")}
            onClick={() => setPlan(p.type)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">{p.title}</p>
                <Badge variant={plan === p.type ? "default" : "outline"} className="text-xs">{p.badge}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
