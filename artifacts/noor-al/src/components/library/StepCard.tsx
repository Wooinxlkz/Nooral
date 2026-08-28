import type { Step } from "../../data/library/types";

interface Props {
  step: Step;
  isLast: boolean;
  isArabic?: boolean;
}

export function StepCard({ step, isLast, isArabic = false }: Props) {
  return (
    <div className="flex gap-4">
      {/* Number + connecting line */}
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 z-10">
          <span className="text-primary-foreground font-bold text-sm">{step.number}</span>
        </div>
        {!isLast && <div className="w-0.5 bg-border flex-1 mt-1" />}
      </div>

      {/* Content */}
      <div className={`flex-1 ${isLast ? "pb-0" : "pb-6"}`}>
        <div className="rounded-xl border bg-card p-4 space-y-1.5">
          {/* Title */}
          {isArabic && step.titleAr ? (
            <>
              <h4
                className="font-arabic font-semibold text-foreground leading-snug"
                dir="rtl"
                style={{ fontSize: "1.1rem" }}
              >
                {step.titleAr}
              </h4>
              <p className="text-xs text-muted-foreground">{step.title}</p>
            </>
          ) : (
            <h4 className="font-semibold text-sm text-foreground">{step.title}</h4>
          )}

          {/* Description */}
          {isArabic && step.descriptionAr ? (
            <>
              <p
                className="font-arabic text-muted-foreground leading-loose"
                dir="rtl"
                style={{ fontSize: "1.05rem" }}
              >
                {step.descriptionAr}
              </p>
              <p className="text-xs text-muted-foreground border-l-2 border-border pl-2">
                {step.description}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
          )}

          {/* Dua inside step */}
          {step.dua && (
            <div className="mt-3 pt-3 border-t space-y-1.5">
              <p
                dir="rtl"
                className="text-right font-arabic text-foreground leading-loose"
                style={{ fontSize: "1.3rem" }}
              >
                {step.dua.arabic}
              </p>
              <p className="text-xs italic text-muted-foreground">{step.dua.transliteration}</p>
              <p className="text-xs text-foreground">{step.dua.translation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
