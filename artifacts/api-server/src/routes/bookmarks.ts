import { Router } from "express";
import { getUserId } from "../middlewares/auth";
import { db, bookmarksTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { z } from "zod/v4";
import { logger } from "../lib/logger";

const router = Router();

const bookmarkInputSchema = z.object({
  surahId: z.number().int().min(1),
  ayahNumber: z.number().int().min(1),
  surahNameEn: z.string(),
  surahNameAr: z.string().optional(),
  ayahText: z.string().optional(),
});

router.get("/", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const rows = await db
      .select()
      .from(bookmarksTable)
      .where(eq(bookmarksTable.userId, userId))
      .orderBy(bookmarksTable.createdAt);
    return res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to get bookmarks");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const parsed = bookmarkInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  try {
    const [row] = await db
      .insert(bookmarksTable)
      .values({ userId, ...parsed.data })
      .returning();
    return res.status(201).json(row);
  } catch (err) {
    logger.error({ err }, "Failed to create bookmark");
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
      .delete(bookmarksTable)
      .where(and(eq(bookmarksTable.id, id), eq(bookmarksTable.userId, userId)));
    return res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to delete bookmark");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
