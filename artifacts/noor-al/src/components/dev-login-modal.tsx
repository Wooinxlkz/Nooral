import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Terminal, AlertCircle, Loader2, Lock } from "lucide-react";
import { setDevSession } from "@/lib/dev-session";
import { cn } from "@/lib/utils";

interface DevLoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DevLoginModal({ open, onClose, onSuccess }: DevLoginModalProps) {
  const [name, setName] = React.useState("");
  const [pin, setPin] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setName("");
      setPin("");
      setError("");
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !pin.trim()) {
      setError("Both fields are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/dev/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), pin: pin.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Access denied.");
        return;
      }
      setDevSession(data.token, data.name, Date.now());
      onSuccess();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="dev-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            key="dev-modal"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
            aria-modal="true"
          >
            <div
              className="w-full max-w-[20rem] bg-[#0d0d0d] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-amber-500/20">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                    <Terminal className="size-3.5 text-amber-400" />
                  </div>
                  <span className="text-sm font-semibold text-amber-400 tracking-wide">Dev Access</span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Developer Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter developer name"
                    autoComplete="off"
                    autoFocus
                    disabled={loading}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-colors disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">PIN Code</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="••••••"
                      autoComplete="current-password"
                      disabled={loading}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 pr-9 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-colors disabled:opacity-50"
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-600" />
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5"
                    >
                      <AlertCircle className="size-3.5 shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-semibold text-sm rounded-lg py-2.5 transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                  {loading ? "Verifying…" : "Access Console"}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
