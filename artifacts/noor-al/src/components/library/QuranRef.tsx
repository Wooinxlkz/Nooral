import { ExternalLink } from "lucide-react";
import { useLocation } from "wouter";
import type { QuranRef as QuranRefType } from "../../data/library/types";

interface Props {
  refs: QuranRefType[];
  variant?: "inline" | "card";
}

export function QuranRef({ refs, variant = "card" }: Props) {
  const [, setLocation] = useLocation();

  function openReader(surah: number, ayah: number) {
    setLocation(`/reader?surah=${surah}&ayah=${ayah}`);
  }

  if (variant === "inline") {
    return (
      <span className="inline-flex items-center gap-1 flex-wrap">
        {refs.map((ref, i) => (
          <button
            key={i}
            onClick={() => openReader(ref.surah, ref.ayah)}
            className="inline-flex items-center gap-0.5 text-xs font-medium text-primary hover:underline"
          >
            {ref.surah}:{ref.ayah}
            <ExternalLink className="w-3 h-3" />
          </button>
        ))}
      </span>
    );
  }

  return (
    <div className="my-4 rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
      <p className="text-xs font-semibold text-primary uppercase tracking-wide">Quranic References</p>
      <div className="space-y-2">
        {refs.map((ref, i) => (
          <button
            key={i}
            onClick={() => openReader(ref.surah, ref.ayah)}
            className="flex items-start gap-3 w-full text-left group"
          >
            <span className="shrink-0 mt-0.5 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 min-w-[3rem]">
              {ref.surah}:{ref.ayah}
            </span>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              {ref.note ?? `Surah ${ref.surah}, Ayah ${ref.ayah}`}
              <ExternalLink className="inline w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
