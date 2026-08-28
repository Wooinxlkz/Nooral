import { Router } from "express";
import { getUserId } from "../middlewares/auth";
import { db, readingGoalsTable, goalProgressTable, streaksTable } from "@workspace/db";
import { eq, and, gte, desc } from "drizzle-orm";
import { z } from "zod/v4";
import { logger } from "../lib/logger";

const router = Router();

const goalInputSchema = z.object({
  goalType: z.enum(["ayahs", "pages", "juz"]),
  targetAmount: z.number().int().min(1),
});

const goalProgressInputSchema = z.object({
  amountRead: z.number().int().min(0),
});

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

router.get("/", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const [row] = await db
      .select()
      .from(readingGoalsTable)
      .where(eq(readingGoalsTable.userId, userId));
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.json(row);
  } catch (err) {
    logger.error({ err }, "Failed to get goal");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const parsed = goalInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  try {
    const existing = await db
      .select()
      .from(readingGoalsTable)
      .where(eq(readingGoalsTable.userId, userId));
    let row;
    if (existing.length > 0) {
      [row] = await db
        .update(readingGoalsTable)
        .set(parsed.data)
        .where(eq(readingGoalsTable.userId, userId))
        .returning();
    } else {
      [row] = await db
        .insert(readingGoalsTable)
        .values({ userId, ...parsed.data })
        .returning();
    }
    return res.json(row);
  } catch (err) {
    logger.error({ err }, "Failed to save goal");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/progress", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const cutoffStr = cutoff.toISOString().split("T")[0];
    const rows = await db
      .select()
      .from(goalProgressTable)
      .where(and(eq(goalProgressTable.userId, userId), gte(goalProgressTable.date, cutoffStr)))
      .orderBy(desc(goalProgressTable.date));
    return res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to get goal progress history");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/progress", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const parsed = goalProgressInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  try {
    const today = todayStr();
    const [goal] = await db
      .select()
      .from(readingGoalsTable)
      .where(eq(readingGoalsTable.userId, userId));

    const goalMet = goal ? parsed.data.amountRead >= goal.targetAmount : false;

    const existing = await db
      .select()
      .from(goalProgressTable)
      .where(and(eq(goalProgressTable.userId, userId), eq(goalProgressTable.date, today)));

    let row;
    if (existing.length > 0) {
      [row] = await db
        .update(goalProgressTable)
        .set({ amountRead: parsed.data.amountRead, goalMet })
        .where(eq(goalProgressTable.id, existing[0].id))
        .returning();
    } else {
      [row] = await db
        .insert(goalProgressTable)
        .values({ userId, date: today, amountRead: parsed.data.amountRead, goalMet })
        .returning();
    }

    // Update streak if goal met
    if (goalMet) {
      const [streak] = await db.select().from(streaksTable).where(eq(streaksTable.userId, userId));
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (!streak) {
        await db.insert(streaksTable).values({
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastReadDate: today,
        });
      } else {
        const isConsecutive = streak.lastReadDate === yesterdayStr || streak.lastReadDate === today;
        const newCurrent = isConsecutive && streak.lastReadDate !== today ? streak.currentStreak + 1 : streak.lastReadDate === today ? streak.currentStreak : 1;
        const newLongest = Math.max(newCurrent, streak.longestStreak);
        await db
          .update(streaksTable)
          .set({ currentStreak: newCurrent, longestStreak: newLongest, lastReadDate: today })
          .where(eq(streaksTable.userId, userId));
      }
    }

    return res.json(row);
  } catch (err) {
    logger.error({ err }, "Failed to record goal progress");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
