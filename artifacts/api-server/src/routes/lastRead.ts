import { Router } from "express";
import { getUserId } from "../middlewares/auth";
import { db, lastReadTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { logger } from "../lib/logger";

const router = Router();

const lastReadInputSchema = z.object({
  surahId: z.number().int().min(1),
  ayahNumber: z.number().int().min(1),
  surahNameEn: z.string().optional(),
});

router.get("/", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const [row] = await db
      .select()
      .from(lastReadTable)
      .where(eq(lastReadTable.userId, userId));
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.json(row);
  } catch (err) {
    logger.error({ err }, "Failed to get last read");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const parsed = lastReadInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  try {
    const existing = await db
      .select()
      .from(lastReadTable)
      .where(eq(lastReadTable.userId, userId));

    let row;
    if (existing.length > 0) {
      [row] = await db
        .update(lastReadTable)
        .set(parsed.data)
        .where(eq(lastReadTable.userId, userId))
        .returning();
    } else {
      [row] = await db
        .insert(lastReadTable)
        .values({ userId, ...parsed.data })
        .returning();
    }
    return res.json(row);
  } catch (err) {
    logger.error({ err }, "Failed to save last read");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
