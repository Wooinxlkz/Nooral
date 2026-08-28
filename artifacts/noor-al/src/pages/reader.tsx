import { useState, useEffect, useRef, useCallback, Fragment } from "react";
import { useSEO } from "@/lib/seo";
import { useSurahs, useVersesByChapter, useVersesByPage, useTafsirByChapter, fetchTafsir, fetchWordOccurrences, fetchWordMorphology, fetchSurahInfo, fetchQuranReflections, SurahInfo, WordMorphology, QuranWord, QuranVerse, QuranReflection, JUZ_MAP, HIZB_MAP, getTranslationName, getTranslationAuthor, getArabicFontFamily, TRANSLATIONS_LIST, TAFSIR_SOURCES } from "@/lib/quran-api";
import { useAppStore } from "@/lib/store";
import { useSearch, useLocation, Link } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Bookmark, Flag, FileText, Copy, Info, X, Play, BookOpen,
  ChevronLeft, ChevronRight, AlignJustify, EyeOff, Eye, LayoutList, Smile,
  Loader2, Search as SearchIcon, Share2, CheckCircle2, Star, Languages, Download, Pin, PinOff, Palette,
  ScrollText, Type, Pilcrow, FolderHeart, Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import {
  useCreateBookmark, useFlagHardAyah, useCreateNote, useSaveLastRead,
  useMarkAyahMemorized, useGetMoods, useSaveMood, useDeleteMood,
  useLogReading, usePinVerse, useUnpinVerse, useGetPinnedVerses,
  useGetCollections, useCreateCollection, useAddVerseToCollection,
} from "@workspace/api-client-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RichNoteEditor } from "@/components/rich-note-editor";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SurahFilterBar } from "@/components/surah-filter";
import { QuranFilter, applySurahFilters } from "@/components/surah-filter.types";

const TAFSIR_IDS: Record<string, number> = { en: 169, ar: 16 };


const SHARE_THEMES = [
  { id: "classic", label: "Classic",  bg: "#F5F0E0", fg: "#2C1810", accent: "#8B6914" },
  { id: "dark",    label: "Dark",     bg: "#1A1A2E", fg: "#E8D5B7", accent: "#C0A060" },
  { id: "emerald", label: "Emerald",  bg: "#0D2818", fg: "#D4FFD4", accent: "#4ADE80" },
];
const BISMILLAH = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ";

const MOOD_OPTIONS = [
  { value: "peace",       label: "Peace",       emoji: "🕊️" },
  { value: "reflection",  label: "Reflection",  emoji: "🤲" },
  { value: "gratitude",   label: "Gratitude",   emoji: "🙏" },
  { value: "awe",         label: "Awe",         emoji: "✨" },
  { value: "hope",        label: "Hope",        emoji: "🌟" },
] as const;

type MoodValue = "peace" | "reflection" | "gratitude" | "awe" | "hope";

/* ── Word tooltip ─────────────────────────────────────────────── */
interface TooltipState {
  arabic: string;
  translation: string;
  x: number;
  y: number;
}

function WordTooltipOverlay({ tip }: { tip: TooltipState | null }) {
  if (!tip) return null;
  return (
    <div
      className="fixed z-[999] pointer-events-none"
      style={{ left: tip.x, top: tip.y, transform: "translate(-50%, calc(-100% - 8px))" }}
    >
      <div className="bg-popover border border-border rounded-xl shadow-xl px-3.5 py-2.5 flex flex-col items-center gap-1 min-w-[80px] max-w-[200px]">
        <span className="font-arabic text-sm text-foreground leading-none">{tip.arabic}</span>
        <span className="text-[13px] text-muted-foreground text-center leading-snug">{tip.translation}</span>
      </div>
      <div className="w-2 h-2 bg-popover border-r border-b border-border rotate-45 mx-auto -mt-1" />
    </div>
  );
}

/* ── Arabic-Indic numeral helper ─────────────────────────────── */
const ARABIC_INDIC = "٠١٢٣٤٥٦٧٨٩";
function toArabicIndic(n: number): string {
  return n.toString().split("").map((d) => ARABIC_INDIC[parseInt(d)] ?? d).join("");
}

/* ── Quranic ayah end marker — Unicode ۝ + Scheherazade New ─── */
const toAr = (n: number) => String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d as unknown as number]);

/* ── Sajda ayahs (14 obligatory + 1 recommended) ─────────────── */
const SAJDA_AYAHS = new Set([
  '7:206', '13:15', '16:50', '17:109', '19:58', '22:18', '22:77',
  '25:60', '27:26', '32:15', '38:24', '41:38', '53:62', '84:21', '96:19',
]);

/* ── Tajweed rule legend (colors match quran.com CSS classes) ─── */
const TAJWEED_RULES = [
  { name: "Ghunnah",  arabic: "غُنَّة",    color: "#FF7E1E", desc: "Nasalization — hold 2 counts on ن or م" },
  { name: "Qalqalah", arabic: "قَلْقَلَة", color: "#DD00DD", desc: "Echo bounce on ق ط ب ج د when at rest" },
  { name: "Idgham",   arabic: "إِدْغَام",  color: "#169200", desc: "Merging — noon/tanwin into following letter" },
  { name: "Iqlab",    arabic: "إِقْلَاب",  color: "#26BFFD", desc: "Transform noon/tanwin to mim before ب" },
  { name: "Ikhfa'",   arabic: "إِخْفَاء",  color: "#C8A000", desc: "Concealment — partial nasalization, 15 letters" },
  { name: "Madd",     arabic: "مَد",       color: "#DD0008", desc: "Prolongation — 2, 4, or 6 counts depending on type" },
  { name: "Silent",   arabic: "سَاكِن",    color: "#AAAAAA", desc: "Silent letter — not pronounced in recitation" },
];

/* ── Strip quranic markers for clean copy text ───────────────── */
function stripQuranicMarkers(text: string): string {
  return text
    .replace(/[\u06D6-\u06DC]/g, '')        // tajweed marks
    .replace(/\u06DD[\u0660-\u0669]*/g, '') // ۝ + arabic-indic number
    .replace(/[\u06DE\u06E9]/g, '')          // ۞ ۩
    .trim();
}

/* ── Render Arabic text wrapping tajweed marks ───────────────── */
function renderArabicWithTajweed(text: string): React.ReactNode {
  if (!/[\u06D6-\u06DC]/.test(text)) return text;
  return (
    <>
      {Array.from(text).map((ch, i) =>
        /[\u06D6-\u06DC]/.test(ch)
          ? <span key={i} className="tajweed-mark">{ch}</span>
          : ch
      )}
    </>
  );
}

function AyahMarker({
  number, onEnter, onLeave,
}: {
  number: number;
  onEnter?: () => void; onLeave?: () => void;
}) {
  return (
    <span
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="ayah-marker"
      aria-label={`Verse ${number}`}
      role="img"
    >
      {"\u06DD"}{toAr(number)}
    </span>
  );
}

/* ── Single word span ────────────────────────────────────────── */
function ArabicWord({
  word, fontSize, verseNumber,
  onHover, onLeave, onNumberEnter, onNumberLeave,
  memorizeMode, revealed, onReveal, onWordClick,
  showWordByWord,
}: {
  word: QuranWord;
  fontSize: number;
  verseNumber: number;
  onHover: (e: React.MouseEvent, word: QuranWord) => void;
  onLeave: () => void;
  onNumberEnter?: () => void;
  onNumberLeave?: () => void;
  memorizeMode?: boolean;
  revealed?: boolean;
  onReveal?: () => void;
  onWordClick?: (word: QuranWord) => void;
  showWordByWord?: boolean;
}) {
  if (word.char_type_name === "end") {
    return (
      <AyahMarker
        number={verseNumber}
        onEnter={onNumberEnter}
        onLeave={onNumberLeave}
      />
    );
  }
  if (word.char_type_name !== "word") return null;

  const hasTranslation = !!word.translation?.text;
  const wbwTrans = word.translation?.text ?? "";

  if (memorizeMode) {
    return (
      <span
        onClick={onReveal}
        className={cn(
          "inline leading-loose cursor-pointer transition-all duration-300 rounded px-0.5 select-none",
          revealed
            ? "text-foreground"
            : "blur-sm text-foreground/60 hover:blur-[3px] active:blur-none"
        )}
        style={{ fontSize }}
        title={revealed ? wbwTrans : "Tap to reveal"}
      >
        {renderArabicWithTajweed(word.text_uthmani)}{" "}
      </span>
    );
  }

  if (showWordByWord) {
    return (
      <span
        onClick={onWordClick ? () => onWordClick(word) : undefined}
        className="inline-flex flex-col items-center gap-0.5 cursor-pointer group/wbw mx-3"
        style={{ verticalAlign: "middle" }}
      >
        <span
          className="text-foreground group-hover/wbw:text-primary transition-colors duration-150 font-arabic"
          style={{ fontSize }}
        >
          {renderArabicWithTajweed(word.text_uthmani)}
        </span>
        <span
          className="text-muted-foreground group-hover/wbw:text-primary/70 transition-colors duration-150 text-center font-sans"
          style={{ fontSize: Math.max(Math.round(fontSize * 0.36), 11), maxWidth: "5.5rem", lineHeight: 1.3 }}
        >
          {wbwTrans}
        </span>
      </span>
    );
  }

  return (
    <span
      onMouseEnter={hasTranslation ? (e) => onHover(e, word) : undefined}
      onMouseLeave={hasTranslation ? onLeave : undefined}
      onClick={onWordClick ? () => onWordClick(word) : undefined}
      className={cn(
        "inline leading-loose transition-colors duration-100",
        hasTranslation
          ? "cursor-pointer hover:text-primary underline decoration-dotted decoration-muted-foreground/30 underline-offset-[6px] hover:decoration-primary/50"
          : "",
      )}
      style={{ fontSize }}
    >
      {renderArabicWithTajweed(word.text_uthmani)}{" "}
    </span>
  );
}

/* ── Mood picker ─────────────────────────────────────────────── */
function MoodPicker({
  currentMood,
  onSelect,
  onRemove,
}: {
  currentMood: MoodValue | null;
  onSelect: (mood: MoodValue) => void;
  onRemove: () => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          title="Mood tag"
          className={cn(
            "h-7 px-2 rounded-md flex items-center text-muted-foreground transition-colors text-xs",
            currentMood
              ? "text-purple-600 bg-purple-50 dark:bg-purple-950/30"
              : "hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/30"
          )}
        >
          {currentMood
            ? MOOD_OPTIONS.find((m) => m.value === currentMood)?.emoji
            : <Smile className="w-3.5 h-3.5" />}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="flex flex-col gap-1">
          <p className="text-[11px] text-muted-foreground mb-1 px-1">How did this ayah make you feel?</p>
          {MOOD_OPTIONS.map((m) => (
            <button
              key={m.value}
              onClick={() => onSelect(m.value)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors text-left",
                currentMood === m.value
                  ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                  : "hover:bg-muted"
              )}
            >
              <span>{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
          {currentMood && (
            <button
              onClick={onRemove}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-muted mt-1 border-t border-border pt-2"
            >
              <X className="w-3 h-3" />
              Remove mood
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ── Ayah card ───────────────────────────────────────────────── */
function AyahCard({
  verse, surahId, surahName, arabicFont, arabicFontSize, translationFontSize,
  onHoverWord, onLeaveWord,
  onBookmark, onFlag, onNote, onTafsir, onCopy, onShare, onAddToCollection,
  currentMood, onMoodSelect, onMoodRemove,
  memorizeMode, revealedPositions, onRevealWord, onGradeVerse,
  onWordClick, showTransliteration, showWordByWord,
  hasSajda, isNewJuz, isNewHizb, isNewRub, juzNumber, hizbNumber,
  onPin, isPinned, showTajweedColors, isCurrentlyPlaying,
}: {
  verse: QuranVerse;
  surahId: number;
  surahName: string;
  arabicFont: string;
  arabicFontSize: number;
  translationFontSize: number;
  onHoverWord: (e: React.MouseEvent, word: QuranWord) => void;
  onLeaveWord: () => void;
  onBookmark: (v: QuranVerse) => void;
  onFlag: (v: QuranVerse) => void;
  onNote: (v: QuranVerse) => void;
  onTafsir: (v: QuranVerse) => void;
  onAddToCollection: (v: QuranVerse) => void;
  onCopy: (text: string) => void;
  onShare: (v: QuranVerse) => void;
  currentMood: MoodValue | null;
  onMoodSelect: (verse: QuranVerse, mood: MoodValue) => void;
  onMoodRemove: (verse: QuranVerse) => void;
  memorizeMode: boolean;
  revealedPositions: number[];
  onRevealWord: (verseKey: string, position: number) => void;
  onGradeVerse: (verse: QuranVerse, grade: 'correct' | 'needs_review') => void;
  onWordClick: (word: QuranWord) => void;
  showTransliteration?: boolean;
  showWordByWord?: boolean;
  hasSajda: boolean;
  isNewJuz: boolean;
  isNewHizb: boolean;
  isNewRub: boolean;
  juzNumber?: number;
  hizbNumber?: number;
  onPin: (v: QuranVerse) => void;
  isPinned: boolean;
  showTajweedColors?: boolean;
  isCurrentlyPlaying?: boolean;
}) {
  const [numberHovered, setNumberHovered] = useState(false);
  const translations = verse.translations ?? [];
  const words = verse.words ?? [];
  const wordWords = words.filter(w => w.char_type_name === 'word');
  const allRevealed = memorizeMode && wordWords.length > 0 && wordWords.every(w => revealedPositions.includes(w.position));

  return (
    <div
      className={cn(
        "group relative transition-colors duration-200",
        numberHovered && "bg-amber-500/[0.06] dark:bg-amber-400/[0.07]",
        isCurrentlyPlaying && "bg-emerald-500/[0.05] dark:bg-emerald-400/[0.06]"
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-0.5 rounded-full transition-all duration-200",
          isCurrentlyPlaying
            ? "opacity-100 bg-emerald-500 animate-pulse w-1"
            : numberHovered ? "opacity-100 bg-amber-500/60" : "opacity-0 bg-amber-500/60"
        )}
      />

      {/* Mood badge */}
      {currentMood && (
        <div className="absolute top-3 left-4 text-base">
          {MOOD_OPTIONS.find(m => m.value === currentMood)?.emoji}
        </div>
      )}

      {/* Juz / Hizb strip */}
      {(isNewJuz || isNewHizb) && (
        <JuzHizbStrip isNewJuz={isNewJuz} isNewHizb={isNewHizb} juzNumber={juzNumber} hizbNumber={hizbNumber} />
      )}

      {/* Sajda badge */}
      {hasSajda && !memorizeMode && <SajdaBadge />}

      {/* Arabic block */}
      <div
        className="w-full py-5 px-4 sm:px-8 font-arabic text-foreground text-right"
        dir="rtl"
        style={{ fontSize: arabicFontSize, lineHeight: showWordByWord ? 4 : 2.2, fontFamily: getArabicFontFamily(arabicFont) }}
      >
        {isNewRub && <RubElHizb />}
        {showTajweedColors && verse.text_uthmani_tajweed && !memorizeMode ? (
          <span
            className="tajweed-text"
            dangerouslySetInnerHTML={{ __html: verse.text_uthmani_tajweed }}
          />
        ) : (
          words.map((word) => (
            <Fragment key={`${verse.id}-${word.id ?? word.position}`}>
              {word.char_type_name === 'end' && hasSajda && <SajdaMark />}
              <ArabicWord
                word={word}
                fontSize={arabicFontSize}
                verseNumber={verse.verse_number}
                onHover={onHoverWord}
                onLeave={onLeaveWord}
                onNumberEnter={() => setNumberHovered(true)}
                onNumberLeave={() => setNumberHovered(false)}
                memorizeMode={memorizeMode}
                revealed={revealedPositions.includes(word.position)}
                onReveal={() => onRevealWord(verse.verse_key, word.position)}
                onWordClick={!memorizeMode ? onWordClick : undefined}
                showWordByWord={showWordByWord && !memorizeMode}
              />
            </Fragment>
          ))
        )}
      </div>

      {/* Blind memorize grade buttons */}
      {memorizeMode && allRevealed && (
        <div className="flex items-center gap-3 px-4 sm:px-8 pb-4 pt-1">
          <Button
            size="sm"
            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => onGradeVerse(verse, 'correct')}
          >
            ✓ Got it
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-2 border-orange-400 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30"
            onClick={() => onGradeVerse(verse, 'needs_review')}
          >
            🔄 Need more practice
          </Button>
        </div>
      )}

      {/* Translations (stacked, one per selected translation) */}
      {!memorizeMode && translations.length > 0 && (
        <div className="border-t border-border/30">
          {translations.map((t, i) => {
            const text = t.text?.replace(/<[^>]*>?/gm, "") ?? "";
            if (!text) return null;
            const name = getTranslationName(t.id);
            const author = getTranslationAuthor(t.id);
            return (
              <div
                key={t.id}
                className={cn(
                  "px-4 sm:px-8 py-3 text-muted-foreground leading-relaxed",
                  i > 0 && "border-t border-border/20"
                )}
                style={{ fontSize: translationFontSize }}
              >
                {translations.length > 1 && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-medium text-primary/50 uppercase tracking-wide">{name}</span>
                    {author && <span className="text-[10px] text-muted-foreground/50">— {author}</span>}
                  </div>
                )}
                <span
                  className={cn(
                    "font-medium mr-2 text-sm transition-colors duration-200 tabular-nums",
                    numberHovered ? "text-amber-600/80 dark:text-amber-400/80" : "text-primary/50"
                  )}
                >
                  {i === 0 ? `${verse.verse_number}.` : ""}
                </span>
                {text}
              </div>
            );
          })}
        </div>
      )}

      {/* Transliteration */}
      {showTransliteration && verse.transliteration && !memorizeMode && (
        <div
          className="px-4 sm:px-8 pb-4 text-muted-foreground/70 text-sm italic leading-relaxed"
          style={{ fontSize: Math.max(translationFontSize - 2, 12) }}
        >
          {verse.transliteration}
        </div>
      )}

      {/* Actions */}
      <div
        className={cn(
          "flex items-center gap-0.5 px-4 sm:px-8 pb-3 transition-opacity duration-150",
          numberHovered ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <ActionBtn title="Bookmark" onClick={() => onBookmark(verse)} icon={<Bookmark className="w-3.5 h-3.5" />} />
        <ActionBtn title="Add to Collection" onClick={() => onAddToCollection(verse)} icon={<FolderHeart className="w-3.5 h-3.5" />} color="emerald" />
        <ActionBtn title="Flag as hard" onClick={() => onFlag(verse)} icon={<Flag className="w-3.5 h-3.5" />} color="amber" />
        <ActionBtn title="Add note" onClick={() => onNote(verse)} icon={<FileText className="w-3.5 h-3.5" />} color="blue" />
        <ActionBtn
          title={isPinned ? "Unpin verse" : "Pin verse"}
          onClick={() => onPin(verse)}
          icon={isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
          color={isPinned ? "amber" : undefined}
        />
        <ActionBtn
          title="Copy verse"
          onClick={() => {
            const trans = verse.translations?.[0]?.text?.replace(/<[^>]*>?/gm, "") ?? "";
            const ref = `— ${surahName} ${surahId}:${verse.verse_number}`;
            onCopy(trans ? `${stripQuranicMarkers(verse.text_uthmani)}\n"${trans}"\n${ref}` : `${stripQuranicMarkers(verse.text_uthmani)}\n${ref}`);
          }}
          icon={<Copy className="w-3.5 h-3.5" />}
        />
        <ActionBtn title="Share verse" onClick={() => onShare(verse)} icon={<Share2 className="w-3.5 h-3.5" />} />
        <ActionBtn title="Tafsir" onClick={() => onTafsir(verse)} icon={<><Info className="w-3.5 h-3.5" /><span className="hidden sm:inline text-xs ml-1">Tafsir</span></>} />
        <MoodPicker
          currentMood={currentMood}
          onSelect={(mood) => onMoodSelect(verse, mood)}
          onRemove={() => onMoodRemove(verse)}
        />
      </div>

      <div className="h-px bg-border/40 mx-4 sm:mx-8" />
    </div>
  );
}

function ActionBtn({
  title, onClick, icon, color,
}: {
  title: string; onClick: () => void; icon: React.ReactNode; color?: "amber" | "blue" | "emerald";
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={cn(
        "h-7 px-2 rounded-md flex items-center text-muted-foreground transition-colors text-xs",
        color === "amber" && "hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30",
        color === "blue" && "hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30",
        color === "emerald" && "hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
        !color && "hover:text-primary hover:bg-primary/8"
      )}
    >
      {icon}
    </button>
  );
}

/* ── Add to Collection dialog ────────────────────────────────── */
function AddToCollectionDialog({
  open, onClose, verse, surahId, surahNameEn,
}: {
  open: boolean;
  onClose: () => void;
  verse: QuranVerse | null;
  surahId: number;
  surahNameEn: string;
}) {
  const { isSignedIn } = useAuth();
  const { toast } = useToast();
  const { data: collections, refetch } = useGetCollections({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: { enabled: !!isSignedIn && open } as any,
  });
  const createCollection = useCreateCollection();
  const addVerse = useAddVerseToCollection();
  const [newName, setNewName] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [busy, setBusy] = useState<number | "new" | null>(null);

  const handleAdd = async (collectionId: number) => {
    if (!verse) return;
    setBusy(collectionId);
    try {
      const translation = (verse.translations?.[0]?.text ?? "").replace(/<[^>]*>?/gm, "").slice(0, 500);
      await addVerse.mutateAsync({
        id: collectionId,
        data: {
          verseKey: verse.verse_key,
          surahId,
          ayahNumber: verse.verse_number,
          surahNameEn,
          ayahText: verse.text_uthmani.slice(0, 1000),
          translation: translation || undefined,
        },
      });
      toast({ title: "Added to collection ✓" });
      onClose();
    } catch {
      toast({ title: "Already in this collection or failed", variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !verse) return;
    setBusy("new");
    try {
      const col = await createCollection.mutateAsync({ data: { name: newName.trim() } });
      await refetch();
      setNewName("");
      setShowNew(false);
      await handleAdd(col.id);
    } catch {
      toast({ title: "Failed to create collection", variant: "destructive" });
      setBusy(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderHeart className="w-4 h-4 text-primary" />
            Add to Collection
          </DialogTitle>
        </DialogHeader>
        {verse && (
          <p className="text-xs text-muted-foreground">
            {surahNameEn} · {verse.verse_number}
          </p>
        )}
        <div className="space-y-2 mt-1">
          {(!collections || collections.length === 0) && !showNew && (
            <p className="text-sm text-muted-foreground py-2 text-center">No collections yet.</p>
          )}
          {collections?.map((col) => (
            <button
              key={col.id}
              onClick={() => handleAdd(col.id)}
              disabled={busy !== null}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-left"
            >
              <FolderHeart className="w-4 h-4 text-primary shrink-0" />
              <span className="flex-1 text-sm font-medium truncate">{col.name}</span>
              <span className="text-xs text-muted-foreground">{col.verseCount}</span>
              {busy === col.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            </button>
          ))}
        </div>
        {showNew ? (
          <form onSubmit={handleCreate} className="flex gap-2 mt-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Collection name"
              autoFocus
              className="flex-1 h-9"
              maxLength={100}
            />
            <Button type="submit" size="sm" disabled={!newName.trim() || busy !== null} className="gap-1">
              {busy === "new" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Create
            </Button>
          </form>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNew(true)}
            className="w-full mt-2 gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            New Collection
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ── Rub el Hizb inline marker ۞ ────────────────────────────── */
function RubElHizb() {
  return <span className="quranic-inline-mark" aria-hidden="true">{"\u06DE"}</span>;
}

/* ── Sajda inline mark ۩ ─────────────────────────────────────── */
function SajdaMark() {
  return <span className="quranic-inline-mark" aria-hidden="true">{"\u06E9"}</span>;
}

/* ── Sajda badge pill ────────────────────────────────────────── */
function SajdaBadge() {
  return (
    <div className="flex justify-end px-4 sm:px-8 pt-3 pb-0">
      <span
        className="inline-flex items-center gap-1.5 border rounded-full px-3 py-0.5 text-[11px] font-medium select-none"
        style={{ color: "var(--ayah-marker-color)", borderColor: "var(--ayah-marker-color)" }}
      >
        <span className="font-arabic text-sm">سَجْدَة</span>
        <span className="opacity-40">·</span>
        Prostration required
      </span>
    </div>
  );
}

/* ── Juz / Hizb strip ────────────────────────────────────────── */
function JuzHizbStrip({ isNewJuz, isNewHizb, juzNumber, hizbNumber }: {
  isNewJuz: boolean; isNewHizb: boolean; juzNumber?: number; hizbNumber?: number;
}) {
  const pill = (label: string, key: string) => (
    <span
      key={key}
      className="inline-flex items-center border rounded-full px-2.5 py-0.5 font-arabic select-none"
      style={{
        color: "var(--ayah-marker-color)",
        borderColor: "var(--ayah-marker-color)",
        fontSize: "0.68rem",
        fontFamily: "'Scheherazade New', serif",
      }}
    >
      {label}
    </span>
  );
  return (
    <div className="flex items-center justify-end gap-1.5 px-4 sm:px-8 pt-3 pb-0" dir="rtl">
      {isNewJuz && pill(`الجزء ${toAr(juzNumber ?? 0)}`, "juz")}
      {isNewHizb && pill(`الحزب ${toAr(hizbNumber ?? 0)}`, "hizb")}
    </div>
  );
}

/* ── Full-page (Mushaf) mode ─────────────────────────────────── */
function FullPageView({
  verses, arabicFontSize, onHoverWord, onLeaveWord, onWordClick, showWordByWord,
}: {
  verses: QuranVerse[];
  arabicFontSize: number;
  onHoverWord: (e: React.MouseEvent, word: QuranWord) => void;
  onLeaveWord: () => void;
  onWordClick: (word: QuranWord) => void;
  showWordByWord?: boolean;
}) {
  return (
    <div
      className="w-full py-8 px-4 sm:px-12 font-arabic text-foreground text-right leading-loose"
      dir="rtl"
      style={{ fontSize: arabicFontSize, lineHeight: showWordByWord ? 4 : 2.4, textAlign: "justify" }}
    >
      {verses.map((verse, vIdx) => {
        const prevVerse = vIdx > 0 ? verses[vIdx - 1] : null;
        const isNewRub = prevVerse !== null && verse.rub_el_hizb_number !== prevVerse.rub_el_hizb_number;
        return (
          <Fragment key={verse.id}>
            {isNewRub && <RubElHizb />}
            {(verse.words ?? []).map((word) => {
              if (word.char_type_name === "end") {
                return (
                  <AyahMarker
                    key={`${verse.id}-end`}
                    number={verse.verse_number}
                  />
                );
              }
              if (word.char_type_name !== "word") return null;
              if (showWordByWord) {
                return (
                  <span
                    key={`${verse.id}-${word.id ?? word.position}`}
                    onClick={() => onWordClick(word)}
                    className="inline-flex flex-col items-center gap-0.5 cursor-pointer group/wbw mx-3"
                    style={{ verticalAlign: "middle" }}
                  >
                    <span
                      className="text-foreground group-hover/wbw:text-primary transition-colors duration-150 font-arabic"
                      style={{ fontSize: arabicFontSize }}
                    >
                      {renderArabicWithTajweed(word.text_uthmani)}
                    </span>
                    <span
                      className="text-muted-foreground group-hover/wbw:text-primary/70 transition-colors duration-150 text-center font-sans"
                      style={{ fontSize: Math.max(Math.round(arabicFontSize * 0.36), 11), maxWidth: "5.5rem", lineHeight: 1.3 }}
                    >
                      {word.translation?.text ?? ""}
                    </span>
                  </span>
                );
              }
              return (
                <span
                  key={`${verse.id}-${word.id ?? word.position}`}
                  onMouseEnter={word.translation?.text ? (e) => onHoverWord(e, word) : undefined}
                  onMouseLeave={word.translation?.text ? onLeaveWord : undefined}
                  onClick={() => onWordClick(word)}
                  className="inline cursor-pointer hover:text-primary transition-colors duration-150"
                  style={{ fontSize: arabicFontSize }}
                >
                  {renderArabicWithTajweed(word.text_uthmani)}{" "}
                </span>
              );
            })}
          </Fragment>
        );
      })}
    </div>
  );
}

/* ── Share-card helpers ──────────────────────────────────────── */

async function downloadVerseCard(
  verse: QuranVerse,
  surahName: string,
  surahId: number,
  theme: (typeof SHARE_THEMES)[number],
) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  await document.fonts.ready;

  const arabic     = stripQuranicMarkers(verse.text_uthmani);
  const translation = (verse.translations?.[0]?.text ?? "").replace(/<[^>]*>?/gm, "");
  const ref        = `${surahName} · ${surahId}:${verse.verse_number}`;
  const maxW       = 920;

  // Background
  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, 1080, 1080);

  // Border
  ctx.strokeStyle = theme.accent;
  ctx.lineWidth = 4;
  ctx.strokeRect(44, 44, 992, 992);

  // Logo / brand
  ctx.textAlign = "center";
  ctx.font      = "bold 28px system-ui, sans-serif";
  ctx.fillStyle = theme.accent;
  ctx.fillText("NoorAl", 540, 120);

  ctx.strokeStyle = theme.accent + "33";
  ctx.lineWidth   = 1;
  ctx.beginPath(); ctx.moveTo(200, 155); ctx.lineTo(880, 155); ctx.stroke();

  // Arabic text (RTL)
  ctx.direction = "rtl";
  ctx.textAlign = "center";
  ctx.fillStyle = theme.fg;
  ctx.font      = "bold 52px 'Scheherazade New', serif";

  const arabicWords = arabic.split(" ");
  const arabicLines: string[] = [];
  let aLine = "";
  for (const w of arabicWords) {
    const test = aLine ? `${aLine} ${w}` : w;
    if (ctx.measureText(test).width > maxW && aLine) { arabicLines.push(aLine); aLine = w; }
    else aLine = test;
  }
  if (aLine) arabicLines.push(aLine);

  const aLineH   = 88;
  const aTotalH  = arabicLines.length * aLineH;
  let y          = 520 - aTotalH / 2;
  for (const line of arabicLines) { ctx.fillText(line, 540, y); y += aLineH; }

  // Translation
  if (translation) {
    ctx.direction = "ltr";
    ctx.font      = "26px system-ui, sans-serif";
    ctx.fillStyle = theme.fg + "BB";

    const tWords = translation.split(" ");
    const tLines: string[] = [];
    let tLine = "";
    for (const w of tWords) {
      const test = tLine ? `${tLine} ${w}` : w;
      if (ctx.measureText(test).width > maxW * 0.85 && tLine) { tLines.push(tLine); tLine = w; }
      else tLine = test;
    }
    if (tLine) tLines.push(tLine);
    y += 20;
    for (const tl of tLines) { ctx.fillText(`"${tl}"`, 540, y); y += 42; }
  }

  // Reference
  ctx.font      = "bold 22px system-ui, sans-serif";
  ctx.fillStyle = theme.accent;
  ctx.fillText(`— ${ref}`, 540, y + 30);

  // Bottom rule
  ctx.strokeStyle = theme.accent + "33";
  ctx.lineWidth   = 1;
  ctx.beginPath(); ctx.moveTo(200, 950); ctx.lineTo(880, 950); ctx.stroke();
  ctx.font      = "18px system-ui, sans-serif";
  ctx.fillStyle = theme.fg + "44";
  ctx.fillText("NoorAl · Your Quran Companion", 540, 990);

  const link    = document.createElement("a");
  link.download = `nooral-${surahId}-${verse.verse_number}.png`;
  link.href     = canvas.toDataURL("image/png");
  link.click();
}

function ShareCardModal({
  verse,
  surahName,
  surahId,
  onCopyText,
}: {
  verse: QuranVerse | null;
  surahName: string;
  surahId: number;
  onCopyText: (text: string) => void;
}) {
  const [selectedTheme, setSelectedTheme] = useState<string>("classic");
  const [downloading, setDownloading] = useState(false);

  if (!verse) return null;

  const t          = SHARE_THEMES.find((s) => s.id === selectedTheme) ?? SHARE_THEMES[0];
  const arabic     = stripQuranicMarkers(verse.text_uthmani);
  const translation = (verse.translations?.[0]?.text ?? "").replace(/<[^>]*>?/gm, "");
  const ref        = `${surahName} ${surahId}:${verse.verse_number}`;

  const handleDownload = async () => {
    setDownloading(true);
    try { await downloadVerseCard(verse, surahName, surahId, t); }
    finally { setDownloading(false); }
  };

  const handleShareText = () => {
    const text = translation
      ? `${arabic}\n"${translation}"\n— ${ref}\n\nNoorAl`
      : `${arabic}\n— ${ref}\n\nNoorAl`;
    if (navigator.share) navigator.share({ text }).catch(() => {});
    else onCopyText(text);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Share Verse
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4 mt-2">
        {/* Theme picker */}
        <div className="flex gap-2">
          {SHARE_THEMES.map((th) => (
            <button
              key={th.id}
              onClick={() => setSelectedTheme(th.id)}
              className={cn(
                "flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all",
                selectedTheme === th.id ? "ring-2 ring-primary border-primary" : "border-border/60",
              )}
              style={{ backgroundColor: th.bg, color: th.fg }}
            >
              {th.label}
            </button>
          ))}
        </div>

        {/* Preview card */}
        <div
          className="rounded-xl p-5 space-y-3"
          style={{ backgroundColor: t.bg, border: `2px solid ${t.accent}` }}
        >
          <p className="text-center text-xs font-bold" style={{ color: t.accent }}>NoorAl</p>
          <p
            className="font-arabic text-right leading-loose"
            dir="rtl"
            style={{ fontSize: 20, color: t.fg, lineHeight: "2" }}
          >
            {arabic}
          </p>
          {translation && (
            <p className="text-xs leading-relaxed text-center italic" style={{ color: t.fg + "CC" }}>
              &ldquo;{translation.slice(0, 200)}{translation.length > 200 ? "…" : ""}&rdquo;
            </p>
          )}
          <p className="text-xs font-semibold text-center" style={{ color: t.accent }}>
            — {ref}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Button className="flex-1 gap-2" onClick={handleDownload} disabled={downloading}>
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download Image
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleShareText}>
            <Share2 className="w-4 h-4" />
            Share Text
          </Button>
        </div>

        {/* Social share links */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Share on</p>
          <div className="flex gap-2">
            {[
              {
                label: "WhatsApp",
                color: "#25D366",
                href: () => {
                  const text = translation
                    ? `${arabic}\n"${translation}"\n— ${ref}\n\nNoorAl`
                    : `${arabic}\n— ${ref}\n\nNoorAl`;
                  return `https://wa.me/?text=${encodeURIComponent(text)}`;
                },
              },
              {
                label: "X",
                color: "#000000",
                href: () => {
                  const text = translation
                    ? `"${translation.slice(0, 140)}" — ${ref} | #Quran #NoorAl`
                    : `${arabic} — ${ref} | #Quran #NoorAl`;
                  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                },
              },
              {
                label: "Telegram",
                color: "#2AABEE",
                href: () => {
                  const text = translation
                    ? `${arabic}\n"${translation}"\n— ${ref}`
                    : `${arabic}\n— ${ref}`;
                  return `https://t.me/share/url?url=https://nooral.app&text=${encodeURIComponent(text)}`;
                },
              },
            ].map(({ label, color, href }) => (
              <a
                key={label}
                href={href()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 rounded-lg text-xs font-semibold text-white text-center transition-opacity hover:opacity-90"
                style={{ backgroundColor: color }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Main reader ─────────────────────────────────────────────── */
export default function ReaderPage() {
  useSEO("Quran Reader", "Read the Holy Quran with Uthmanic script, word-by-word translations, tafsir, and audio recitation.");

  const search = useSearch();
  const params = new URLSearchParams(search);
  const initSurah = Math.min(114, Math.max(1, parseInt(params.get("surah") ?? "1") || 1));

  const initPage = parseInt(params.get("page") ?? "0") || 0;

  const [surahId, setSurahId] = useState<number>(initSurah);
  const [jumpInput, setJumpInput] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(initPage);
  const { data: surahs, isLoading: surahsLoading } = useSurahs();
  const {
    activeTranslations, arabicFont, arabicFontSize, translationFontSize, language,
    setAudioSurahId, setIsPlaying, setLastRead,
    surahDisplayModes, setSurahDisplayMode,
    showTransliteration, setShowTransliteration,
    showWordByWord, setShowWordByWord,
    tafsirSourceId, setTafsirSourceId,
    audioCurrentAyah, audioSurahId: playingSurahId, isPlaying: audioIsPlaying,
  } = useAppStore();

  const pageMode = currentPage > 0;
  const { data: verses, isLoading: versesLoading } = useVersesByChapter(surahId, activeTranslations, showTransliteration && !pageMode);
  const { data: pageVerses, isLoading: pageVersesLoading } = useVersesByPage(currentPage, pageMode);
  const displayVerses = pageMode ? (pageVerses ?? []) : (verses ?? []);
  const displayLoading = pageMode ? pageVersesLoading : versesLoading;
  const { toast } = useToast();
  const { isSignedIn } = useAuth();

  const [wordTip, setWordTip] = useState<TooltipState | null>(null);
  const [tafsirOpen, setTafsirOpen] = useState(false);
  const [tafsirContent, setTafsirContent] = useState<{ ayah: string; text: string } | null>(null);
  const [tafsirLoading, setTafsirLoading] = useState(false);
  const [activeTafsirId, setActiveTafsirId] = useState<number>(169);
  const [currentTafsirVerseKey, setCurrentTafsirVerseKey] = useState<string | null>(null);
  const [tafsirTab, setTafsirTab] = useState<"tafsir" | "reflections">("tafsir");
  const [reflections, setReflections] = useState<QuranReflection[]>([]);
  const [reflectionsLoading, setReflectionsLoading] = useState(false);
  const [shareVerse, setShareVerse] = useState<QuranVerse | null>(null);
  const [collectionVerse, setCollectionVerse] = useState<QuranVerse | null>(null);
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [activeVerseForNote, setActiveVerseForNote] = useState<QuranVerse | null>(null);

  const [memorizeMode, setMemorizeMode] = useState(false);
  const [revealedWords, setRevealedWords] = useState<Record<string, number[]>>({});
  const [showTajweedColors, setShowTajweedColors] = useState(false);

  const [wordPanel, setWordPanel] = useState<{ word: QuranWord; verseKey: string } | null>(null);
  const [wordOccurrences, setWordOccurrences] = useState<Awaited<ReturnType<typeof fetchWordOccurrences>>>([]);
  const [wordOccurrencesLoading, setWordOccurrencesLoading] = useState(false);
  const [wordMorphology, setWordMorphology] = useState<WordMorphology | null>(null);
  const [wordMorphologyLoading, setWordMorphologyLoading] = useState(false);
  const [surahInfoOpen, setSurahInfoOpen] = useState(false);
  const [surahInfoData, setSurahInfoData] = useState<SurahInfo | null>(null);
  const [surahInfoLoading, setSurahInfoLoading] = useState(false);

  const handleOpenSurahInfo = useCallback(async () => {
    setSurahInfoOpen(true);
    if (surahInfoData?.surahId === surahId) return;
    setSurahInfoData(null);
    setSurahInfoLoading(true);
    const info = await fetchSurahInfo(surahId);
    setSurahInfoData(info);
    setSurahInfoLoading(false);
  }, [surahId, surahInfoData]);

  const [surahFilters, setSurahFilters] = useState<QuranFilter[]>([]);
  const filteredSurahs = surahs ? applySurahFilters(surahs as any, surahFilters) : [];

  const [pendingScrollAyah, setPendingScrollAyah] = useState<number | null>(null);

  const createBookmark = useCreateBookmark();
  const flagHardAyah = useFlagHardAyah();
  const markMemorized = useMarkAyahMemorized();
  const createNote = useCreateNote();
  const saveLastRead = useSaveLastRead();
  const saveMood = useSaveMood();
  const deleteMood = useDeleteMood();
  const logReading = useLogReading();
  const pinVerse = usePinVerse();
  const unpinVerse = useUnpinVerse();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: pinnedVerses, refetch: refetchPins } = useGetPinnedVerses({ query: { enabled: !!isSignedIn } as any });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: moodData, refetch: refetchMoods } = useGetMoods(
    { surahId } as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { query: { enabled: !!isSignedIn } as any }
  );

  const moodMap: Record<number, MoodValue> = {};
  if (moodData) {
    for (const m of moodData) {
      if (m.surahId === surahId) moodMap[m.ayahNumber] = m.mood as MoodValue;
    }
  }

  const displayMode = surahDisplayModes[surahId] ?? 'ayah';
  const fullPageMode = displayMode === 'full';
  const tafsirMode   = displayMode === 'tafsir';
  const topRef = useRef<HTMLDivElement>(null);

  const { data: tafsirMap, isLoading: tafsirLoading2 } = useTafsirByChapter(
    surahId, tafsirSourceId, tafsirMode
  );

  useEffect(() => {
    if (surahs && surahId) {
      setLastRead(surahId, 1);
      const surahName = surahs?.find((s: any) => s.id === surahId)?.name_simple ?? "";
      if (isSignedIn) {
        saveLastRead.mutate({
          data: { surahId, ayahNumber: 1, surahNameEn: surahName },
        });
        logReading.mutate({ data: { surahId, surahNameEn: surahName, ayahCount: 1 } });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surahId, isSignedIn, surahs]);

  useEffect(() => {
    if (!pendingScrollAyah || displayLoading || !displayVerses?.length) return;
    const el = document.getElementById(`ayah-${pendingScrollAyah}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setPendingScrollAyah(null);
    }
  }, [pendingScrollAyah, displayLoading, displayVerses]);

  useEffect(() => {
    if (pendingScrollAyah) return;
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setRevealedWords({});
  }, [surahId]);

  const currentSurah = surahs?.find((s: any) => s.id === surahId);

  const handleHoverWord = useCallback((e: React.MouseEvent, word: QuranWord) => {
    if (wordPanel || showWordByWord) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setWordTip({
      arabic: word.text_uthmani,
      translation: word.translation?.text ?? "",
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  }, [wordPanel, showWordByWord]);

  const handleLeaveWord = useCallback(() => setWordTip(null), []);

  const handleWordClick = useCallback(async (word: QuranWord) => {
    if (word.char_type_name !== 'word') return;
    setWordPanel({ word, verseKey: "" });
    setWordOccurrences([]);
    setWordMorphology(null);
    setWordOccurrencesLoading(true);
    setWordMorphologyLoading(true);

    // Fetch morphology and occurrences in parallel
    const morphPromise = (word.verse_key && word.position)
      ? fetchWordMorphology(word.verse_key, word.position)
      : Promise.resolve(null);

    const occPromise = word.translation?.text
      ? fetchWordOccurrences(word.translation.text)
      : Promise.resolve([]);

    const [morph, occs] = await Promise.allSettled([morphPromise, occPromise]);
    setWordMorphology(morph.status === 'fulfilled' ? morph.value : null);
    setWordMorphologyLoading(false);
    setWordOccurrences(occs.status === 'fulfilled' ? occs.value : []);
    setWordOccurrencesLoading(false);
  }, []);

  const requireAuth = (action: () => void) => {
    if (!isSignedIn) {
      toast({ title: "Sign in required", description: "Please sign in to use this feature." });
      return;
    }
    action();
  };

  const handleBookmark = (verse: QuranVerse) =>
    requireAuth(async () => {
      try {
        await createBookmark.mutateAsync({
          data: {
            surahId,
            ayahNumber: verse.verse_number,
            surahNameEn: currentSurah?.name_simple ?? "",
            ayahText: verse.text_uthmani,
          },
        });
        toast({ title: "Bookmarked ✓", description: `${currentSurah?.name_simple} : ${verse.verse_number}` });
      } catch {
        toast({ title: "Failed to bookmark", variant: "destructive" });
      }
    });

  const handleFlag = (verse: QuranVerse) =>
    requireAuth(async () => {
      try {
        await flagHardAyah.mutateAsync({
          data: {
            surahId,
            ayahNumber: verse.verse_number,
            surahNameEn: currentSurah?.name_simple ?? "",
          },
        });
        toast({ title: "Flagged for review ✓" });
      } catch {
        toast({ title: "Failed to flag", variant: "destructive" });
      }
    });

  const handleNote = (verse: QuranVerse) => {
    setActiveVerseForNote(verse);
    setNoteOpen(true);
  };

  const handleSaveNote = async () => {
    if (!activeVerseForNote || !noteText.trim()) return;
    if (!isSignedIn) { toast({ title: "Sign in required" }); return; }
    try {
      await createNote.mutateAsync({
        data: {
          surahId,
          ayahNumber: activeVerseForNote.verse_number,
          content: noteText,
          surahNameEn: currentSurah?.name_simple ?? "",
        },
      });
      toast({ title: "Note saved ✓" });
      setNoteOpen(false);
      setNoteText("");
    } catch {
      toast({ title: "Failed to save note", variant: "destructive" });
    }
  };

  const openTafsir = async (verse: QuranVerse) => {
    setTafsirOpen(true);
    setTafsirLoading(true);
    setTafsirContent(null);
    setCurrentTafsirVerseKey(verse.verse_key);
    try {
      const tafsir = await fetchTafsir(activeTafsirId, verse.verse_key);
      setTafsirContent({ ayah: verse.verse_key, text: tafsir.text });
    } catch {
      toast({ title: "Failed to load tafsir", variant: "destructive" });
    } finally {
      setTafsirLoading(false);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied ✓" });
  };

  // Re-fetch tafsir whenever the user switches source
  useEffect(() => {
    if (!currentTafsirVerseKey || !tafsirOpen) return;
    setTafsirLoading(true);
    setTafsirContent(null);
    fetchTafsir(activeTafsirId, currentTafsirVerseKey)
      .then((t) => setTafsirContent({ ayah: currentTafsirVerseKey, text: t.text }))
      .catch(() => toast({ title: "Failed to load tafsir", variant: "destructive" }))
      .finally(() => setTafsirLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTafsirId]);

  // Fetch QuranReflect community reflections when tab switches
  useEffect(() => {
    if (!tafsirOpen || tafsirTab !== "reflections" || !currentTafsirVerseKey) return;
    const [sid, an] = currentTafsirVerseKey.split(":").map(Number);
    if (!sid || !an) return;
    setReflectionsLoading(true);
    setReflections([]);
    fetchQuranReflections(sid, an)
      .then(setReflections)
      .finally(() => setReflectionsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tafsirTab, tafsirOpen, currentTafsirVerseKey]);

  const handleAddToCollection = (verse: QuranVerse) =>
    requireAuth(() => {
      setCollectionVerse(verse);
      setCollectionDialogOpen(true);
    });

  const handleShareVerse = (verse: QuranVerse) => {
    setShareVerse(verse);
  };

  const navigate = (delta: number) => {
    const next = Math.max(1, Math.min(114, surahId + delta));
    setSurahId(next);
  };

  const handleRevealWord = useCallback((verseKey: string, position: number) => {
    setRevealedWords(prev => {
      const current = prev[verseKey] ?? [];
      if (current.includes(position)) return prev;
      return { ...prev, [verseKey]: [...current, position] };
    });
  }, []);

  const handleGradeVerse = useCallback(async (verse: QuranVerse, grade: 'correct' | 'needs_review') => {
    if (!isSignedIn) { toast({ title: "Sign in required" }); return; }
    try {
      if (grade === 'correct') {
        await markMemorized.mutateAsync({ data: { surahId, ayahNumber: verse.verse_number, memorized: true } });
        toast({ title: "Marked memorized ✓" });
      } else {
        await flagHardAyah.mutateAsync({ data: { surahId, ayahNumber: verse.verse_number, surahNameEn: currentSurah?.name_simple ?? "" } });
        toast({ title: "Added to review queue 🔄" });
      }
      setRevealedWords(prev => {
        const next = { ...prev };
        delete next[verse.verse_key];
        return next;
      });
    } catch {
      toast({ title: "Failed to save progress", variant: "destructive" });
    }
  }, [isSignedIn, surahId, currentSurah]);

  const handleMoodSelect = useCallback(async (verse: QuranVerse, mood: MoodValue) => {
    if (!isSignedIn) { toast({ title: "Sign in required" }); return; }
    try {
      await saveMood.mutateAsync({ data: { surahId, ayahNumber: verse.verse_number, mood } });
      refetchMoods();
    } catch {
      toast({ title: "Failed to save mood", variant: "destructive" });
    }
  }, [isSignedIn, surahId]);

  const handleMoodRemove = useCallback(async (verse: QuranVerse) => {
    if (!isSignedIn) return;
    const existing = moodData?.find(m => m.surahId === surahId && m.ayahNumber === verse.verse_number);
    if (!existing) return;
    try {
      await deleteMood.mutateAsync({ id: existing.id });
      refetchMoods();
    } catch {
      toast({ title: "Failed to remove mood", variant: "destructive" });
    }
  }, [isSignedIn, surahId, moodData]);

  const handlePin = useCallback(async (verse: QuranVerse) => {
    if (!isSignedIn) { toast({ title: "Sign in required" }); return; }
    const existing = (pinnedVerses as any[])?.find(
      (p: any) => p.surahId === surahId && p.ayahNumber === verse.verse_number
    );
    try {
      if (existing) {
        await unpinVerse.mutateAsync({ id: existing.id });
        toast({ title: "Unpinned" });
      } else {
        const translation = verse.translations?.[0]?.text?.replace(/<[^>]*>?/gm, "") ?? "";
        await pinVerse.mutateAsync({
          data: {
            surahId,
            ayahNumber: verse.verse_number,
            surahNameEn: currentSurah?.name_simple ?? "",
            ayahText: verse.text_uthmani,
            translation,
          },
        });
        toast({ title: "Pinned ✓", description: `${currentSurah?.name_simple} ${verse.verse_number}` });
      }
      refetchPins();
    } catch (err: any) {
      toast({ title: err?.message?.includes("Maximum") ? "Max 10 pins reached" : "Failed to pin", variant: "destructive" });
    }
  }, [isSignedIn, surahId, currentSurah, pinnedVerses]);

  const showBismillah = surahId !== 1 && surahId !== 9;

  const setDisplayMode = (mode: 'ayah' | 'full' | 'tafsir') => {
    setSurahDisplayMode(surahId, mode);
  };

  return (
    <div className="relative min-h-screen">
      <WordTooltipOverlay tip={wordTip} />

      <div ref={topRef} className="container mx-auto px-3 sm:px-6 py-6 max-w-4xl">

        {/* ── Selector bar ── */}
        <div className="flex items-center gap-2 mb-6 bg-card p-3 rounded-2xl shadow-sm border border-border overflow-x-auto scrollbar-none" style={{ scrollbarWidth: "none" }}>
          <div className="flex-1 min-w-0">
            {surahsLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select value={surahId.toString()} onValueChange={(v) => setSurahId(parseInt(v))}>
                <SelectTrigger className="w-full text-base font-medium h-10">
                  <SelectValue placeholder="Select Surah" />
                </SelectTrigger>
                <SelectContent className="max-h-72 overflow-y-auto">
                  {filteredSurahs.length === 0 ? (
                    <div className="py-4 text-center text-xs text-muted-foreground">No surahs match filters</div>
                  ) : filteredSurahs.map((s: any) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      <span className="font-medium text-muted-foreground mr-2 tabular-nums">{s.id}.</span>
                      {s.name_simple}
                      <span className="ml-2 font-arabic text-muted-foreground text-sm">{s.name_arabic}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

            {/* Juz selector */}
          <Select
            value=""
            onValueChange={(v) => {
              const juz = JUZ_MAP.find(j => j.juz === parseInt(v));
              if (juz) { setSurahId(juz.surah); setPendingScrollAyah(juz.ayah); }
            }}
          >
            <SelectTrigger className="w-[90px] sm:w-[100px] h-10 text-sm shrink-0">
              <SelectValue placeholder="Juz…" />
            </SelectTrigger>
            <SelectContent className="max-h-72 overflow-y-auto">
              {JUZ_MAP.map(j => (
                <SelectItem key={j.juz} value={j.juz.toString()}>
                  <span className="font-medium tabular-nums text-muted-foreground mr-1">{j.juz}.</span>
                  {j.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filter (with Hizb nav inside) */}
          <SurahFilterBar
            filters={surahFilters}
            setFilters={setSurahFilters}
            onHizbNav={(_hizb, surah, ayah) => {
              setSurahId(surah);
              setPendingScrollAyah(ayah);
            }}
          />

          {/* Transliteration toggle */}
          <Button
            variant={showTransliteration ? "secondary" : "ghost"}
            size="icon"
            className={cn("h-9 w-9 shrink-0", showTransliteration && "text-primary")}
            title={showTransliteration ? "Hide transliteration" : "Show transliteration"}
            onClick={() => setShowTransliteration(!showTransliteration)}
          >
            <Pilcrow className="w-4 h-4" />
          </Button>

          {/* Word by word toggle */}
          <Button
            variant={showWordByWord ? "secondary" : "ghost"}
            size="icon"
            className={cn("h-9 w-9 shrink-0", showWordByWord && "text-primary")}
            title={showWordByWord ? "Hide word translations" : "Show word-by-word translation"}
            onClick={() => setShowWordByWord(!showWordByWord)}
          >
            <Languages className="w-4 h-4" />
          </Button>

          {/* Page navigation (only in Reading/page mode) */}
          {fullPageMode && (
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                title="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <input
                type="number"
                min={1}
                max={604}
                value={currentPage > 0 ? currentPage : ""}
                placeholder="Page"
                onChange={e => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v) && v >= 1 && v <= 604) setCurrentPage(v);
                  else if (e.target.value === "") setCurrentPage(0);
                }}
                className="w-[56px] h-8 rounded-lg border border-input bg-background text-center text-xs tabular-nums focus:outline-none focus:ring-1 focus:ring-primary px-1"
                title="Navigate to Mushaf page (1–604)"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage >= 604}
                onClick={() => setCurrentPage(p => Math.min(604, (p || 0) + 1))}
                title="Next page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}

          {/* Display mode: Translation | Reading | Tafsir */}
          <div className="flex items-center gap-0.5 bg-muted/60 rounded-lg p-0.5 shrink-0">
            <Button
              variant={displayMode === 'ayah' ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              title="Translation mode — Arabic + translation per verse"
              onClick={() => setDisplayMode('ayah')}
            >
              <Type className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={displayMode === 'full' ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              title="Reading mode — Mushaf-style continuous Arabic"
              onClick={() => setDisplayMode('full')}
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={displayMode === 'tafsir' ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              title="Tafsir mode — Inline commentary per verse"
              onClick={() => setDisplayMode('tafsir')}
            >
              <ScrollText className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Tafsir source selector (only in tafsir mode) */}
          {tafsirMode && (
            <Select value={tafsirSourceId.toString()} onValueChange={(v) => setTafsirSourceId(parseInt(v))}>
              <SelectTrigger className="w-[130px] h-9 text-xs shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TAFSIR_SOURCES.map(s => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    <span className="text-xs">{s.name} <span className="text-muted-foreground">({s.language})</span></span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Tajweed colors toggle */}
          <Button
            variant={showTajweedColors ? "secondary" : "ghost"}
            size="icon"
            className={cn("h-9 w-9 shrink-0", showTajweedColors && "text-primary")}
            title={showTajweedColors ? "Disable tajweed colors" : "Enable tajweed color coding"}
            onClick={() => setShowTajweedColors(!showTajweedColors)}
          >
            <Palette className="w-4 h-4" />
          </Button>

          {/* Tajweed legend */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" title="Tajweed color guide">
                <Info className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 overflow-hidden" align="end">
              {/* Header */}
              <div className="px-4 py-3 border-b border-border bg-primary/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-arabic text-xl text-primary leading-none">تَجْوِيد</span>
                    <div>
                      <p className="text-sm font-semibold leading-none">Tajweed Guide</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Reference — rules of recitation</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Rules */}
              <div className="p-2 space-y-0.5">
                {TAJWEED_RULES.map(rule => (
                  <div
                    key={rule.name}
                    className="flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-muted/40 transition-colors"
                  >
                    {/* Color swatch */}
                    <div
                      className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: rule.color + "18", border: `1.5px solid ${rule.color}50` }}
                    >
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: rule.color }} />
                    </div>
                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-1.5">
                        <p className="text-xs font-semibold">{rule.name}</p>
                        <span className="font-arabic text-sm leading-none" style={{ color: rule.color }}>
                          {rule.arabic}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{rule.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Footer */}
              <div className={cn(
                "px-4 py-2.5 border-t border-border",
                showTajweedColors ? "bg-primary/8" : "bg-muted/30"
              )}>
                {showTajweedColors ? (
                  <p className="text-[10px] text-primary font-medium leading-snug flex items-center gap-1">
                    <Palette className="w-3 h-3 inline shrink-0" />
                    Tajweed colors are ON — each color is applied live in the Arabic text.
                  </p>
                ) : (
                  <p className="text-[10px] text-muted-foreground leading-snug">
                    Colors are currently OFF. Press the <Palette className="w-3 h-3 inline" /> button in the toolbar to see them applied live.
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Surah info */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            title="Surah Information"
            onClick={handleOpenSurahInfo}
          >
            <BookOpen className="w-4 h-4" />
          </Button>

          {/* Memorize mode toggle */}
          <Button
            variant={memorizeMode ? "secondary" : "ghost"}
            size="icon"
            className={cn("h-9 w-9 shrink-0", memorizeMode && "text-purple-600")}
            title={memorizeMode ? "Exit Memorization Mode" : "Enter Memorization Mode"}
            onClick={() => { setMemorizeMode(!memorizeMode); setRevealedWords({}); }}
          >
            {memorizeMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>

          {/* Jump to ayah */}
          <div className="flex items-center gap-1 shrink-0">
            <input
              type="number"
              min={1}
              max={currentSurah?.verses_count ?? 300}
              value={jumpInput}
              onChange={e => {
                const raw = e.target.value;
                if (raw === "") { setJumpInput(""); return; }
                const n = parseInt(raw);
                const max = currentSurah?.verses_count ?? 300;
                if (!isNaN(n)) setJumpInput(String(Math.min(Math.max(1, n), max)));
              }}
              placeholder="Ayah #"
              className="h-10 w-[72px] sm:w-[80px] rounded-lg border border-border bg-background text-sm px-2 text-center focus:outline-none focus:ring-2 focus:ring-primary/40"
              onKeyDown={e => {
                if (e.key === "Enter") {
                  const n = parseInt(jumpInput);
                  const max = currentSurah?.verses_count ?? 300;
                  const clamped = Math.min(Math.max(1, n), max);
                  if (!isNaN(clamped)) {
                    const el = document.getElementById(`ayah-${clamped}`);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                  setJumpInput("");
                }
              }}
            />
          </div>

          <Button
            variant="secondary"
            className="h-10 px-4 shrink-0 gap-2"
            onClick={() => { setAudioSurahId(surahId); setIsPlaying(true); }}
          >
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">Listen</span>
          </Button>
        </div>

        {/* Tajweed colors banner */}
        {showTajweedColors && !memorizeMode && (
          <div className="mb-4 px-4 py-2.5 bg-primary/8 border border-primary/20 rounded-xl text-sm text-primary flex items-center gap-2">
            <Palette className="w-4 h-4 shrink-0" />
            Tajweed colors ON — Arabic text is color-coded by recitation rule. Open the <Info className="w-3.5 h-3.5 inline mx-0.5" /> guide to see the legend.
          </div>
        )}

        {/* Word-by-word mode banner */}
        {showWordByWord && !memorizeMode && (
          <div className="mb-4 px-4 py-2.5 bg-primary/8 border border-primary/20 rounded-xl text-sm text-primary flex items-center gap-2">
            <Languages className="w-4 h-4 shrink-0" />
            Word-by-Word mode — English translation shown under each Arabic word. Click any word to explore occurrences.
          </div>
        )}

        {/* Memorize mode banner */}
        {memorizeMode && (
          <div className="mb-4 px-4 py-2.5 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl text-sm text-purple-700 dark:text-purple-300 flex items-center gap-2">
            <EyeOff className="w-4 h-4 shrink-0" />
            Memorization Mode — tap words to reveal them one by one
          </div>
        )}

        {/* Reading mode banner */}
        {fullPageMode && !memorizeMode && (
          <div className="mb-4 px-4 py-2.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-400 flex items-center gap-2">
            <AlignJustify className="w-4 h-4 shrink-0" />
            Reading Mode — Mushaf-style continuous Arabic. Click any word to explore its meaning.
          </div>
        )}

        {/* Tafsir mode banner */}
        {tafsirMode && !memorizeMode && (
          <div className="mb-4 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            <ScrollText className="w-4 h-4 shrink-0" />
            Tafsir Mode — {TAFSIR_SOURCES.find(s => s.id === tafsirSourceId)?.name ?? 'Commentary'} shown inline below each verse.
            {tafsirLoading2 && <Loader2 className="w-3.5 h-3.5 animate-spin ml-1" />}
          </div>
        )}

        {/* ── Surah header ── */}
        {currentSurah && (
          <div className="text-center mb-1 py-6 bg-card rounded-2xl border border-border shadow-sm px-6">
            <p className="font-arabic text-5xl text-primary mb-2 leading-tight">{currentSurah.name_arabic}</p>
            <p className="text-xl font-semibold text-foreground mb-1">{currentSurah.name_simple}</p>
            <p className="text-sm text-muted-foreground">{currentSurah.translated_name?.name}</p>
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <AlignJustify className="w-3 h-3" />
                {currentSurah.verses_count} verses
              </span>
              <span className="w-px h-3 bg-border" />
              <span>{currentSurah.revelation_place}</span>
            </div>
          </div>
        )}

        {/* ── Bismillah ── */}
        {showBismillah && !displayLoading && !pageMode && (
          <div className="text-center py-7 bg-card border border-border rounded-2xl my-4 shadow-sm">
            <p className="font-arabic text-foreground leading-loose" style={{ fontSize: Math.max(arabicFontSize, 28) }}>
              {BISMILLAH}
            </p>
          </div>
        )}

        {/* ── Verses ── */}
        <div className="mt-4 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {displayLoading ? (
            <div className="divide-y divide-border/40">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="p-6 sm:p-8 space-y-3">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-2/3" />
                    <Skeleton className="h-8 w-1/4" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              ))}
            </div>
          ) : displayVerses?.length ? (
            (fullPageMode || pageMode) ? (
              <>
                <FullPageView
                  verses={displayVerses}
                  arabicFontSize={arabicFontSize}
                  onHoverWord={handleHoverWord}
                  onLeaveWord={handleLeaveWord}
                  onWordClick={handleWordClick}
                  showWordByWord={showWordByWord}
                />
                {pageMode && (
                  <div className="flex items-center justify-center gap-4 py-3 border-t border-border/40 bg-muted/20">
                    <Button
                      variant="ghost" size="sm"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                    </Button>
                    <span className="text-sm text-muted-foreground font-medium tabular-nums">
                      Page {currentPage} <span className="text-xs opacity-60">/ 604</span>
                    </span>
                    <Button
                      variant="ghost" size="sm"
                      disabled={currentPage >= 604}
                      onClick={() => setCurrentPage(p => Math.min(604, p + 1))}
                    >
                      Next <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="divide-y divide-border/40">
                {displayVerses.map((verse, vIdx) => {
                  const prevVerse = vIdx > 0 ? displayVerses[vIdx - 1] : null;
                  const isNewJuz = !prevVerse || verse.juz_number !== prevVerse.juz_number;
                  const isNewHizb = prevVerse !== null && verse.hizb_number !== prevVerse.hizb_number && !isNewJuz;
                  const isNewRub = prevVerse !== null && verse.rub_el_hizb_number !== prevVerse.rub_el_hizb_number;
                  return (
                    <div key={verse.id} id={`ayah-${verse.verse_number}`}>
                      <AyahCard
                        verse={verse}
                        surahId={surahId}
                        surahName={currentSurah?.name_simple ?? ""}
                        arabicFont={arabicFont}
                        arabicFontSize={arabicFontSize}
                        translationFontSize={translationFontSize}
                        onHoverWord={handleHoverWord}
                        onLeaveWord={handleLeaveWord}
                        onBookmark={handleBookmark}
                        onFlag={handleFlag}
                        onNote={handleNote}
                        onAddToCollection={handleAddToCollection}
                        onTafsir={openTafsir}
                        onCopy={copyText}
                        onShare={handleShareVerse}
                        currentMood={moodMap[verse.verse_number] ?? null}
                        onMoodSelect={handleMoodSelect}
                        onMoodRemove={handleMoodRemove}
                        memorizeMode={memorizeMode}
                        revealedPositions={revealedWords[verse.verse_key] ?? []}
                        onRevealWord={handleRevealWord}
                        onGradeVerse={handleGradeVerse}
                        onWordClick={handleWordClick}
                        showTransliteration={showTransliteration}
                        showWordByWord={showWordByWord}
                        hasSajda={SAJDA_AYAHS.has(verse.verse_key)}
                        isNewJuz={isNewJuz}
                        isNewHizb={isNewHizb}
                        isNewRub={isNewRub}
                        juzNumber={verse.juz_number}
                        hizbNumber={verse.hizb_number}
                        onPin={handlePin}
                        isPinned={!!(pinnedVerses as any[])?.some(
                          (p: any) => p.surahId === surahId && p.ayahNumber === verse.verse_number
                        )}
                        showTajweedColors={showTajweedColors}
                        isCurrentlyPlaying={
                          audioIsPlaying &&
                          playingSurahId === surahId &&
                          audioCurrentAyah === verse.verse_number
                        }
                      />
                      {/* Inline tafsir block */}
                      {tafsirMode && tafsirMap && tafsirMap[verse.verse_key] && (
                        <div className="border-t border-emerald-200/40 dark:border-emerald-800/30 bg-emerald-50/40 dark:bg-emerald-950/10 px-6 sm:px-8 py-4">
                          <div className="flex items-center gap-2 mb-2">
                            <ScrollText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                              {TAFSIR_SOURCES.find(s => s.id === tafsirSourceId)?.name ?? 'Tafsir'}
                            </span>
                          </div>
                          <div
                            className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none dark:prose-invert prose-p:my-1.5 prose-headings:text-sm"
                            dangerouslySetInnerHTML={{
                              __html: tafsirMap[verse.verse_key]
                                .replace(/<h\d[^>]*>/gi, '<p class="font-semibold text-foreground">')
                                .replace(/<\/h\d>/gi, '</p>')
                            }}
                          />
                        </div>
                      )}
                      {tafsirMode && tafsirLoading2 && !tafsirMap && (
                        <div className="border-t border-border/30 px-8 py-3 flex items-center gap-2 text-xs text-muted-foreground">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Loading tafsir…
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <BookOpen className="w-12 h-12 mb-4 opacity-20" />
              <p>Failed to load verses. Please try again.</p>
            </div>
          )}
        </div>

        {/* ── End of Surah section ── */}
        {!fullPageMode && !tafsirMode && !pageMode && displayVerses?.length && !displayLoading && (
          <div className="mt-6 rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-amber-500/5 overflow-hidden">
            {/* Completion banner */}
            <div className="flex flex-col items-center gap-3 py-8 px-6 text-center border-b border-border/60">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">Completed</p>
                <h3 className="text-xl font-bold">
                  {currentSurah?.name_simple}
                  <span className="font-arabic text-2xl mr-2 text-primary"> {currentSurah?.name_arabic}</span>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentSurah?.verses_count} verses · {currentSurah?.revelation_place}
                </p>
              </div>
            </div>

            {/* Stats + next surah */}
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
              <div className="flex flex-col items-center gap-1 py-5 px-4">
                <Star className="w-4 h-4 text-amber-500 mb-1" />
                <span className="text-xs text-muted-foreground">Surah</span>
                <span className="font-semibold tabular-nums">{surahId} / 114</span>
              </div>
              <div className="flex flex-col items-center gap-1 py-5 px-4">
                <BookOpen className="w-4 h-4 text-primary mb-1" />
                <span className="text-xs text-muted-foreground">Verses read</span>
                <span className="font-semibold tabular-nums">{currentSurah?.verses_count ?? displayVerses.length}</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 py-5 px-4">
                {surahId < 114 ? (
                  <>
                    <span className="text-xs text-muted-foreground">Up next</span>
                    <Button
                      size="sm"
                      className="gap-1.5"
                      onClick={() => navigate(1)}
                    >
                      {surahs?.find((s: any) => s.id === surahId + 1)?.name_simple ?? "Next Surah"}
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-semibold text-green-600">Quran Complete!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Full page translation panel ── */}
        {fullPageMode && !pageMode && displayVerses?.length && !displayLoading && (
          <div className="mt-4 bg-card rounded-2xl border border-border shadow-sm p-6">
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground">Translation</h3>
            <div className="space-y-3">
              {(displayVerses ?? []).map((verse) => {
                const translation = verse.translations?.[0]?.text?.replace(/<[^>]*>?/gm, "") ?? "";
                return translation ? (
                  <p key={verse.id} className="text-sm leading-relaxed text-foreground/80" style={{ fontSize: translationFontSize }}>
                    <span className="font-medium text-primary/60 mr-1">{verse.verse_number}.</span>
                    {translation}
                  </p>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* ── Prev / Next navigation ── */}
        <div className="flex items-center justify-between mt-6 gap-3">
          <Button variant="outline" className="gap-2" disabled={surahId <= 1} onClick={() => navigate(-1)}>
            <ChevronRight className="w-4 h-4" />
            {surahs && surahId > 1 ? surahs.find((s: any) => s.id === surahId - 1)?.name_simple : "Previous"}
          </Button>
          <span className="text-xs text-muted-foreground tabular-nums">{surahId} / 114</span>
          <Button variant="outline" className="gap-2" disabled={surahId >= 114} onClick={() => navigate(1)}>
            {surahs && surahId < 114 ? surahs.find((s: any) => s.id === surahId + 1)?.name_simple : "Next"}
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ── Tafsir side panel ── */}
      {tafsirOpen && (
        <div className="hidden lg:flex flex-col fixed right-0 top-16 bottom-20 w-72 xl:w-80 bg-card border-l border-border shadow-xl z-40 animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <BookOpen className="w-4 h-4 text-primary shrink-0" />
              {tafsirTab === "tafsir" ? (
                <Select value={String(activeTafsirId)} onValueChange={(v) => setActiveTafsirId(Number(v))}>
                  <SelectTrigger className="h-7 text-xs border-none shadow-none bg-transparent p-0 gap-1 focus:ring-0 w-auto min-w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TAFSIR_SOURCES.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)} className="text-xs">{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span className="text-xs font-semibold text-primary">Community Reflections</span>
              )}
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => { setTafsirOpen(false); setTafsirTab("tafsir"); }}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Tab switcher */}
          <div className="flex border-b border-border shrink-0">
            {(["tafsir", "reflections"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setTafsirTab(tab)}
                className={cn(
                  "flex-1 py-2 text-xs font-semibold transition-colors",
                  tafsirTab === tab
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab === "tafsir" ? "Tafsir" : "Reflections"}
              </button>
            ))}
          </div>

          {tafsirContent && (
            <div className="px-4 py-2 bg-primary/5 border-b border-border shrink-0">
              <span className="text-xs font-medium text-primary">Ayah {tafsirContent.ayah}</span>
            </div>
          )}

          <ScrollArea className="flex-1 px-4 py-3">
            {tafsirTab === "tafsir" ? (
              tafsirLoading ? (
                <div className="space-y-3 py-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-3.5" style={{ width: `${70 + (i % 3) * 10}%` }} />
                  ))}
                </div>
              ) : tafsirContent ? (
                <div
                  className="prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-p:text-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: tafsirContent.text }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <BookOpen className="w-8 h-8 mb-3 opacity-20" />
                  <p className="text-sm">Tap Tafsir on any ayah.</p>
                </div>
              )
            ) : reflectionsLoading ? (
              <div className="space-y-3 py-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : reflections.length > 0 ? (
              <div className="space-y-3">
                {reflections.map((r) => (
                  <div key={r.id} className="rounded-lg bg-muted/50 p-3 text-xs">
                    {r.user?.name && (
                      <p className="font-semibold text-primary mb-1">{r.user.name}</p>
                    )}
                    <p className="leading-relaxed text-foreground/80">{r.body}</p>
                    {r.likes_count != null && (
                      <p className="mt-1.5 text-muted-foreground">♡ {r.likes_count}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <BookOpen className="w-8 h-8 mb-3 opacity-20" />
                <p className="text-sm font-medium">No reflections yet</p>
                <p className="text-xs mt-1">Be the first on QuranReflect!</p>
              </div>
            )}
          </ScrollArea>
        </div>
      )}

      {/* ── Root Word Explorer panel ── */}
      {wordPanel && (
        <div className="hidden lg:flex flex-col fixed right-0 top-16 bottom-20 w-72 xl:w-80 bg-card border-l border-border shadow-xl z-40 animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
            <div className="flex items-center gap-2">
              <SearchIcon className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">Word Explorer</h3>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setWordPanel(null)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="px-4 py-3 border-b border-border bg-primary/5 shrink-0">
            <p className="font-arabic text-2xl text-right text-foreground leading-loose">{wordPanel.word.text_uthmani}</p>
            {wordPanel.word.translation?.text && (
              <p className="text-sm text-muted-foreground mt-0.5">{wordPanel.word.translation.text}</p>
            )}
          </div>

          <ScrollArea className="flex-1">
            {/* Morphology section */}
            <div className="px-4 py-3 border-b border-border">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Morphology</p>
              {wordMorphologyLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : wordMorphology ? (
                <div className="space-y-2">
                  {wordMorphology.root && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Root</span>
                      <span className="font-arabic text-base font-semibold text-primary">{wordMorphology.root}</span>
                    </div>
                  )}
                  {wordMorphology.tokens.map((token, i) => (
                    <div key={i} className="rounded-lg bg-muted/40 p-2 space-y-1">
                      {token.part_of_speech && (
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">Part of speech</span>
                          <span className="text-xs font-medium capitalize">{token.part_of_speech.toLowerCase()}</span>
                        </div>
                      )}
                      {token.lemma && (
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">Lemma</span>
                          <span className="font-arabic text-sm">{token.lemma}</span>
                        </div>
                      )}
                      {token.stem && (
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">Stem</span>
                          <span className="font-arabic text-sm">{token.stem}</span>
                        </div>
                      )}
                      {token.morphological_features && Object.keys(token.morphological_features).length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {Object.entries(token.morphological_features).slice(0, 6).map(([k, v]) => (
                            <span key={k} className="inline-block text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                              {v}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No morphology data available.</p>
              )}
            </div>

            {/* Related ayahs section */}
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Related Ayahs</p>
                {wordPanel?.word.text_uthmani && (
                  <Link
                    href={`/search?q=${encodeURIComponent(wordPanel.word.text_uthmani)}`}
                    onClick={() => setWordPanel(null)}
                    className="text-[10px] text-primary hover:underline"
                  >
                    See all →
                  </Link>
                )}
              </div>
              {wordOccurrencesLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-14" />
                  ))}
                </div>
              ) : wordOccurrences.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground mb-2">{wordOccurrences.length} results found</p>
                  {wordOccurrences.map((occ, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (occ.surahId && occ.surahId >= 1 && occ.surahId <= 114) {
                          setSurahId(occ.surahId);
                          setWordPanel(null);
                        }
                      }}
                      className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-xs font-medium text-primary block mb-1">{occ.verseKey}</span>
                      <p className="text-xs text-foreground/70 line-clamp-2 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: occ.text }}
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No related ayahs found.</p>
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* ── Add to Collection dialog ── */}
      <AddToCollectionDialog
        open={collectionDialogOpen}
        onClose={() => { setCollectionDialogOpen(false); setCollectionVerse(null); }}
        verse={collectionVerse}
        surahId={surahId}
        surahNameEn={currentSurah?.name_simple ?? ""}
      />

      {/* ── Share card dialog ── */}
      <Dialog open={!!shareVerse} onOpenChange={(open) => { if (!open) setShareVerse(null); }}>
        <DialogContent className="sm:max-w-md">
          <ShareCardModal
            verse={shareVerse}
            surahName={currentSurah?.name_simple ?? ""}
            surahId={surahId}
            onCopyText={(text) => { navigator.clipboard.writeText(text); toast({ title: "Copied ✓" }); }}
          />
        </DialogContent>
      </Dialog>

      {/* ── Note dialog ── */}
      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Note — {currentSurah?.name_simple} : {activeVerseForNote?.verse_number}
            </DialogTitle>
          </DialogHeader>
          <RichNoteEditor
            content={noteText}
            onChange={setNoteText}
            placeholder="Write your reflections here..."
          />
          <div className="flex gap-2 mt-3">
            <Button variant="ghost" onClick={() => setNoteOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNote} disabled={!noteText.trim() || noteText === "<p></p>"} className="flex-1">Save Note</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Surah Info Sheet ── */}
      <Sheet open={surahInfoOpen} onOpenChange={setSurahInfoOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-lg leading-tight">
                  {currentSurah?.name_simple ?? "Surah Info"}
                </SheetTitle>
                {currentSurah && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {currentSurah.name_arabic} · {currentSurah.verses_count} verses · {(currentSurah as any).revelation_place === "makkah" ? "Meccan" : "Medinan"}
                  </p>
                )}
              </div>
            </div>
          </SheetHeader>
          <ScrollArea className="flex-1">
            <div className="px-6 py-5 space-y-5">
              {surahInfoLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : surahInfoData ? (
                <>
                  {/* Stats row */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Surah No.", value: surahInfoData.surahId },
                      { label: "Verses", value: currentSurah?.verses_count ?? "—" },
                    ].map(stat => (
                      <div key={stat.label} className="text-center py-3 bg-muted/40 rounded-lg">
                        <p className="text-base font-bold text-foreground">{stat.value}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Short text */}
                  {surahInfoData.shortText && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Overview</p>
                      <p className="text-sm text-foreground/80 leading-relaxed">{surahInfoData.shortText}</p>
                    </div>
                  )}

                  {/* Long text */}
                  {surahInfoData.text && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Context & Themes</p>
                      <div
                        className="text-sm text-foreground/80 leading-relaxed space-y-2 [&_p]:mb-2"
                        dangerouslySetInnerHTML={{ __html: surahInfoData.text }}
                      />
                    </div>
                  )}

                  {/* Source */}
                  {surahInfoData.source && (
                    <p className="text-[10px] text-muted-foreground italic">Source: {surahInfoData.source}</p>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground italic text-center py-8">No information available for this surah.</p>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
