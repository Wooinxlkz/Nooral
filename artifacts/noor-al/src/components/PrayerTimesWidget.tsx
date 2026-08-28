import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/lib/store";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin, Clock, Globe, CalendarDays,
  Compass, Info, Sunrise, Sunset, Sun, Moon, Star,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RawTimings {
  Fajr: string; Sunrise: string; Dhuhr: string;
  Asr: string;  Maghrib: string; Isha: string;
}

interface PrayerData {
  timings: RawTimings;
  hijriDay: string;
  hijriMonthEn: string;
  hijriMonthAr: string;
  hijriYear: string;
  gregorianDate: string;
  timezone: string;
  methodName: string;
  lat: number; lng: number;
  city: string; country: string;
}

// ─── Prayer definitions ───────────────────────────────────────────────────────

const PRAYER_DEFS = [
  { key: "Fajr",    labelEn: "Fajr",    labelAr: "الفَجْر",   descKey: "prayer.fajrDesc",    sunriseOnly: false },
  { key: "Sunrise", labelEn: "Sunrise",  labelAr: "الشُّرُوق", descKey: "prayer.sunriseDesc", sunriseOnly: true  },
  { key: "Dhuhr",   labelEn: "Dhuhr",   labelAr: "الظُّهْر",  descKey: "prayer.dhuhrDesc",   sunriseOnly: false },
  { key: "Asr",     labelEn: "Asr",     labelAr: "العَصْر",   descKey: "prayer.asrDesc",     sunriseOnly: false },
  { key: "Maghrib", labelEn: "Maghrib", labelAr: "المَغْرِب",  descKey: "prayer.maghribDesc", sunriseOnly: false },
  { key: "Isha",    labelEn: "Isha",    labelAr: "العِشَاء",  descKey: "prayer.ishaDesc",    sunriseOnly: false },
] as const;

type PrayerKey = "Fajr" | "Sunrise" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripOffset(t: string): string {
  return t.replace(/\s*\(.*\)/, "").trim().slice(0, 5);
}

function toMinutes(t: string): number {
  const [h, m] = stripOffset(t).split(":").map(Number);
  return h * 60 + m;
}

function nowMinutes(): number {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
}

function getNextPrayer(timings: RawTimings): { key: PrayerKey; labelEn: string; time: string } {
  const nm = nowMinutes();
  const order: PrayerKey[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  for (const key of order) {
    if (nm < toMinutes(timings[key])) {
      const def = PRAYER_DEFS.find(p => p.key === key)!;
      return { key, labelEn: def.labelEn, time: timings[key] };
    }
  }
  return { key: "Fajr", labelEn: "Fajr", time: timings.Fajr };
}

function getCurrentPrayer(timings: RawTimings): PrayerKey | null {
  const nm = nowMinutes();
  const order: PrayerKey[] = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
  let last: PrayerKey | null = null;
  for (const key of order) {
    if (nm >= toMinutes(timings[key])) last = key;
  }
  return last;
}

function getCountdown(timeStr: string): string {
  const nm = nowMinutes();
  const pm = toMinutes(timeStr);
  let diff = pm - nm;
  if (diff <= 0) diff += 24 * 60;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
}

function calculateQibla(lat: number, lng: number): number {
  const mLat = 21.3891 * (Math.PI / 180);
  const mLng = 39.8579 * (Math.PI / 180);
  const uLat = lat * (Math.PI / 180);
  const dLng = mLng - lng * (Math.PI / 180);
  const y = Math.sin(dLng) * Math.cos(mLat);
  const x = Math.cos(uLat) * Math.sin(mLat) - Math.sin(uLat) * Math.cos(mLat) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function prayerIcon(key: PrayerKey) {
  const cls = "w-3.5 h-3.5";
  switch (key) {
    case "Fajr":    return <Moon    className={cls} />;
    case "Sunrise": return <Sunrise className={cls} />;
    case "Dhuhr":   return <Sun     className={cls} />;
    case "Asr":     return <Sun     className={cls} />;
    case "Maghrib": return <Sunset  className={cls} />;
    case "Isha":    return <Star    className={cls} />;
  }
}

const PRAYER_COLORS: Record<PrayerKey, string> = {
  Fajr:    "text-indigo-400",
  Sunrise: "text-amber-400",
  Dhuhr:   "text-yellow-400",
  Asr:     "text-orange-400",
  Maghrib: "text-rose-400",
  Isha:    "text-purple-400",
};

// ─── Geolocation (browser → IP fallback) ────────────────────────────────────

async function resolveCoords(): Promise<{ lat: number; lng: number; source: "gps" | "ip" }> {
  const fromBrowser = await new Promise<{ lat: number; lng: number } | null>((resolve) => {
    if (!("geolocation" in navigator)) { resolve(null); return; }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude }),
      () => resolve(null),
      { timeout: 6000, maximumAge: 600_000 }
    );
  });
  if (fromBrowser) return { ...fromBrowser, source: "gps" };

  const ipRes = await fetch("https://ip-api.com/json/?fields=status,lat,lon,city,country,timezone");
  const ipData = await ipRes.json();
  if (ipData.status === "success") {
    return { lat: ipData.lat, lng: ipData.lon, source: "ip" };
  }

  throw new Error("Could not determine location");
}

async function fetchPrayerData(lat: number, lng: number, method = 2): Promise<PrayerData> {
  const ts = Math.floor(Date.now() / 1000);
  const [aladhanRes, geoRes] = await Promise.all([
    fetch(`https://api.aladhan.com/v1/timings/${ts}?latitude=${lat}&longitude=${lng}&method=${method}`),
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`),
  ]);
  const aladhan = await aladhanRes.json();
  const geo = await geoRes.json();

  const { timings, date, meta } = aladhan.data;
  const hijri = date.hijri;
  const gregorian = date.gregorian;

  return {
    timings: {
      Fajr:    stripOffset(timings.Fajr),
      Sunrise: stripOffset(timings.Sunrise),
      Dhuhr:   stripOffset(timings.Dhuhr),
      Asr:     stripOffset(timings.Asr),
      Maghrib: stripOffset(timings.Maghrib),
      Isha:    stripOffset(timings.Isha),
    },
    hijriDay:      hijri.day,
    hijriMonthEn:  hijri.month.en,
    hijriMonthAr:  hijri.month.ar,
    hijriYear:     hijri.year,
    gregorianDate: `${gregorian.day} ${gregorian.month.en} ${gregorian.year}`,
    timezone:      meta.timezone || "UTC",
    methodName:    meta.method?.name || "ISNA",
    lat, lng,
    city:    geo.city || geo.locality || geo.principalSubdivision || "",
    country: geo.countryName || "",
  };
}

// ─── Qibla Compass SVG ────────────────────────────────────────────────────────

function QiblaCompass({ bearing }: { bearing: number }) {
  const { t } = useTranslation();
  const ticks = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 15 * Math.PI) / 180;
    const major = i % 6 === 0;
    const r1 = major ? 44 : 47, r2 = 52;
    return { x1: Math.sin(angle)*r1, y1: -Math.cos(angle)*r1, x2: Math.sin(angle)*r2, y2: -Math.cos(angle)*r2, major };
  });

  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="-60 -60 120 120" width="120" height="120" className="drop-shadow-sm">
        <defs>
          <radialGradient id="cg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="0" cy="0" r="57" fill="url(#cg)" />
        <circle cx="0" cy="0" r="57" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
        <circle cx="0" cy="0" r="53" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.5" />
        {ticks.map((tick, i) => (
          <line key={i} x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2}
            stroke="hsl(var(--muted-foreground))" strokeWidth={tick.major ? 1.5 : 0.8} opacity={tick.major ? 1 : 0.4} />
        ))}
        {[{ l:"N",x:0,y:-40 },{ l:"S",x:0,y:44 },{ l:"E",x:44,y:5 },{ l:"W",x:-44,y:5 }].map(c => (
          <text key={c.l} x={c.x} y={c.y} textAnchor="middle" fontSize="8"
            fill="hsl(var(--muted-foreground))" fontFamily="system-ui,sans-serif" fontWeight="600">{c.l}</text>
        ))}
        <g transform={`rotate(${bearing})`}>
          <polygon points="0,-36 3.5,-10 0,-18 -3.5,-10" fill="hsl(var(--primary))" opacity="0.95" />
          <polygon points="0,36 3.5,10 0,18 -3.5,10" fill="hsl(var(--muted-foreground))" opacity="0.5" />
          <rect x="-5" y="-48" width="10" height="10" rx="2"
            fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth="1" />
          <text x="0" y="-41" textAnchor="middle" fontSize="6" fill="hsl(var(--primary-foreground))">🕋</text>
        </g>
        <circle cx="0" cy="0" r="4" fill="hsl(var(--primary))" />
        <circle cx="0" cy="0" r="2" fill="hsl(var(--background))" />
      </svg>
      <div className="text-center">
        <p className="text-xs font-bold text-primary">{t("prayer.fromNorth", { n: Math.round(bearing) })}</p>
        <p className="text-xs text-muted-foreground">{t("prayer.directionOfQibla")}</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PrayerTimesWidget() {
  const { t } = useTranslation();
  const { prayerMethod } = useAppStore();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<PrayerData | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "error" | "ok">("loading");
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(tk => tk + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setLoadState("loading");
    resolveCoords()
      .then(({ lat, lng }) => fetchPrayerData(lat, lng, prayerMethod))
      .then(d => { setData(d); setLoadState("ok"); })
      .catch(() => setLoadState("error"));
  }, [prayerMethod]);

  const next    = data ? getNextPrayer(data.timings)    : null;
  const current = data ? getCurrentPrayer(data.timings) : null;
  const qibla   = data ? calculateQibla(data.lat, data.lng) : 0;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer select-none"
        title={t("prayer.titleAndQibla")}
      >
        <Moon className="w-3.5 h-3.5 shrink-0" />
        {loadState === "loading" && <span className="font-medium">{t("prayer.loadingBtn")}</span>}
        {loadState === "error"   && <span className="font-medium text-muted-foreground/60">{t("prayer.errorBtn")}</span>}
        {loadState === "ok" && next && (
          <>
            <span className="font-medium">{next.labelEn}</span>
            <span className="tabular-nums opacity-70">{next.time}</span>
          </>
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm sm:max-w-md p-0 overflow-hidden gap-0">

          {/* Banner */}
          <div className="bg-gradient-to-br from-primary/90 to-primary px-5 pt-5 pb-4 text-primary-foreground">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-primary-foreground text-base font-semibold">
                <span className="text-xl">🕌</span> {t("prayer.title")}
              </DialogTitle>
            </DialogHeader>
            {loadState === "ok" && data && (
              <div className="mt-2 space-y-0.5">
                <div className="flex items-center gap-1.5 text-sm opacity-90">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="font-medium">
                    {[data.city, data.country].filter(Boolean).join(", ") || t("prayer.yourLocation")}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs opacity-70 mt-1">
                  <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{data.timezone}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />
                    {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            )}
            {loadState === "loading" && <p className="text-sm opacity-70 mt-1">{t("prayer.detecting")}</p>}
            {loadState === "error"   && <p className="text-sm opacity-70 mt-1">{t("prayer.cantDetect")}</p>}
          </div>

          {loadState === "ok" && data && (
            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">

              {/* Islamic date */}
              <div className="px-5 py-3 border-b bg-muted/30 flex items-center gap-3">
                <CalendarDays className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {data.hijriDay} <span className="text-primary">{data.hijriMonthEn}</span> {data.hijriYear} AH
                  </p>
                  <p className="text-xs text-muted-foreground" dir="rtl">
                    {data.hijriDay} {data.hijriMonthAr} {data.hijriYear} هـ
                  </p>
                </div>
                <p className="text-xs text-muted-foreground shrink-0">{data.gregorianDate}</p>
              </div>

              {/* Next prayer banner */}
              {next && (
                <div className="mx-4 mt-4 rounded-xl bg-primary/10 border border-primary/20 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={PRAYER_COLORS[next.key]}>{prayerIcon(next.key)}</span>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{t("prayer.nextPrayer")}</p>
                      <p className="text-sm font-bold">{next.labelEn}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold tabular-nums text-primary">{next.time}</p>
                    <p className="text-xs text-muted-foreground">{t("prayer.inCountdown", { time: getCountdown(next.time) })}</p>
                  </div>
                </div>
              )}

              {/* Prayer list */}
              <div className="px-4 pt-3 pb-2 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">{t("prayer.todaySchedule")}</p>
                {PRAYER_DEFS.map(({ key, labelEn, labelAr, descKey, sunriseOnly }) => {
                  const time = data.timings[key as PrayerKey];
                  const isCurrent = current === key;
                  const isNext    = next?.key === key;
                  const isPast    = nowMinutes() > toMinutes(time) && !isCurrent;
                  return (
                    <div key={key} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors
                      ${isNext    ? "bg-primary/10 border border-primary/25" : ""}
                      ${isCurrent ? "bg-emerald-500/10 border border-emerald-500/25" : ""}
                      ${!isNext && !isCurrent ? "hover:bg-muted/50" : ""}
                      ${isPast && !isCurrent && !isNext ? "opacity-50" : ""}`}
                    >
                      <span className={`${PRAYER_COLORS[key as PrayerKey]} shrink-0`}>{prayerIcon(key as PrayerKey)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-semibold text-foreground">{labelEn}</span>
                          <span className="text-xs text-muted-foreground font-arabic" dir="rtl">{labelAr}</span>
                        </div>
                        {(isCurrent || isNext) && <p className="text-xs text-muted-foreground">{t(descKey)}</p>}
                      </div>
                      {isCurrent && !sunriseOnly && (
                        <span className="text-xs bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">{t("prayer.now")}</span>
                      )}
                      {isNext && (
                        <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full font-medium">{t("prayer.next")}</span>
                      )}
                      <span className={`text-sm font-semibold tabular-nums shrink-0 ${
                        isNext ? "text-primary" : isCurrent ? "text-emerald-500" : "text-foreground"}`}>
                        {time}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Qibla compass */}
              <div className="mx-4 my-3 rounded-xl border bg-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Compass className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold">{t("prayer.qiblaDirection")}</p>
                </div>
                <div className="flex items-center justify-around gap-4">
                  <QiblaCompass bearing={qibla} />
                  <div className="space-y-2.5 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">{t("prayer.bearing")}</p>
                      <p className="font-bold text-base">{Math.round(qibla)}° N</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t("prayer.coordinates")}</p>
                      <p className="font-mono text-xs">{data.lat.toFixed(4)}°N<br />{data.lng.toFixed(4)}°E</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t("prayer.makkah")}</p>
                      <p className="text-xs font-arabic" dir="rtl">مَكَّةُ المُكَرَّمَة</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 pb-4 pt-1 flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <p>{t("prayer.calculatedUsing", { method: data.methodName })}</p>
              </div>
            </div>
          )}

          {loadState === "error" && (
            <div className="px-5 py-8 text-center space-y-2">
              <MapPin className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
              <p className="text-sm font-medium">{t("prayer.fetchError")}</p>
              <p className="text-xs text-muted-foreground">{t("prayer.fetchErrorDesc")}</p>
            </div>
          )}

          {loadState === "loading" && (
            <div className="px-5 py-8 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">{t("prayer.fetching")}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
