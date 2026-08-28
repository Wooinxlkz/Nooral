export interface QuranRef {
  surah: number;
  ayah: number;
  note?: string;
}

export interface Dua {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
  count?: number;
  occasion?: string;
}

export interface Step {
  number: number;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  dua?: { arabic: string; transliteration: string; translation: string };
}

export interface TimelineEvent {
  date: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  significance?: string;
  significanceAr?: string;
  quranRef?: QuranRef;
}

export interface ProphetEntry {
  id: string;
  nameEn: string;
  nameAr: string;
  period: string;
  nation: string;
  summary: string;
  biography: {
    earlyLife: string;
    prophethood: string;
    keyEvents: string;
    miracles: string;
    legacy: string;
  };
  timeline: TimelineEvent[];
  quranMentions: QuranRef[];
  relatedProphets: string[];
}

export type SectionType =
  | { type: 'text';    content: string;  ar?: string }
  | { type: 'heading'; level: 2 | 3;     text: string;  ar?: string }
  | { type: 'callout'; icon?: string;    content: string; ar?: string }
  | { type: 'steps';   title?: string;   titleAr?: string; items: Step[] }
  | { type: 'list';    title?: string;   titleAr?: string; items: string[]; itemsAr?: string[] }
  | { type: 'dua';     arabic: string;   transliteration: string; translation: string; source?: string }
  | { type: 'quranRef'; refs: QuranRef[] }
  | { type: 'timeline'; events: TimelineEvent[] }
  | { type: 'table';    headers: string[]; rows: string[][] }
  | { type: 'duas-list'; title?: string; titleAr?: string; duas: Dua[] }

export interface LibraryArticle {
  id: string;
  title: string;
  arabicTitle?: string;
  description: string;
  descriptionAr?: string;
  readTime: number;
  sections: SectionType[];
  quranRefs?: QuranRef[];
  tags?: string[];
}

export interface LibraryCategory {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  descriptionAr?: string;
  icon: string;
  color: string;
  articles: LibraryArticle[];
}
