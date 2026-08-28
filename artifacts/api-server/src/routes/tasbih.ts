import { Router } from "express";
import { getUserId } from "../middlewares/auth";
import { db, tasbihTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod/v4";
import { logger } from "../lib/logger";

const router = Router();

const tasbihInputSchema = z.object({
  dhikrPhrase: z.string().min(1),
  count: z.number().int().min(1),
});

router.get("/", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const rows = await db
      .select()
      .from(tasbihTable)
      .where(eq(tasbihTable.userId, userId))
      .orderBy(desc(tasbihTable.createdAt))
      .limit(50);
    return res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to get tasbih history");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const parsed = tasbihInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  try {
    const [row] = await db
      .insert(tasbihTable)
      .values({ userId, ...parsed.data })
      .returning();
    return res.status(201).json(row);
  } catch (err) {
    logger.error({ err }, "Failed to save tasbih session");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
