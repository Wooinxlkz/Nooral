import { Router } from "express";
import { getUserId } from "../middlewares/auth";
import { db, readingLogsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { z } from "zod/v4";
import { logger } from "../lib/logger";

const router = Router();

const readingLogInputSchema = z.object({
  surahId: z.number().int().min(1).max(114),
  surahNameEn: z.string(),
  ayahCount: z.number().int().min(1).optional().default(1),
});

router.post("/", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const parsed = readingLogInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  try {
    const [row] = await db
      .insert(readingLogsTable)
      .values({ userId, ...parsed.data })
      .returning();
    return res.status(201).json(row);
  } catch (err) {
    logger.error({ err }, "Failed to log reading");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/analytics", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const allLogs = await db
      .select()
      .from(readingLogsTable)
      .where(eq(readingLogsTable.userId, userId))
      .orderBy(desc(readingLogsTable.readAt));

    // Per-day counts (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyCounts: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dailyCounts[d.toISOString().slice(0, 10)] = 0;
    }

    for (const log of allLogs) {
      const day = new Date(log.readAt).toISOString().slice(0, 10);
      if (day in dailyCounts) {
        dailyCounts[day] = (dailyCounts[day] ?? 0) + log.ayahCount;
      }
    }

    // Surah coverage — unique surahs ever read
    const surahsSeen = new Set<number>();
    for (const log of allLogs) surahsSeen.add(log.surahId);

    // Most read surahs
    const surahCounts: Record<number, { count: number; name: string }> = {};
    for (const log of allLogs) {
      if (!surahCounts[log.surahId]) surahCounts[log.surahId] = { count: 0, name: log.surahNameEn };
      surahCounts[log.surahId]!.count++;
    }
    const topSurahs = Object.entries(surahCounts)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([id, v]) => ({ surahId: parseInt(id), surahName: v.name, sessions: v.count }));

    const dailyData = Object.entries(dailyCounts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date, count }));

    return res.json({
      totalSessions: allLogs.length,
      surahsRead: surahsSeen.size,
      surahIds: Array.from(surahsSeen),
      dailyData,
      topSurahs,
    });
  } catch (err) {
    logger.error({ err }, "Failed to get reading analytics");
    return res.status(500).json({ error: "Internal server error" });
  }
});

/* GET /reading-logs/heatmap?year=2026 — full-year activity for heatmap */
router.get("/heatmap", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const year = req.query.year ? parseInt(String(req.query.year)) : new Date().getFullYear();
  const startDate = new Date(`${year}-01-01T00:00:00Z`);
  const endDate   = new Date(`${year + 1}-01-01T00:00:00Z`);

  try {
    const rows = await db
      .select({
        day: sql<string>`to_char(${readingLogsTable.readAt} AT TIME ZONE 'UTC', 'YYYY-MM-DD')`,
        count: sql<number>`sum(${readingLogsTable.ayahCount})::int`,
      })
      .from(readingLogsTable)
      .where(
        sql`${readingLogsTable.userId} = ${userId}
          AND ${readingLogsTable.readAt} >= ${startDate}
          AND ${readingLogsTable.readAt} < ${endDate}`
      )
      .groupBy(sql`to_char(${readingLogsTable.readAt} AT TIME ZONE 'UTC', 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(${readingLogsTable.readAt} AT TIME ZONE 'UTC', 'YYYY-MM-DD')`);

    return res.json(rows.map(r => ({ date: r.day, count: Number(r.count) })));
  } catch (err) {
    logger.error({ err }, "Failed to get reading heatmap");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
