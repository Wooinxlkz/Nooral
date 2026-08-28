import type { KnowledgeEntry, MatchResult } from "./types";
import { appKnowledge } from "./app-knowledge";
import { quranKnowledge } from "./quran-knowledge";
import { hadithKnowledge } from "./hadith-knowledge";
import { islamicKnowledge } from "./islamic-knowledge";

export const ALL_KNOWLEDGE: KnowledgeEntry[] = [
  ...appKnowledge,
  ...quranKnowledge,
  ...hadithKnowledge,
  ...islamicKnowledge,
];

export const SLASH_COMMANDS = ALL_KNOWLEDGE.filter((e) => e.slashCommand).map((e) => ({
  command: e.slashCommand!,
  title: e.title,
  category: e.category,
  id: e.id,
}));

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[''`]/g, "'")
    .replace(/[^a-z0-9\u0600-\u06ff\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return normalize(text).split(" ").filter((w) => w.length > 1);
}

const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "to", "of", "in", "on",
  "at", "by", "for", "with", "about", "from", "into", "what", "how",
  "when", "where", "who", "why", "which", "that", "this", "it", "me",
  "my", "you", "your", "i", "we", "tell", "explain", "show", "give",
  "help", "please", "want", "know", "need", "get", "make", "ask",
]);

function scoreEntry(queryTokens: string[], entry: KnowledgeEntry): number {
  let score = 0;
  const meaningful = queryTokens.filter((t) => !STOP_WORDS.has(t));

  for (const trigger of entry.triggers) {
    const triggerNorm = normalize(trigger);
    const queryNorm = queryTokens.join(" ");

    // Full trigger phrase match — high weight
    if (queryNorm.includes(triggerNorm)) {
      score += 10 + triggerNorm.length * 0.5;
    }

    // Individual token matches against trigger
    const triggerTokens = tokenize(trigger);
    for (const qt of meaningful) {
      for (const tt of triggerTokens) {
        if (qt === tt) score += 3;
        else if (tt.length > 3 && (qt.startsWith(tt.slice(0, 4)) || tt.startsWith(qt.slice(0, 4)))) score += 1;
      }
    }
  }

  // Match against title
  const titleTokens = tokenize(entry.title);
  for (const qt of meaningful) {
    for (const tt of titleTokens) {
      if (qt === tt) score += 4;
    }
  }

  // Match against tags
  for (const tag of entry.tags ?? []) {
    const tagNorm = normalize(tag);
    if (queryTokens.join(" ").includes(tagNorm)) score += 5;
  }

  return score;
}

export function findSlashCommand(input: string): KnowledgeEntry | null {
  if (!input.startsWith("/")) return null;
  const cmd = input.split(" ")[0].toLowerCase();
  return ALL_KNOWLEDGE.find((e) => e.slashCommand === cmd) ?? null;
}

export function matchKnowledge(query: string, topN = 3): MatchResult[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const results: MatchResult[] = ALL_KNOWLEDGE.map((entry) => ({
    entry,
    score: scoreEntry(queryTokens, entry),
  }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  return results;
}

export function buildContextForQuery(query: string): string {
  // Check slash command first
  const slashMatch = findSlashCommand(query);
  if (slashMatch) {
    return `[NoorAl Knowledge — ${slashMatch.title}]\n${slashMatch.content}`;
  }

  const matches = matchKnowledge(query, 2);
  if (matches.length === 0) return "";

  return matches
    .map((m) => `[NoorAl Knowledge — ${m.entry.title}]\n${m.entry.content}`)
    .join("\n\n---\n\n");
}

export function getSlashCommandSuggestions(partial: string) {
  const lc = partial.toLowerCase();
  return SLASH_COMMANDS.filter(
    (c) => c.command.startsWith(lc) || c.title.toLowerCase().includes(lc.slice(1))
  ).slice(0, 12);
}
