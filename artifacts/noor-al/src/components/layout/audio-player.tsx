import { useState, useEffect, useRef, useMemo } from "react";
import {
  Play, Pause, SkipBack, SkipForward, Loader2,
  X, Repeat, Repeat1, AlignLeft, Mic, ChevronDown, Repeat2,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useAppStore } from "@/lib/store";
import {
  RECITERS_LIST,
  fetchAyahAudios,
  useSurahs,
  useVersesByChapter,
  useReciters,
  type AyahAudioFile,
} from "@/lib/quran-api";
import { useQuery } from "@tanstack/react-query";

const SPEED_OPTIONS: Array<0.75 | 1 | 1.25 | 1.5> = [0.75, 1, 1.25, 1.5];
type LoopMode = "none" | "ayah" | "surah";

const toArabicIndic = (n: number) =>
  String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);

const fmt = (t: number) => {
  if (!t || isNaN(t)) return "0:00";
  return `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, "0")}`;
};

export default function AudioPlayer() {
  const {
    audioSurahId,
    activeReciter,
    setReciter,
    isPlaying,
    setIsPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    activeTranslations,
    theme,
    setAudioCurrentAyah,
  } = useAppStore();

  const gold = theme === "sepia" ? "#8B6914" : "#C0A060";

  // Live reciters from API (falls back to static list if loading/error)
  const { data: liveReciters } = useReciters();
  const reciterDisplayList = liveReciters
    ? liveReciters.map((r) => ({ id: String(r.id), name: r.name, style: r.style ?? undefined }))
    : RECITERS_LIST.map((r) => ({ id: r.id, name: r.name, style: undefined }));

  // ── UI state ─────────────────────────────────────────────────────────────
  const [playerVisible, setPlayerVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [showReciterPopup, setShowReciterPopup] = useState(false);
  const [showFollowAlong, setShowFollowAlong] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loopMode, setLoopMode] = useState<LoopMode>("none");
  const [rangeActive, setRangeActive] = useState(false);
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd,   setRangeEnd]   = useState(7);

  // ── Per-ayah playback state ───────────────────────────────────────────────
  // currentAyahIdx is the source of truth — not derived from audio currentTime.
  const [currentAyahIdx, setCurrentAyahIdx] = useState(0);
  // progress = currentTime in seconds within the CURRENT ayah's audio file.
  const [progress, setProgress] = useState(0);
  // duration of the currently loaded ayah audio.
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  // Word-by-word highlight position — driven by rAF loop, not useMemo/timeupdate.
  const [activeWordPos, setActiveWordPos] = useState<number | null>(null);

  // When user scrubs the global bar into a different ayah, store the target
  // offset so we apply it once that ayah's audio loads (loadedmetadata).
  const pendingSeekOffsetRef = useRef<number | null>(null);

  // ── Stable refs for event handlers ───────────────────────────────────────
  const audioRef        = useRef<HTMLAudioElement | null>(null);
  const reciterPopupRef = useRef<HTMLDivElement>(null);
  const ayahItemRefs    = useRef<(HTMLDivElement | null)[]>([]);

  // Mutable refs so the `ended` handler can read latest values without stale closures
  const currentAyahIdxRef  = useRef(0);
  const ayahAudiosRef      = useRef<AyahAudioFile[]>([]);
  const loopModeRef        = useRef<LoopMode>("none");
  const isPlayingRef       = useRef(false);
  // Tracks which URL is currently loaded in the audio element
  const loadedUrlRef       = useRef("");
  const rangeActiveRef     = useRef(false);
  const rangeStartRef      = useRef(1);
  const rangeEndRef        = useRef(7);
  // Silent preload element — fills browser cache for the next ayah
  const preloadAudioRef    = useRef<HTMLAudioElement | null>(null);
  // Set to true when we've called audio.load() and want canplay to trigger play.
  // This decouples "start loading" from "start playing" and avoids AbortError.
  const shouldPlayOnLoadRef = useRef(false);
  // Current ayah's segments — ALL entries, kept in sync each render.
  const currentSegmentsRef = useRef<number[][] | undefined>(undefined);
  // Pre-filtered to char_type===1 (word) segments only so the rAF loop
  // never has to call .filter() at 60 fps — just a linear find().
  const currentWordSegsRef = useRef<number[][]>([]);
  // Set of word positions that actually exist in the current verse's word list
  // (filtered by char_type_name === 'word'). Used by the rAF loop to know
  // whether a matched segment position is a real word (vs an end marker).
  const currentWordPositionsRef = useRef<Set<number>>(new Set());

  // Keep refs in sync every render
  currentAyahIdxRef.current = currentAyahIdx;
  loopModeRef.current       = loopMode;
  isPlayingRef.current      = isPlaying;
  rangeActiveRef.current    = rangeActive;
  rangeStartRef.current     = rangeStart;
  rangeEndRef.current       = rangeEnd;

  // ── Data fetching ─────────────────────────────────────────────────────────
  const { data: surahs } = useSurahs();

  // Fetch all verse objects so we have word arrays for word-by-word rendering
  const { data: verses } = useVersesByChapter(
    audioSurahId ?? 0,
    activeTranslations,
    false
  );

  // Per-ayah audio files (url + segments).
  // Segments are RELATIVE to each ayah's own audio file — that's why we switched
  // from chapter audio: segments don't align with chapter timestamps.
  const { data: ayahAudios } = useQuery({
    queryKey: ["ayah-audios", activeReciter, audioSurahId],
    queryFn: () => fetchAyahAudios(activeReciter, audioSurahId as number),
    enabled: !!audioSurahId,
    staleTime: 24 * 60 * 60 * 1000,
  });

  // Always keep the ref up to date for event handlers
  ayahAudiosRef.current = ayahAudios ?? [];

  // Derived helpers
  const currentAyahAudio = ayahAudios?.[currentAyahIdx];
  const totalAyahs       = ayahAudios?.length ?? 0;
  const currentAyahNumber = currentAyahIdx + 1;
  const currentSurah     = surahs?.find((s: { id: number }) => s.id === audioSurahId);
  const reciterInfo      = reciterDisplayList.find((r) => r.id === activeReciter);

  // Keep segment refs in sync (placed here, after currentAyahAudio is declared)
  currentSegmentsRef.current = currentAyahAudio?.segments;
  // Keep ALL segments (no char_type filter — the filter was fragile: quran.com
  // may return different numeric codes depending on the reciter/endpoint, causing
  // the filtered array to be empty and breaking all highlighting).
  currentWordSegsRef.current = currentAyahAudio?.segments ?? [];
  // Build the set of REAL word positions from the verse data so the rAF loop
  // can distinguish a word segment from an end-marker segment without relying
  // on any quran.com char_type numeric convention.
  {
    const activeVerse = verses?.[currentAyahIdx];
    const wordPositions = new Set<number>(
      (activeVerse?.words ?? [])
        .filter((w) => w.char_type_name === "word")
        .map((w) => w.position)
    );
    currentWordPositionsRef.current = wordPositions;
  }

  // Whether this reciter provides word-level segment timing for this surah
  const hasWordHighlight = (ayahAudios ?? []).some(
    (a) => a.segments && a.segments.length > 0,
  );

  // ── Global surah timeline ──────────────────────────────────────────────────
  // Derive each ayah's duration (ms) from segments: max end_ms across all word segs.
  // This lets us build a full-surah progress bar without loading every audio file.
  const ayahDurationsMs = useMemo(() => {
    return (ayahAudios ?? []).map((a) => {
      if (a.segments && a.segments.length > 0) {
        return Math.max(...a.segments.map((s) => s[3]));
      }
      return 0;
    });
  }, [ayahAudios]);

  // Cumulative start offset (ms) for each ayah in the surah timeline
  const cumulativeOffsetsMs = useMemo(() => {
    const offsets: number[] = [];
    let acc = 0;
    for (const d of ayahDurationsMs) {
      offsets.push(acc);
      acc += d;
    }
    return offsets;
  }, [ayahDurationsMs]);

  const totalDurationMs = useMemo(
    () => ayahDurationsMs.reduce((a, b) => a + b, 0),
    [ayahDurationsMs]
  );

  // Overall elapsed = start of current ayah + current ayah's local progress
  const overallElapsedSec =
    (cumulativeOffsetsMs[currentAyahIdx] ?? 0) / 1000 + progress;
  const totalDurationSec = totalDurationMs / 1000;

  // Whether we have enough segment data to show the global bar
  const hasGlobalTimeline = totalDurationSec > 0;

  // ── Sync current ayah to global store ────────────────────────────────────
  useEffect(() => {
    setAudioCurrentAyah(currentAyahNumber);
  }, [currentAyahNumber, setAudioCurrentAyah]);

  // ── Re-show player when Listen is clicked (even same surah) ──────────────
  useEffect(() => {
    if (isPlaying && audioSurahId) {
      setPlayerVisible(true);
      setIsClosing(false);
    }
  }, [isPlaying, audioSurahId]);

  // ── Reset when surah changes ──────────────────────────────────────────────
  useEffect(() => {
    setCurrentAyahIdx(0);
    currentAyahIdxRef.current = 0;
    setProgress(0);
    setDuration(0);
    loadedUrlRef.current = "";
    setPlayerVisible(true);
    setIsClosing(false);
  }, [audioSurahId]);

  // ── Reset loaded URL when reciter changes (force reload) ─────────────────
  useEffect(() => {
    loadedUrlRef.current = "";
    setProgress(0);
    setDuration(0);
  }, [activeReciter]);

  // ── Preload next ayah into a silent audio element (fills browser cache) ──
  useEffect(() => {
    if (!ayahAudios || ayahAudios.length === 0) return;
    const preload = preloadAudioRef.current;
    if (!preload) return;
    const nextUrl = ayahAudios[currentAyahIdx + 1]?.url;
    if (!nextUrl || preload.src === nextUrl) return;
    preload.src = nextUrl;
    preload.load();
  }, [currentAyahIdx, ayahAudios]);

  // ── Init audio element (once on mount) ───────────────────────────────────
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    const preload = new Audio();
    preload.preload = "auto";
    preloadAudioRef.current = preload;

    // ── rAF-based word highlight loop ─────────────────────────────────────
    // timeupdate fires only ~4×/sec (250 ms). Short words get skipped or shown
    // too long. We poll audio.currentTime via requestAnimationFrame (~60 fps /
    // ~16 ms) and update the store ONLY when the active word actually changes,
    // so re-renders are bounded by the number of words in the ayah, not fps.
    let rafId: number | null = null;
    let lastPos: number | null = null;
    // The last position that matched a word segment (char_type===1).
    // Kept across the rAF loop so we can:
    //  (a) hold the last word lit after its segment ends (silence tail)
    //  (b) bridge tiny inter-word gaps without flickering to null
    let lastValidPos: number | null = null;

    const tickHighlight = () => {
      // Use ALL segments (no char_type filter — filter was fragile).
      // We use currentWordPositionsRef to know which segment positions map to
      // actual Arabic words vs end markers, without depending on char_type codes.
      const segs      = currentWordSegsRef.current;
      const wordPosSet = currentWordPositionsRef.current;
      let pos: number | null = null;

      if (segs.length > 0) {
        const ms = audio.currentTime * 1000;
        // Segment layout: [word_pos, char_type, start_ms, end_ms]
        const activeSeg = segs.find((s) => ms >= s[2] && ms < s[3]);

        if (activeSeg) {
          const segPos = activeSeg[0] as number;
          pos = segPos;
          // Only update lastValidPos when the segment maps to a real word.
          // End-marker segments (e.g. ayah number) have positions that aren't
          // in the word list — holding their pos would drop the last real word.
          if (wordPosSet.size === 0 || wordPosSet.has(segPos)) {
            lastValidPos = segPos;
          }
        } else if (segs.length > 0 && ms >= segs[0][2]) {
          // We're past the first segment's start but not in any window:
          // inter-word gap or silence tail — hold last real word.
          pos = lastValidPos;
        }
        // ms < segs[0][2] → intro silence, no highlight yet.
      }
      if (pos !== lastPos) {
        lastPos = pos;
        setActiveWordPos(pos);
        // Drive the store (reader's follow-along reads this)
        useAppStore.getState().setAudioActiveWordPos(pos);
      }
      rafId = requestAnimationFrame(tickHighlight);
    };

    const startHighlight = () => {
      if (rafId !== null) return; // already running
      lastPos      = null; // reset so first word always fires a state update
      lastValidPos = null; // clear tail-hold state for new ayah
      rafId = requestAnimationFrame(tickHighlight);
    };

    const stopHighlight = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      lastValidPos = null; // always clear so next ayah starts fresh
      if (lastPos !== null) {
        lastPos = null;
        setActiveWordPos(null);
        useAppStore.getState().setAudioActiveWordPos(null);
      }
    };

    audio.addEventListener("timeupdate", () => {
      setProgress(audio.currentTime);
      // Loop-ayah: re-seek near the end so it restarts smoothly
      if (loopModeRef.current === "ayah") {
        const d = audio.duration;
        if (d > 0 && audio.currentTime >= d - 0.15) {
          audio.currentTime = 0;
        }
      }
    });

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
      // Apply any pending seek offset (from global scrub into a different ayah)
      if (pendingSeekOffsetRef.current !== null) {
        const t = pendingSeekOffsetRef.current;
        pendingSeekOffsetRef.current = null;
        audio.currentTime = t;
        setProgress(t);
      }
    });

    audio.addEventListener("waiting", () => setIsLoading(true));
    audio.addEventListener("canplay", () => {
      setIsLoading(false);
      // Trigger play here (not in the sync effect) to avoid AbortError.
      // audio.load() aborts any pending play(); using canplay as the trigger
      // ensures the audio is actually ready before play() is called.
      if (shouldPlayOnLoadRef.current && isPlayingRef.current) {
        shouldPlayOnLoadRef.current = false;
        audio.play().catch((err) => {
          if (err.name !== "AbortError") setIsPlaying(false);
        });
      }
    });

    // Start/stop the rAF highlight loop with actual playback events
    audio.addEventListener("playing", startHighlight);
    audio.addEventListener("pause",   stopHighlight);

    // ── Auto-advance to next ayah when current one ends ───────────────────
    audio.addEventListener("ended", () => {
      stopHighlight();

      const mode  = loopModeRef.current;
      const idx   = currentAyahIdxRef.current;
      const files = ayahAudiosRef.current;

      if (mode === "ayah") {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }

      // Range loop: when active, cycle within [rangeStart-1, rangeEnd-1]
      if (rangeActiveRef.current) {
        const rStart = rangeStartRef.current - 1; // 0-indexed
        const rEnd   = rangeEndRef.current   - 1; // 0-indexed
        const goTo   = idx >= rEnd ? rStart : idx + 1;
        if (!files[goTo]?.url) return;
        // Clear loadedUrlRef so the sync effect loads the new URL.
        // Do NOT set audio.src here — the sync effect is the single owner
        // of audio element mutations. Doing it from two places races and
        // the sync effect's .catch(() => setIsPlaying(false)) kills playback.
        loadedUrlRef.current      = "";
        currentAyahIdxRef.current = goTo;
        setCurrentAyahIdx(goTo);
        setProgress(0);
        setDuration(0);
        return;
      }

      const nextIdx = idx + 1;
      const goToIdx = nextIdx < files.length ? nextIdx : (mode === "surah" ? 0 : -1);

      if (goToIdx === -1) {
        setIsPlaying(false);
        return;
      }

      // Clear loadedUrlRef so the sync effect sees a new URL and loads it.
      loadedUrlRef.current      = "";
      currentAyahIdxRef.current = goToIdx;
      setCurrentAyahIdx(goToIdx);
      setProgress(0);
      setDuration(0);
    });

    return () => {
      audio.pause();
      audio.src = "";
      stopHighlight();
      if (preloadAudioRef.current) {
        preloadAudioRef.current.src = "";
        preloadAudioRef.current = null;
      }
    };
  }, [setIsPlaying]);

  // ── Main sync effect: load + play/pause based on state ───────────────────
  // Runs when isPlaying, the current ayah URL, or speed changes.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Always apply speed
    audio.playbackRate = playbackSpeed;

    if (!isPlaying) {
      shouldPlayOnLoadRef.current = false;
      audio.pause();
      return;
    }

    const url = currentAyahAudio?.url;
    if (!url) return; // still loading, will re-run when url arrives

    if (loadedUrlRef.current !== url) {
      // New URL — load audio. Play will be triggered in the 'canplay' listener
      // once the browser signals readiness. Calling play() immediately after
      // load() risks an AbortError if the effect re-runs before play resolves.
      loadedUrlRef.current = url;
      setProgress(0);
      setDuration(0);
      shouldPlayOnLoadRef.current = true;
      audio.src = url;
      audio.load();
      return; // canplay handler will call play()
    }

    // Same URL — audio is already loaded. Directly play (e.g. user unpaused).
    shouldPlayOnLoadRef.current = false;
    audio.play().catch((err) => {
      if (err.name !== "AbortError") setIsPlaying(false);
    });
  }, [isPlaying, currentAyahAudio?.url, playbackSpeed, setIsPlaying]);

  // ── Dedicated speed-change effect (while already playing) ────────────────
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  // ── Auto-scroll follow-along to current ayah ─────────────────────────────
  useEffect(() => {
    if (!showFollowAlong) return;
    const el = ayahItemRefs.current[currentAyahIdx];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentAyahIdx, showFollowAlong]);

  // ── Close reciter popup on outside click ─────────────────────────────────
  useEffect(() => {
    if (!showReciterPopup) return;
    const fn = (e: MouseEvent) => {
      if (!reciterPopupRef.current?.contains(e.target as Node))
        setShowReciterPopup(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [showReciterPopup]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const togglePlay = () => setIsPlaying(!isPlaying);

  /** Seek within the current ayah's audio (used by follow-along per-ayah bar) */
  const handleSeek = (val: number[]) => {
    const t = val[0];
    if (audioRef.current) {
      audioRef.current.currentTime = t;
      setProgress(t);
    }
  };

  /**
   * Seek the GLOBAL surah timeline to a position in seconds.
   * Maps the global offset back to the correct ayah + offset within that ayah.
   */
  const handleGlobalSeek = (globalSec: number) => {
    const globalMs = globalSec * 1000;

    // Find which ayah this global position falls in
    let targetIdx = cumulativeOffsetsMs.length - 1;
    for (let i = 0; i < cumulativeOffsetsMs.length; i++) {
      const nextStart = cumulativeOffsetsMs[i + 1] ?? totalDurationMs + 1;
      if (globalMs < nextStart) {
        targetIdx = i;
        break;
      }
    }

    const offsetWithinAyahSec =
      (globalMs - (cumulativeOffsetsMs[targetIdx] ?? 0)) / 1000;

    if (targetIdx !== currentAyahIdx) {
      // Jump to a different ayah; once its audio loads, seek to the offset
      pendingSeekOffsetRef.current = Math.max(0, offsetWithinAyahSec);
      seekToAyah(targetIdx);
    } else {
      // Same ayah — just scrub directly
      if (audioRef.current) {
        audioRef.current.currentTime = offsetWithinAyahSec;
        setProgress(offsetWithinAyahSec);
      }
    }
  };

  /**
   * Jump to a specific ayah by index.
   * Sets currentAyahIdx (state + ref) which triggers the main sync effect.
   */
  const seekToAyah = (idx: number) => {
    if (!ayahAudiosRef.current[idx]) return;
    loadedUrlRef.current = ""; // force reload of new URL
    currentAyahIdxRef.current = idx;
    setCurrentAyahIdx(idx);
    setProgress(0);
    setIsPlaying(true);
  };

  const goToPrev = () => {
    if (currentAyahIdx > 0) {
      seekToAyah(currentAyahIdx - 1);
    } else if (audioRef.current) {
      // Restart from beginning of first ayah
      audioRef.current.currentTime = 0;
      setProgress(0);
    }
  };

  const goToNext = () => {
    if (currentAyahIdx < totalAyahs - 1) seekToAyah(currentAyahIdx + 1);
  };

  const cycleSpeed = () => {
    const i = SPEED_OPTIONS.indexOf(playbackSpeed);
    setPlaybackSpeed(SPEED_OPTIONS[(i + 1) % SPEED_OPTIONS.length]);
  };

  const cycleLoop = () =>
    setLoopMode((p) => (p === "none" ? "ayah" : p === "ayah" ? "surah" : "none"));

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      audioRef.current?.pause();
      setIsPlaying(false);
      setPlayerVisible(false);
      setIsClosing(false);
    }, 300);
  };

  const handleReciterSelect = (id: string) => {
    setReciter(id as Parameters<typeof setReciter>[0]);
    setShowReciterPopup(false);
  };

  if (!audioSurahId || !playerVisible) return null;

  const loopActive = loopMode !== "none";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Follow-Along Panel ───────────────────────────────────────────── */}
      {showFollowAlong && (
        <div
          className="fixed left-0 right-0 bottom-[80px] z-40"
          style={{ height: "60vh" }}
        >
          <div className="h-full max-w-3xl mx-auto bg-card border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-4 pt-3 pb-2 border-b border-border shrink-0 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-arabic text-base font-semibold leading-none">
                    {currentSurah?.name_arabic}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {currentSurah?.name_simple} · {reciterInfo?.name}
                  </span>
                </div>
                <button
                  onClick={() => setShowFollowAlong(false)}
                  className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {ayahAudios && !hasWordHighlight && (
                <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg px-2.5 py-1.5">
                  <span className="shrink-0">⚠</span>
                  <span>
                    Word-by-word highlight is not available for <strong>{reciterInfo?.name ?? "this reciter"}</strong>. The active ayah is still highlighted. Choose a reciter like <strong>Mishary Rashid Alafasy</strong> for per-word tracking.
                  </span>
                </div>
              )}
            </div>

            {/* Ayah list */}
            <div className="flex-1 overflow-y-auto overscroll-contain py-4 space-y-0.5">
              {(verses ?? []).map((verse, idx) => {
                const isActive = idx === currentAyahIdx;
                const isPast   = idx < currentAyahIdx;

                // Words for the current active ayah (for word-by-word highlighting)
                const words = isActive
                  ? (verse.words ?? []).filter((w) => w.char_type_name === "word")
                  : [];

                return (
                  <div
                    key={verse.id}
                    ref={(el) => { ayahItemRefs.current[idx] = el; }}
                    onClick={() => seekToAyah(idx)}
                    className="cursor-pointer px-5 py-3.5 transition-colors duration-200 select-none active:scale-[0.99] rounded-xl mx-2"
                    style={isActive ? { backgroundColor: `${gold}14` } : undefined}
                  >
                    {/* Arabic text */}
                    <div
                      dir="rtl"
                      className="font-arabic text-right leading-[2.2] transition-all duration-300"
                      style={{
                        fontSize: isActive ? "1.5rem" : "1.15rem",
                        opacity: isPast ? 0.35 : 1,
                      }}
                    >
                      {isActive && words.length > 0 && currentAyahAudio?.segments?.length ? (
                        // ── Word-by-word highlight on the active ayah ──────────
                        <>
                          {words.map((word) => (
                            <span
                              key={word.id}
                              className="inline transition-colors duration-100"
                              style={{
                                color:
                                  word.position === activeWordPos
                                    ? gold
                                    : "var(--foreground)",
                                fontWeight: word.position === activeWordPos ? 700 : 400,
                              }}
                            >
                              {word.text_uthmani}{" "}
                            </span>
                          ))}
                          <span className="text-sm opacity-40">
                            ﴿{toArabicIndic(verse.verse_number)}﴾
                          </span>
                        </>
                      ) : (
                        // ── Plain text for non-active ayahs (performance) ──────
                        <span
                          style={{
                            color: isActive ? gold : "var(--foreground)",
                          }}
                        >
                          {verse.text_uthmani}{" "}
                          <span className="text-sm opacity-40">
                            ﴿{toArabicIndic(verse.verse_number)}﴾
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Translation */}
                    {verse.translations[0]?.text && (
                      <p
                        className="mt-1 text-xs leading-relaxed"
                        style={{
                          color: "var(--muted-foreground)",
                          opacity: isActive ? 0.85 : isPast ? 0.25 : 0.5,
                        }}
                      >
                        {verse.translations[0].text.replace(/<[^>]+>/g, "")}
                      </p>
                    )}

                    {/* Active ayah: progress bar within the ayah */}
                    {isActive && duration > 0 && (
                      <div className="mt-2 h-0.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-100"
                          style={{
                            width: `${(progress / duration) * 100}%`,
                            backgroundColor: gold,
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              {(!verses || verses.length === 0) && (
                <div className="flex items-center justify-center h-32 text-muted-foreground text-sm gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading…
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Reciter Popup ────────────────────────────────────────────────── */}
      {showReciterPopup && (
        <div
          ref={reciterPopupRef}
          className="fixed bottom-[84px] left-1/2 -translate-x-1/2 z-50 w-72 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Choose Reciter
            </p>
          </div>
          <div className="max-h-64 overflow-y-auto">
          {reciterDisplayList.map((r) => {
            const active = r.id === activeReciter;
            return (
              <button
                key={r.id}
                onClick={() => handleReciterSelect(r.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                style={active ? { backgroundColor: `${gold}14` } : {}}
              >
                <div className="min-w-0">
                  <span className="text-sm font-medium block truncate" style={active ? { color: gold } : {}}>
                    {r.name}
                  </span>
                  {r.style && (
                    <span className="text-[10px] text-muted-foreground">{r.style}</span>
                  )}
                </div>
                {active && (
                  <span className="text-sm font-bold shrink-0 ml-2" style={{ color: gold }}>✓</span>
                )}
              </button>
            );
          })}
          </div>
        </div>
      )}

      {/* ── Mobile Expanded Player ────────────────────────────────────────── */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-card flex flex-col md:hidden">
          <div className="flex items-center justify-between px-5 pt-12 pb-4">
            <button
              onClick={() => setIsExpanded(false)}
              className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Now Playing
            </span>
            <button
              onClick={handleClose}
              className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-8 gap-7">
            <div
              className="h-52 w-52 rounded-3xl flex items-center justify-center"
              style={{ backgroundColor: `${gold}18` }}
            >
              <span className="font-arabic text-5xl font-bold" style={{ color: gold }}>
                {currentSurah?.name_arabic?.slice(0, 3) ?? "سور"}
              </span>
            </div>
            <div className="text-center space-y-1">
              <p className="font-arabic text-3xl font-bold">{currentSurah?.name_arabic}</p>
              <p className="text-muted-foreground">{currentSurah?.name_simple}</p>
              <p className="text-sm text-muted-foreground">
                الآية {toArabicIndic(currentAyahNumber)} من {toArabicIndic(totalAyahs)} · {reciterInfo?.name}
              </p>
            </div>
          </div>

          <div className="px-8 pb-3">
            <Slider
              value={[hasGlobalTimeline ? overallElapsedSec : progress]}
              max={hasGlobalTimeline ? totalDurationSec : (duration || 100)}
              step={0.1}
              onValueChange={(v) => hasGlobalTimeline ? handleGlobalSeek(v[0]) : handleSeek(v)}
              disabled={isLoading || (!hasGlobalTimeline && !duration)}
            />
            <div className="flex justify-between mt-1.5">
              <span className="text-[11px] text-muted-foreground tabular-nums">
                {fmt(hasGlobalTimeline ? overallElapsedSec : progress)}
              </span>
              <span className="text-[11px] text-muted-foreground tabular-nums">
                {fmt(hasGlobalTimeline ? totalDurationSec : duration)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-10 pb-7">
            <button
              onClick={goToPrev}
              disabled={currentAyahIdx === 0}
              className="h-11 w-11 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
            >
              <SkipBack className="h-7 w-7" />
            </button>
            <button
              onClick={togglePlay}
              disabled={isLoading}
              className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-opacity shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="h-7 w-7 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-7 w-7" />
              ) : (
                <Play className="h-7 w-7 translate-x-[2px]" />
              )}
            </button>
            <button
              onClick={goToNext}
              disabled={currentAyahIdx >= totalAyahs - 1}
              className="h-11 w-11 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
            >
              <SkipForward className="h-7 w-7" />
            </button>
          </div>

          <div className="flex items-center justify-around px-10 pb-4">
            <button
              onClick={cycleSpeed}
              className="text-sm font-bold px-3 py-2 rounded-xl bg-muted min-w-[44px] text-center"
            >
              {playbackSpeed}x
            </button>
            <button
              onClick={cycleLoop}
              className="h-10 w-10 flex items-center justify-center"
              style={{ color: loopActive ? gold : "var(--muted-foreground)" }}
            >
              {loopMode === "ayah" ? (
                <Repeat1 className="h-5 w-5" />
              ) : (
                <Repeat className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => { setIsExpanded(false); setShowReciterPopup(true); }}
              className="h-10 w-10 flex items-center justify-center text-muted-foreground"
            >
              <Mic className="h-5 w-5" />
            </button>
            <button
              onClick={() => { setIsExpanded(false); setShowFollowAlong(true); }}
              className="h-10 w-10 flex items-center justify-center"
              style={{ color: showFollowAlong ? gold : "var(--muted-foreground)" }}
            >
              <AlignLeft className="h-5 w-5" />
            </button>
          </div>

          {/* ── Range loop ─────────────────────────────────────── */}
          <div className="mx-6 mb-10 rounded-2xl border border-border/50 bg-muted/30 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Repeat2 className="h-4 w-4" style={{ color: rangeActive ? gold : "var(--muted-foreground)" }} />
                <span className="text-sm font-medium">Range Loop</span>
              </div>
              <button
                onClick={() => setRangeActive((v) => !v)}
                className="relative inline-flex h-5 w-9 cursor-pointer rounded-full transition-colors duration-200"
                style={{ backgroundColor: rangeActive ? gold : "var(--border)" }}
                aria-label="Toggle range loop"
              >
                <span
                  className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200"
                  style={{ transform: rangeActive ? "translateX(16px)" : "translateX(2px)" }}
                />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground mb-1 text-center">From ayah</p>
                <div className="flex items-center gap-1.5 justify-center">
                  <button
                    onClick={() => setRangeStart((v) => Math.max(1, v - 1))}
                    className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground text-sm font-bold"
                  >−</button>
                  <span className="text-sm font-bold min-w-[28px] text-center">{rangeStart}</span>
                  <button
                    onClick={() => setRangeStart((v) => Math.min(rangeEnd - 1, v + 1))}
                    className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground text-sm font-bold"
                  >+</button>
                </div>
              </div>
              <div className="h-px w-6 bg-border" />
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground mb-1 text-center">To ayah</p>
                <div className="flex items-center gap-1.5 justify-center">
                  <button
                    onClick={() => setRangeEnd((v) => Math.max(rangeStart + 1, v - 1))}
                    className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground text-sm font-bold"
                  >−</button>
                  <span className="text-sm font-bold min-w-[28px] text-center">{rangeEnd}</span>
                  <button
                    onClick={() => setRangeEnd((v) => Math.min(totalAyahs || 999, v + 1))}
                    className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground text-sm font-bold"
                  >+</button>
                </div>
              </div>
            </div>
            {rangeActive && (
              <p className="text-[10px] text-center mt-2" style={{ color: gold }}>
                Looping ayah {rangeStart} – {rangeEnd} continuously
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Player Bar ───────────────────────────────────────────────────── */}
      <div
        className={`fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border z-50 flex items-center px-3 md:px-6 transition-transform duration-300 ease-in-out ${
          isClosing ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="flex items-center w-full max-w-6xl mx-auto gap-2">

          {/* Track info — tap on mobile to expand */}
          <div
            className="flex items-center gap-3 min-w-0 md:w-[30%] shrink-0 cursor-pointer md:cursor-default"
            onClick={() => { if (window.innerWidth < 768) setIsExpanded(true); }}
          >
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center font-arabic font-bold text-sm shrink-0"
              style={{ backgroundColor: `${gold}18`, color: gold }}
            >
              {currentSurah?.name_arabic?.slice(0, 2) ?? "سو"}
            </div>
            <div className="hidden sm:flex flex-col min-w-0">
              <div className="flex items-baseline gap-1.5 min-w-0">
                <span className="font-arabic text-sm font-semibold truncate">
                  {currentSurah?.name_arabic ?? `سورة ${audioSurahId}`}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {currentSurah?.name_simple}
                </span>
              </div>
              <div className="text-xs text-muted-foreground truncate">
                الآية {toArabicIndic(currentAyahNumber)}
                {totalAyahs > 0 && ` / ${toArabicIndic(totalAyahs)}`}
                {reciterInfo && ` · ${reciterInfo.name}`}
              </div>
            </div>
          </div>

          {/* Center: controls + scrubber */}
          <div className="flex flex-col items-center flex-1 gap-1.5 min-w-0 md:w-[40%]">
            <div className="flex items-center gap-3">
              <button
                onClick={goToPrev}
                disabled={currentAyahIdx === 0 && progress < 0.5}
                className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                title="Previous ayah"
              >
                <SkipBack className="h-4 w-4" />
              </button>
              <button
                onClick={togglePlay}
                disabled={isLoading || (!currentAyahAudio && totalAyahs === 0)}
                className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 translate-x-[1px]" />
                )}
              </button>
              <button
                onClick={goToNext}
                disabled={currentAyahIdx >= totalAyahs - 1}
                className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                title="Next ayah"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            <div className="w-full items-center gap-2 hidden sm:flex">
              <span className="text-[10px] text-muted-foreground w-8 text-right tabular-nums shrink-0">
                {fmt(hasGlobalTimeline ? overallElapsedSec : progress)}
              </span>
              <Slider
                value={[hasGlobalTimeline ? overallElapsedSec : progress]}
                max={hasGlobalTimeline ? totalDurationSec : (duration || 100)}
                step={0.1}
                className="w-full"
                onValueChange={(v) => hasGlobalTimeline ? handleGlobalSeek(v[0]) : handleSeek(v)}
                disabled={isLoading || (!hasGlobalTimeline && !duration)}
              />
              <span className="text-[10px] text-muted-foreground w-8 tabular-nums shrink-0">
                {fmt(hasGlobalTimeline ? totalDurationSec : duration)}
              </span>
            </div>
          </div>

          {/* Right: secondary controls */}
          <div className="flex items-center justify-end gap-0.5 md:w-[30%] shrink-0">
            {/* Speed */}
            <button
              onClick={cycleSpeed}
              className="hidden sm:flex items-center justify-center text-[11px] font-bold px-2 py-1 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors min-w-[38px]"
            >
              {playbackSpeed}x
            </button>

            {/* Loop */}
            <button
              onClick={cycleLoop}
              className="h-8 w-8 hidden sm:flex items-center justify-center relative rounded-lg hover:bg-muted transition-colors"
              style={{ color: loopActive ? gold : "var(--muted-foreground)" }}
              title={
                loopMode === "none"
                  ? "No loop"
                  : loopMode === "ayah"
                  ? "Loop this ayah"
                  : "Loop full surah"
              }
            >
              {loopMode === "ayah" ? (
                <Repeat1 className="h-4 w-4" />
              ) : (
                <Repeat className="h-4 w-4" />
              )}
              {loopMode === "surah" && (
                <span
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[7px] font-black"
                  style={{ color: gold }}
                >
                  ∞
                </span>
              )}
            </button>

            {/* Reciter */}
            <button
              onClick={() => setShowReciterPopup((v) => !v)}
              className="h-8 w-8 hidden sm:flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
              style={{ color: showReciterPopup ? gold : "var(--muted-foreground)" }}
              title="Switch reciter"
            >
              <Mic className="h-4 w-4" />
            </button>

            {/* Follow Along */}
            <button
              onClick={() => setShowFollowAlong((v) => !v)}
              className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
              style={{ color: showFollowAlong ? gold : "var(--muted-foreground)" }}
              title="Follow along"
            >
              <AlignLeft className="h-4 w-4" />
            </button>

            {/* Close */}
            <button
              onClick={handleClose}
              className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              title="Close player"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
