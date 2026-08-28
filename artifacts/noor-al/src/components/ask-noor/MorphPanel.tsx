import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { buildContextForQuery, findSlashCommand, getSlashCommandSuggestions, matchKnowledge } from "./noor-knowledge";
import "./MorphPanel.css";

// ─── Inline markdown renderer ─────────────────────────────────────────────────
function parseInline(text: string, keyBase: number): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let last = 0;
  let idx = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      parts.push(<strong key={`${keyBase}-b${idx++}`} className="font-semibold text-foreground/95">{m[1]}</strong>);
    } else {
      parts.push(<em key={`${keyBase}-i${idx++}`} className="italic opacity-80">{m[2]}</em>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 ? parts[0] : <React.Fragment key={keyBase}>{parts}</React.Fragment>;
}

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("### ")) {
      nodes.push(<p key={i} className="font-bold text-foreground mt-2 mb-0.5 text-[11px] uppercase tracking-wider opacity-70">{parseInline(line.slice(4), i)}</p>);
    } else if (line.startsWith("## ")) {
      nodes.push(<p key={i} className="font-semibold text-foreground mt-2 mb-0.5 text-sm">{parseInline(line.slice(3), i)}</p>);
    } else if (line.startsWith("# ")) {
      nodes.push(<p key={i} className="font-bold text-foreground mt-2 mb-1 text-sm">{parseInline(line.slice(2), i)}</p>);
    } else if (line.startsWith("- ") || line.startsWith("• ")) {
      nodes.push(
        <div key={i} className="flex gap-1.5 pl-1">
          <span className="shrink-0 mt-[3px] text-foreground/40">•</span>
          <span>{parseInline(line.slice(2), i)}</span>
        </div>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const nm = /^(\d+)\.\s(.*)/.exec(line);
      if (nm) nodes.push(
        <div key={i} className="flex gap-1.5 pl-1">
          <span className="shrink-0 mt-[3px] font-mono text-[11px] text-foreground/40">{nm[1]}.</span>
          <span>{parseInline(nm[2], i)}</span>
        </div>
      );
    } else if (line.trim() === "") {
      nodes.push(<div key={i} className="h-2" />);
    } else {
      nodes.push(<p key={i} className="leading-relaxed">{parseInline(line, i)}</p>);
    }
  }
  return <div className="space-y-0.5 text-sm">{nodes}</div>;
}

const SPEED_FACTOR = 1;
const FORM_WIDTH = 360;
const DOCK_HEIGHT = 44;
const FORM_HEIGHT_EMPTY = 200;
const FORM_HEIGHT_SLASH = 370;
const FORM_HEIGHT_CHAT = 460;

const SYSTEM_PROMPT = `You are Noor (نور), an Islamic AI companion built into a Quran platform. You are knowledgeable, warm, and spiritually grounded.

You help users with:
- Quran tafsir (explanation) and verse meanings
- Islamic questions and fiqh
- Hadith and Sunnah references
- Arabic word meanings in the Quran
- Memorization tips and advice
- Prayer, dhikr, and worship guidance
- Islamic history and scholars

Guidelines:
- Answer in the same language the user writes in
- When quoting Quran, include surah:ayah reference
- Be concise but thorough
- Use "ﷺ" after the Prophet's name
- If you are unsure, say so honestly — do not fabricate hadith or rulings`;

interface OrbProps {
  dimension?: string;
  className?: string;
  tones?: {
    base?: string;
    accent1?: string;
    accent2?: string;
    accent3?: string;
  };
  spinDuration?: number;
}

function ColorOrb({ dimension = "192px", className, tones, spinDuration = 20 }: OrbProps) {
  const fallbackTones = {
    base: "oklch(95% 0.02 264.695)",
    accent1: "oklch(75% 0.15 350)",
    accent2: "oklch(80% 0.12 200)",
    accent3: "oklch(78% 0.14 280)",
  };

  const palette = { ...fallbackTones, ...tones };
  const dimValue = parseInt(dimension.replace("px", ""), 10);

  const blurStrength =
    dimValue < 50 ? Math.max(dimValue * 0.008, 1) : Math.max(dimValue * 0.015, 4);
  const contrastStrength =
    dimValue < 50 ? Math.max(dimValue * 0.004, 1.2) : Math.max(dimValue * 0.008, 1.5);
  const pixelDot =
    dimValue < 50 ? Math.max(dimValue * 0.004, 0.05) : Math.max(dimValue * 0.008, 0.1);
  const shadowRange =
    dimValue < 50 ? Math.max(dimValue * 0.004, 0.5) : Math.max(dimValue * 0.008, 2);
  const maskRadius =
    dimValue < 30 ? "0%" : dimValue < 50 ? "5%" : dimValue < 100 ? "15%" : "25%";
  const adjustedContrast =
    dimValue < 30
      ? 1.1
      : dimValue < 50
      ? Math.max(contrastStrength * 1.2, 1.3)
      : contrastStrength;

  return (
    <div
      className={cn("color-orb", className)}
      style={
        {
          width: dimension,
          height: dimension,
          "--base": palette.base,
          "--accent1": palette.accent1,
          "--accent2": palette.accent2,
          "--accent3": palette.accent3,
          "--spin-duration": `${spinDuration}s`,
          "--blur": `${blurStrength}px`,
          "--contrast": adjustedContrast,
          "--dot": `${pixelDot}px`,
          "--shadow": `${shadowRange}px`,
          "--mask": maskRadius,
        } as React.CSSProperties
      }
    />
  );
}

function KeyHint({ children, className }: { children: string; className?: string }) {
  return (
    <kbd
      className={cn(
        "text-foreground flex h-6 w-fit items-center justify-center rounded-sm border px-[6px] font-sans text-xs",
        className
      )}
    >
      {children}
    </kbd>
  );
}

type Message = { role: "user" | "assistant"; content: string; streaming?: boolean };

interface ContextShape {
  showForm: boolean;
  triggerOpen: () => void;
  triggerClose: () => void;
  messages: Message[];
  isStreaming: boolean;
  onSend: (msg: string) => void;
  onClear: () => void;
  submitFormRef: React.MutableRefObject<(() => void) | null>;
  slashCount: number;
  setSlashCount: (n: number) => void;
  hasInput: boolean;
  setHasInput: (v: boolean) => void;
  onOpenSupport?: (type?: "general" | "feature" | "bug") => void;
}

const FormContext = React.createContext({} as ContextShape);
const useFormContext = () => React.useContext(FormContext);

export function MorphPanel({ onOpenSupport }: { onOpenSupport?: (type?: "general" | "feature" | "bug") => void }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const submitFormRef = useRef<(() => void) | null>(null);
  const language = useAppStore((s) => s.language);

  const [showForm, setShowForm] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [slashCount, setSlashCount] = useState(0);
  const [hasInput, setHasInput] = useState(false);

  const hasMessages = messages.length > 0;
  const formHeight = hasMessages
    ? FORM_HEIGHT_CHAT
    : slashCount > 0
    ? FORM_HEIGHT_SLASH
    : FORM_HEIGHT_EMPTY;

  const triggerClose = useCallback(() => {
    setShowForm(false);
    textareaRef.current?.blur();
  }, []);

  const triggerOpen = useCallback(() => {
    setShowForm(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  }, []);

  useEffect(() => {
    function clickOutsideHandler(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node) &&
        showForm
      ) {
        triggerClose();
      }
    }
    document.addEventListener("mousedown", clickOutsideHandler);
    return () => document.removeEventListener("mousedown", clickOutsideHandler);
  }, [showForm, triggerClose]);

  const handleSend = useCallback(
    async (message: string) => {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
      const nextHistory: Message[] = [...messages, { role: "user", content: message }];
      setMessages([...nextHistory, { role: "assistant", content: "", streaming: true }]);
      setIsStreaming(true);

      // --- Offline mode: use knowledge library directly ---
      if (!apiKey) {
        const slashEntry = findSlashCommand(message);
        if (slashEntry) {
          if (slashEntry.action?.startsWith("open-support")) {
            const typeMap: Record<string, "general" | "feature" | "bug"> = {
              "open-support": "general",
              "open-support-feature": "feature",
              "open-support-bug": "bug",
            };
            setMessages((prev) => prev.slice(0, -1));
            setIsStreaming(false);
            triggerClose();
            onOpenSupport?.(typeMap[slashEntry.action!]);
            return;
          }
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: slashEntry.content, streaming: false };
            return updated;
          });
          setIsStreaming(false);
          return;
        }
        const matches = matchKnowledge(message, 1);
        if (matches.length > 0 && matches[0].score >= 5) {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: matches[0].entry.content, streaming: false };
            return updated;
          });
          setIsStreaming(false);
          return;
        }
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "I can answer many Quran, hadith, and app questions offline — try a slash command like /fatiha, /pillars, or /reader. For open-ended questions, add your VITE_OPENAI_API_KEY to unlock full AI.",
            streaming: false,
          };
          return updated;
        });
        setIsStreaming(false);
        return;
      }

      // --- Check for action-type slash commands (works in both modes) ---
      const slashEntryCheck = findSlashCommand(message);
      if (slashEntryCheck?.action?.startsWith("open-support")) {
        const typeMap: Record<string, "general" | "feature" | "bug"> = {
          "open-support": "general",
          "open-support-feature": "feature",
          "open-support-bug": "bug",
        };
        setMessages((prev) => prev.slice(0, -1));
        setIsStreaming(false);
        triggerClose();
        onOpenSupport?.(typeMap[slashEntryCheck.action!]);
        return;
      }

      // --- Online mode: inject knowledge context + language into system prompt ---
      const knowledgeContext = buildContextForQuery(message);
      const langNote = language && language !== "en"
        ? `\n\nIMPORTANT: The user's app language is set to "${language}". Respond in that language unless the user writes to you in a different language.`
        : "";
      const enrichedSystem = knowledgeContext
        ? `${SYSTEM_PROMPT}${langNote}\n\n--- Relevant NoorAl Knowledge (use this to answer accurately) ---\n${knowledgeContext}`
        : `${SYSTEM_PROMPT}${langNote}`;

      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            max_tokens: 1024,
            stream: true,
            messages: [
              { role: "system", content: enrichedSystem },
              ...nextHistory.map((m) => ({ role: m.role, content: m.content })),
            ],
          }),
        });

        if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const raw = line.slice(6);
            if (raw === "[DONE]") continue;
            try {
              const data = JSON.parse(raw) as {
                choices?: { delta?: { content?: string } }[];
              };
              const content = data.choices?.[0]?.delta?.content;
              if (content) {
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last?.role === "assistant") {
                    updated[updated.length - 1] = {
                      ...last,
                      content: last.content + content,
                      streaming: true,
                    };
                  }
                  return updated;
                });
              }
            } catch {}
          }
        }
      } catch (err) {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.role === "assistant" && last.streaming) {
            updated[updated.length - 1] = {
              role: "assistant",
              content: err instanceof Error ? err.message : "Something went wrong. Please try again.",
              streaming: false,
            };
          }
          return updated;
        });
      } finally {
        setIsStreaming(false);
        setMessages((prev) =>
          prev.map((m, i) =>
            i === prev.length - 1 && m.streaming ? { ...m, streaming: false } : m
          )
        );
      }
    },
    [messages, onOpenSupport, triggerClose]
  );

  const handleClear = useCallback(() => {
    setMessages([]);
  }, []);

  const ctx = useMemo(
    () => ({
      showForm,
      triggerOpen,
      triggerClose,
      messages,
      isStreaming,
      onSend: handleSend,
      onClear: handleClear,
      submitFormRef,
      slashCount,
      setSlashCount,
      hasInput,
      setHasInput,
      onOpenSupport,
    }),
    [showForm, triggerOpen, triggerClose, messages, isStreaming, handleSend, handleClear, slashCount, hasInput, onOpenSupport]
  );

  return (
    <>
      {createPortal(
        <AnimatePresence>
          {showForm && (
            <motion.div
              key="morph-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[39] bg-black/25 backdrop-blur-[2px]"
              onClick={triggerClose}
            />
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Fixed bottom-left anchor */}
      <div className="fixed bottom-6 left-5 z-[60]">
        <motion.div
          ref={wrapperRef}
          data-panel
          className="relative flex flex-col items-center overflow-hidden border border-white/15 bg-background/20 shadow-lg backdrop-blur-md"
          initial={false}
          animate={{
            width: showForm ? FORM_WIDTH : "auto",
            height: showForm ? formHeight : 44,
            borderRadius: showForm ? 14 : 20,
          }}
          transition={{
            type: "spring",
            stiffness: 550 / SPEED_FACTOR,
            damping: 45,
            mass: 0.7,
            delay: showForm ? 0 : 0.08,
          }}
        >
          <FormContext.Provider value={ctx}>
            <DockBar />
            <InputForm textareaRef={textareaRef} formHeight={formHeight} />
          </FormContext.Provider>
        </motion.div>
      </div>
    </>
  );
}

function DockBar() {
  const { showForm, triggerOpen, submitFormRef, hasInput } = useFormContext();
  const canSend = showForm && hasInput;

  function handleClick() {
    if (showForm) {
      if (hasInput) submitFormRef.current?.();
    } else {
      triggerOpen();
    }
  }

  return (
    <footer className="mt-auto flex h-[44px] items-center justify-center whitespace-nowrap select-none">
      <div className="flex items-center justify-center gap-2 px-3">
        <div className="flex w-fit items-center gap-2">
          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.div
                key="blank"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                className="h-5 w-5"
              />
            ) : (
              <motion.div
                key="orb"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ColorOrb dimension="24px" tones={{ base: "oklch(22.64% 0 0)" }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="button"
          className={cn(
            "flex h-fit flex-1 items-center justify-end rounded-full px-2 py-0.5 text-sm font-medium transition-colors",
            showForm
              ? canSend
                ? "text-foreground hover:bg-accent cursor-pointer"
                : "text-foreground/30 cursor-default"
              : "text-foreground hover:bg-accent cursor-pointer"
          )}
          onClick={handleClick}
        >
          <span className="truncate">Ask Noor</span>
        </button>
      </div>
    </footer>
  );
}

function InputForm({
  textareaRef,
  formHeight,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  formHeight: number;
}) {
  const { triggerClose, showForm, messages, isStreaming, onSend, onClear, submitFormRef, setSlashCount, setHasInput } = useFormContext();
  const btnRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [slashSuggestions, setSlashSuggestions] = useState<ReturnType<typeof getSlashCommandSuggestions>>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const hasMessages = messages.length > 0;

  useEffect(() => {
    submitFormRef.current = () => { btnRef.current?.click(); };
  });

  useEffect(() => {
    setSlashCount(slashSuggestions.length);
  }, [slashSuggestions.length, setSlashCount]);

  useEffect(() => {
    setHasInput(inputValue.trim().length > 0);
  }, [inputValue, setHasInput]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setInputValue(val);
    if (val.startsWith("/") && !val.includes(" ")) {
      setSlashSuggestions(getSlashCommandSuggestions(val));
      setSelectedSuggestion(0);
    } else {
      setSlashSuggestions([]);
    }
  }

  function applySuggestion(command: string) {
    setInputValue(command + " ");
    setSlashSuggestions([]);
    if (textareaRef.current) {
      textareaRef.current.value = command + " ";
      textareaRef.current.focus();
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isStreaming) return;
    const message = inputValue.trim();
    if (message) {
      setInputValue("");
      setSlashSuggestions([]);
      if (textareaRef.current) textareaRef.current.value = "";
      onSend(message);
    }
  }

  function handleKeys(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (slashSuggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSuggestion((s) => Math.min(s + 1, slashSuggestions.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestion((s) => Math.max(s - 1, 0));
        return;
      }
      if (e.key === "Tab" || (e.key === "Enter" && !e.metaKey && !e.ctrlKey)) {
        e.preventDefault();
        applySuggestion(slashSuggestions[selectedSuggestion].command);
        return;
      }
      if (e.key === "Escape") {
        setSlashSuggestions([]);
        return;
      }
    }
    if (e.key === "Escape") triggerClose();
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      btnRef.current?.click();
    }
  }

  function handleClear() {
    setDropdownOpen(false);
    onClear();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute"
      style={{
        bottom: DOCK_HEIGHT,
        width: FORM_WIDTH,
        height: formHeight - DOCK_HEIGHT,
        pointerEvents: showForm ? "all" : "none",
      }}
    >
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 550 / SPEED_FACTOR,
              damping: 45,
              mass: 0.7,
            }}
            className="flex h-full flex-col p-1 rounded-[13px] bg-background/70"
          >
            {/* Header row */}
            <div className="flex items-start justify-between py-1">
              <p className="text-foreground z-[2] ml-[38px] flex items-center gap-[6px] text-sm select-none">
                Ask Noor
              </p>
              <div className="flex items-center gap-1 pr-1">
                {/* Dropdown menu */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="text-foreground/50 hover:text-foreground -translate-y-[3px] flex h-6 w-6 items-center justify-center rounded-md hover:bg-accent transition-colors text-base leading-none select-none"
                    title="Options"
                  >
                    ···
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 top-7 z-50 min-w-[148px] overflow-hidden rounded-[10px] border border-white/15 bg-background/80 shadow-lg backdrop-blur-md"
                      >
                        <button
                          type="button"
                          onClick={handleClear}
                          disabled={!hasMessages}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-accent/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <span className="text-xs opacity-60">⌫</span>
                          Clear chat
                        </button>
                        <div className="mx-2 h-px bg-white/10" />
                        <div className="px-3 py-2 text-[10px] text-foreground/40 leading-snug select-none">
                          Powered by Sphere AI<br />
                          <span className="text-foreground/30">@NullTrace</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit hint */}
                <button
                  type="submit"
                  ref={btnRef}
                  disabled={isStreaming}
                  className="text-foreground -translate-y-[3px] flex cursor-pointer items-center justify-center gap-1 rounded-[12px] bg-transparent pr-1 text-center select-none disabled:opacity-40"
                >
                  <KeyHint className="w-fit">⌘</KeyHint>
                  <KeyHint className="w-fit">Enter</KeyHint>
                </button>
              </div>
            </div>

            {/* Messages area */}
            {hasMessages && (
              <div className="morph-messages flex-1 overflow-y-auto px-3 pt-1 pb-2 min-h-0 space-y-3" style={{ scrollbarWidth: "thin", scrollbarColor: "oklch(50% 0 0 / 0.2) transparent" }}>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "leading-relaxed",
                      msg.role === "user"
                        ? "text-foreground/90 text-right"
                        : "text-foreground/80 text-left"
                    )}
                  >
                    {msg.role === "user" ? (
                      <span className="inline-block rounded-xl rounded-tr-sm bg-accent/50 px-3 py-1.5 max-w-[85%] text-sm">
                        {msg.content}
                      </span>
                    ) : (
                      <div className="inline-block max-w-[95%]">
                        {renderMarkdown(msg.content)}
                        {msg.streaming && (
                          <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-foreground/50 align-middle" />
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Slash command picker */}
            <AnimatePresence>
              {slashSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.12 }}
                  className="mx-1 mb-1 rounded-[10px] border border-white/15 bg-background/90 shadow-lg backdrop-blur-md overflow-hidden"
                >
                  <div className="max-h-56 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "oklch(50% 0 0 / 0.2) transparent" }}>
                    {slashSuggestions.map((s, i) => (
                      <button
                        key={s.command}
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); applySuggestion(s.command); }}
                        className={cn(
                          "flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs transition-colors",
                          i === selectedSuggestion ? "bg-accent/70" : "hover:bg-accent/40"
                        )}
                      >
                        <span className="font-mono text-primary/80 shrink-0">{s.command}</span>
                        <span className="text-foreground/60 truncate">{s.title}</span>
                      </button>
                    ))}
                  </div>
                  <div className="px-3 py-1 border-t border-white/10 text-[9px] text-foreground/30 flex gap-2">
                    <span>↑↓ navigate</span><span>↵ / Tab select</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              placeholder={
                isStreaming ? "Noor is thinking…" : "Ask anything or type / for commands…"
              }
              name="message"
              value={inputValue}
              disabled={isStreaming}
              className={cn(
                "resize-none rounded-md bg-transparent p-4 text-sm outline-none transition-all",
                hasMessages
                  ? "h-[72px] flex-none overflow-y-auto"
                  : slashSuggestions.length > 0
                  ? "h-[54px] flex-none overflow-hidden"
                  : "flex-1 overflow-hidden"
              )}
              onChange={handleInputChange}
              onKeyDown={handleKeys}
              spellCheck={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-2 left-3"
          >
            <ColorOrb dimension="24px" tones={{ base: "oklch(22.64% 0 0)" }} />
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

export default MorphPanel;
