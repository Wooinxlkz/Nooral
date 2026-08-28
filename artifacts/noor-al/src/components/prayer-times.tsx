import { useEffect, useState } from "react";

type PrayerEntry = { name: string; time: string };

const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

function parseTime(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function getNextPrayer(timings: Record<string, string>): PrayerEntry {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  for (const name of PRAYER_NAMES) {
    const t = timings[name];
    if (!t) continue;
    if (parseTime(t) > nowMin) return { name, time: t };
  }
  return { name: "Fajr", time: timings["Fajr"] ?? "" };
}

export default function PrayerTimes() {
  const [prayer, setPrayer] = useState<PrayerEntry | null>(null);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setDenied(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const ts = Math.floor(Date.now() / 1000);
          const res = await fetch(
            `https://api.aladhan.com/v1/timings/${ts}?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&method=2`
          );
          const data = await res.json();
          if (data?.data?.timings) {
            setPrayer(getNextPrayer(data.data.timings));
          }
        } catch {
          setDenied(true);
        }
      },
      () => setDenied(true)
    );
  }, []);

  if (denied) {
    return (
      <div className="hidden lg:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-secondary/30 text-muted-foreground cursor-default" title="Allow location access for accurate prayer times">
        🕌 Allow location for prayer times
      </div>
    );
  }

  if (!prayer) {
    return (
      <div className="hidden lg:flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-secondary/30 text-secondary-foreground animate-pulse">
        <span className="font-medium">Prayer…</span>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-secondary/30 text-secondary-foreground" title="Next prayer time">
      <span className="text-muted-foreground text-xs">Next:</span>
      <span className="font-semibold">{prayer.name}</span>
      <span className="opacity-70">{prayer.time}</span>
    </div>
  );
}
