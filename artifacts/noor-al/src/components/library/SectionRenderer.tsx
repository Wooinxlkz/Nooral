import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SectionType } from "../../data/library/types";
import { QuranRef } from "./QuranRef";
import { DuaCard } from "./DuaCard";
import { TimelineItem } from "./TimelineItem";
import { StepCard } from "./StepCard";

// ─── Arabic heading lookup ─────────────────────────────────────────────────
const AR_HEADINGS: Record<string, string> = {
  "Full Name & Title":                          "الاسم الكامل والألقاب",
  "Full Name and Title":                        "الاسم الكامل والألقاب",
  "Full Name and Lineage":                      "الاسم الكامل والنسب",
  "Full Name":                                  "الاسم الكامل",
  "Era and People":                             "العصر والقوم",
  "Parents and Lineage":                        "الوالدان والنسب",
  "Life Story":                                 "قِصَّتُهُ",
  "The Life Story":                             "قِصَّتُهُ",
  "Life Story — Rejecting Idol Worship":        "رفض عبادة الأصنام",
  "Life Story and the She-Camel":               "قصته وناقة الله",
  "Miracles (from Quran and Sahih Hadith)":     "المُعجِزَات",
  "Miracles (from Quran)":                      "المُعجِزَات",
  "Miracles":                                   "المُعجِزَات",
  "Unique Kingdom and Miracles (from Quran)":   "الملك الفريد والمُعجِزَات",
  "What the Quran Confirms (Miracles / Attributes)": "ما أكَّده القرآن الكريم",
  "What the Quran Confirms":                    "ما أكَّده القرآن الكريم",
  "What the Quran Says About Him":              "ما قاله القرآن عنه",
  "Lessons from His Story":                     "الدُّروس والعِبَر",
  "Lessons":                                    "الدُّروس والعِبَر",
  "Quranic Mentions":                           "ذِكره في القرآن الكريم",
  "Death and Legacy":                           "الوفاة والإرث",
  "Death and Burial":                           "الوفاة والدفن",
  "Martyrdom":                                  "الشَّهادة",
  "Guardian of Maryam and the Dua":             "وصاية مريم والدعاء",
  "The Great Tests of Ibrahim":                 "الابتلاءات الكبرى لإبراهيم ﷺ",
  "Building the Kaaba":                         "بناء الكعبة المُشرَّفة",
  "The Great Flood":                            "الطوفان العظيم",
  "The Miracle and Punishment (from Quran)":    "المعجزة والعقوبة في القرآن",
  "The Punishment of 'Ad (from Quran)":         "عقوبة عاد في القرآن",
  "The Punishment (from Quran)":                "العقوبة في القرآن",
  "Da'wah Method":                              "أسلوب الدعوة",
  "Key Events":                                 "الأحداث الرئيسية",
  "The Queen of Sheba":                         "ملكة سبأ — بلقيس",
  "Killing Jalut and Rising to Kingship":       "قتل جالوت والوصول إلى الملك",
  "The Story of His Patience":                  "قصة صبره الجميل",
  "His People and His Test":                    "قومه وابتلاؤه",
  "The Night Journey and Ascension":            "الإسراء والمِعراج",
  "The Hijra":                                  "الهِجرة النبوية",
  "The Major Battles":                          "الغزوات الكبرى",
  "His Wives (Ummahatu al-Mu'minin)":           "أمَّهات المؤمنين رضي الله عنهن",
  "The Ten Companions Promised Jannah":         "العشرة المبشَّرون بالجنة",
  "The Life Story of Muhammad ﷺ":              "السيرة النبوية المُطهَّرة",
  "Introduction":                               "مُقدِّمة",
  "Overview":                                   "نظرة عامة",
  "Summary":                                    "خُلاصة",
  "Definition":                                 "التعريف",
  "Types":                                      "الأنواع",
  "Obligations":                                "الواجبات والفُروض",
  "Conditions":                                 "الشُّروط",
  "Benefits":                                   "الفوائد والحِكمة",
  "Importance":                                 "الأهمية والفضل",
  "Duas":                                       "الأدعية المأثورة",
  "Rules":                                      "الأحكام",
  "Method":                                     "الطريقة والكيفية",
  "The Intention (Niyyah)":                     "النِّية",
  "What Breaks Wudu":                           "نواقض الوضوء",
  "Fard (Obligatory) Acts of Wudu":             "فروض الوضوء",
  "Sunnah Acts of Wudu":                        "سنن الوضوء",
  "Tayammum (Dry Ablution)":                    "التيمُّم",
  "Ghusl (Full Bath)":                          "الغُسل",
  "Prayer":                                     "الصَّلاة",
  "Zakat":                                      "الزَّكاة",
  "Fasting":                                    "الصِّيام",
  "Hajj":                                       "الحَج",

  // ── Islamic History — Rightly Guided Caliphs ──────────────────────────────
  "Abu Bakr as-Siddiq (632–634 CE)":           "أبو بكر الصِّدِّيق (632–634م)",
  "Umar ibn al-Khattab (634–644 CE)":          "عمر بن الخطَّاب (634–644م)",
  "Uthman ibn Affan (644–656 CE)":             "عثمان بن عفَّان (644–656م)",
  "Ali ibn Abi Talib (656–661 CE)":            "علي بن أبي طالب (656–661م)",

  // ── Halal & Haram — Food & Drink ──────────────────────────────────────────
  "Clearly Haram Foods":                        "الأطعمة المحرَّمة صراحةً",
  "Conditions for Halal Meat":                  "شروط الذبح الحلال",
  "Alcohol and Intoxicants":                    "الخمر والمسكرات",

  // ── Halal & Haram — Business & Finance ────────────────────────────────────
  "Riba (Interest) — Absolutely Prohibited":    "الربا — محرَّم تحريماً قاطعاً",
  "Haram Business Practices":                   "المعاملات التجارية المحرَّمة",
  "Halal Alternatives":                         "البدائل الحلال",

  // ── Halal & Haram — Relationships & Social Conduct ────────────────────────
  "Lowering the Gaze":                          "غضُّ البصر",
  "Khalwah — Seclusion":                        "الخَلوة",
  "Zina (Fornication/Adultery)":                "الزِّنا",
  "Marriage in Islam":                          "الزَّواج في الإسلام",
};

function getArabicHeading(text: string, ar?: string): string | undefined {
  return ar || AR_HEADINGS[text];
}

// ─── Component ──────────────────────────────────────────────────────────────

interface Props {
  section: SectionType;
  isArabic?: boolean;
}

export function SectionRenderer({ section, isArabic = false }: Props) {
  switch (section.type) {

    // ── Text ──────────────────────────────────────────────────────────────────
    case "text": {
      const arText = section.ar;
      if (isArabic && arText) {
        return (
          <div className="my-3 space-y-2">
            <p
              className="leading-loose font-arabic text-foreground/95"
              dir="rtl"
              style={{ fontSize: "1.3rem", lineHeight: "2.2" }}
            >
              {arText}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground border-r-2 border-primary/20 pr-3 mr-1">
              {section.content}
            </p>
          </div>
        );
      }
      return (
        <div className="my-3 space-y-1.5">
          <p className="text-sm leading-relaxed text-foreground/90">{section.content}</p>
          {arText && (
            <p
              className="leading-loose font-arabic text-muted-foreground border-r-2 border-primary/20 pr-3"
              dir="rtl"
              style={{ fontSize: "1.1rem" }}
            >
              {arText}
            </p>
          )}
        </div>
      );
    }

    // ── Heading ───────────────────────────────────────────────────────────────
    case "heading": {
      const arHeading = getArabicHeading(section.text, section.ar);
      const isH2 = section.level === 2;

      if (isArabic && arHeading) {
        return (
          <div className={cn("space-y-0.5", isH2 ? "mt-8 mb-3 pb-2 border-b" : "mt-6 mb-2")}>
            <p
              className="font-arabic text-foreground font-semibold leading-relaxed"
              dir="rtl"
              style={{ fontSize: isH2 ? "1.6rem" : "1.25rem" }}
            >
              {arHeading}
            </p>
            <p className={cn("text-muted-foreground", isH2 ? "text-sm" : "text-xs")}>
              {section.text}
            </p>
          </div>
        );
      }

      return (
        <div className={cn("space-y-0.5", isH2 ? "mt-8 mb-3 pb-2 border-b" : "mt-6 mb-2")}>
          {isH2 ? (
            <h2 className="text-lg font-bold text-foreground">{section.text}</h2>
          ) : (
            <h3 className="text-base font-semibold text-foreground">{section.text}</h3>
          )}
          {arHeading && (
            <p
              className="font-arabic text-muted-foreground"
              dir="rtl"
              style={{ fontSize: "1.05rem" }}
            >
              {arHeading}
            </p>
          )}
        </div>
      );
    }

    // ── List ──────────────────────────────────────────────────────────────────
    case "list": {
      const arTitle = section.titleAr;
      const showTitle = section.title || arTitle;
      const hasAr = !!(section.itemsAr?.length);
      // In Arabic mode: primary = Arabic, secondary = English translation
      // In English mode: primary = English, secondary = Arabic (if available)
      const primaryItems = isArabic && hasAr ? section.itemsAr! : section.items;
      const secondaryItems = isArabic && hasAr ? section.items : section.itemsAr;

      return (
        <div className="my-3">
          {showTitle && (
            <div className="mb-2 space-y-0.5">
              {isArabic && arTitle ? (
                <>
                  <p
                    className="font-arabic font-semibold text-foreground"
                    dir="rtl"
                    style={{ fontSize: "1.1rem" }}
                  >
                    {arTitle}
                  </p>
                  {section.title && (
                    <p className="text-xs text-muted-foreground">{section.title}</p>
                  )}
                </>
              ) : (
                <>
                  {section.title && (
                    <p className="text-sm font-semibold text-foreground">{section.title}</p>
                  )}
                  {arTitle && (
                    <p className="text-xs font-arabic text-muted-foreground" dir="rtl">
                      {arTitle}
                    </p>
                  )}
                </>
              )}
            </div>
          )}
          <ul className="space-y-2">
            {primaryItems.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-foreground/90"
                dir={isArabic && hasAr ? "rtl" : "ltr"}
              >
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <div
                  className="leading-relaxed space-y-0.5 flex-1"
                  style={
                    isArabic && hasAr
                      ? { fontSize: "1.15rem", fontFamily: "var(--font-arabic, inherit)" }
                      : { fontSize: "0.875rem" }
                  }
                >
                  <span>{item}</span>
                  {secondaryItems && secondaryItems[i] && (
                    isArabic ? (
                      // English translation shown below Arabic item
                      <p
                        className="text-muted-foreground border-r-2 border-primary/20 pr-2 mt-0.5"
                        dir="ltr"
                        style={{ fontSize: "0.72rem", fontFamily: "inherit" }}
                      >
                        {secondaryItems[i]}
                      </p>
                    ) : (
                      // Arabic shown below English item
                      <p
                        className="font-arabic text-muted-foreground"
                        dir="rtl"
                        style={{ fontSize: "1.05rem" }}
                      >
                        {secondaryItems[i]}
                      </p>
                    )
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    // ── Steps ─────────────────────────────────────────────────────────────────
    case "steps":
      return (
        <div className="my-4">
          {section.title && (
            <div className="mb-4 space-y-0.5">
              {isArabic && section.titleAr ? (
                <>
                  <p
                    className="font-arabic font-semibold text-foreground"
                    dir="rtl"
                    style={{ fontSize: "1.1rem" }}
                  >
                    {section.titleAr}
                  </p>
                  <p className="text-xs text-muted-foreground">{section.title}</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-foreground">{section.title}</p>
                  {section.titleAr && (
                    <p className="text-xs font-arabic text-muted-foreground" dir="rtl">
                      {section.titleAr}
                    </p>
                  )}
                </>
              )}
            </div>
          )}
          <div>
            {section.items.map((step, i) => (
              <StepCard
                key={step.number}
                step={step}
                isLast={i === section.items.length - 1}
                isArabic={isArabic}
              />
            ))}
          </div>
        </div>
      );

    // ── Dua ───────────────────────────────────────────────────────────────────
    case "dua":
      return (
        <div className="my-4 rounded-xl border border-primary/20 bg-primary/5 p-5">
          <p
            dir="rtl"
            className="text-right font-arabic text-foreground mb-3 leading-loose"
            style={{ fontSize: "1.6rem" }}
          >
            {section.arabic}
          </p>
          <p className="text-sm italic text-muted-foreground mb-2">
            {section.transliteration}
          </p>
          <p className="text-sm text-foreground mb-2">{section.translation}</p>
          {section.source && (
            <p className="text-xs text-muted-foreground border-t border-primary/20 pt-2">
              <span className="font-medium">{isArabic ? "المصدر: " : "Source: "}</span>
              {section.source}
            </p>
          )}
        </div>
      );

    // ── Quran Ref ─────────────────────────────────────────────────────────────
    case "quranRef":
      return <QuranRef refs={section.refs} />;

    // ── Timeline ──────────────────────────────────────────────────────────────
    case "timeline":
      return (
        <div className="my-4">
          {section.events.map((event, i) => (
            <TimelineItem
              key={i}
              event={event}
              index={i}
              isLast={i === section.events.length - 1}
              isArabic={isArabic}
            />
          ))}
        </div>
      );

    // ── Callout ───────────────────────────────────────────────────────────────
    case "callout": {
      const arContent = section.ar;
      return (
        <div className="my-4 flex gap-3 rounded-xl border border-secondary/40 bg-secondary/10 p-4">
          <Info className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
          <div className="space-y-1.5 flex-1">
            {isArabic && arContent ? (
              <>
                <p
                  className="font-arabic leading-loose text-foreground/90"
                  dir="rtl"
                  style={{ fontSize: "1.15rem" }}
                >
                  {arContent}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-foreground/90 leading-relaxed">{section.content}</p>
                {arContent && (
                  <p
                    className="font-arabic text-muted-foreground leading-loose"
                    dir="rtl"
                    style={{ fontSize: "1.05rem" }}
                  >
                    {arContent}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      );
    }

    // ── Table ─────────────────────────────────────────────────────────────────
    case "table":
      return (
        <div className="my-4 overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                {section.headers.map((h, i) => (
                  <th
                    key={i}
                    className="px-3 py-2.5 text-left font-semibold text-foreground text-xs uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {section.rows.map((row, ri) => (
                <tr key={ri} className={cn(ri % 2 === 0 ? "bg-card" : "bg-muted/30")}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2.5 text-foreground/90">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    // ── Duas list ────────────────────────────────────────────────────────────
    case "duas-list":
      return (
        <div className="my-4 space-y-3">
          {section.title && (
            <div className="space-y-0.5">
              {isArabic && section.titleAr ? (
                <>
                  <h3
                    className="font-arabic font-semibold text-foreground"
                    dir="rtl"
                    style={{ fontSize: "1.25rem" }}
                  >
                    {section.titleAr}
                  </h3>
                  <p className="text-xs text-muted-foreground">{section.title}</p>
                </>
              ) : (
                <>
                  <h3 className="text-base font-semibold text-foreground">{section.title}</h3>
                  {section.titleAr && (
                    <p className="text-xs font-arabic text-muted-foreground" dir="rtl">
                      {section.titleAr}
                    </p>
                  )}
                </>
              )}
            </div>
          )}
          {section.duas.map((dua) => (
            <DuaCard key={dua.id} dua={dua} isArabic={isArabic} />
          ))}
        </div>
      );

    default:
      return null;
  }
}
