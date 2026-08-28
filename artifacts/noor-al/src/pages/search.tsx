import { useState, useEffect, useRef, useCallback } from "react";
import { useSEO } from "@/lib/seo";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, ChevronDown, Filter, X } from "lucide-react";
import { searchQuran, useSurahs } from "@/lib/quran-api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useSearch } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const PAGE_SIZE = 20;

const JUZS = Array.from({ length: 30 }, (_, i) => i + 1);

export default function SearchPage() {
  useSEO("Search Quran", "Search the full text of the Holy Quran across all 114 surahs and 6236 ayahs. Find any verse instantly.");
  const { t } = useTranslation();

  const searchParams = useSearch();
  const focusOnMount = new URLSearchParams(searchParams).has("focus");

  const [query, setQuery] = useState("");
  const [searchTrigger, setSearchTrigger] = useState("");
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [filterSurah, setFilterSurah] = useState<string>("all");
  const [filterJuz, setFilterJuz] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [allResults, setAllResults] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const { data: surahs } = useSurahs();

  useEffect(() => {
    if (focusOnMount) inputRef.current?.focus();
  }, [focusOnMount]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const doSearch = useCallback(async (q: string, l: string, pageNum: number, append: boolean, surahFilter: string, juzFilter: string) => {
    if (!q.trim()) return;
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const surahParam = surahFilter !== "all" ? parseInt(surahFilter) : undefined;
      const juzParam = juzFilter !== "all" ? parseInt(juzFilter) : undefined;
      const data = await searchQuran(q, l, pageNum, PAGE_SIZE, surahParam, juzParam);
      const results = data?.results ?? [];
      const total = data?.total_results ?? 0;
      setTotalResults(total);
      setAllResults(prev => append ? [...prev, ...results] : results);
      setPage(pageNum);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setAllResults([]);
    setTotalResults(0);
    setPage(1);
    setSearchTrigger(query.trim());
    doSearch(query.trim(), lang, 1, false, filterSurah, filterJuz);
  };

  const handleLoadMore = () => {
    doSearch(searchTrigger, lang, page + 1, true, filterSurah, filterJuz);
  };

  const switchLang = (l: "en" | "ar") => {
    setLang(l);
    setAllResults([]);
    setTotalResults(0);
    setSearchTrigger("");
    setQuery("");
  };

  const clearFilters = () => {
    setFilterSurah("all");
    setFilterJuz("all");
    setAllResults([]);
    setTotalResults(0);
    setSearchTrigger("");
  };

  const hasFilters = filterSurah !== "all" || filterJuz !== "all";
  const hasMore = allResults.length < totalResults;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">{t("search.title")}</h1>
        <p className="text-muted-foreground text-sm">
          {lang === "en" ? "Search the Quran by keyword in English" : "ابحث في القرآن الكريم بالكلمات العربية"}
          <span className="ml-2 text-xs opacity-50 hidden md:inline">⌘K</span>
        </p>
      </div>

      {/* Language toggle */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={lang === "en" ? "default" : "outline"}
          size="sm"
          className="rounded-full px-4"
          onClick={() => switchLang("en")}
        >
          English
        </Button>
        <Button
          variant={lang === "ar" ? "default" : "outline"}
          size="sm"
          className="rounded-full px-4 font-arabic"
          onClick={() => switchLang("ar")}
        >
          عربي
        </Button>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === "en" ? "Search for 'light', 'patience', 'mercy'..." : "ابحث عن 'نور', 'صبر', 'رحمة'..."}
            className="pl-10 h-12 text-lg rounded-xl"
            dir={lang === "ar" ? "rtl" : "ltr"}
          />
        </div>
        <Button type="submit" className="h-12 px-6 rounded-xl" disabled={loading}>
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t("search.title")}
        </Button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span>Filter by:</span>
        </div>
        <Select value={filterSurah} onValueChange={(v) => { setFilterSurah(v); setFilterJuz("all"); }}>
          <SelectTrigger className="h-9 w-44 rounded-lg text-sm">
            <SelectValue placeholder="All Surahs" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            <SelectItem value="all">All Surahs</SelectItem>
            {(surahs ?? []).map((s: any) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {s.id}. {s.name_simple}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterJuz} onValueChange={(v) => { setFilterJuz(v); setFilterSurah("all"); }}>
          <SelectTrigger className="h-9 w-32 rounded-lg text-sm">
            <SelectValue placeholder="All Juzs" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            <SelectItem value="all">All Juzs</SelectItem>
            {JUZS.map((j) => (
              <SelectItem key={j} value={String(j)}>Juz {j}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-muted-foreground" onClick={clearFilters}>
            <X className="w-3.5 h-3.5" />
            Clear
          </Button>
        )}
        {hasFilters && (
          <div className="flex gap-1.5 flex-wrap">
            {filterSurah !== "all" && (
              <Badge variant="secondary" className="text-xs">
                Surah {surahs?.find((s: any) => String(s.id) === filterSurah)?.name_simple ?? filterSurah}
              </Badge>
            )}
            {filterJuz !== "all" && (
              <Badge variant="secondary" className="text-xs">Juz {filterJuz}</Badge>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-3">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-7 w-28 rounded-lg" />
                </div>
                <Skeleton className="h-4 w-full rounded mb-2" />
                <Skeleton className="h-4 w-5/6 rounded mb-2" />
                <Skeleton className="h-4 w-3/4 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : allResults.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Found <span className="font-medium text-foreground">{totalResults.toLocaleString()}</span> results for &ldquo;{searchTrigger}&rdquo;
            {allResults.length < totalResults && (
              <span className="ml-1">— showing {allResults.length}</span>
            )}
          </p>
          {allResults.map((result: any, i: number) => (
            <Card key={`${result.verse_key}-${i}`} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-primary text-sm">
                    Surah {result.verse_key}
                  </h3>
                  <Link href={`/reader?surah=${result.verse_key.split(':')[0]}&ayah=${result.verse_key.split(':')[1]}`}>
                    <Button variant="ghost" size="sm" className="text-xs h-7">Read in context →</Button>
                  </Link>
                </div>
                <p
                  className="text-foreground leading-relaxed search-result-text"
                  dir={lang === "ar" ? "rtl" : "ltr"}
                  dangerouslySetInnerHTML={{ __html: result.text }}
                />
              </CardContent>
            </Card>
          ))}

          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                className="gap-2 rounded-xl px-8"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                {loadingMore ? "Loading…" : `Load more (${totalResults - allResults.length} remaining)`}
              </Button>
            </div>
          )}
        </div>
      ) : searchTrigger ? (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">No results found for &ldquo;{searchTrigger}&rdquo;</p>
          <p className="text-sm mt-1">Try a different keyword or switch language.</p>
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground opacity-50">
          <Search className="w-16 h-16 mx-auto mb-4" />
          <p>{lang === "en" ? "Enter a keyword above to search the Quran." : "أدخل كلمة للبحث في القرآن الكريم."}</p>
        </div>
      )}
    </div>
  );
}
