import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSEO } from "@/lib/seo";
import { useTranslation } from "react-i18next";
import {
  Book, Search, ArrowLeft, Quote, Copy, BookOpen,
  ChevronLeft, ChevronRight, X, User, Loader2,
  BookMarked, Languages, SlidersHorizontal,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────── types ── */
interface HadithGrade  { name: string; grade: string }
interface HadithItem {
  hadithnumber: number;
  text: string;
  arabicText?: string;
  grades: HadithGrade[];
  narrator?: string | null;
}

/* ─────────────────────────────────────────── collections ── */
interface CollMeta {
  id: string; name: string; arabic: string;
  author: string; authorAr: string; died: string;
  grade: "Sahih" | "Hasan" | "Mixed";
  total: number; desc: string; about: string;
  engEdition: string; araEdition: string; color: string;
}

const COLLECTIONS: CollMeta[] = [
  {
    id: "bukhari", name: "Sahih al-Bukhari", arabic: "صحيح البخاري",
    author: "Imam al-Bukhari", authorAr: "الإمام البخاري", died: "256 AH",
    grade: "Sahih", total: 7563,
    desc: "The most authentic book after the Quran.",
    about: "Muhammad ibn Ismail al-Bukhari spent 16 years compiling this work, examining over 600,000 hadiths and selecting only those meeting his strict criteria. It is universally regarded as the most authentic hadith collection in Sunni Islam.",
    engEdition: "eng-bukhari", araEdition: "ara-bukhari", color: "emerald",
  },
  {
    id: "muslim", name: "Sahih Muslim", arabic: "صحيح مسلم",
    author: "Imam Muslim", authorAr: "الإمام مسلم", died: "261 AH",
    grade: "Sahih", total: 7453,
    desc: "Second most authentic collection — the Sahihayn.",
    about: "Muslim ibn al-Hajjaj examined around 300,000 hadiths to compile Sahih Muslim, selecting those with unbroken chains of fully trustworthy narrators. Together with Bukhari it forms the Sahihayn — the two most authentic books.",
    engEdition: "eng-muslim", araEdition: "ara-muslim", color: "blue",
  },
  {
    id: "abudawud", name: "Sunan Abu Dawud", arabic: "سنن أبي داود",
    author: "Imam Abu Dawud", authorAr: "الإمام أبو داود", died: "275 AH",
    grade: "Hasan", total: 5274,
    desc: "Essential collection for Islamic jurisprudence.",
    about: "Abu Dawud as-Sijistani collected 500,000 hadiths and selected 5,274 that relate primarily to Islamic law. He said: 'I only recorded hadiths related to legal rulings.' It is the foremost reference for fiqh-related ahadith.",
    engEdition: "eng-abudawud", araEdition: "ara-abudawud", color: "amber",
  },
  {
    id: "tirmidhi", name: "Jami al-Tirmidhi", arabic: "جامع الترمذي",
    author: "Imam at-Tirmidhi", authorAr: "الإمام الترمذي", died: "279 AH",
    grade: "Hasan", total: 3956,
    desc: "Unique for including grading commentary on each hadith.",
    about: "Muhammad ibn Isa at-Tirmidhi is notable for providing his own grade assessment for each hadith — Sahih, Hasan, or Da'if — making it an essential reference for hadith classification. It covers worship, manners, and spiritual matters comprehensively.",
    engEdition: "eng-tirmidhi", araEdition: "ara-tirmidhi", color: "violet",
  },
  {
    id: "nasai", name: "Sunan an-Nasa'i", arabic: "سنن النسائي",
    author: "Imam an-Nasa'i", authorAr: "الإمام النسائي", died: "303 AH",
    grade: "Hasan", total: 5761,
    desc: "Strictest criteria for narrators among the Sunan.",
    about: "Ahmad ibn Shu'ayb an-Nasa'i applied stricter criteria than other Sunan compilers when grading narrators. The collection is particularly detailed on Salah (prayer), with many chapters on subtle differences in worship practice.",
    engEdition: "eng-nasai", araEdition: "ara-nasai", color: "rose",
  },
  {
    id: "ibnmajah", name: "Sunan Ibn Majah", arabic: "سنن ابن ماجه",
    author: "Ibn Majah", authorAr: "ابن ماجه", died: "273 AH",
    grade: "Hasan", total: 4341,
    desc: "The sixth of the six canonical Kutub al-Sittah.",
    about: "Muhammad ibn Yazid Ibn Majah completed the Kutub al-Sittah (six canonical books). It contains unique ahadith not found in the other five, covering topics from worship and trade to medicine and tribulations.",
    engEdition: "eng-ibnmajah", araEdition: "ara-ibnmajah", color: "cyan",
  },
  {
    id: "malik", name: "Muwatta Malik", arabic: "موطأ مالك",
    author: "Imam Malik", authorAr: "الإمام مالك", died: "179 AH",
    grade: "Sahih", total: 1852,
    desc: "Earliest surviving systematic hadith collection.",
    about: "The Muwatta of Imam Malik ibn Anas is the oldest surviving systematic hadith compilation and the foundation of the Maliki school of law. It preserves the practice of the people of Madinah as a living sunnah.",
    engEdition: "eng-malik", araEdition: "ara-malik", color: "orange",
  },
  {
    id: "nawawi40", name: "Nawawi's 40 Hadith", arabic: "الأربعون النووية",
    author: "Imam an-Nawawi", authorAr: "الإمام النووي", died: "676 AH",
    grade: "Sahih", total: 42,
    desc: "42 foundational hadiths every Muslim should know.",
    about: "Imam Yahya ibn Sharaf an-Nawawi selected 42 hadiths representing the essential foundations of Islamic practice and belief. These are among the most widely memorized, taught, and commented-upon hadiths in Islamic education.",
    engEdition: "eng-nawawi40", araEdition: "ara-nawawi40", color: "teal",
  },
  {
    id: "riyadussalihin", name: "Riyad al-Salihin", arabic: "رياض الصالحين",
    author: "Imam an-Nawawi", authorAr: "الإمام النووي", died: "676 AH",
    grade: "Sahih", total: 1905,
    desc: "Gardens of the Righteous — ethics and spiritual life.",
    about: "Riyad al-Salihin (Gardens of the Righteous) by Imam an-Nawawi covers the full spectrum of Islamic ethics and manners. Organized by theme — sincerity, patience, gratitude, brotherhood, character — it is beloved as a daily reading guide.",
    engEdition: "eng-riyadussalihin", araEdition: "ara-riyadussalihin", color: "green",
  },
  {
    id: "qudsi", name: "Hadith Qudsi", arabic: "الحديث القدسي",
    author: "Various Companions", authorAr: "الصحابة الكرام", died: "—",
    grade: "Mixed", total: 110,
    desc: "Divine words conveyed through the Prophet ﷺ.",
    about: "Hadith Qudsi are a distinct category: the Prophet ﷺ reports the words of Allah directly (unlike the Quran, which is the exact wording revealed). They deal with divine mercy, worship, repentance, and the relationship between Allah and His servants.",
    engEdition: "eng-qudsi", araEdition: "ara-qudsi", color: "indigo",
  },
];

/* ────────────────────────────────────────────── helpers ── */
const CDN = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions";

async function fetchEdition(slug: string): Promise<HadithItem[]> {
  const res = await fetch(`${CDN}/${slug}.min.json`);
  if (!res.ok) throw new Error(`Could not load ${slug}`);
  const data = await res.json();
  return (data.hadiths ?? []).map((h: any): HadithItem => ({
    hadithnumber: h.hadithnumber,
    text: (h.text ?? "").trim(),
    grades: h.grades ?? [],
    narrator: parseNarrator(h.text ?? ""),
  }));
}

function parseNarrator(text: string): string | null {
  const m = text.match(/^Narrated\s+(?:by\s+)?([^(:]+?)(?:\s*\([^)]*\))?\s*:/i);
  return m ? m[1].trim() : null;
}

function gradeColor(grade: string) {
  const g = grade.toLowerCase();
  if (g.includes("sahih")) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300";
  if (g.includes("hasan")) return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
  if (g.includes("da") || g.includes("weak")) return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
  return "bg-muted text-muted-foreground";
}

const COLOR_MAP: Record<string, string> = {
  emerald: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
  blue:    "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
  amber:   "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
  violet:  "text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800",
  rose:    "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800",
  cyan:    "text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800",
  orange:  "text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800",
  teal:    "text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800",
  green:   "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
  indigo:  "text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800",
};
const iconBgMap: Record<string, string> = {
  emerald:"bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  blue:"bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  amber:"bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  violet:"bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  rose:"bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
  cyan:"bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
  orange:"bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  teal:"bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  green:"bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  indigo:"bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
};

const PER_PAGE = 40;

const TOPICS = [
  "Prayer","Fasting","Zakat","Hajj","Faith","Quran","Knowledge","Family",
  "Honesty","Patience","Charity","Death","Paradise","Repentance","Worship",
  "Marriage","Manners","Purification","Jihad","Mercy",
];

/* ─────────────────────────────────────────── components ── */

function CollectionCard({ col, onClick }: { col: CollMeta; onClick: () => void }) {
  const cc = COLOR_MAP[col.color] ?? "";
  const ic = iconBgMap[col.color] ?? "";
  return (
    <Card
      onClick={onClick}
      className={cn("cursor-pointer border-2 hover:shadow-lg transition-all duration-200 group", cc)}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className={cn("w-11 h-11 rounded-xl flex shrink-0 items-center justify-center mt-0.5 transition-transform group-hover:scale-110", ic)}>
            <Book className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h3 className="font-bold text-base leading-tight">{col.name}</h3>
              <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", gradeColor(col.grade))}>
                {col.grade}
              </span>
            </div>
            <p className="text-sm font-arabic text-right mb-1 opacity-80">{col.arabic}</p>
            <p className="text-xs opacity-70 mb-2 line-clamp-2">{col.desc}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium opacity-80">{col.author} · {col.died}</p>
              <p className="text-xs font-bold">{col.total.toLocaleString()} hadiths</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HadithCard({
  hadith, col, showArabic, onExpand, onCopy,
}: {
  hadith: HadithItem; col: CollMeta; showArabic: boolean;
  onExpand: () => void; onCopy: () => void;
}) {
  const { t } = useTranslation();
  const cc = COLOR_MAP[col.color] ?? "";
  const ic = iconBgMap[col.color] ?? "";
  return (
    <Card className="border border-border/60 hover:border-primary/30 transition-colors group">
      <CardContent className="p-0">
        {/* Number + narrator bar */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-2">
          <div className={cn("w-8 h-8 rounded-full flex shrink-0 items-center justify-center text-xs font-bold", ic)}>
            {hadith.hadithnumber}
          </div>
          <div className="flex-1 flex items-center gap-2 flex-wrap min-w-0">
            {hadith.narrator && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="w-3 h-3 shrink-0" />
                {hadith.narrator}
              </span>
            )}
            {hadith.grades.slice(0, 2).map((g, i) => (
              <span key={i} className={cn("text-xs px-1.5 py-0.5 rounded font-medium", gradeColor(g.grade))}>
                {g.grade} · {g.name}
              </span>
            ))}
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-7 w-7" title={t("ahadith.copy")} onClick={onCopy}>
              <Copy className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" title={t("ahadith.expand")} onClick={onExpand}>
              <BookOpen className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Arabic text */}
        {showArabic && hadith.arabicText && (
          <div className="px-5 pb-3">
            <p className={cn("font-arabic text-right text-lg leading-[2.2] text-foreground/90 border rounded-xl px-4 py-3", cc)}>
              {hadith.arabicText}
            </p>
          </div>
        )}
        {showArabic && !hadith.arabicText && (
          <div className="px-5 pb-2">
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        )}

        {/* English text */}
        <div className="px-5 pb-4">
          <div className="flex gap-2">
            <Quote className="w-4 h-4 text-primary/30 shrink-0 mt-1" />
            <p className="text-sm leading-relaxed text-foreground/85 italic">{hadith.text}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-2 ml-6">
            — {col.name} #{hadith.hadithnumber}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function HadithDetailDialog({
  hadith, col, open, onClose,
}: { hadith: HadithItem | null; col: CollMeta | null; open: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const { t } = useTranslation();
  if (!hadith || !col) return null;
  const cc = COLOR_MAP[col.color] ?? "";
  const copy = () => {
    navigator.clipboard.writeText(`${hadith.text}\n\n— ${col.name} #${hadith.hadithnumber}`);
    toast({ title: t("ahadith.copied") });
  };
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <BookMarked className="w-5 h-5 text-primary" />
            {col.name} — Hadith #{hadith.hadithnumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Narrator */}
          {hadith.narrator && (
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">{t("ahadith.narratedBy")}:</span>
              <span className="font-semibold">{hadith.narrator}</span>
            </div>
          )}

          {/* Arabic */}
          {hadith.arabicText && (
            <div className={cn("rounded-xl border p-4", cc)}>
              <p className="font-arabic text-right text-xl leading-[2.4]">{hadith.arabicText}</p>
            </div>
          )}

          {/* English */}
          <div className="bg-muted/30 rounded-xl p-4">
            <div className="flex gap-2">
              <Quote className="w-4 h-4 text-primary/40 shrink-0 mt-1" />
              <p className="text-base leading-relaxed italic">{hadith.text}</p>
            </div>
          </div>

          {/* Grades */}
          {hadith.grades.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t("ahadith.scholarlyGrading")}</p>
              <div className="flex flex-wrap gap-2">
                {hadith.grades.map((g, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-card border rounded-lg px-3 py-1.5">
                    <span className={cn("w-2 h-2 rounded-full", g.grade.toLowerCase().includes("sahih") ? "bg-emerald-500" : g.grade.toLowerCase().includes("hasan") ? "bg-blue-500" : "bg-red-400")} />
                    <span className="text-sm font-medium">{g.grade}</span>
                    <span className="text-xs text-muted-foreground">by {g.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{col.name} ({col.arabic}) · #{hadith.hadithnumber}</span>
            <Button size="sm" variant="outline" onClick={copy} className="gap-1.5">
              <Copy className="w-3.5 h-3.5" /> {t("ahadith.copy")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─────────────────────────────────────────── main page ── */
export default function AhadithPage() {
  useSEO("Ahadith", "Browse the complete hadith library: Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasai, Ibn Majah, Muwatta, Nawawi 40, Riyad al-Salihin, and Hadith Qudsi — Arabic and English.");
  const { t } = useTranslation();

  const { toast } = useToast();

  /* library state */
  const [libSearch, setLibSearch] = useState("");
  const [libGrade, setLibGrade]   = useState<"all" | "Sahih" | "Hasan" | "Mixed">("all");

  /* collection view state */
  const [selId, setSelId] = useState<string | null>(null);
  const [search, setSearch]           = useState("");
  const [narratorFilter, setNarratorFilter] = useState("all");
  const [gradeFilter, setGradeFilter]       = useState("all");
  const [topicFilter, setTopicFilter]       = useState("all");
  const [showArabic, setShowArabic]         = useState(true);
  const [page, setPage]                     = useState(1);
  const [showFilters, setShowFilters]       = useState(false);

  /* detail modal */
  const [detail, setDetail] = useState<HadithItem | null>(null);

  const col = COLLECTIONS.find(c => c.id === selId) ?? null;

  /* fetch hadiths when collection opened */
  const { data: engHadiths, isLoading: engLoading, error: engError } = useQuery({
    queryKey: ["hadiths-eng", selId],
    queryFn: () => fetchEdition(col!.engEdition),
    enabled: !!selId && !!col,
    staleTime: Infinity,
  });

  const { data: araHadiths, isLoading: araLoading } = useQuery({
    queryKey: ["hadiths-ara", selId],
    queryFn: () => fetchEdition(col!.araEdition),
    enabled: !!selId && !!col && showArabic,
    staleTime: Infinity,
  });

  /* merge English + Arabic */
  const hadiths = useMemo<HadithItem[]>(() => {
    if (!engHadiths) return [];
    const araMap = new Map<number, string>();
    if (araHadiths) araHadiths.forEach(h => araMap.set(h.hadithnumber, h.text));
    return engHadiths.map(h => ({ ...h, arabicText: araMap.get(h.hadithnumber) }));
  }, [engHadiths, araHadiths]);

  /* derived narrators list */
  const narrators = useMemo(() => {
    const s = new Set<string>();
    hadiths.forEach(h => { if (h.narrator) s.add(h.narrator); });
    return Array.from(s).sort();
  }, [hadiths]);

  /* filtered hadiths */
  const filtered = useMemo(() => {
    let r = hadiths;
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(h => h.text.toLowerCase().includes(q) || (h.arabicText?.includes(q) ?? false));
    }
    if (narratorFilter !== "all") r = r.filter(h => h.narrator === narratorFilter);
    if (gradeFilter !== "all") r = r.filter(h =>
      h.grades.some(g => g.grade.toLowerCase().includes(gradeFilter.toLowerCase()))
    );
    if (topicFilter !== "all") r = r.filter(h => h.text.toLowerCase().includes(topicFilter.toLowerCase()));
    return r;
  }, [hadiths, search, narratorFilter, gradeFilter, topicFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  /* reset page when filters change */
  useEffect(() => { setPage(1); }, [search, narratorFilter, gradeFilter, topicFilter, selId]);

  const openCollection = (id: string) => {
    setSelId(id);
    setSearch(""); setNarratorFilter("all");
    setGradeFilter("all"); setTopicFilter("all");
    setPage(1); setShowFilters(false);
  };

  const closeCollection = () => { setSelId(null); setDetail(null); };

  const copyHadith = (h: HadithItem) => {
    navigator.clipboard.writeText(`${h.text}\n\n— ${col?.name} #${h.hadithnumber}`);
    toast({ title: t("ahadith.hadithCopied") });
  };

  const anyFilterActive = narratorFilter !== "all" || gradeFilter !== "all" || topicFilter !== "all";

  /* library filtered */
  const libCols = COLLECTIONS.filter(c => {
    const q = libSearch.toLowerCase();
    const matchText = c.name.toLowerCase().includes(q) || c.arabic.includes(libSearch) || c.author.toLowerCase().includes(q);
    const matchGrade = libGrade === "all" || c.grade === libGrade;
    return matchText && matchGrade;
  });

  /* ── Library view ─── */
  if (!selId) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-1">
            <BookMarked className="w-8 h-8 text-primary" />
            {t("ahadith.title")}
          </h1>
          <p className="text-muted-foreground">
            {COLLECTIONS.length} collections · {COLLECTIONS.reduce((a, c) => a + c.total, 0).toLocaleString()}+ hadiths
            · Arabic &amp; English
          </p>
        </div>

        {/* Search + grade filter */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder={t("ahadith.search")} className="pl-9 h-11 bg-card rounded-xl"
              value={libSearch} onChange={e => setLibSearch(e.target.value)} />
          </div>
          <Select value={libGrade} onValueChange={v => setLibGrade(v as any)}>
            <SelectTrigger className="w-36 h-11 bg-card rounded-xl">
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All grades</SelectItem>
              <SelectItem value="Sahih">Sahih only</SelectItem>
              <SelectItem value="Hasan">Hasan only</SelectItem>
              <SelectItem value="Mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {libCols.map(c => (
            <CollectionCard key={c.id} col={c} onClick={() => openCollection(c.id)} />
          ))}
          {libCols.length === 0 && (
            <p className="col-span-2 text-center text-muted-foreground py-16">No collections match your search.</p>
          )}
        </div>
      </div>
    );
  }

  /* ── Collection view ─── */
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={closeCollection}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold leading-tight">{col?.name}</h1>
              <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", gradeColor(col?.grade ?? ""))}>
                {col?.grade}
              </span>
            </div>
            <p className="text-sm font-arabic text-muted-foreground mt-0.5">{col?.arabic}</p>
          </div>
        </div>

        {/* About banner */}
        <div className={cn("rounded-xl border px-4 py-3 text-sm mb-4", COLOR_MAP[col?.color ?? ""] ?? "")}>
          <p className="font-medium mb-0.5">{col?.author} ({col?.authorAr}) · d. {col?.died}</p>
          <p className="opacity-80 text-xs leading-relaxed">{col?.about}</p>
        </div>

        {/* Stats bar */}
        {engHadiths && (
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Book className="w-3.5 h-3.5" />{engHadiths.length.toLocaleString()} hadiths</span>
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{narrators.length.toLocaleString()} narrators</span>
            {filtered.length < hadiths.length && (
              <span className="text-primary font-medium">{filtered.length} matching filters</span>
            )}
          </div>
        )}
      </div>

      {/* Search + action bar */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search hadiths…" className="pl-9 h-10 bg-card rounded-xl"
            value={search} onChange={e => setSearch(e.target.value)} />
          {search && (
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearch("")}>
              <X className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
        <Button variant={showFilters || anyFilterActive ? "secondary" : "outline"} size="sm"
          className={cn("h-10 gap-1.5 rounded-xl", anyFilterActive && "ring-2 ring-primary/40")}
          onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {anyFilterActive && <span className="ml-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-[10px] flex items-center justify-center">•</span>}
        </Button>
        <Button variant={showArabic ? "secondary" : "outline"} size="sm"
          className="h-10 gap-1.5 rounded-xl"
          onClick={() => setShowArabic(!showArabic)}>
          <Languages className="w-4 h-4" />
          Arabic
          {showArabic && araLoading && <Loader2 className="w-3 h-3 animate-spin ml-1" />}
        </Button>
      </div>

      {/* Expandable filter row */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-card border rounded-xl">
          {/* Narrator */}
          <Select value={narratorFilter} onValueChange={setNarratorFilter}>
            <SelectTrigger className="w-52 h-9 text-sm">
              <User className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="All narrators" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              <SelectItem value="all">All narrators</SelectItem>
              {narrators.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Grade */}
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-36 h-9 text-sm">
              <SelectValue placeholder="All grades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All grades</SelectItem>
              <SelectItem value="sahih">Sahih</SelectItem>
              <SelectItem value="hasan">Hasan</SelectItem>
              <SelectItem value="da">Da'if (Weak)</SelectItem>
            </SelectContent>
          </Select>

          {/* Topic */}
          <Select value={topicFilter} onValueChange={setTopicFilter}>
            <SelectTrigger className="w-40 h-9 text-sm">
              <SelectValue placeholder="All topics" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              <SelectItem value="all">All topics</SelectItem>
              {TOPICS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>

          {anyFilterActive && (
            <Button variant="ghost" size="sm" className="h-9 gap-1 text-muted-foreground"
              onClick={() => { setNarratorFilter("all"); setGradeFilter("all"); setTopicFilter("all"); }}>
              <X className="w-3.5 h-3.5" /> Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Loading state */}
      {engLoading && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-muted-foreground text-sm mb-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading {col?.total.toLocaleString()} hadiths…
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border border-border/40">
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error state */}
      {engError && (
        <div className="text-center py-16">
          <Quote className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="text-muted-foreground">Could not load hadiths. Please check your connection.</p>
        </div>
      )}

      {/* Hadith list */}
      {!engLoading && !engError && (
        <>
          <div className="space-y-4 mb-6">
            {paginated.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p>No hadiths found. Try adjusting your search or filters.</p>
              </div>
            ) : paginated.map(h => (
              <HadithCard
                key={h.hadithnumber}
                hadith={h}
                col={col!}
                showArabic={showArabic}
                onExpand={() => setDetail(h)}
                onCopy={() => copyHadith(h)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                className="gap-1.5">
                <ChevronRight className="w-4 h-4" /> Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} / {totalPages}
                <span className="ml-2 text-xs">({filtered.length.toLocaleString()} hadiths)</span>
              </span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                className="gap-1.5">
                Next <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Detail modal */}
      <HadithDetailDialog hadith={detail} col={col} open={!!detail} onClose={() => setDetail(null)} />
    </div>
  );
}
