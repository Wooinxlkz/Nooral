import { useQuery } from '@tanstack/react-query';

const QURAN_API = 'https://api.quran.com/api/v4';
const ALQURAN_API = 'https://api.alquran.cloud/v1';

/** Map from numeric translation ID → alquran.cloud edition string */
export const TRANSLATION_EDITIONS: Record<number, string> = {
  131: 'en.sahih',
  20:  'en.yusufali',
  85:  'en.pickthall',
  22:  'en.asad',
  17:  'en.arberry',
  203: 'en.hilali',
  57:  'en.clearquran',
  21:  'en.maududi',
  95:  'ur.jawadi',
  45:  'tr.diyanet',
  77:  'tr.yazir',
  31:  'fr.hamidullah',
  27:  'de.khoury',
  213: 'bn.bengali',
  33:  'id.indonesian',
  75:  'ru.kuliev',
  84:  'en.hilali',
};

export const TRANSLATIONS_LIST: { id: number; name: string; language: string; author: string }[] = [
  // English
  { id: 131, name: 'Sahih International',     language: 'English',    author: 'Saheeh International' },
  { id: 57,  name: 'The Clear Quran',          language: 'English',    author: 'Dr. Mustafa Khattab' },
  { id: 20,  name: 'Yusuf Ali',                language: 'English',    author: 'Abdullah Yusuf Ali' },
  { id: 85,  name: 'Pickthall',                language: 'English',    author: 'M. M. Pickthall' },
  { id: 21,  name: 'Maududi',                  language: 'English',    author: 'S. A. A. Maududi' },
  { id: 22,  name: 'Muhammad Asad',            language: 'English',    author: 'Muhammad Asad' },
  { id: 17,  name: 'Arberry',                  language: 'English',    author: 'A. J. Arberry' },
  { id: 203, name: 'Hilali & Khan',            language: 'English',    author: 'Hilali & Khan' },
  // Urdu
  { id: 95,  name: 'Ahsan ul Bayaan',          language: 'Urdu',       author: 'Salahuddin Yusuf' },
  // Turkish
  { id: 45,  name: 'Diyanet İşleri',           language: 'Turkish',    author: 'Diyanet İşleri' },
  { id: 77,  name: 'Elmalılı Hamdi Yazır',     language: 'Turkish',    author: 'Elmalılı Hamdi Yazır' },
  // French
  { id: 31,  name: 'Hamidullah',               language: 'French',     author: 'Muhammad Hamidullah' },
  // German
  { id: 27,  name: 'Khoury',                   language: 'German',     author: 'Adel Theodor Khoury' },
  // Bengali
  { id: 213, name: 'Muhiuddin Khan',           language: 'Bengali',    author: 'Muhiuddin Khan' },
  // Indonesian
  { id: 33,  name: 'Bahasa Indonesia',         language: 'Indonesian', author: 'Ministry of Religion' },
  // Russian
  { id: 75,  name: 'Kuliev',                   language: 'Russian',    author: 'Elmir Kuliev' },
];

export const ARABIC_FONTS = [
  { id: 'scheherazade', name: 'Scheherazade New', family: "'Scheherazade New', serif" },
  { id: 'amiri',        name: 'Amiri',             family: "'Amiri', serif" },
  { id: 'noto-naskh',  name: 'Noto Naskh Arabic',  family: "'Noto Naskh Arabic', serif" },
  { id: 'lateef',      name: 'Lateef',              family: "'Lateef', serif" },
] as const;

export type ArabicFontId = (typeof ARABIC_FONTS)[number]['id'];

export const getArabicFontFamily = (id: string): string =>
  ARABIC_FONTS.find(f => f.id === id)?.family ?? "'Scheherazade New', serif";

export const RECITERS_LIST = [
  { id: '7',  name: 'Mishary Rashid Alafasy' },
  { id: '1',  name: 'AbdulBaset AbdulSamad' },
  { id: '2',  name: 'Mahmoud Khalil Al-Husary' },
  { id: '9',  name: 'Abdur-Rahman as-Sudais' },
  { id: '5',  name: "Sa'd Al-Ghamdi" },
  { id: '3',  name: 'Mohamed Siddiq El-Minshawi' },
];

export const TAFSIR_SOURCES = [
  { id: 169, name: "Ibn Kathir",       language: "English" },
  { id: 168, name: "Maarif ul Quran",  language: "English" },
  { id: 16,  name: "Al-Jalalayn",      language: "Arabic" },
  { id: 91,  name: "Al-Sa'di",         language: "Arabic" },
  { id: 14,  name: "Ibn Kathir",       language: "Arabic" },
];

export const HIZB_MAP: { hizb: number; surah: number; ayah: number }[] = [
  { hizb: 1,  surah: 1,  ayah: 1   }, { hizb: 2,  surah: 2,  ayah: 26  },
  { hizb: 3,  surah: 2,  ayah: 142 }, { hizb: 4,  surah: 2,  ayah: 204 },
  { hizb: 5,  surah: 2,  ayah: 253 }, { hizb: 6,  surah: 2,  ayah: 283 },
  { hizb: 7,  surah: 3,  ayah: 93  }, { hizb: 8,  surah: 3,  ayah: 171 },
  { hizb: 9,  surah: 4,  ayah: 24  }, { hizb: 10, surah: 4,  ayah: 93  },
  { hizb: 11, surah: 4,  ayah: 148 }, { hizb: 12, surah: 5,  ayah: 1   },
  { hizb: 13, surah: 5,  ayah: 82  }, { hizb: 14, surah: 6,  ayah: 1   },
  { hizb: 15, surah: 6,  ayah: 111 }, { hizb: 16, surah: 7,  ayah: 1   },
  { hizb: 17, surah: 7,  ayah: 88  }, { hizb: 18, surah: 8,  ayah: 1   },
  { hizb: 19, surah: 8,  ayah: 41  }, { hizb: 20, surah: 9,  ayah: 34  },
  { hizb: 21, surah: 9,  ayah: 93  }, { hizb: 22, surah: 10, ayah: 1   },
  { hizb: 23, surah: 11, ayah: 6   }, { hizb: 24, surah: 11, ayah: 84  },
  { hizb: 25, surah: 12, ayah: 53  }, { hizb: 26, surah: 14, ayah: 1   },
  { hizb: 27, surah: 15, ayah: 1   }, { hizb: 28, surah: 16, ayah: 51  },
  { hizb: 29, surah: 17, ayah: 1   }, { hizb: 30, surah: 18, ayah: 16  },
  { hizb: 31, surah: 18, ayah: 75  }, { hizb: 32, surah: 19, ayah: 58  },
  { hizb: 33, surah: 21, ayah: 1   }, { hizb: 34, surah: 22, ayah: 1   },
  { hizb: 35, surah: 23, ayah: 1   }, { hizb: 36, surah: 24, ayah: 21  },
  { hizb: 37, surah: 25, ayah: 21  }, { hizb: 38, surah: 26, ayah: 42  },
  { hizb: 39, surah: 27, ayah: 56  }, { hizb: 40, surah: 29, ayah: 1   },
  { hizb: 41, surah: 29, ayah: 46  }, { hizb: 42, surah: 32, ayah: 1   },
  { hizb: 43, surah: 33, ayah: 31  }, { hizb: 44, surah: 35, ayah: 1   },
  { hizb: 45, surah: 36, ayah: 28  }, { hizb: 46, surah: 38, ayah: 1   },
  { hizb: 47, surah: 39, ayah: 32  }, { hizb: 48, surah: 41, ayah: 1   },
  { hizb: 49, surah: 41, ayah: 47  }, { hizb: 50, surah: 44, ayah: 1   },
  { hizb: 51, surah: 46, ayah: 1   }, { hizb: 52, surah: 48, ayah: 17  },
  { hizb: 53, surah: 51, ayah: 31  }, { hizb: 54, surah: 54, ayah: 1   },
  { hizb: 55, surah: 58, ayah: 1   }, { hizb: 56, surah: 61, ayah: 1   },
  { hizb: 57, surah: 67, ayah: 1   }, { hizb: 58, surah: 72, ayah: 1   },
  { hizb: 59, surah: 78, ayah: 1   }, { hizb: 60, surah: 89, ayah: 1   },
];

export const JUZ_MAP: { juz: number; surah: number; ayah: number; name: string }[] = [
  { juz: 1,  surah: 1,  ayah: 1,   name: "Alif Lam Mim" },
  { juz: 2,  surah: 2,  ayah: 142, name: "Sayaqul" },
  { juz: 3,  surah: 2,  ayah: 253, name: "Tilka ar-Rusul" },
  { juz: 4,  surah: 3,  ayah: 93,  name: "Lan Tanalu" },
  { juz: 5,  surah: 4,  ayah: 24,  name: "Wal Muhsanat" },
  { juz: 6,  surah: 4,  ayah: 148, name: "La Yuhibbullah" },
  { juz: 7,  surah: 5,  ayah: 82,  name: "Wa Idha Sami'u" },
  { juz: 8,  surah: 6,  ayah: 111, name: "Wa Lau Annana" },
  { juz: 9,  surah: 7,  ayah: 88,  name: "Qal al-Mala" },
  { juz: 10, surah: 8,  ayah: 41,  name: "Wa'lamu" },
  { juz: 11, surah: 9,  ayah: 93,  name: "Ya'tadhirun" },
  { juz: 12, surah: 11, ayah: 6,   name: "Wa Ma Min Dabbah" },
  { juz: 13, surah: 12, ayah: 53,  name: "Wa Ma Ubarri'u" },
  { juz: 14, surah: 15, ayah: 1,   name: "Rubama" },
  { juz: 15, surah: 17, ayah: 1,   name: "Subhana Alladhi" },
  { juz: 16, surah: 18, ayah: 75,  name: "Qal Alam Aqul" },
  { juz: 17, surah: 21, ayah: 1,   name: "Iqtaraba" },
  { juz: 18, surah: 23, ayah: 1,   name: "Qad Aflaha" },
  { juz: 19, surah: 25, ayah: 21,  name: "Wa Qal Alladhina" },
  { juz: 20, surah: 27, ayah: 56,  name: "A'man Khalaqa" },
  { juz: 21, surah: 29, ayah: 46,  name: "Utlu Ma Uhiya" },
  { juz: 22, surah: 33, ayah: 31,  name: "Wa Man Yaqnut" },
  { juz: 23, surah: 36, ayah: 28,  name: "Wa Ma Anzalna" },
  { juz: 24, surah: 39, ayah: 32,  name: "Fa Man Azlamu" },
  { juz: 25, surah: 41, ayah: 47,  name: "Ilayhi Yuraddu" },
  { juz: 26, surah: 46, ayah: 1,   name: "Ha Mim" },
  { juz: 27, surah: 51, ayah: 31,  name: "Qal Fama Khatbukum" },
  { juz: 28, surah: 58, ayah: 1,   name: "Qad Sami'a Allah" },
  { juz: 29, surah: 67, ayah: 1,   name: "Tabaraka Alladhi" },
  { juz: 30, surah: 78, ayah: 1,   name: "Amma" },
];

export interface QuranWord {
  id: number;
  position: number;
  verse_key: string;
  text_uthmani: string;
  char_type_name: 'word' | 'end' | 'pause' | string;
  translation?: { text: string; language_name: string };
}

export interface QuranVerse {
  id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani: string;
  text_tajweed?: string;
  text_uthmani_tajweed?: string;
  translations: { id: number; text: string }[];
  words: QuranWord[];
  transliteration?: string;
  hizb_number?: number;
  juz_number?: number;
  rub_el_hizb_number?: number;
  page_number?: number;
}

export function getTranslationName(id: number): string {
  return TRANSLATIONS_LIST.find(t => t.id === id)?.name ?? `Translation ${id}`;
}

export function getTranslationAuthor(id: number): string {
  return TRANSLATIONS_LIST.find(t => t.id === id)?.author ?? '';
}

export const fetchSurahs = async () => {
  const res = await fetch(`${ALQURAN_API}/meta`);
  if (!res.ok) throw new Error(`Failed to load surah list: ${res.status}`);
  const data = await res.json();
  return data.data.surahs.references.map((s: any) => ({
    id: s.number,
    name_simple: s.englishName,
    name_arabic: s.name,
    verses_count: s.numberOfAyahs,
    revelation_place: s.revelationType,
    translated_name: { name: s.englishNameTranslation },
  }));
};

export const fetchVersesByChapter = async (
  chapterId: number,
  translationIds: number[],
  includeTransliteration = false
): Promise<QuranVerse[]> => {
  const ids = translationIds.length > 0 ? translationIds : [131];

  // Fetch Arabic words + tajweed HTML in parallel
  const [wordsData, tajweedData] = await Promise.all([
    fetch(
      `${QURAN_API}/verses/by_chapter/${chapterId}` +
      `?words=true&word_translations=true` +
      `&fields=text_uthmani,verse_number,hizb_number,juz_number,rub_el_hizb_number` +
      `&word_fields=text_uthmani,translation` +
      `&per_page=300&page=1`
    ).then(r => { if (!r.ok) throw new Error(`Failed to load verses: ${r.status}`); return r.json(); }),
    fetch(
      `${QURAN_API}/quran/verses/uthmani_tajweed?chapter_number=${chapterId}`
    ).then(r => r.ok ? r.json() : { verses: [] }).catch(() => ({ verses: [] })),
  ]);

  const verses: any[] = wordsData.verses ?? [];

  // Build verse_key → text_uthmani_tajweed map
  const tajweedMap: Record<string, string> = {};
  for (const v of tajweedData.verses ?? []) {
    if (v.verse_key && v.text_uthmani_tajweed) {
      tajweedMap[v.verse_key] = v.text_uthmani_tajweed;
    }
  }

  // Fetch each translation from alquran.cloud in parallel (only IDs with a known edition)
  const validIds = ids.filter(id => TRANSLATION_EDITIONS[id]);
  const transResults = await Promise.all(
    validIds.map(id =>
      fetch(`${ALQURAN_API}/surah/${chapterId}/${TRANSLATION_EDITIONS[id]}`)
        .then(r => r.json())
        .catch(() => null)
    )
  );

  // Build a map: translationId → { verseNumber → text }
  const transMaps: Record<number, Record<number, string>> = {};
  validIds.forEach((id, i) => {
    const ayahs: any[] = transResults[i]?.data?.ayahs ?? [];
    transMaps[id] = {};
    for (const ayah of ayahs) {
      transMaps[id][ayah.numberInSurah] = ayah.text ?? '';
    }
  });

  // Optionally fetch transliteration
  let translitMap: Record<number, string> = {};
  if (includeTransliteration) {
    try {
      const translitRes = await fetch(`${ALQURAN_API}/surah/${chapterId}/en.transliteration`);
      const translitData = await translitRes.json();
      for (const ayah of translitData?.data?.ayahs ?? []) {
        translitMap[ayah.numberInSurah] = ayah.text ?? '';
      }
    } catch { /* ignore */ }
  }

  return verses.map((v: any) => ({
    id: v.id,
    verse_number: v.verse_number,
    verse_key: v.verse_key,
    text_uthmani: v.text_uthmani,
    translations: validIds.map(id => ({
      id,
      text: transMaps[id]?.[v.verse_number] ?? '',
    })),
    words: (v.words ?? []) as QuranWord[],
    transliteration: includeTransliteration ? (translitMap[v.verse_number] ?? undefined) : undefined,
    text_uthmani_tajweed: tajweedMap[v.verse_key] ?? undefined,
    hizb_number: v.hizb_number,
    juz_number: v.juz_number,
    rub_el_hizb_number: v.rub_el_hizb_number,
  }));
};

export const fetchTafsir = async (tafsirId: number, verseKey: string) => {
  const res = await fetch(`${QURAN_API}/tafsirs/${tafsirId}/by_ayah/${verseKey}`);
  if (!res.ok) throw new Error(`Failed to load tafsir: ${res.status}`);
  const data = await res.json();
  return data.tafsir;
};

export const fetchTafsirByChapter = async (
  tafsirId: number,
  chapterId: number
): Promise<Record<string, string>> => {
  const res = await fetch(
    `${QURAN_API}/tafsirs/${tafsirId}/by_chapter/${chapterId}?per_page=300`
  );
  if (!res.ok) throw new Error(`Failed to load chapter tafsir: ${res.status}`);
  const data = await res.json();
  const map: Record<string, string> = {};
  for (const t of data.tafsirs ?? []) {
    map[t.verse_key as string] = (t.text as string) ?? '';
  }
  return map;
};

export function useTafsirByChapter(chapterId: number, tafsirId: number, enabled = true) {
  return useQuery({
    queryKey: ['tafsir-chapter', chapterId, tafsirId],
    queryFn: () => fetchTafsirByChapter(tafsirId, chapterId),
    enabled: enabled && !!chapterId,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export const searchQuran = async (query: string, language: string = 'en', page: number = 1, size: number = 20, surahId?: number, juzId?: number) => {
  let url = `${QURAN_API}/search?q=${encodeURIComponent(query)}&language=${language}&page=${page}&size=${size}`;
  if (surahId) url += `&chapter_number=${surahId}`;
  if (juzId) url += `&juz_number=${juzId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  const data = await res.json();
  return data.search;
};

export interface SurahInfo {
  surahId: number;
  shortText: string;
  text: string;
  languageName: string;
  source: string;
}

export const fetchSurahInfo = async (surahId: number): Promise<SurahInfo | null> => {
  try {
    const res = await fetch(`https://api.qurancdn.com/api/qdc/chapters/${surahId}/info?language=en`);
    const data = await res.json();
    const info = data.chapter_info;
    if (!info) return null;
    return {
      surahId,
      shortText: info.short_text ?? "",
      text: info.text ?? "",
      languageName: info.language_name ?? "english",
      source: info.source ?? "",
    };
  } catch {
    return null;
  }
};

export const fetchAudio = async (reciterId: string, surahId: number) => {
  const res = await fetch(`${QURAN_API}/chapter_recitations/${reciterId}/${surahId}`);
  if (!res.ok) throw new Error(`Failed to load audio: ${res.status}`);
  const data = await res.json();
  return data.audio_file;
};

export interface AyahAudioFile {
  verse_key: string;
  url: string;
  duration?: number;
  segments?: number[][];
}

const AUDIO_CDN = 'https://verses.quran.com';

export const fetchAyahAudios = async (reciterId: string, surahId: number): Promise<AyahAudioFile[]> => {
  const res = await fetch(
    `${QURAN_API}/verses/by_chapter/${surahId}?audio=${reciterId}&fields=audio,verse_key&per_page=300`
  );
  if (!res.ok) throw new Error(`Failed to load ayah audio: ${res.status}`);
  const data = await res.json();
  return (data.verses ?? []).map((v: { verse_key: string; audio: { url: string; segments?: number[][] } }) => ({
    verse_key: v.verse_key,
    url: v.audio?.url
      ? (v.audio.url.startsWith('http') ? v.audio.url : `${AUDIO_CDN}/${v.audio.url}`)
      : '',
    segments: v.audio?.segments,
  })) as AyahAudioFile[];
};

export const fetchVersesByPage = async (page: number): Promise<QuranVerse[]> => {
  const res = await fetch(
    `${QURAN_API}/verses/by_page/${page}` +
    `?words=true&word_translations=true` +
    `&fields=text_uthmani,text_tajweed,verse_number,hizb_number,juz_number,rub_el_hizb_number,page_number` +
    `&word_fields=text_uthmani,translation&per_page=50`
  );
  if (!res.ok) throw new Error(`Failed to load page ${page}: ${res.status}`);
  const data = await res.json();
  return (data.verses ?? []).map((v: any) => ({
    id: v.id,
    verse_number: v.verse_number,
    verse_key: v.verse_key,
    text_uthmani: v.text_uthmani,
    translations: [],
    words: (v.words ?? []) as QuranWord[],
    text_tajweed: v.text_tajweed ?? undefined,
    hizb_number: v.hizb_number,
    juz_number: v.juz_number,
    rub_el_hizb_number: v.rub_el_hizb_number,
    page_number: v.page_number,
  }));
};

export function useVersesByPage(page: number, enabled = true) {
  return useQuery({
    queryKey: ['verses-page', page],
    queryFn: () => fetchVersesByPage(page),
    enabled: enabled && page >= 1 && page <= 604,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useSurahs() {
  return useQuery({
    queryKey: ['surahs'],
    queryFn: fetchSurahs,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useVersesByChapter(chapterId: number, translationIds: number[], includeTransliteration = false) {
  return useQuery({
    queryKey: ['verses', chapterId, translationIds, includeTransliteration],
    queryFn: () => fetchVersesByChapter(chapterId, translationIds, includeTransliteration),
    enabled: !!chapterId && translationIds.length > 0,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useAyahs(surahId: number, translationIds: number[]) {
  return useVersesByChapter(surahId, translationIds);
}

export interface QuranReciter {
  id: number;
  name: string;
  style?: string | null;
  translated_name?: { name: string; language_name: string } | null;
}

export const fetchReciters = async (): Promise<QuranReciter[]> => {
  const res = await fetch('https://api.qurancdn.com/api/qdc/audio/reciters?fields=name,style,translated_name');
  if (!res.ok) throw new Error(`Failed to load reciters: ${res.status}`);
  const data = await res.json();
  const raw: Array<{
    id: number;
    name: string;
    style?: { name?: string } | string | null;
    translated_name?: { name?: string; language_name?: string } | null;
  }> = data.reciters ?? [];
  return raw.map((r) => ({
    id: r.id,
    name: String(r.name ?? ""),
    style: r.style
      ? (typeof r.style === 'string' ? r.style : (r.style as { name?: string }).name ?? null)
      : null,
    translated_name: r.translated_name
      ? { name: String(r.translated_name.name ?? ""), language_name: String(r.translated_name.language_name ?? "") }
      : null,
  }));
};

export function useReciters() {
  return useQuery({
    queryKey: ['reciters'],
    queryFn: fetchReciters,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export interface RadioStation {
  id: string;
  name: string;
  stream_url: string;
  reciter_name?: string;
  style?: string;
  description?: string;
  thumbnail_url?: string;
}

// Radio Browser API mirrors — tries each in turn for resilience
const RADIO_BROWSER_MIRRORS = [
  'https://de1.api.radio-browser.info',
  'https://nl1.api.radio-browser.info',
  'https://at1.api.radio-browser.info',
];

// Curated fallback list — all HTTPS, direct MP3/AAC streams (no HLS)
const FALLBACK_STATIONS: RadioStation[] = [
  { id: 'afasy-mp3',     name: 'Mishary Al-Afasy Radio',       stream_url: 'https://radio.mp3islam.com/listen/mishary/radio.mp3',     reciter_name: 'Mishari Al-Afasy',       style: 'Murattal' },
  { id: 'sudais-mp3',    name: 'Abdulrahman Al-Sudais Radio',  stream_url: 'https://radio.mp3islam.com/listen/sudais/radio.mp3',      reciter_name: 'Abdur-Rahman As-Sudais', style: 'Murattal' },
  { id: 'abdulbasit',    name: 'Abdulbasit Abdulsamad Radio',  stream_url: 'https://radio.mp3islam.com/listen/abdulbasit/radio.mp3',  reciter_name: 'Abdulbasit Abdulsamad',  style: 'Murattal' },
  { id: 'shuraim-mp3',   name: 'Saud Al-Shuraim Radio',        stream_url: 'https://radio.mp3islam.com/listen/alshuraim/radio.mp3',   reciter_name: 'Saud Al-Shuraim',        style: 'Murattal' },
  { id: 'minshawi-mp3',  name: 'Muhammad Al-Minshawi Radio',   stream_url: 'https://radio.mp3islam.com/listen/minshawi/radio.mp3',    reciter_name: 'Muhammad Siddiq Al-Minshawi', style: 'Murattal' },
  { id: 'huthaifi-mp3',  name: 'Ali Al-Huthaifi Radio',        stream_url: 'https://radio.mp3islam.com/listen/alhuthaifi/radio.mp3',  reciter_name: 'Ali Al-Huthaifi',        style: 'Murattal' },
  { id: 'mp3quran-mix',  name: 'Mp3Quran Mix',                 stream_url: 'https://qurango.net/radio/mix',                          reciter_name: 'Various Reciters',       style: 'Murattal' },
];

interface RadioBrowserStation {
  stationuuid: string;
  name: string;
  url_resolved: string;
  url: string;
  country: string;
  favicon: string;
  tags: string;
  votes: number;
}

const styleFromTags = (tags: string): string | undefined => {
  const t = tags.toLowerCase();
  if (t.includes('mujawwad')) return 'Mujawwad';
  if (t.includes('muallim') || t.includes('teaching')) return 'Muallim';
  if (t.includes('children') || t.includes('kids')) return 'Children';
  if (t.includes('live') || t.includes('makkah') || t.includes('mecca') || t.includes('madinah') || t.includes('medina')) return 'Live';
  return 'Murattal';
};

export const fetchRadioStations = async (): Promise<RadioStation[]> => {
  for (const mirror of RADIO_BROWSER_MIRRORS) {
    try {
      const url = `${mirror}/json/stations/bytag/quran?limit=40&hidebroken=true&order=votes&reverse=true`;
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) continue;
      const data: RadioBrowserStation[] = await res.json();
      if (!Array.isArray(data) || data.length === 0) continue;

      const filtered = data
        .map((s) => ({ ...s, stream_url: s.url_resolved || s.url }))
        .filter((s) =>
          s.stream_url.startsWith('https://') &&
          !s.stream_url.endsWith('.m3u8') &&
          !s.stream_url.includes('.m3u8?')
        );
      if (filtered.length === 0) continue;
      return filtered.map((s) => ({
        id: s.stationuuid,
        name: s.name.trim(),
        stream_url: s.stream_url,
        reciter_name: s.country || undefined,
        style: styleFromTags(s.tags ?? ''),
        thumbnail_url: s.favicon || undefined,
      }));
    } catch {
      // try next mirror
    }
  }
  return FALLBACK_STATIONS;
};

export function useRadioStations() {
  return useQuery({
    queryKey: ['radio-stations'],
    queryFn: fetchRadioStations,
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });
}

export interface WordMorphologyToken {
  text: string;
  part_of_speech: string;
  root?: string;
  lemma?: string;
  stem?: string;
  morphological_features?: Record<string, string>;
}

export interface WordMorphology {
  word_type: string;
  word_text: string;
  tokens: WordMorphologyToken[];
  root?: string;
}

export const fetchWordMorphology = async (verseKey: string, wordPosition: number): Promise<WordMorphology | null> => {
  try {
    const res = await fetch(
      `https://api.qurancdn.com/api/qdc/corpus/morphology?verse_key=${encodeURIComponent(verseKey)}&word_position=${wordPosition}&language=en`
    );
    const data = await res.json();
    const wordMorphology = data.word_morphology ?? null;
    if (!wordMorphology) return null;
    return {
      word_type: wordMorphology.word_type ?? "",
      word_text: wordMorphology.word_text ?? "",
      tokens: (wordMorphology.morph_result?.tokens ?? []).map((t: {
        text?: string;
        pos?: string;
        root?: { arabic?: string };
        lemma?: string;
        stem?: string;
        features?: Record<string, string>;
      }) => ({
        text: t.text ?? "",
        part_of_speech: t.pos ?? "",
        root: t.root?.arabic ?? undefined,
        lemma: t.lemma ?? undefined,
        stem: t.stem ?? undefined,
        morphological_features: t.features ?? undefined,
      })),
      root: (wordMorphology.morph_result?.tokens ?? []).find((t: { root?: { arabic?: string } }) => t.root?.arabic)?.root?.arabic,
    };
  } catch {
    return null;
  }
};

export const fetchWordOccurrences = async (wordText: string): Promise<Array<{
  surahId: number; surahName: string; ayahNumber: number; text: string; verseKey: string;
}>> => {
  try {
    const res = await fetch(
      `${QURAN_API}/search?q=${encodeURIComponent(wordText)}&language=ar&size=12`
    );
    const data = await res.json();
    return (data.search?.results ?? []).map((r: any) => ({
      surahId: r.verse_key?.split(":")?.[0] ? parseInt(r.verse_key.split(":")[0]) : 0,
      surahName: r.verse_key ?? "",
      ayahNumber: r.verse_key?.split(":")?.[1] ? parseInt(r.verse_key.split(":")[1]) : 0,
      text: r.text ?? "",
      verseKey: r.verse_key ?? "",
    }));
  } catch {
    return [];
  }
};

/* ── QuranReflect community reflections ───────────────────────── */
export interface QuranReflection {
  id: number;
  body: string;
  user?: { name?: string };
  created_at?: string;
  likes_count?: number;
}

export const fetchQuranReflections = async (
  surahId: number,
  ayahNumber: number,
): Promise<QuranReflection[]> => {
  try {
    const res = await fetch(
      `https://quranreflect.com/posts.json?ayah=${surahId}:${ayahNumber}`,
      { headers: { Accept: "application/json" } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.posts) ? data.posts : (Array.isArray(data) ? data : []);
  } catch {
    return [];
  }
};
