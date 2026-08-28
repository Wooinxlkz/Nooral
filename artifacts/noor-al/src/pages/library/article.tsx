import { useUser } from "@/lib/auth";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, Clock } from "lucide-react";
import { getArticleById } from "../../data/library/index";
import { SectionRenderer } from "../../components/library/SectionRenderer";
import { ArticleActions } from "../../components/library/ArticleActions";
import { QuranRef } from "../../components/library/QuranRef";
import { SignInPrompt } from "../../components/sign-in-prompt";
import { useAppStore } from "../../lib/store";

export function LibraryArticlePage() {
  const { isSignedIn, isLoaded } = useUser();
  const { categoryId, articleId } = useParams<{ categoryId: string; articleId: string }>();
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
        description={isArabic ? "سجّل الدخول لقراءة المقالات." : "Sign in to read library articles."}
      />
    );
  }

  const result = getArticleById(categoryId ?? "", articleId ?? "");

  if (!result) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-muted-foreground">
          {isArabic ? "المقالة غير موجودة." : "Article not found."}
        </p>
        <button
          onClick={() => setLocation(`/library/${categoryId}`)}
          className="mt-4 text-sm text-primary hover:underline"
        >
          {isArabic ? "العودة إلى الفئة" : "Back to category"}
        </button>
      </div>
    );
  }

  const { category, article } = result;

  return (
    /* Outer wrapper — full width for breadcrumb/nav */
    <div className="w-full">
      {/* Article body — comfortable reading width, centered */}
      <div className="max-w-[900px] mx-auto px-4 md:px-6 py-8">

        {/* Breadcrumb nav */}
        <nav
          className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <button
            onClick={() => setLocation("/library")}
            className="hover:text-foreground transition-colors shrink-0"
          >
            {isArabic ? "المكتبة" : "Library"}
          </button>
          <span>/</span>
          <button
            onClick={() => setLocation(`/library/${category.id}`)}
            className="hover:text-foreground transition-colors shrink-0"
          >
            {isArabic ? category.arabicTitle : category.title}
          </button>
          <span>/</span>
          <span className="text-foreground font-medium truncate">
            {isArabic && article.arabicTitle ? article.arabicTitle : article.title}
          </span>
        </nav>

        {/* Back button (mobile) */}
        <button
          onClick={() => setLocation(`/library/${category.id}`)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 md:hidden"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <ArrowLeft className="w-4 h-4" />
          {isArabic ? "رجوع" : "Back"}
        </button>

        {/* Article header — bilingual */}
        <div className="mb-6 pb-6 border-b space-y-2">
          {isArabic ? (
            <>
              {article.arabicTitle && (
                <h1
                  className="font-arabic text-foreground leading-relaxed"
                  dir="rtl"
                  style={{ fontSize: "2rem" }}
                >
                  {article.arabicTitle}
                </h1>
              )}
              <p className="text-base font-medium text-muted-foreground">{article.title}</p>
              <p
                className="text-muted-foreground text-sm leading-relaxed font-arabic"
                dir="rtl"
                style={{ fontSize: "1.1rem" }}
              >
                {article.descriptionAr ?? article.description}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-foreground">{article.title}</h1>
              {article.arabicTitle && (
                <p
                  className="font-arabic text-muted-foreground"
                  dir="rtl"
                  style={{ fontSize: "1.3rem" }}
                >
                  {article.arabicTitle}
                </p>
              )}
              <p className="text-muted-foreground text-sm leading-relaxed">{article.description}</p>
            </>
          )}

          <div
            className="flex items-center gap-4 mt-2 flex-wrap"
            dir={isArabic ? "rtl" : "ltr"}
          >
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {isArabic
                ? `${article.readTime} دقيقة قراءة`
                : `${article.readTime} min read`}
            </span>
            <span className="text-xs text-primary bg-primary/10 rounded-full px-2.5 py-0.5 font-medium">
              {isArabic ? category.arabicTitle : category.title}
            </span>
          </div>
        </div>

        {/* Top-level Quran refs */}
        {article.quranRefs && article.quranRefs.length > 0 && (
          <QuranRef refs={article.quranRefs} />
        )}

        {/* Article content */}
        <div className="space-y-0.5">
          {article.sections.map((section, i) => (
            <SectionRenderer key={i} section={section} isArabic={isArabic} />
          ))}
        </div>

        {/* Actions — bookmark, complete, notes */}
        <ArticleActions categoryId={category.id} articleId={article.id} />

        {/* Bottom navigation */}
        <div className="mt-10 pt-6 border-t">
          <button
            onClick={() => setLocation(`/library/${category.id}`)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            dir={isArabic ? "rtl" : "ltr"}
          >
            <ArrowLeft className="w-4 h-4" />
            {isArabic
              ? `العودة إلى ${category.arabicTitle}`
              : `Back to ${category.title}`}
          </button>
        </div>
      </div>
    </div>
  );
}
