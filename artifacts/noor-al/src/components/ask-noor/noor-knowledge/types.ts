export interface KnowledgeEntry {
  id: string;
  title: string;
  category: "app" | "quran" | "hadith" | "islamic" | "navigation";
  slashCommand?: string;
  triggers: string[];
  content: string;
  tags?: string[];
  action?: "open-support" | "open-support-feature" | "open-support-bug";
}

export interface MatchResult {
  entry: KnowledgeEntry;
  score: number;
}
