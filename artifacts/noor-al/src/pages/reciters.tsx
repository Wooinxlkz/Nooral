import { useSEO } from "@/lib/seo";
import { useTranslation } from "react-i18next";
import { useReciters } from "@/lib/quran-api";
import { useAppStore } from "@/lib/store";
import { Loader2, Mic, CheckCircle2 } from "lucide-react";

const STYLE_LABELS: Record<string, string> = {
  Murattal: "Murattal",
  Mujawwad: "Mujawwad",
  Muallim:  "Muallim",
};

const STYLE_COLORS: Record<string, string> = {
  Murattal: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  Mujawwad: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  Muallim:  "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
};

export default function RecitersPage() {
  useSEO("Reciters", "Browse and select from 100+ Quran reciters including Murattal, Mujawwad styles.");
  const { t } = useTranslation();

  const { data: reciters, isLoading } = useReciters();
  const { activeReciter, setReciter } = useAppStore();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Mic className="w-7 h-7 text-primary" />
          {t("reciters.title")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("reciters.subtitle")}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : !reciters || reciters.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <Mic className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p>{t("reciters.loadError")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {reciters.map((r) => {
            const id = String(r.id);
            const isActive = activeReciter === id;
            const style = r.style ?? "";

            return (
              <button
                key={r.id}
                onClick={() => setReciter(id)}
                className="group relative flex flex-col items-start gap-3 p-5 rounded-2xl border text-left transition-all duration-150 hover:shadow-md active:scale-[0.98]"
                style={{
                  borderColor: isActive ? "var(--primary)" : "var(--border)",
                  backgroundColor: isActive ? "var(--primary)" + "08" : "var(--card)",
                }}
                aria-label={`Select ${r.name}`}
              >
                {isActive && (
                  <CheckCircle2
                    className="absolute top-4 right-4 w-5 h-5 text-primary"
                    aria-hidden
                  />
                )}

                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center text-xl font-arabic font-bold shrink-0"
                  style={{
                    backgroundColor: isActive ? "var(--primary)" + "18" : "var(--muted)",
                    color: isActive ? "var(--primary)" : "var(--muted-foreground)",
                  }}
                >
                  {r.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold text-sm leading-snug truncate"
                    style={{ color: isActive ? "var(--primary)" : "var(--foreground)" }}
                  >
                    {String(r.name)}
                  </p>
                  {r.translated_name && typeof r.translated_name === 'object' &&
                    typeof (r.translated_name as { name?: unknown }).name === 'string' &&
                    (r.translated_name as { name: string }).name !== r.name && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {(r.translated_name as { name: string }).name}
                    </p>
                  )}
                  {style && (
                    <span
                      className={`mt-2 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        STYLE_COLORS[style] ?? "bg-muted text-muted-foreground"
                      }`}
                    >
                      {STYLE_LABELS[style] ?? style}
                    </span>
                  )}
                </div>

                {isActive && (
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    {t("reciters.active")}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground mt-10">
        {t("reciters.providedBy")}{" "}
        <a
          href="https://quran.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          Quran.com
        </a>
      </p>
    </div>
  );
}
