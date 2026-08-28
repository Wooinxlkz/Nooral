import { useLocation } from "wouter";
import type { TimelineEvent } from "../../data/library/types";

interface Props {
  event: TimelineEvent;
  index: number;
  isLast: boolean;
  isArabic?: boolean;
}

export function TimelineItem({ event, index, isLast, isArabic = false }: Props) {
  const [, setLocation] = useLocation();

  return (
    <div className="flex gap-4">
      {/* Line + dot */}
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 z-10">
          <span className="text-primary-foreground text-xs font-bold">{index + 1}</span>
        </div>
        {!isLast && <div className="w-0.5 bg-border flex-1 mt-1" />}
      </div>

      {/* Content */}
      <div className={`flex-1 ${isLast ? "pb-0" : "pb-8"}`}>
        <div className="rounded-xl border bg-card p-4 space-y-1.5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {isArabic && event.titleAr ? (
                <>
                  <h4
                    className="font-arabic font-semibold text-foreground leading-snug"
                    dir="rtl"
                    style={{ fontSize: "1.1rem" }}
                  >
                    {event.titleAr}
                  </h4>
                  <p className="text-xs text-muted-foreground">{event.title}</p>
                </>
              ) : (
                <h4 className="font-semibold text-sm text-foreground">{event.title}</h4>
              )}
            </div>
            <span className="text-xs font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5 shrink-0">
              {event.date}
            </span>
          </div>

          {/* Description */}
          {isArabic && event.descriptionAr ? (
            <>
              <p
                className="font-arabic text-muted-foreground leading-loose"
                dir="rtl"
                style={{ fontSize: "1.05rem" }}
              >
                {event.descriptionAr}
              </p>
              <p className="text-xs text-muted-foreground border-l-2 border-border pl-2">
                {event.description}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
          )}

          {/* Significance */}
          {event.significance && (
            <div className="text-xs text-secondary-foreground bg-secondary/20 rounded-lg px-3 py-2 space-y-1">
              {isArabic && event.significanceAr ? (
                <>
                  <p dir="rtl" className="font-arabic leading-relaxed" style={{ fontSize: "0.85rem" }}>
                    <span className="font-semibold">الأهمية: </span>
                    {event.significanceAr}
                  </p>
                  <p className="text-muted-foreground/80">
                    <span className="font-semibold">Why it matters: </span>
                    {event.significance}
                  </p>
                </>
              ) : (
                <p>
                  <span className="font-semibold">Why it matters: </span>
                  {event.significance}
                </p>
              )}
            </div>
          )}

          {/* Quran ref */}
          {event.quranRef && (
            <button
              onClick={() =>
                setLocation(
                  `/reader?surah=${event.quranRef!.surah}&ayah=${event.quranRef!.ayah}`
                )
              }
              className="text-xs text-primary hover:underline"
            >
              {isArabic ? "← القرآن " : "→ Quran "}
              {event.quranRef.surah}:{event.quranRef.ayah}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
