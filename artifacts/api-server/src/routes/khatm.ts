import { Router } from "express";
import { getUserId } from "../middlewares/auth";
import { db, khatmHistoryTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod/v4";
import { logger } from "../lib/logger";

const router = Router();

const khatmInputSchema = z.object({
  reciterUsed: z.string().optional(),
});

router.get("/", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const rows = await db.select().from(khatmHistoryTable)
      .where(eq(khatmHistoryTable.userId, userId))
      .orderBy(desc(khatmHistoryTable.completedAt));
    return res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to get khatm history");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const parsed = khatmInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  try {
    const [row] = await db.insert(khatmHistoryTable)
      .values({ userId, reciterUsed: parsed.data.reciterUsed ?? null })
      .returning();
    return res.status(201).json(row);
  } catch (err) {
    logger.error({ err }, "Failed to log khatm");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
