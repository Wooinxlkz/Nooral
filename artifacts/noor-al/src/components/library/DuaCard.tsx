import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dua } from "../../data/library/types";

interface Props {
  dua: Dua;
  compact?: boolean;
  isArabic?: boolean;
}

export function DuaCard({ dua, compact = false, isArabic = false }: Props) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(
      `${dua.arabic}\n\n${dua.transliteration}\n\n${dua.translation}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={cn(
        "rounded-xl border bg-card overflow-hidden",
        compact ? "p-4" : "p-5"
      )}
    >
      {/* Header */}
      {dua.title && (
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="font-semibold text-sm text-foreground">{dua.title}</p>
            {dua.occasion && (
              <p className="text-xs text-muted-foreground mt-0.5">{dua.occasion}</p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {dua.count && dua.count > 1 && (
              <span className="text-xs font-medium bg-secondary/30 text-secondary-foreground rounded-full px-2 py-0.5">
                ×{dua.count}
              </span>
            )}
            <button
              onClick={copy}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title={isArabic ? "نسخ الدعاء" : "Copy dua"}
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Arabic — always large and prominent */}
      <p
        dir="rtl"
        className={cn(
          "font-arabic leading-loose text-right text-foreground mb-3",
          compact ? "text-xl" : "text-2xl"
        )}
      >
        {dua.arabic}
      </p>

      {/* Transliteration */}
      <p className={cn("italic text-muted-foreground mb-2", compact ? "text-xs" : "text-sm")}>
        {dua.transliteration}
      </p>

      {/* Translation */}
      <p className={cn("text-foreground mb-3", compact ? "text-xs" : "text-sm")}>
        {dua.translation}
      </p>

      {/* Source */}
      {dua.source && (
        <p className="text-xs text-muted-foreground border-t pt-2">
          <span className="font-medium">{isArabic ? "المصدر: " : "Source: "}</span>
          {dua.source}
        </p>
      )}
    </div>
  );
}
