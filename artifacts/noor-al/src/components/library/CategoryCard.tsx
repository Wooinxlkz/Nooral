import {
  Droplets, Star, Columns, HandMetal, BookHeart, Clock, Scale,
} from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import type { LibraryCategory } from "../../data/library/types";
import { useAppStore } from "@/lib/store";

const ICONS: Record<string, React.FC<{ className?: string }>> = {
  Droplets, Star, Columns, HandMetal, BookHeart, Clock, Scale,
};

const COLOR_CLASSES: Record<string, string> = {
  blue:   "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  amber:  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  green:  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  teal:   "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  orange: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  red:    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

interface LibraryRecord { articleId: string; }

interface Props {
  category: LibraryCategory;
}

export function CategoryCard({ category }: Props) {
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

  const Icon = ICONS[category.icon] ?? Star;
  const colorClass = COLOR_CLASSES[category.color] ?? COLOR_CLASSES.teal;
  const total = category.articles.length;
  const completed = userId
    ? category.articles.filter((a) =>
        progress.some((p) => p.articleId === a.id)
      ).length
    : 0;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const titlePrimary = isArabic ? category.arabicTitle : category.title;
  const titleSecondary = isArabic ? category.title : category.arabicTitle;
  const description =
    isArabic && category.descriptionAr ? category.descriptionAr : category.description;
  const articlesLabel = isArabic ? `${total} مقالة` : `${total} article${total !== 1 ? "s" : ""}`;
  const completeLabel = isArabic
    ? `${completed}/${total} مكتمل`
    : `${completed}/${total} complete`;

  return (
    <button
      onClick={() => setLocation(`/library/${category.id}`)}
      className="group flex flex-col rounded-2xl border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200 text-left overflow-hidden"
    >
      {/* Icon + title */}
      <div className={cn("flex items-center gap-3 p-5 pb-4")}>
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
            colorClass
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0" dir={isArabic ? "rtl" : "ltr"}>
          <p
            className={cn(
              "font-semibold leading-tight",
              isArabic ? "font-arabic text-base" : "text-sm text-foreground"
            )}
            style={isArabic ? { fontSize: "1.05rem" } : {}}
          >
            {titlePrimary}
          </p>
          <p
            className={cn(
              "mt-0.5 text-xs",
              isArabic ? "text-muted-foreground" : "text-primary font-arabic"
            )}
          >
            {titleSecondary}
          </p>
        </div>
      </div>

      {/* Description */}
      <p
        className="px-5 text-xs text-muted-foreground leading-relaxed flex-1"
        dir={isArabic ? "rtl" : "ltr"}
      >
        {description}
      </p>

      {/* Footer */}
      <div className="p-5 pt-4 space-y-2">
        <div
          className="flex items-center justify-between text-xs text-muted-foreground"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <span>{articlesLabel}</span>
          {userId && (
            <span className="text-primary font-medium">{completeLabel}</span>
          )}
        </div>
        {userId && (
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>
    </button>
  );
}
