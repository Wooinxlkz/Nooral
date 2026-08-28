import { Router } from "express";
import { getUserId } from "../middlewares/auth";
import { db, lastReadTable, streaksTable, readingGoalsTable, goalProgressTable, memorizationTable, hardAyahsTable, notesTable } from "@workspace/db";
import { eq, and, lte, desc, gte } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

const TOTAL_AYAHS = 6236;

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

router.get("/", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const today = todayStr();
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const [
      lastReadRows,
      streakRows,
      goalRows,
      progressRows,
      memorizedRows,
      hardDueRows,
      recentNotes,
      last30DaysProgress,
    ] = await Promise.all([
      db.select().from(lastReadTable).where(eq(lastReadTable.userId, userId)),
      db.select().from(streaksTable).where(eq(streaksTable.userId, userId)),
      db.select().from(readingGoalsTable).where(eq(readingGoalsTable.userId, userId)),
      db.select().from(goalProgressTable).where(and(eq(goalProgressTable.userId, userId), eq(goalProgressTable.date, today))),
      db.select().from(memorizationTable).where(and(eq(memorizationTable.userId, userId), eq(memorizationTable.memorized, true))),
      db.select().from(hardAyahsTable).where(and(eq(hardAyahsTable.userId, userId), lte(hardAyahsTable.nextReviewDate, now))),
      db.select().from(notesTable).where(eq(notesTable.userId, userId)).orderBy(desc(notesTable.updatedAt)).limit(5),
      db.select().from(goalProgressTable).where(and(eq(goalProgressTable.userId, userId), gte(goalProgressTable.date, thirtyDaysAgo))),
    ]);

    const lastRead = lastReadRows[0] ?? null;
    const streak = streakRows[0]
      ? { currentStreak: streakRows[0].currentStreak, longestStreak: streakRows[0].longestStreak, lastReadDate: streakRows[0].lastReadDate }
      : { currentStreak: 0, longestStreak: 0, lastReadDate: null };

    const goalProgress = progressRows[0] ?? {
      id: 0,
      userId,
      date: today,
      amountRead: 0,
      goalMet: false,
    };

    const totalMemorized = memorizedRows.length;
    const memorizationOverview = {
      totalMemorized,
      totalAyahs: TOTAL_AYAHS,
      percentage: parseFloat(((totalMemorized / TOTAL_AYAHS) * 100).toFixed(2)),
    };

    const activeDays = last30DaysProgress.filter(p => p.amountRead > 0);
    const avgDailyAyahs = activeDays.length > 0
      ? activeDays.reduce((sum, p) => sum + p.amountRead, 0) / activeDays.length
      : 0;
    const remainingAyahs = TOTAL_AYAHS - totalMemorized;
    const estimatedDaysToFinish = avgDailyAyahs > 0
      ? Math.ceil(remainingAyahs / avgDailyAyahs)
      : null;

    return res.json({
      lastRead,
      streak,
      goalProgress,
      memorizationOverview,
      hardAyahsDueToday: hardDueRows.length,
      recentNotes,
      avgDailyAyahs: parseFloat(avgDailyAyahs.toFixed(1)),
      estimatedDaysToFinish,
    });
  } catch (err) {
    logger.error({ err }, "Failed to get dashboard");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
