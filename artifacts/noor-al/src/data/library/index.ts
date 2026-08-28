import { purification } from "./purification";
import { prophets } from "./prophets";
import { pillars } from "./pillars";
import { prayer } from "./prayer";
import { duas } from "./duas";
import { history } from "./history";
import { halalHaram } from "./halal-haram";
import type { LibraryCategory, LibraryArticle } from "./types";

export type { LibraryCategory, LibraryArticle };
export { purification, prophets, pillars, prayer, duas, history, halalHaram };

export const ALL_CATEGORIES: LibraryCategory[] = [
  purification,
  prophets,
  pillars,
  prayer,
  duas,
  history,
  halalHaram,
];

export function getCategoryById(id: string): LibraryCategory | undefined {
  return ALL_CATEGORIES.find((c) => c.id === id);
}

export function getArticleById(
  categoryId: string,
  articleId: string
): { category: LibraryCategory; article: LibraryArticle } | undefined {
  const category = getCategoryById(categoryId);
  if (!category) return undefined;
  const article = category.articles.find((a) => a.id === articleId);
  if (!article) return undefined;
  return { category, article };
}

export interface SearchResult {
  categoryId: string;
  categoryTitle: string;
  articleId: string;
  articleTitle: string;
  excerpt: string;
}

export function searchLibrary(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const category of ALL_CATEGORIES) {
    for (const article of category.articles) {
      const titleMatch = article.title.toLowerCase().includes(q);
      const descMatch = article.description.toLowerCase().includes(q);
      const tagMatch = article.tags?.some((t) => t.toLowerCase().includes(q));

      let contentMatch = false;
      let excerpt = article.description;

      for (const section of article.sections) {
        if (section.type === "text" && section.content.toLowerCase().includes(q)) {
          contentMatch = true;
          const idx = section.content.toLowerCase().indexOf(q);
          excerpt = "..." + section.content.slice(Math.max(0, idx - 40), idx + 80) + "...";
          break;
        }
        if (section.type === "list") {
          const match = section.items?.find((i) => i.toLowerCase().includes(q));
          if (match) { contentMatch = true; excerpt = match; break; }
        }
      }

      if (titleMatch || descMatch || tagMatch || contentMatch) {
        results.push({
          categoryId: category.id,
          categoryTitle: category.title,
          articleId: article.id,
          articleTitle: article.title,
          excerpt,
        });
      }
    }
  }

  return results.slice(0, 20);
}
