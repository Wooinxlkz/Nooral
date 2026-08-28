import { useState, useRef, useEffect } from "react";
import { useSEO } from "@/lib/seo";
import { useTranslation } from "react-i18next";
import { useRadioStations } from "@/lib/quran-api";
import { Loader2, Radio, Play, Pause, Volume2, VolumeX, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

const STYLE_COLORS: Record<string, string> = {
  Murattal: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  Mujawwad: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  Muallim:  "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  Children: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
};

export default function RadioPage() {
  useSEO("Quran Radio", "Listen to 24/7 live Quran radio streams from reciters around the world.");
  const { t } = useTranslation();

  const { data: stations, isLoading } = useRadioStations();
  const [activeId, setActiveId]     = useState<string | null>(null);
  const [playing, setPlaying]       = useState(false);
  const [muted, setMuted]           = useState(false);
  const [volume, setVolume]         = useState(80);
  const [loadingId, setLoadingId]   = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audio.volume  = volume / 100;
    audioRef.current = audio;

    audio.addEventListener("playing", () => { setPlaying(true); setLoadingId(null); });
    audio.addEventListener("waiting", () => setLoadingId(activeId));
    audio.addEventListener("error",   () => { setPlaying(false); setLoadingId(null); });
    audio.addEventListener("pause",   () => setPlaying(false));

    return () => {
      audio.pause();
      audio.src = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : volume / 100;
  }, [volume, muted]);

  const handleStation = (station: { id: string; stream_url: string }) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (activeId === station.id) {
      if (playing) {
        audio.pause();
        setPlaying(false);
      } else {
        setLoadingId(station.id);
        audio.play().catch(() => setLoadingId(null));
      }
      return;
    }

    audio.pause();
    setPlaying(false);
    setActiveId(station.id);
    setLoadingId(station.id);
    audio.src = station.stream_url;
    audio.load();
    audio.play().catch(() => setLoadingId(null));
  };

  const activeStation = stations?.find((s) => s.id === activeId);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Radio className="w-7 h-7 text-primary" />
          {t("radio.title")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("radio.subtitle")}
        </p>
      </div>

      {/* ── Now Playing Bar ── */}
      {activeId !== null && (
        <div className="mb-8 p-5 rounded-2xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="relative h-11 w-11 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
              <Radio className="w-5 h-5 text-primary" />
              {(playing || loadingId === activeId) && (
                <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background animate-pulse" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{activeStation?.name ?? "—"}</p>
              <p className="text-xs text-muted-foreground truncate">
                {activeStation?.reciter_name ?? ""}{activeStation?.style ? ` · ${activeStation.style}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setMuted((v) => !v)}
              className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground"
              aria-label={muted ? t("radio.unmute") : t("radio.mute")}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <div className="w-24 hidden sm:block">
              <Slider
                value={[muted ? 0 : volume]}
                min={0} max={100} step={1}
                onValueChange={(v) => { setVolume(v[0]); setMuted(v[0] === 0); }}
                aria-label="Volume"
              />
            </div>
            <button
              onClick={() => activeId && handleStation({ id: activeId, stream_url: activeStation?.stream_url ?? "" })}
              className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
              aria-label={playing ? t("radio.pause") : t("radio.play")}
            >
              {loadingId === activeId ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : playing ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 translate-x-[2px]" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── Stations Grid ── */}
      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : !stations || stations.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <Radio className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p>{t("radio.noStations")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {stations.map((station) => {
            const isActive  = activeId === station.id;
            const isSpinning = loadingId === station.id;
            const isCurrentlyPlaying = isActive && playing;

            return (
              <button
                key={station.id}
                onClick={() => handleStation(station)}
                className="group relative flex items-center gap-4 p-5 rounded-2xl border text-left transition-all duration-150 hover:shadow-md active:scale-[0.98]"
                style={{
                  borderColor: isActive ? "var(--primary)" : "var(--border)",
                  backgroundColor: isActive ? "var(--primary)" + "08" : "var(--card)",
                }}
                aria-label={`Play ${station.name}`}
              >
                {/* Play indicator */}
                <div
                  className="h-11 w-11 shrink-0 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    backgroundColor: isActive ? "var(--primary)" : "var(--muted)",
                    color: isActive ? "white" : "var(--muted-foreground)",
                  }}
                >
                  {isSpinning ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isCurrentlyPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 translate-x-[2px]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold text-sm leading-snug truncate"
                    style={{ color: isActive ? "var(--primary)" : "var(--foreground)" }}
                  >
                    {station.name}
                  </p>
                  {station.reciter_name && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {station.reciter_name}
                    </p>
                  )}
                  {station.style && (
                    <span
                      className={`mt-1.5 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        STYLE_COLORS[station.style] ?? "bg-muted text-muted-foreground"
                      }`}
                    >
                      {station.style}
                    </span>
                  )}
                </div>

                {/* Live dot */}
                {isCurrentlyPlaying && (
                  <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" aria-label="Live" />
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-center gap-2 mt-10 text-xs text-muted-foreground">
        <ExternalLink className="w-3 h-3" />
        <span>
          Streams provided by{" "}
          <a
            href="https://quran.com/radio"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Quran.com
          </a>
        </span>
      </div>
    </div>
  );
}
