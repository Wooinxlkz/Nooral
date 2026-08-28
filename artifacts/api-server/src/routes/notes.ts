import { Router } from "express";
import { getUserId } from "../middlewares/auth";
import { db, notesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { z } from "zod/v4";
import { logger } from "../lib/logger";

const router = Router();

const noteInputSchema = z.object({
  surahId: z.number().int().min(1),
  ayahNumber: z.number().int().min(1),
  surahNameEn: z.string().optional(),
  content: z.string().min(1),
});

const noteUpdateSchema = z.object({
  content: z.string().min(1),
});

router.get("/", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const surahId = req.query.surahId ? parseInt(req.query.surahId as string, 10) : undefined;
  try {
    let query = db.select().from(notesTable).where(eq(notesTable.userId, userId));
    const rows = await query.orderBy(notesTable.updatedAt);
    const result = surahId ? rows.filter(r => r.surahId === surahId) : rows;
    return res.json(result);
  } catch (err) {
    logger.error({ err }, "Failed to get notes");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const parsed = noteInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  try {
    const [row] = await db
      .insert(notesTable)
      .values({ userId, ...parsed.data })
      .returning();
    return res.status(201).json(row);
  } catch (err) {
    logger.error({ err }, "Failed to create note");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const parsed = noteUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  try {
    const [row] = await db
      .update(notesTable)
      .set({ content: parsed.data.content })
      .where(and(eq(notesTable.id, id), eq(notesTable.userId, userId)))
      .returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.json(row);
  } catch (err) {
    logger.error({ err }, "Failed to update note");
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
      .delete(notesTable)
      .where(and(eq(notesTable.id, id), eq(notesTable.userId, userId)));
    return res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to delete note");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
