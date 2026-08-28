import { useState, useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "react-i18next";
import { useSEO } from "@/lib/seo";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { SignInPrompt } from "@/components/sign-in-prompt";
import { FileText, Trash2, Download, Loader2, Search, X } from "lucide-react";
import { RichNoteDisplay } from "@/components/rich-note-editor";
import { useGetNotes, useDeleteNote, useGetBookmarks, useGetHardAyahs, useGetMemorizationProgress } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

async function exportToPDF(
  notes: any[],
  bookmarks: any[],
  hardAyahs: any[],
  memorizationOverview: any,
) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const PRIMARY = [60, 110, 80] as const;
  const DARK = [30, 30, 30] as const;
  const MUTED = [100, 100, 100] as const;
  const pageW = 210;
  const margin = 20;
  const maxW = pageW - margin * 2;
  let y = margin;

  const addPage = () => { doc.addPage(); y = margin; };
  const checkY = (needed = 12) => { if (y + needed > 280) addPage(); };
  const heading = (text: string) => {
    checkY(18);
    doc.setFillColor(...PRIMARY);
    doc.rect(margin, y, maxW, 10, "F");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(text, margin + 4, y + 7);
    y += 14;
  };
  const subLabel = (text: string) => {
    checkY(8);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...MUTED);
    doc.text(text, margin, y);
    y += 5;
  };
  const body = (text: string, indent = 0) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(text, maxW - indent) as string[];
    lines.forEach((line: string) => { checkY(6); doc.text(line, margin + indent, y); y += 5.5; });
  };
  const divider = () => {
    checkY(5);
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, y, margin + maxW, y);
    y += 4;
  };

  // Cover
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pageW, 50, "F");
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("My Quran Journal", margin, 28);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Exported from NoorAl — ${new Date().toLocaleDateString()}`, margin, 38);
  y = 60;

  // Notes
  if (notes.length > 0) {
    heading(`My Notes (${notes.length})`);
    notes.forEach((n, i) => {
      checkY(20);
      subLabel(`${n.surahNameEn || `Surah ${n.surahId}`} • Ayah ${n.ayahNumber}  |  ${new Date(n.createdAt).toLocaleDateString()}`);
      body(n.content, 4);
      if (i < notes.length - 1) divider();
    });
    y += 6;
  }

  // Bookmarks
  if (bookmarks && bookmarks.length > 0) {
    heading(`Bookmarks (${bookmarks.length})`);
    bookmarks.forEach((b: any, i: number) => {
      checkY(14);
      subLabel(`${b.surahNameEn || `Surah ${b.surahId}`} • Ayah ${b.ayahNumber}`);
      if (b.ayahText) body(b.ayahText, 4);
      if (i < bookmarks.length - 1) divider();
    });
    y += 6;
  }

  // Hard ayahs
  if (hardAyahs && hardAyahs.length > 0) {
    heading(`Hard Ayahs (${hardAyahs.length})`);
    hardAyahs.forEach((h: any, i: number) => {
      checkY(10);
      subLabel(`${h.surahNameEn || `Surah ${h.surahId}`} • Ayah ${h.ayahNumber}`);
      if (i < hardAyahs.length - 1) divider();
    });
  }

  doc.save("my-quran-journal.pdf");
}

export default function NotesPage() {
  useSEO("My Notes", "Your personal Quran study notes and reflections. Add, edit, and organize notes linked to any ayah.");
  const { isSignedIn, isLoaded } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [exporting, setExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSurahId, setFilterSurahId] = useState<string>("all");

  const { data: notes, refetch } = useGetNotes(undefined, { query: { enabled: !!isSignedIn } as any });
  const deleteNote = useDeleteNote();
  const { data: bookmarks } = useGetBookmarks({ query: { enabled: !!isSignedIn } as any });
  const { data: hardAyahs } = useGetHardAyahs({ query: { enabled: !!isSignedIn } as any });
  const { data: memorizationOverview } = useGetMemorizationProgress({ query: { enabled: !!isSignedIn } as any });

  if (isLoaded && !isSignedIn) {
    return <SignInPrompt title="Sign in to view your notes" description="Save personal reflections and commentary on any verse. Sign in to access your notes." />;
  }

  const handleDelete = async (id: number) => {
    await deleteNote.mutateAsync({ id });
    refetch();
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportToPDF(notes ?? [], bookmarks ?? [], hardAyahs ?? [], memorizationOverview ?? null);
      toast({ title: "PDF exported ✓", description: "my-quran-journal.pdf downloaded" });
    } catch {
      toast({ title: "Export failed", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  // Unique surahs in notes for filter dropdown
  const surahOptions = useMemo(() => {
    if (!notes) return [];
    const seen = new Map<number, string>();
    for (const n of notes) {
      if (!seen.has(n.surahId)) seen.set(n.surahId, n.surahNameEn || `Surah ${n.surahId}`);
    }
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name })).sort((a, b) => a.id - b.id);
  }, [notes]);

  const filteredNotes = useMemo(() => {
    if (!notes) return [];
    return notes.filter(note => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        note.content.toLowerCase().includes(q) ||
        (note.surahNameEn ?? "").toLowerCase().includes(q);
      const matchesSurah = filterSurahId === "all" || String(note.surahId) === filterSurahId;
      return matchesSearch && matchesSurah;
    });
  }, [notes, searchQuery, filterSurahId]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            {t("notes.title")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {notes?.length ?? 0} notes across the Quran
          </p>
        </div>
        <Button variant="outline" className="gap-2 shrink-0" onClick={handleExport} disabled={exporting}>
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {t("notes.exportPdf")}
        </Button>
      </div>

      {/* Search & filter bar */}
      {(notes?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notes…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-8"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <Select value={filterSurahId} onValueChange={setFilterSurahId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All surahs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All surahs</SelectItem>
              {surahOptions.map(s => (
                <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(searchQuery || filterSurahId !== "all") && (
            <Button variant="ghost" size="sm" className="gap-1" onClick={() => { setSearchQuery(""); setFilterSurahId("all"); }}>
              <X className="w-3.5 h-3.5" /> Clear
            </Button>
          )}
        </div>
      )}

      {filteredNotes.length > 0 ? (
        <div className="grid gap-4">
          {/* Results count when filtering */}
          {(searchQuery || filterSurahId !== "all") && (
            <p className="text-sm text-muted-foreground">
              {filteredNotes.length} note{filteredNotes.length !== 1 ? "s" : ""} found
            </p>
          )}
          {filteredNotes.map(note => (
            <Card key={note.id}>
              <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg">
                    {note.surahNameEn || `Surah ${note.surahId}`} • Ayah {note.ayahNumber}
                  </CardTitle>
                  <CardDescription>
                    {new Date(note.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(note.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <RichNoteDisplay html={note.content} />
                <div className="mt-4 flex items-center justify-between">
                  <Link href={`/reader?surah=${note.surahId}&ayah=${note.ayahNumber}`}>
                    <Button variant="link" className="px-0 h-auto text-primary">Go to Ayah →</Button>
                  </Link>
                  <span className="text-xs text-muted-foreground">{note.content.length} chars</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : notes && notes.length > 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <Search className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-30" />
          <p className="text-lg font-medium mb-1">No notes match your search</p>
          <p className="text-muted-foreground text-sm">Try different keywords or clear the filters</p>
          <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(""); setFilterSurahId("all"); }}>Clear filters</Button>
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-sm">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <h2 className="text-xl font-medium mb-2">No notes yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            While reading the Quran, tap the note icon on any ayah to write down your reflections.
          </p>
          <Link href="/reader">
            <Button>Start Reading</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
