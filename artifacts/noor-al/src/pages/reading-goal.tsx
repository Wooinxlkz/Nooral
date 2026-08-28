import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useSEO } from "@/lib/seo";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SignInPrompt } from "@/components/sign-in-prompt";
import { useGetGoal, useSaveGoal, useGetGoalProgressHistory } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Target, CheckCircle2, TrendingUp, BookOpen, FileText, Layers, ChevronRight, Pencil, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

/* ── Goal type options ─────────────────────────────────────────── */
const GOAL_TYPES = [
  { value: "ayahs" as const, label: "Ayahs per day", icon: BookOpen, desc: "Read a set number of verses daily", suggestions: [5, 10, 20, 50] },
  { value: "pages" as const, label: "Pages per day", icon: FileText, desc: "Read a set number of Mushaf pages", suggestions: [1, 2, 4, 8] },
  { value: "juz" as const, label: "Juz per week", icon: Layers, desc: "Complete one or more Juz each week", suggestions: [1, 2, 3, 7] },
];

/* ── Weekly bar chart ─────────────────────────────────────────── */
function WeeklyChart({ history, target }: { history: { date: string; amountRead: number; goalMet: boolean }[]; target: number }) {
  const weeks: { label: string; days: { date: string; amount: number; met: boolean }[] }[] = [];
  const now = new Date();

  for (let w = 3; w >= 0; w--) {
    const days: { date: string; amount: number; met: boolean }[] = [];
    const labels = ["4 wks ago", "3 wks ago", "2 wks ago", "This week"];
    for (let d = 6; d >= 0; d--) {
      const day = new Date(now);
      day.setDate(now.getDate() - w * 7 - d);
      const dateStr = day.toISOString().split("T")[0];
      const record = history.find(h => h.date === dateStr);
      days.push({ date: dateStr, amount: record?.amountRead ?? 0, met: record?.goalMet ?? false });
    }
    const weekTotal = days.reduce((s, d) => s + d.amount, 0);
    const daysMetCount = days.filter(d => d.met).length;
    weeks.push({ label: labels[3 - w], days });
    void weekTotal; void daysMetCount;
  }

  const maxVal = Math.max(target, ...history.map(h => h.amountRead), 1);

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        {weeks.map((week) => {
          const total = week.days.reduce((s, d) => s + d.amount, 0);
          const metDays = week.days.filter(d => d.met).length;
          const pct = Math.min(100, (total / (target * 7)) * 100);
          return (
            <div key={week.label} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex gap-0.5 items-end h-24">
                {week.days.map((day) => {
                  const h = Math.max(4, (day.amount / maxVal) * 96);
                  const today = day.date === now.toISOString().split("T")[0];
                  return (
                    <div
                      key={day.date}
                      title={`${day.date}: ${day.amount}`}
                      className={cn(
                        "flex-1 rounded-t-sm transition-all",
                        day.met ? "bg-primary" : day.amount > 0 ? "bg-primary/40" : "bg-muted",
                        today && "ring-1 ring-primary"
                      )}
                      style={{ height: `${h}px` }}
                    />
                  );
                })}
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-foreground">{metDays}/7 days</p>
                <p className="text-[10px] text-muted-foreground">{week.label}</p>
              </div>
              <div className="w-full bg-muted rounded-full h-1">
                <div className="bg-primary h-1 rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground justify-center">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" /> Goal met</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-primary/40 inline-block" /> Partial</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-muted inline-block" /> No reading</span>
      </div>
    </div>
  );
}

/* ── Wizard step 1: pick type ─────────────────────────────────── */
function PickTypeStep({ onSelect }: { onSelect: (type: "ayahs" | "pages" | "juz") => void }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground mb-4">What do you want to track each day?</p>
      {GOAL_TYPES.map(({ value, label, icon: Icon, desc }) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{label}</p>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
        </button>
      ))}
    </div>
  );
}

/* ── Wizard step 2: pick amount ───────────────────────────────── */
function PickAmountStep({
  goalType, onBack, onSave, saving,
}: {
  goalType: "ayahs" | "pages" | "juz";
  onBack: () => void;
  onSave: (amount: number) => void;
  saving: boolean;
}) {
  const meta = GOAL_TYPES.find(g => g.value === goalType)!;
  const [amount, setAmount] = useState<number>(meta.suggestions[1]);
  const [custom, setCustom] = useState("");

  const finalAmount = custom ? parseInt(custom, 10) : amount;
  const valid = !isNaN(finalAmount) && finalAmount >= 1 && finalAmount <= 9999;

  function estimateLabel() {
    if (goalType === "ayahs") {
      const days = Math.ceil(6236 / finalAmount);
      return `~${days} days to complete the Quran`;
    }
    if (goalType === "pages") {
      const days = Math.ceil(604 / finalAmount);
      return `~${days} days to complete the Quran`;
    }
    const weeks = Math.ceil(30 / finalAmount);
    return `~${weeks} weeks to complete the Quran`;
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">How many <strong>{goalType}</strong> per day?</p>
      <div className="flex flex-wrap gap-2">
        {meta.suggestions.map(s => (
          <button
            key={s}
            onClick={() => { setAmount(s); setCustom(""); }}
            className={cn(
              "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
              amount === s && !custom ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/60"
            )}
          >
            {s}
          </button>
        ))}
        <input
          type="number"
          min={1}
          max={9999}
          placeholder="Custom…"
          value={custom}
          onChange={e => setCustom(e.target.value)}
          className="w-24 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      {valid && finalAmount >= 1 && (
        <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
          📅 {estimateLabel()}
        </p>
      )}
      <div className="flex gap-2 pt-2">
        <Button variant="ghost" onClick={onBack} disabled={saving}>Back</Button>
        <Button onClick={() => onSave(finalAmount)} disabled={!valid || saving} className="flex-1">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Set My Goal
        </Button>
      </div>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────────── */
export default function ReadingGoalPage() {
  useSEO("Reading Goal", "Set your daily Quran reading goal, track weekly progress, and build consistency.");
  const { isSignedIn, isLoaded } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [wizardType, setWizardType] = useState<"ayahs" | "pages" | "juz" | null>(null);
  const [editMode, setEditMode] = useState(false);

  const saveGoalMutation = useSaveGoal();
  const saving = saveGoalMutation.isPending;

  const {
    data: goal,
    isLoading: goalLoading,
    isError: goalError,
    refetch: refetchGoal,
  } = useGetGoal({ query: { enabled: !!isSignedIn, retry: false } as any });

  const {
    data: history = [],
    isLoading: histLoading,
  } = useGetGoalProgressHistory({ query: { enabled: !!isSignedIn } as any });

  if (!isLoaded) return null;
  if (!isSignedIn) {
    return <SignInPrompt title="Sign in to set a reading goal" description="Track your daily Quran reading and build a consistent habit." />;
  }

  async function handleSaveGoal(goalType: "ayahs" | "pages" | "juz", targetAmount: number) {
    try {
      await saveGoalMutation.mutateAsync({ data: { goalType, targetAmount } });
      toast({ title: "Goal saved ✓" });
      setWizardType(null);
      setEditMode(false);
      refetchGoal();
    } catch {
      toast({ title: "Failed to save goal", variant: "destructive" });
    }
  }

  const hasGoal = !goalError && goal != null;
  const showWizard = !hasGoal || editMode;

  const todayHistory = history.find(h => h.date === new Date().toISOString().split("T")[0]);
  const todayAmount = todayHistory?.amountRead ?? 0;
  const todayMet = todayHistory?.goalMet ?? false;
  const goalTarget = goal?.targetAmount ?? 1;
  const goalTypeMeta = GOAL_TYPES.find(g => g.value === goal?.goalType);
  const todayPct = Math.min(100, goal ? Math.round((todayAmount / goalTarget) * 100) : 0);

  const daysMetLast30 = history.filter(h => h.goalMet).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            Reading Goal
          </h1>
          <p className="text-muted-foreground mt-1">
            {hasGoal ? "Track your daily Quran reading habit" : "Set a daily goal to build consistency"}
          </p>
        </div>
        {hasGoal && !editMode && (
          <Button variant="outline" size="sm" className="gap-2 shrink-0" onClick={() => setEditMode(true)}>
            <Pencil className="w-3.5 h-3.5" /> Edit Goal
          </Button>
        )}
      </div>

      {/* ── Wizard ── */}
      {showWizard && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {editMode ? "Change Your Goal" : "Set Your Daily Goal"}
            </CardTitle>
            <CardDescription>
              {wizardType ? "Choose your daily target" : "Pick what you'd like to track"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!wizardType ? (
              <PickTypeStep onSelect={setWizardType} />
            ) : (
              <PickAmountStep
                goalType={wizardType}
                onBack={() => setWizardType(null)}
                onSave={(amount) => handleSaveGoal(wizardType, amount)}
                saving={saving}
              />
            )}
            {editMode && !wizardType && (
              <Button variant="ghost" className="mt-3" onClick={() => { setEditMode(false); setWizardType(null); }}>
                Cancel
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Current goal stats ── */}
      {hasGoal && !showWizard && (
        <>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Card>
              <CardContent className="pt-5 pb-4 text-center">
                <div className="text-2xl font-bold text-primary">{todayAmount}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  / {goalTarget} {goalTypeMeta?.label.split(" ")[0]}
                </div>
                <p className="text-xs font-medium mt-1">Today</p>
                {todayMet && <Badge className="mt-1.5 text-[10px] py-0" variant="default">✓ Done</Badge>}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4 text-center">
                <div className="text-2xl font-bold">{daysMetLast30}</div>
                <div className="text-xs text-muted-foreground mt-0.5">/ 30 days</div>
                <p className="text-xs font-medium mt-1">Goals Met</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4 text-center">
                <div className="text-2xl font-bold">
                  {goal?.goalType === "ayahs"
                    ? Math.max(0, Math.ceil(6236 / goalTarget) - Math.floor(history.reduce((s, h) => s + h.amountRead, 0) / goalTarget))
                    : goal?.goalType === "pages"
                    ? Math.max(0, Math.ceil(604 / goalTarget) - Math.floor(history.reduce((s, h) => s + h.amountRead, 0) / goalTarget))
                    : "—"
                  }
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">days est.</div>
                <p className="text-xs font-medium mt-1">To Complete</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Today's Progress</CardTitle>
                <Badge variant={todayMet ? "default" : "secondary"}>
                  {todayPct}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Progress value={todayPct} className="h-2.5" />
              <p className="text-sm text-muted-foreground">
                {todayMet
                  ? "🎉 You've met today's goal!"
                  : `${goalTarget - todayAmount > 0 ? goalTarget - todayAmount : 0} more ${goal?.goalType} to reach your goal today`
                }
              </p>
              <Link href="/reader">
                <Button className="w-full gap-2" variant={todayMet ? "outline" : "default"}>
                  <BookOpen className="w-4 h-4" />
                  {todayMet ? "Continue Reading" : "Start Reading Now"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </>
      )}

      {/* ── Goal loading ── */}
      {goalLoading && (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading your goal…
        </div>
      )}

      {/* ── History chart ── */}
      {hasGoal && !showWizard && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              4-Week History
            </CardTitle>
            <CardDescription>
              Each bar = one day. Full color = goal met. Light = partial progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {histLoading ? (
              <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading history…
              </div>
            ) : (
              <WeeklyChart history={history} target={goalTarget} />
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Streak tip ── */}
      {hasGoal && daysMetLast30 >= 7 && (
        <div className="mt-4 flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
          <p className="text-sm">You've met your goal on <strong>{daysMetLast30}</strong> of the last 30 days — مَا شَاءَ ٱللَّهُ!</p>
        </div>
      )}
    </div>
  );
}
