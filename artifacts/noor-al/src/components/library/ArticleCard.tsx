import { Clock, CheckCircle, Bookmark, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import type { LibraryArticle } from "../../data/library/types";
import { useAppStore } from "@/lib/store";

interface LibraryRecord { articleId: string; }

interface Props {
  categoryId: string;
  article: LibraryArticle;
}

export function ArticleCard({ categoryId, article }: Props) {
  const [, setLocation] = useLocation();
  const { userId } = useAuth();
  const language = useAppStore((s) => s.language);
  const isArabic = language === "ar";

  const { data: progress = [] } = useQuery<LibraryRecord[]>({
    queryKey: ["library-progress"],
    queryFn: () => fetch("/api/library/progress").then((r) => r.ok ? r.json() : []),
    enabled: !!userId,
    staleTime: 30_000,
  });

  const { data: bookmarks = [] } = useQuery<LibraryRecord[]>({
    queryKey: ["library-bookmarks"],
    queryFn: () => fetch("/api/library/bookmarks").then((r) => r.ok ? r.json() : []),
    enabled: !!userId,
    staleTime: 30_000,
  });

  const isComplete = progress.some((p) => p.articleId === article.id);
  const isBookmarked = bookmarks.some((b) => b.articleId === article.id);

  return (
    <button
      onClick={() => setLocation(`/library/${categoryId}/${article.id}`)}
      className="group flex items-start gap-4 rounded-xl border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all text-left w-full"
    >
      {/* Status dot */}
      <div
        className={cn(
          "mt-1 w-2.5 h-2.5 rounded-full shrink-0 transition-colors",
          isComplete ? "bg-green-500" : "bg-muted-foreground/30"
        )}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0" dir={isArabic ? "rtl" : "ltr"}>
            {isArabic && article.arabicTitle ? (
              <>
                <p
                  className="font-arabic font-semibold text-foreground leading-snug"
                  style={{ fontSize: "1.05rem" }}
                >
                  {article.arabicTitle}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{article.title}</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-sm text-foreground leading-tight">
                  {article.title}
                </p>
                {article.arabicTitle && (
                  <p className="text-xs text-primary font-arabic mt-0.5">
                    {article.arabicTitle}
                  </p>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {isBookmarked && (
              <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            )}
            {isComplete && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>

        <p
          className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2"
          dir={isArabic ? "rtl" : "ltr"}
        >
          {isArabic && article.descriptionAr
            ? article.descriptionAr
            : article.description}
        </p>

        <div className="mt-2 flex items-center gap-3" dir={isArabic ? "rtl" : "ltr"}>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {isArabic
              ? `${article.readTime} دقيقة`
              : `${article.readTime} min read`}
          </span>
          {article.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
