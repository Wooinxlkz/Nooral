import { useUser } from "@/lib/auth";
import { ALL_CATEGORIES } from "../../data/library/index";
import { CategoryCard } from "../../components/library/CategoryCard";
import { LibrarySearch } from "../../components/library/LibrarySearch";
import { SignInPrompt } from "../../components/sign-in-prompt";
import { useAppStore } from "../../lib/store";

export function LibraryHomePage() {
  const { isSignedIn, isLoaded } = useUser();
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
        description={
          isArabic
            ? "سجّل الدخول لتتبّع تقدّمك في القراءة وإضافة الإشارات المرجعية وتدوين الملاحظات."
            : "Sign in to track your reading progress, bookmark articles, and take personal notes across 7 comprehensive Islamic knowledge categories."
        }
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header — bilingual */}
      <div className="text-center space-y-2" dir={isArabic ? "rtl" : "ltr"}>
        {isArabic ? (
          <>
            <p className="text-sm font-medium text-primary tracking-wide uppercase">
              Islamic Library
            </p>
            <h1
              className="font-arabic text-foreground"
              style={{ fontSize: "2rem" }}
            >
              المكتبة الإسلامية
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed font-arabic" dir="rtl" style={{ fontSize: "1.05rem" }}>
              معرفة إسلامية شاملة — الطهارة، الأنبياء، أركان الإسلام والإيمان، الصلاة، الأدعية، التاريخ، والحلال والحرام.
            </p>
            <p className="text-xs text-muted-foreground max-w-lg mx-auto">
              Comprehensive Islamic knowledge — purification, prophets, pillars of faith, prayer, duas, history, and halal & haram.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-primary font-arabic tracking-wide">
              المكتبة الإسلامية
            </p>
            <h1 className="text-3xl font-bold text-foreground">Islamic Library</h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
              Comprehensive Islamic knowledge — purification, prophets, pillars of faith, prayer,
              duas, history, and halal & haram rulings.
            </p>
          </>
        )}
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto relative">
        <LibrarySearch />
      </div>

      {/* Category grid — full width, min 2 cols tablet, 3 desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_CATEGORIES.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground pb-4">
        {isArabic
          ? "جميع المحتويات مستمدة من المصادر القرآنية والحديثية الصحيحة."
          : "All content is sourced from authentic Quranic and hadith references. Always available, never changing."}
      </p>
    </div>
  );
}
