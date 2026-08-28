import { useState, useRef, useCallback } from "react";
import { useSEO } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, ImageIcon, Wand2 } from "lucide-react";
import { useSurahs, useVersesByChapter } from "@/lib/quran-api";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const BACKGROUNDS = [
  { id: "ivory", label: "Ivory", bg: "#FEFCF3", fg: "#1a2e1a", accent: "#3c6e50", cardBg: "#F5F0E0" },
  { id: "night", label: "Night", bg: "#0F172A", fg: "#E2E8F0", accent: "#7DD3A8", cardBg: "#1E293B" },
  { id: "emerald", label: "Emerald", bg: "#064E3B", fg: "#ECFDF5", accent: "#A7F3D0", cardBg: "#065F46" },
  { id: "sky",    label: "Sky",    bg: "#0C4A6E", fg: "#E0F2FE", accent: "#7DD3FC", cardBg: "#075985" },
  { id: "rose",   label: "Rose",   bg: "#4C0519", fg: "#FFE4E6", accent: "#FDA4AF", cardBg: "#5B0A21" },
  { id: "sand",   label: "Sand",   bg: "#78350F", fg: "#FEF3C7", accent: "#FDE68A", cardBg: "#92400E" },
];

const RATIOS: { id: string; label: string; w: number; h: number }[] = [
  { id: "square",    label: "Square 1:1",   w: 400, h: 400 },
  { id: "portrait",  label: "Portrait 4:5", w: 400, h: 500 },
  { id: "story",     label: "Story 9:16",   w: 360, h: 640 },
  { id: "landscape", label: "Landscape 16:9", w: 640, h: 360 },
];

function stripTags(html: string) {
  return html.replace(/<[^>]*>/g, "");
}

export default function MediaPage() {
  useSEO("Verse Image Creator", "Create beautiful shareable images from Quran verses. Customize backgrounds, aspect ratios, and download for social media.");

  const { toast } = useToast();
  const { activeTranslations } = useAppStore();
  const [surahId, setSurahId] = useState(1);
  const [ayahNum, setAyahNum] = useState(1);
  const [bgId, setBgId] = useState("ivory");
  const [ratioId, setRatioId] = useState("square");
  const [fontSize, setFontSize] = useState(24);
  const [showTranslation, setShowTranslation] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const { data: surahs } = useSurahs();
  const { data: verses } = useVersesByChapter(surahId, activeTranslations);

  const bg = BACKGROUNDS.find(b => b.id === bgId) ?? BACKGROUNDS[0];
  const ratio = RATIOS.find(r => r.id === ratioId) ?? RATIOS[0];
  const verse = (verses ?? []).find((v: any) => v.verse_number === ayahNum);
  const surah = (surahs as any[] ?? []).find((s: any) => s.id === surahId);

  const arabic = verse?.text_uthmani ?? "";
  const translation = verse?.translations?.[0]?.text ? stripTags(verse.translations[0].text) : "";
  const ref = surah ? `${surah.name_simple} ${surahId}:${ayahNum}` : `${surahId}:${ayahNum}`;

  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
      const link = document.createElement("a");
      link.download = `quran-${surahId}-${ayahNum}.png`;
      link.href = dataUrl;
      link.click();
      toast({ title: "Image downloaded ✓" });
    } catch {
      toast({ title: "Export failed", variant: "destructive" });
    } finally {
      setDownloading(false);
    }
  }, [surahId, ayahNum, toast]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ImageIcon className="w-8 h-8 text-primary" />
          Verse Image Creator
        </h1>
        <p className="text-muted-foreground mt-1">Create beautiful shareable images from Quran verses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Verse</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs mb-1.5 block">Surah</Label>
                  <Select value={String(surahId)} onValueChange={v => { setSurahId(Number(v)); setAyahNum(1); }}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {(surahs as any[] ?? []).map((s: any) => (
                        <SelectItem key={s.id} value={String(s.id)} className="text-xs">
                          {s.id}. {s.name_simple}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Ayah</Label>
                  <Input
                    type="number"
                    min={1}
                    max={surah?.verses_count ?? 300}
                    value={ayahNum}
                    onChange={e => setAyahNum(Math.max(1, Math.min(surah?.verses_count ?? 300, Number(e.target.value))))}
                    className="text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Background</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {BACKGROUNDS.map(b => (
                  <button
                    key={b.id}
                    onClick={() => setBgId(b.id)}
                    className={cn(
                      "h-12 rounded-lg border-2 transition-all text-xs font-medium",
                      bgId === b.id ? "border-primary scale-105" : "border-transparent hover:border-border"
                    )}
                    style={{ backgroundColor: b.bg, color: b.fg }}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Layout</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs mb-1.5 block">Aspect Ratio</Label>
                <div className="grid grid-cols-2 gap-2">
                  {RATIOS.map(r => (
                    <button
                      key={r.id}
                      onClick={() => setRatioId(r.id)}
                      className={cn(
                        "py-2 px-3 rounded-lg border text-xs font-medium transition-all",
                        ratioId === r.id ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted/40"
                      )}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs mb-2 block">Arabic Font Size — {fontSize}px</Label>
                <Slider
                  min={16}
                  max={40}
                  step={2}
                  value={[fontSize]}
                  onValueChange={([v]) => setFontSize(v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Show Translation</Label>
                <button
                  onClick={() => setShowTranslation(v => !v)}
                  className={cn(
                    "w-10 h-6 rounded-full transition-colors",
                    showTranslation ? "bg-primary" : "bg-muted"
                  )}
                >
                  <span className={cn(
                    "block w-4 h-4 rounded-full bg-white shadow transition-transform mx-1",
                    showTranslation ? "translate-x-4" : "translate-x-0"
                  )} />
                </button>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full gap-2" onClick={handleDownload} disabled={downloading || !verse}>
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download PNG
          </Button>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold tracking-widest">Preview</p>
          <div
            className="overflow-hidden rounded-2xl shadow-2xl"
            style={{ width: Math.min(ratio.w, 400), height: Math.min(ratio.h, 400) * (ratio.h / ratio.w) }}
          >
            <div
              ref={cardRef}
              style={{
                width: ratio.w,
                height: ratio.h,
                backgroundColor: bg.bg,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 32px",
                gap: "20px",
                transform: `scale(${Math.min(400 / ratio.w, (400 * ratio.h / ratio.w) / ratio.h)})`,
                transformOrigin: "top left",
              }}
            >
              {/* Top accent */}
              <div style={{ width: "40px", height: "3px", backgroundColor: bg.accent, borderRadius: "2px" }} />

              {/* Bismillah */}
              <p style={{ fontFamily: "var(--font-arabic, serif)", fontSize: "18px", color: bg.accent, textAlign: "center" }}>
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>

              {/* Arabic verse */}
              {arabic ? (
                <p style={{
                  fontFamily: "var(--font-arabic, serif)",
                  fontSize: `${fontSize}px`,
                  color: bg.fg,
                  textAlign: "right",
                  direction: "rtl",
                  lineHeight: "1.9",
                  margin: 0,
                }}>
                  {arabic}
                </p>
              ) : (
                <p style={{ color: bg.fg, opacity: 0.4, fontSize: "14px" }}>Select a verse to preview</p>
              )}

              {/* Translation */}
              {showTranslation && translation && (
                <p style={{
                  fontSize: "13px",
                  color: bg.fg,
                  opacity: 0.75,
                  textAlign: "center",
                  fontStyle: "italic",
                  lineHeight: "1.6",
                  maxWidth: "90%",
                }}>
                  &ldquo;{translation.slice(0, 200)}{translation.length > 200 ? "…" : ""}&rdquo;
                </p>
              )}

              {/* Reference */}
              {arabic && (
                <p style={{ fontSize: "12px", color: bg.accent, fontWeight: "700", letterSpacing: "0.05em" }}>
                  — {ref}
                </p>
              )}

              {/* Bottom watermark */}
              <p style={{ fontSize: "10px", color: bg.accent, opacity: 0.6, marginTop: "auto" }}>
                NoorAl · Quran Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Wand2 className="w-3.5 h-3.5" />
            <span>Exported at 2× resolution for crisp sharing</span>
          </div>
        </div>
      </div>
    </div>
  );
}
