import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useSEO } from "@/lib/seo";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SignInPrompt } from "@/components/sign-in-prompt";
import { Brain, AlertCircle, BookMarked, CheckCircle2, Loader2, Trophy } from "lucide-react";
import { useGetMemorizationProgress, useGetHardAyahs, useGetSurahMemorizationStats, useGetKhatmHistory, useLogKhatm } from "@workspace/api-client-react";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const RECITER_NAMES: Record<string, string> = {
  '7': 'Mishary Rashid Alafasy',
  '1': 'AbdulBaset AbdulSamad',
  '2': 'Mahmoud Khalil Al-Husary',
  '9': 'Abdur-Rahman as-Sudais',
  '5': "Sa'd Al-Ghamdi",
  '3': 'Mohamed Siddiq El-Minshawi',
};

export default function MemorizationPage() {
  useSEO("Memorization Tracker", "Track your Quran memorization progress. Use spaced repetition to review hard ayahs and build a consistent hifz practice.");
  const { isSignedIn, isLoaded } = useAuth();
  const [, setLocation] = useLocation();
  const { activeReciter } = useAppStore();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [khatmDialogOpen, setKhatmDialogOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: stats } = useGetSurahMemorizationStats({ query: { enabled: !!isSignedIn } as any });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: hardAyahs } = useGetHardAyahs({ query: { enabled: !!isSignedIn } as any });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: khatmHistory, refetch: refetchKhatm } = useGetKhatmHistory({ query: { enabled: !!isSignedIn } as any });
  const logKhatm = useLogKhatm();

  if (isLoaded && !isSignedIn) {
    return <SignInPrompt title="Sign in to track memorization" description="Track your Quran memorization, flag hard ayahs for review, and build a daily habit." />;
  }

  const handleLogKhatm = async () => {
    try {
      await logKhatm.mutateAsync({ data: { reciterUsed: RECITER_NAMES[activeReciter] ?? activeReciter } });
      refetchKhatm();
      setKhatmDialogOpen(false);
      toast({ title: "Khatm recorded! 🎉", description: "May Allah accept your recitation." });
    } catch {
      toast({ title: "Failed to record khatm", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("memorization.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("memorization.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setHistoryOpen(true)}
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            {t("memorization.khatmHistory")}
            {khatmHistory && khatmHistory.length > 0 && (
              <span className="ml-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs px-1.5 py-0.5 rounded-full font-medium">
                {khatmHistory.length}
              </span>
            )}
          </Button>
          <Button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => setKhatmDialogOpen(true)}
          >
            <CheckCircle2 className="w-4 h-4" />
            {t("memorization.completeQuran")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("memorization.surahProgress")}</CardTitle>
              <CardDescription>{t("memorization.progressDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              {stats && stats.length > 0 ? (
                <div className="space-y-4">
                  {stats.map(stat => (
                    <div key={stat.surahId} className="flex items-center gap-4">
                      <div className="w-12 text-center font-medium">{stat.surahId}</div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1 text-sm">
                          <span>{stat.surahName}</span>
                          <span className="text-muted-foreground">{stat.memorizedCount} / {stat.totalAyahs}</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className={cn(
                              "h-2 rounded-full transition-all",
                              stat.memorizedCount === stat.totalAyahs ? "bg-green-500" : "bg-primary"
                            )}
                            style={{ width: `${(stat.memorizedCount / stat.totalAyahs) * 100}%` }}
                          />
                        </div>
                      </div>
                      {stat.memorizedCount === stat.totalAyahs && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-xl">
                  <Brain className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  <p>{t("memorization.noAyahsMemo")}</p>
                  <Button variant="outline" className="mt-4" onClick={() => setLocation('/reader')}>{t("memorization.goToReader")}</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-orange-500/20 bg-orange-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                <AlertCircle className="w-5 h-5" />
                {t("memorization.hardAyahs")}
              </CardTitle>
              <CardDescription>{t("memorization.hardAyahsDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              {hardAyahs && hardAyahs.length > 0 ? (
                <div className="space-y-3">
                  {hardAyahs.map(ayah => (
                    <div key={ayah.id} className="p-3 bg-background rounded-lg border border-border flex justify-between items-center">
                      <div>
                        <p className="font-medium">{ayah.surahNameEn}</p>
                        <p className="text-sm text-muted-foreground">Ayah {ayah.ayahNumber}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setLocation(`/reader?surah=${ayah.surahId}&ayah=${ayah.ayahNumber}`)}
                      >
                        {t("memorization.review")}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">{t("memorization.noHardAyahs")}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Complete Quran confirmation dialog ── */}
      <Dialog open={khatmDialogOpen} onOpenChange={setKhatmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-green-600" />
              {t("memorization.recordKhatm")}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center space-y-3">
            <div className="text-5xl">🎉</div>
            <p className="text-foreground font-medium">{t("memorization.alhamdulillah")}</p>
            <p className="text-sm text-muted-foreground">
              This will log your completion with today's date and your current reciter ({RECITER_NAMES[activeReciter] ?? activeReciter}).
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setKhatmDialogOpen(false)}>{t("common.cancel")}</Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white gap-2"
              onClick={handleLogKhatm}
              disabled={logKhatm.isPending}
            >
              {logKhatm.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Record Khatm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Khatm history dialog ── */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              {t("memorization.khatmHistory")}
            </DialogTitle>
          </DialogHeader>
          {khatmHistory && khatmHistory.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto py-2">
              {khatmHistory.map((entry, i) => (
                <div key={entry.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center text-amber-600 font-bold text-sm">
                      {khatmHistory.length - i}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{new Date(entry.completedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                      {entry.reciterUsed && (
                        <p className="text-xs text-muted-foreground">{entry.reciterUsed}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-lg">🎉</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm">{t("memorization.noKhatm")}</p>
              <p className="text-xs mt-1">{t("memorization.clickToRecord")}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
