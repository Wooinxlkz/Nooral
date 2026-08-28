/* Non-component exports for surah-filter — kept in a separate file
   so surah-filter.tsx only exports React components and Vite Fast
   Refresh can work properly. */

import { HIZB_MAP } from "@/lib/quran-api";

export const SURAH_JUZ: Record<number, number> = {
  1:1, 2:1, 3:3, 4:4, 5:6, 6:7, 7:8, 8:9, 9:10, 10:11,
  11:11, 12:12, 13:13, 14:13, 15:14, 16:14, 17:15, 18:15, 19:16, 20:16,
  21:17, 22:17, 23:18, 24:18, 25:18, 26:19, 27:19, 28:20, 29:20, 30:21,
  31:21, 32:21, 33:21, 34:22, 35:22, 36:22, 37:23, 38:23, 39:23, 40:24,
  41:24, 42:25, 43:25, 44:25, 45:25, 46:26, 47:26, 48:26, 49:26, 50:26,
  51:26, 52:27, 53:27, 54:27, 55:27, 56:27, 57:27, 58:28, 59:28, 60:28,
  61:28, 62:28, 63:28, 64:28, 65:28, 66:28, 67:29, 68:29, 69:29, 70:29,
  71:29, 72:29, 73:29, 74:29, 75:29, 76:29, 77:29, 78:30, 79:30, 80:30,
  81:30, 82:30, 83:30, 84:30, 85:30, 86:30, 87:30, 88:30, 89:30, 90:30,
  91:30, 92:30, 93:30, 94:30, 95:30, 96:30, 97:30, 98:30, 99:30, 100:30,
  101:30, 102:30, 103:30, 104:30, 105:30, 106:30, 107:30, 108:30, 109:30, 110:30,
  111:30, 112:30, 113:30, 114:30,
};

export const SAJDA_SURAHS = new Set([7,13,16,17,19,22,25,27,32,38,41,53,84,96]);

export enum QuranFilterType {
  REVELATION = "Revelation",
  LENGTH     = "Length",
  JUZ        = "Juz",
  PAGES      = "Pages",
  SAJDA      = "Has Sajda",
}

export enum FilterOperator {
  IS     = "is",
  IS_NOT = "is not",
}

export type QuranFilter = {
  id: string;
  type: QuranFilterType;
  operator: FilterOperator;
  value: string[];
};

export interface QuranSurah {
  id: number;
  name_simple: string;
  name_arabic: string;
  verses_count: number;
  revelation_place: string;
  pages?: [number, number];
  translated_name?: { name: string };
}

export function applySurahFilters(surahs: QuranSurah[], filters: QuranFilter[]): QuranSurah[] {
  const activeFilters = filters.filter(f => f.value.length > 0);
  if (activeFilters.length === 0) return surahs;

  return surahs.filter(surah => {
    for (const f of activeFilters) {
      const isNot = f.operator === FilterOperator.IS_NOT;
      let matches = false;

      if (f.type === QuranFilterType.REVELATION) {
        const place = surah.revelation_place?.toLowerCase() ?? "";
        matches = f.value.some(v => v.toLowerCase() === place);
      } else if (f.type === QuranFilterType.LENGTH) {
        const count = surah.verses_count;
        matches = f.value.some(v => {
          if (v.startsWith("Short"))  return count <= 20;
          if (v.startsWith("Medium")) return count >= 21 && count <= 99;
          if (v.startsWith("Long"))   return count >= 100;
          return false;
        });
      } else if (f.type === QuranFilterType.JUZ) {
        const juz = SURAH_JUZ[surah.id];
        matches = f.value.some(v => {
          const n = parseInt(v.replace("Juz ", ""), 10);
          return n === juz;
        });
      } else if (f.type === QuranFilterType.PAGES) {
        const pageCount = surah.pages ? surah.pages[1] - surah.pages[0] + 1 : 0;
        matches = f.value.some(v => {
          if (v.startsWith("Short"))  return pageCount <= 5;
          if (v.startsWith("Medium")) return pageCount >= 6 && pageCount <= 15;
          if (v.startsWith("Long"))   return pageCount >= 16;
          return false;
        });
      } else if (f.type === QuranFilterType.SAJDA) {
        const hasSajda = SAJDA_SURAHS.has(surah.id);
        matches = f.value.includes("Yes") ? hasSajda : f.value.includes("No") ? !hasSajda : false;
      }

      if (isNot ? matches : !matches) return false;
    }
    return true;
  });
}

// Re-export HIZB_MAP so surah-filter.tsx can import from one place
export { HIZB_MAP };
