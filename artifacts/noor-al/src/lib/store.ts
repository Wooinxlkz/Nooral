import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lang } from '@/lib/i18n';

type Theme = 'light' | 'dark' | 'sepia';
export type Language = Lang;
export type Reciter = string;

interface AppState {
  theme: Theme;
  setTheme: (theme: Theme) => void;

  hasPickedLanguage: boolean;
  setHasPickedLanguage: (v: boolean) => void;

  language: Language;
  setLanguage: (lang: Language) => void;

  arabicFont: string;
  setArabicFont: (font: string) => void;

  arabicFontSize: number;
  setArabicFontSize: (size: number) => void;

  translationFontSize: number;
  setTranslationFontSize: (size: number) => void;

  showTransliteration: boolean;
  setShowTransliteration: (show: boolean) => void;

  showWordByWord: boolean;
  setShowWordByWord: (show: boolean) => void;

  activeTranslations: number[];
  setTranslations: (ids: number[]) => void;

  activeReciter: Reciter;
  setReciter: (id: Reciter) => void;

  readerLayout: 'stacked' | 'side-by-side';
  setReaderLayout: (layout: 'stacked' | 'side-by-side') => void;

  lastRead: { surahId: number; ayahNumber: number } | null;
  setLastRead: (surahId: number, ayahNumber: number) => void;

  audioSurahId: number | null;
  setAudioSurahId: (id: number | null) => void;

  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;

  playbackSpeed: 0.75 | 1 | 1.25 | 1.5;
  setPlaybackSpeed: (speed: 0.75 | 1 | 1.25 | 1.5) => void;

  audioCurrentAyah: number | null;
  setAudioCurrentAyah: (ayah: number | null) => void;

  audioActiveWordPos: number | null;
  setAudioActiveWordPos: (pos: number | null) => void;

  surahDisplayModes: Record<number, 'ayah' | 'full' | 'tafsir'>;
  setSurahDisplayMode: (surahId: number, mode: 'ayah' | 'full' | 'tafsir') => void;

  tafsirSourceId: number;
  setTafsirSourceId: (id: number) => void;

  prayerMethod: number;
  setPrayerMethod: (method: number) => void;

  dailyGoalTarget: number;
  setDailyGoalTarget: (target: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),

      hasPickedLanguage: false,
      setHasPickedLanguage: (hasPickedLanguage) => set({ hasPickedLanguage }),

      language: 'en',
      setLanguage: (language) => set({ language }),

      arabicFont: 'scheherazade',
      setArabicFont: (arabicFont) => set({ arabicFont }),

      arabicFontSize: 32,
      setArabicFontSize: (arabicFontSize) => set({ arabicFontSize }),

      translationFontSize: 16,
      setTranslationFontSize: (translationFontSize) => set({ translationFontSize }),

      showTransliteration: false,
      setShowTransliteration: (showTransliteration) => set({ showTransliteration }),

      showWordByWord: false,
      setShowWordByWord: (showWordByWord) => set({ showWordByWord }),

      activeTranslations: [131],
      setTranslations: (activeTranslations) => set({ activeTranslations }),

      activeReciter: '7',
      setReciter: (activeReciter) => set({ activeReciter }),

      readerLayout: 'stacked',
      setReaderLayout: (readerLayout) => set({ readerLayout }),

      lastRead: null,
      setLastRead: (surahId, ayahNumber) => set({ lastRead: { surahId, ayahNumber } }),

      audioSurahId: null,
      setAudioSurahId: (audioSurahId) => set({ audioSurahId }),

      isPlaying: false,
      setIsPlaying: (isPlaying) => set({ isPlaying }),

      playbackSpeed: 1,
      setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),

      audioCurrentAyah: null,
      setAudioCurrentAyah: (audioCurrentAyah) => set({ audioCurrentAyah }),

      audioActiveWordPos: null,
      setAudioActiveWordPos: (audioActiveWordPos) => set({ audioActiveWordPos }),

      surahDisplayModes: {},
      setSurahDisplayMode: (surahId, mode) =>
        set((state) => ({ surahDisplayModes: { ...state.surahDisplayModes, [surahId]: mode } })),

      tafsirSourceId: 169,
      setTafsirSourceId: (tafsirSourceId) => set({ tafsirSourceId }),

      prayerMethod: 2,
      setPrayerMethod: (prayerMethod) => set({ prayerMethod }),

      dailyGoalTarget: 20,
      setDailyGoalTarget: (dailyGoalTarget) => set({ dailyGoalTarget }),
    }),
    {
      name: 'nooral-storage',
      // Migrate old single-translation key → array
      migrate: (persisted: any) => {
        if (persisted && persisted.activeTranslation && !persisted.activeTranslations) {
          persisted.activeTranslations = [parseInt(persisted.activeTranslation) || 131];
          delete persisted.activeTranslation;
        }
        return persisted;
      },
      version: 2,
    }
  )
);
