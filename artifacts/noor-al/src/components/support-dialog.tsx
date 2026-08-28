import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Bug, Lightbulb, Globe2, MessageSquare, Send, HeartHandshake, ExternalLink, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: CaseValue;
}

const CASES = [
  {
    value: "bug",
    label: "Report a bug",
    icon: Bug,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    placeholder: "Describe the bug and steps to reproduce it…",
  },
  {
    value: "feature",
    label: "Suggest a feature",
    icon: Lightbulb,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    placeholder: "Describe your idea and how it would help…",
  },
  {
    value: "translate",
    label: "Help translate",
    icon: Globe2,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    placeholder: "Which language do you want to help with?",
  },
  {
    value: "general",
    label: "General inquiry",
    icon: MessageSquare,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    placeholder: "How can we help?",
  },
] as const;

type CaseValue = (typeof CASES)[number]["value"];

export function SupportDialog({ open, onOpenChange, defaultType }: SupportDialogProps) {
  const [, setLocation] = useLocation();
  const [caseType, setCaseType] = useState<CaseValue | "">(defaultType ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync pre-selected type whenever the dialog opens with a new defaultType
  useEffect(() => {
    if (open && defaultType) setCaseType(defaultType);
  }, [open, defaultType]);

  const selected = CASES.find((c) => c.value === caseType);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!caseType || !message.trim() || !name.trim() || !email.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/support`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, country: country || undefined, type: caseType, message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to send");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setCaseType("");
    setName("");
    setEmail("");
    setCountry("");
    setMessage("");
    setSubmitted(false);
    setError(null);
  }

  function handleClose() {
    onOpenChange(false);
    setTimeout(handleReset, 300);
  }

  const canSubmit = !!caseType && message.trim().length >= 10 && name.trim() && email.trim();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden gap-0">
        {/* Header strip */}
        <div className={cn(
          "px-6 pt-6 pb-5 border-b border-border/40",
          selected ? `${selected.bg} ${selected.border}` : "bg-primary/5 border-primary/10"
        )}>
          <div className="flex items-start gap-3">
            <div className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border",
              selected ? `${selected.bg} ${selected.border}` : "bg-primary/10 border-primary/20"
            )}>
              {selected
                ? <selected.icon className={cn("h-5 w-5", selected.color)} />
                : <HeartHandshake className="h-5 w-5 text-primary" />}
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base font-semibold leading-tight">
                Contact Support
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                We read every message. Usually reply within 24–48 h.
              </DialogDescription>
            </div>
          </div>
        </div>

        {submitted ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
            <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7 text-emerald-500" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Message received!</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                Your ticket is saved and we'll follow up on your email. You can also explore
                ways to contribute to NoorAl.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-1 w-full">
              <Button
                variant="outline"
                className="flex-1 gap-2 rounded-xl"
                onClick={() => { handleClose(); setLocation("/contribute"); }}
              >
                <ExternalLink className="h-4 w-4" />
                Contribute page
              </Button>
              <Button className="flex-1 rounded-xl" onClick={handleReset}>
                Send another
              </Button>
            </div>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">
            {/* Case type */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">What can we help with? *</Label>
              <Select value={caseType} onValueChange={(v) => setCaseType(v as CaseValue)}>
                <SelectTrigger className="rounded-xl h-10">
                  <SelectValue placeholder="Choose a topic…" />
                </SelectTrigger>
                <SelectContent>
                  {CASES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      <div className="flex items-center gap-2">
                        <c.icon className={cn("h-3.5 w-3.5", c.color)} />
                        {c.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Name + Email */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Name *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="rounded-xl h-10"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Email *</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="rounded-xl h-10"
                  required
                />
              </div>
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Country</Label>
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Egypt, USA, UK…"
                className="rounded-xl h-10"
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Message * <span className="text-muted-foreground font-normal">(min 10 chars)</span></Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={selected?.placeholder ?? "How can we help?"}
                className="rounded-xl resize-none min-h-[100px]"
                required
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-xs text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                className="flex-1 rounded-xl text-muted-foreground"
                onClick={() => { handleClose(); setLocation("/contribute"); }}
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                Contribute page
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-xl gap-2"
                disabled={!canSubmit || submitting}
              >
                {submitting
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                  : <><Send className="h-4 w-4" /> Send message</>}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
