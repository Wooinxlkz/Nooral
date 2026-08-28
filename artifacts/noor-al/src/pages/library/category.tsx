import { useUser } from "@/lib/auth";
import { useParams, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { getCategoryById } from "../../data/library/index";
import { ArticleCard } from "../../components/library/ArticleCard";
import { SignInPrompt } from "../../components/sign-in-prompt";
import { ProphetTimeline } from "../../components/library/ProphetTimeline";
import { useAppStore } from "../../lib/store";

export function LibraryCategoryPage() {
  const { isSignedIn, isLoaded } = useUser();
  const { categoryId } = useParams<{ categoryId: string }>();
  const [, setLocation] = useLocation();
  const language = useAppStore((s) => s.language);
  const isArabic = language === "ar";

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <SignInPrompt
        title={isArabic ? "المكتبة الإسلامية" : "Islamic Knowledge Library"}
        description={isArabic ? "سجّل الدخول للوصول إلى المكتبة." : "Sign in to access the library."}
      />
    );
  }

  const category = getCategoryById(categoryId ?? "");

  if (!category) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-muted-foreground">
          {isArabic ? "الفئة غير موجودة." : "Category not found."}
        </p>
        <button
          onClick={() => setLocation("/library")}
          className="mt-4 text-sm text-primary hover:underline"
        >
          {isArabic ? "العودة إلى المكتبة" : "Back to Library"}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full py-8 space-y-6">
      {/* Back button */}
      <div className="px-4 md:px-6">
        <button
          onClick={() => setLocation("/library")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <ArrowLeft className="w-4 h-4" />
          {isArabic ? "جميع الفئات" : "All Categories"}
        </button>
      </div>

      {/* Category header — bilingual */}
      <div className="px-4 md:px-6 space-y-1" dir={isArabic ? "rtl" : "ltr"}>
        {isArabic ? (
          <>
            <p className="text-xs font-medium text-primary uppercase tracking-wide">
              {category.title}
            </p>
            <h1
              className="font-arabic text-foreground leading-relaxed"
              style={{ fontSize: "1.9rem" }}
            >
              {category.arabicTitle}
            </h1>
            <p className="text-sm text-muted-foreground">
              {category.descriptionAr ?? category.description}
            </p>
          </>
        ) : (
          <>
            <p className="text-xs font-medium text-primary font-arabic" dir="rtl">
              {category.arabicTitle}
            </p>
            <h1 className="text-2xl font-bold text-foreground">{category.title}</h1>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </>
        )}
      </div>

      {/* Prophet Timeline — full page width, no side padding */}
      {category.id === "prophets" && (
        <div className="space-y-2">
          <div className="px-4 md:px-6">
            <h2 className="text-base font-semibold text-foreground">
              {isArabic ? "خريطة الأنبياء الزمنية" : "Prophet Timeline"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {isArabic
                ? "انقر على أي نبي لعرض التفاصيل"
                : "An interactive chronological node map of all 25 prophets named in the Quran"}
            </p>
          </div>
          {/* Full-width diagram — no horizontal padding */}
          <ProphetTimeline />
        </div>
      )}

      {/* Articles grid */}
      <div className="px-4 md:px-6 space-y-3">
        <p
          className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
          dir={isArabic ? "rtl" : "ltr"}
        >
          {isArabic
            ? `${category.articles.length} مقالة`
            : `${category.articles.length} Articles`}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {category.articles.map((article) => (
            <div key={article.id} id={`prophet-${article.id}`}>
              <ArticleCard categoryId={category.id} article={article} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
