import { Router } from "express";
import { getUserId } from "../middlewares/auth";
import { db, streaksTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const [row] = await db
      .select()
      .from(streaksTable)
      .where(eq(streaksTable.userId, userId));
    if (!row) {
      return res.json({ currentStreak: 0, longestStreak: 0, lastReadDate: null });
    }
    return res.json({
      currentStreak: row.currentStreak,
      longestStreak: row.longestStreak,
      lastReadDate: row.lastReadDate,
    });
  } catch (err) {
    logger.error({ err }, "Failed to get streak");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
