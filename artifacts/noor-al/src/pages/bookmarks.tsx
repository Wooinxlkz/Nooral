import { useAuth } from "@/lib/auth";
import { useSEO } from "@/lib/seo";
import { Link } from "wouter";
import { SignInPrompt } from "@/components/sign-in-prompt";
import { Bookmark, Loader2, Trash2, BookOpen, ExternalLink } from "lucide-react";
import { useGetBookmarks, useDeleteBookmark } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function BookmarksPage() {
  useSEO("Bookmarks", "View and manage your saved Quran ayah bookmarks.");
  const { isSignedIn, isLoaded } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const { data: bookmarks, isLoading, refetch } = useGetBookmarks({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: { enabled: !!isSignedIn } as any,
  });

  const deleteBookmark = useDeleteBookmark();

  if (isLoaded && !isSignedIn) {
    return <SignInPrompt title="Sign in to view bookmarks" description="Bookmark any verse and access them all in one place. Sign in to continue." />;
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteBookmark.mutateAsync({ id });
      refetch();
      toast({ title: t("bookmarks.removed") });
    } catch {
      toast({ title: t("bookmarks.failed"), variant: "destructive" });
    }
  };

  const grouped: Record<string, typeof bookmarks> = {};
  if (bookmarks) {
    for (const bm of bookmarks) {
      const key = `${bm.surahId}|${bm.surahNameEn}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key]!.push(bm);
    }
  }

  const sortedGroups = Object.entries(grouped).sort(
    ([a], [b]) => parseInt(a.split("|")[0]) - parseInt(b.split("|")[0])
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Bookmark className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t("bookmarks.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {bookmarks ? `${bookmarks.length} saved ayah${bookmarks.length !== 1 ? "s" : ""}` : ""}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : bookmarks?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
          <Bookmark className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-base font-medium">{t("bookmarks.noBookmarks")}</p>
          <p className="text-sm mt-1">Bookmark ayahs while reading to save them here.</p>
          <Link href="/reader">
            <Button variant="outline" className="mt-6 gap-2">
              <BookOpen className="w-4 h-4" />
              {t("bookmarks.goToReader")}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedGroups.map(([key, bms]) => {
            const [surahIdStr, surahName] = key.split("|");
            const surahId = parseInt(surahIdStr);
            return (
              <div key={key}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {surahName || `Surah ${surahId}`}
                  </span>
                  <Badge variant="secondary" className="text-[11px] h-5">
                    {bms!.length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {bms!
                    .sort((a, b) => a.ayahNumber - b.ayahNumber)
                    .map((bm) => (
                      <Card
                        key={bm.id}
                        className={cn(
                          "group border-border/60 hover:border-primary/30 transition-colors"
                        )}
                      >
                        <CardContent className="p-4 flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-[11px] font-mono h-5">
                                {surahName} · {bm.ayahNumber}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(bm.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                              </span>
                            </div>
                            {bm.ayahText && (
                              <p
                                className="font-arabic text-right text-foreground leading-loose text-lg line-clamp-2"
                                dir="rtl"
                              >
                                {bm.ayahText}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/reader?surah=${surahId}&ayah=${bm.ayahNumber}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8" title="Open in Reader">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              title="Delete bookmark"
                              onClick={() => handleDelete(bm.id)}
                              disabled={deleteBookmark.isPending}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
