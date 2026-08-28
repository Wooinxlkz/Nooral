import { useState } from "react";
import { motion } from "framer-motion";
import { useSEO } from "@/lib/seo";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, Star, CheckCircle2, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const CURRENCIES = [
  { code: "DZD", name: "Algerian Dinar",     symbol: "د.ج", group: "main" },
  { code: "SAR", name: "Saudi Riyal",         symbol: "ر.س", group: "arabic" },
  { code: "AED", name: "UAE Dirham",          symbol: "د.إ", group: "arabic" },
  { code: "KWD", name: "Kuwaiti Dinar",       symbol: "د.ك", group: "arabic" },
  { code: "BHD", name: "Bahraini Dinar",      symbol: "د.ب", group: "arabic" },
  { code: "QAR", name: "Qatari Riyal",        symbol: "ر.ق", group: "arabic" },
  { code: "OMR", name: "Omani Rial",          symbol: "ر.ع", group: "arabic" },
  { code: "JOD", name: "Jordanian Dinar",     symbol: "د.أ", group: "arabic" },
  { code: "EGP", name: "Egyptian Pound",      symbol: "ج.م", group: "arabic" },
  { code: "MAD", name: "Moroccan Dirham",     symbol: "د.م", group: "arabic" },
  { code: "TND", name: "Tunisian Dinar",      symbol: "د.ت", group: "arabic" },
  { code: "LYD", name: "Libyan Dinar",        symbol: "ل.د", group: "arabic" },
  { code: "IQD", name: "Iraqi Dinar",         symbol: "ع.د", group: "arabic" },
  { code: "EUR", name: "Euro",                symbol: "€",   group: "international" },
  { code: "USD", name: "US Dollar",           symbol: "$",   group: "international" },
  { code: "CNY", name: "Chinese Yuan",        symbol: "¥",   group: "international" },
  { code: "RUB", name: "Russian Ruble",       symbol: "₽",   group: "international" },
  { code: "IDR", name: "Indonesian Rupiah",   symbol: "Rp",  group: "international" },
];

const cardVariants = {
  initial: { scale: 1, y: 0 },
  hover: {
    scale: 1.015,
    y: -4,
    transition: { type: "spring" as const, stiffness: 280, damping: 22 },
  },
};

interface DonationPayload {
  type: "support" | "sadaqah";
  amount?: string;
  currency: string;
  frequency?: "one-time" | "monthly";
  email?: string;
  note?: string;
  sadaqahFor?: string;
  isAnonymous: boolean;
}

async function postDonation(payload: DonationPayload) {
  const res = await fetch("/api/donations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || "Failed to submit");
  }
  return res.json();
}

function CurrencySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const selected = CURRENCIES.find((c) => c.code === value);
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue>
          {selected ? `${selected.symbol} ${selected.code}` : value}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-64 overflow-y-auto">
        <SelectGroup>
          <SelectLabel>Main</SelectLabel>
          {CURRENCIES.filter((c) => c.group === "main").map((c) => (
            <SelectItem key={c.code} value={c.code}>
              {c.symbol} {c.code} — {c.name}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Arab World</SelectLabel>
          {CURRENCIES.filter((c) => c.group === "arabic").map((c) => (
            <SelectItem key={c.code} value={c.code}>
              {c.symbol} {c.code} — {c.name}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>International</SelectLabel>
          {CURRENCIES.filter((c) => c.group === "international").map((c) => (
            <SelectItem key={c.code} value={c.code}>
              {c.symbol} {c.code} — {c.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function SuccessState({
  type,
  onReset,
}: {
  type: "support" | "sadaqah";
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-10 text-center gap-4"
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <CheckCircle2 className="w-8 h-8 text-primary" />
      </div>
      <div className="space-y-1">
        <p className="text-lg font-semibold">
          {type === "support" ? "JazakAllahu Khayran!" : "Barakallahu Feek!"}
        </p>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          {type === "support"
            ? "Your support has been recorded. May Allah reward you abundantly."
            : "Your sadaqah intent has been recorded. May Allah accept it from you."}
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onReset}>
        Submit Another
      </Button>
    </motion.div>
  );
}

export default function GivePage() {
  useSEO(
    "Give & Sadaqah",
    "Support NoorAl to keep Islamic learning free, or give sadaqah through our transparent charity channel."
  );
  const { toast } = useToast();

  const [sAmount, setSAmount] = useState("");
  const [sCurrency, setSCurrency] = useState("DZD");
  const [sFrequency, setSFrequency] = useState<"one-time" | "monthly">("one-time");
  const [sAnonymous, setSAnonymous] = useState(true);
  const [sEmail, setSEmail] = useState("");
  const [sNote, setSNote] = useState("");
  const [sSuccess, setSSuccess] = useState(false);

  const [dFor, setDFor] = useState("");
  const [dAmount, setDAmount] = useState("");
  const [dCurrency, setDCurrency] = useState("DZD");
  const [dAnonymous, setDAnonymous] = useState(true);
  const [dEmail, setDEmail] = useState("");
  const [dNote, setDNote] = useState("");
  const [dSuccess, setDSuccess] = useState(false);

  const supportMutation = useMutation({
    mutationFn: postDonation,
    onSuccess: () => setSSuccess(true),
    onError: (err: Error) =>
      toast({ title: "Something went wrong", description: err.message, variant: "destructive" }),
  });

  const sadaqahMutation = useMutation({
    mutationFn: postDonation,
    onSuccess: () => setDSuccess(true),
    onError: (err: Error) =>
      toast({ title: "Something went wrong", description: err.message, variant: "destructive" }),
  });

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sAnonymous && (!sEmail || !sEmail.includes("@"))) {
      toast({ title: "Please enter a valid email address", variant: "destructive" });
      return;
    }
    supportMutation.mutate({
      type: "support",
      amount: sAmount || undefined,
      currency: sCurrency,
      frequency: sFrequency,
      email: sAnonymous ? undefined : sEmail,
      note: sNote || undefined,
      isAnonymous: sAnonymous,
    });
  };

  const handleSadaqahSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dFor.trim()) {
      toast({ title: "Please specify what the sadaqah is intended for", variant: "destructive" });
      return;
    }
    if (!dAnonymous && (!dEmail || !dEmail.includes("@"))) {
      toast({ title: "Please enter a valid email address", variant: "destructive" });
      return;
    }
    sadaqahMutation.mutate({
      type: "sadaqah",
      amount: dAmount || undefined,
      currency: dCurrency,
      email: dAnonymous ? undefined : dEmail,
      note: dNote || undefined,
      sadaqahFor: dFor,
      isAnonymous: dAnonymous,
    });
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-3 py-1.5 rounded-full mb-5">
          <Heart className="w-3.5 h-3.5" />
          NoorAl — Sadaqah & Support
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Give & Support
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-base">
          Help keep this platform free for everyone, or give sadaqah through
          NoorAl's transparent charity channel.
        </p>
        <p
          className="font-arabic text-primary mt-4 leading-loose"
          dir="rtl"
          style={{ fontSize: "1.35rem" }}
        >
          ﴿مَّن ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا فَيُضَاعِفَهُ لَهُ أَضْعَافًا كَثِيرَةً﴾
        </p>
        <p className="text-xs text-muted-foreground mt-1">Al-Baqarah 2:245</p>
      </div>

      {/* Equal-height cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

        {/* ── Card 1: Support NoorAl ── */}
        <motion.div
          variants={cardVariants}
          initial="initial"
          whileHover="hover"
          className="h-full"
        >
          <Card className="h-full flex flex-col border-2 border-primary/15 hover:border-primary/35 transition-colors duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Support NoorAl</CardTitle>
                  <CardDescription>Keep this platform free forever</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              {sSuccess ? (
                <SuccessState
                  type="support"
                  onReset={() => {
                    setSSuccess(false);
                    setSAmount("");
                    setSNote("");
                    setSEmail("");
                  }}
                />
              ) : (
                <form onSubmit={handleSupportSubmit} className="flex flex-col gap-4 flex-1">
                  <div className="space-y-1.5">
                    <Label>
                      Amount{" "}
                      <span className="text-muted-foreground text-xs font-normal">
                        (optional — any amount welcome)
                      </span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="Enter any amount..."
                        value={sAmount}
                        onChange={(e) => { if (/^\d*\.?\d*$/.test(e.target.value)) setSAmount(e.target.value); }}
                        className="flex-1 min-w-0"
                      />
                      <div className="w-36 shrink-0">
                        <CurrencySelect value={sCurrency} onChange={setSCurrency} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Frequency</Label>
                    <div className="flex gap-2">
                      {(["one-time", "monthly"] as const).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setSFrequency(f)}
                          className={cn(
                            "flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all",
                            sFrequency === f
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                          )}
                        >
                          {f === "one-time" ? "One-time" : "Monthly"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-muted/40 border border-border/60">
                    <Label htmlFor="s-anon" className="cursor-pointer text-sm font-normal">
                      Give anonymously
                    </Label>
                    <Switch id="s-anon" checked={sAnonymous} onCheckedChange={setSAnonymous} />
                  </div>

                  {!sAnonymous && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1.5 overflow-hidden"
                    >
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={sEmail}
                        onChange={(e) => setSEmail(e.target.value)}
                      />
                    </motion.div>
                  )}

                  <div className="space-y-1.5">
                    <Label>
                      Note{" "}
                      <span className="text-muted-foreground text-xs font-normal">
                        (optional)
                      </span>
                    </Label>
                    <Textarea
                      placeholder="Any message for the team..."
                      value={sNote}
                      onChange={(e) => setSNote(e.target.value)}
                      rows={3}
                      maxLength={500}
                    />
                  </div>

                  <div className="mt-auto pt-2">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={supportMutation.isPending}
                    >
                      {supportMutation.isPending && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      Support NoorAl
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Card 2: Sadaqah ── */}
        <motion.div
          variants={cardVariants}
          initial="initial"
          whileHover="hover"
          className="h-full"
        >
          <Card className="h-full flex flex-col border-2 border-accent/25 hover:border-accent/55 transition-colors duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Sadaqah</CardTitle>
                  <CardDescription>Give charity through NoorAl</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              {dSuccess ? (
                <SuccessState
                  type="sadaqah"
                  onReset={() => {
                    setDSuccess(false);
                    setDFor("");
                    setDAmount("");
                    setDNote("");
                    setDEmail("");
                  }}
                />
              ) : (
                <form onSubmit={handleSadaqahSubmit} className="flex flex-col gap-4 flex-1">
                  <div className="space-y-1.5">
                    <Label>
                      Sadaqah intended for{" "}
                      <span className="text-destructive text-xs">*</span>
                    </Label>
                    <Textarea
                      placeholder="e.g. orphans, building a masjid, a sick person, my late parents..."
                      value={dFor}
                      onChange={(e) => setDFor(e.target.value)}
                      rows={3}
                      maxLength={300}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>
                      Amount{" "}
                      <span className="text-muted-foreground text-xs font-normal">
                        (optional)
                      </span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="Any amount..."
                        value={dAmount}
                        onChange={(e) => { if (/^\d*\.?\d*$/.test(e.target.value)) setDAmount(e.target.value); }}
                        className="flex-1 min-w-0"
                      />
                      <div className="w-36 shrink-0">
                        <CurrencySelect value={dCurrency} onChange={setDCurrency} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-muted/40 border border-border/60">
                    <Label htmlFor="d-anon" className="cursor-pointer text-sm font-normal">
                      Give anonymously
                    </Label>
                    <Switch id="d-anon" checked={dAnonymous} onCheckedChange={setDAnonymous} />
                  </div>

                  {!dAnonymous && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1.5 overflow-hidden"
                    >
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={dEmail}
                        onChange={(e) => setDEmail(e.target.value)}
                      />
                    </motion.div>
                  )}

                  <div className="space-y-1.5">
                    <Label>
                      Note{" "}
                      <span className="text-muted-foreground text-xs font-normal">
                        (optional)
                      </span>
                    </Label>
                    <Textarea
                      placeholder="Any additional context..."
                      value={dNote}
                      onChange={(e) => setDNote(e.target.value)}
                      rows={3}
                      maxLength={500}
                    />
                  </div>

                  <div className="flex gap-2.5 p-3 rounded-lg bg-muted/40 border border-border/60">
                    <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Sadaqah collected will go to verified causes — we are transparent about every
                      dirham received. This records your intent; our team will follow up with the
                      details of collection.
                    </p>
                  </div>

                  <div className="mt-auto pt-2">
                    <Button
                      type="submit"
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      disabled={sadaqahMutation.isPending}
                    >
                      {sadaqahMutation.isPending && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      Give Sadaqah
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8 max-w-lg mx-auto">
        NoorAl is a transparent non-profit Islamic learning platform. No payment is processed
        on this page — this form records your intent and our team will reach out directly
        to arrange the contribution.
      </p>
    </div>
  );
}
