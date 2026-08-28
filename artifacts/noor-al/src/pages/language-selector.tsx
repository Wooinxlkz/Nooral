import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Globe, ArrowRight } from "lucide-react";
import { LANGUAGES, type Lang } from "@/lib/i18n";

const LANG_FLAGS: Record<Lang, string> = {
  ar: "🇸🇦",
  en: "🇬🇧",
  fr: "🇫🇷",
  ur: "🇵🇰",
  bn: "🇧🇩",
  tr: "🇹🇷",
  id: "🇮🇩",
  es: "🇪🇸",
  de: "🇩🇪",
  ru: "🇷🇺",
  ms: "🇲🇾",
  fa: "🇮🇷",
};

export default function LanguageSelector({
  onSelect,
}: {
  onSelect: (lang: Lang) => void;
}) {
  const [selected, setSelected] = useState<Lang>("ar");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === selected)!;

  // Lock body background + hide scrollbar while this full-screen selector is shown
  useEffect(() => {
    const prev = {
      bg: document.documentElement.style.background,
      bodyBg: document.body.style.background,
      overflow: document.body.style.overflow,
    };
    document.documentElement.style.background = "hsl(173,35%,10%)";
    document.body.style.background = "hsl(173,35%,10%)";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.background = prev.bg;
      document.body.style.background = prev.bodyBg;
      document.body.style.overflow = prev.overflow;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center" style={{ overflow: "visible" }}>

      {/* ── Background ── */}
      <div className="absolute inset-0 bg-[hsl(173,35%,10%)]" style={{ overflow: "hidden" }}>
        {/* Glow orbs */}
        <div className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full bg-[hsl(173,55%,25%)] opacity-35 blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-48 -right-24 w-[640px] h-[640px] rounded-full bg-[hsl(160,45%,18%)] opacity-25 blur-[150px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[320px] h-[320px] rounded-full bg-[hsl(173,60%,30%)] opacity-15 blur-[100px] pointer-events-none" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(160,220,200,0.8) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* Ghost "نور" */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
          <span className="font-arabic text-[22rem] font-bold text-white opacity-[0.025] leading-none">نور</span>
        </div>
      </div>

      {/* ── Glass Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[420px] mx-5"
      >
        <div
          className="rounded-2xl border border-white/[0.12] px-8 pt-10 pb-8 flex flex-col items-center gap-7"
          style={{
            background: "linear-gradient(160deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 100%)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.11)",
          }}
        >
          {/* ── Logo ── */}
          <div className="flex flex-col items-center gap-4">
            {/* Icon tile */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(100,200,160,0.28) 0%, rgba(60,160,120,0.16) 100%)",
                boxShadow: "0 0 0 1px rgba(100,200,160,0.22), 0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              <span
                className="font-arabic text-3xl font-bold text-white leading-none"
                style={{ textShadow: "0 0 20px rgba(100,200,160,0.65)" }}
              >
                ن
              </span>
            </div>

            {/* App name in English */}
            <div className="text-center">
              <div className="flex items-baseline justify-center gap-0 leading-none mb-1">
                <span
                  className="text-[2.2rem] font-bold tracking-tight text-white"
                  style={{ textShadow: "0 0 28px rgba(100,200,160,0.4)", fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  Noor
                </span>
                <span
                  className="text-[2.2rem] font-bold tracking-tight"
                  style={{ color: "rgb(100,200,160)", textShadow: "0 0 28px rgba(100,200,160,0.5)", fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  Al
                </span>
              </div>
              <p className="text-[12.5px] text-white/38 tracking-[0.15em] uppercase font-medium">
                Your Quran Companion
              </p>
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

          {/* ── Dropdown section ── */}
          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-white/35" />
              <span className="text-[11px] font-medium text-white/35 uppercase tracking-widest">
                Interface Language
              </span>
            </div>

            {/* Custom dropdown — opens UPWARD so it's never clipped */}
            <div ref={dropdownRef} className="relative w-full">

              {/* Dropdown menu — rendered ABOVE the trigger */}
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border border-white/10 z-50"
                    style={{
                      background: "linear-gradient(180deg, rgba(18,52,42,0.98) 0%, rgba(12,38,30,0.98) 100%)",
                      backdropFilter: "blur(24px)",
                      WebkitBackdropFilter: "blur(24px)",
                      boxShadow: "0 -8px 40px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
                      maxHeight: "260px",
                      overflowY: "auto",
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    <style>{`.noor-dropdown::-webkit-scrollbar { display: none; }`}</style>
                    <div className="noor-dropdown" style={{ overflowY: "auto", maxHeight: "260px", scrollbarWidth: "none" }}>
                      {LANGUAGES.map(({ code, label, nativeName, rtl }, idx) => {
                        const isSelected = code === selected;
                        return (
                          <button
                            key={code}
                            onClick={() => {
                              setSelected(code);
                              setOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-100"
                            style={{
                              background: isSelected ? "rgba(100,200,160,0.13)" : "transparent",
                              borderBottom: idx < LANGUAGES.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent";
                            }}
                          >
                            <span className="text-xl leading-none shrink-0 select-none">{LANG_FLAGS[code]}</span>
                            <div className="flex flex-col min-w-0 flex-1">
                              <span
                                className={`text-[13px] font-medium leading-tight truncate ${isSelected ? "text-[rgb(100,200,160)]" : "text-white/80"} ${rtl ? "font-arabic" : ""}`}
                              >
                                {nativeName}
                              </span>
                              <span className="text-[11px] text-white/30 leading-tight">{label}</span>
                            </div>
                            {isSelected && (
                              <div
                                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                                style={{ background: "rgba(100,200,160,0.2)" }}
                              >
                                <Check className="w-3 h-3 text-[rgb(100,200,160)]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Trigger button */}
              <button
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 border transition-all duration-150"
                style={{
                  background: open ? "rgba(100,200,160,0.1)" : "rgba(255,255,255,0.06)",
                  borderColor: open ? "rgba(100,200,160,0.4)" : "rgba(255,255,255,0.12)",
                  boxShadow: open ? "0 0 0 3px rgba(100,200,160,0.07)" : "none",
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl leading-none shrink-0 select-none">{LANG_FLAGS[current.code]}</span>
                  <div className="flex flex-col items-start min-w-0">
                    <span className={`text-sm font-semibold text-white leading-tight truncate ${current.rtl ? "font-arabic" : ""}`}>
                      {current.nativeName}
                    </span>
                    <span className="text-[11px] text-white/38 leading-tight">{current.label}</span>
                  </div>
                </div>

                <motion.div
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />
                </motion.div>
              </button>
            </div>

            {/* Language detail pill */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg"
                style={{ background: "rgba(100,200,160,0.07)", border: "1px solid rgba(100,200,160,0.13)" }}
              >
                <span className="text-base leading-none select-none">{LANG_FLAGS[selected]}</span>
                <span className="text-[12px] text-[rgba(100,200,160,0.75)] flex-1">
                  {current.rtl ? "Right-to-left" : "Left-to-right"} · {current.label}
                </span>
                {current.rtl && (
                  <span className="text-[10px] font-semibold text-[rgba(100,200,160,0.55)] border border-[rgba(100,200,160,0.18)] rounded px-1.5 py-0.5 tracking-widest uppercase">
                    RTL
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Continue button ── */}
          <motion.button
            whileHover={{ scale: 1.016 }}
            whileTap={{ scale: 0.984 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            onClick={() => onSelect(selected)}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-[13.5px] transition-all duration-150"
            style={{
              background: "linear-gradient(135deg, hsl(163,52%,38%) 0%, hsl(153,48%,30%) 100%)",
              boxShadow: "0 4px 24px rgba(60,160,120,0.38), inset 0 1px 0 rgba(255,255,255,0.14)",
              color: "white",
              letterSpacing: "0.04em",
            }}
          >
            <span>Continue with {current.label}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          {/* Footer */}
          <p className="text-[10px] text-white/20 tracking-widest uppercase -mt-3">
            You can change this anytime in settings
          </p>
        </div>
      </motion.div>
    </div>
  );
}
