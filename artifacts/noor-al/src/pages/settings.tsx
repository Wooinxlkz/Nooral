import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/lib/store";
import { useSEO } from "@/lib/seo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/lib/auth";
import { useGetGoal, useSaveGoal } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { TRANSLATIONS_LIST, RECITERS_LIST, ARABIC_FONTS, useReciters } from "@/lib/quran-api";
import { Loader2, Check, ChevronDown, Languages, Bell, BellOff } from "lucide-react";
import { cn } from "@/lib/utils";
import i18n, { LANGUAGES } from "@/lib/i18n";

/* ── Multi-translation picker ─────────────────────────────────── */
const byLanguage: Record<string, typeof TRANSLATIONS_LIST> = {};
for (const tr of TRANSLATIONS_LIST) {
  if (!byLanguage[tr.language]) byLanguage[tr.language] = [];
  byLanguage[tr.language].push(tr);
}

function TranslationPicker({ selected, onChange }: { selected: number[]; onChange: (ids: number[]) => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const toggle = (id: number) => {
    if (selected.includes(id)) {
      if (selected.length > 1) onChange(selected.filter(x => x !== id));
    } else {
      if (selected.length < 3) onChange([...selected, id]);
    }
  };

  const label = selected.length === 1
    ? (TRANSLATIONS_LIST.find(tr => tr.id === selected[0])?.name ?? `Translation ${selected[0]}`)
    : t("settings.translationsSelected", { n: selected.length });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between font-normal" role="combobox">
          <span className="flex items-center gap-2 truncate">
            <Languages className="w-4 h-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{label}</span>
          </span>
          <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <div className="max-h-[340px] overflow-y-auto p-2 space-y-3">
          {Object.entries(byLanguage).map(([lang, list]) => (
            <div key={lang}>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">{lang}</p>
              <div className="space-y-0.5">
                {list.map(tr => {
                  const isSelected = selected.includes(tr.id);
                  const isDisabled = !isSelected && selected.length >= 3;
                  return (
                    <button
                      key={tr.id}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-sm transition-colors",
                        isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted/60",
                        isDisabled && "opacity-40 cursor-not-allowed"
                      )}
                      onClick={() => !isDisabled && toggle(tr.id)}
                      disabled={isDisabled}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors",
                        isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
                      )}>
                        {isSelected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                      </div>
                      <div className="min-w-0">
                        <span className="font-medium">{tr.name}</span>
                        <span className="text-xs text-muted-foreground ml-1.5">{tr.author}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border px-3 py-2 text-[10px] text-muted-foreground">
          {t("settings.upTo3Desc")}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function SettingsPage() {
  const { t } = useTranslation();
  useSEO("Settings", "Customize your NoorAl experience — choose your theme, Arabic font size, preferred translation, and Quran reciter.");
  const {
    theme, setTheme,
    arabicFont, setArabicFont,
    arabicFontSize, setArabicFontSize,
    translationFontSize, setTranslationFontSize,
    showTransliteration, setShowTransliteration,
    showWordByWord, setShowWordByWord,
    activeTranslations, setTranslations,
    activeReciter, setReciter,
    readerLayout, setReaderLayout,
    prayerMethod, setPrayerMethod,
    dailyGoalTarget, setDailyGoalTarget,
  } = useAppStore();

  const { data: liveReciters } = useReciters();
  const reciterOptions = liveReciters
    ? liveReciters.map((r) => ({ id: String(r.id), name: r.name }))
    : RECITERS_LIST;

  const { isSignedIn } = useAuth();
  const { toast } = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: goalData } = useGetGoal({ query: { enabled: !!isSignedIn } as any });
  const saveGoal = useSaveGoal();

  const [goalInput, setGoalInput] = useState<string>("");
  const [savingGoal, setSavingGoal] = useState(false);

  /* ── Language ──────────────────────────────────────────────── */
  const [activeLang, setActiveLang] = useState<string>(i18n.language ?? "en");
  const handleLangChange = useCallback((lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("noor-lang", lang);
    setActiveLang(lang);
    const RTL = new Set(["ar", "ur", "fa"]);
    document.documentElement.dir = RTL.has(lang) ? "rtl" : "ltr";
  }, []);

  /* ── Notifications ─────────────────────────────────────────── */
  const [reminderEnabled, setReminderEnabled] = useState(() => {
    return localStorage.getItem("noor-reminder-enabled") === "true";
  });
  const [reminderTime, setReminderTime] = useState(() => {
    return localStorage.getItem("noor-reminder-time") ?? "07:00";
  });
  const [swStatus, setSwStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle");
  const swSupported = typeof window !== "undefined" && "serviceWorker" in navigator && "Notification" in window;

  useEffect(() => {
    if (!swSupported || !reminderEnabled) return;
    navigator.serviceWorker.ready.then((reg) => {
      reg.active?.postMessage({
        type: "SCHEDULE_REMINDER",
        time: reminderTime,
        streak: 0,
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleReminder = async (enabled: boolean) => {
    if (enabled) {
      if (!swSupported) {
        toast({ title: t("settings.toastNotifNotSupported"), variant: "destructive" });
        return;
      }
      setSwStatus("requesting");
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        setSwStatus("denied");
        toast({ title: t("settings.toastPermDenied"), variant: "destructive" });
        return;
      }
      setSwStatus("granted");
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        await reg.update();
        reg.active?.postMessage({
          type: "SCHEDULE_REMINDER",
          time: reminderTime,
          streak: 0,
        });
      } catch {
        toast({ title: t("settings.toastReminderFailed"), variant: "destructive" });
        return;
      }
    } else {
      navigator.serviceWorker.ready.then((reg) => {
        reg.active?.postMessage({ type: "CANCEL_REMINDER" });
      }).catch(() => {});
    }
    setReminderEnabled(enabled);
    localStorage.setItem("noor-reminder-enabled", String(enabled));
    if (enabled) {
      toast({ title: t("settings.toastReminderSet"), description: t("settings.toastReminderSetDesc", { time: reminderTime }) });
    } else {
      toast({ title: t("settings.toastReminderCancelled") });
    }
  };

  const handleTimeChange = (newTime: string) => {
    setReminderTime(newTime);
    localStorage.setItem("noor-reminder-time", newTime);
    if (reminderEnabled) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.active?.postMessage({ type: "SCHEDULE_REMINDER", time: newTime, streak: 0 });
      }).catch(() => {});
    }
  };

  const effectiveGoal = goalData?.targetAmount ?? dailyGoalTarget;

  const handleSaveGoal = async () => {
    const n = parseInt(goalInput);
    if (!n || n < 1 || n > 500) {
      toast({ title: t("settings.toastInvalidGoal"), variant: "destructive" });
      return;
    }
    setSavingGoal(true);
    try {
      if (isSignedIn) {
        await saveGoal.mutateAsync({ data: { goalType: 'ayahs', targetAmount: n } });
      }
      setDailyGoalTarget(n);
      setGoalInput("");
      toast({ title: t("settings.toastGoalUpdated") });
    } catch {
      toast({ title: t("settings.toastGoalFailed"), variant: "destructive" });
    } finally {
      setSavingGoal(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t("settings.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("settings.subtitle")}</p>
      </div>

      {/* ── Appearance ── */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.appearance")}</CardTitle>
          <CardDescription>{t("settings.appearanceDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>{t("settings.theme")}</Label>
            <RadioGroup value={theme} onValueChange={(v: any) => setTheme(v)} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="theme-light" />
                <Label htmlFor="theme-light">{t("settings.light")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="theme-dark" />
                <Label htmlFor="theme-dark">{t("settings.dark")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sepia" id="theme-sepia" />
                <Label htmlFor="theme-sepia">{t("settings.sepia")}</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>{t("settings.readerLayout")}</Label>
            <RadioGroup value={readerLayout} onValueChange={(v: any) => setReaderLayout(v)} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="stacked" id="layout-stacked" />
                <Label htmlFor="layout-stacked">{t("settings.stacked")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="side-by-side" id="layout-side" />
                <Label htmlFor="layout-side">{t("settings.sideBySide")}</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* ── Reading Preferences ── */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.readingPreferences")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>{t("settings.arabicFont")}</Label>
            <div className="grid grid-cols-2 gap-2">
              {ARABIC_FONTS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setArabicFont(f.id)}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-lg border px-3 py-2.5 text-left transition-colors",
                    arabicFont === f.id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-muted-foreground/40 hover:bg-muted/40"
                  )}
                >
                  <span className="text-xs font-medium">{f.name}</span>
                  <span
                    className="text-base leading-relaxed text-foreground"
                    style={{ fontFamily: f.family }}
                    dir="rtl"
                  >
                    بِسۡمِ ٱللَّهِ
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>{t("settings.arabicFontSize")}</Label>
              <span className="text-sm text-muted-foreground">{arabicFontSize}px</span>
            </div>
            <Slider
              value={[arabicFontSize]}
              min={24} max={64} step={2}
              onValueChange={(val) => setArabicFontSize(val[0])}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>{t("settings.translationFontSize")}</Label>
              <span className="text-sm text-muted-foreground">{translationFontSize}px</span>
            </div>
            <Slider
              value={[translationFontSize]}
              min={14} max={32} step={1}
              onValueChange={(val) => setTranslationFontSize(val[0])}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <Label>{t("settings.showTransliteration")}</Label>
              <p className="text-sm text-muted-foreground">{t("settings.transliterationDesc")}</p>
            </div>
            <Switch
              checked={showTransliteration}
              onCheckedChange={setShowTransliteration}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <Label>{t("settings.wordByWord")}</Label>
              <p className="text-sm text-muted-foreground">{t("settings.wordByWordDesc")}</p>
            </div>
            <Switch
              checked={showWordByWord}
              onCheckedChange={setShowWordByWord}
            />
          </div>

          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between">
              <Label>{t("settings.translations")}</Label>
              <span className="text-xs text-muted-foreground">{t("settings.upTo3")}</span>
            </div>
            <TranslationPicker selected={activeTranslations} onChange={setTranslations} />
          </div>
        </CardContent>
      </Card>

      {/* ── Daily Reading Goal ── */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.dailyGoal")}</CardTitle>
          <CardDescription>{t("settings.dailyGoalDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-3xl font-bold text-primary">{effectiveGoal}</p>
              <p className="text-sm text-muted-foreground">{t("settings.ayahsPerDay")}</p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={500}
                placeholder={t("settings.newGoal")}
                value={goalInput}
                onChange={e => setGoalInput(e.target.value)}
                className="w-28"
                onKeyDown={e => e.key === "Enter" && handleSaveGoal()}
              />
              <Button onClick={handleSaveGoal} disabled={savingGoal || !goalInput}>
                {savingGoal ? <Loader2 className="w-4 h-4 animate-spin" /> : t("common.save")}
              </Button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[10, 20, 50, 100, 114].map(preset => (
              <Button
                key={preset}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setGoalInput(preset.toString())}
              >
                {preset} {t("common.ayahs")}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Audio Settings ── */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.audio")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Label>{t("settings.preferredReciter")}</Label>
            <Select value={activeReciter} onValueChange={(v: any) => setReciter(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reciterOptions.map(r => (
                  <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ── Prayer Times ── */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.prayerTimes")}</CardTitle>
          <CardDescription>{t("settings.prayerTimesDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Label>{t("settings.calculationMethod")}</Label>
            <Select value={String(prayerMethod)} onValueChange={v => setPrayerMethod(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">ISNA — Islamic Society of North America</SelectItem>
                <SelectItem value="1">Karachi — Univ. of Islamic Sciences (South Asia)</SelectItem>
                <SelectItem value="3">MWL — Muslim World League (Europe)</SelectItem>
                <SelectItem value="4">Umm al-Qura — Makkah (Gulf &amp; Saudi Arabia)</SelectItem>
                <SelectItem value="5">Egyptian — Egyptian General Authority</SelectItem>
                <SelectItem value="13">Diyanet — Turkey</SelectItem>
                <SelectItem value="15">Russia — Spiritual Administration of Muslims</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{t("settings.calculationMethodDesc")}</p>
          </div>
        </CardContent>
      </Card>

      {/* ── Language ── */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.interfaceLanguage")}</CardTitle>
          <CardDescription>{t("settings.interfaceLanguageDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLangChange(lang.code)}
                className={cn(
                  "px-4 py-2.5 rounded-lg border text-sm font-medium transition-all",
                  activeLang === lang.code
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:bg-muted/40"
                )}
              >
                <span className="block font-bold">{lang.nativeName}</span>
                <span className="block text-xs text-muted-foreground">{lang.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Daily Reminders ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            {t("settings.reminders")}
          </CardTitle>
          <CardDescription>
            {t("settings.notifications")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {!swSupported && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
              <BellOff className="w-4 h-4 shrink-0" />
              <span>{t("settings.notifNotSupported")}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">{t("settings.enableReminder")}</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                {reminderEnabled
                  ? t("settings.reminderActive", { time: reminderTime })
                  : t("settings.reminderOff")}
              </p>
            </div>
            <Switch
              checked={reminderEnabled}
              onCheckedChange={handleToggleReminder}
              disabled={!swSupported || swStatus === "requesting"}
            />
          </div>
          {reminderEnabled && (
            <div className="space-y-2">
              <Label htmlFor="reminder-time">{t("settings.reminderTimeLabel")}</Label>
              <Input
                id="reminder-time"
                type="time"
                value={reminderTime}
                onChange={e => handleTimeChange(e.target.value)}
                className="w-[140px]"
              />
            </div>
          )}
          {swStatus === "denied" && (
            <p className="text-xs text-destructive flex items-center gap-1.5">
              <BellOff className="w-3.5 h-3.5" />
              {t("settings.permDenied")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
