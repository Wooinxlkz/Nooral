import { Router } from "express";
import { getUserId } from "../middlewares/auth";
import { db, ayahMoodsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { z } from "zod/v4";
import { logger } from "../lib/logger";

const router = Router();

const VALID_MOODS = ["peace", "reflection", "gratitude", "awe", "hope"] as const;

const moodInputSchema = z.object({
  surahId: z.number().int().min(1),
  ayahNumber: z.number().int().min(1),
  mood: z.enum(VALID_MOODS),
});

router.get("/", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const surahId = req.query.surahId ? parseInt(req.query.surahId as string, 10) : undefined;
  const ayahNumber = req.query.ayahNumber ? parseInt(req.query.ayahNumber as string, 10) : undefined;
  try {
    let rows = await db.select().from(ayahMoodsTable).where(eq(ayahMoodsTable.userId, userId));
    if (surahId) rows = rows.filter(r => r.surahId === surahId);
    if (ayahNumber) rows = rows.filter(r => r.ayahNumber === ayahNumber);
    return res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to get moods");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const parsed = moodInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  try {
    const existing = await db.select().from(ayahMoodsTable).where(
      and(
        eq(ayahMoodsTable.userId, userId),
        eq(ayahMoodsTable.surahId, parsed.data.surahId),
        eq(ayahMoodsTable.ayahNumber, parsed.data.ayahNumber),
      )
    );
    if (existing.length > 0) {
      const [row] = await db.update(ayahMoodsTable)
        .set({ mood: parsed.data.mood })
        .where(eq(ayahMoodsTable.id, existing[0].id))
        .returning();
      return res.json(row);
    }
    const [row] = await db.insert(ayahMoodsTable)
      .values({ userId, ...parsed.data })
      .returning();
    return res.status(201).json(row);
  } catch (err) {
    logger.error({ err }, "Failed to save mood");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  try {
    await db.delete(ayahMoodsTable).where(and(eq(ayahMoodsTable.id, id), eq(ayahMoodsTable.userId, userId)));
    return res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to delete mood");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
