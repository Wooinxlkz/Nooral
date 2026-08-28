import { useState, useCallback } from "react";
import { Search, X, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { searchLibrary, type SearchResult } from "../../data/library/index";

export function LibrarySearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [, setLocation] = useLocation();

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    setResults(value.trim().length >= 2 ? searchLibrary(value) : []);
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search all library content..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
        />
        {query && (
          <button
            onClick={() => handleSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border bg-card shadow-lg overflow-hidden">
          {results.map((result, i) => (
            <button
              key={i}
              onClick={() => {
                setLocation(`/library/${result.categoryId}/${result.articleId}`);
                handleSearch("");
              }}
              className="flex items-start gap-3 w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b last:border-b-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs text-primary font-medium mb-0.5">{result.categoryTitle}</p>
                <p className="text-sm font-semibold text-foreground">{result.articleTitle}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{result.excerpt}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
            </button>
          ))}
        </div>
      )}

      {query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border bg-card shadow-lg px-4 py-3 text-sm text-muted-foreground">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
}
