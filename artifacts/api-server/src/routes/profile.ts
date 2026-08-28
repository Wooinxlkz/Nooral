import { Router } from "express";
import { getUserId } from "../middlewares/auth";
import {
  db,
  usersTable,
  bookmarksTable,
  notesTable,
  hardAyahsTable,
  memorizationTable,
  khatmHistoryTable,
  streaksTable,
  ayahMoodsTable,
  collectionsTable,
  pinnedVersesTable,
} from "@workspace/db";
import { eq, and, count } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/me", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt.toISOString(),
      lastSeenAt: user.lastSeenAt.toISOString(),
    });
  } catch (err) {
    logger.error({ err }, "Failed to get profile/me");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/stats", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const [
      bookmarkRows,
      noteRows,
      hardAyahRows,
      masteredRows,
      khatmRows,
      streakRows,
      moodRows,
      collectionRows,
      pinnedRows,
    ] = await Promise.all([
      db.select({ c: count() }).from(bookmarksTable).where(eq(bookmarksTable.userId, userId)),
      db.select({ c: count() }).from(notesTable).where(eq(notesTable.userId, userId)),
      db.select({ c: count() }).from(hardAyahsTable).where(and(eq(hardAyahsTable.userId, userId))),
      db.select({ c: count() }).from(memorizationTable).where(and(eq(memorizationTable.userId, userId), eq(memorizationTable.memorized, true))),
      db.select({ c: count() }).from(khatmHistoryTable).where(eq(khatmHistoryTable.userId, userId)),
      db.select().from(streaksTable).where(eq(streaksTable.userId, userId)).limit(1),
      db.select({ c: count() }).from(ayahMoodsTable).where(eq(ayahMoodsTable.userId, userId)),
      db.select({ c: count() }).from(collectionsTable).where(eq(collectionsTable.userId, userId)),
      db.select({ c: count() }).from(pinnedVersesTable).where(eq(pinnedVersesTable.userId, userId)),
    ]);

    const totalBookmarks = bookmarkRows[0]?.c ?? 0;
    const totalNotes = noteRows[0]?.c ?? 0;
    const totalHardAyahs = hardAyahRows[0]?.c ?? 0;
    const totalMastered = masteredRows[0]?.c ?? 0;
    const totalKhatm = khatmRows[0]?.c ?? 0;
    const currentStreak = streakRows[0]?.currentStreak ?? 0;
    const longestStreak = streakRows[0]?.longestStreak ?? 0;
    const totalMoods = moodRows[0]?.c ?? 0;
    const totalCollections = collectionRows[0]?.c ?? 0;
    const totalPinnedVerses = pinnedRows[0]?.c ?? 0;

    const badges = [
      {
        id: "first_bookmark",
        title: "First Bookmark",
        description: "Bookmark your first verse",
        earned: Number(totalBookmarks) >= 1,
        earnedAt: Number(totalBookmarks) >= 1 ? new Date().toISOString() : null,
      },
      {
        id: "bookmark_collector",
        title: "Bookmark Collector",
        description: "Save 25 bookmarks",
        earned: Number(totalBookmarks) >= 25,
        earnedAt: Number(totalBookmarks) >= 25 ? new Date().toISOString() : null,
      },
      {
        id: "first_note",
        title: "First Reflection",
        description: "Write your first note on a verse",
        earned: Number(totalNotes) >= 1,
        earnedAt: Number(totalNotes) >= 1 ? new Date().toISOString() : null,
      },
      {
        id: "journal_keeper",
        title: "Journal Keeper",
        description: "Write 10 notes",
        earned: Number(totalNotes) >= 10,
        earnedAt: Number(totalNotes) >= 10 ? new Date().toISOString() : null,
      },
      {
        id: "hundred_notes",
        title: "100 Reflections",
        description: "Write 100 notes on verses",
        earned: Number(totalNotes) >= 100,
        earnedAt: Number(totalNotes) >= 100 ? new Date().toISOString() : null,
      },
      {
        id: "streak_3",
        title: "3-Day Streak",
        description: "Read for 3 consecutive days",
        earned: Number(currentStreak) >= 3 || Number(longestStreak) >= 3,
        earnedAt: Number(longestStreak) >= 3 ? new Date().toISOString() : null,
      },
      {
        id: "streak_7",
        title: "7-Day Streak",
        description: "Read for 7 consecutive days",
        earned: Number(currentStreak) >= 7 || Number(longestStreak) >= 7,
        earnedAt: Number(longestStreak) >= 7 ? new Date().toISOString() : null,
      },
      {
        id: "streak_30",
        title: "30-Day Streak",
        description: "Read for 30 consecutive days",
        earned: Number(currentStreak) >= 30 || Number(longestStreak) >= 30,
        earnedAt: Number(longestStreak) >= 30 ? new Date().toISOString() : null,
      },
      {
        id: "hifz_start",
        title: "Hifz Begins",
        description: "Memorize your first surah",
        earned: Number(totalMastered) >= 1,
        earnedAt: Number(totalMastered) >= 1 ? new Date().toISOString() : null,
      },
      {
        id: "hifz_100",
        title: "100 Ayahs Memorized",
        description: "Memorize 100 ayahs",
        earned: Number(totalMastered) >= 100,
        earnedAt: Number(totalMastered) >= 100 ? new Date().toISOString() : null,
      },
      {
        id: "first_khatm",
        title: "First Khatm",
        description: "Complete the Quran once",
        earned: Number(totalKhatm) >= 1,
        earnedAt: Number(totalKhatm) >= 1 ? new Date().toISOString() : null,
      },
      {
        id: "khatm_3",
        title: "3 Khatms",
        description: "Complete the Quran three times",
        earned: Number(totalKhatm) >= 3,
        earnedAt: Number(totalKhatm) >= 3 ? new Date().toISOString() : null,
      },
      {
        id: "mood_tagger",
        title: "Mood Tagger",
        description: "Tag 5 verses with a mood",
        earned: Number(totalMoods) >= 5,
        earnedAt: Number(totalMoods) >= 5 ? new Date().toISOString() : null,
      },
      {
        id: "collector",
        title: "Collector",
        description: "Create your first collection",
        earned: Number(totalCollections) >= 1,
        earnedAt: Number(totalCollections) >= 1 ? new Date().toISOString() : null,
      },
    ];

    return res.json({
      totalBookmarks: Number(totalBookmarks),
      totalNotes: Number(totalNotes),
      totalHardAyahs: Number(totalHardAyahs),
      totalMastered: Number(totalMastered),
      totalKhatm: Number(totalKhatm),
      currentStreak: Number(currentStreak),
      longestStreak: Number(longestStreak),
      totalMoods: Number(totalMoods),
      totalCollections: Number(totalCollections),
      totalPinnedVerses: Number(totalPinnedVerses),
      badges,
    });
  } catch (err) {
    logger.error({ err }, "Failed to get profile stats");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
