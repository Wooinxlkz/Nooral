import { Router } from "express";
import { getUserId } from "../middlewares/auth";
import { db, pinnedVersesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { z } from "zod/v4";
import { logger } from "../lib/logger";

const router = Router();

const pinnedVerseInputSchema = z.object({
  surahId: z.number().int().min(1).max(114),
  ayahNumber: z.number().int().min(1),
  surahNameEn: z.string(),
  surahNameAr: z.string().optional(),
  ayahText: z.string().optional(),
  translation: z.string().optional(),
});

router.get("/", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const rows = await db
      .select()
      .from(pinnedVersesTable)
      .where(eq(pinnedVersesTable.userId, userId))
      .orderBy(pinnedVersesTable.createdAt);
    return res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to get pinned verses");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const parsed = pinnedVerseInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  try {
    const existing = await db
      .select()
      .from(pinnedVersesTable)
      .where(eq(pinnedVersesTable.userId, userId));

    if (existing.length >= 10) {
      return res.status(400).json({ error: "Maximum 10 pinned verses reached" });
    }

    const [row] = await db
      .insert(pinnedVersesTable)
      .values({ userId, ...parsed.data })
      .returning();
    return res.status(201).json(row);
  } catch (err) {
    logger.error({ err }, "Failed to pin verse");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  try {
    await db
      .delete(pinnedVersesTable)
      .where(and(eq(pinnedVersesTable.id, id), eq(pinnedVersesTable.userId, userId)));
    return res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to unpin verse");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
